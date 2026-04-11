import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabaseServer'
import { estimateBenefits } from '@/lib/benefitsDb'
import type { ScanData } from '@/lib/types'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' })

// ─── Inline analysis (mirrors /api/analyze logic) ─────────────────────────
async function buildReport(scanData: ScanData & { _plan?: string }) {
  // Lazy-import prompts/builder from the analyze route module
  // We re-use the same logic to keep a single source of truth.
  const mod = await import('@/app/api/analyze/route')
  // The route module doesn't export helpers, so we call the route handler directly.
  // Instead, duplicate the minimal logic here using the same AI call pattern.

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const preCalc = estimateBenefits(scanData)
  const lockedAmounts = Object.fromEntries(
    preCalc.programs.map(p => [p.program_id, { min: p.monthly_min, max: p.monthly_max }])
  )

  const isStudent = scanData._plan === 'student'
    || scanData.residenceStatus === 'international_student'
    || scanData.employment === 'student'

  // Build the user prompt (same as analyze route)
  const incomeLabel =
    scanData.income === 'no_income' ? 'No job income (grants/DUO only)' :
    scanData.income === 'under_500' ? 'Under €500/mo (small bijbaan)' :
    scanData.income ?? 'unknown'

  const userLines = [
    `Country: Netherlands`,
    `Residence status: ${scanData.residenceStatus ?? 'unknown'}`,
    `Employment: ${scanData.employment ?? 'unknown'}`,
    `Monthly net income: ${incomeLabel}`,
    `Household: ${scanData.household ?? 'alone'}`,
    scanData.dutchHealthInsurance !== undefined
      ? `Has Dutch basic health insurance: ${scanData.dutchHealthInsurance ? 'Yes' : 'No'}`
      : '',
    scanData.enrolledAtDutchInstitution !== undefined
      ? `Enrolled at Dutch institution: ${scanData.enrolledAtDutchInstitution ? 'Yes' : 'No'}`
      : '',
    scanData.studentLivesAway !== undefined
      ? `Lives away from parents: ${scanData.studentLivesAway ? 'Yes' : 'No'}`
      : '',
    scanData.housing
      ? `Housing: ${scanData.housing.type}${scanData.housing.rent ? `, rent ${scanData.housing.rent}` : ''}`
      : '',
    scanData.children
      ? `Children: ${scanData.children.count}, paid childcare: ${scanData.children.paidChildcare}`
      : '',
    scanData.jobLossReason
      ? `Job loss reason: ${scanData.jobLossReason}`
      : '',
    scanData.workedSixMonths !== undefined
      ? `Worked 26+ weeks: ${scanData.workedSixMonths}`
      : '',
  ].filter(Boolean)

  const lockedSection = Object.keys(lockedAmounts).length > 0
    ? `\n\nPRE-CALCULATED AMOUNTS — use these EXACT numbers:\n${
        Object.entries(lockedAmounts).map(([id, { min, max }]) => `- ${id}: €${min}–€${max}/mo`).join('\n')
      }`
    : ''

  const systemPrompt = isStudent ? STUDENT_SYSTEM_PROMPT : WORKER_SYSTEM_PROMPT

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: `Please analyse this person's benefit eligibility:\n\n${userLines.join('\n')}${lockedSection}` }],
  })

  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') throw new Error('No AI response')

  const raw = textBlock.text
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
  const result = JSON.parse(raw)

  result.eligible_programs = result.eligible_programs.map((p: { program_id: string; estimated_monthly_min: number; estimated_monthly_max: number }) => {
    const calc = lockedAmounts[p.program_id]
    if (calc) { p.estimated_monthly_min = calc.min; p.estimated_monthly_max = calc.max }
    return p
  })
  result.total_monthly_min = preCalc.total_min
  result.total_monthly_max = preCalc.total_max

  return result
}

// ─── Minimal prompts (kept in sync with analyze/route.ts) ─────────────────
const WORKER_SYSTEM_PROMPT = `You are an expert Dutch benefits eligibility advisor for the Netherlands, 2025/2026 rules. Analyse the user profile and return ONLY valid JSON with this structure: { "eligible_programs": [{ "program_id": string, "program_name": string, "country": "NL", "eligibility_status": "likely_eligible"|"possibly_eligible"|"check_manually", "estimated_monthly_min": number, "estimated_monthly_max": number, "explanation": string, "application_url": string, "key_conditions_met": string[], "caveats": string }], "ineligible_programs": [{ "program_id": string, "program_name": string, "reason_ineligible": string }], "total_monthly_min": number, "total_monthly_max": number, "summary": string }. Use program_ids: zorgtoeslag, huurtoeslag, kinderopvangtoeslag, kindgebonden_budget, kinderbijslag, ww_uitkering, bijstandsuitkering. Use the pre-calculated amounts exactly as given.`

const STUDENT_SYSTEM_PROMPT = `You are a Dutch student benefits advisor. Check only: duo_studiefinanciering, ov_studentenkaart, zorgtoeslag. Mark all others as ineligible with "Not in student package". Return ONLY valid JSON matching: { "eligible_programs": [...], "ineligible_programs": [...], "total_monthly_min": number, "total_monthly_max": number, "summary": string }. For OV-kaart use estimated_monthly_min: 0, estimated_monthly_max: 0. Use pre-calculated amounts exactly.`

// ─── Webhook handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== 'paid') return NextResponse.json({ received: true })

  const { plan, scan_data: scanDataB64 } = session.metadata ?? {}
  const email = session.customer_email ?? session.customer_details?.email ?? ''

  if (!scanDataB64) {
    console.error('Webhook: no scan_data metadata for session', session.id)
    return NextResponse.json({ received: true })
  }

  try {
    const scanData: ScanData & { _plan?: string } = {
      ...JSON.parse(Buffer.from(scanDataB64, 'base64').toString('utf8')),
      _plan: plan ?? 'full',
    }

    const result = await buildReport(scanData)

    const supabase = createClient()
    const { data: saved, error } = await supabase
      .from('scan_results')
      .insert({
        user_id: null,
        email: email || null,
        country: scanData.country ?? 'NL',
        scan_data: scanData,
        result,
        stripe_session_id: session.id,
      })
      .select('id')
      .single()

    if (error) throw error

    if (email && saved?.id) {
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
      fetch(`${base}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reportId: saved.id, result }),
      }).catch(() => null)
    }

    console.log('Webhook: report saved', saved?.id, 'for session', session.id)
  } catch (err) {
    console.error('Webhook: failed to process', session.id, err)
  }

  return NextResponse.json({ received: true })
}

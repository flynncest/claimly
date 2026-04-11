import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { AnalysisResult, ScanData } from '@/lib/types'

const FACTCHECK_SYSTEM_PROMPT = `You are an independent fact-checker reviewing AI-generated Dutch and Belgian government benefits eligibility results. Your job is to verify each eligible program's determination against official 2025/2026 rules.

## NETHERLANDS PROGRAMS — OFFICIAL 2025/2026 RULES

### Zorgtoeslag (Healthcare Allowance)
- Age 18+, Dutch basisverzekering required, resident in NL
- Income thresholds: Singles ≤ €38,520/year; Partners combined ≤ €48,224/year
- Amount: €89–€123/month
- Source: Dutch Government — https://www.government.nl/topics/health-insurance/applying-for-healthcare-benefit

### Huurtoeslag (Rent Benefit)
- Age 18+, renting (not owning), rent €315–€808.06/month
- Income thresholds: Singles < €31,340/year; Partners/co-tenants < €42,436/year
- Amount: €50–€400/month
- Source: Belastingdienst — https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/huurtoeslag-aanvragen

### Kinderopvangtoeslag (Childcare Benefit)
- Child in registered paid childcare, child under 13, parent(s) working/studying
- Both parents must have qualifying activity (work/study) in two-parent households
- Amount: €200–€1,500+/month (income-dependent, low incomes get up to 96% covered)
- Source: Belastingdienst — https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/kinderopvangtoeslag-aanvragen

### Kindgebonden Budget (Child Supplement)
- 1+ children under 18, income below threshold
- Single parent max ~€36,546/year; two parents max ~€55,000/year (gradual reduction)
- Amount: ~€125–€270/month per child (higher for single parents)
- Source: Belastingdienst — https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/kindgebonden-budget

### WW-uitkering (Unemployment Benefit)
- Worked 26 of last 36 weeks, lost job involuntarily, registered UWV, available for work
- Duration: 3–24 months
- Amount: 75% of daily wage (first 2 months), then 70% (capped)
- Source: UWV — https://www.uwv.nl/nl/aanvragen/uitkering-aanvragen/ww-uitkering-aanvragen

### Bijstandsuitkering (Social Assistance)
- Last resort — legal NL residence, 18+, income below social minimum, all other income/assets depleted
- EU citizens after 5 years or with work history; non-EU with valid permit
- Amount: ~€1,187/month (couples), ~€870/month (singles)
- Source: Rijksoverheid — https://www.rijksoverheid.nl/onderwerpen/bijstand/aanvragen

## BELGIUM PROGRAMS — OFFICIAL 2025/2026 RULES

### RVA/ONEM (Unemployment Benefit)
- Registered unemployed, sufficient work history (18-35: 312 working days in 21 months), lost job involuntarily, available for work
- Amount: 65% of previous gross wage (capped, reducing over time)
- Source: RVA — https://www.rva.be/nl/burger/uitkeringen/aanvraag-uitkering

### OCMW/CPAS (Social Assistance)
- Last resort, legal BE residence, insufficient income, 18+
- EU citizens need 3+ months residence or work history; non-EU need valid permit
- Amount: ~€1,034/month (alone), ~€1,379/month (family)
- Source: OCMW-info — https://www.ocmw-info-cpas.be

### Groeipakket (Child Benefits — Flanders)
- Child living in Flanders, child under 25 (if studying), residing in Belgium
- Universal — no income test for base amount
- Amount: €163/month per child (varies by rank and age)
- Source: Groeipakket — https://www.groeipakket.be

## YOUR TASK

For each eligible program in the provided analysis, verify:
1. Is the eligibility status (likely_eligible / possibly_eligible / check_manually) appropriate for this user's profile?
2. Are the estimated monthly amounts within the documented ranges above?
3. Are there any factual errors, inconsistencies, or important missing caveats?

## OUTPUT FORMAT

Respond ONLY with valid JSON. No markdown, no preamble. Use this exact structure:

{
  "program_id": {
    "verified": true,
    "confidence": "high",
    "flags": [],
    "source_name": "Belastingdienst",
    "source_url": "https://www.belastingdienst.nl/..."
  }
}

Rules:
- verified: true if eligibility determination and amounts are correct; false if there is a clear factual error
- confidence: "high" (criteria clearly met, amounts correct), "medium" (reasonable but some uncertainty), "low" (questionable determination or conflicting data)
- flags: array of specific, brief concerns (max 2 items); empty array if none
- source_name / source_url: the official government source for this program
- Include one entry for every program_id in the eligible_programs list`

export async function POST(req: NextRequest) {
  try {
    const body: { analysis: AnalysisResult; scanData: ScanData } = await req.json()
    const { analysis, scanData } = body

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    if (!analysis?.eligible_programs?.length) {
      return NextResponse.json({})
    }

    const programList = analysis.eligible_programs
      .map(
        (p) =>
          `- program_id: "${p.program_id}", program: "${p.program_name}", status: "${p.eligibility_status}", amounts: €${p.estimated_monthly_min}–€${p.estimated_monthly_max}/mo`
      )
      .join('\n')

    const userMessage = `User profile:
Country: ${scanData.country}
Residence: ${scanData.residenceStatus}
Employment: ${scanData.employment}
Income: ${scanData.income}
Household: ${scanData.household}
${scanData.children ? `Children: ${scanData.children.count === '4plus' ? '4+' : scanData.children.count}, paid childcare: ${scanData.children.paidChildcare}` : ''}
${scanData.housing ? `Housing: ${scanData.housing.type}${scanData.housing.rent ? `, rent: ${scanData.housing.rent}` : ''}` : ''}

Eligible programs to fact-check:
${programList}

Please verify each of these eligibility determinations.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-0',
      max_tokens: 2048,
      system: FACTCHECK_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI')
    }

    const raw = textBlock.text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    const result = JSON.parse(raw)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Factcheck API error:', err)
    return NextResponse.json({}, { status: 500 })
  }
}

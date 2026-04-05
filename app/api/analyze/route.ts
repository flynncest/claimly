import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { ScanData } from '@/lib/types'

const SYSTEM_PROMPT = `You are an expert benefits eligibility advisor specialising in Dutch government benefit programs. You have deep knowledge of the 2025/2026 eligibility rules for all major Netherlands programs.

Your task is to analyse a user's profile and determine which benefit programs they qualify for. Be accurate and conservative — only mark "likely_eligible" when you have high confidence. Use "possibly_eligible" for borderline cases. Use "check_manually" when eligibility cannot be determined from the intake.

## RESIDENCE STATUS GUIDE

- dutch_national: Dutch citizen — all benefits fully available
- eu_eea_citizen: EU/EEA citizen with free movement — eligible for all NL benefits once registered at municipality; Zorgtoeslag requires Dutch health insurance (basisverzekering)
- highly_skilled_migrant: Kennismigrant permit holder — eligible for all NL benefits if conditions met; typically higher income so check thresholds carefully
- international_student: Student visa/residence — eligible for Zorgtoeslag only if working ≥8 hrs/week and paying Dutch health insurance; NOT eligible for Huurtoeslag, WW, or Bijstand in most cases
- work_permit: Other non-EU work permit — eligible for most benefits; Bijstandsuitkering restricted for first 5 years unless continuous lawful residence
- family_reunification: Partner/family visa — eligible for benefits if conditions met; depends on own work history for WW
- other_permit: Assess conservatively; use "possibly_eligible" unless clearly eligible

## NETHERLANDS PROGRAMS (2025/2026 OFFICIAL RULES)

### 1. Zorgtoeslag (Healthcare Allowance)
- Eligibility: Age 18+, paying Dutch health insurance (basisverzekering), registered in Netherlands
- Income thresholds (2025): Singles up to €38,520/year net (€3,210/mo); Partners combined up to €48,224/year (€4,019/mo)
- CALCULATE A SPECIFIC AMOUNT based on their income — do not just give a range. Use linear interpolation:
  · €800/mo net  → €123/mo
  · €1,000/mo    → €118/mo
  · €1,250/mo    → €111/mo
  · €1,500/mo    → €99/mo
  · €1,750/mo    → €88/mo
  · €2,000/mo    → €74/mo
  · €2,200/mo    → €63/mo
  · €2,500/mo    → €45/mo
  · €2,750/mo    → €30/mo
  · €3,000/mo    → €14/mo
  · €3,200/mo    → €3/mo (near cutoff)
  · Above €3,210/mo: NOT eligible (single); couple threshold €4,019/mo
- Set estimated_monthly_min and estimated_monthly_max within ±5 of the calculated figure (tight range)
- CRITICAL: Do NOT give €123 for incomes above €1,000/mo
- Application: https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/zorgtoeslag

### 2. Huurtoeslag (Rent Benefit)
- Eligibility: Age 18+, renting independent living space (not subletting a room), NOT owning home
- Rent range (2025): €315–€808.06/month (above liberalisation threshold = ineligible)
- Income thresholds (2025): Singles under €31,340/year (€2,612/mo); Partners under €42,436/year (€3,536/mo)
- International students: generally NOT eligible (must have independent rental contract)
- CALCULATE A SPECIFIC AMOUNT based on their income and rent. Formula: benefit = basishuur_component - income_reduction
  · Rent €500–€808 + income €1,000/mo  → ~€340/mo
  · Rent €500–€808 + income €1,500/mo  → ~€210/mo
  · Rent €500–€808 + income €2,000/mo  → ~€130/mo
  · Rent €500–€808 + income €2,200/mo  → ~€90/mo
  · Rent €500–€808 + income €2,500/mo  → ~€55/mo
  · Rent under €500 + income €1,500/mo → ~€160/mo
  · Rent under €500 + income €2,000/mo → ~€90/mo
  · Rent over €808: NOT eligible
- Give a tight estimated_monthly_min / max within ±15 of the calculated figure
- Application: https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/huurtoeslag

### 3. Kinderopvangtoeslag (Childcare Benefit)
- Eligibility: Child in registered paid childcare, both parents working/studying/on integration course, child under 13
- Applies to: dagopvang (daycare), BSO (after-school care), gastouderopvang (foster care)
- Max hourly rate covered (2025): €10.44 for dagopvang/BSO
- Coverage: 96% of costs (lowest income) down to 33% (highest income)
- Amount typically: €200–€1,500+/month depending on childcare costs and income
- Application: https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/kinderopvangtoeslag

### 4. Kindgebonden Budget (Child Supplement)
- Eligibility: 1+ children under 18, receiving kinderbijslag, income below threshold
- Income thresholds (2025): Singles up to €36,546/year (€3,045/mo); couples up to ~€55,000/year (€4,583/mo)
- Amount per child (2025): €125–€270/month; single parents get ~35–40% more
- Automatically assessed alongside kinderbijslag (child benefit)
- Application: https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/kindgebonden-budget

### 5. WW-uitkering (Unemployment Benefit)
- Eligibility: Worked ≥26 of last 36 weeks before unemployment (week requirement), registered at UWV as job seeker, lost job involuntarily or contract ended, available for work, residing in NL
- EU citizens and non-EU with work permit eligible; international students typically NOT eligible
- Duration: 3–24 months depending on work history
- Amount: 75% of last daily wage for first 2 months, then 70% (max daily wage €256.54 in 2025 = max ~€5,640/mo gross)
- Estimate from net income: multiply net by ~1.4 to estimate gross, then take 70–75%
- Application: https://www.uwv.nl/particulieren/uitkeringen/ww

### 6. Bijstandsuitkering (Social Assistance — Participatiewet)
- Last resort only — applicant must have depleted all other income/assets first
- Eligibility: Legal residence in NL, 18+, income and assets below social minimum, actively seeking work
  · EU citizens: eligible after 5 years lawful residence OR with sufficient work history in NL
  · Non-EU: valid continuous residence permit required; not available in first 5 years for most permit types
  · International students: NOT eligible
- Amount (2025): ~€1,187/month (couples/families), ~€870/month (singles)
- Applied for at your municipality (gemeente), not centrally
- Application: https://www.rijksoverheid.nl/onderwerpen/bijstand

## OUTPUT FORMAT

Respond ONLY with valid JSON. No markdown, no preamble. Use this exact structure:

{
  "eligible_programs": [
    {
      "program_id": "string",
      "program_name": "string (English name — Dutch name)",
      "country": "NL",
      "eligibility_status": "likely_eligible" | "possibly_eligible" | "check_manually",
      "estimated_monthly_min": number,
      "estimated_monthly_max": number,
      "explanation": "2-sentence plain English explanation of why they qualify and what amount to expect",
      "application_url": "string",
      "key_conditions_met": ["condition 1", "condition 2"],
      "caveats": "important note or empty string"
    }
  ],
  "ineligible_programs": [
    {
      "program_id": "string",
      "program_name": "string",
      "reason_ineligible": "brief plain English reason"
    }
  ],
  "total_monthly_min": number,
  "total_monthly_max": number,
  "summary": "One paragraph summary of the person's situation and top findings"
}

Rules:
- Always include ALL 6 NL programs in either eligible or ineligible
- ALWAYS calculate a specific amount from their income — never just say "up to €X". Use the lookup tables above and interpolate.
- estimated_monthly_min and estimated_monthly_max should be within ±10 of each other (e.g. 68–78, not 63–123)
- For "prefer not to say" income: use "possibly_eligible" and give mid-range estimate
- Keep explanations specific — state the calculated amount and why, e.g. "Based on your income of ~€2,200/mo, you qualify for approximately €63/mo"
- Mention the income used for the calculation in the explanation`

const STUDENT_SYSTEM_PROMPT = `You are a benefits advisor for international students in the Netherlands. Only analyse the 3 student-specific programs.

For students, check ONLY these 3 programs:

1. DUO Studiefinanciering (student finance)
   - Eligible if enrolled at an accredited Dutch institution (MBO/HBO/WO)
   - EU/EEA students can apply after working 32+ hrs/week alongside study OR after living in NL for 5 years
   - Non-EU students with a valid residence permit studying in NL may qualify for the OV-kaart only
   - Basisbeurs (basic grant): ~€287–478/mo depending on living situation (living with or away from parents)
   - Aanvullende beurs (supplementary grant): up to ~€620/mo based on parents' income
   - Combined total can reach up to €1,100/mo in the most favourable case
   - Application URL: https://duo.nl/particulier/student-hbo-of-universiteit/

2. OV-studentenkaart (public transport pass)
   - Free train/bus travel in the Netherlands (weekdays OR weekends, student chooses)
   - Included with DUO studiefinanciering for eligible students
   - Non-EU students NOT qualifying for basisbeurs typically cannot get the OV-kaart
   - Report as "Free travel" (value ~€100–150/mo retail equivalent)
   - Application URL: https://duo.nl/particulier/student-hbo-of-universiteit/ov-studentenkaart/

3. Zorgtoeslag (healthcare allowance)
   - Eligible if paying Dutch basisverzekering (most students in NL do)
   - Amount depends on income bracket:
     * Under €1,000/mo: €118–123/month
     * €1,000–1,500/mo: €105–118/month
     * €1,500–2,000/mo: €88–105/month
     * €2,000–2,500/mo: €63–88/month
     * €2,500–3,000/mo: €28–63/month
     * Above €3,000/mo: likely not eligible
   - Application URL: https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/zorgtoeslag

Mark all other programs (Huurtoeslag, Kinderopvangtoeslag, Kindgebonden Budget, WW-uitkering, Bijstandsuitkering) as ineligible with the reason "Not in student package — use Expat plan to check".

Respond ONLY with valid JSON matching this exact structure:
{
  "eligible_programs": [{ "program_id": "string", "program_name": "string", "country": "NL", "eligibility_status": "likely_eligible"|"possibly_eligible"|"check_manually", "estimated_monthly_min": number, "estimated_monthly_max": number, "explanation": "string", "application_url": "string", "key_conditions_met": ["string"], "caveats": "string" }],
  "ineligible_programs": [{ "program_id": "string", "program_name": "string", "reason_ineligible": "string" }],
  "total_monthly_min": number,
  "total_monthly_max": number,
  "summary": "string"
}

Use program_id values: "duo_studiefinanciering", "ov_studentenkaart", "zorgtoeslag", "huurtoeslag", "kinderopvangtoeslag", "kindgebonden_budget", "ww_uitkering", "bijstandsuitkering".
For OV-kaart, use estimated_monthly_min: 0, estimated_monthly_max: 0 (it is free travel, not cash).`

function deriveHousehold(data: ScanData): string {
  if (data.household) return data.household
  if (data.partnerLivingWithYou && (data.hasChildren || data.children)) return 'two_parents'
  if (data.partnerLivingWithYou) return 'partner_no_kids'
  if (data.hasChildren || data.children) return 'single_parent'
  return 'alone'
}

function buildUserPrompt(data: ScanData): string {
  const lines: string[] = [
    `Country: Netherlands`,
    `Residence status: ${data.residenceStatus ?? 'unknown'}`,
    `Employment: ${data.employment ?? 'unknown'}`,
    `Monthly net income: ${data.income ?? 'unknown'}`,
    `Household: ${deriveHousehold(data)}`,
  ]

  // Partner
  if (data.partnerLivingWithYou !== undefined) {
    lines.push(`Partner living at same address: ${data.partnerLivingWithYou ? 'Yes' : 'No'}`)
  }
  if (data.partnerEmployed !== undefined) {
    lines.push(`Partner employed: ${data.partnerEmployed ? 'Yes' : 'No'}`)
  }
  if (data.partnerIncome) {
    lines.push(`Partner monthly net income: ${data.partnerIncome}`)
  }

  // Children
  if (data.hasChildren === false) {
    lines.push(`Children under 18: None`)
  } else if (data.hasChildren || data.children) {
    if (data.children?.count) {
      lines.push(`Number of children under 18: ${data.children.count === '4plus' ? '4+' : data.children.count}`)
    }
    if (data.childrenAgeGroups?.length) {
      const ageLabels: Record<string, string> = { '0_4': '0–4 yrs', '4_12': '4–12 yrs', '12_18': '12–18 yrs' }
      lines.push(`Children age groups: ${data.childrenAgeGroups.map(g => ageLabels[g] ?? g).join(', ')}`)
    }
    if (data.children?.paidChildcare !== undefined) {
      lines.push(`Paid childcare (opvang): ${data.children.paidChildcare ? 'Yes' : 'No'}`)
    }
    if (data.childrenOpvangDaysPerWeek) {
      const daysLabel: Record<string, string> = { '1_2': '1–2 days/week', '3_4': '3–4 days/week', '5': '5 days/week' }
      lines.push(`Childcare days per week: ${daysLabel[data.childrenOpvangDaysPerWeek] ?? data.childrenOpvangDaysPerWeek}`)
    }
    if (data.opvangType) {
      const typeLabel: Record<string, string> = { dagopvang: 'Dagopvang (daycare)', bso: 'BSO (after-school)', both: 'Both dagopvang + BSO' }
      lines.push(`Childcare type: ${typeLabel[data.opvangType] ?? data.opvangType}`)
    }
  }

  // Housing
  if (data.housing) {
    lines.push(`Housing type: ${data.housing.type}`)
    if (data.housing.rent) {
      lines.push(`Monthly rent range: ${data.housing.rent}`)
    }
  }
  if (data.housingIsSocialHousing !== undefined) {
    lines.push(`Social housing (woningcorporatie): ${data.housingIsSocialHousing ? 'Yes' : 'No'}`)
  }

  // Health insurance
  if (data.healthInsuranceCostMonthly) {
    const costLabel: Record<string, string> = {
      under_80: 'Under €80/mo',
      '80_100': '€80–100/mo',
      '100_130': '€100–130/mo',
      over_130: 'Over €130/mo',
      no_insurance: 'No Dutch health insurance',
    }
    lines.push(`Monthly health insurance cost: ${costLabel[data.healthInsuranceCostMonthly] ?? data.healthInsuranceCostMonthly}`)
  }

  // Student-specific
  if (data.enrolledAtDutchInstitution !== undefined) {
    lines.push(`Enrolled at Dutch accredited institution (MBO/HBO/WO): ${data.enrolledAtDutchInstitution ? 'Yes' : 'No'}`)
  }
  if (data.dutchHealthInsurance !== undefined) {
    lines.push(`Has Dutch basic health insurance: ${data.dutchHealthInsurance ? 'Yes' : 'No'}`)
  }
  if (data.duoStudiefinanciering !== undefined) {
    lines.push(`Currently receiving DUO studiefinanciering: ${data.duoStudiefinanciering ? 'Yes' : 'No'}`)
  }
  if (data.bsnRegistered !== undefined) {
    lines.push(`Registered at Dutch address (BRP/gemeente): ${data.bsnRegistered ? 'Yes' : 'No'}`)
  }

  return `Please analyse this person's benefit eligibility for Netherlands programs:\n\n${lines.join('\n')}`
}

function isStudent(data: ScanData & { _plan?: string }): boolean {
  return (
    data._plan === 'student' ||
    data.residenceStatus === 'international_student' ||
    data.employment === 'student'
  )
}

export async function POST(req: NextRequest) {
  try {
    const scanData: ScanData & { _plan?: string } = await req.json()

    if (!scanData.residenceStatus && !scanData.employment && !scanData.income) {
      return NextResponse.json({ error: 'Missing profile data' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const studentMode = isStudent(scanData)
    const systemPrompt = studentMode ? STUDENT_SYSTEM_PROMPT : SYSTEM_PROMPT
    const userPrompt = buildUserPrompt(scanData)

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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
    console.error('Analyze API error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

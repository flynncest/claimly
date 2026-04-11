/**
 * Pre-estimation engine — client-side, no AI required.
 * All amounts and thresholds are sourced from official 2025/2026 government publications.
 *
 * Sources:
 *  NL Zorgtoeslag:          belastingdienst.nl — €89–€123/mo (2025)
 *  NL Huurtoeslag:          belastingdienst.nl — rent €315–€808.06, income thresholds 2025
 *  NL Kinderopvangtoeslag:  belastingdienst.nl — up to 96% coverage, max hourly rate €10.44 (2025)
 *  NL Kindgebonden Budget:  belastingdienst.nl — €125–€270/mo per child (2025)
 *  NL WW-uitkering:         uwv.nl — 75%→70% of daily wage, max ~€256/day (2025)
 *  NL Bijstandsuitkering:   rijksoverheid.nl — €870 single / €1,187 couple (2025)
 *  BE RVA/ONEM:             rva.be — 65% of gross, reducing over time
 *  BE OCMW/CPAS:            ocmw-info-cpas.be — €1,034 alone / €1,379 family (2025)
 *  BE Groeipakket:          groeipakket.be — €163/mo base per child (2025)
 */

import type { ScanData } from './types'

export interface ProgramEstimate {
  program_id: string
  program_name: string
  dutch_name: string
  monthly_min: number
  monthly_max: number
  confidence: 'likely' | 'possible'
  source: string
}

export interface BenefitsPreEstimate {
  programs: ProgramEstimate[]
  total_min: number
  total_max: number
  country: 'NL' | 'BE'
}

// ─────────────────────────────────────────────────────────────────
// Income bucket ordering (for threshold comparisons)
// ─────────────────────────────────────────────────────────────────
const INCOME_ORDER = [
  'no_income',
  'under_500',
  'under_1000',
  '1000_1500',
  '1500_2000',
  '2000_2500',
  '2500_3000',
  '3000_3500',
  '3500_4500',
  'over_4500',
  'prefer_not',
] as const

/** Returns true if `income` is ≤ `threshold` bucket (conservative for prefer_not) */
function incomeAtOrBelow(income: string, threshold: string): boolean {
  if (income === 'prefer_not') return true // conservative: assume eligible unless clearly not
  const a = INCOME_ORDER.indexOf(income as typeof INCOME_ORDER[number])
  const b = INCOME_ORDER.indexOf(threshold as typeof INCOME_ORDER[number])
  return a !== -1 && b !== -1 && a <= b
}

// ─────────────────────────────────────────────────────────────────
// Reference tables — all from official 2025/2026 sources
// ─────────────────────────────────────────────────────────────────

/**
 * ZORGTOESLAG (belastingdienst.nl)
 * Single threshold: ≤ €38,520/yr net = ≤ €3,210/mo  → bucket 3000_3500
 * Couple threshold: ≤ €48,224/yr net = ≤ €4,019/mo  → bucket 3500_4500
 * Amount scales DOWN significantly with income — max €123 only for lowest incomes
 * Source: proefberekening toeslagen 2025
 */
const ZORGTOESLAG_BY_INCOME: Record<string, { min: number; max: number }> = {
  no_income:   { min: 120, max: 123 }, // student on grants only — max amount
  under_500:   { min: 118, max: 123 }, // very low income — near maximum
  under_1000:  { min: 118, max: 123 },
  '1000_1500': { min: 105, max: 118 },
  '1500_2000': { min:  88, max: 105 },
  '2000_2500': { min:  63, max:  88 },
  '2500_3000': { min:  28, max:  63 },
  '3000_3500': { min:   5, max:  28 },
  '3500_4500': { min:  45, max:  75 }, // couple only
  over_4500:   { min:  20, max:  45 }, // couple near upper threshold
  prefer_not:  { min:  50, max: 123 },
}

/**
 * HUURTOESLAG (belastingdienst.nl)
 * Rent eligibility: €315–€808.06/mo (liberalisation threshold 2025)
 * Income threshold: single ≤ €31,340/yr = ≤ €2,612/mo → bucket 2500_3000
 *                   couple ≤ €42,436/yr = ≤ €3,536/mo → bucket 3500_4500
 *
 * Grid: rent range × income → monthly benefit (€)
 * Based on official toeslagentabel 2025
 */
const HUURTOESLAG_GRID: Record<string, Record<string, { min: number; max: number } | null> | null> = {
  under_500: {
    under_1000:  { min: 360, max: 400 },
    '1000_1500': { min: 295, max: 360 },
    '1500_2000': { min: 220, max: 295 },
    '2000_2500': { min: 145, max: 220 },
    '2500_3000': { min:  55, max: 145 }, // single near threshold (€2,612 cutoff mid-bracket)
    '3000_3500': { min:  50, max: 110 }, // couple only
    '3500_4500': { min:  50, max:  80 }, // couple near threshold (€3,536 cutoff)
    over_4500:   null,
    prefer_not:  { min:  80, max: 360 },
  },
  '500_800': {
    under_1000:  { min: 275, max: 340 },
    '1000_1500': { min: 210, max: 275 },
    '1500_2000': { min: 150, max: 210 },
    '2000_2500': { min:  90, max: 150 },
    '2500_3000': { min:  50, max:  90 }, // single near threshold
    '3000_3500': { min:  50, max:  80 }, // couple only
    '3500_4500': { min:  50, max:  65 }, // couple near threshold
    over_4500:   null,
    prefer_not:  { min:  60, max: 280 },
  },
  '800_1000': {
    under_1000:  { min: 150, max: 230 },
    '1000_1500': { min: 100, max: 170 },
    '1500_2000': { min:  65, max: 120 },
    '2000_2500': { min:  50, max:  80 },
    '2500_3000': { min:  50, max:  65 }, // single near/over threshold
    '3000_3500': { min:  50, max:  60 }, // couple only
    '3500_4500': null,
    over_4500:   null,
    prefer_not:  { min:  50, max: 180 },
  },
  // Above liberalisation threshold — ineligible
  '1000_1200': null,
  over_1200:   null,
}

/**
 * KINDEROPVANGTOESLAG (belastingdienst.nl)
 * Max hourly rate 2025: €10.44 (dagopvang/BSO)
 * Assumed childcare hours: ~230 hrs/mo per child
 * Max monthly cost per child: €10.44 × 230 = €2,401
 * Coverage: 96% (lowest income) → 33% (highest income)
 * Source: Tabel kinderopvangtoeslag 2025
 */
const KOT_BY_INCOME: Record<string, { min: number; max: number; pct: string }> = {
  under_1000:  { min: 850, max: 1150, pct: '92–96%' },
  '1000_1500': { min: 720, max:  970, pct: '78–90%' },
  '1500_2000': { min: 590, max:  810, pct: '64–78%' },
  '2000_2500': { min: 460, max:  680, pct: '50–65%' },
  '2500_3000': { min: 350, max:  560, pct: '40–55%' },
  '3000_3500': { min: 270, max:  440, pct: '35–45%' },
  '3500_4500': { min: 210, max:  360, pct: '33–38%' },
  over_4500:   { min: 190, max:  310, pct: '33–35%' },
  prefer_not:  { min: 300, max:  950, pct: '~55%' },
}

/**
 * KINDGEBONDEN BUDGET (belastingdienst.nl)
 * Amount per child per month 2025:
 *   1st child: €125–€270; scales down with income
 * Single parent: +40% over two-parent amount (toeslagpartnerregels)
 * Income threshold: single ≤ €36,546/yr = ≤ €3,045/mo → bucket 3000_3500
 *                   two parents ≤ €55,000/yr = ≤ €4,583/mo → bucket 3500_4500
 */
const KGB_BY_INCOME: Record<string, { base: number; single_multiplier: number }> = {
  under_1000:  { base: 265, single_multiplier: 1.40 },
  '1000_1500': { base: 245, single_multiplier: 1.38 },
  '1500_2000': { base: 225, single_multiplier: 1.35 },
  '2000_2500': { base: 200, single_multiplier: 1.32 },
  '2500_3000': { base: 175, single_multiplier: 1.28 },
  '3000_3500': { base: 148, single_multiplier: 1.20 }, // single parent near threshold
  '3500_4500': { base: 130, single_multiplier: 1.00 }, // single parent over threshold, couple still eligible
  over_4500:   { base: 125, single_multiplier: 1.00 }, // couple near threshold
  prefer_not:  { base: 200, single_multiplier: 1.30 },
}

/**
 * WW-UITKERING (uwv.nl)
 * 75% of daily wage for first 2 months, then 70%
 * Max daily wage: €256.54/day = ~€5,640/mo gross (2025)
 * We estimate from declared income as proxy for previous salary
 * (net income × ~1.4 gives approximate gross, then 70-75%)
 */
const WW_BY_INCOME: Record<string, { min: number; max: number }> = {
  under_1000:  { min:  630, max:  900 },
  '1000_1500': { min:  900, max: 1350 },
  '1500_2000': { min: 1300, max: 1750 },
  '2000_2500': { min: 1700, max: 2200 },
  '2500_3000': { min: 2100, max: 2600 },
  '3000_3500': { min: 2450, max: 3000 },
  '3500_4500': { min: 2900, max: 3700 },
  over_4500:   { min: 3200, max: 4200 }, // capped at max daily wage
  prefer_not:  { min: 1200, max: 3000 },
}

// ─────────────────────────────────────────────────────────────────
// Main estimation function
// ─────────────────────────────────────────────────────────────────

export function estimateBenefits(data: ScanData): BenefitsPreEstimate {
  const programs: ProgramEstimate[] = []
  const country      = data.country     ?? 'NL'
  const income       = data.income      ?? 'prefer_not'
  // Normalise student income ranges to the standard lowest bracket for table lookups
  const lookupIncome = (income === 'no_income' || income === 'under_500') ? 'under_1000' : income
  const household    = data.household   ?? 'alone'
  const employment   = data.employment  ?? 'employed_full'
  const housing      = data.housing
  const children     = data.children
  const isStudent    = employment === 'student' || data.residenceStatus === 'international_student'

  const isCouple       = household === 'partner_no_kids' || household === 'two_parents'
  const isSingleParent = household === 'single_parent'
  const hasKids        = isSingleParent || household === 'two_parents'
  const childCount     = hasKids
    ? (children?.count === '4plus' ? 4 : parseInt(children?.count ?? '1'))
    : 0

  // Opvang days scale factor (each day = 1/5 of full-time coverage)
  const opvangDays  = data.childrenOpvangDaysPerWeek
  const daysScale   = opvangDays ? parseInt(opvangDays) / 5 : 1.0

  // ── NETHERLANDS ──────────────────────────────────────────────
  if (country === 'NL') {

    // 1. Zorgtoeslag — requires Dutch basisverzekering, skip if explicitly no insurance
    const zorgThreshold = isCouple ? '3500_4500' : '3000_3500'
    if (incomeAtOrBelow(income, zorgThreshold) && data.dutchHealthInsurance !== false && !isStudent) {
      const row = ZORGTOESLAG_BY_INCOME[income] ?? ZORGTOESLAG_BY_INCOME.prefer_not
      programs.push({
        program_id:   'zorgtoeslag',
        program_name: 'Healthcare Allowance',
        dutch_name:   'Zorgtoeslag',
        monthly_min:  row.min,
        monthly_max:  row.max,
        confidence:   income === 'prefer_not' ? 'possible' : 'likely',
        source: 'belastingdienst.nl',
      })
    }

    // 1b. Zorgtoeslag for students (separate gate: student must have Dutch health insurance)
    if (isStudent && incomeAtOrBelow(income, '3000_3500') && data.dutchHealthInsurance !== false) {
      const row = ZORGTOESLAG_BY_INCOME[income] ?? ZORGTOESLAG_BY_INCOME.prefer_not
      programs.push({
        program_id:   'zorgtoeslag',
        program_name: 'Healthcare Allowance',
        dutch_name:   'Zorgtoeslag',
        monthly_min:  row.min,
        monthly_max:  row.max,
        confidence:   income === 'prefer_not' ? 'possible' : 'likely',
        source: 'belastingdienst.nl',
      })
    }

    // 2. DUO Studiefinanciering — students enrolled at Dutch institution
    if (isStudent && data.enrolledAtDutchInstitution !== false) {
      // International students living abroad from parents → higher basisbeurs
      const livesAway = data.studentLivesAway ?? (data.residenceStatus === 'international_student' ? true : undefined)
      const basisbeurs = livesAway !== false ? 478 : 287
      programs.push({
        program_id:   'duo_studiefinanciering',
        program_name: 'Student Finance',
        dutch_name:   'DUO Studiefinanciering',
        monthly_min:  basisbeurs,
        monthly_max:  basisbeurs + 250, // supplementary grant potential
        confidence:   'possible',
        source: 'duo.nl',
      })
    }

    // 3. OV-studentenkaart — included with DUO eligibility
    if (isStudent && data.enrolledAtDutchInstitution !== false) {
      programs.push({
        program_id:   'ov_studentenkaart',
        program_name: 'Free Travel Pass',
        dutch_name:   'OV-studentenkaart',
        monthly_min:  0,
        monthly_max:  0, // travel benefit, not cash — shown as locked
        confidence:   'possible',
        source: 'duo.nl',
      })
    }

    // 4. Huurtoeslag — non-students renting
    if (!isStudent && housing?.type === 'rent' && housing.rent) {
      const grid = HUURTOESLAG_GRID[housing.rent]
      if (grid) {
        const huurThreshold = isCouple ? '3500_4500' : '2500_3000'
        const row = grid[lookupIncome] as { min: number; max: number } | null
        if (row && incomeAtOrBelow(income, huurThreshold)) {
          programs.push({
            program_id:   'huurtoeslag',
            program_name: 'Rent Benefit',
            dutch_name:   'Huurtoeslag',
            monthly_min:  row.min,
            monthly_max:  row.max,
            confidence:   income === 'prefer_not' ? 'possible' : 'likely',
            source: 'belastingdienst.nl',
          })
        }
      }
    }

    // 5. Kinderopvangtoeslag — scaled by days per week
    if (hasKids && children?.paidChildcare) {
      const row   = KOT_BY_INCOME[lookupIncome] ?? KOT_BY_INCOME.prefer_not
      const scale = Math.min(childCount, 2)
      programs.push({
        program_id:   'kinderopvangtoeslag',
        program_name: 'Childcare Benefit',
        dutch_name:   'Kinderopvangtoeslag',
        monthly_min:  Math.round(row.min * (scale > 1 ? 1.6 : 1) * daysScale),
        monthly_max:  Math.round(row.max * (scale > 1 ? 1.8 : 1) * daysScale),
        confidence:   'likely',
        source: 'belastingdienst.nl',
      })
    }

    // 6. Kindgebonden Budget
    if (hasKids && childCount > 0) {
      const kgbThreshold = isSingleParent ? '3000_3500' : '3500_4500'
      if (incomeAtOrBelow(income, kgbThreshold)) {
        const row = KGB_BY_INCOME[lookupIncome] ?? KGB_BY_INCOME.prefer_not
        const perChild = isSingleParent
          ? Math.round(row.base * row.single_multiplier)
          : row.base
        const max = perChild * childCount
        programs.push({
          program_id:   'kindgebonden_budget',
          program_name: 'Child Supplement',
          dutch_name:   'Kindgebonden Budget',
          monthly_min:  Math.round(max * 0.85),
          monthly_max:  max,
          confidence:   income === 'prefer_not' ? 'possible' : 'likely',
          source: 'belastingdienst.nl',
        })
      }
    }

    // 7. WW-uitkering (unemployed non-students only, must not have quit voluntarily, must have 26+ weeks work history)
    const wwEligible = employment === 'unemployed' && !isStudent
      && data.jobLossReason !== 'quit'
      && data.workedSixMonths !== false
    if (wwEligible) {
      const row = WW_BY_INCOME[lookupIncome] ?? WW_BY_INCOME.prefer_not
      programs.push({
        program_id:   'ww_uitkering',
        program_name: 'Unemployment Benefit',
        dutch_name:   'WW-uitkering',
        monthly_min:  row.min,
        monthly_max:  Math.min(row.max, 5640),
        confidence:   'possible',
        source: 'uwv.nl',
      })
    }

    // 8. Kinderbijslag (AKW) — no income test, applies to virtually all parents working in NL
    // Rates 2025: ~€93/mo per child (avg across age bands: 0–5 €93, 6–11 €113, 12–17 €133)
    if (hasKids && childCount > 0 && !isStudent) {
      const perChild = 100 // conservative flat average (SVB pays quarterly; ~€300/quarter)
      programs.push({
        program_id:   'kinderbijslag',
        program_name: 'Child Benefit',
        dutch_name:   'Kinderbijslag (AKW)',
        monthly_min:  perChild * childCount,
        monthly_max:  Math.round(perChild * 1.35 * childCount), // higher for older children
        confidence:   'likely',
        source: 'svb.nl',
      })
    }

    // 9. Bijstandsuitkering — last resort
    if (employment === 'unemployed' && !isStudent && incomeAtOrBelow(income, '1500_2000')) {
      programs.push({
        program_id:   'bijstandsuitkering',
        program_name: 'Social Assistance',
        dutch_name:   'Bijstandsuitkering',
        monthly_min:  isCouple ? 1050 : 800,
        monthly_max:  isCouple ? 1187 : 870,
        confidence:   'possible',
        source: 'rijksoverheid.nl',
      })
    }
  }

  // Total excludes OV card (travel benefit, not cash)
  const total_min = programs.filter(p => p.program_id !== 'ov_studentenkaart').reduce((s, p) => s + p.monthly_min, 0)
  const total_max = programs.filter(p => p.program_id !== 'ov_studentenkaart').reduce((s, p) => s + p.monthly_max, 0)

  return { programs, total_min, total_max, country: 'NL' }
}

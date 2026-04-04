export type Country = 'NL' | 'BE'

export type ResidenceStatus =
  | 'dutch_national'
  | 'eu_eea_citizen'
  | 'highly_skilled_migrant'
  | 'international_student'
  | 'work_permit'
  | 'family_reunification'
  | 'other_permit'
  // legacy values kept for backwards compat
  | 'eu_citizen'
  | 'non_eu_work_permit'
  | 'national'
  | 'other'

export type EmploymentStatus =
  | 'employed_full'
  | 'employed_part'
  | 'self_employed'
  | 'unemployed'
  | 'student'
  | 'other'

export type IncomeRange =
  | 'under_1000'
  | '1000_1500'
  | '1500_2000'
  | '2000_2500'
  | '2500_3000'
  | '3000_3500'
  | '3500_4500'
  | 'over_4500'
  | 'prefer_not'

export type HouseholdType =
  | 'alone'
  | 'partner_no_kids'
  | 'single_parent'
  | 'two_parents'
  | 'other'

export type HousingType = 'rent' | 'own' | 'other'

export type RentRange =
  | 'under_500'
  | '500_800'
  | '800_1000'
  | '1000_1200'
  | 'over_1200'

export interface ChildrenData {
  count: '1' | '2' | '3' | '4plus'
  paidChildcare: boolean
}

export interface HousingData {
  type: HousingType
  rent?: RentRange
}

export interface ScanData {
  country?: Country
  residenceStatus?: ResidenceStatus
  employment?: EmploymentStatus
  income?: IncomeRange
  household?: HouseholdType
  children?: ChildrenData
  housing?: HousingData
  email?: string
  subscribeToUpdates?: boolean
}

export type EligibilityStatus =
  | 'likely_eligible'
  | 'possibly_eligible'
  | 'check_manually'

export interface EligibleProgram {
  program_id: string
  program_name: string
  country: Country
  eligibility_status: EligibilityStatus
  estimated_monthly_min: number
  estimated_monthly_max: number
  explanation: string
  application_url: string
  key_conditions_met: string[]
  caveats: string
}

export interface IneligibleProgram {
  program_id: string
  program_name: string
  reason_ineligible: string
}

export interface AnalysisResult {
  eligible_programs: EligibleProgram[]
  ineligible_programs: IneligibleProgram[]
  total_monthly_min: number
  total_monthly_max: number
  summary: string
}

export interface ProgramFactCheck {
  verified: boolean
  confidence: 'high' | 'medium' | 'low'
  flags: string[]
  source_name: string
  source_url: string
}

export type FactCheckResults = Record<string, ProgramFactCheck>

export interface SavedReport {
  id: string
  created_at: string
  email: string | null
  user_id: string | null
  country: string
  scan_data: ScanData
  result: AnalysisResult
}

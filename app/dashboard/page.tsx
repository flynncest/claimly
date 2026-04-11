import { redirect } from 'next/navigation'
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  XCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabaseServer'
import type { EligibilityStatus, SavedReport } from '@/lib/types'
import DashboardEmptyState from './DashboardEmptyState'
import UpdateAnswersButton from './UpdateAnswersButton'
import ReportSwitcher from './ReportSwitcher'

const RESIDENCE_LABELS: Record<string, string> = {
  dutch_national: 'Dutch national',
  eu_eea_citizen: 'EU / EEA citizen',
  permanent_resident: 'Permanent resident',
  highly_skilled_migrant: 'Highly Skilled Migrant (Kennismigrant)',
  international_student: 'International student',
  work_permit: 'Other work permit',
  family_reunification: 'Partner / family visa',
  other_permit: 'Other / unsure',
  eu_citizen: 'EU citizen',
  non_eu_work_permit: 'Non-EU with work permit',
  national: 'Dutch national',
  other: 'Other',
}
const EMPLOYMENT_LABELS: Record<string, string> = {
  employed_full: 'Employed (full-time)', employed_part: 'Employed (part-time)',
  self_employed: 'Self-employed / freelance', unemployed: 'Unemployed',
  student: 'Student', other: 'Other',
}
const INCOME_LABELS: Record<string, string> = {
  no_income: 'No job income (grants/DUO only)', under_500: 'Under €500/mo (bijbaan)',
  under_1000: 'Under €1,000/mo', '1000_1500': '€1,000–€1,500/mo',
  '1500_2000': '€1,500–€2,000/mo', '2000_2500': '€2,000–€2,500/mo',
  '2500_3000': '€2,500–€3,000/mo', '3000_3500': '€3,000–€3,500/mo',
  '3500_4500': '€3,500–€4,500/mo', over_4500: 'Over €4,500/mo',
  prefer_not: 'Prefer not to say',
}
const HOUSEHOLD_LABELS: Record<string, string> = {
  alone: 'Living alone', partner_no_kids: 'With partner (no kids)',
  single_parent: 'Single parent', two_parents: 'Two parents with kids', other: 'Other',
}
const HOUSING_LABELS: Record<string, string> = {
  rent: 'Renting', own: 'Owner-occupied', other: 'Other / employer housing',
}
const RENT_LABELS: Record<string, string> = {
  under_500: 'Under €500/mo', '500_800': '€500–€800/mo',
  '800_1000': '€800–€1,000/mo', '1000_1200': '€1,000–€1,200/mo', over_1200: 'Over €1,200/mo',
}

const STATUS_CONFIG: Record<EligibilityStatus, { label: string; color: string; bg: string; dot: string; icon: React.ReactNode }> = {
  likely_eligible: {
    label: 'Likely eligible',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: <CheckCircle2 size={13} className="text-emerald-600" />,
  },
  possibly_eligible: {
    label: 'Possibly eligible',
    color: 'text-brand',
    bg: 'bg-brand/8 border-brand/20',
    dot: 'bg-brand',
    icon: <AlertCircle size={13} className="text-brand" />,
  },
  check_manually: {
    label: 'Check manually',
    color: 'text-navy/50',
    bg: 'bg-navy/5 border-navy/10',
    dot: 'bg-navy/30',
    icon: <HelpCircle size={13} className="text-navy/40" />,
  },
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { reportId?: string }
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="font-serif text-2xl text-navy mb-3">Dashboard unavailable</h2>
          <p className="text-navy/55 text-sm">The dashboard requires Supabase to be configured.</p>
        </div>
      </div>
    )
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const next = searchParams.reportId
      ? `/dashboard?reportId=${searchParams.reportId}`
      : '/dashboard'
    redirect(`/login?redirect=${encodeURIComponent(next)}`)
  }

  await supabase
    .from('scan_results')
    .update({ user_id: user.id })
    .eq('email', user.email ?? '')
    .is('user_id', null)

  // Also try to catch reports saved before the user was logged in
  // (saved by email match during the anonymous pay flow)
  let { data: allReports, error: reportError } = await supabase
    .from('scan_results')
    .select('id, created_at, country, result, scan_data, name')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // If the query failed (e.g. 'name' column not yet migrated), retry without it
  if (reportError) {
    const fallback = await supabase
      .from('scan_results')
      .select('id, created_at, country, result, scan_data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allReports = (fallback.data as any) ?? null
  }

  let reports = (allReports ?? []) as SavedReport[]

  // If a specific reportId is in the URL but not yet in the list (e.g. just generated,
  // or user_id claim hasn't propagated), fetch it directly by ID and claim it.
  const activeReportId = searchParams.reportId
  if (activeReportId && !reports.find(r => r.id === activeReportId)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: directRow } = await supabase
      .from('scan_results')
      .select('id, created_at, country, result, scan_data, name')
      .eq('id', activeReportId)
      .single() as { data: (SavedReport & { user_id?: string | null }) | null }
    if (directRow) {
      // Claim it: set user_id so it appears next time too
      if (!directRow.user_id) {
        await supabase
          .from('scan_results')
          .update({ user_id: user.id })
          .eq('id', activeReportId)
      }
      reports = [directRow as SavedReport, ...reports]
    }
  }

  const report = reports.find(r => r.id === activeReportId) ?? reports[0]
  const hasReport = !!report

  const EDIT_COOLDOWN_DAYS = 30
  const reportAge = report
    ? (Date.now() - new Date(report.created_at).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity
  const canEdit = reportAge >= EDIT_COOLDOWN_DAYS
  const nextEditDate = report
    ? new Date(new Date(report.created_at).getTime() + EDIT_COOLDOWN_DAYS * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-navy/40 text-sm mb-1">Signed in as {user.email}</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-navy">Your Benefits Report</h1>
          </div>
          {hasReport && <UpdateAnswersButton canEdit={canEdit} nextEditDate={nextEditDate} />}
        </div>

        {reports.length > 0 && (
          <ReportSwitcher reports={reports} activeId={report?.id ?? ''} />
        )}

        {!hasReport ? (
          <DashboardEmptyState />
        ) : (() => {
          const result = report.result
          const sd = report.scan_data
          const date = new Date(report.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
          })
          const totalPrograms = result.eligible_programs.length + result.ineligible_programs.length

          const profileRows = [
            sd?.residenceStatus && ['Residence', RESIDENCE_LABELS[sd.residenceStatus] ?? sd.residenceStatus],
            sd?.employment && ['Employment', EMPLOYMENT_LABELS[sd.employment] ?? sd.employment],
            sd?.income && ['Income', INCOME_LABELS[sd.income] ?? sd.income],
            sd?.household && ['Household', HOUSEHOLD_LABELS[sd.household] ?? sd.household],
            sd?.housing?.type && ['Housing', sd.housing.rent
              ? `${HOUSING_LABELS[sd.housing.type]} · ${RENT_LABELS[sd.housing.rent] ?? sd.housing.rent}`
              : HOUSING_LABELS[sd.housing.type] ?? sd.housing.type,
            ],
            sd?.children?.count && ['Children', sd.children.count === '4plus' ? '4+ children' : `${sd.children.count} child${sd.children.count !== '1' ? 'ren' : ''}`],
          ].filter(Boolean) as [string, string][]

          return (
            <div className="space-y-5">
              <p className="text-navy/35 text-xs">Netherlands · AI analysis · {date}</p>

              {/* ── Stat row ─────────────────────────────── */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-card p-4 shadow-card border border-navy/5 text-center">
                  <p className="font-serif text-2xl sm:text-3xl text-brand leading-none mb-1">
                    €{result.total_monthly_max > 0 ? result.total_monthly_max : 0}
                  </p>
                  <p className="text-xs text-navy/40 leading-tight">max/month<br/>potential</p>
                </div>
                <div className="bg-white rounded-card p-4 shadow-card border border-navy/5 text-center">
                  <p className="font-serif text-2xl sm:text-3xl text-brand leading-none mb-1">
                    {result.eligible_programs.length}
                  </p>
                  <p className="text-xs text-navy/40 leading-tight">programs<br/>matched</p>
                </div>
                <div className="bg-white rounded-card p-4 shadow-card border border-navy/5 text-center">
                  <p className="font-serif text-2xl sm:text-3xl text-navy/60 leading-none mb-1">
                    {totalPrograms}
                  </p>
                  <p className="text-xs text-navy/40 leading-tight">programs<br/>checked</p>
                </div>
              </div>

              {/* ── AI summary ───────────────────────────── */}
              {result.summary && (
                <div className="bg-white rounded-card p-5 shadow-card border border-navy/5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy/35 mb-2">AI Analysis</p>
                  <p className="text-sm text-navy/65 leading-relaxed">{result.summary}</p>
                </div>
              )}

              {/* ── Your profile ─────────────────────────── */}
              {profileRows.length > 0 && (
                <div className="bg-white rounded-card border border-navy/8 overflow-hidden">
                  <p className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy/35 border-b border-navy/6">
                    Your profile
                  </p>
                  <div className="grid grid-cols-2 divide-x divide-y divide-navy/5">
                    {profileRows.map(([label, value]) => (
                      <div key={label} className="px-4 py-3">
                        <p className="text-xs text-navy/35 mb-0.5">{label}</p>
                        <p className="text-sm text-navy font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Eligible programs ────────────────────── */}
              {result.eligible_programs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy/35 mb-3 px-1">
                    Matched programs — {result.eligible_programs.length} found
                  </p>
                  <div className="space-y-3">
                    {result.eligible_programs.map((p) => {
                      const cfg = STATUS_CONFIG[p.eligibility_status]
                      return (
                        <div key={p.program_id} className="bg-white rounded-card shadow-card border border-navy/5 overflow-hidden">
                          {/* Card header */}
                          <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-navy/5">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-serif text-base text-navy leading-tight">{p.program_name}</h3>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                                  {cfg.icon}
                                  {cfg.label}
                                </span>
                              </div>
                              <p className="text-navy/55 text-sm leading-relaxed">{p.explanation}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              {p.program_id === 'ov_studentenkaart' ? (
                                <>
                                  <p className="font-serif text-xl text-brand leading-none">Eligible</p>
                                  <p className="text-xs text-navy/35 mt-0.5">free travel</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-serif text-2xl text-brand leading-none">
                                    €{p.estimated_monthly_min === p.estimated_monthly_max
                                      ? p.estimated_monthly_max
                                      : `${p.estimated_monthly_min}–${p.estimated_monthly_max}`}
                                  </p>
                                  <p className="text-xs text-navy/35 mt-0.5">/month</p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Conditions + caveats */}
                          <div className="px-5 py-3 bg-navy/[0.02]">
                            {p.key_conditions_met.length > 0 && (
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                                {p.key_conditions_met.map((c, i) => (
                                  <span key={i} className="flex items-center gap-1.5 text-xs text-navy/50">
                                    <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                                    {c}
                                  </span>
                                ))}
                              </div>
                            )}
                            {p.caveats && (
                              <p className="text-xs text-brand/80 bg-brand/6 px-3 py-1.5 rounded-lg mt-1">
                                ⚠ {p.caveats}
                              </p>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="px-5 py-3 border-t border-navy/5">
                            <a
                              href={p.application_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-brand text-sm font-medium hover:underline"
                            >
                              How to apply <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Ineligible programs ──────────────────── */}
              {result.ineligible_programs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy/35 mb-3 px-1">
                    Also checked — {result.ineligible_programs.length} not a match
                  </p>
                  <div className="space-y-2">
                    {result.ineligible_programs.map((p) => (
                      <div key={p.program_id} className="bg-white rounded-card border border-navy/5 px-5 py-4 flex items-start gap-4">
                        <div className="w-7 h-7 rounded-full bg-navy/6 flex items-center justify-center shrink-0 mt-0.5">
                          <XCircle size={14} className="text-navy/25" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-navy/70 mb-0.5">{p.program_name}</p>
                          <p className="text-xs text-navy/45 leading-relaxed">{p.reason_ineligible}</p>
                        </div>
                        <span className="shrink-0 text-xs text-navy/25 font-medium bg-navy/5 px-2 py-0.5 rounded-full mt-0.5">
                          Not eligible
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Footer note ──────────────────────────── */}
              <p className="text-center text-xs text-navy/25 pb-4 leading-relaxed">
                AI-verified · 2025/2026 Dutch government rules · Always confirm before applying
              </p>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

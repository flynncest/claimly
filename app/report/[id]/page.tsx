import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  TrendingUp,
} from 'lucide-react'
import { createClient } from '@/lib/supabaseServer'
import type { EligibilityStatus, SavedReport } from '@/lib/types'

const STATUS_CONFIG: Record<EligibilityStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  likely_eligible: {
    label: 'Likely Eligible',
    color: 'text-brand',
    bg: 'bg-brand/8',
    icon: <CheckCircle2 size={13} className="text-brand" />,
  },
  possibly_eligible: {
    label: 'Possibly Eligible',
    color: 'text-brand',
    bg: 'bg-brand/8',
    icon: <AlertCircle size={13} className="text-brand" />,
  },
  check_manually: {
    label: 'Check Manually',
    color: 'text-navy/50',
    bg: 'bg-navy/6',
    icon: <HelpCircle size={13} className="text-navy/40" />,
  },
}

export default async function ReportPage({ params }: { params: { id: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen bg-[#E8DFD0] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="font-serif text-2xl text-navy mb-3">Report unavailable</h2>
          <p className="text-navy/55 text-sm mb-6">Online reports require Supabase to be configured.</p>
          <Link href="/scan" className="btn-primary bg-brand text-white px-5 py-2.5 rounded-input text-sm font-medium">
            Run a new scan
          </Link>
        </div>
      </div>
    )
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('scan_results')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) notFound()

  const report = data as SavedReport
  const result = report.result
  const date = new Date(report.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-[#E8DFD0] min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-navy/40 text-sm mb-1">{date}</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy">Your Benefits Report</h1>
          <p className="text-navy/45 text-sm mt-1">{report.country === 'NL' ? 'Netherlands' : 'Belgium'}</p>
        </div>

        {/* Total estimate banner */}
        {result.total_monthly_max > 0 ? (
          <div className="bg-[#C8BFB0] rounded-card p-6 mb-8 border border-navy/8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-brand/70" />
              <p className="text-navy/55 text-sm">You may be eligible for up to</p>
            </div>
            <p className="font-serif text-4xl sm:text-5xl text-brand mb-2">
              €{result.total_monthly_max}
              <span className="text-2xl text-navy/35">/month</span>
            </p>
            <p className="text-navy/45 text-xs">
              Conservative estimate: €{result.total_monthly_min}/mo · Based on your answers
            </p>
          </div>
        ) : (
          <div className="bg-brand/8 border border-brand/15 rounded-card p-5 mb-8">
            <p className="text-brand text-sm">
              Based on your answers, we didn&apos;t find clear eligibility for standard benefit programs right now.
            </p>
          </div>
        )}

        {/* Summary */}
        {result.summary && (
          <div className="bg-white rounded-card p-5 shadow-card mb-6 border border-navy/5">
            <p className="text-sm text-navy/65 leading-relaxed">{result.summary}</p>
          </div>
        )}

        {/* Eligible programs */}
        {result.eligible_programs.length > 0 && (
          <div className="space-y-4 mb-6">
            <h2 className="font-serif text-xl text-navy">
              Programs you likely qualify for ({result.eligible_programs.length})
            </h2>
            {result.eligible_programs.map((p) => {
              const cfg = STATUS_CONFIG[p.eligibility_status]
              return (
                <div key={p.program_id} className="bg-white rounded-card p-6 shadow-card border border-navy/5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-serif text-lg text-navy leading-tight">{p.program_name}</h3>
                    <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon}
                      {cfg.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-serif text-2xl text-brand">
                      €{p.estimated_monthly_min}–€{p.estimated_monthly_max}
                    </span>
                    <span className="text-navy/50 text-sm">/month</span>
                  </div>
                  <p className="text-navy/65 text-sm leading-relaxed mb-3">{p.explanation}</p>
                  {p.key_conditions_met.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {p.key_conditions_met.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-navy/55">
                          <CheckCircle2 size={11} className="text-brand shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.caveats && (
                    <p className="text-xs text-brand bg-brand/8 px-3 py-2 rounded-lg mb-3">
                      <strong>Note:</strong> {p.caveats}
                    </p>
                  )}
                  <a
                    href={p.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand text-sm font-medium hover:underline"
                  >
                    How to Apply <ExternalLink size={13} />
                  </a>
                </div>
              )
            })}
          </div>
        )}

        {/* Ineligible programs */}
        {result.ineligible_programs.length > 0 && (
          <div className="bg-white rounded-card border border-navy/8 mb-10">
            <p className="px-5 py-4 text-sm font-medium text-navy/50 border-b border-navy/6">
              Programs checked but not matched ({result.ineligible_programs.length})
            </p>
            <div className="divide-y divide-navy/5">
              {result.ineligible_programs.map((p) => (
                <div key={p.program_id} className="px-5 py-3.5 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy/20 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-navy/70">{p.program_name}</p>
                    <p className="text-xs text-navy/40 mt-0.5">{p.reason_ineligible}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save account CTA */}
        <div className="bg-[#C8BFB0] rounded-card p-7 mb-8 border border-navy/8">
          <h3 className="font-serif text-xl text-navy mb-2">Save this report to your account</h3>
          <p className="text-navy/55 text-sm leading-relaxed mb-5">
            Create a free account to save your results, get alerts when eligibility rules change, and track your applications.
          </p>
          <Link
            href={`/login?redirect=/report/${params.id}`}
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white text-sm font-medium px-5 py-2.5 rounded-input"
          >
            Create free account
          </Link>
        </div>

        {/* Run new scan */}
        <div className="text-center pb-4">
          <Link href="/scan" className="text-sm text-navy/50 hover:text-navy underline">
            Run a new scan
          </Link>
        </div>

        <p className="text-center text-xs text-navy/30 mt-6 leading-relaxed">
          These results are estimates based on your answers and 2025/2026 eligibility rules.
          Always verify with official government sources before applying.
        </p>
      </div>
    </div>
  )
}

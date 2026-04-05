'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Lock, CheckCircle2, ArrowRight } from 'lucide-react'
import type { BenefitsPreEstimate } from '@/lib/benefitsDb'

export default function ResultsPage() {
  const router = useRouter()
  const [estimate, setEstimate] = useState<BenefitsPreEstimate | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('claimly_estimate')
    if (!raw) {
      router.push('/scan')
      return
    }
    setEstimate(JSON.parse(raw))
  }, [router])

  if (!estimate) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-[#E8DFD0] min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="fade-up mb-8">
          <p className="text-navy/40 text-sm mb-1">{today}</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy">
            Your Benefits Estimate
          </h1>
          <p className="text-navy/50 text-sm mt-2">
            Based on your answers · 2025/2026 rules · No AI yet
          </p>
        </div>

        {/* Total estimate banner */}
        {estimate.total_max > 0 ? (
          <div className="fade-up bg-[#C8BFB0] rounded-card p-6 mb-8 border border-navy/8" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-brand/70" />
              <p className="text-navy/55 text-sm">Estimated monthly total</p>
            </div>
            <p className="font-serif text-4xl sm:text-5xl text-brand mb-2">
              €{estimate.total_min}–€{estimate.total_max}
              <span className="text-2xl text-navy/35">/month</span>
            </p>
            <p className="text-navy/45 text-xs">
              Based on your answers · Exact per-program amounts in your full report
            </p>
          </div>
        ) : (
          <div className="fade-up bg-brand/6 border border-brand/20 rounded-card p-5 mb-8" style={{ animationDelay: '0.1s' }}>
            <p className="text-brand text-sm">
              Standard programs may not apply — but an AI-verified check can find edge cases and less obvious benefits.
            </p>
          </div>
        )}

        {/* Program list — teaser only, no amounts */}
        {estimate.programs.length > 0 && (
          <div className="fade-up mb-6" style={{ animationDelay: '0.15s' }}>
            <h2 className="font-serif text-xl text-navy mb-1">
              {estimate.programs.length} program{estimate.programs.length > 1 ? 's' : ''} you likely qualify for
            </h2>
            <p className="text-navy/45 text-sm mb-4">Exact amounts calculated in your full report</p>
            <div className="space-y-2.5">
              {estimate.programs.map((p) => (
                <div
                  key={p.program_id}
                  className="bg-white rounded-card px-5 py-4 shadow-card border border-navy/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-brand shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-navy">{p.program_name}</p>
                      <p className="text-xs text-navy/40">{p.dutch_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Lock size={12} className="text-navy/30" />
                    <span className="text-xs text-navy/30 font-medium">Amount locked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paywall — locked full report */}
        <div className="fade-up bg-white rounded-card border border-navy/10 overflow-hidden mb-8 shadow-card" style={{ animationDelay: '0.2s' }}>
          {/* Blurred preview */}
          <div className="relative px-5 py-5 border-b border-navy/8">
            <div className="blur-sm pointer-events-none select-none space-y-3">
              {[
                { label: 'Detailed eligibility breakdown', width: 'w-3/4' },
                { label: 'Step-by-step application links', width: 'w-2/3' },
                { label: 'Conditions met & caveats', width: 'w-1/2' },
                { label: 'AI-verified confidence score', width: 'w-2/3' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-brand/20 shrink-0" />
                  <div className={`h-3 bg-navy/10 rounded ${item.width}`} />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 border border-navy/10 rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
                <Lock size={14} className="text-brand" />
                <span className="text-sm font-medium text-navy">Full report locked</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-6">
            <h3 className="font-serif text-xl text-navy mb-2">
              Unlock your full AI-verified report
            </h3>
            <p className="text-navy/55 text-sm leading-relaxed mb-5">
              See the exact monthly amount for each program, why you qualify, and a direct link to apply on the official Dutch government site.
            </p>

            <div className="space-y-3">
              {[
                'Exact income-based amounts per program',
                'Step-by-step application instructions',
                'Why you qualify (or don\'t) — explained in English',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-navy/70">
                  <CheckCircle2 size={14} className="text-brand shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/login?redirect=/pay&mode=signup"
                className="btn-primary inline-flex items-center gap-2 bg-brand text-white text-sm font-medium px-6 py-3 rounded-input"
              >
                Create account & unlock <ArrowRight size={15} />
              </Link>
              <Link
                href="/login?redirect=/pay"
                className="inline-flex items-center gap-2 border border-navy/20 text-navy text-sm font-medium px-5 py-3 rounded-input hover:bg-navy/5 transition-colors"
              >
                Already have an account?
              </Link>
            </div>

            <p className="text-xs text-navy/35 mt-4">
              No charge until you confirm. Cancel anytime.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-navy/30 mt-6 leading-relaxed">
          Estimates are based on your answers and 2025/2026 eligibility rules. Always verify with official government sources before applying.
        </p>
      </div>
    </div>
  )
}

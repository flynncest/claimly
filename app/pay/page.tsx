'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const PLAN_DETAILS = {
  student: {
    name: 'Student Report',
    price: '€13.99',
    features: [
      'DUO Studiefinanciering eligibility check',
      'OV-studentenkaart (train pass) check',
      'Healthcare allowance (Zorgtoeslag) check',
      'Step-by-step application guide',
    ],
  },
  full: {
    name: 'Benefits Report',
    price: '€19.99',
    features: [
      'All 6 Dutch benefit programs checked',
      'Income-based calculations for your situation',
      'Step-by-step application guides',
      'Conditions met & reasons explained',
      'Priority email support',
    ],
  },
}

export default function PayPage() {
  const [plan, setPlan] = useState<'student' | 'full'>('full')
  const [hasScanData, setHasScanData] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedPlan = localStorage.getItem('dutchclaim_scan_plan') as 'student' | 'full' | null
    if (savedPlan === 'student' || savedPlan === 'full') {
      setPlan(savedPlan)
    } else {
      const raw = localStorage.getItem('dutchclaim_scan_data')
      if (raw) {
        const sd = JSON.parse(raw)
        if (sd.residenceStatus === 'international_student' || sd.employment === 'student') {
          setPlan('student')
        }
      }
    }
    setHasScanData(!!localStorage.getItem('dutchclaim_scan_data'))
  }, [])

  const handleUnlock = async () => {
    setError('')
    const raw = localStorage.getItem('dutchclaim_scan_data')
    if (!raw) { setHasScanData(false); return }

    setLoading(true)
    try {
      // Get user email if logged in
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const scanData = JSON.parse(raw)
      const email = user?.email ?? scanData.email ?? ''

      // Encode scan data for Stripe metadata (max 500 chars per value — we base64 it)
      const scanDataB64 = Buffer.from(JSON.stringify(scanData)).toString('base64')

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email, scanDataKey: scanDataB64 }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Could not create checkout session.')
      }

      const { url } = await res.json()
      if (!url) throw new Error('No checkout URL returned.')

      window.location.href = url
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  // No scan data found
  if (hasScanData === false) {
    return (
      <div className="min-h-screen bg-[#E8DFD0] flex items-center justify-center px-4">
        <div className="max-w-sm mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm leading-none">€</span>
            </div>
            <span className="font-serif text-xl text-navy">DutchClaim</span>
          </div>
          <div className="bg-white rounded-card p-8 shadow-card border border-navy/8">
            <p className="font-serif text-xl text-navy mb-3">Session not found</p>
            <p className="text-navy/55 text-sm leading-relaxed mb-6">
              Your quiz answers couldn&apos;t be found — this usually happens when the confirmation email opens in a different browser. The quiz only takes 2 minutes to redo.
            </p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 bg-brand text-white text-sm font-medium px-6 py-3 rounded-input w-full justify-center hover:bg-brand/90 transition-colors"
            >
              Redo the quiz <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Hydrating
  if (hasScanData === null) {
    return (
      <div className="min-h-screen bg-[#E8DFD0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const details = PLAN_DETAILS[plan]

  return (
    <div className="bg-[#E8DFD0] min-h-screen py-16 px-4">
      <div className="max-w-md mx-auto">

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm leading-none">€</span>
            </div>
            <span className="font-serif text-xl text-navy">DutchClaim</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-3">
            Unlock your full report
          </h1>
          <p className="text-navy/55 text-base max-w-md mx-auto">
            One-time payment. No subscription, no hidden fees.
          </p>
        </div>

        {/* Plan card */}
        <div className="bg-white rounded-card border-2 border-brand p-6 mb-8 shadow-card-lg">
          <p className="text-sm font-medium text-brand mb-1">{details.name}</p>
          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="font-serif text-4xl text-navy">{details.price}</span>
            <span className="text-navy/45 text-sm">one-time</span>
          </div>
          <ul className="space-y-2">
            {details.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-navy/70">
                <CheckCircle2 size={14} className="text-brand mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleUnlock}
          disabled={loading}
          className="btn-primary inline-flex items-center gap-2.5 bg-brand text-white font-medium px-8 py-3.5 rounded-input text-base w-full justify-center disabled:opacity-60"
        >
          {loading
            ? 'Redirecting to payment…'
            : `Pay ${details.price} & unlock report`}
        </button>

        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-xs text-navy/35">Secured by</span>
          <span className="text-xs font-semibold text-navy/40">Stripe</span>
          <span className="text-xs text-navy/25">·</span>
          <span className="text-xs text-navy/35">256-bit SSL</span>
        </div>

      </div>
    </div>
  )
}

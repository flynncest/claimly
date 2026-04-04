'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const PLANS = [
  {
    id: 'student',
    name: 'Student Report',
    price: '€13.99',
    period: 'one-time',
    features: [
      'DUO Studiefinanciering eligibility check',
      'OV-studentenkaart (train pass) check',
      'Healthcare allowance (Zorgtoeslag) check',
      'Step-by-step application guide',
    ],
  },
  {
    id: 'full',
    name: 'Expat Report',
    price: '€19.99',
    period: 'one-time',
    highlight: true,
    features: [
      'All 6 Dutch programs AI-verified',
      'Income-based benefit calculations',
      'Step-by-step application guides',
      'Conditions met & reasons explained',
      'Priority email support',
    ],
  },
]

export default function PayPage() {
  const router = useRouter()
  const supabase = createClient()

  const [selectedPlan, setSelectedPlan] = useState<'student' | 'full'>('full')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Require login
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login?redirect=/pay')
      } else {
        setCheckingAuth(false)
      }
    })
  }, [router, supabase])

  // Auto-select student plan if scan data shows student
  useEffect(() => {
    const raw = localStorage.getItem('claimly_scan_data')
    if (raw) {
      const scanData = JSON.parse(raw)
      if (
        scanData.residenceStatus === 'international_student' ||
        scanData.employment === 'student'
      ) {
        setSelectedPlan('student')
      }
    }
  }, [])

  const handleUnlock = async () => {
    setLoading(true)
    setStatus('Confirming...')

    const raw = localStorage.getItem('claimly_scan_data')
    if (!raw) {
      router.push('/scan')
      return
    }

    // Store selected plan so AI knows which mode to run
    localStorage.setItem('claimly_plan', selectedPlan)
    localStorage.setItem('claimly_paid', 'true')
    router.push('/dashboard')
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#E8DFD0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-[#E8DFD0] min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold">C</span>
            </div>
            <span className="font-serif text-xl text-navy">Claimly</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy mb-3">
            Unlock your full report
          </h1>
          <p className="text-navy/55 text-base max-w-md mx-auto">
            One-time payment. No subscription, no hidden fees.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as 'student' | 'full')}
              className={`text-left rounded-card p-6 border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-brand bg-white shadow-card-lg'
                  : 'border-transparent bg-white/60 hover:bg-white/80'
              }`}
            >
              {plan.highlight && (
                <div className="inline-block bg-brand text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                  Most popular
                </div>
              )}
              <p className="text-sm font-medium text-brand mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="font-serif text-4xl text-navy">{plan.price}</span>
                <span className="text-navy/45 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-navy/70">
                    <CheckCircle2 size={14} className="text-brand mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {selectedPlan === plan.id && (
                <div className="mt-4 flex items-center gap-1.5 text-brand text-xs font-medium">
                  <div className="w-3 h-3 rounded-full border-2 border-brand flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                  </div>
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleUnlock}
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2.5 bg-brand text-white font-medium px-8 py-3.5 rounded-input text-base disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {status || 'Processing...'}
              </>
            ) : (
              `Unlock ${selectedPlan === 'student' ? 'Student' : 'Expat'} Report · ${selectedPlan === 'student' ? '€13.99' : '€19.99'}`
            )}
          </button>
          <p className="text-xs text-navy/35 mt-3">
            Payment integration coming soon — unlocking free during beta.
          </p>
        </div>

      </div>
    </div>
  )
}

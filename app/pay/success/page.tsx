'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

function CircularProgress({ pct }: { pct: number }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r={r} fill="none" stroke="#D4CBBD" strokeWidth="8" />
      <circle
        cx="64" cy="64" r={r} fill="none"
        stroke="#E8440A" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />
    </svg>
  )
}

const STEPS = [
  'Payment confirmed ✓',
  'Running eligibility analysis...',
  'Calculating your benefit amounts...',
  'Finalising your report...',
  'Report ready!',
]

export default function PaySuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const sessionId = params.get('session_id')

  const [progress, setProgress] = useState(5)
  const [stepIndex, setStepIndex] = useState(0)
  const [reportId, setReportId] = useState<string | null>(null)
  const progressTarget = useRef(20)
  const polling = useRef(false)

  // Animate progress bar toward target
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const target = progressTarget.current
        if (p >= target) return p
        const step = p < 60 ? Math.random() * 2 : Math.random() * 1
        return Math.min(p + step, target)
      })
    }, 150)
    return () => clearInterval(interval)
  }, [])

  // Poll Supabase for the report created by the webhook
  useEffect(() => {
    if (!sessionId || polling.current) return
    polling.current = true

    progressTarget.current = 60
    setStepIndex(1)

    let attempts = 0
    const maxAttempts = 40   // 40 × 3s = 2 minutes max

    const poll = async () => {
      attempts++
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('scan_results')
          .select('id')
          .eq('stripe_session_id', sessionId)
          .maybeSingle()

        if (data?.id) {
          setReportId(data.id)
          progressTarget.current = 100
          setProgress(100)
          setStepIndex(4)

          // Clean up localStorage
          localStorage.removeItem('dutchclaim_scan_data')
          localStorage.removeItem('dutchclaim_plan')
          localStorage.removeItem('dutchclaim_scan_plan')
          localStorage.removeItem('dutchclaim_paid')
          localStorage.removeItem('dutchclaim_estimate')
          localStorage.removeItem('dutchclaim_scan_history')

          setTimeout(() => {
            router.push(`/dashboard?reportId=${data.id}`)
          }, 1200)
          return
        }
      } catch {
        // ignore transient errors, keep polling
      }

      if (attempts >= maxAttempts) {
        router.push('/dashboard')
        return
      }

      // Slowly creep progress while waiting
      if (attempts === 5) { progressTarget.current = 70; setStepIndex(2) }
      if (attempts === 12) { progressTarget.current = 82; setStepIndex(3) }

      setTimeout(poll, 3000)
    }

    setTimeout(poll, 2000)   // give webhook 2s head start
  }, [sessionId, router])

  return (
    <div className="min-h-screen bg-[#E8DFD0] flex items-center justify-center px-4">
      <div className="max-w-sm mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-sm leading-none">€</span>
          </div>
          <span className="font-serif text-xl text-navy">DutchClaim</span>
        </div>

        {progress < 100 ? (
          <>
            <div className="relative inline-flex items-center justify-center mb-8">
              <CircularProgress pct={Math.round(progress)} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-brand font-serif text-xl">{Math.round(progress)}%</span>
              </div>
            </div>
            <h2 className="font-serif text-2xl text-navy mb-2">Generating your report</h2>
            <p className="text-navy/50 text-sm mb-1">{STEPS[stepIndex]}</p>
            <p className="text-navy/30 text-xs">Usually takes 15–30 seconds — please keep this page open.</p>
            <div className="flex justify-center gap-1.5 mt-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand/40"
                  style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-brand" />
            </div>
            <h2 className="font-serif text-2xl text-navy mb-2">Report ready!</h2>
            <p className="text-navy/50 text-sm">Redirecting to your dashboard…</p>
            {reportId && (
              <a href={`/dashboard?reportId=${reportId}`} className="text-brand text-sm underline mt-4 block">
                Click here if not redirected
              </a>
            )}
          </>
        )}
      </div>
    </div>
  )
}

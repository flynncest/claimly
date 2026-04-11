'use client'

// Fallback: if the user somehow ends up on the dashboard with unprocessed
// scan data and a paid flag (e.g. pay page crashed before redirect), pick
// it up here so they don't lose their report.

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AutoAnalyzer({ hasReports }: { hasReports: boolean }) {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return

    const paid = localStorage.getItem('dutchclaim_paid')
    const raw = localStorage.getItem('dutchclaim_scan_data')

    // Only run as a fallback: must have both paid flag AND scan data.
    // If analysis already ran on the pay page, these will have been cleared.
    if (!paid || !raw) return

    called.current = true

    const run = async () => {
      const scanData = JSON.parse(raw)
      const plan = localStorage.getItem('dutchclaim_plan') ?? 'full'

      setStatus('Analysing your profile...')
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scanData, _plan: plan }),
      })

      if (!res.ok) {
        setStatus('Analysis failed — please go back to /pay and try again.')
        return
      }

      const result = await res.json()
      setStatus('Saving your report...')

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email ?? scanData.email ?? ''

      const saveRes = await fetch('/api/save-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanData, result, email }),
      })

      if (!saveRes.ok) {
        setStatus('Save failed — please refresh and try again.')
        return
      }

      const saved = await saveRes.json()

      if (saved?.id && email) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, reportId: saved.id, result }),
        }).catch(() => null)
      }

      localStorage.removeItem('dutchclaim_paid')
      localStorage.removeItem('dutchclaim_plan')
      localStorage.removeItem('dutchclaim_scan_data')
      localStorage.removeItem('dutchclaim_estimate')
      localStorage.removeItem('dutchclaim_scan_history')

      setStatus('')
      window.location.href = saved?.id ? `/dashboard?reportId=${saved.id}` : '/dashboard'
    }

    run()
  }, [router])

  if (!status) return null

  return (
    <div className="bg-white border border-navy/10 rounded-card p-5 mb-6 flex items-center gap-3 shadow-card">
      <Loader2 size={18} className="text-brand animate-spin shrink-0" />
      <div>
        <p className="text-sm font-medium text-navy">Generating your full report</p>
        <p className="text-xs text-navy/45 mt-0.5">{status}</p>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AutoAnalyzer({ hasReports }: { hasReports: boolean }) {
  const router = useRouter()
  const [status, setStatus] = useState('')

  useEffect(() => {
    const paid = localStorage.getItem('claimly_paid')
    const raw = localStorage.getItem('claimly_scan_data')
    // Run if explicitly paid, or if user has scan data but no reports yet (beta: free)
    if (!raw) return
    if (!paid && hasReports) return

    const run = async () => {
      const scanData = JSON.parse(raw)
      const plan = localStorage.getItem('claimly_plan') ?? 'full'

      setStatus('Running AI analysis...')
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scanData, _plan: plan }),
      })

      if (!res.ok) {
        setStatus('Analysis failed — please try again.')
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
      if (saved?.id) {
        localStorage.setItem('claimly_report_id', saved.id)
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, reportId: saved.id, result }),
        }).catch(() => null)
      }

      localStorage.removeItem('claimly_paid')
      localStorage.removeItem('claimly_plan')
      localStorage.removeItem('claimly_scan_data')
      setStatus('')
      window.location.href = '/dashboard'
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

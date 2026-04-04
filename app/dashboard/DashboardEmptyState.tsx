'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, Loader2 } from 'lucide-react'

export default function DashboardEmptyState() {
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('claimly_scan_data')
    setGenerating(!!raw)
  }, [])

  if (generating) {
    return (
      <div className="bg-white rounded-card p-10 text-center shadow-card border border-navy/5">
        <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Loader2 size={22} className="text-brand animate-spin" />
        </div>
        <p className="font-serif text-xl text-navy mb-3">Report is generating</p>
        <p className="text-navy/50 text-sm max-w-sm mx-auto">
          Your AI-verified report is being prepared. This usually takes under a minute — this page will update automatically.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-card p-10 text-center shadow-card border border-navy/5">
      <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-5">
        <Lock size={22} className="text-brand" />
      </div>
      <p className="font-serif text-xl text-navy mb-3">No reports yet</p>
      <p className="text-navy/50 text-sm mb-2 max-w-sm mx-auto">
        Run a free scan to get your benefits estimate, then unlock the full AI-verified report.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link
          href="/scan"
          className="btn-primary inline-flex items-center justify-center gap-2 bg-brand text-white text-sm font-medium px-5 py-2.5 rounded-input"
        >
          Start free scan <ArrowRight size={15} />
        </Link>
        <Link
          href="/pay"
          className="inline-flex items-center justify-center gap-2 border border-navy/15 text-navy text-sm font-medium px-5 py-2.5 rounded-input hover:bg-navy/5 transition-colors"
        >
          Unlock full report <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { RefreshCw, Lock } from 'lucide-react'

export default function UpdateAnswersButton({
  canEdit,
  nextEditDate,
}: {
  canEdit: boolean
  nextEditDate: string
}) {
  const router = useRouter()

  if (!canEdit) {
    return (
      <div className="shrink-0 flex items-center gap-1.5 text-xs text-navy/35 border border-navy/10 px-3 py-2 rounded-input mt-1 cursor-not-allowed select-none">
        <Lock size={11} />
        Update available {nextEditDate}
      </div>
    )
  }

  const handleClick = () => {
    // Signal AutoAnalyzer to re-run even though user has existing reports
    localStorage.setItem('claimly_paid', 'true')
    localStorage.removeItem('claimly_scan_data')
    localStorage.removeItem('claimly_scan_step')
    router.push('/scan')
  }

  return (
    <button
      onClick={handleClick}
      className="shrink-0 flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy border border-navy/15 px-3.5 py-2 rounded-input transition-colors mt-1"
    >
      <RefreshCw size={13} />
      Update answers
    </button>
  )
}

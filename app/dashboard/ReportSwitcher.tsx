'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, ChevronRight, Pencil, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { SavedReport } from '@/lib/types'

interface Props {
  reports: SavedReport[]
  activeId: string
}

function defaultName(r: SavedReport) {
  const isStudent =
    r.scan_data?.employment === 'student' ||
    r.scan_data?.residenceStatus === 'international_student'
  return isStudent ? 'Student Report' : 'Benefits Report'
}

export default function ReportSwitcher({ reports, activeId }: Props) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nameValue, setNameValue] = useState('')
  const [saving, setSaving] = useState(false)

  const startEdit = (r: SavedReport, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(r.id)
    setNameValue(r.name ?? defaultName(r))
  }

  const cancelEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingId(null)
    setNameValue('')
  }

  const saveEdit = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!nameValue.trim()) return cancelEdit()
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('scan_results')
      .update({ name: nameValue.trim() })
      .eq('id', id)
    setSaving(false)
    setEditingId(null)
    router.refresh()
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-navy/35">
          Your reports
        </p>
        <span className="text-xs text-navy/35">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-2">
        {reports.map((r) => {
          const isActive = r.id === activeId
          const isEditing = editingId === r.id
          const displayName = r.name ?? defaultName(r)
          const date = new Date(r.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })
          const totalMax = r.result?.total_monthly_max ?? 0
          const programCount = r.result?.eligible_programs?.length ?? 0

          return (
            <div
              key={r.id}
              onClick={() => !isEditing && router.push(`/dashboard?reportId=${r.id}`)}
              className={`w-full text-left rounded-card border-2 px-4 py-4 flex items-center gap-4 transition-all ${
                isEditing
                  ? 'border-brand bg-sage/20 cursor-default'
                  : isActive
                  ? 'border-brand bg-sage/30 shadow-card cursor-pointer'
                  : 'border-navy/10 bg-white hover:border-brand/40 hover:bg-sage/10 cursor-pointer'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isActive || isEditing ? 'bg-brand text-white' : 'bg-navy/6 text-navy/40'
              }`}>
                <FileText size={18} />
              </div>

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <input
                      autoFocus
                      value={nameValue}
                      onChange={e => setNameValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(r.id)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      className="flex-1 text-sm font-semibold text-navy border border-brand/40 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
                      placeholder="e.g. Mom's report"
                      maxLength={40}
                    />
                    <button
                      onClick={e => saveEdit(r.id, e)}
                      disabled={saving}
                      className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center hover:bg-brand/90 transition-colors shrink-0"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="w-7 h-7 rounded-lg bg-navy/8 text-navy/50 flex items-center justify-center hover:bg-navy/15 transition-colors shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-brand' : 'text-navy'}`}>
                      {displayName}
                    </p>
                    {isActive && (
                      <span className="text-[10px] font-semibold bg-brand text-white px-1.5 py-0.5 rounded-full shrink-0">
                        Viewing
                      </span>
                    )}
                    <button
                      onClick={e => startEdit(r, e)}
                      className="ml-auto shrink-0 w-8 h-8 rounded-lg text-navy/40 hover:text-brand hover:bg-brand/10 flex items-center justify-center transition-colors"
                      title="Rename report"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                )}
                {!isEditing && (
                  <>
                    <p className="text-xs text-navy/40">{date}</p>
                    {totalMax > 0 && (
                      <p className="text-xs text-navy/55 mt-0.5">
                        {programCount} program{programCount !== 1 ? 's' : ''} matched · up to{' '}
                        <span className="text-brand font-medium">€{totalMax}/mo</span>
                      </p>
                    )}
                  </>
                )}
              </div>

              {!isEditing && (
                <ChevronRight size={16} className={isActive ? 'text-brand shrink-0' : 'text-navy/25 shrink-0'} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

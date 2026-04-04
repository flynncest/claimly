'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  TrendingUp,
  Download,
  Mail,
  Search,
  Upload,
  ChevronDown,
  CheckCircle2,
  Clock,
} from 'lucide-react'

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Sarah Mitchell', country: '🇳🇱', scanDate: '2025-03-28', monthlyBenefits: 432, status: 'complete' },
  { id: 2, name: 'Marco Rossi', country: '🇳🇱', scanDate: '2025-03-27', monthlyBenefits: 123, status: 'complete' },
  { id: 3, name: 'Anna Kowalski', country: '🇧🇪', scanDate: '2025-03-25', monthlyBenefits: 340, status: 'complete' },
  { id: 4, name: 'David Chen', country: '🇳🇱', scanDate: '2025-03-24', monthlyBenefits: 567, status: 'complete' },
  { id: 5, name: 'Priya Sharma', country: '🇧🇪', scanDate: '2025-03-22', monthlyBenefits: 163, status: 'complete' },
  { id: 6, name: 'Thomas Weber', country: '🇳🇱', scanDate: null, monthlyBenefits: null, status: 'invited' },
  { id: 7, name: 'Layla Hassan', country: '🇳🇱', scanDate: null, monthlyBenefits: null, status: 'invited' },
]

const STATS = [
  { label: 'Total employees', value: '7', icon: <Users size={18} />, change: null },
  { label: 'Scans completed', value: '5', icon: <CheckCircle2 size={18} />, change: '+2 this week' },
  { label: 'Total benefits found', value: '€1,625', icon: <TrendingUp size={18} />, change: '/month across team' },
  { label: 'Avg. per employee', value: '€325', icon: <TrendingUp size={18} />, change: '/month' },
]

export default function HRDashboardPage() {
  const [search, setSearch] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [invited, setInvited] = useState(false)

  const filtered = MOCK_EMPLOYEES.filter(
    (e) =>
      search === '' ||
      e.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    await new Promise((r) => setTimeout(r, 700))
    setInvited(true)
    setInviting(false)
    setInviteEmail('')
    setTimeout(() => setInvited(false), 3000)
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-navy/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-2xl text-navy">HR Dashboard</h1>
              <p className="text-navy/50 text-sm mt-0.5">Acme Corp · 7 employees</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-navy/15 text-navy text-sm px-3 py-2 rounded-input hover:bg-navy/3 transition-colors">
                <Download size={14} />
                Export CSV
              </button>
              <Link
                href="/pricing"
                className="btn-primary bg-brand text-white text-sm px-4 py-2 rounded-input font-medium"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-navy/50 mb-3">
                {s.icon}
                <span className="text-xs">{s.label}</span>
              </div>
              <p className="font-serif text-2xl text-navy">{s.value}</p>
              {s.change && (
                <p className="text-xs text-navy/40 mt-0.5">{s.change}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Employee table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              <div className="p-5 border-b border-navy/8 flex items-center justify-between gap-3">
                <h2 className="font-serif text-lg text-navy">Employees</h2>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 border border-navy/12 rounded-input text-xs text-navy placeholder:text-navy/30 focus:outline-none focus:ring-1 focus:ring-brand/30 w-44"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy/8">
                      {['Employee', 'Country', 'Scan date', 'Monthly benefits', 'Status'].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left text-xs text-navy/40 font-medium px-5 py-3 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/5">
                    {filtered.map((emp) => (
                      <tr key={emp.id} className="hover:bg-navy/1.5 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-navy text-sm">
                          {emp.name}
                        </td>
                        <td className="px-5 py-3.5 text-lg">{emp.country}</td>
                        <td className="px-5 py-3.5 text-navy/55 text-xs">
                          {emp.scanDate
                            ? new Date(emp.scanDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                              })
                            : '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          {emp.monthlyBenefits !== null ? (
                            <span className="text-brand font-medium">
                              €{emp.monthlyBenefits}/mo
                            </span>
                          ) : (
                            <span className="text-navy/30">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {emp.status === 'complete' ? (
                            <span className="inline-flex items-center gap-1 bg-brand-50 text-brand text-xs px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={10} /> Complete
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-brand-50 text-brand text-xs px-2 py-0.5 rounded-full">
                              <Clock size={10} /> Invited
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Invite employee */}
            <div className="bg-white rounded-card shadow-card p-5">
              <h3 className="font-serif text-base text-navy mb-4 flex items-center gap-2">
                <Mail size={16} className="text-brand" />
                Invite Employee
              </h3>
              <form onSubmit={handleInvite} className="space-y-3">
                <input
                  type="email"
                  placeholder="employee@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full border border-navy/15 rounded-input px-3 py-2.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
                <button
                  type="submit"
                  disabled={inviting}
                  className="btn-primary w-full bg-brand text-white text-sm py-2.5 rounded-input font-medium disabled:opacity-50"
                >
                  {inviting
                    ? 'Sending...'
                    : invited
                    ? '✓ Invite sent!'
                    : 'Send invite link'}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-navy/8">
                <button className="flex items-center gap-2 text-navy/60 text-xs hover:text-navy transition-colors">
                  <Upload size={12} />
                  Bulk invite via CSV
                </button>
              </div>
            </div>

            {/* Company branding */}
            <div className="bg-white rounded-card shadow-card p-5">
              <h3 className="font-serif text-base text-navy mb-3 flex items-center gap-2">
                Company branding
              </h3>
              <p className="text-navy/50 text-xs leading-relaxed mb-4">
                Upload your logo to white-label reports for employees.
              </p>
              <div className="border-2 border-dashed border-navy/15 rounded-lg p-6 text-center hover:border-brand/30 transition-colors cursor-pointer">
                <Upload size={20} className="text-navy/30 mx-auto mb-2" />
                <p className="text-navy/50 text-xs">
                  Click to upload logo
                </p>
                <p className="text-navy/30 text-xs mt-1">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-navy rounded-card p-5 text-white">
              <h3 className="font-serif text-base text-white mb-3">
                Benefits impact
              </h3>
              <p className="text-white/50 text-xs mb-4">
                Total monthly benefits found across your team
              </p>
              <p className="font-serif text-3xl text-brand mb-1">
                €1,625
              </p>
              <p className="text-white/40 text-xs">
                ≈ €19,500/year for your team
              </p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/40">
                  2 employees haven&apos;t scanned yet — potential additional
                  savings uncaptured
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

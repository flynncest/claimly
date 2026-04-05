'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import type {
  ScanData,
  ResidenceStatus,
  EmploymentStatus,
  IncomeRange,
  HouseholdType,
  HousingType,
  RentRange,
  OpvangDaysPerWeek,
} from '@/lib/types'

type Plan = 'student' | 'full'

type ScanStep =
  | 'plan'
  // Student steps
  | 'student_enrolled'
  | 'student_living'
  | 'student_health'
  // Expat steps
  | 'residence'
  | 'employment'
  // Shared
  | 'income'
  | 'household'
  | 'children'
  | 'children_opvang_days'
  | 'housing'
  | 'email'

function getNextStep(step: ScanStep, data: ScanData, plan: Plan): ScanStep | null {
  const hasKids = data.household === 'single_parent' || data.household === 'two_parents'
  switch (step) {
    case 'plan':                return plan === 'student' ? 'student_enrolled' : 'residence'
    case 'student_enrolled':    return 'student_living'
    case 'student_living':      return 'student_health'
    case 'student_health':      return 'income'
    case 'residence':           return 'employment'
    case 'employment':          return 'income'
    case 'income':              return plan === 'student' ? 'email' : 'household'
    case 'household':           return hasKids ? 'children' : 'housing'
    case 'children':            return data.children?.paidChildcare ? 'children_opvang_days' : 'housing'
    case 'children_opvang_days': return 'housing'
    case 'housing':             return 'email'
    case 'email':               return null
  }
}

// ─── UI helpers ───────────────────────────────────────────────────
interface CardOpt { value: string; label: string; sub?: string; emoji?: string }

function OptionCards({
  options, selected, onSelect, cols = 2,
}: { options: CardOpt[]; selected: string | undefined; onSelect: (v: string) => void; cols?: 1 | 2 }) {
  return (
    <div className={`grid gap-2 sm:gap-3 ${cols === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`option-card text-left p-3 sm:p-4 rounded-card border-2 flex items-start gap-2 sm:gap-3 transition-all ${
            selected === opt.value
              ? 'selected border-brand bg-sage'
              : 'border-navy/10 bg-white hover:border-brand/40 hover:bg-sage/50'
          }`}
        >
          {opt.emoji && <span className="text-lg sm:text-2xl shrink-0 mt-0.5">{opt.emoji}</span>}
          <div>
            <span className="text-xs sm:text-sm font-medium text-navy block leading-snug">{opt.label}</span>
            {opt.sub && <span className="text-xs text-navy/45 mt-0.5 hidden sm:block">{opt.sub}</span>}
          </div>
        </button>
      ))}
    </div>
  )
}

function YesNo({
  value, onSelect, labels = ['Yes', 'No'],
}: { value: boolean | undefined; onSelect: (v: boolean) => void; labels?: [string, string] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {([true, false] as const).map((v, i) => (
        <button
          key={String(v)}
          onClick={() => onSelect(v)}
          className={`option-card py-4 rounded-card border-2 text-sm font-medium transition-all ${
            value === v
              ? 'selected border-brand bg-sage text-brand'
              : 'border-navy/10 bg-white text-navy hover:border-brand/40'
          }`}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  )
}

function StepHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <span className="text-2xl sm:text-3xl mb-2 block">{emoji}</span>
      <h2 className="font-serif text-xl sm:text-2xl text-navy mb-1.5">{title}</h2>
      <p className="text-navy/55 text-xs sm:text-sm">{subtitle}</p>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────
export default function ScanPage() {
  const router = useRouter()
  const [plan, setPlan] = useState<Plan>('full')
  const [data, setData] = useState<ScanData>({ country: 'NL' })
  const [history, setHistory] = useState<ScanStep[]>(['plan'])

  const currentStep = history[history.length - 1]

  useEffect(() => {
    const savedData = localStorage.getItem('claimly_scan_data')
    const savedPlan = localStorage.getItem('claimly_scan_plan') as Plan | null
    const savedHistory = localStorage.getItem('claimly_scan_history')
    if (savedData) setData({ ...JSON.parse(savedData), country: 'NL' })
    if (savedPlan) setPlan(savedPlan)
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  useEffect(() => {
    localStorage.setItem('claimly_scan_data', JSON.stringify(data))
    localStorage.setItem('claimly_scan_plan', plan)
    localStorage.setItem('claimly_scan_history', JSON.stringify(history))
  }, [data, plan, history])

  const advance = (updatedData: ScanData, updatedPlan: Plan) => {
    const next = getNextStep(currentStep, updatedData, updatedPlan)
    if (next) setHistory(h => [...h, next])
  }

  // Auto-advance: set a field and immediately move to next step
  const pick = (update: Partial<ScanData>, updatedPlan = plan) => {
    const updated = { ...data, ...update }
    setData(updated)
    setTimeout(() => advance(updated, updatedPlan), 180)
  }

  const goBack = () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h)

  const submit = () => {
    if (!data.email) return
    localStorage.setItem('claimly_plan', plan)
    localStorage.setItem('claimly_scan_data', JSON.stringify(data))
    router.push('/scan/analyzing')
  }

  // Progress
  const STUDENT_TOTAL = 6 // plan, enrolled, living, health, income, email
  const EXPAT_TOTAL   = 8 // plan, residence, employment, income, household, [children], housing, email
  const totalEstimate = plan === 'student' ? STUDENT_TOTAL : EXPAT_TOTAL
  const pct = Math.min(((history.length - 1) / (totalEstimate - 1)) * 100, 95)

  return (
    <div className="min-h-screen bg-[#E8DFD0] py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-navy/50">Step {history.length} of ~{totalEstimate}</span>
            <span className="text-xs text-brand font-medium">{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 bg-navy/8 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {history.length > 1 && (
          <button onClick={goBack} className="flex items-center gap-1 text-navy/50 hover:text-navy text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> Back
          </button>
        )}

        <div className="bg-white rounded-card p-6 sm:p-8 shadow-card">

          {/* ── Plan selection ───────────────────────── */}
          {currentStep === 'plan' && (
            <div className="fade-up">
              <StepHeader
                emoji="🇳🇱"
                title="What type of report do you need?"
                subtitle="Pick the one that fits — you'll get a free estimate first."
              />
              <div className="space-y-3">
                <button
                  onClick={() => pick({ residenceStatus: 'international_student', employment: 'student' }, 'student')}
                  className="w-full text-left p-4 sm:p-5 rounded-card border-2 border-navy/10 bg-white hover:border-brand/40 hover:bg-sage/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl sm:text-2xl shrink-0">🎓</span>
                      <div>
                        <p className="text-sm font-semibold text-navy">Student Report</p>
                        <p className="text-xs text-navy/45 mt-0.5">DUO, OV-kaart, Zorgtoeslag</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-brand bg-brand/8 px-2.5 py-1 rounded-full">€13.99</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pl-8 sm:pl-9">
                    {['DUO grants', 'Free OV travel pass', 'Healthcare allowance'].map(f => (
                      <span key={f} className="flex items-center gap-1 text-xs text-navy/45">
                        <CheckCircle2 size={10} className="text-brand" />{f}
                      </span>
                    ))}
                  </div>
                </button>

                <button
                  onClick={() => { setPlan('full'); setTimeout(() => setHistory(h => [...h, 'residence']), 180) }}
                  className="w-full text-left p-4 sm:p-5 rounded-card border-2 border-navy/10 bg-white hover:border-brand/40 hover:bg-sage/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl sm:text-2xl shrink-0">🌍</span>
                      <div>
                        <p className="text-sm font-semibold text-navy">Expat Report</p>
                        <p className="text-xs text-navy/45 mt-0.5">All 6 Dutch programs, AI-verified</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-white bg-brand px-2.5 py-1 rounded-full">€19.99</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pl-8 sm:pl-9">
                    {['Zorgtoeslag', 'Huurtoeslag', 'Kinderopvangtoeslag', 'WW', 'Bijstand'].map(f => (
                      <span key={f} className="flex items-center gap-1 text-xs text-navy/45">
                        <CheckCircle2 size={10} className="text-brand" />{f}
                      </span>
                    ))}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ── Student: Enrolled ────────────────────── */}
          {currentStep === 'student_enrolled' && (
            <div className="fade-up">
              <StepHeader
                emoji="🎓"
                title="Enrolled at a Dutch university, HBO, or MBO?"
                subtitle="DUO grants are only for accredited Dutch institutions."
              />
              <YesNo
                value={data.enrolledAtDutchInstitution}
                onSelect={(v) => pick({ enrolledAtDutchInstitution: v })}
                labels={['Yes, I am', 'No / Applying']}
              />
            </div>
          )}

          {/* ── Student: Living situation ─────────────── */}
          {currentStep === 'student_living' && (
            <div className="fade-up">
              <StepHeader
                emoji="🏠"
                title="Do you live away from your parents in the Netherlands?"
                subtitle="This affects your DUO basisbeurs — €191/mo difference."
              />
              <YesNo
                value={data.studentLivesAway}
                onSelect={(v) => pick({ studentLivesAway: v })}
                labels={['Yes, away from parents', 'No, living with parents']}
              />
            </div>
          )}

          {/* ── Student: Health insurance ─────────────── */}
          {currentStep === 'student_health' && (
            <div className="fade-up">
              <StepHeader
                emoji="🏥"
                title="Do you have Dutch health insurance (basisverzekering)?"
                subtitle="Required to claim Zorgtoeslag."
              />
              <YesNo
                value={data.dutchHealthInsurance}
                onSelect={(v) => pick({ dutchHealthInsurance: v })}
              />
            </div>
          )}

          {/* ── Expat: Residence ─────────────────────── */}
          {currentStep === 'residence' && (
            <div className="fade-up">
              <StepHeader
                emoji="📋"
                title="Why are you living in the Netherlands?"
                subtitle="This determines which programs you can access."
              />
              <OptionCards
                options={[
                  { value: 'dutch_national',        label: 'Dutch national',          sub: 'Born in NL or naturalised',         emoji: '🏠' },
                  { value: 'eu_eea_citizen',         label: 'EU / EEA citizen',        sub: 'Free movement rights',              emoji: '🇪🇺' },
                  { value: 'highly_skilled_migrant', label: 'Highly Skilled Migrant',  sub: 'Kennismigrant permit',              emoji: '💼' },
                  { value: 'work_permit',            label: 'Other work permit',       sub: 'Non-EU, non-HSM',                   emoji: '📄' },
                  { value: 'family_reunification',   label: 'Partner / family visa',   sub: 'Joined a partner or family member', emoji: '👫' },
                  { value: 'other_permit',           label: 'Other / unsure',          emoji: '❓' },
                ]}
                selected={data.residenceStatus}
                onSelect={(v) => pick({ residenceStatus: v as ResidenceStatus })}
              />
            </div>
          )}

          {/* ── Expat: Employment ────────────────────── */}
          {currentStep === 'employment' && (
            <div className="fade-up">
              <StepHeader
                emoji="💼"
                title="Current employment situation?"
                subtitle="Affects WW and Bijstand eligibility."
              />
              <OptionCards
                options={[
                  { value: 'employed_full', label: 'Employed (full-time)',      emoji: '👔' },
                  { value: 'employed_part', label: 'Employed (part-time)',      emoji: '⏰' },
                  { value: 'self_employed', label: 'Self-employed / freelance', emoji: '🧑‍💻' },
                  { value: 'unemployed',    label: 'Unemployed',                emoji: '🔍' },
                  { value: 'other',         label: 'Other',                     emoji: '•' },
                ]}
                selected={data.employment}
                onSelect={(v) => pick({ employment: v as EmploymentStatus })}
              />
            </div>
          )}

          {/* ── Income ───────────────────────────────── */}
          {currentStep === 'income' && (
            <div className="fade-up">
              <StepHeader
                emoji="💶"
                title="Monthly net income?"
                subtitle="After tax — determines your benefit amounts."
              />
              <OptionCards
                options={[
                  { value: 'under_1000', label: 'Under €1,000' },
                  { value: '1000_1500',  label: '€1,000 – €1,500' },
                  { value: '1500_2000',  label: '€1,500 – €2,000' },
                  { value: '2000_2500',  label: '€2,000 – €2,500' },
                  { value: '2500_3000',  label: '€2,500 – €3,000' },
                  { value: '3000_3500',  label: '€3,000 – €3,500' },
                  { value: '3500_4500',  label: '€3,500 – €4,500' },
                  { value: 'over_4500',  label: 'Over €4,500' },
                  { value: 'prefer_not', label: 'Prefer not to say' },
                ]}
                selected={data.income}
                onSelect={(v) => pick({ income: v as IncomeRange })}
              />
            </div>
          )}

          {/* ── Household ────────────────────────────── */}
          {currentStep === 'household' && (
            <div className="fade-up">
              <StepHeader
                emoji="🏡"
                title="Living situation?"
                subtitle="Household composition affects amounts and thresholds."
              />
              <OptionCards
                options={[
                  { value: 'alone',           label: 'Living alone',              emoji: '🧍' },
                  { value: 'partner_no_kids', label: 'With partner, no kids',    emoji: '👫' },
                  { value: 'single_parent',   label: 'Single parent with kids',  emoji: '👤👶' },
                  { value: 'two_parents',     label: 'Two parents with kids',     emoji: '👨‍👩‍👧' },
                  { value: 'other',           label: 'Other',                     emoji: '•' },
                ]}
                selected={data.household}
                onSelect={(v) => pick({ household: v as HouseholdType })}
              />
            </div>
          )}

          {/* ── Children ─────────────────────────────── */}
          {currentStep === 'children' && (
            <div className="fade-up space-y-5">
              <StepHeader
                emoji="👶"
                title="Tell us about your children"
                subtitle="Child benefits scale with number of children and childcare use."
              />
              <div>
                <p className="text-sm font-medium text-navy mb-3">How many children under 18?</p>
                <div className="grid grid-cols-4 gap-2">
                  {(['1', '2', '3', '4plus'] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setData(d => ({ ...d, children: { count: n, paidChildcare: d.children?.paidChildcare ?? false } }))}
                      className={`option-card py-3 rounded-card border-2 text-sm font-medium text-center ${
                        data.children?.count === n ? 'selected border-brand bg-sage' : 'border-navy/10 bg-white'
                      }`}
                    >
                      {n === '4plus' ? '4+' : n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-navy mb-3">Do any children attend paid childcare (opvang)?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[{ v: true, l: 'Yes' }, { v: false, l: 'No' }].map(({ v, l }) => (
                    <button
                      key={l}
                      onClick={() => setData(d => ({ ...d, children: { count: d.children?.count ?? '1', paidChildcare: v } }))}
                      className={`option-card py-3 rounded-card border-2 text-sm font-medium ${
                        data.children?.paidChildcare === v ? 'selected border-brand bg-sage' : 'border-navy/10 bg-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => advance(data, plan)}
                disabled={!data.children?.count || data.children.paidChildcare === undefined}
                className="btn-primary w-full bg-brand text-white font-medium py-3.5 rounded-input text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Children: Opvang days ─────────────────── */}
          {currentStep === 'children_opvang_days' && (
            <div className="fade-up">
              <StepHeader
                emoji="📅"
                title="How many days per week at childcare?"
                subtitle="More days = higher Kinderopvangtoeslag. We'll calculate the exact amount."
              />
              <OptionCards
                cols={1}
                options={[
                  { value: '1_2', label: '1–2 days per week',  sub: 'Part-time' },
                  { value: '3_4', label: '3–4 days per week',  sub: 'Regular schedule' },
                  { value: '5',   label: '5 days per week',    sub: 'Full week' },
                ]}
                selected={data.childrenOpvangDaysPerWeek}
                onSelect={(v) => pick({ childrenOpvangDaysPerWeek: v as OpvangDaysPerWeek })}
              />
            </div>
          )}

          {/* ── Housing ──────────────────────────────── */}
          {currentStep === 'housing' && (
            <div className="fade-up space-y-5">
              <StepHeader
                emoji="🏘️"
                title="Do you rent or own your home?"
                subtitle="Huurtoeslag is one of the most claimed Dutch benefits."
              />
              <OptionCards
                cols={1}
                options={[
                  { value: 'rent',  label: 'I rent',                   emoji: '🔑' },
                  { value: 'own',   label: 'I own',                    emoji: '🏡' },
                  { value: 'other', label: 'Other / employer housing', emoji: '🏢' },
                ]}
                selected={data.housing?.type}
                onSelect={(v) => setData(d => ({ ...d, housing: { type: v as HousingType } }))}
              />
              {data.housing?.type === 'rent' && (
                <div className="pt-4 border-t border-navy/8">
                  <p className="text-sm font-medium text-navy mb-3">Monthly rent?</p>
                  <OptionCards
                    options={[
                      { value: 'under_500', label: 'Under €500' },
                      { value: '500_800',   label: '€500 – €800' },
                      { value: '800_1000',  label: '€800 – €1,000' },
                      { value: '1000_1200', label: 'Over €1,000' },
                    ]}
                    selected={data.housing?.rent}
                    onSelect={(v) => setData(d => ({ ...d, housing: { type: 'rent', rent: v as RentRange } }))}
                  />
                </div>
              )}
              <button
                onClick={() => advance(data, plan)}
                disabled={!data.housing?.type || (data.housing?.type === 'rent' && !data.housing.rent)}
                className="btn-primary w-full bg-brand text-white font-medium py-3.5 rounded-input text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Email ────────────────────────────────── */}
          {currentStep === 'email' && (
            <div className="fade-up space-y-5">
              <StepHeader
                emoji="✉️"
                title="See your free estimate"
                subtitle="Enter your email — no payment required."
              />
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={data.email ?? ''}
                  onChange={(e) => setData(d => ({ ...d, email: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  className="w-full border border-navy/15 rounded-input px-4 py-3 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all bg-white"
                />
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.subscribeToUpdates ?? false}
                    onChange={(e) => setData(d => ({ ...d, subscribeToUpdates: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 accent-brand"
                  />
                  <span className="text-sm text-navy/55">Alert me when my eligibility changes</span>
                </label>
                <p className="text-xs text-navy/35">🔒 No spam. Unsubscribe anytime.</p>
                <button
                  onClick={submit}
                  disabled={!data.email}
                  className="btn-primary w-full bg-brand text-white font-medium py-3.5 rounded-input text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  See My Free Estimate →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

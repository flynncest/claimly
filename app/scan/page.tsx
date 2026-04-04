'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import type {
  ScanData,
  ResidenceStatus,
  EmploymentStatus,
  IncomeRange,
  HouseholdType,
  HousingType,
  RentRange,
} from '@/lib/types'
import { estimateBenefits } from '@/lib/benefitsDb'

const TOTAL_STEPS = 7

interface OptionCard {
  value: string
  label: string
  sub?: string
  emoji?: string
}

function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-navy/50">Step {step} of {TOTAL_STEPS}</span>
        <span className="text-xs text-brand font-medium">{Math.round(pct)}% complete</span>
      </div>
      <div className="h-1.5 bg-navy/8 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function OptionCards({
  options,
  selected,
  onSelect,
}: {
  options: OptionCard[]
  selected: string | undefined
  onSelect: (val: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`option-card text-left p-4 rounded-card border-2 flex items-start gap-3 ${
            selected === opt.value
              ? 'selected border-brand bg-sage'
              : 'border-navy/10 bg-white hover:border-brand/40 hover:bg-sage/50'
          }`}
        >
          {opt.emoji && <span className="text-2xl shrink-0 mt-0.5">{opt.emoji}</span>}
          <div>
            <span className="text-sm font-medium text-navy block">{opt.label}</span>
            {opt.sub && <span className="text-xs text-navy/45 mt-0.5 block">{opt.sub}</span>}
          </div>
        </button>
      ))}
    </div>
  )
}

export default function ScanPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<ScanData>({ country: 'NL' })

  useEffect(() => {
    const saved = localStorage.getItem('claimly_scan_data')
    const savedStep = localStorage.getItem('claimly_scan_step')
    if (saved) {
      const parsed = JSON.parse(saved)
      setData({ ...parsed, country: 'NL' }) // always NL
    }
    if (savedStep) setStep(parseInt(savedStep, 10))
  }, [])

  useEffect(() => {
    localStorage.setItem('claimly_scan_data', JSON.stringify(data))
    localStorage.setItem('claimly_scan_step', String(step))
  }, [data, step])

  const hasKids = data.household === 'single_parent' || data.household === 'two_parents'

  const isStudentResident = data.residenceStatus === 'international_student'

  const next = () => {
    if (step === 4 && !hasKids) setStep(6)
    else setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const back = () => {
    if (step === 3 && isStudentResident) setStep(1) // skip employment for students
    else if (step === 6 && !hasKids) setStep(4)
    else setStep((s) => Math.max(s - 1, 1))
  }

  const selectAndAdvance = (key: keyof ScanData, value: string) => {
    if (key === 'residenceStatus' && value === 'international_student') {
      // Auto-set employment to student and skip that step
      setData(d => ({ ...d, residenceStatus: 'international_student', employment: 'student' as EmploymentStatus }))
      setTimeout(() => setStep(3), 200)
      return
    }
    setData(d => ({ ...d, [key]: value }))
    setTimeout(() => {
      if (key === 'household' && (value === 'alone' || value === 'partner_no_kids' || value === 'other')) {
        setStep(6)
      } else {
        setStep((s) => s + 1)
      }
    }, 200)
  }

  const submit = () => {
    if (!data.email) return
    localStorage.setItem('claimly_scan_data', JSON.stringify(data))
    router.push('/scan/analyzing')
  }

  const canContinue = () => {
    if (step === 1) return !!data.residenceStatus
    if (step === 2) return !!data.employment
    if (step === 3) return !!data.income
    if (step === 4) return !!data.household
    if (step === 5) return !!data.children?.count
    if (step === 6) return !!data.housing?.type
    if (step === 7) return !!data.email
    return true
  }

  return (
    <div className="min-h-screen bg-[#E8DFD0] py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <ProgressBar step={step} />
        </div>

        {step > 1 && (
          <button
            onClick={back}
            className="flex items-center gap-1 text-navy/50 hover:text-navy text-sm mb-6 transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}

        <div className="bg-white rounded-card p-8 shadow-card">

          {/* Step 1: Residence status */}
          {step === 1 && (
            <StepWrapper
              emoji="📋"
              title="Why are you living in the Netherlands?"
              subtitle="This determines which benefit programs you can access."
            >
              <OptionCards
                options={[
                  {
                    value: 'dutch_national',
                    label: 'Dutch national',
                    sub: 'Born in NL or naturalised',
                    emoji: '🏠',
                  },
                  {
                    value: 'eu_eea_citizen',
                    label: 'EU / EEA citizen',
                    sub: 'Free movement rights',
                    emoji: '🇪🇺',
                  },
                  {
                    value: 'highly_skilled_migrant',
                    label: 'Highly Skilled Migrant',
                    sub: 'Kennismigrant permit',
                    emoji: '💼',
                  },
                  {
                    value: 'international_student',
                    label: 'International student',
                    sub: 'Student visa / residence',
                    emoji: '🎓',
                  },
                  {
                    value: 'work_permit',
                    label: 'Other work permit',
                    sub: 'Non-EU, non-HSM',
                    emoji: '📄',
                  },
                  {
                    value: 'family_reunification',
                    label: 'Partner / family visa',
                    sub: 'Joined a partner or family member',
                    emoji: '👫',
                  },
                  {
                    value: 'other_permit',
                    label: 'Other / unsure',
                    emoji: '❓',
                  },
                ]}
                selected={data.residenceStatus}
                onSelect={(v) => selectAndAdvance('residenceStatus', v as ResidenceStatus)}
              />
            </StepWrapper>
          )}

          {/* Step 2: Employment */}
          {step === 2 && (
            <StepWrapper
              emoji="💼"
              title="What is your current employment situation?"
              subtitle="Your work status determines many benefit eligibilities."
            >
              <OptionCards
                options={[
                  { value: 'employed_full',  label: 'Employed (full-time)', emoji: '👔' },
                  { value: 'employed_part',  label: 'Employed (part-time)', emoji: '⏰' },
                  { value: 'self_employed',  label: 'Self-employed / freelance', emoji: '🧑‍💻' },
                  { value: 'unemployed',     label: 'Unemployed', emoji: '🔍' },
                  { value: 'student',        label: 'Student', emoji: '🎓' },
                  { value: 'other',          label: 'Other', emoji: '•' },
                ]}
                selected={data.employment}
                onSelect={(v) => selectAndAdvance('employment', v as EmploymentStatus)}
              />
            </StepWrapper>
          )}

          {/* Step 3: Income */}
          {step === 3 && (
            <StepWrapper
              emoji="💶"
              title="What is your monthly net income?"
              subtitle="After tax. Income thresholds determine which benefits you qualify for — small differences matter."
            >
              <OptionCards
                options={[
                  { value: 'under_1000',  label: 'Under €1,000' },
                  { value: '1000_1500',   label: '€1,000 – €1,500' },
                  { value: '1500_2000',   label: '€1,500 – €2,000' },
                  { value: '2000_2500',   label: '€2,000 – €2,500' },
                  { value: '2500_3000',   label: '€2,500 – €3,000' },
                  { value: '3000_3500',   label: '€3,000 – €3,500' },
                  { value: '3500_4500',   label: '€3,500 – €4,500' },
                  { value: 'over_4500',   label: 'Over €4,500' },
                  { value: 'prefer_not',  label: 'Prefer not to say' },
                ]}
                selected={data.income}
                onSelect={(v) => selectAndAdvance('income', v as IncomeRange)}
              />
            </StepWrapper>
          )}

          {/* Step 4: Household */}
          {step === 4 && (
            <StepWrapper
              emoji="🏡"
              title="What is your living situation?"
              subtitle="Household composition affects benefit amounts."
            >
              <OptionCards
                options={[
                  { value: 'alone',           label: 'Living alone', emoji: '🧍' },
                  { value: 'partner_no_kids', label: 'With partner (no kids)', emoji: '👫' },
                  { value: 'single_parent',   label: 'Single parent with kids', emoji: '👤👶' },
                  { value: 'two_parents',     label: 'Two parents with kids', emoji: '👨‍👩‍👧' },
                  { value: 'other',           label: 'Other', emoji: '•' },
                ]}
                selected={data.household}
                onSelect={(v) => selectAndAdvance('household', v as HouseholdType)}
              />
            </StepWrapper>
          )}

          {/* Step 5: Children (conditional) */}
          {step === 5 && hasKids && (
            <StepWrapper
              emoji="👶"
              title="Tell us about your children"
              subtitle="Child benefits scale with the number of children."
            >
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-navy mb-3">How many children under 18?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(['1', '2', '3', '4plus'] as const).map((n) => (
                      <button
                        key={n}
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            children: { count: n, paidChildcare: d.children?.paidChildcare ?? false },
                          }))
                        }
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
                  <p className="text-sm font-medium text-navy mb-3">Do any children attend paid childcare/daycare?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map((opt) => (
                      <button
                        key={String(opt.value)}
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            children: { count: d.children?.count ?? '1', paidChildcare: opt.value },
                          }))
                        }
                        className={`option-card py-3 rounded-card border-2 text-sm font-medium ${
                          data.children?.paidChildcare === opt.value ? 'selected border-brand bg-sage' : 'border-navy/10 bg-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {/* Step 6: Housing */}
          {step === 6 && (
            <StepWrapper
              emoji="🏘️"
              title="Do you rent or own your home?"
              subtitle="Rent benefit (Huurtoeslag) is one of the most claimed benefits in the Netherlands."
            >
              <div className="space-y-5">
                <OptionCards
                  options={[
                    { value: 'rent',  label: 'I rent', emoji: '🔑' },
                    { value: 'own',   label: 'I own', emoji: '🏡' },
                    { value: 'other', label: 'Other / employer housing', emoji: '🏢' },
                  ]}
                  selected={data.housing?.type}
                  onSelect={(v) => setData((d) => ({ ...d, housing: { type: v as HousingType } }))}
                />
                {data.housing?.type === 'rent' && (
                  <div className="mt-4 pt-4 border-t border-navy/8">
                    <p className="text-sm font-medium text-navy mb-3">What is your approximate monthly rent?</p>
                    <OptionCards
                      options={[
                        { value: 'under_500',  label: 'Under €500' },
                        { value: '500_800',    label: '€500 – €800' },
                        { value: '800_1000',   label: '€800 – €1,000' },
                        { value: '1000_1200',  label: '€1,000 – €1,200' },
                        { value: 'over_1200',  label: 'Over €1,200' },
                      ]}
                      selected={data.housing?.rent}
                      onSelect={(v) =>
                        setData((d) => ({ ...d, housing: { type: 'rent', rent: v as RentRange } }))
                      }
                    />
                  </div>
                )}
              </div>
            </StepWrapper>
          )}

          {/* Step 7: Estimation preview + Email */}
          {step === 7 && <Step7 data={data} setData={setData} submit={submit} />}
        </div>

        {/* Continue button for steps with sub-questions */}
        {(step === 5 || step === 6) && (
          <div className="mt-6">
            <button
              onClick={next}
              disabled={!canContinue()}
              className="btn-primary w-full bg-brand text-white font-medium py-3.5 rounded-input text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Step7({
  data,
  setData,
  submit,
}: {
  data: ScanData
  setData: React.Dispatch<React.SetStateAction<ScanData>>
  submit: () => void
}) {
  const estimate = useMemo(() => estimateBenefits(data), [data])
  const SHOW_MAX = 3
  const visible = estimate.programs.slice(0, SHOW_MAX)
  const hidden = estimate.programs.length - SHOW_MAX

  return (
    <div className="fade-up space-y-6">
      <div className="rounded-xl border border-brand/20 bg-brand/4 overflow-hidden">
        <div className="px-5 py-4 border-b border-brand/12 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand/70 mb-0.5">Based on your answers</p>
            <p className="font-serif text-xl text-navy leading-tight">Estimated monthly benefits</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-serif text-3xl text-brand leading-none">€{estimate.total_min.toLocaleString()}</p>
            <p className="text-xs text-navy/40 mt-0.5">up to €{estimate.total_max.toLocaleString()}/mo</p>
          </div>
        </div>
        <div className="divide-y divide-brand/10">
          {visible.map((p) => (
            <div key={p.program_id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {p.confidence === 'likely'
                  ? <CheckCircle2 size={13} className="text-brand shrink-0" />
                  : <AlertCircle size={13} className="text-navy/40 shrink-0" />
                }
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{p.program_name}</p>
                  <p className="text-xs text-navy/40">{p.dutch_name}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-brand">€{p.monthly_min}–€{p.monthly_max}</p>
                <p className="text-xs text-navy/35">/mo</p>
              </div>
            </div>
          ))}
          {hidden > 0 && (
            <div className="px-5 py-3 flex items-center justify-between gap-3 opacity-40 select-none">
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-navy/50 shrink-0" />
                <p className="text-sm text-navy/60">+ {hidden} more program{hidden > 1 ? 's' : ''} to check</p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm bg-navy/20" />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-5 py-2.5 bg-brand/5 border-t border-brand/10">
          <p className="text-xs text-navy/45">✦ Estimates only. Your AI-verified report will show exact amounts.</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-navy">Enter your email to unlock your full AI-verified report</p>
        <input
          type="email"
          placeholder="your@email.com"
          value={data.email ?? ''}
          onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="w-full border border-navy/15 rounded-input px-4 py-3 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all bg-white"
        />
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.subscribeToUpdates ?? false}
            onChange={(e) => setData((d) => ({ ...d, subscribeToUpdates: e.target.checked }))}
            className="mt-0.5 w-4 h-4 accent-brand"
          />
          <span className="text-sm text-navy/55 group-hover:text-navy/75 transition-colors">
            Alert me when my eligibility changes
          </span>
        </label>
        <p className="text-xs text-navy/35">🔒 No spam. Unsubscribe anytime.</p>
        <button
          onClick={submit}
          disabled={!data.email}
          className="btn-primary w-full bg-brand text-white font-medium py-3.5 rounded-input text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Get My Full Report — Free →
        </button>
      </div>
    </div>
  )
}

function StepWrapper({
  emoji,
  title,
  subtitle,
  children,
}: {
  emoji: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="fade-up">
      <div className="mb-6">
        <span className="text-3xl mb-3 block">{emoji}</span>
        <h2 className="font-serif text-2xl text-navy mb-2">{title}</h2>
        <p className="text-navy/55 text-sm">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

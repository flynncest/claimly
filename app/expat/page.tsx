import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const WHO = [
  { label: 'Kennismigranten', desc: 'Highly skilled migrants on a work permit. You pay Dutch taxes and health insurance — you\'re entitled to the full toeslag system.' },
  { label: 'EU / EEA workers', desc: 'If you\'re employed or self-employed in the Netherlands, you qualify for all income-based benefits regardless of nationality.' },
  { label: 'ZZP / Freelancers', desc: 'Self-employed expats often miss out because the rules feel unclear. Your income still qualifies for zorgtoeslag and potentially huurtoeslag.' },
  { label: 'Expat partners', desc: 'Not working? You may still qualify for zorgtoeslag and childcare benefits depending on household income.' },
  { label: 'Non-EU permit holders', desc: 'On a work or family reunification permit. As long as you\'re a legal resident, most Dutch benefits are accessible to you.' },
  { label: 'Recently arrived expats', desc: 'Just moved to the Netherlands? Most benefits can be backdated up to 3 months — don\'t wait to check.' },
]

const PROGRAMS = [
  {
    icon: '🏥',
    name: 'Zorgtoeslag',
    subtitle: 'Healthcare Allowance',
    amount: 'Up to €123/mo',
    what: 'The government subsidises your Dutch health insurance premium every single month, paid directly into your bank account. Most expats pay full price for years without knowing this exists.',
    whoQualifies: 'Age 18+ with Dutch basic health insurance and income below ~€38,520/yr (single) or ~€48,224/yr (partners).',
  },
  {
    icon: '🏠',
    name: 'Huurtoeslag',
    subtitle: 'Rent Benefit',
    amount: 'Up to €400/mo',
    what: 'If you rent and your income is below the threshold, the Dutch government pays part of your rent directly into your account each month. €4,800 per year that most expats never touch.',
    whoQualifies: 'Renting with rent between €315–€808/mo and income below ~€31,340/yr (single). Backdated up to 3 months.',
  },
  {
    icon: '👶',
    name: 'Kinderopvangtoeslag',
    subtitle: 'Childcare Benefit',
    amount: 'Up to 96% of costs',
    what: 'Working parents can reclaim the vast majority of registered daycare and after-school care costs. The lower your income, the higher the percentage reimbursed by the government.',
    whoQualifies: 'Both parents working · Child under 13 · Registered childcare provider.',
  },
  {
    icon: '👨‍👩‍👧',
    name: 'Kindgebonden Budget',
    subtitle: 'Child Supplement',
    amount: 'Up to €270/mo per child',
    what: 'An additional monthly allowance on top of child benefit, paid per child. Single-parent households receive 40% more. Requires a separate application that most parents miss.',
    whoQualifies: '1+ children under 18 and income below ~€55,000/yr. Single parents eligible for a higher amount.',
  },
  {
    icon: '💼',
    name: 'WW-uitkering',
    subtitle: 'Unemployment Benefit',
    amount: '70–75% of last salary',
    what: 'If you lose your job involuntarily, UWV replaces most of your salary for up to 24 months. Non-EU expats with a valid work permit are fully eligible — but you must apply within 1 week of job loss.',
    whoQualifies: 'Worked 26 of last 36 weeks · Lost job involuntarily · Apply within 1 week.',
  },
  {
    icon: '🤝',
    name: 'Bijstandsuitkering',
    subtitle: 'Social Assistance',
    amount: 'Up to €1,187/mo',
    what: 'When all other options are exhausted, the municipality provides a guaranteed minimum income. Few expats know they can access this. EU citizens and permit holders are eligible.',
    whoQualifies: 'Legal resident · All other income and assets below the threshold · Applied through your municipality.',
  },
]

export default function ExpatPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-[#E8DFD0]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
        <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Expat plan · €19.99 one-time</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy mb-4 leading-tight">
          Every Dutch benefit you&apos;re<br />entitled to, fully verified
        </h1>
        <p className="text-navy/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          All 6 Dutch government programs checked against your exact profile. Most expats miss €3,200+ per year — find out in 2 minutes.
        </p>
        <Link
          href="/scan"
          className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-7 py-3.5 rounded-input text-base group"
        >
          Check my eligibility
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <p className="text-navy/35 text-sm mt-3">€19.99 one-time · No subscription · In English · 2 minutes</p>
      </div>
      </div>

      {/* Who is it for */}
      <div className="bg-white border-b border-navy/6 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-6 text-center">Who is this for?</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {WHO.map((w) => (
              <div key={w.label} className="bg-white rounded-xl p-3.5 sm:p-5 border border-navy/8">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-brand mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-navy mb-1">{w.label}</p>
                    <p className="text-xs sm:text-sm text-navy/55 leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-6">What we check</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {PROGRAMS.map((p) => (
            <div key={p.name} className="bg-white rounded-card p-6 border border-navy/10 shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">{p.icon}</span>
                  <div>
                    <p className="font-serif text-base text-navy">{p.name}</p>
                    <p className="text-navy/40 text-xs">{p.subtitle}</p>
                  </div>
                </div>
                <span className="font-serif text-lg text-brand shrink-0 text-right">{p.amount}</span>
              </div>
              <p className="text-navy/65 text-sm leading-relaxed mb-3">{p.what}</p>
              <div className="bg-navy/[0.03] rounded-lg px-3 py-2.5 mb-3">
                <p className="text-[11px] font-semibold text-navy/45 uppercase tracking-wide mb-0.5">Who qualifies</p>
                <p className="text-xs text-navy/65 leading-snug">{p.whoQualifies}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand font-medium">
                <CheckCircle2 size={12} />
                Checked in your report
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#E8DFD0] border-t border-navy/8 py-14">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-navy mb-3">See what you&apos;re actually owed</h2>
          <p className="text-navy/55 mb-7">
            Answer 7 quick questions. Our AI checks all 6 programs against your income, residence status, and household — and tells you exactly what to apply for, with direct links to the official Dutch government sites.
          </p>
          <Link
            href="/scan"
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-7 py-3.5 rounded-input text-base group"
          >
            Get my expat report · €19.99
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-navy/35 text-xs mt-3">One-time payment · No subscription · Report saved to your account</p>
        </div>
      </div>

    </div>
  )
}

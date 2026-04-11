import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const WHO = [
  { label: 'Kennismigranten', desc: 'You pay Dutch taxes every month. The toeslag system is yours to use — most highly skilled migrants claim nothing and lose thousands a year.' },
  { label: 'EU / EEA workers', desc: 'Employed or self-employed in the Netherlands? You qualify for the same income-based benefits as Dutch nationals. Most people just don\'t know where to start.' },
  { label: 'ZZP / Freelancers', desc: 'Irregular income doesn\'t disqualify you. If you\'re registered and paying Dutch health insurance, zorgtoeslag is almost certainly yours.' },
  { label: 'Partners on visa', desc: 'Not working? Your household income still determines what you\'re owed — and a stay-at-home partner can unlock childcare and healthcare support you didn\'t know existed.' },
  { label: 'Non-EU permit holders', desc: 'A valid work or family reunification permit is enough. Legal residence is all you need to access most of the Dutch benefit system.' },
  { label: 'Recently arrived', desc: 'Just moved here? Most benefits backdate up to 3 months. Every week you wait is money you don\'t get back.' },
]

const PROGRAMS = [
  {
    icon: '🏥',
    name: 'Zorgtoeslag',
    subtitle: 'Healthcare Allowance',
    amount: 'Up to €123/mo',
    what: 'Every month you pay for Dutch health insurance, the government is supposed to pay part of it back to you — directly into your bank account. Most international workers pay full price for years without knowing this exists. At €123/mo, that\'s €1,476 a year left on the table.',
    whoQualifies: 'Age 18+ · Dutch basic health insurance · Income below €38,520/yr (single) or €48,224/yr (couple).',
  },
  {
    icon: '🏠',
    name: 'Huurtoeslag',
    subtitle: 'Rent Benefit',
    amount: 'Up to €400/mo',
    what: 'If you rent and your income is below the threshold, the government deposits money into your account every month to help cover it. Not a loan. Not a discount. Cash, monthly, automatically. The average unclaimed amount is €4,800 a year.',
    whoQualifies: 'Renting €315–€808/mo · Income below €31,340/yr (single) · Can be backdated up to 3 months.',
  },
  {
    icon: '👶',
    name: 'Kinderopvangtoeslag',
    subtitle: 'Childcare Benefit',
    amount: 'Up to 96% of costs',
    what: 'The government covers most of your registered daycare and after-school care costs — up to 96% if you\'re on a lower income. Most working parents in the Netherlands are eligible. Most international parents don\'t claim it.',
    whoQualifies: 'Both parents working · Child under 13 · Registered childcare provider.',
  },
  {
    icon: '👨‍👩‍👧',
    name: 'Kindgebonden Budget',
    subtitle: 'Child Supplement',
    amount: 'Up to €270/mo per child',
    what: 'A monthly top-up per child, on top of the standard kinderbijslag. Single parents get 40% more than two-parent households. It requires a separate application — which most parents never make because nobody tells them it exists.',
    whoQualifies: '1+ children under 18 · Income below ~€55,000/yr · Single parents get a higher amount.',
  },
  {
    icon: '💼',
    name: 'WW-uitkering',
    subtitle: 'Unemployment Benefit',
    amount: '70–75% of last salary',
    what: 'If you lose your job in the Netherlands — contract ends, company downsizes, doesn\'t matter — UWV replaces most of your salary for up to 2 years. Non-EU workers with a valid work permit are fully eligible. You must apply within 1 week of job loss.',
    whoQualifies: 'Worked 26 of the last 36 weeks · Job lost involuntarily · Apply within 1 week of losing your job.',
  },
  {
    icon: '🤝',
    name: 'Bijstandsuitkering',
    subtitle: 'Social Assistance',
    amount: 'Up to €1,187/mo',
    what: 'When everything else runs out, the Dutch municipality guarantees a minimum income. It\'s the safety net most international workers don\'t know they can access — and many qualify but never ask. EU citizens and permit holders are eligible.',
    whoQualifies: 'Legal resident · Income and assets below social minimum · Applied via your gemeente (municipality).',
  },
]

export default function WorkersPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-[#E8DFD0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
          <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Benefits Report · €19.99 one-time</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-navy mb-4 leading-tight">
            You&apos;ve been paying into<br />the Dutch system. Time to get something back.
          </h1>
          <p className="text-navy/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            The average international worker in the Netherlands misses €3,200 a year in benefits they&apos;re fully entitled to. Not because they don&apos;t qualify — because nobody told them where to look.
          </p>
          <Link
            href="/scan"
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-7 py-3.5 rounded-input text-base group"
          >
            Find what I&apos;m owed
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-navy/35 text-sm mt-3">€19.99 one-time · No subscription · In English · 2 minutes</p>
        </div>
      </div>

      {/* Who is it for */}
      <div className="bg-white border-b border-navy/6 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-2 text-center">Is this for me?</p>
          <p className="text-center text-navy/50 text-sm mb-8">If you live and pay taxes in the Netherlands, the answer is almost certainly yes.</p>
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
        <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-2">What we check</p>
        <p className="text-navy/50 text-sm mb-8">All 6 programs — scanned against your exact income, household, and residence status.</p>
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
          <h2 className="font-serif text-3xl text-navy mb-3">Stop leaving money behind</h2>
          <p className="text-navy/55 mb-7 leading-relaxed">
            Answer 8 quick questions. DutchClaim checks all 6 programs against your income, household, and residence status — then tells you exactly what to apply for, with step-by-step instructions and direct links to the official Dutch government sites. In English.
          </p>
          <Link
            href="/scan"
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-7 py-3.5 rounded-input text-base group"
          >
            Get my benefits report · €19.99
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-navy/35 text-xs mt-3">One-time payment · No subscription · Report saved to your account</p>
        </div>
      </div>

    </div>
  )
}

import Link from 'next/link'
import { CheckCircle2, ArrowRight, Star, Zap, FileText, TrendingUp } from 'lucide-react'
import PricingTabs from '@/components/PricingTabs'

const NL_BENEFITS = [
  {
    icon: '🏥',
    name: 'Healthcare Allowance',
    dutch: 'Zorgtoeslag',
    amount: 'Up to €123/mo',
    stat: '4.5M people receive it',
    desc: 'The government pays part of your health insurance bill every month — automatically, once you apply. Most expats have no idea they qualify.',
    who: 'Age 18+ · Dutch health insurance · Income below €38,520/yr',
    urgent: 'Most missed by new arrivals',
  },
  {
    icon: '🏠',
    name: 'Rent Benefit',
    dutch: 'Huurtoeslag',
    amount: 'Up to €400/mo',
    stat: '€4,800/yr left on the table',
    desc: 'If you rent and earn below the threshold, the government subsidises your rent directly into your bank account each month.',
    who: 'Renting · Rent €315–€808/mo · Income below €31,340/yr',
    urgent: 'Backdated up to 3 months',
  },
  {
    icon: '👶',
    name: 'Childcare Benefit',
    dutch: 'Kinderopvangtoeslag',
    amount: 'Up to 96% covered',
    stat: 'Average reimbursement €850/mo',
    desc: 'Working parents can claim back the vast majority of daycare and after-school costs. The lower your income, the higher the percentage covered.',
    who: 'Working parents · Registered childcare · Child under 13',
    urgent: 'Many parents underclaim',
  },
  {
    icon: '👨‍👩‍👧',
    name: 'Child Supplement',
    dutch: 'Kindgebonden Budget',
    amount: 'Up to €270/mo per child',
    stat: 'Single parents get 40% more',
    desc: 'An extra monthly allowance on top of kinderbijslag. Paid per child and increases for single-parent households. Often missed because it requires a separate application.',
    who: '1+ children under 18 · Income below €55,000/yr',
    urgent: 'Requires separate claim',
  },
  {
    icon: '💼',
    name: 'Unemployment Benefit',
    dutch: 'WW-uitkering',
    amount: '70–75% of last salary',
    stat: 'Up to 24 months of income',
    desc: 'If you lose your job involuntarily, UWV replaces most of your salary for up to 2 years. Non-EU workers with a valid permit are fully eligible.',
    who: 'Worked 26 of last 36 weeks · Lost job involuntarily',
    urgent: 'Apply within 1 week of job loss',
  },
  {
    icon: '🤝',
    name: 'Social Assistance',
    dutch: 'Bijstandsuitkering',
    amount: 'Up to €1,187/mo',
    stat: 'Last safety net — few know to apply',
    desc: 'When all other options are exhausted, the municipality provides a guaranteed minimum income. EU citizens and permit holders are eligible.',
    who: 'Legal resident · All income/assets below threshold',
    urgent: 'Applied through your municipality',
  },
]

const TESTIMONIALS = [
  {
    quote: "I came from Poland three years ago. Nobody told me about zorgtoeslag or huurtoeslag — I thought those were only for Dutch people. Claimly found €463/month I'd been missing.",
    name: 'Marta W.', role: 'Logistics coordinator, Rotterdam', flag: '🇵🇱',
  },
  {
    quote: 'I finished my masters at TU Delft and stayed to work. I had no idea I qualified for healthcare allowance and rent benefit at the same time. €340/month, just like that.',
    name: 'Reza A.', role: 'Junior engineer, Delft', flag: '🇮🇷',
  },
  {
    quote: 'The 30% ruling is nice but I had no idea toeslagen was completely separate. Claimly explained it clearly in English and I applied the same day.',
    name: 'Ananya R.', role: 'Software engineer, Amsterdam', flag: '🇮🇳',
  },
]

export default function Home() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="dot-grid hero-glow relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center w-full">
          {/* Badge */}
          <div className="fade-up inline-flex items-center gap-2 border border-navy/12 bg-navy/5 text-navy/50 text-xs px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-slow" />
            Netherlands · Updated 2025 / 2026
          </div>

          {/* Headline */}
          <h1
            className="fade-up font-serif text-5xl sm:text-6xl md:text-7xl text-navy leading-[1.07] mb-6 max-w-4xl mx-auto"
            style={{ animationDelay: '0.07s' }}
          >
            €1 billion in benefits goes<br />
            <span className="text-brand">unclaimed in NL every year.</span>
          </h1>

          <p
            className="fade-up text-navy/50 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ animationDelay: '0.14s' }}
          >
            1 in 10 people never claim what they&apos;re owed. Find out in 2 minutes if you&apos;re one of them.
          </p>

          <div
            className="fade-up flex flex-col sm:flex-row justify-center gap-3 mb-14"
            style={{ animationDelay: '0.2s' }}
          >
            <Link
              href="/scan"
              className="btn-primary inline-flex items-center justify-center gap-2 bg-brand text-white font-medium px-6 py-3.5 rounded-input text-base group"
            >
              Check what I&apos;m owed
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-2 border border-navy/20 text-navy/60 hover:text-navy hover:border-navy/40 font-medium px-6 py-3.5 rounded-input text-base transition-colors"
            >
              View pricing
            </Link>
          </div>

          {/* Stats strip */}
          <div
            className="fade-up grid grid-cols-4 gap-px bg-navy/8 rounded-2xl overflow-hidden max-w-3xl mx-auto mb-3"
            style={{ animationDelay: '0.25s' }}
          >
            {[
              { value: '€1B+', label: 'unclaimed benefits per year' },
              { value: '1 in 10', label: 'entitled people never claim' },
              { value: '6', label: 'programs automatically checked' },
              { value: '2 min', label: 'to get your report' },
            ].map((s) => (
              <div key={s.value} className="bg-white/60 px-4 py-4">
                <p className="font-serif text-2xl text-brand mb-0.5">{s.value}</p>
                <p className="text-navy/40 text-xs leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="fade-up text-navy/30 text-xs mb-4" style={{ animationDelay: '0.28s' }}>
            Source: CPB / Rijksoverheid
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">How it works</p>
            <h2 className="font-serif text-4xl text-navy mb-4">No Dutch required. No jargon. Just answers.</h2>
            <p className="text-navy/60 max-w-lg mx-auto">We read the 400-page government guides so you don&apos;t have to.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: <FileText size={20} />, title: 'Tell us your situation', desc: 'Answer 7 quick questions about where you live, your work status, income, and family. No Dutch needed.' },
              { step: '2', icon: <Zap size={20} />, title: 'We check every program', desc: 'Our AI scans all 6 Dutch government benefit programs against your profile using the latest 2025/2026 eligibility rules.' },
              { step: '3', icon: <CheckCircle2 size={20} />, title: 'See exactly what you\'re owed', desc: 'Get a plain-English report with each benefit, the monthly amount, and a direct link to apply on the official Dutch government site.' },
            ].map((item, i) => (
              <div
                key={item.step}
                className="fade-up relative bg-white rounded-card p-7 border border-navy/8"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute top-5 right-5 font-serif text-6xl font-bold text-navy/5 leading-none select-none">{item.step}</div>
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand mb-5">{item.icon}</div>
                <h3 className="font-serif text-xl text-navy mb-2">{item.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/scan" className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-6 py-3 rounded-input">
              Start your free scan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BENEFITS COVERED ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Benefits covered</p>
            <h2 className="font-serif text-4xl text-navy mb-3">Every Dutch program, automatically checked</h2>
            <p className="text-navy/60 max-w-md mx-auto">
              All 6 major Dutch government benefit programs — checked against your profile in one scan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NL_BENEFITS.map((b) => (
              <div key={b.dutch} className="rounded-card p-6 border border-navy/10 bg-[#FAFAF8] flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5 shrink-0">{b.icon}</span>
                  <div>
                    <p className="font-semibold text-navy text-sm leading-snug">{b.name}</p>
                    <p className="text-navy/40 text-xs">{b.dutch}</p>
                  </div>
                </div>
                <div>
                  <p className="font-serif text-2xl text-brand leading-none mb-1">{b.amount}</p>
                  <p className="text-xs text-navy/40 italic">{b.stat}</p>
                </div>
                <p className="text-navy/60 text-sm leading-relaxed flex-1">{b.desc}</p>
                <div className="border-t border-navy/6 pt-3 flex flex-col gap-2">
                  <p className="text-xs text-navy/45 leading-snug">{b.who}</p>
                  <span className="self-start text-xs font-medium text-brand bg-brand/8 px-2 py-0.5 rounded-full">
                    {b.urgent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Real results</p>
            <h2 className="font-serif text-4xl text-navy">Expats finding what they&apos;re owed</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="fade-up bg-[#F5F1EB] border border-navy/8 rounded-card p-7 hover:bg-[#EDE9E0] transition-colors"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} className="fill-brand text-brand" />)}
                </div>
                <p className="text-navy/65 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{t.flag}</span>
                  <div>
                    <p className="text-navy text-sm font-medium">{t.name}</p>
                    <p className="text-navy/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TABS ── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="font-serif text-4xl text-navy mb-3">Your scan is always free.</h2>
            <p className="text-navy/60 max-w-sm mx-auto">
              Pay once to unlock the full AI-verified report. No subscription, ever.
            </p>
          </div>
          <PricingTabs />
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp size={22} className="text-brand" />
          </div>
          <h2 className="font-serif text-4xl text-navy mb-4">
            You moved here. The benefits system didn&apos;t send you a welcome letter.
          </h2>
          <p className="text-navy/55 text-lg mb-9 leading-relaxed">
            Most expats in the Netherlands miss €3,200+ per year in benefits they&apos;re fully entitled to.
            It&apos;s not your fault — the system is in Dutch and nobody explains it.
            Check yours free, right now.
          </p>
          <Link
            href="/scan"
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-8 py-4 rounded-input text-base"
          >
            Find What You&apos;re Owed <ArrowRight size={18} />
          </Link>
          <p className="text-navy/35 text-sm mt-4">Free · No account required · In English · 2 minutes</p>
        </div>
      </section>

    </div>
  )
}

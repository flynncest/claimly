import Link from 'next/link'
import { CheckCircle2, ArrowRight, Star, Zap, FileText, TrendingUp } from 'lucide-react'
import PricingTabs from '@/components/PricingTabs'

const NL_BENEFITS = [
  {
    icon: '🏥',
    name: 'Healthcare Allowance',
    dutch: 'Zorgtoeslag',
    amount: 'Up to €123/mo',
    stat: '4.5M recipients',
    desc: 'Government subsidises your health insurance monthly. Most expats qualify without knowing.',
    urgent: 'Most missed by arrivals',
  },
  {
    icon: '🏠',
    name: 'Rent Benefit',
    dutch: 'Huurtoeslag',
    amount: 'Up to €400/mo',
    stat: '€4,800/yr unclaimed avg',
    desc: 'Renting under €808/mo? Government pays part of it directly into your account.',
    urgent: 'Backdated up to 3 months',
  },
  {
    icon: '👶',
    name: 'Childcare Benefit',
    dutch: 'Kinderopvangtoeslag',
    amount: 'Up to 96% covered',
    stat: 'Avg €850/mo refund',
    desc: 'Working parents recover the majority of daycare and BSO costs through the tax authority.',
    urgent: 'Many parents underclaim',
  },
  {
    icon: '👨‍👩‍👧',
    name: 'Child Supplement',
    dutch: 'Kindgebonden Budget',
    amount: 'Up to €270/mo per child',
    stat: 'Single parents get +40%',
    desc: 'Monthly top-up per child on top of kinderbijslag. Requires a separate claim.',
    urgent: 'Separate claim required',
  },
  {
    icon: '💼',
    name: 'Unemployment Benefit',
    dutch: 'WW-uitkering',
    amount: '70–75% of last salary',
    stat: 'Up to 24 months',
    desc: 'Lost your job? UWV replaces most of your income for up to 2 years.',
    urgent: 'Apply within 1 week',
  },
  {
    icon: '🤝',
    name: 'Social Assistance',
    dutch: 'Bijstandsuitkering',
    amount: 'Up to €1,187/mo',
    stat: 'Last safety net',
    desc: 'Municipality provides a guaranteed minimum when all other income is exhausted.',
    urgent: 'Via your gemeente',
  },
  {
    icon: '📚',
    name: 'Student Finance',
    dutch: 'DUO Studiefinanciering',
    amount: 'Up to €1,100/mo',
    stat: 'EU students eligible',
    desc: 'Monthly grant + supplementary bursary for students at Dutch universities, HBO, and MBO.',
    urgent: 'Students only',
  },
  {
    icon: '🚆',
    name: 'Free Travel Pass',
    dutch: 'OV-studentenkaart',
    amount: 'Free train & bus',
    stat: '~€1,500/yr value',
    desc: 'Free weekday or weekend public transport across the Netherlands for eligible students.',
    urgent: 'Via DUO application',
  },
]

const TESTIMONIALS = [
  {
    quote: "Nobody told me about zorgtoeslag or huurtoeslag — I thought those were only for Dutch people. Claimly found €463/month I'd been missing.",
    name: 'Marta W.',
    role: 'Logistics coordinator, Rotterdam',
    flag: '🇵🇱',
  },
  {
    quote: "My wife and I moved from Texas for my job. We had no idea the Dutch government offers rent and healthcare support for expat families. Claimly walked us through everything.",
    name: 'James H.',
    role: 'Product manager + family, Amsterdam',
    flag: '🇺🇸',
  },
  {
    quote: "As a student at TU Delft I didn't know I could get zorgtoeslag — and Claimly flagged DUO grants I hadn't fully claimed. €890/mo I almost missed.",
    name: 'Lukas B.',
    role: 'MSc student, Delft',
    flag: '🇩🇪',
  },
]

export default function Home() {
  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="dot-grid hero-glow relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center w-full">
          <div className="fade-up inline-flex items-center gap-2 border border-navy/12 bg-navy/5 text-navy/50 text-xs px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-slow" />
            Netherlands · Updated 2025 / 2026
          </div>

          <h1
            className="fade-up font-serif text-4xl sm:text-6xl md:text-7xl text-navy leading-[1.07] mb-6 max-w-4xl mx-auto"
            style={{ animationDelay: '0.07s' }}
          >
            €1 billion in benefits goes<br />
            <span className="text-brand">unclaimed in NL every year.</span>
          </h1>

          <p
            className="fade-up text-navy/50 text-base sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
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

          <div
            className="fade-up grid grid-cols-4 gap-px bg-navy/8 rounded-2xl overflow-hidden max-w-3xl mx-auto mb-3"
            style={{ animationDelay: '0.25s' }}
          >
            {[
              { value: '€1B+',   label: 'unclaimed per year' },
              { value: '1 in 10', label: 'never claim' },
              { value: '8',      label: 'programs checked' },
              { value: '2 min',  label: 'to get results' },
            ].map((s) => (
              <div key={s.value} className="bg-white/60 px-2 sm:px-4 py-4">
                <p className="font-serif text-xl sm:text-2xl text-brand mb-0.5">{s.value}</p>
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
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">How it works</p>
            <h2 className="font-serif text-2xl sm:text-4xl text-navy mb-3">No Dutch required. Just answers.</h2>
            <p className="text-navy/60 text-sm max-w-lg mx-auto">We read the 400-page government guides so you don&apos;t have to.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { step: '1', icon: <FileText size={18} />, title: 'Tell us your situation', desc: 'A few quick questions about your status, income, and family. In English.' },
              { step: '2', icon: <Zap size={18} />, title: 'We check every program', desc: 'AI scans all 8 Dutch benefit programs against your profile using 2025/2026 rules.' },
              { step: '3', icon: <CheckCircle2 size={18} />, title: 'See what you\'re owed', desc: 'Plain-English report with each benefit, monthly amount, and direct apply link.' },
            ].map((item, i) => (
              <div
                key={item.step}
                className="fade-up relative bg-white rounded-card p-4 sm:p-7 border border-navy/8"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute top-4 right-4 font-serif text-5xl sm:text-6xl font-bold text-navy/5 leading-none select-none">{item.step}</div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand mb-4">{item.icon}</div>
                <h3 className="font-serif text-base sm:text-xl text-navy mb-1.5">{item.title}</h3>
                <p className="text-navy/60 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/scan" className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-6 py-3 rounded-input text-sm">
              Start your free scan <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BENEFITS COVERED ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Benefits covered</p>
            <h2 className="font-serif text-2xl sm:text-4xl text-navy mb-2">Every program, automatically checked</h2>
            <p className="text-navy/60 text-sm max-w-sm mx-auto">
              8 programs — expat and student — all scanned in one go.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {NL_BENEFITS.map((b) => (
              <div key={b.dutch} className="rounded-card p-4 border border-navy/10 bg-[#FAFAF8] flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl shrink-0">{b.icon}</span>
                  <div>
                    <p className="font-semibold text-navy text-xs leading-snug">{b.name}</p>
                    <p className="text-navy/40 text-xs">{b.dutch}</p>
                  </div>
                </div>
                <div>
                  <p className="font-serif text-lg sm:text-xl text-brand leading-none mb-0.5">{b.amount}</p>
                  <p className="text-xs text-navy/35 italic">{b.stat}</p>
                </div>
                <p className="text-navy/55 text-xs leading-relaxed flex-1">{b.desc}</p>
                <span className="self-start text-xs font-medium text-brand bg-brand/8 px-2 py-0.5 rounded-full">
                  {b.urgent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Real results</p>
            <h2 className="font-serif text-2xl sm:text-4xl text-navy">Expats finding what they&apos;re owed</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="fade-up bg-[#F5F1EB] border border-navy/8 rounded-card p-5 sm:p-7 hover:bg-[#EDE9E0] transition-colors"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-brand text-brand" />)}
                </div>
                <p className="text-navy/65 text-xs sm:text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2">
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
      <section id="pricing" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="font-serif text-2xl sm:text-4xl text-navy mb-3">Your scan is always free.</h2>
            <p className="text-navy/60 text-sm max-w-sm mx-auto">
              Pay once to unlock the full AI-verified report. No subscription, ever.
            </p>
          </div>
          <PricingTabs />
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-5">
            <TrendingUp size={20} className="text-brand" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-navy mb-4">
            You moved here. The benefits system didn&apos;t send you a welcome letter.
          </h2>
          <p className="text-navy/55 text-sm sm:text-lg mb-8 leading-relaxed">
            Most expats in the Netherlands miss €3,200+ per year they&apos;re fully entitled to.
            The system is in Dutch and nobody explains it. Check yours free in 2 minutes.
          </p>
          <Link
            href="/scan"
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-7 py-3.5 rounded-input text-base"
          >
            Find What You&apos;re Owed <ArrowRight size={16} />
          </Link>
          <p className="text-navy/35 text-sm mt-4">Free · No account required · In English · 2 minutes</p>
        </div>
      </section>

    </div>
  )
}

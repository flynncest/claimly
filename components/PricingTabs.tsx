import Link from 'next/link'
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    label: 'Free',
    price: '€0',
    priceNote: 'always free',
    cta: 'Start free scan',
    href: '/scan',
    popular: false,
    description: 'Not sure if you qualify? Get an instant estimate in under 2 minutes — no account, no AI, no payment.',
    features: [
      { icon: <Zap size={14} />, text: 'Instant eligibility estimate across all 6 NL programs' },
      { icon: <CheckCircle2 size={14} />, text: 'Estimated monthly range based on your answers' },
      { icon: <CheckCircle2 size={14} />, text: 'Fact-checked against 2025/2026 government rules' },
      { icon: <CheckCircle2 size={14} />, text: 'No account required — results shown immediately' },
    ],
    note: 'Upgrade to unlock AI-verified amounts and step-by-step guidance.',
  },
  {
    id: 'student',
    label: 'Student',
    price: '€13.99',
    priceNote: 'one-time',
    cta: 'Get student report',
    href: '/scan',
    popular: false,
    description: 'The 3 programs every international student in the Netherlands can claim — AI-checked against your exact situation.',
    forWho: ['EU/EEA students', 'International students', 'Part-time student workers'],
    programs: [
      {
        icon: '🎓',
        name: 'DUO Studiefinanciering',
        hook: 'Up to €1,100/mo in grants most international students never apply for',
      },
      {
        icon: '🚂',
        name: 'OV-studentenkaart',
        hook: 'Free travel on all Dutch trains & buses — yours to claim, if you qualify',
      },
      {
        icon: '🏥',
        name: 'Zorgtoeslag',
        hook: 'Government pays part of your health insurance bill every month',
      },
    ],
  },
  {
    id: 'expat',
    label: 'Expat',
    price: '€19.99',
    priceNote: 'one-time',
    cta: 'Get expat report',
    href: '/scan',
    popular: true,
    description: 'All 6 Dutch programs fully verified. Most expats miss €3,200+ per year — find every euro you\'re entitled to.',
    forWho: ['Kennismigrant', 'EU worker', 'ZZP / freelancer', 'Expat partner', 'Non-EU permit holder'],
    programs: [
      {
        icon: '🏥',
        name: 'Zorgtoeslag',
        hook: 'Hundreds of euros a year — most expats pay full price without realising they don\'t have to',
      },
      {
        icon: '🏠',
        name: 'Huurtoeslag',
        hook: '€4,800/yr in rent subsidies left unclaimed every year by people exactly like you',
      },
      {
        icon: '👶',
        name: 'Kinderopvangtoeslag',
        hook: 'The government covers up to 96% of your childcare bill',
      },
      {
        icon: '👨‍👩‍👧',
        name: 'Kindgebonden Budget',
        hook: 'Extra money per child every month — single parents get 40% more',
      },
      {
        icon: '💼',
        name: 'WW-uitkering',
        hook: 'Up to 24 months of income protection if you ever lose your job',
      },
      {
        icon: '🤝',
        name: 'Bijstandsuitkering',
        hook: 'The safety net most residents don\'t know they can access',
      },
    ],
  },
]

export default function PricingTabs() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`rounded-2xl flex flex-col overflow-hidden ${
            plan.popular
              ? 'bg-white ring-2 ring-brand shadow-card-lg'
              : 'bg-white border border-navy/10 shadow-card'
          }`}
        >
          {/* Popular bar */}
          <div className={`h-7 flex items-center justify-center text-xs font-semibold ${
            plan.popular ? 'bg-brand/10 text-brand' : ''
          }`}>
            {plan.popular ? 'Most popular' : ''}
          </div>

          {/* Header */}
          <div className="px-6 pt-3 pb-5 border-b border-navy/6">
            <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-1.5">{plan.label}</p>
            <div className="flex items-baseline gap-1.5 mb-2.5">
              <span className="font-serif text-3xl text-navy">{plan.price}</span>
              <span className="text-navy/40 text-sm">{plan.priceNote}</span>
            </div>
            <p className="text-navy/60 text-sm leading-relaxed mb-3">{plan.description}</p>
            {'forWho' in plan && plan.forWho && (
              <div className="flex flex-wrap gap-1.5">
                {plan.forWho.map((w) => (
                  <span key={w} className="text-[11px] bg-navy/5 text-navy/55 px-2 py-0.5 rounded-full">{w}</span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-5">
            {'features' in plan && plan.features ? (
              <div className="space-y-3.5">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-brand mt-0.5 shrink-0">{f.icon}</span>
                    <p className="text-sm text-navy/70 leading-snug">{f.text}</p>
                  </div>
                ))}
                {plan.note && (
                  <p className="text-xs text-navy/35 italic pt-2 border-t border-navy/6">{plan.note}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {plan.programs.map((p) => (
                  <div key={p.name} className="flex items-start gap-3">
                    <span className="text-xl shrink-0 leading-none mt-0.5">{p.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-navy leading-snug">{p.name}</p>
                      <p className="text-sm text-navy/55 leading-snug mt-0.5">{p.hook}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 pt-2">
            <Link
              href={plan.href}
              className={`inline-flex items-center justify-center gap-2 w-full font-medium py-3 rounded-input text-sm transition-colors group ${
                plan.popular
                  ? 'bg-brand text-white hover:bg-brand/90'
                  : 'border border-navy/15 text-navy hover:bg-navy/5'
              }`}
            >
              {plan.cta}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            {plan.id !== 'free' && (
              <p className="text-xs text-navy/30 text-center mt-2">One-time · No subscription</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

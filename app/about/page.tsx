import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <p className="text-brand text-sm font-medium uppercase tracking-wider mb-3">
            About
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-navy mb-6 leading-tight">
            You moved to NL or BE. The benefits system didn&apos;t send you a manual.
          </h1>
          <div className="prose prose-navy max-w-none space-y-4 text-navy/70 leading-relaxed">
            <p>
              Whether you came for a job, stayed after university, moved for a
              partner, or were granted status after a long journey — the Dutch and
              Belgian benefits systems have programs you may be fully entitled to.
              Healthcare allowances, rent subsidies, child benefits, unemployment
              support. Real money, every month.
            </p>
            <p>
              The problem isn&apos;t eligibility. The problem is that the system
              is in Dutch, scattered across multiple government portals, and
              nobody proactively tells you it exists. EU workers, international
              graduates, people on work permits, 30%-ruling holders who don&apos;t
              know toeslagen is completely separate — thousands of euros go
              unclaimed every year not because people aren&apos;t entitled, but
              because they weren&apos;t told.
            </p>
            <p>
              DutchClaim fixes that. We&apos;ve built an AI trained on the complete
              2025/2026 eligibility rules for every major NL and BE benefit
              program. You answer 8 questions. We tell you exactly what you
              qualify for, how much to expect, and link you directly to apply —
              in plain English, in under 2 minutes.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {[
            { label: 'Countries covered', value: '2', sub: 'NL & BE' },
            { label: 'Benefit programs', value: '9+', sub: 'and growing' },
            { label: 'Languages', value: '3', sub: 'EN, NL, FR (soon)' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-card p-5 shadow-card text-center"
            >
              <p className="font-serif text-3xl text-brand mb-1">{s.value}</p>
              <p className="text-navy font-medium text-sm">{s.label}</p>
              <p className="text-navy/40 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-card p-7 shadow-card mb-8">
          <h2 className="font-serif text-2xl text-navy mb-4">Our principles</h2>
          <ul className="space-y-4">
            {[
              {
                title: 'Conservative by design',
                desc: "We only tell you you're eligible when we're confident. Overpromising leads to disappointment. We'd rather undersell and have you pleasantly surprised.",
              },
              {
                title: 'Plain English, always',
                desc: "Government language is hard enough in your native language. We translate every benefit name, condition, and process into clear, friendly English.",
              },
              {
                title: 'Privacy first',
                desc: "Your income and family details are sensitive. We use them only to calculate eligibility, never to advertise to you, and we never sell your data.",
              },
              {
                title: 'Not advice, but guidance',
                desc: "We're not lawyers or tax advisors. Our results are estimates based on publicly available rules. Always verify with official sources — we make that easy by linking directly.",
              },
            ].map((p) => (
              <li key={p.title} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <div>
                  <p className="font-medium text-navy text-sm">{p.title}</p>
                  <p className="text-navy/60 text-sm leading-relaxed mt-0.5">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/scan"
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-6 py-3.5 rounded-input"
          >
            Check your benefits <ArrowRight size={16} />
          </Link>
          <p className="text-navy/40 text-sm mt-3">
            Free · No account required · 2 minutes
          </p>
        </div>
      </div>
    </div>
  )
}

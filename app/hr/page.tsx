'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Users, TrendingUp, Clock, Shield } from 'lucide-react'

const VALUE_PROPS = [
  {
    icon: <Clock size={20} />,
    title: 'Cut repetitive admin questions',
    desc: 'New international joiners always ask "what benefits am I entitled to?" DutchClaim answers it automatically, before they ask you.',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Faster, happier onboarding',
    desc: 'When people understand their full financial picture on day one, they feel more welcome — and more likely to stay.',
  },
  {
    icon: <Users size={20} />,
    title: 'Built for fast-growing teams',
    desc: 'If you hire 5–10 international employees per month, the benefits questions stack up fast. DutchClaim scales with your intake.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Compliant by default',
    desc: 'Our data processing agreement and GDPR-ready infrastructure means your team can deploy without a compliance review.',
  },
]

export default function HRPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    teamSize: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate submission
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-navy py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full mb-6 border border-white/15">
              <Users size={12} />
              For HR &amp; People Teams
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-white mb-5 leading-tight">
              Stop answering the same benefits question{' '}
              <span className="text-brand/80">for every new joiner.</span>
            </h1>
            <p className="text-white/65 text-lg leading-relaxed mb-8">
              If you&apos;re onboarding international talent monthly — like ASML, Adyen,
              or Booking.com-sized scaleups do — DutchClaim for Teams handles the
              &ldquo;what benefits am I entitled to?&rdquo; question automatically, in English,
              before your new hire sends the Slack message.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#demo"
                className="btn-primary bg-brand text-white font-medium px-6 py-3.5 rounded-input text-base text-center"
              >
                Request a Demo
              </a>
              <Link
                href="/pricing"
                className="border border-white/30 text-white font-medium px-6 py-3.5 rounded-input text-base hover:bg-white/10 transition-colors text-center"
              >
                See Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-navy mb-3">
              Built for teams that hire internationally at scale
            </h2>
            <p className="text-navy/60 max-w-xl mx-auto">
              The right tool when you&apos;re onboarding 5–50 international hires per month.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUE_PROPS.map((vp) => (
              <div key={vp.title} className="bg-white rounded-card p-6 shadow-card">
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-brand mb-4">
                  {vp.icon}
                </div>
                <h3 className="font-serif text-lg text-navy mb-2">{vp.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{vp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works for HR */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-navy text-center mb-10">
            How it works for your team
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Set up your account', desc: 'Upload your company logo, add team members, and configure your branded report template.' },
              { step: '02', title: 'Invite employees', desc: "Send a personalized DutchClaim link to each new hire with one click from your HR dashboard." },
              { step: '03', title: 'They scan in minutes', desc: "Your employee answers 8 questions and receives a personalized benefits report instantly." },
              { step: '04', title: 'You see the results', desc: "Track who has scanned, their eligibility status, and aggregate benefit data across your team." },
            ].map((s, i) => (
              <div key={s.step} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 right-0 w-1/2 h-px bg-navy/10 translate-x-1/2" />
                )}
                <div className="w-12 h-12 bg-navy text-white font-serif text-lg rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  {parseInt(s.step)}
                </div>
                <h3 className="font-serif text-base text-navy mb-2">{s.title}</h3>
                <p className="text-navy/55 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features list */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-3xl text-navy mb-6">
                Everything your HR team needs
              </h2>
              <ul className="space-y-3">
                {[
                  'Unlimited employee benefit scans',
                  'White-label reports with your company branding',
                  'HR admin dashboard with team overview',
                  'Bulk onboarding via CSV or HRIS integration',
                  'Aggregate analytics — total benefits found across team',
                  'Change monitoring — automatic re-scan when rules update',
                  'Employee invite flow via email or Slack',
                  'Downloadable PDF reports per employee',
                  'Data processing agreement (DPA) included',
                  'Dedicated customer success manager',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 size={15} className="text-brand mt-0.5 shrink-0" />
                    <span className="text-navy/70">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-navy rounded-card p-6 text-white">
              <p className="text-brand font-serif text-4xl mb-2">€299</p>
              <p className="text-white/50 text-sm mb-5">/month · unlimited employees</p>
              <div className="space-y-3 text-sm text-white/70 mb-6">
                <p>For a team of 20 international hires each missing €3,200/year, DutchClaim pays for itself <span className="text-white font-medium">18× over</span> — plus you eliminate dozens of HR hours fielding the same questions.</p>
              </div>
              <a href="#demo" className="btn-primary block text-center bg-brand text-white font-medium py-3 rounded-input text-sm">
                Request a Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Demo request form */}
      <section id="demo" className="py-16 bg-white px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-navy mb-2">
              Request a demo
            </h2>
            <p className="text-navy/60 text-sm">
              We&apos;ll walk you through the platform in 20 minutes and set up your first team invite that day.
            </p>
          </div>

          {submitted ? (
            <div className="bg-brand-50 border border-brand/20 rounded-card p-6 text-center">
              <CheckCircle2 size={32} className="text-brand mx-auto mb-3" />
              <h3 className="font-serif text-xl text-navy mb-2">
                Thanks! We&apos;ll be in touch.
              </h3>
              <p className="text-navy/60 text-sm">
                Expect a reply within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-card p-7 shadow-card space-y-4">
              {[
                { label: 'Your name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
                { label: 'Company', key: 'company', type: 'text', placeholder: 'Acme Corp' },
                { label: 'Work email', key: 'email', type: 'email', placeholder: 'jane@company.com' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-navy/60 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    required
                    className="w-full border border-navy/15 rounded-input px-4 py-2.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-navy/60 mb-1.5">
                  Team size (approx.)
                </label>
                <select
                  value={form.teamSize}
                  onChange={(e) => setForm((f) => ({ ...f, teamSize: e.target.value }))}
                  required
                  className="w-full border border-navy/15 rounded-input px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all bg-white"
                >
                  <option value="">Select team size</option>
                  <option value="5-20">5–20 employees</option>
                  <option value="20-100">20–100 employees</option>
                  <option value="100-500">100–500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full bg-brand text-white font-medium py-3 rounded-input text-sm disabled:opacity-50 mt-2"
              >
                {loading ? 'Sending...' : 'Request a Demo →'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

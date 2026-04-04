import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const WHO = [
  { label: 'EU/EEA students', desc: 'Studying at a Dutch MBO, HBO or university. Likely eligible for full DUO package including basisbeurs and OV-kaart.' },
  { label: 'International students (non-EU)', desc: 'On a valid student residence permit. May qualify for Zorgtoeslag and, in some cases, the OV-kaart if working alongside your study.' },
  { label: 'Students working part-time', desc: 'Working 32+ hours per week alongside your studies strengthens your DUO eligibility, especially for non-EU students.' },
  { label: 'Exchange students', desc: 'Limited eligibility — we\'ll check what applies based on your enrolment type and residence permit.' },
]

const PROGRAMS = [
  {
    icon: '🎓',
    name: 'DUO Studiefinanciering',
    subtitle: 'Student Finance',
    amount: 'Up to €1,100/mo',
    what: 'The Dutch government funds part of your studies through DUO. This includes a basic living grant (basisbeurs) and, if your parents\' income is below a threshold, a supplementary grant (aanvullende beurs) on top.',
    whoQualifies: 'EU/EEA students enrolled at an accredited Dutch institution. Non-EU students on a valid residence permit may qualify for the OV-kaart component.',
    url: 'https://duo.nl/particulier/student-hbo-of-universiteit/',
  },
  {
    icon: '🚂',
    name: 'OV-studentenkaart',
    subtitle: 'Free Public Transport Pass',
    amount: 'Free travel',
    what: 'A card that lets you travel for free on all Dutch trains, buses, trams, and metros — either on weekdays or weekends, your choice. It\'s included with your DUO student finance. Most international students have no idea they can apply.',
    whoQualifies: 'Students receiving DUO studiefinanciering. You pick weekday or weekend free travel when you activate it.',
    url: 'https://duo.nl/particulier/student-hbo-of-universiteit/ov-studentenkaart/',
  },
  {
    icon: '🏥',
    name: 'Zorgtoeslag',
    subtitle: 'Healthcare Allowance',
    amount: 'Up to €123/mo',
    what: 'The Dutch government subsidises your health insurance premium every month, paid directly into your bank account. The lower your income, the higher the monthly amount. Most students in the Netherlands qualify.',
    whoQualifies: 'Anyone with Dutch basic health insurance (basisverzekering) and income below ~€38,520/yr. Most students qualify.',
    url: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/zorgtoeslag',
  },
]

export default function StudentsPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-[#E8DFD0]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
        <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Student plan · €13.99 one-time</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy mb-4 leading-tight">
          3 things every student<br />in the Netherlands is owed
        </h1>
        <p className="text-navy/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Nobody sends you a welcome letter. These benefits exist — most international students just never find out about them.
        </p>
        <Link
          href="/scan"
          className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-7 py-3.5 rounded-input text-base group"
        >
          Check my eligibility
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <p className="text-navy/35 text-sm mt-3">€13.99 one-time · No subscription · In English · 2 minutes</p>
      </div>
      </div>

      {/* Who is it for */}
      <div className="bg-white border-b border-navy/6 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-6 text-center">Who is this for?</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-5">
        <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-6">What we check</p>
        {PROGRAMS.map((p) => (
          <div key={p.name} className="bg-white rounded-card p-7 border border-navy/10 shadow-card">
            <div className="flex items-start gap-4 mb-5">
              <span className="text-3xl shrink-0">{p.icon}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-serif text-xl text-navy">{p.name}</p>
                    <p className="text-navy/45 text-sm">{p.subtitle}</p>
                  </div>
                  <span className="font-serif text-2xl text-brand shrink-0">{p.amount}</span>
                </div>
              </div>
            </div>
            <p className="text-navy/65 text-sm leading-relaxed mb-4">{p.what}</p>
            <div className="bg-navy/[0.03] rounded-xl px-4 py-3 mb-4">
              <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1">Who qualifies</p>
              <p className="text-sm text-navy/70">{p.whoQualifies}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand font-medium">
              <CheckCircle2 size={13} />
              Checked in your report
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#E8DFD0] border-t border-navy/8 py-14">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-navy mb-3">Ready to see what you qualify for?</h2>
          <p className="text-navy/55 mb-7">
            Answer 7 quick questions. We&apos;ll check all 3 programs against your situation and explain exactly what you&apos;re entitled to — and how to apply.
          </p>
          <Link
            href="/scan"
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-7 py-3.5 rounded-input text-base group"
          >
            Get my student report · €13.99
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-navy/35 text-xs mt-3">One-time payment · No subscription · Report saved to your account</p>
        </div>
      </div>

    </div>
  )
}

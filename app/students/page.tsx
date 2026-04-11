import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const WHO = [
  { label: 'EU/EEA students', desc: 'Studying at a Dutch MBO, HBO or university? You almost certainly qualify for the full DUO package — including monthly grants and free travel — and can apply immediately.' },
  { label: 'International students (non-EU)', desc: 'On a valid student residence permit and paying Dutch health insurance? You\'re likely missing Zorgtoeslag every month without knowing it.' },
  { label: 'Students working part-time', desc: 'Working alongside your studies makes you more eligible, not less. 32+ hours per week can unlock DUO benefits that most students assume are out of reach.' },
  { label: 'Exchange students', desc: 'Eligibility varies by programme and permit type — but it\'s worth checking. You may qualify for healthcare support even on a short-term stay.' },
]

const PROGRAMS = [
  {
    icon: '🎓',
    name: 'DUO Studiefinanciering',
    subtitle: 'Student Finance',
    amount: 'Up to €1,100/mo',
    what: 'The Dutch government funds part of your cost of living while you study — through a monthly basic grant (basisbeurs) and, if your parents\' income is low enough, a supplementary grant (aanvullende beurs) on top. Most international students at Dutch universities qualify and claim nothing. You can apply from the month you enrol — and you can\'t backdate it if you miss the window.',
    whoQualifies: 'EU/EEA students enrolled at an accredited Dutch MBO, HBO or university. Non-EU students on a valid residence permit may qualify for portions of the package.',
    url: 'https://duo.nl/particulier/student-hbo-of-universiteit/',
  },
  {
    icon: '🚂',
    name: 'OV-studentenkaart',
    subtitle: 'Free Public Transport Pass',
    amount: 'Free travel',
    what: 'Trains, buses, trams, metros — free, across the entire Netherlands, every weekday or weekend (you pick). This card comes with your DUO student finance and is worth roughly €100–150/mo in equivalent travel costs. The vast majority of international students never apply for it. You just need to activate it through DUO.',
    whoQualifies: 'Students receiving DUO studiefinanciering. You choose weekday or weekend travel when you activate.',
    url: 'https://duo.nl/particulier/ov-en-reizen/aanvragen.jsp',
  },
  {
    icon: '🏥',
    name: 'Zorgtoeslag',
    subtitle: 'Healthcare Allowance',
    amount: 'Up to €123/mo',
    what: 'If you\'re paying for Dutch health insurance — which most students in the Netherlands are required to do — the government is supposed to pay part of it back every month. It goes directly into your bank account. At €123/mo on a lower student income, that\'s nearly €1,500 a year. Most students in the Netherlands qualify. Very few claim it.',
    whoQualifies: 'Anyone with Dutch basic health insurance (basisverzekering) and income below ~€38,520/yr. Most students qualify.',
    url: 'https://www.government.nl/topics/health-insurance/applying-for-healthcare-benefit',
  },
]

export default function StudentsPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-[#E8DFD0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
          <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Student Report · €13.99 one-time</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-navy mb-4 leading-tight">
            You&apos;re a student in the Netherlands.<br />Here&apos;s what you&apos;re owed.
          </h1>
          <p className="text-navy/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            DUO grants, free travel, and healthcare support — most international students qualify for all three and claim none of them. Find out exactly what&apos;s yours before the deadlines pass.
          </p>
          <Link
            href="/scan"
            className="btn-primary inline-flex items-center gap-2 bg-brand text-white font-medium px-7 py-3.5 rounded-input text-base group"
          >
            Check what I&apos;m owed
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-navy/35 text-sm mt-3">€13.99 one-time · No subscription · In English · 2 minutes</p>
        </div>
      </div>

      {/* Who is it for */}
      <div className="bg-white border-b border-navy/6 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-2 text-center">Is this for me?</p>
          <p className="text-center text-navy/50 text-sm mb-8">If you study at a Dutch institution, the answer is probably yes — whatever your nationality.</p>
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
        <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-2">The 3 programs we check</p>
        <p className="text-navy/50 text-sm mb-8">Each one verified against your exact enrolment, income, and residence status.</p>
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
          <h2 className="font-serif text-3xl text-navy mb-3">Don&apos;t leave before checking what&apos;s yours</h2>
          <p className="text-navy/55 mb-7 leading-relaxed">
            Answer 8 quick questions. We check all 3 programs against your enrolment, income, and situation — and show you exactly what you qualify for, how much it pays, and how to apply. Before the deadlines close.
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

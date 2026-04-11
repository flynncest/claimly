import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ — DutchClaim | Dutch Benefits Questions Answered',
  description: 'Common questions about Dutch government benefits — Zorgtoeslag, Huurtoeslag, Kinderopvangtoeslag, WW, DUO — answered in English for internationals living in the Netherlands.',
  openGraph: {
    title: 'FAQ — DutchClaim',
    description: 'Everything you need to know about Dutch benefits, eligibility, and how DutchClaim works.',
  },
}

const FAQ_SECTIONS = [
  {
    heading: 'About Dutch benefits',
    items: [
      {
        q: 'What Dutch government benefits exist for internationals?',
        a: `The Dutch government offers several major benefit programs that internationals can access:
        <ul>
          <li><strong>Zorgtoeslag</strong> — Healthcare allowance. Reduces the cost of your compulsory Dutch health insurance (basisverzekering). Worth €3–€123/month depending on income.</li>
          <li><strong>Huurtoeslag</strong> — Rent benefit. Covers part of your rent if you're a tenant with income below the threshold. Worth up to €400+/month.</li>
          <li><strong>Kinderopvangtoeslag</strong> — Childcare benefit. Covers 33–96% of registered childcare costs for working parents with children under 13.</li>
          <li><strong>Kindgebonden Budget</strong> — Child supplement. Monthly top-up per child for lower-income families, paid automatically alongside kinderbijslag.</li>
          <li><strong>WW-uitkering</strong> — Unemployment benefit. 70–75% of your last salary for 3–24 months if you worked 26+ weeks and lost your job involuntarily.</li>
          <li><strong>Bijstandsuitkering</strong> — Social assistance. Last resort income support for those with no other income or assets.</li>
          <li><strong>DUO Studiefinanciering</strong> — Student finance. Monthly grants and an OV-card for eligible students at Dutch universities or colleges.</li>
        </ul>`,
      },
      {
        q: 'Am I eligible for Dutch benefits as an expat or international worker?',
        a: 'In most cases, yes. EU/EEA citizens with free movement rights, Kennismigrant (highly skilled migrant) holders, and other valid permit holders can access most Dutch benefit programs from their first day of residence or employment. Eligibility depends on your income, household type, housing situation, and permit status. DutchClaim checks all of these against the official 2025/2026 rules.',
      },
      {
        q: 'Am I eligible for Dutch benefits as an international student?',
        a: 'It depends. International students can typically access Zorgtoeslag if they have Dutch health insurance. Students enrolled at an accredited Dutch institution (MBO, HBO, or WO) may also qualify for DUO Studiefinanciering and the OV-studentenkaart. Huurtoeslag and WW are generally not available to students. DutchClaim\'s student plan checks all three student-relevant programs.',
      },
      {
        q: 'Do I need DigiD or Dutch documents to apply?',
        a: 'To use DutchClaim and get your benefits report — no. You only need to answer a few questions in English. To actually apply for benefits with the Dutch tax authority (Belastingdienst) or UWV, you will typically need a BSN (citizen service number) and in some cases DigiD. DutchClaim shows you exactly what you need for each program.',
      },
      {
        q: 'Can I claim benefits retroactively?',
        a: 'Yes, for many programs you can claim up to 3 years in arrears. For example, if you were eligible for Zorgtoeslag for the past 2 years and never claimed it, you can still apply for the backdated amount. This is one of the biggest reasons to check sooner rather than later.',
      },
      {
        q: 'How much can I expect to receive?',
        a: 'It varies significantly by income, household type, and which programs you qualify for. The average international worker in the Netherlands misses €3,200/year in unclaimed benefits. Single earners on €1,500–€2,000/month who rent often qualify for €250–€450/month combined (Zorgtoeslag + Huurtoeslag). Your DutchClaim report shows the exact calculated amount for your specific situation.',
      },
    ],
  },
  {
    heading: 'How DutchClaim works',
    items: [
      {
        q: 'How does the free scan work?',
        a: 'You answer 8–10 questions about your situation — income, housing, family, residence status. DutchClaim instantly runs your answers through the official 2025/2026 Dutch eligibility rules and shows you which programs you likely qualify for and an estimated monthly range. No account required, no payment needed.',
      },
      {
        q: 'What do I get in the paid report?',
        a: 'The full report includes: the exact calculated monthly amount for each program based on your income, a plain-English explanation of why you qualify (or don\'t), the specific conditions you meet, any caveats or edge cases, and a direct link to the official government application page for each program.',
      },
      {
        q: 'How accurate are the estimates?',
        a: 'Estimates are calculated using the official government tables and thresholds for 2025/2026 — the same numbers the Belastingdienst uses. Amounts are deterministic: the same answers always produce the same result. They represent a conservative estimate — actual amounts may be slightly higher depending on your exact gross income and deductions. Always verify with the official government source before relying on any figure.',
      },
      {
        q: 'Is DutchClaim affiliated with the Dutch government?',
        a: 'No. DutchClaim is an independent tool that helps internationals understand and navigate Dutch benefit programs. We are not affiliated with the Belastingdienst, DUO, UWV, or any other government body. All official applications go directly through the government websites we link to.',
      },
      {
        q: 'What happens to my data?',
        a: 'Your answers are used to calculate your eligibility and generate your report. We store your report securely so you can access it later from your dashboard. We do not sell your data to third parties. See our Privacy Policy for full details.',
      },
    ],
  },
  {
    heading: 'Payments & reports',
    items: [
      {
        q: 'Is this a subscription?',
        a: 'No. DutchClaim is a one-time payment per report. There are no recurring charges, no hidden fees, and no auto-renewals.',
      },
      {
        q: 'Can I get a report for a family member?',
        a: 'Yes. You can generate multiple reports from one account. Each report is based on a separate set of quiz answers, so you can do one for yourself and one for a partner, parent, or anyone else. Reports can be named (e.g. "Mum\'s report") for easy reference.',
      },
      {
        q: 'I paid but my report is not showing. What should I do?',
        a: `Your report is generated immediately when you click the unlock button — it typically takes 15–30 seconds. If you are on the dashboard and your report is not showing:<br/><br/>
        1. Wait a moment and refresh the page.<br/>
        2. Make sure you are logged in to the same account you used to pay.<br/>
        3. If the problem persists, email us at <a href="mailto:info@dutchclaim.com" class="text-brand underline">info@dutchclaim.com</a> and we will sort it out.`,
      },
      {
        q: 'Can I update my report if my situation changes?',
        a: 'Yes. You can re-run the quiz at any time and generate a new report. Reports are tied to your account so you can compare them over time. A new scan costs the same one-time fee.',
      },
    ],
  },
  {
    heading: 'Specific programs',
    items: [
      {
        q: 'What is the Zorgtoeslag income limit for 2025?',
        a: 'For 2025, single individuals earning up to €38,520/year (€3,210/month net) are eligible. For partners, the combined income limit is €48,224/year (€4,019/month combined net). Above these thresholds, you are not eligible. The maximum amount for someone on the minimum wage is around €123/month.',
      },
      {
        q: 'What is the Huurtoeslag rent limit?',
        a: 'The liberalisation threshold for 2025 is €808.06/month. If your rent is above this, you are not eligible for Huurtoeslag regardless of income. Your rent must also be in an independent property (not a room share or sublet) with a formal rental contract in your name.',
      },
      {
        q: 'How does Kinderopvangtoeslag work?',
        a: 'The government reimburses between 33% and 96% of your registered childcare costs, depending on your household income. Both parents must be working, studying, or on an integration course. The childcare provider must be registered in the Landelijk Register Kinderopvang (LRK). You apply through the Belastingdienst toeslagen portal.',
      },
      {
        q: 'Can I claim WW-uitkering as a Kennismigrant?',
        a: 'Yes, provided you worked at least 26 weeks in the 36 weeks before becoming unemployed, lost your job involuntarily (laid off or contract ended — not resigned), and are registered as job-seeking at UWV. The amount is 75% of your daily wage for the first 2 months, then 70%.',
      },
      {
        q: 'What is DUO Studiefinanciering and who qualifies?',
        a: 'DUO Studiefinanciering is a Dutch student finance system that provides monthly grants (basisbeurs) and optionally supplementary grants (aanvullende beurs) to eligible students. EU/EEA students enrolled at an accredited Dutch institution typically qualify after working 32+ hours/week alongside their studies, or after 5 years of lawful residence. Non-EU students may qualify for the OV-kaart in some circumstances. Amounts range from €287 to over €1,100/month depending on living situation and parental income.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-[#E8DFD0] py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h1 className="font-serif text-3xl sm:text-5xl text-navy mb-4">
            Questions & answers
          </h1>
          <p className="text-navy/55 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Everything you need to know about Dutch government benefits and how DutchClaim works — in plain English.
          </p>
        </div>
      </div>

      {/* FAQ content */}
      <div className="max-w-2xl mx-auto px-4 py-14">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.heading} className="mb-12">
            <h2 className="font-serif text-xl text-navy mb-5 pb-3 border-b border-navy/8">
              {section.heading}
            </h2>
            <div className="space-y-0 divide-y divide-navy/6">
              {section.items.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <span className="font-medium text-navy text-sm sm:text-base leading-snug">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className="text-navy/35 shrink-0 mt-0.5 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <div
                    className="mt-3 text-sm text-navy/60 leading-relaxed prose-sm [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_ul]:list-none [&_ul]:pl-0 [&_li]:flex [&_li]:gap-2 [&_li]:before:content-['–'] [&_li]:before:text-brand [&_li]:before:shrink-0 [&_strong]:text-navy [&_strong]:font-semibold [&_a]:text-brand [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="mt-10 bg-[#E8DFD0] rounded-card p-7 text-center">
          <p className="font-serif text-xl text-navy mb-2">Still have a question?</p>
          <p className="text-navy/55 text-sm mb-5">
            Can&apos;t find what you need? We reply to all emails within one business day.
          </p>
          <a
            href="mailto:info@dutchclaim.com"
            className="inline-flex items-center gap-2 bg-brand text-white text-sm font-medium px-6 py-3 rounded-input hover:bg-brand/90 transition-colors"
          >
            Email info@dutchclaim.com
          </a>
        </div>

        {/* Schema.org FAQ markup for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_SECTIONS.flatMap((s) =>
                s.items.map((item) => ({
                  '@type': 'Question',
                  name: item.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.a.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
                  },
                }))
              ),
            }),
          }}
        />
      </div>

      {/* Bottom nav */}
      <div className="border-t border-navy/8 py-8 px-4 text-center">
        <p className="text-sm text-navy/45 mb-4">Ready to find out what you&apos;re owed?</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-brand text-white text-sm font-medium px-5 py-2.5 rounded-input hover:bg-brand/90 transition-colors"
          >
            Start free scan
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-navy/15 text-navy text-sm font-medium px-5 py-2.5 rounded-input hover:bg-navy/5 transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

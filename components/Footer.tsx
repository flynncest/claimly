import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-navy/8 text-navy/50 pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">C</span>
              </div>
              <span className="font-serif text-lg text-navy">Claimly</span>
            </div>
            <p className="text-sm leading-relaxed text-navy/40 max-w-xs">
              Find every benefit you&apos;re entitled to in the Netherlands — in English, in minutes.
            </p>
            <p className="text-xs text-navy/25 mt-5">Made with ❤️ for internationals in the Netherlands</p>
          </div>

          <div>
            <h4 className="text-navy/65 text-xs font-semibold uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/scan" className="hover:text-navy transition-colors">Benefits Scan</Link></li>
              <li><Link href="/#pricing" className="hover:text-navy transition-colors">Pricing</Link></li>
              <li><Link href="/students" className="hover:text-navy transition-colors">For Students</Link></li>
              <li><Link href="/expat" className="hover:text-navy transition-colors">For Expats</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-navy/65 text-xs font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-navy transition-colors">About</Link></li>
              <li><Link href="/login" className="hover:text-navy transition-colors">Log in</Link></li>
              <li><a href="mailto:hello@claimly.app" className="hover:text-navy transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-navy/65 text-xs font-semibold uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-navy transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-navy transition-colors">Terms</Link></li>
              <li><Link href="/disclaimer" className="hover:text-navy transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-navy/30">
            © {new Date().getFullYear()} Claimly. Not affiliated with any government body.
          </p>
          <p className="text-xs text-navy/30">
            Results are estimates. Always verify with official sources.
          </p>
        </div>
      </div>
    </footer>
  )
}

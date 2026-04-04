'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Globe, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langToast, setLangToast] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return

    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const handleLangClick = (lang: string) => {
    if (lang !== 'EN') {
      setLangToast(true)
      setTimeout(() => setLangToast(false), 2800)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#E8DFD0] border-b border-navy/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-15 py-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">C</span>
              </div>
              <span className="font-serif text-xl text-navy">Claimly</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-7">
              <Link href="/#how-it-works" className="text-sm text-navy/50 hover:text-navy transition-colors">
                How it works
              </Link>
              <Link href="/pricing" className="text-sm text-navy/50 hover:text-navy transition-colors">
                Pricing
              </Link>
              <Link href="/students" className="text-sm text-navy/50 hover:text-navy transition-colors">
                For Students
              </Link>
              <Link href="/expat" className="text-sm text-navy/50 hover:text-navy transition-colors">
                For Expats
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language toggle */}
              <div className="flex items-center gap-0.5 border border-navy/12 rounded-lg px-1.5 py-1">
                <Globe size={11} className="text-navy/30 mr-1" />
                {['EN', 'NL', 'FR'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLangClick(lang)}
                    className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                      lang === 'EN' ? 'bg-navy/8 text-navy' : 'text-navy/35 hover:text-navy/70'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              ) : (
                <Link href="/login" className="text-sm text-navy/50 hover:text-navy transition-colors">
                  Log in
                </Link>
              )}

              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-white text-navy border border-navy/15 text-sm px-4 py-2 rounded-input font-medium hover:bg-navy/5 transition-colors"
                >
                  My Reports
                </Link>
              ) : (
                <Link
                  href="/scan"
                  className="btn-primary bg-brand text-white text-sm px-4 py-2 rounded-input font-medium"
                >
                  Find What I&apos;m Owed
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-navy/50 hover:text-navy"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-navy/8 bg-[#E8DFD0]">
            <div className="px-4 py-4 space-y-1">
              {[
                { href: '/#how-it-works', label: 'How it works' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/students', label: 'For Students' },
                { href: '/expat', label: 'For Expats' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-navy/50 hover:text-navy py-2.5 border-b border-navy/6"
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); handleSignOut() }}
                    className="block text-sm text-navy/50 hover:text-navy py-2.5 border-b border-navy/6 w-full text-left"
                  >
                    Sign out
                  </button>
                  <div className="pt-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block bg-white text-navy border border-navy/15 text-sm px-4 py-3 rounded-input font-medium text-center mt-2 hover:bg-navy/5 transition-colors"
                    >
                      My Reports
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-navy/50 hover:text-navy py-2.5 border-b border-navy/6"
                  >
                    Log in
                  </Link>
                  <div className="pt-2">
                    <Link
                      href="/scan"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary block bg-brand text-white text-sm px-4 py-3 rounded-input font-medium text-center mt-2"
                    >
                      Find What I&apos;m Owed
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {langToast && (
        <div className="toast fixed top-20 right-4 z-50 bg-[#E8DFD0] border border-navy/12 text-navy text-sm px-4 py-2.5 rounded-card shadow-card-lg">
          Other languages coming soon!
        </div>
      )}
    </>
  )
}

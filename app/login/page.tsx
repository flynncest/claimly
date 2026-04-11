'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, Mail } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const authError = searchParams.get('error')
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'signup' | 'magic'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}` },
        })
        if (error) throw error
        setSuccess('Check your email to confirm your account — then you\'ll be logged in automatically.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push(redirect)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
        },
      })
      if (error) throw error
      setSuccess('Magic link sent! Check your email.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen bg-[#E8DFD0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm leading-none">€</span>
            </div>
            <span className="font-serif text-xl text-navy">DutchClaim</span>
          </Link>
          <h1 className="font-serif text-2xl text-navy mb-1">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-navy/50 text-sm">
            {mode === 'signup'
              ? 'Save your results and track changes'
              : 'Sign in to view your benefits report'}
          </p>
        </div>

        <div className="bg-white rounded-card p-7 shadow-card">
          {/* Mode tabs */}
          <div className="flex border border-navy/10 rounded-lg p-1 mb-6">
            {(['login', 'signup', 'magic'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m)
                  setError('')
                  setSuccess('')
                }}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                  mode === m
                    ? 'bg-navy/10 text-navy font-semibold'
                    : 'text-navy/50 hover:text-navy'
                }`}
              >
                {m === 'login' ? 'Log in' : m === 'signup' ? 'Sign up' : 'Magic link'}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2.5 border border-navy/15 rounded-input py-2.5 text-sm text-navy hover:bg-navy/3 transition-colors mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#E8440A"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-navy/8" />
            <span className="text-xs text-navy/30">or</span>
            <div className="flex-1 h-px bg-navy/8" />
          </div>

          {/* Auth callback error */}
          {authError === 'auth_failed' && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-4">
              Authentication failed. Please try again.
            </div>
          )}

          {/* Error/success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-brand-50 border border-brand/20 text-brand text-sm px-4 py-2.5 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'magic' ? handleMagicLink : handleEmailAuth}>
            <div className="space-y-3">
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 border border-navy/15 rounded-input text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                />
              </div>

              {mode !== 'magic' && (
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 border border-navy/15 rounded-input text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full bg-brand text-white font-medium py-2.5 rounded-input text-sm disabled:opacity-50"
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'magic'
                  ? 'Send magic link'
                  : mode === 'signup'
                  ? 'Create account'
                  : 'Log in'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-navy/40 mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-navy/60">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-navy/60">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

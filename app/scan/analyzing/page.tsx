'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { estimateBenefits } from '@/lib/benefitsDb'
import type { ScanData } from '@/lib/types'

const MESSAGES = [
  'Checking Zorgtoeslag...',
  'Checking Huurtoeslag...',
  'Checking Kinderopvangtoeslag...',
  'Checking Kindgebonden Budget...',
  'Checking WW-uitkering...',
  'Checking Bijstandsuitkering...',
  'Checking DUO Studiefinanciering...',
  'Checking OV-studentenkaart...',
  'Calculating monthly total...',
]

function CircularProgress({ pct }: { pct: number }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="#D4CBBD"
        strokeWidth="8"
      />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="#E8440A"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="progress-ring-circle transition-all duration-500"
      />
    </svg>
  )
}

export default function AnalyzingPage() {
  const router = useRouter()
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const called = useRef(false)

  // Cycle messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 350)
    return () => clearInterval(interval)
  }, [])

  // Animate progress bar — ~1.75s to 100%
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100
        const step = p < 70 ? Math.random() * 8 : Math.random() * 3
        return Math.min(p + step, 100)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Run rule-based estimation (no AI, no API call)
  useEffect(() => {
    if (called.current) return
    called.current = true

    const raw = localStorage.getItem('claimly_scan_data')
    if (!raw) {
      router.push('/scan')
      return
    }

    const scanData: ScanData = JSON.parse(raw)
    const estimate = estimateBenefits(scanData)
    localStorage.setItem('claimly_estimate', JSON.stringify(estimate))
    setReady(true)
  }, [router])

  // Redirect once progress hits 100 AND estimate is ready
  useEffect(() => {
    if (ready && progress >= 100) {
      const timer = setTimeout(() => router.push('/scan/results'), 400)
      return () => clearTimeout(timer)
    }
  }, [ready, progress, router])

  return (
    <div className="min-h-screen bg-[#E8DFD0] flex flex-col items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold">C</span>
          </div>
          <span className="font-serif text-xl text-navy">Claimly</span>
        </div>

        {/* Circular progress */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <CircularProgress pct={Math.min(progress, 100)} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-brand font-serif text-xl">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        </div>

        <h2 className="font-serif text-2xl text-navy mb-3">
          Analyzing your profile
        </h2>

        {/* Cycling message */}
        <div className="h-6 overflow-hidden">
          <p
            key={msgIndex}
            className="text-navy/50 text-sm fade-up"
          >
            {MESSAGES[msgIndex]}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand/50"
              style={{
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>

        <p className="text-navy/30 text-xs mt-8">
          Checking 9 benefit programs · 2025/2026 rules
        </p>
      </div>
    </div>
  )
}

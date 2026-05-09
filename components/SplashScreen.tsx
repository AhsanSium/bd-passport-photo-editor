'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type Phase = 'idle' | 'enter' | 'hold' | 'exit' | 'done'

const HOLD_MS  = 2000   // how long the splash is fully visible
const EXIT_MS  = 720    // must match --animate-splash-exit duration

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>('idle')
  const pathname = usePathname()
  const isBn = pathname.startsWith('/bn')

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem('bd-splash-shown')) return
    sessionStorage.setItem('bd-splash-shown', '1')

    setPhase('enter')

    const t1 = setTimeout(() => setPhase('hold'), 400)
    const t2 = setTimeout(() => setPhase('exit'), 400 + HOLD_MS)
    const t3 = setTimeout(() => setPhase('done'), 400 + HOLD_MS + EXIT_MS)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const skip = () => {
    if (phase === 'enter' || phase === 'hold') setPhase('exit')
    setTimeout(() => setPhase('done'), EXIT_MS)
  }

  if (phase === 'idle' || phase === 'done') return null

  const isExiting = phase === 'exit'

  return (
    <div
      role="presentation"
      aria-hidden="true"
      onClick={skip}
      className={[
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white select-none',
        isExiting ? 'animate-splash-exit pointer-events-none' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* BD flag */}
      <div
        className="animate-scale-in"
        style={phase === 'hold' ? { animation: 'scale-in 0.5s ease-out both, flag-float 3s ease-in-out 0.5s infinite' } : undefined}
      >
        <svg
          width="120"
          height="72"
          viewBox="0 0 10 6"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Bangladesh flag"
        >
          <rect width="10" height="6" fill="#006A4E" rx="0.5" />
          <circle cx="4.5" cy="3" r="2" fill="#F42A41" />
        </svg>
      </div>

      {/* App name */}
      <div className="animate-fade-up delay-150 mt-7 text-center">
        <p className="font-bangla text-[1.6rem] font-bold leading-tight text-brand-green">
          পাসপোর্ট ছবি
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          BD Passport Photo
        </p>
      </div>

      {/* Feature strip */}
      <div className="animate-fade-up delay-300 mt-5 flex items-center gap-2.5 text-[11px] text-gray-300">
        <span>{isBn ? 'বিনামূল্যে' : 'Free'}</span>
        <span>·</span>
        <span>{isBn ? 'নিরাপদ' : 'Private'}</span>
        <span>·</span>
        <span>{isBn ? 'নিবন্ধন নেই' : 'No sign-up'}</span>
      </div>

      {/* Skip hint */}
      <p className="animate-fade-in delay-450 absolute bottom-8 text-[11px] text-gray-300">
        {isBn ? 'ট্যাপ করুন এড়িয়ে যেতে' : 'Tap anywhere to skip'}
      </p>
    </div>
  )
}

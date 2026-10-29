"use client"

import { useState, useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'

export default function Preloader() {
  const [isDone, setIsDone] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return Boolean(sessionStorage.getItem('np_atelier_preloader_seen'))
      } catch {
        return false
      }
    }
    return false
  })

  const preloaderRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const percentTextRef = useRef<HTMLSpanElement>(null)
  const hasDismissedRef = useRef(false)

  useEffect(() => {
    // If already seen in this session, immediately exit
    try {
      if (sessionStorage.getItem('np_atelier_preloader_seen')) {
        setIsDone(true)
        return
      }
    } catch {}

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const dismiss = () => {
      if (hasDismissedRef.current) return
      hasDismissedRef.current = true

      try {
        sessionStorage.setItem('np_atelier_preloader_seen', 'true')
      } catch {}

      document.body.style.overflow = originalOverflow

      if (preloaderRef.current) {
        preloaderRef.current.style.transition =
          'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease'
        preloaderRef.current.style.transform = 'translateY(-100%)'
        preloaderRef.current.style.opacity = '0'

        setTimeout(() => {
          setIsDone(true)
        }, 460)
      } else {
        setIsDone(true)
      }
    }

    // High-performance hardware animation for progress
    const startTime = performance.now()
    const duration = 650 // 0.65s snappy luxury animation
    let rafId: number | null = null

    const updateFrame = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      // Smooth cubic ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentVal = Math.round(eased * 100)

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${currentVal}%`
      }
      if (percentTextRef.current) {
        percentTextRef.current.textContent = `${String(currentVal).padStart(2, '0')}%`
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(updateFrame)
      } else {
        // Small 80ms pause at 100% before smooth glide
        setTimeout(() => {
          dismiss()
        }, 80)
      }
    }

    rafId = requestAnimationFrame(updateFrame)

    // Absolute bulletproof fallback timer: NEVER freeze under any circumstances
    const fallbackTimer = setTimeout(() => {
      dismiss()
    }, 950)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      clearTimeout(fallbackTimer)
      document.body.style.overflow = originalOverflow
    }
  }, [])

  if (isDone) return null

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0B0A] text-[#F5EBDD] select-none will-change-transform overflow-hidden"
    >
      {/* Ambient Radial Golden Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,rgba(212,175,120,0.06),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D4AF78]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D4AF78]/5 blur-3xl" />

      {/* Center Preloader Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
      >
        {/* Medallion with Orbital Ring */}
        <div className="relative mb-6">
          {/* Orbital Rotating Dashed Gilded Ring */}
          <div
            ref={ringRef}
            className="absolute -inset-3 rounded-full border border-dashed border-[#D4AF78]/40 pointer-events-none animate-spin [animation-duration:8s]"
          />

          {/* Secondary Outer Halo */}
          <div className="absolute -inset-1.5 rounded-full border border-[#D4AF78]/25 blur-[1px]" />

          {/* Center Medallion (Signature NP Atelier Gilded 3D Seal) */}
          <div
            ref={emblemRef}
            className="relative grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-3xl border border-[rgba(212,175,120,0.4)] bg-gradient-to-br from-[#191713] via-[#14120E] to-[#0B0B0A] shadow-[0_12px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,120,0.15)]"
          >
            {/* Sparkle Glint */}
            <Sparkles className="absolute top-2 right-2.5 h-3.5 w-3.5 text-[#E5C18A] animate-pulse" />

            {/* Monogram */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-serif text-2xl sm:text-3xl font-black tracking-wider text-[#D4AF78] drop-shadow-xs">
                NP
              </span>
              <span className="text-[7.5px] font-extrabold uppercase tracking-[0.22em] text-[#B8AA96] -mt-0.5">
                Atelier
              </span>
            </div>
          </div>
        </div>

        {/* Brand Headline */}
        <h1 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-[0.3em] text-[#F5EBDD]">
          <span className="text-gold-gradient">
            NP Atelier
          </span>
        </h1>

        {/* Brand Subtext */}
        <p className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8AA96]">
          Artisan Mastery &#8226; Living Waters
        </p>

        {/* Minimalist Golden Progress Track */}
        <div className="mt-7 w-44 sm:w-52">
          {/* Track background */}
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-[#191713] border border-[rgba(212,175,120,0.25)]">
            {/* Active glowing progress bar */}
            <div
              ref={progressBarRef}
              style={{ width: '0%' }}
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF78] via-[#E5C18A] to-[#D4AF78] shadow-[0_0_12px_rgba(212,175,120,0.4)]"
            />
          </div>

          {/* Numerical Counter */}
          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[#B8AA96]">
            <span className="text-[#B8AA96]/80 uppercase">Loading Atelier</span>
            <span ref={percentTextRef} className="text-[#D4AF78]">00%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

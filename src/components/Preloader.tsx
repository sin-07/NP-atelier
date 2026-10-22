"use client"

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Sparkles } from 'lucide-react'

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)

  const preloaderRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user already saw preloader in this session
    const hasSeen = sessionStorage.getItem('np_atelier_preloader_seen')
    if (hasSeen) {
      setIsDone(true)
      return
    }

    // Freeze background scroll while preloader is running
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const progressObj = { value: 0 }

    // Continuous soft orbital spin
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotate: 360,
        duration: 8,
        repeat: -1,
        ease: 'none',
      })
    }

    // Main entrance & progress timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete: () => {
            sessionStorage.setItem('np_atelier_preloader_seen', 'true')
            document.body.style.overflow = prevOverflow
            setIsDone(true)
          },
        })

        exitTl
          .to(contentRef.current, {
            opacity: 0,
            y: -20,
            scale: 0.96,
            duration: 0.35,
            ease: 'power2.in',
          })
          .to(
            preloaderRef.current,
            {
              yPercent: -100,
              duration: 0.65,
              ease: 'power3.inOut',
            },
            '-=0.15'
          )
      },
    })

    // Initial content entrance
    tl.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
    )
      // Progress increment 0 to 100
      .to(
        progressObj,
        {
          value: 100,
          duration: 1.25,
          ease: 'power2.inOut',
          onUpdate: () => {
            const currentVal = Math.round(progressObj.value)
            setProgress(currentVal)
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${currentVal}%`
            }
          },
        },
        '-=0.2'
      )
      // Subtle jewel pulse when 100% reached
      .to(emblemRef.current, {
        scale: 1.08,
        boxShadow: '0 0 35px rgba(212,175,55,0.6)',
        duration: 0.18,
        ease: 'power1.out',
      })
      .to(emblemRef.current, {
        scale: 1,
        boxShadow: '0 0 15px rgba(212,175,55,0.2)',
        duration: 0.18,
        ease: 'power1.in',
      })

    return () => {
      document.body.style.overflow = prevOverflow
      tl.kill()
    }
  }, [])

  if (isDone) return null

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0A07] text-[#FAF5E8] select-none will-change-transform overflow-hidden"
    >
      {/* Ambient Radial Golden Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_550px_at_50%_50%,rgba(212,175,55,0.14),transparent_70%)]" />

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
            className="absolute -inset-3 rounded-full border border-dashed border-[#D4AF37]/45 pointer-events-none"
          />

          {/* Secondary Outer Halo */}
          <div className="absolute -inset-1.5 rounded-full border border-[#D4AF37]/25 blur-[1px]" />

          {/* Center Medallion */}
          <div
            ref={emblemRef}
            className="relative grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-full border border-[#D4AF37] bg-gradient-to-br from-[#1C170F] via-[#120F0A] to-[#0A0805] shadow-[0_0_25px_rgba(212,175,55,0.25)]"
          >
            {/* Sparkle Glint */}
            <Sparkles className="absolute top-2 right-2.5 h-3.5 w-3.5 text-[#ECC872] animate-pulse" />

            {/* Monogram */}
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-widest bg-gradient-to-r from-[#FFF5D1] via-[#F2D785] to-[#D4AF37] bg-clip-text text-transparent">
              NP
            </span>
          </div>
        </div>

        {/* Brand Headline */}
        <h1 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-[0.35em] text-white">
          <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F4DC96] to-[#D4AF37] bg-clip-text text-transparent">
            Atelier NP
          </span>
        </h1>

        {/* Brand Subtext */}
        <p className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#C2B292]">
          Artisan Mastery &#8226; Living Waters
        </p>

        {/* Minimalist Golden Progress Track */}
        <div className="mt-7 w-44 sm:w-52">
          {/* Track background */}
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            {/* Active glowing progress bar */}
            <div
              ref={progressBarRef}
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F2D785] to-[#ECC872] shadow-[0_0_12px_rgba(212,175,55,0.7)] transition-[width] duration-75"
            />
          </div>

          {/* Numerical Counter */}
          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[#B8860B]">
            <span className="text-[#6E6352] uppercase">Loading Drop</span>
            <span className="text-[#ECC872]">{String(progress).padStart(2, '0')}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

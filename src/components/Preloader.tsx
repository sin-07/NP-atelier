"use client"

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Sparkles } from 'lucide-react'

export default function Preloader() {
  const [isDone, setIsDone] = useState(false)

  const preloaderRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const percentTextRef = useRef<HTMLSpanElement>(null)

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
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${currentVal}%`
            }
            if (percentTextRef.current) {
              percentTextRef.current.textContent = `${String(currentVal).padStart(2, '0')}%`
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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F6F3EE] text-[#141414] select-none will-change-transform overflow-hidden"
    >
      {/* Ambient Radial Golden Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,rgba(212,175,55,0.2),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#B8860B]/10 blur-3xl" />

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
            className="absolute -inset-3 rounded-full border border-dashed border-[#D4AF37]/55 pointer-events-none"
          />

          {/* Secondary Outer Halo */}
          <div className="absolute -inset-1.5 rounded-full border border-[#D4AF37]/35 blur-[1px]" />

          {/* Center Medallion (Signature NP Atelier Gilded 3D Seal) */}
          <div
            ref={emblemRef}
            className="relative grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-3xl border-2 border-white bg-gradient-to-br from-[#FFF5DC] via-[#E8BC57] to-[#B38320] shadow-[0_12px_32px_rgba(184,134,11,0.32)]"
          >
            {/* Sparkle Glint */}
            <Sparkles className="absolute top-2 right-2.5 h-3.5 w-3.5 text-[#FFFFFF] animate-pulse" />

            {/* Monogram */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-serif text-2xl sm:text-3xl font-black tracking-wider text-[#17120A] drop-shadow-xs">
                NP
              </span>
              <span className="text-[7.5px] font-extrabold uppercase tracking-[0.22em] text-[#3D2C0A] -mt-0.5">
                Atelier
              </span>
            </div>
          </div>
        </div>

        {/* Brand Headline */}
        <h1 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-[0.3em] text-[#241705]">
          <span className="bg-gradient-to-r from-[#241705] via-[#7A5408] to-[#241705] bg-clip-text text-transparent">
            NP Atelier
          </span>
        </h1>

        {/* Brand Subtext */}
        <p className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#7A6D56]">
          Artisan Mastery &#8226; Living Waters
        </p>

        {/* Minimalist Golden Progress Track */}
        <div className="mt-7 w-44 sm:w-52">
          {/* Track background */}
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-[#E5DEC9] border border-[#DFCFA6]/60">
            {/* Active glowing progress bar */}
            <div
              ref={progressBarRef}
              style={{ width: '0%' }}
              className="h-full rounded-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5DE9C] shadow-[0_0_12px_rgba(212,175,55,0.7)] transition-[width] duration-75"
            />
          </div>

          {/* Numerical Counter */}
          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[#7A5408]">
            <span className="text-[#8C7A58] uppercase">Loading Atelier</span>
            <span ref={percentTextRef} className="text-[#7A5408]">00%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

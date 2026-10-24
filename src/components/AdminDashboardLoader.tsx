"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'

interface AdminDashboardLoaderProps {
  title?: string
  subtitle?: string
  durationMs?: number
  onComplete?: () => void
  mode?: 'transition' | 'checking'
}

const TRANSITION_STEPS = [
  'Verifying Administrator Credentials...',
  'Synchronizing Living Waters & Artisan Creations...',
  'Decrypting Real-Time Orders & Revenue Analytics...',
  'Security Handshake Complete. Welcome to NP Atelier...',
]

export default function AdminDashboardLoader({
  title = 'NP Atelier Executive Access',
  subtitle = 'Curated Artisan Marketplace & Living Waters',
  durationMs = 1350,
  onComplete,
  mode = 'transition',
}: AdminDashboardLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const rawPct = Math.min(100, Math.floor((elapsed / durationMs) * 100))
      setProgress(rawPct)

      if (rawPct < 26) {
        setCurrentStepIndex(0)
      } else if (rawPct < 58) {
        setCurrentStepIndex(1)
      } else if (rawPct < 88) {
        setCurrentStepIndex(2)
      } else {
        setCurrentStepIndex(3)
      }

      if (rawPct >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          if (onComplete) {
            onComplete()
          }
        }, 180)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [durationMs, onComplete])

  return (
    <motion.div
      key="admin-dashboard-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[#F6F3EE] p-4 text-[#141414] select-none"
    >
      {/* Ambient Radiant Lighting Matching Website */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#ECC872]/15 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />

      {/* Floating Glassmorphic Atelier Card */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 14 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-[#DFCFA6]/90 bg-white/90 p-8 sm:p-10 shadow-[0_24px_70px_rgba(40,28,10,0.08),0_4px_24px_rgba(212,175,55,0.12)] backdrop-blur-xl text-center flex flex-col items-center"
      >
        {/* Centerpiece: Gilded Astrolabe / Royal Seal */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer Rotating Dashed Gold Filigree Ring */}
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border border-dashed border-[#D4AF37]/50 animate-[spin_14s_linear_infinite]" />

          {/* Inner Counter-Rotating Golden Ring */}
          <div className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-t-[#D4AF37] border-r-transparent border-b-[#B8860B] border-l-transparent animate-[spin_4.5s_linear_infinite_reverse]" />

          {/* Orbital Star Jewel */}
          <motion.div
            className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-[#FFF5DC] to-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] border border-white" />
          </motion.div>

          {/* Central 3D Embossed Medal Emblem (Matches Website Header Brand Mark) */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="absolute grid h-18 w-18 sm:h-20 sm:w-20 place-items-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF5DC] via-[#E8BC57] to-[#B38320] border-2 border-white shadow-[0_10px_25px_rgba(184,134,11,0.28)] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {progress >= 100 ? (
                <motion.div
                  key="complete-check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle2 className="h-8 w-8 text-[#17120A]" />
                </motion.div>
              ) : (
                <motion.div
                  key="atelier-monogram"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex flex-col items-center justify-center select-none"
                >
                  <span className="font-serif text-2xl sm:text-3xl font-black tracking-wider text-[#17120A] drop-shadow-xs">
                    NP
                  </span>
                  <span className="text-[7.5px] font-extrabold uppercase tracking-[0.22em] text-[#3D2C0A] -mt-0.5">
                    Atelier
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Brand Status Pill */}
        <motion.div
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FAF3E3] px-3.5 py-1 text-xs font-bold text-[#7A5408] shadow-xs mb-3"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#B8860B] animate-pulse" />
          <span>{title}</span>
        </motion.div>

        {/* Heading */}
        <motion.h3
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-serif text-2xl sm:text-3xl font-bold text-[#1F170B] tracking-tight"
        >
          Entering Dashboard
        </motion.h3>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-[#73634B] font-medium leading-relaxed mt-1.5 max-w-xs"
        >
          {subtitle}
        </motion.p>

        {/* Progress Console */}
        <div className="w-full mt-7 space-y-2.5">
          {/* Counter Row */}
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#8C6F2D] flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#B8860B]" />
              <span>Session Authenticated</span>
            </span>
            <span className="font-serif text-sm font-extrabold text-[#7A5408]">
              {progress}%
            </span>
          </div>

          {/* Gilded Progress Bar with Traversing Shimmer */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#EFE9DC] border border-[#DFCFA6]/80 p-0.5 shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5DE9C] shadow-[0_0_12px_rgba(212,175,55,0.45)] relative overflow-hidden"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.05 }}
            >
              {/* Shimmer traversal line */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
              />
            </motion.div>
          </div>

          {/* Dynamic Status Ticker with smooth AnimatePresence cross-fade */}
          <div className="pt-1 text-center min-h-[22px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={mode === 'checking' ? 'checking' : currentStepIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
                className="text-[11.5px] text-[#5C4A26] font-semibold tracking-wide"
              >
                {mode === 'checking'
                  ? 'Verifying administrative session signature...'
                  : TRANSITION_STEPS[currentStepIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

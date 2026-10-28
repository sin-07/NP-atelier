"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2, ShieldCheck, Lock, Compass, ArrowRightLeft } from 'lucide-react'

export type AtelierLoaderMode =
  | 'signin'
  | 'signout'
  | 'page_switch'
  | 'admin_signin'
  | 'admin_signout'
  | 'custom'

export interface AtelierGlobalLoaderProps {
  mode?: AtelierLoaderMode
  title?: string
  subtitle?: string
  durationMs?: number
  onComplete?: () => void
}

const STEP_DEFINITIONS: Record<AtelierLoaderMode, string[]> = {
  signin: [
    'Verifying Patron Signature & Credentials...',
    'Synchronizing Bespoke Orders & Living Waters...',
    'Decrypting Private Delivery Vault & Cards...',
    'Security Handshake Complete. Welcome to NP Atelier...',
  ],
  signout: [
    'Securing Offline Patron Preferences...',
    'Clearing Session Cryptographic Keys...',
    'Sealing Delivery Cards & Stored Vault...',
    'Session Closed. Thank you for visiting NP Atelier...',
  ],
  page_switch: [
    'Calibrating Living Waters & Artisan Creations...',
    'Curating Pure Ivory & Gold Exhibition...',
    'Synchronizing Bespoke Catalog Displays...',
    'Atelier Ready. Welcome...',
  ],
  admin_signin: [
    'Verifying Master Administrator Credentials...',
    'Synchronizing Living Waters & Artisan Creations...',
    'Decrypting Real-Time Orders & Revenue Analytics...',
    'Security Handshake Complete. Welcome, Operations Master...',
  ],
  admin_signout: [
    'Terminating Executive Access Tokens...',
    'Locking Administrative Console & Databases...',
    'Sealing Real-Time Analytics Channels...',
    'Executive Session Safely Terminated...',
  ],
  custom: [
    'Preparing Atelier Experience...',
    'Calibrating Gold & Ivory Aesthetic...',
    'Synchronizing Components...',
    'Ready. Welcome to NP Atelier...',
  ],
}

const DEFAULT_TITLES: Record<AtelierLoaderMode, { title: string; subtitle: string; pill: string }> = {
  signin: {
    title: 'Authorizing Patron Access',
    subtitle: 'Curated Artisan Marketplace & Living Waters',
    pill: 'Patron Authentication',
  },
  signout: {
    title: 'Securing Patron Session',
    subtitle: 'Clearing Cryptographic Keys & Sealing Vault',
    pill: 'Patron Sign Out',
  },
  page_switch: {
    title: 'Entering NP Atelier',
    subtitle: 'Curated Artisan Marketplace & Living Waters',
    pill: 'Atelier Navigation',
  },
  admin_signin: {
    title: 'Executive Access Verification',
    subtitle: 'NP Atelier Administrative Terminal & Real-Time Analytics',
    pill: 'Executive Authentication',
  },
  admin_signout: {
    title: 'Executive Sign Out',
    subtitle: 'Terminating Administrative Session & Locking Vault',
    pill: 'Executive Sign Out',
  },
  custom: {
    title: 'NP Atelier Concierge',
    subtitle: 'Curated Artisan Marketplace & Living Waters',
    pill: 'Concierge Synchronization',
  },
}

export default function AtelierGlobalLoader({
  mode = 'page_switch',
  title,
  subtitle,
  durationMs = 850,
  onComplete,
}: AtelierGlobalLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const config = DEFAULT_TITLES[mode] || DEFAULT_TITLES.page_switch
  const displayTitle = title || config.title
  const displaySubtitle = subtitle || config.subtitle
  const displayPill = config.pill
  const steps = STEP_DEFINITIONS[mode] || STEP_DEFINITIONS.page_switch

  useEffect(() => {
    // Freeze body scroll while loader is active
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Animate progress to 100 with hardware acceleration
    setProgress(100)

    const stepInterval = durationMs / 4
    const timer1 = setTimeout(() => setCurrentStepIndex(1), stepInterval)
    const timer2 = setTimeout(() => setCurrentStepIndex(2), stepInterval * 2)
    const timer3 = setTimeout(() => setCurrentStepIndex(3), stepInterval * 3)

    const completeTimer = setTimeout(() => {
      document.body.style.overflow = originalOverflow
      if (onComplete) {
        onComplete()
      }
    }, durationMs + 120)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(completeTimer)
      document.body.style.overflow = originalOverflow
    }
  }, [durationMs, onComplete])

  return (
    <motion.div
      key={`atelier-global-loader-${mode}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center overflow-hidden bg-[#0B0B0A] p-4 text-[#F5EBDD] select-none"
    >
      {/* Ambient Radiant Lighting Matching Website */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#D4AF78]/10 via-[#E5C18A]/5 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D4AF78]/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#D4AF78]/5 blur-[120px]" />

      {/* Floating Glassmorphic Atelier Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-[rgba(212,175,120,0.25)] bg-[#191713]/95 p-7 sm:p-9 shadow-[0_24px_70px_rgba(0,0,0,0.8),0_4px_24px_rgba(212,175,120,0.15)] backdrop-blur-xl text-center flex flex-col items-center"
      >
        {/* Centerpiece: Gilded Astrolabe / Royal Seal */}
        <div className="relative mb-5 sm:mb-6 flex items-center justify-center">
          {/* Outer Rotating Dashed Gold Filigree Ring */}
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border border-dashed border-[#D4AF78]/40 animate-[spin_14s_linear_infinite]" />

          {/* Inner Counter-Rotating Golden Ring */}
          <div className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-t-[#D4AF78] border-r-transparent border-b-[#E5C18A] border-l-transparent animate-[spin_4.5s_linear_infinite_reverse]" />

          {/* Orbital Star Jewel */}
          <motion.div
            className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-[#FFF5DC] to-[#D4AF78] shadow-[0_0_8px_rgba(212,175,120,0.8)] border border-[#191713]" />
          </motion.div>

          {/* Central 3D Embossed Medal Emblem */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="absolute grid h-18 w-18 sm:h-20 sm:w-20 place-items-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#191713] via-[#14120E] to-[#0B0B0A] border border-[rgba(212,175,120,0.4)] shadow-[0_10px_25px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {progress >= 100 ? (
                <motion.div
                  key="complete-badge"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {mode === 'signout' || mode === 'admin_signout' ? (
                    <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-[#D4AF78]" />
                  ) : (
                    <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-[#D4AF78]" />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="atelier-monogram"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex flex-col items-center justify-center select-none"
                >
                  <span className="font-serif text-2xl sm:text-3xl font-black tracking-wider text-[#D4AF78] drop-shadow-xs">
                    NP
                  </span>
                  <span className="text-[7.5px] font-extrabold uppercase tracking-[0.22em] text-[#B8AA96] -mt-0.5">
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
          transition={{ delay: 0.08 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,120,0.25)] bg-[#12110F] px-3.5 py-1 text-xs font-bold text-[#D4AF78] shadow-xs mb-2.5"
        >
          {mode === 'page_switch' ? (
            <Compass className="h-3.5 w-3.5 text-[#D4AF78] animate-spin" />
          ) : mode === 'signout' || mode === 'admin_signout' ? (
            <ArrowRightLeft className="h-3.5 w-3.5 text-[#D4AF78]" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF78] animate-pulse" />
          )}
          <span>{displayPill}</span>
        </motion.div>

        {/* Heading */}
        <motion.h3
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="font-serif text-xl sm:text-2xl font-bold text-[#F5EBDD] tracking-tight"
        >
          {displayTitle}
        </motion.h3>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="text-xs sm:text-sm text-[#B8AA96] font-medium leading-relaxed mt-1 max-w-xs"
        >
          {displaySubtitle}
        </motion.p>

        {/* Progress Console */}
        <div className="w-full mt-6 space-y-2.5">
          {/* Counter Row */}
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#B8AA96] flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF78]" />
              <span>
                {mode === 'signout' || mode === 'admin_signout'
                  ? 'Session Teardown'
                  : 'Atelier Synchronized'}
              </span>
            </span>
            <span className="font-serif text-sm font-extrabold text-[#D4AF78]">
              {progress}%
            </span>
          </div>

          {/* Gilded Progress Bar with Traversing Shimmer */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)] p-0.5 shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF78] via-[#E5C18A] to-[#D4AF78] shadow-[0_0_12px_rgba(212,175,120,0.4)] relative overflow-hidden"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut', duration: durationMs / 1000 }}
            >
              {/* Shimmer traversal line */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
            </motion.div>
          </div>

          {/* Dynamic Status Ticker with smooth AnimatePresence cross-fade */}
          <div className="pt-1 text-center min-h-[22px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStepIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="text-[11.5px] text-[#B8AA96] font-semibold tracking-wide"
              >
                {steps[currentStepIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

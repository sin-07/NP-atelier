"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2, ShieldCheck, Lock, Compass, ArrowRightLeft } from 'lucide-react'
import { NpMonogramSvg, AtelierScriptText } from './BrandTypography'
import { useMarketplace } from '../context/MarketplaceContext'

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
  durationMs = 650,
  onComplete,
}: AtelierGlobalLoaderProps) {
  const { isAquaticTheme } = useMarketplace()
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const config = DEFAULT_TITLES[mode] || DEFAULT_TITLES.page_switch
  const displayTitle = title || config.title
  const displaySubtitle = subtitle || config.subtitle
  const displayPill = config.pill
  const steps = STEP_DEFINITIONS[mode] || STEP_DEFINITIONS.page_switch

  useEffect(() => {
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
      if (onCompleteRef.current) {
        onCompleteRef.current()
      }
    }, durationMs + 100)

    // Hard fallback safety timer to ensure loader never hangs
    const hardSafetyTimer = setTimeout(() => {
      document.body.style.overflow = originalOverflow
      if (onCompleteRef.current) {
        onCompleteRef.current()
      }
    }, durationMs + 300)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(completeTimer)
      clearTimeout(hardSafetyTimer)
      document.body.style.overflow = originalOverflow
    }
  }, [durationMs])

  return (
    <motion.div
      key={`atelier-global-loader-${mode}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center overflow-hidden p-4 select-none ${
        isAquaticTheme ? 'bg-[#051320] text-[#F0F8FF]' : 'bg-[#F5F0E8] text-[#141210]'
      }`}
    >
      {/* Ambient Radiant Lighting Matching Website */}
      {isAquaticTheme ? (
        <>
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-sky-500/20 via-emerald-500/15 to-rose-500/15 blur-[140px]" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#E11D48]/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#10B981]/15 blur-[120px]" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#D4AF78]/20 via-[#E5C18A]/10 to-transparent blur-[140px]" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D4AF78]/12 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#EDE4DD]/70 blur-[120px]" />
        </>
      )}

      {/* Floating Glassmorphic Atelier Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative z-10 w-full max-w-md rounded-[2.5rem] border p-7 sm:p-9 backdrop-blur-xl text-center flex flex-col items-center ${
          isAquaticTheme
            ? 'border-sky-400/25 bg-[#092035]/95 shadow-[0_24px_70px_rgba(2,10,20,0.65),0_4px_24px_rgba(16,185,129,0.18)]'
            : 'border-[#6D5738]/25 bg-[#FCF9F4]/95 shadow-[0_24px_70px_rgba(68,52,32,0.16),0_4px_24px_rgba(182,141,82,0.14)]'
        }`}
      >
        {/* Centerpiece: Gilded Astrolabe / Royal Seal */}
        <div className="relative mb-5 sm:mb-6 flex items-center justify-center">
          {/* Outer Rotating Dashed Filigree Ring */}
          <div
            className={`h-28 w-28 sm:h-32 sm:w-32 rounded-full border border-dashed animate-[spin_14s_linear_infinite] ${
              isAquaticTheme ? 'border-emerald-400/50' : 'border-[#B68D52]/45'
            }`}
          />

          {/* Inner Counter-Rotating Ring */}
          <div
            className={`absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-r-transparent border-l-transparent animate-[spin_4.5s_linear_infinite_reverse] ${
              isAquaticTheme
                ? 'border-t-sky-400 border-b-[#F43F5E]'
                : 'border-t-[#B68D52] border-b-[#D4AF78]'
            }`}
          />

          {/* Orbital Star Jewel */}
          <motion.div
            className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
          >
            <span
              className={`absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full border ${
                isAquaticTheme
                  ? 'bg-gradient-to-tr from-[#34D399] to-[#F43F5E] shadow-[0_0_10px_rgba(52,211,153,0.8)] border-sky-200'
                  : 'bg-gradient-to-tr from-[#FCF9F4] to-[#B68D52] shadow-[0_0_8px_rgba(182,141,82,0.75)] border-[#FCF9F4]'
              }`}
            />
          </motion.div>

          {/* Central 3D Embossed Medal Emblem */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className={`absolute grid h-18 w-18 sm:h-20 sm:w-20 place-items-center rounded-full border overflow-hidden ${
              isAquaticTheme
                ? 'bg-gradient-to-br from-[#0E2E4A] via-[#081D30] to-[#051320] border-sky-400/45 shadow-[0_10px_25px_rgba(2,10,20,0.65)]'
                : 'bg-gradient-to-br from-[#FCF9F4] via-[#F5F0E8] to-[#EDE4DD] border-[#B68D52]/55 shadow-[0_10px_25px_rgba(68,52,32,0.18)]'
            }`}
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
                    <Lock
                      className={`h-7 w-7 sm:h-8 sm:w-8 ${
                        isAquaticTheme ? 'text-[#F43F5E]' : 'text-[#7A5B32]'
                      }`}
                    />
                  ) : (
                    <CheckCircle2
                      className={`h-7 w-7 sm:h-8 sm:w-8 ${
                        isAquaticTheme ? 'text-emerald-400' : 'text-[#7A5B32]'
                      }`}
                    />
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
                  <NpMonogramSvg
                    className={`h-6 sm:h-7 w-auto ${
                      isAquaticTheme ? 'text-[#F0F8FF]' : ''
                    }`}
                  />
                  <span className="sr-only">NP</span>
                  <AtelierScriptText
                    className={`text-[13px] leading-none -mt-0.5 ${
                      isAquaticTheme ? 'text-[#F0F8FF]' : 'text-[#141210]'
                    }`}
                  >
                    Atelier
                  </AtelierScriptText>
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
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold shadow-xs mb-2.5 ${
            isAquaticTheme
              ? 'border-emerald-400/35 bg-[#0D2B44] text-emerald-300'
              : 'border-[#6D5738]/25 bg-[#F5F0E8] text-[#7A5B32]'
          }`}
        >
          {mode === 'page_switch' ? (
            <Compass
              className={`h-3.5 w-3.5 animate-spin ${
                isAquaticTheme ? 'text-sky-300' : 'text-[#7A5B32]'
              }`}
            />
          ) : mode === 'signout' || mode === 'admin_signout' ? (
            <ArrowRightLeft
              className={`h-3.5 w-3.5 ${
                isAquaticTheme ? 'text-[#FB7185]' : 'text-[#7A5B32]'
              }`}
            />
          ) : (
            <Sparkles
              className={`h-3.5 w-3.5 animate-pulse ${
                isAquaticTheme ? 'text-emerald-300' : 'text-[#7A5B32]'
              }`}
            />
          )}
          <span>{displayPill}</span>
        </motion.div>

        {/* Heading */}
        <motion.h3
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className={`font-tagline text-2xl sm:text-3xl font-bold tracking-tight ${
            isAquaticTheme ? 'text-[#F0F8FF]' : 'text-[#141210]'
          }`}
        >
          {displayTitle}
        </motion.h3>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.16 }}
          className={`text-xs sm:text-sm font-medium leading-relaxed mt-1 max-w-xs ${
            isAquaticTheme ? 'text-[#B6D4E8]' : 'text-[#5C4D3C]'
          }`}
        >
          {displaySubtitle}
        </motion.p>

        {/* Progress Console */}
        <div className="w-full mt-6 space-y-2.5">
          {/* Counter Row */}
          <div className="flex items-center justify-between text-xs font-bold">
            <span
              className={`flex items-center gap-1.5 text-[11px] ${
                isAquaticTheme ? 'text-[#B6D4E8]' : 'text-[#5C4D3C]'
              }`}
            >
              <ShieldCheck
                className={`h-3.5 w-3.5 ${
                  isAquaticTheme ? 'text-emerald-400' : 'text-[#7A5B32]'
                }`}
              />
              <span>
                {mode === 'signout' || mode === 'admin_signout'
                  ? 'Session Teardown'
                  : 'Atelier Synchronized'}
              </span>
            </span>
            <span
              className={`font-tagline text-sm font-extrabold ${
                isAquaticTheme ? 'text-[#FB7185]' : 'text-[#7A5B32]'
              }`}
            >
              {progress}%
            </span>
          </div>

          {/* Progress Bar with Traversing Shimmer */}
          <div
            className={`relative h-2.5 w-full overflow-hidden rounded-full border p-0.5 shadow-inner ${
              isAquaticTheme
                ? 'bg-[#071B2D] border-sky-400/30'
                : 'bg-[#EFE8DC] border-[#6D5738]/25'
            }`}
          >
            <motion.div
              className={`h-full rounded-full relative overflow-hidden ${
                isAquaticTheme
                  ? 'bg-gradient-to-r from-[#0EA5E9] via-[#10B981] to-[#E11D48] shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                  : 'bg-gradient-to-r from-[#B68D52] via-[#D4AF78] to-[#B68D52] shadow-[0_0_12px_rgba(182,141,82,0.35)]'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut', duration: durationMs / 1000 }}
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
                key={currentStepIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className={`text-[11.5px] font-semibold tracking-wide ${
                  isAquaticTheme ? 'text-[#9EC6DF]' : 'text-[#5C4D3C]'
                }`}
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

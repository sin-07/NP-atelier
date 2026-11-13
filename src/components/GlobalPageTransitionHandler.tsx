"use client"

import { useEffect, useRef, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useMarketplace } from '../context/MarketplaceContext'
import AtelierGlobalLoader from './AtelierGlobalLoader'
import { AnimatePresence, motion } from 'framer-motion'

export default function GlobalPageTransitionHandler() {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)

  const { globalLoader, hideGlobalLoader, activeDepartment, isAquaticTheme } = useMarketplace()
  const prevDeptRef = useRef(activeDepartment)

  const [isSliding, setIsSliding] = useState(false)
  const [sliderProgress, setSliderProgress] = useState(0)

  // 1. Trigger glowing top page slider on route changes and department / world switching
  useEffect(() => {
    const routeChanged = prevPathnameRef.current !== pathname
    const deptChanged = prevDeptRef.current !== activeDepartment

    if (routeChanged || deptChanged) {
      prevPathnameRef.current = pathname
      prevDeptRef.current = activeDepartment

      setIsSliding(true)
      setSliderProgress(22)

      const t1 = setTimeout(() => setSliderProgress(68), 50)
      const t2 = setTimeout(() => setSliderProgress(100), 220)
      const t3 = setTimeout(() => {
        setIsSliding(false)
        setSliderProgress(0)
      }, 420)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [pathname, activeDepartment])

  // 2. Immediately dismiss any active global loader when route/pathname changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      if (globalLoader?.isOpen) {
        hideGlobalLoader()
      }
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [pathname, globalLoader?.isOpen, hideGlobalLoader])

  // 3. Safety fallback: NEVER let a global loader hang or freeze on screen
  useEffect(() => {
    if (!globalLoader?.isOpen) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
      return
    }

    const maxWait = Math.max(900, (globalLoader.durationMs || 650) + 350)
    const safetyTimer = setTimeout(() => {
      if (globalLoader?.onComplete) {
        try {
          globalLoader.onComplete()
        } catch {}
      }
      hideGlobalLoader()
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }, maxWait)

    return () => clearTimeout(safetyTimer)
  }, [globalLoader, hideGlobalLoader])

  const handleComplete = useCallback(() => {
    if (globalLoader?.onComplete) {
      try {
        globalLoader.onComplete()
      } catch {}
    }
    hideGlobalLoader()
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }, [globalLoader, hideGlobalLoader])

  return (
    <>
      {/* Top Browser Page Slider Bar */}
      <AnimatePresence>
        {isSliding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed top-0 inset-x-0 z-[100] h-[3.5px] pointer-events-none"
          >
            <div
              className={`h-full relative transition-all ease-out ${
                isAquaticTheme
                  ? 'bg-gradient-to-r from-[#0369A1] via-[#0D9488] to-[#10B981]'
                  : 'bg-gradient-to-r from-[#8C6D46] via-[#D4AF78] to-[#F5D785]'
              }`}
              style={{
                width: `${sliderProgress}%`,
                transitionDuration: sliderProgress === 100 ? '160ms' : '220ms',
              }}
            >
              {/* Glowing leading spark tip */}
              <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 h-2.5 w-8 rounded-full blur-xs ${
                  isAquaticTheme ? 'bg-[#38BDF8]' : 'bg-[#FFF2B2]'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {globalLoader?.isOpen && (
          <AtelierGlobalLoader
            key="active-global-loader"
            mode={globalLoader.mode}
            title={globalLoader.title}
            subtitle={globalLoader.subtitle}
            durationMs={globalLoader.durationMs}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </>
  )
}

"use client"

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useMarketplace } from '../context/MarketplaceContext'
import AtelierGlobalLoader from './AtelierGlobalLoader'
import { AnimatePresence } from 'framer-motion'

export default function GlobalPageTransitionHandler() {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)

  const { globalLoader, hideGlobalLoader } = useMarketplace()

  // 1. Immediately dismiss any active global loader when route/pathname changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      if (globalLoader?.isOpen) {
        hideGlobalLoader()
      }
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [pathname, globalLoader?.isOpen, hideGlobalLoader])

  // 2. Safety fallback: NEVER let a global loader hang or freeze on screen
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
  )
}

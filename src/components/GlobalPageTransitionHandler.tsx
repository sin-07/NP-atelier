"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useMarketplace } from '../context/MarketplaceContext'
import AtelierGlobalLoader from './AtelierGlobalLoader'
import { AnimatePresence } from 'framer-motion'

export default function GlobalPageTransitionHandler() {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)
  const isNavigatingRef = useRef(false)

  const { globalLoader, triggerGlobalLoader, hideGlobalLoader } = useMarketplace()

  // 1. Intercept link clicks across the application for page transitions
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Ignore right clicks or clicks with modifier keys (open in new tab etc.)
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return

      const target = e.target as HTMLElement | null
      if (!target) return

      const anchor = target.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Ignore external protocols and blank targets
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) {
        return
      }

      if (anchor.target === '_blank') return

      // Ignore same-page hashtag / in-page anchor navigation (e.g. #collection, #aquarium, #makers)
      if (href.startsWith('#')) return

      try {
        const currentUrl = new URL(window.location.href)
        const destUrl = new URL(href, window.location.origin)

        // Ignore if navigating to exact same pathname and search
        if (destUrl.pathname === currentUrl.pathname && destUrl.search === currentUrl.search) {
          return
        }

        // Only trigger special branded lounge transition for /profile and /admin
        if (destUrl.pathname !== currentUrl.pathname) {
          if (destUrl.pathname.startsWith('/profile') || destUrl.pathname.startsWith('/admin')) {
            isNavigatingRef.current = true

            const isAdmin = destUrl.pathname.startsWith('/admin')
            triggerGlobalLoader({
              mode: 'page_switch',
              title: isAdmin ? 'Executive Access' : 'Patron Atelier Lounge',
              subtitle: isAdmin
                ? 'NP Atelier Administrative Terminal & Live Operations...'
                : 'Accessing Bespoke Orders & Delivery Passport...',
              durationMs: 380,
            })
          }
        }
      } catch {
        // Ignore URL parse errors
      }
    }

    document.addEventListener('click', handleGlobalClick, true)
    return () => {
      document.removeEventListener('click', handleGlobalClick, true)
    }
  }, [triggerGlobalLoader])

  // 2. Listen to route pathname changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      isNavigatingRef.current = false
    }
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      {globalLoader?.isOpen && (
        <AtelierGlobalLoader
          key="active-global-loader"
          mode={globalLoader.mode}
          title={globalLoader.title}
          subtitle={globalLoader.subtitle}
          durationMs={globalLoader.durationMs}
          onComplete={() => {
            if (globalLoader.onComplete) {
              globalLoader.onComplete()
            }
            hideGlobalLoader()
          }}
        />
      )}
    </AnimatePresence>
  )
}

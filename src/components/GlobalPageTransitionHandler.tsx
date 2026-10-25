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

        // Only trigger if destination pathname is DIFFERENT from current pathname
        if (destUrl.pathname !== currentUrl.pathname) {
          isNavigatingRef.current = true

          let targetTitle = 'Entering NP Atelier'
          let targetSubtitle = 'Curated Artisan Marketplace & Living Waters'

          if (destUrl.pathname.startsWith('/profile')) {
            targetTitle = 'Patron Atelier Lounge'
            targetSubtitle = 'Accessing Bespoke Orders & Delivery Passport...'
          } else if (destUrl.pathname.startsWith('/admin')) {
            targetTitle = 'Executive Access'
            targetSubtitle = 'NP Atelier Administrative Terminal & Live Operations...'
          } else if (destUrl.pathname === '/') {
            targetTitle = 'Returning to Boutique'
            targetSubtitle = 'Living Waters & Artisan Mastery...'
          }

          triggerGlobalLoader({
            mode: 'page_switch',
            title: targetTitle,
            subtitle: targetSubtitle,
            durationMs: 700,
          })
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

  // 2. Listen to route pathname changes (browser back/forward or programmatic navigation)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname

      // If page switched without a prior link click (e.g. browser back/forward or router.push)
      // and loader is not currently open, trigger a snappy transition
      if (!globalLoader?.isOpen && !isNavigatingRef.current) {
        let routeTitle = 'Entering NP Atelier'
        let routeSub = 'Curated Artisan Marketplace & Living Waters'

        if (pathname.startsWith('/profile')) {
          routeTitle = 'Patron Atelier Lounge'
          routeSub = 'Accessing Bespoke Orders & Delivery Passport...'
        } else if (pathname.startsWith('/admin')) {
          routeTitle = 'Executive Access'
          routeSub = 'NP Atelier Administrative Terminal & Live Operations...'
        } else if (pathname === '/') {
          routeTitle = 'Welcome to Boutique'
          routeSub = 'Living Waters & Artisan Mastery...'
        }

        triggerGlobalLoader({
          mode: 'page_switch',
          title: routeTitle,
          subtitle: routeSub,
          durationMs: 650,
        })
      }

      isNavigatingRef.current = false
    }
  }, [pathname, globalLoader?.isOpen, triggerGlobalLoader])

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

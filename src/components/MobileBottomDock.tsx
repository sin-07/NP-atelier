"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import {
  Compass,
  Sparkles,
  Search,
  Heart,
  ShoppingBag,
  Fish,
  Palette,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

export default function MobileBottomDock() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'crafts' | 'aquarium' | 'search' | 'wishlist' | 'bag'>('home')
  const dockRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)

    if (dockRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          dockRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, delay: 0.05, ease: 'power2.out', clearProps: 'all' }
        )
        gsap.fromTo(
          '.gsap-dock-btn',
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.025, delay: 0.1, ease: 'power2.out', clearProps: 'all' }
        )
      }, dockRef)
      return () => ctx.revert()
    }
  }, [])

  const {
    wishlist,
    cartCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsQuickSearchOpen,
    activeDepartment,
    setActiveDepartment,
  } = useMarketplace()

  // Auto-sync active tab with activeDepartment
  useEffect(() => {
    if (activeDepartment === 'aquarium') {
      setActiveTab('aquarium')
    } else if (activeDepartment === 'crafts') {
      setActiveTab('crafts')
    }
  }, [activeDepartment])

  const scrollToAnchor = (href: string) => {
    if (typeof window === 'undefined') return
    if (window.location.pathname !== '/') {
      if (href === '#acquario-tropicale' || href === '#aquarium') {
        window.location.href = '/?dept=aquarium'
        return
      }
      window.location.href = href === '#home' ? '/' : `/${href}`
      return
    }
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const target = document.querySelector(href)
    if (target) {
      const rect = target.getBoundingClientRect()
      const top = rect.top + window.pageYOffset - 85
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNavClick = (tab: 'home' | 'crafts' | 'aquarium') => {
    setActiveTab(tab)
    if (tab === 'home') {
      setActiveDepartment?.('crafts')
      scrollToAnchor('#home')
    } else if (tab === 'crafts') {
      setActiveDepartment?.('crafts')
      scrollToAnchor('#collection')
    } else if (tab === 'aquarium') {
      setActiveDepartment?.('aquarium')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <nav
      ref={dockRef}
      aria-label="Mobile primary navigation"
      className="fixed bottom-3 inset-x-2 max-w-md mx-auto z-40 sm:hidden transform-gpu will-change-transform"
    >
      <div className="flex items-center justify-around rounded-full border border-[#D4AF37]/60 bg-[#120F0A] p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.55),0_0_20px_rgba(212,175,55,0.15)]">
        {/* 1. Home / Atelier */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`gsap-dock-btn relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-colors duration-200 active:scale-95 cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#ECC872]'
              : 'text-[#A89876] hover:text-[#ECC872]'
          }`}
        >
          {activeTab === 'home' && (
            <motion.div
              layoutId="mobileDockPill"
              className="absolute inset-0 rounded-full bg-[#221B10] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.4)]"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <Compass className="h-4.5 w-4.5 relative z-10" />
          <span className="text-[9.5px] font-bold tracking-tight mt-0.5 relative z-10">Atelier</span>
        </button>

        {/* 2. Crafts */}
        <button
          type="button"
          onClick={() => handleNavClick('crafts')}
          className={`gsap-dock-btn relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-colors duration-200 active:scale-95 cursor-pointer ${
            activeTab === 'crafts'
              ? 'text-[#ECC872]'
              : 'text-[#A89876] hover:text-[#ECC872]'
          }`}
        >
          {activeTab === 'crafts' && (
            <motion.div
              layoutId="mobileDockPill"
              className="absolute inset-0 rounded-full bg-[#221B10] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.4)]"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <Palette className="h-4.5 w-4.5 relative z-10" />
          <span className="text-[9.5px] font-bold tracking-tight mt-0.5 relative z-10">Crafts</span>
        </button>

        {/* 3. Acquario Tropicale */}
        <button
          type="button"
          onClick={() => handleNavClick('aquarium')}
          className={`gsap-dock-btn relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-colors duration-200 active:scale-95 cursor-pointer ${
            activeTab === 'aquarium'
              ? 'text-[#ECC872]'
              : 'text-teal-400 hover:text-teal-300'
          }`}
        >
          {activeTab === 'aquarium' && (
            <motion.div
              layoutId="mobileDockPill"
              className="absolute inset-0 rounded-full bg-[#0E282F] border border-teal-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.4)]"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <Fish className="h-4.5 w-4.5 relative z-10 text-cyan-400" />
          <span className="text-[9.5px] font-bold tracking-tight mt-0.5 relative z-10 font-serif">Acquario</span>
        </button>

        {/* 3. Search Spotlight */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('search')
            setIsQuickSearchOpen(true)
          }}
          className="gsap-dock-btn flex flex-col items-center justify-center py-1 px-3 rounded-full text-[#A89876] hover:text-[#ECC872] active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] text-[#120F0A] shadow-md">
            <Search className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5 text-[#ECC872]">Search</span>
        </button>

        {/* 4. Wishlist */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('wishlist')
            setIsWishlistOpen(true)
          }}
          className="gsap-dock-btn relative flex flex-col items-center justify-center py-1 px-3 rounded-full text-[#A89876] hover:text-[#ECC872] active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <div className="relative">
            <Heart className="h-5 w-5" />
            {mounted && wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Saved</span>
        </button>

        {/* 5. Shopping Bag */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('bag')
            setIsCartOpen(true)
          }}
          className="gsap-dock-btn relative flex flex-col items-center justify-center py-1 px-3 rounded-full text-[#A89876] hover:text-[#ECC872] active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-r from-[#ECC872] to-[#D4AF37] px-1 text-[9px] font-black text-[#14100A] shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Bag</span>
        </button>
      </div>
    </nav>
  )
}

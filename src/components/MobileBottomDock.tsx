"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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
        router.push('/?dept=aquarium')
        return
      }
      router.push(href === '#home' ? '/' : `/${href}`)
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
      className="fixed bottom-3 inset-x-2 max-w-md mx-auto z-40 sm:hidden transform-gpu"
    >
      <div className="flex items-center justify-around rounded-full border border-[#8C6D46]/35 bg-[#FCF9F4]/95 backdrop-blur-md p-1.5 shadow-[0_12px_36px_rgba(72,54,30,0.18),0_0_16px_rgba(212,175,120,0.12)]">
        {/* 1. Home / Atelier */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`gsap-dock-btn relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-colors duration-200 active:scale-95 cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#141210]'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          {activeTab === 'home' && (
            <motion.div
              layoutId="mobileDockPill"
              className="absolute inset-0 rounded-full bg-[#EFE8DC] shadow-xs border border-[#8C6D46]/25"
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
              ? 'text-[#141210]'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          {activeTab === 'crafts' && (
            <motion.div
              layoutId="mobileDockPill"
              className="absolute inset-0 rounded-full bg-[#EFE8DC] shadow-xs border border-[#8C6D46]/25"
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
              ? 'text-[#141210]'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          {activeTab === 'aquarium' && (
            <motion.div
              layoutId="mobileDockPill"
              className="absolute inset-0 rounded-full bg-[#EFE8DC] shadow-xs border border-[#8C6D46]/25"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <Fish className="h-4.5 w-4.5 relative z-10 text-teal-700" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5 relative z-10 font-tagline">Acquario</span>
        </button>

        {/* 3. Search Spotlight */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('search')
            setIsQuickSearchOpen(true)
          }}
          className="gsap-dock-btn flex flex-col items-center justify-center py-1 px-3 rounded-full text-[#5C4D3C] hover:text-[#141210] active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-[#D4AF78] to-[#E5C18A] text-[#141210] shadow-sm border border-[#B8925A]/40">
            <Search className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5 text-[#7A5B32]">Search</span>
        </button>

        {/* 4. Wishlist */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('wishlist')
            setIsWishlistOpen(true)
          }}
          className="gsap-dock-btn relative flex flex-col items-center justify-center py-1 px-3 rounded-full text-[#5C4D3C] hover:text-[#141210] active:scale-95 transition-all duration-150 cursor-pointer"
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
          className="gsap-dock-btn relative flex flex-col items-center justify-center py-1 px-3 rounded-full text-[#5C4D3C] hover:text-[#141210] active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-r from-[#ECC872] to-[#D4AF78] px-1 text-[9px] font-black text-[#141210] shadow-xs">
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

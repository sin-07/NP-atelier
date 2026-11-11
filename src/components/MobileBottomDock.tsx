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
    isAquaticTheme,
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
      <div
        className={`flex items-center justify-around rounded-full border backdrop-blur-md p-1.5 transition-colors duration-300 ${
          isAquaticTheme
            ? 'border-sky-400/35 bg-[#071A2B]/95 shadow-[0_12px_36px_rgba(2,12,24,0.7),0_0_18px_rgba(16,185,129,0.18)]'
            : 'border-[#8C6D46]/35 bg-[#FCF9F4]/95 shadow-[0_12px_36px_rgba(72,54,30,0.18),0_0_16px_rgba(212,175,120,0.12)]'
        }`}
      >
        {/* 1. Home / Atelier */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`gsap-dock-btn relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-colors duration-200 active:scale-95 cursor-pointer ${
            activeTab === 'home'
              ? isAquaticTheme
                ? 'text-white'
                : 'text-[#141210]'
              : isAquaticTheme
              ? 'text-[#B6D4E8] hover:text-white'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          {activeTab === 'home' && (
            <motion.div
              layoutId="mobileDockPill"
              className={`absolute inset-0 rounded-full shadow-xs border ${
                isAquaticTheme
                  ? 'bg-[#E11D48] border-rose-400/60'
                  : 'bg-[#EFE8DC] border-[#8C6D46]/25'
              }`}
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
              ? isAquaticTheme
                ? 'text-white'
                : 'text-[#141210]'
              : isAquaticTheme
              ? 'text-[#B6D4E8] hover:text-white'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          {activeTab === 'crafts' && (
            <motion.div
              layoutId="mobileDockPill"
              className={`absolute inset-0 rounded-full shadow-xs border ${
                isAquaticTheme
                  ? 'bg-[#E11D48] border-rose-400/60'
                  : 'bg-[#EFE8DC] border-[#8C6D46]/25'
              }`}
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
              ? isAquaticTheme
                ? 'text-white'
                : 'text-[#141210]'
              : isAquaticTheme
              ? 'text-[#B6D4E8] hover:text-emerald-300'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          {activeTab === 'aquarium' && (
            <motion.div
              layoutId="mobileDockPill"
              className={`absolute inset-0 rounded-full shadow-xs border ${
                isAquaticTheme
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#F43F5E] border-rose-400/60 shadow-[0_4px_14px_rgba(225,29,72,0.45)]'
                  : 'bg-[#EFE8DC] border-[#8C6D46]/25'
              }`}
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <Fish
            className={`h-4.5 w-4.5 relative z-10 ${
              isAquaticTheme
                ? activeTab === 'aquarium'
                  ? 'text-emerald-300'
                  : 'text-emerald-400'
                : 'text-teal-700'
            }`}
          />
          <span className="text-[10px] font-bold tracking-tight mt-0.5 relative z-10 font-tagline">Acquario</span>
        </button>

        {/* 3. Search Spotlight */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('search')
            setIsQuickSearchOpen(true)
          }}
          className={`gsap-dock-btn flex flex-col items-center justify-center py-1 px-3 rounded-full active:scale-95 transition-all duration-150 cursor-pointer ${
            isAquaticTheme
              ? 'text-[#B6D4E8] hover:text-white'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          <div
            className={`grid h-8 w-8 place-items-center rounded-full shadow-sm border ${
              isAquaticTheme
                ? 'bg-gradient-to-tr from-[#059669] to-[#34D399] text-[#051320] border-emerald-300/60 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-gradient-to-tr from-[#D4AF78] to-[#E5C18A] text-[#141210] border-[#B8925A]/40'
            }`}
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight mt-0.5 ${
              isAquaticTheme ? 'text-emerald-300' : 'text-[#7A5B32]'
            }`}
          >
            Search
          </span>
        </button>

        {/* 4. Wishlist */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('wishlist')
            setIsWishlistOpen(true)
          }}
          className={`gsap-dock-btn relative flex flex-col items-center justify-center py-1 px-3 rounded-full active:scale-95 transition-all duration-150 cursor-pointer ${
            isAquaticTheme
              ? 'text-[#B6D4E8] hover:text-white'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
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
          className={`gsap-dock-btn relative flex flex-col items-center justify-center py-1 px-3 rounded-full active:scale-95 transition-all duration-150 cursor-pointer ${
            isAquaticTheme
              ? 'text-[#B6D4E8] hover:text-white'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-black shadow-xs ${
                  isAquaticTheme
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white'
                    : 'bg-gradient-to-r from-[#ECC872] to-[#D4AF78] text-[#141210]'
                }`}
              >
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

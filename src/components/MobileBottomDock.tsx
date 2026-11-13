"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
      if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/') {
          router.push('/')
          return
        }
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    } else if (tab === 'crafts') {
      setActiveDepartment?.('crafts')
      requestAnimationFrame(() => scrollToAnchor('#collection'))
    } else if (tab === 'aquarium') {
      setActiveDepartment?.('aquarium')
      if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/') {
          router.push('/?dept=aquarium')
          return
        }
        window.scrollTo({ top: 0, behavior: 'instant' })
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
        className={`flex items-center justify-around rounded-full border backdrop-blur-md p-1.5 transition-colors duration-200 ${
          isAquaticTheme
            ? 'border-sky-300/75 bg-white/95 shadow-[0_10px_30px_rgba(12,74,110,0.16),0_0_14px_rgba(16,185,129,0.14)]'
            : 'border-[#8C6D46]/35 bg-[#FCF9F4]/95 shadow-[0_12px_36px_rgba(72,54,30,0.18),0_0_16px_rgba(212,175,120,0.12)]'
        }`}
      >
        {/* 1. Home / Atelier */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full border transition-colors duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            activeTab === 'home'
              ? isAquaticTheme
                ? 'bg-[#E11D48] text-white border-rose-500 shadow-xs'
                : 'bg-[#EFE8DC] text-[#141210] border-[#8C6D46]/25 shadow-xs'
              : isAquaticTheme
              ? 'border-transparent text-[#2C5270] hover:text-[#0A2540]'
              : 'border-transparent text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          <Compass className="h-4.5 w-4.5 relative z-10" />
          <span className="text-[9.5px] font-bold tracking-tight mt-0.5 relative z-10">Atelier</span>
        </button>

        {/* 2. Crafts */}
        <button
          type="button"
          onClick={() => handleNavClick('crafts')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full border transition-colors duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            activeTab === 'crafts'
              ? isAquaticTheme
                ? 'bg-[#E11D48] text-white border-rose-500 shadow-xs'
                : 'bg-[#EFE8DC] text-[#141210] border-[#8C6D46]/25 shadow-xs'
              : isAquaticTheme
              ? 'border-transparent text-[#2C5270] hover:text-[#0A2540]'
              : 'border-transparent text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          <Palette className="h-4.5 w-4.5 relative z-10" />
          <span className="text-[9.5px] font-bold tracking-tight mt-0.5 relative z-10">Crafts</span>
        </button>

        {/* 3. Acquario Tropicale */}
        <button
          type="button"
          onClick={() => handleNavClick('aquarium')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full border transition-colors duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            activeTab === 'aquarium'
              ? isAquaticTheme
                ? 'bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white border-rose-500 shadow-[0_4px_12px_rgba(225,29,72,0.28)]'
                : 'bg-[#EFE8DC] text-[#141210] border-[#8C6D46]/25 shadow-xs'
              : isAquaticTheme
              ? 'border-transparent text-[#2C5270] hover:text-emerald-700'
              : 'border-transparent text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          <Fish
            className={`h-4.5 w-4.5 relative z-10 ${
              isAquaticTheme
                ? activeTab === 'aquarium'
                  ? 'text-white'
                  : 'text-emerald-600'
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
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full active:scale-95 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            isAquaticTheme
              ? 'text-[#2C5270] hover:text-[#0A2540]'
              : 'text-[#5C4D3C] hover:text-[#141210]'
          }`}
        >
          <div
            className={`grid h-8 w-8 place-items-center rounded-full shadow-sm border ${
              isAquaticTheme
                ? 'bg-gradient-to-tr from-[#059669] to-[#10B981] text-white border-emerald-500/60 shadow-[0_4px_12px_rgba(16,185,129,0.28)]'
                : 'bg-gradient-to-tr from-[#D4AF78] to-[#E5C18A] text-[#141210] border-[#B8925A]/40'
            }`}
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight mt-0.5 ${
              isAquaticTheme ? 'text-emerald-700' : 'text-[#7A5B32]'
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
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full active:scale-95 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            isAquaticTheme
              ? 'text-[#2C5270] hover:text-[#0A2540]'
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
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full active:scale-95 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
            isAquaticTheme
              ? 'text-[#2C5270] hover:text-[#0A2540]'
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

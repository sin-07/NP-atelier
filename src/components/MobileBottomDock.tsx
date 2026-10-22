"use client"

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import {
  Compass,
  Sparkles,
  Search,
  Heart,
  ShoppingBag,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

export default function MobileBottomDock() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'drops' | 'search' | 'wishlist' | 'bag'>('home')
  const dockRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)

    if (dockRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          dockRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, delay: 0.25, ease: 'power3.out', clearProps: 'transform' }
        )
        gsap.fromTo(
          '.gsap-dock-btn',
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.4, ease: 'back.out(1.4)' }
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
    setActiveDepartment,
  } = useMarketplace()

  const scrollToAnchor = (href: string) => {
    if (typeof window !== 'undefined') {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleNavClick = (tab: 'home' | 'drops') => {
    setActiveTab(tab)
    if (tab === 'home') {
      scrollToAnchor('#home')
    } else if (tab === 'drops') {
      if (setActiveDepartment) setActiveDepartment('all')
      scrollToAnchor('#collection')
    }
  }

  return (
    <nav
      ref={dockRef}
      aria-label="Mobile primary navigation"
      className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 sm:hidden"
    >
      <div className="flex items-center justify-around rounded-full border border-[#D4AF37]/50 bg-[#120F0A]/96 p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.45),0_0_15px_rgba(212,175,55,0.15)] backdrop-blur-sm">
        {/* 1. Home / Atelier */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`gsap-dock-btn flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#ECC872] bg-[#221B10]'
              : 'text-[#A89876] hover:text-[#ECC872]'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Atelier</span>
        </button>

        {/* 2. Drops / Collections */}
        <button
          type="button"
          onClick={() => handleNavClick('drops')}
          className={`gsap-dock-btn flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-150 active:scale-95 cursor-pointer ${
            activeTab === 'drops'
              ? 'text-[#ECC872] bg-[#221B10]'
              : 'text-[#A89876] hover:text-[#ECC872]'
          }`}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Drops</span>
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

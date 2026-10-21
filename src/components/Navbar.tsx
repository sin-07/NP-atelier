"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  X,
  Palette,
  Waves,
  ShieldCheck,
  ChevronDown,
  Copy,
  Check,
  ArrowRight,
  Layers,
  Gem,
  Fish,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [megamenuOpen, setMegamenuOpen] = useState(false)
  const [copiedCoupon, setCopiedCoupon] = useState(false)
  const megamenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25)
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false)
        setMegamenuOpen(false)
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const {
    branding,
    activeDepartment,
    setActiveDepartment,
    cartCount,
    wishlist,
    user,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    setIsSellOpen,
    setIsQuickSearchOpen,
    showToast,
    logout,
  } = useMarketplace()

  // Smooth scroll using global Lenis instance if present, else fallback
  const scrollToAnchor = (href: string) => {
    if (typeof window !== 'undefined') {
      const lenis = (window as any).lenis
      const target = document.querySelector(href)
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -90, duration: 1.2 })
        } else {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const handleLinkClick = (href: string, dept?: 'all' | 'crafts' | 'aquarium') => {
    if (dept && setActiveDepartment) {
      setActiveDepartment(dept)
    }
    scrollToAnchor(href)
    setIsMenuOpen(false)
    setMegamenuOpen(false)
  }

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator?.clipboard) {
      navigator.clipboard.writeText('ATELIER10')
      setCopiedCoupon(true)
      if (showToast) {
        showToast({
          title: 'Code Copied! ✦',
          message: 'Code ATELIER10 saved to clipboard for 10% off at checkout.',
          type: 'success',
        })
      }
      setTimeout(() => setCopiedCoupon(false), 2500)
    }
  }

  const handleMegamenuEnter = () => {
    if (megamenuTimeoutRef.current) clearTimeout(megamenuTimeoutRef.current)
    setMegamenuOpen(true)
  }

  const handleMegamenuLeave = () => {
    megamenuTimeoutRef.current = setTimeout(() => {
      setMegamenuOpen(false)
    }, 180)
  }

  const siteName = branding?.siteName || 'NP Atelier'

  return (
    <>
      {/* 1. Ultra-Sleek Haute Atelier Ribbon */}
      <aside aria-label="Announcement banner" className="relative z-50 bg-[#0E0C09] text-[#E5D7B7] border-b border-[#241F16]/90 transition-colors duration-200">
        <div className="section-shell">
          <div className="flex h-9 items-center justify-between text-[11px] font-medium tracking-wide">
            {/* Left Tagline & Emblem */}
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-tr from-[#B8860B] to-[#ECC872] text-[9px] text-[#141008] font-black shadow-xs">
                ✦
              </span>
              <span className="hidden sm:inline uppercase text-[10px] tracking-[0.2em] text-[#CBB994] font-semibold">
                Haute Atelier & Aquatics
              </span>
              <span className="hidden sm:inline text-[#423724]">•</span>
              <span className="truncate text-[#EADFC7]">
                Live Arrival Guarantee & Free Pan-India Courier
              </span>
            </div>

            {/* Center Code Copy Trigger */}
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-[#A89876]">Unlock 10% Off:</span>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="group inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/40 bg-[#1A160F] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#F5E6C8] hover:border-[#ECC872] hover:bg-[#2A2215] transition cursor-pointer"
                title="Click to copy coupon code"
              >
                <span>ATELIER10</span>
                {copiedCoupon ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Copy className="h-2.5 w-2.5 text-[#ECC872] opacity-75 group-hover:opacity-100" />
                )}
              </button>
            </div>

            {/* Right Quick Links */}
            <div className="flex items-center gap-4 text-[#A89876] shrink-0">
              <a
                href="#makers"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToAnchor('#makers')
                }}
                className="hidden md:inline hover:text-[#ECC872] transition text-[11px]"
              >
                Makers Collective
              </a>
              <span className="hidden md:inline text-[#423724]">•</span>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#D4AF37] hover:text-[#FFF] transition"
              >
                <LayoutDashboard className="h-3 w-3" />
                <span className="underline underline-offset-2">Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Luxury Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-[0_12px_32px_rgba(20,18,12,0.06)] py-2.5'
            : 'bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#1A160F]/[0.06] py-3.5'
        }`}
      >
        <div className="section-shell">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo & Couture Emblem */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                scrollToAnchor('#home')
              }}
              className="group flex items-center gap-3 shrink-0 select-none cursor-pointer"
            >
              {branding?.logoImageUrl &&
              (branding.logoType === 'image' || branding.logoType === 'both') ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.siteName}
                  className="h-10 w-auto max-h-10 max-w-[120px] rounded-lg object-contain border border-[#D4AF37]/40 shadow-xs bg-white p-0.5 transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#1E1911] via-[#14100A] to-[#261E10] text-[#ECC872] border border-[#D4AF37]/50 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.30)]">
                  <span className="font-serif font-bold text-base tracking-wider">NP</span>
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#ECC872] ring-2 ring-[#FAF8F5]" />
                </div>
              )}

              <div className="flex flex-col">
                <span
                  suppressHydrationWarning
                  className="font-serif text-xl sm:text-2xl font-bold tracking-[0.14em] uppercase text-[#141414] leading-tight"
                >
                  {siteName}
                </span>
                <span
                  suppressHydrationWarning
                  className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.32em] text-[#916B19]"
                >
                  Haute Crafts & Living Waters
                </span>
              </div>
            </a>

            {/* Center Navigation Dock with Megamenu */}
            <nav className="hidden lg:flex items-center relative">
              <div className="flex items-center rounded-full border border-[#E8DEC7]/90 bg-white/80 p-1 shadow-[0_2px_10px_rgba(20,18,12,0.03)] backdrop-blur-md">
                {/* Collections with Mega Menu Trigger */}
                <div
                  className="relative"
                  onMouseEnter={handleMegamenuEnter}
                  onMouseLeave={handleMegamenuLeave}
                >
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#collection', 'all')}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition duration-150 cursor-pointer ${
                      megamenuOpen || activeDepartment === 'all'
                        ? 'bg-[#141414] text-[#ECC872] shadow-xs'
                        : 'text-[#4A4339] hover:text-[#141414] hover:bg-[#F5EFE1]'
                    }`}
                  >
                    <span>Collections</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        megamenuOpen ? 'rotate-180 text-[#ECC872]' : 'text-[#8A7960]'
                      }`}
                    />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {megamenuOpen && (
                    <div className="absolute left-0 top-full pt-2.5 w-[580px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] p-5 shadow-[0_25px_50px_-12px_rgba(20,18,12,0.18)]">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Panel 1: Artisan Crafts */}
                          <div
                            onClick={() => handleLinkClick('#collection', 'crafts')}
                            className="group/craft relative rounded-2xl border border-[#E8DEC7] bg-white p-4 transition-all duration-200 hover:border-[#D4AF37] hover:shadow-md cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 border border-amber-200/60 text-[#B8860B]">
                                    <Palette className="h-4 w-4" />
                                  </span>
                                  <div>
                                    <h4 className="text-xs font-bold text-[#141414] uppercase tracking-wider">
                                      Artisan Crafts
                                    </h4>
                                    <p className="text-[10px] text-[#7A6A53]">Makers Atelier</p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-[#B8860B] group-hover/craft:translate-x-0.5 transition-transform">
                                  →
                                </span>
                              </div>
                              <ul className="space-y-1.5 text-[11px] text-[#5C5242] pt-2 border-t border-stone-100">
                                <li className="hover:text-[#141414] flex items-center gap-1.5">
                                  <Gem className="h-3 w-3 text-amber-600" />
                                  Handmade Jewelry & Talismans
                                </li>
                                <li className="hover:text-[#141414] flex items-center gap-1.5">
                                  <Sparkles className="h-3 w-3 text-rose-500" />
                                  UV Resin & Botanical Art
                                </li>
                                <li className="hover:text-[#141414] flex items-center gap-1.5">
                                  <Layers className="h-3 w-3 text-purple-600" />
                                  DIY Creative Craft Kits
                                </li>
                              </ul>
                            </div>
                            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-[#8C6D2B] font-bold">
                              <span>Explore 40+ Creations</span>
                              <span className="rounded-full bg-amber-50 px-2 py-0.5">Filter Drops</span>
                            </div>
                          </div>

                          {/* Panel 2: Living Aquatics */}
                          <div
                            onClick={() => handleLinkClick('#collection', 'aquarium')}
                            className="group/aqua relative rounded-2xl border border-[#D7EBEB] bg-white p-4 transition-all duration-200 hover:border-teal-500 hover:shadow-md cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-50 border border-teal-200/60 text-teal-700">
                                    <Waves className="h-4 w-4" />
                                  </span>
                                  <div>
                                    <h4 className="text-xs font-bold text-[#141414] uppercase tracking-wider">
                                      Living Aquatics
                                    </h4>
                                    <p className="text-[10px] text-teal-700">Exotic Fish & Habitats</p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-teal-700 group-hover/aqua:translate-x-0.5 transition-transform">
                                  →
                                </span>
                              </div>
                              <ul className="space-y-1.5 text-[11px] text-[#5C5242] pt-2 border-t border-stone-100">
                                <li className="hover:text-[#141414] flex items-center gap-1.5">
                                  <Fish className="h-3 w-3 text-teal-600" />
                                  Show Bettas & Royal Discus
                                </li>
                                <li className="hover:text-[#141414] flex items-center gap-1.5">
                                  <Sparkles className="h-3 w-3 text-cyan-600" />
                                  Nano Rimless Aquascapes
                                </li>
                                <li className="hover:text-[#141414] flex items-center gap-1.5">
                                  <Layers className="h-3 w-3 text-emerald-600" />
                                  CO2 Systems & Live Plants
                                </li>
                              </ul>
                            </div>
                            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-teal-800 font-bold">
                              <span>100% Live Arrival Assured</span>
                              <span className="rounded-full bg-teal-50 px-2 py-0.5">Filter Waters</span>
                            </div>
                          </div>
                        </div>

                        {/* Megamenu Footer banner */}
                        <div className="mt-3.5 flex items-center justify-between rounded-xl bg-[#14100A] px-4 py-2.5 text-xs text-[#EADFC7]">
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#ECC872]" />
                            <span>Bespoke Handcrafted Orders with Artisan Tracking</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleLinkClick('#customize')}
                            className="inline-flex items-center gap-1 font-bold text-[#ECC872] hover:text-white transition"
                          >
                            <span>Open Studio</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Crafts Direct Tab */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#collection', 'crafts')}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition duration-150 cursor-pointer ${
                    activeDepartment === 'crafts'
                      ? 'bg-[#141414] text-[#ECC872] shadow-xs'
                      : 'text-[#4A4339] hover:text-[#141414] hover:bg-[#F5EFE1]'
                  }`}
                >
                  Artisan Crafts
                </button>

                {/* Aquatics Direct Tab */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#collection', 'aquarium')}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition duration-150 cursor-pointer ${
                    activeDepartment === 'aquarium'
                      ? 'bg-[#141414] text-[#ECC872] shadow-xs'
                      : 'text-[#4A4339] hover:text-[#141414] hover:bg-[#F5EFE1]'
                  }`}
                >
                  Nature Aquatics
                </button>

                {/* Custom Studio */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#customize')}
                  className="rounded-full px-3.5 py-2 text-xs font-bold tracking-wide text-[#4A4339] hover:text-[#141414] hover:bg-[#F5EFE1] transition duration-150 cursor-pointer"
                >
                  Bespoke Studio
                </button>

                {/* The Collective */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#makers')}
                  className="rounded-full px-3.5 py-2 text-xs font-bold tracking-wide text-[#4A4339] hover:text-[#141414] hover:bg-[#F5EFE1] transition duration-150 cursor-pointer"
                >
                  The Collective
                </button>
              </div>
            </nav>

            {/* Right Side Sculpted Action Center */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Quick Search Spotlight Button */}
              <button
                type="button"
                onClick={() => setIsQuickSearchOpen(true)}
                className="group flex h-10 items-center gap-2 rounded-full border border-[#E2D5BA] bg-white/95 px-3 text-xs font-semibold text-[#4A4339] shadow-xs transition hover:border-[#D4AF37] hover:bg-white hover:text-[#141414] hover:shadow-[0_0_15px_rgba(212,175,55,0.20)] cursor-pointer"
                title="Search catalogue (⌘K)"
              >
                <Search className="h-4 w-4 text-[#A87B14] transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden xl:inline text-[#5A5040]">Search catalogue...</span>
                <kbd className="hidden 2xl:inline-block rounded-md bg-[#FAF5E8] border border-[#E5D7B7] px-1.5 py-0.5 text-[9px] text-[#735206] font-mono font-bold">
                  ⌘K
                </kbd>
              </button>

              {/* List Craft / Sell Button */}
              <button
                type="button"
                onClick={() => setIsSellOpen(true)}
                className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#FAF5E8] to-[#F3E8CD] px-3.5 text-xs font-bold text-[#5C4106] shadow-xs transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#171103] hover:shadow-[0_0_14px_rgba(212,175,55,0.25)] cursor-pointer"
              >
                <Store className="h-3.5 w-3.5 text-[#A87B14]" />
                <span>List Craft</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                aria-label="View Wishlist"
                onClick={() => setIsWishlistOpen(true)}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-[#E2D5BA] bg-white text-[#4A4339] shadow-xs transition duration-150 hover:scale-105 hover:border-rose-400 hover:text-rose-500 cursor-pointer"
                title="Your Wishlist"
              >
                <Heart className="h-4 w-4" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-xs animate-in zoom-in-50">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Haute Shopping Bag Button */}
              <button
                type="button"
                aria-label="View Shopping Bag"
                onClick={() => setIsCartOpen(true)}
                className="group relative inline-flex h-10 items-center gap-2 rounded-full bg-[#14100A] border border-[#D4AF37]/60 px-4 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#221B0F] hover:border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#ECC872] transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden sm:inline font-serif font-bold text-sm tracking-wide">
                  Bag
                </span>
                {mounted && cartCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-[#ECC872] to-[#D4AF37] px-1.5 text-[10px] font-black text-[#14100A] shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Collector Profile / Sign In */}
              {mounted && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex h-10 items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white px-2.5 text-xs font-bold text-[#141414] shadow-xs hover:border-[#D4AF37] transition cursor-pointer"
                  >
                    {user.avatarImage ? (
                      <img
                        src={user.avatarImage}
                        alt={user.name}
                        className="h-6 w-6 rounded-full object-cover border border-[#D4AF37]/50"
                      />
                    ) : (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#14100A] text-[10px] text-[#ECC872] font-black">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                    <span className="hidden md:inline max-w-[90px] truncate">{user.name}</span>
                    <ChevronDown className="h-3 w-3 text-[#8A7960]" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#D4AF37]/40 bg-white p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2 border-b border-[#F0E9D8]">
                        <p className="text-xs font-bold text-[#141414] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#7A6A53] truncate">
                          {user.email || 'Artisan Collector'}
                        </p>
                      </div>
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] hover:bg-[#FAF5E8] transition"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-[#B8860B]" />
                        <span>Admin Console</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          setIsSellOpen(true)
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] hover:bg-[#FAF5E8] transition cursor-pointer"
                      >
                        <Store className="h-3.5 w-3.5 text-[#B8860B]" />
                        <span>Artisan Studio Portal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setUserDropdownOpen(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white px-4 text-xs font-bold text-[#141414] shadow-xs transition hover:border-[#D4AF37] hover:bg-[#FAF5E8] cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5 text-[#A87B14]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Hamburger Drawer Toggle */}
              <button
                type="button"
                aria-label="Toggle navigation menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#D8C9A3] bg-white text-[#141414] shadow-xs lg:hidden transition cursor-pointer hover:bg-[#FAF5E8]"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* 3. Mobile Boutique Drawer Menu */}
          {isMenuOpen && (
            <div className="pb-6 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-b from-white via-[#FCF9F1] to-[#F8F2E2] p-5 shadow-xl">
                {/* Mobile Search Bar */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsQuickSearchOpen(true)
                    }}
                    className="flex w-full items-center justify-between rounded-full border border-[#E5D7B7] bg-white px-4 py-3 text-xs text-[#141414] shadow-xs"
                  >
                    <span className="flex items-center gap-2 text-[#5A5040]">
                      <Search className="h-4 w-4 text-[#B8860B]" />
                      Search crafts, live fish & tanks...
                    </span>
                    <span className="rounded-full bg-[#FAF5E8] border border-[#E0D0AB] px-2 py-0.5 text-[10px] text-[#735206] font-bold">
                      Open
                    </span>
                  </button>
                </div>

                {/* Department Selection Cards */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#collection', 'crafts')}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      activeDepartment === 'crafts'
                        ? 'border-[#D4AF37] bg-white shadow-sm'
                        : 'border-[#E8DEC7] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <Palette className="h-4 w-4 text-[#B8860B] mb-1.5" />
                    <p className="text-xs font-bold text-[#141414]">Artisan Crafts</p>
                    <p className="text-[10px] text-[#6E6860]">Jewelry, Resin, Candles</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLinkClick('#collection', 'aquarium')}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      activeDepartment === 'aquarium'
                        ? 'border-teal-500 bg-white shadow-sm'
                        : 'border-[#E8DEC7] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <Waves className="h-4 w-4 text-[#0F766E] mb-1.5" />
                    <p className="text-xs font-bold text-[#141414]">Exotic Aquatics</p>
                    <p className="text-[10px] text-[#6E6860]">Discus, Bettas, Tanks</p>
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="grid gap-1 border-t border-[#E8DEC7] pt-3 text-sm font-bold text-[#141414]">
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#collection', 'all')}
                    className="rounded-xl px-4 py-2.5 transition flex items-center justify-between hover:bg-[#FAF4E2] text-[#332C22] text-left"
                  >
                    <span>All Collections</span>
                    <span className="text-xs font-normal opacity-60">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#customize')}
                    className="rounded-xl px-4 py-2.5 transition flex items-center justify-between hover:bg-[#FAF4E2] text-[#332C22] text-left"
                  >
                    <span>Bespoke Studio</span>
                    <span className="text-xs font-normal opacity-60">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#makers')}
                    className="rounded-xl px-4 py-2.5 transition flex items-center justify-between hover:bg-[#FAF4E2] text-[#332C22] text-left"
                  >
                    <span>The Collective</span>
                    <span className="text-xs font-normal opacity-60">→</span>
                  </button>
                </nav>

                {/* Mobile Action Buttons */}
                <div className="mt-4 grid gap-2 border-t border-[#E8DEC7] pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsSellOpen(true)
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#FAF5E8] to-[#F5ECD5] py-3 text-xs font-bold text-[#5C4106] shadow-xs cursor-pointer"
                  >
                    <Store className="h-4 w-4 text-[#B8860B]" />
                    <span>Sell With Us • Zero Setup Fees</span>
                  </button>

                  {mounted && user ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-[#DDD7CE] bg-white py-2.5 text-xs font-bold text-rose-600 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out ({user.name})</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsAuthOpen(true)
                      }}
                      className="btn-primary w-full text-xs justify-center py-3 cursor-pointer"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In / Create Account</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
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
  Mail,
  MessageCircle,
  Phone,
  User,
  Package,
  MapPin,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { lockScroll, unlockScroll } from '../utils/scrollLock'
import { BrandTitle, NpMonogramSvg } from './BrandTypography'
import { getWorldContactEmail } from '../utils/worldTheme'
import gsap from 'gsap'

export default function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [activeNavTab, setActiveNavTab] = useState<'crafts' | 'aquarium' | 'makers'>('crafts')
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 25
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev))
          ticking = false
        })
        ticking = true
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false)
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

  // Lock body scroll when mobile boutique drawer is active
  useEffect(() => {
    if (isMenuOpen) {
      lockScroll()
      return () => {
        unlockScroll()
      }
    }
  }, [isMenuOpen])

  const {
    branding,
    activeDepartment,
    isAquaticTheme,
    setActiveDepartment,
    cartCount,
    wishlist,
    user,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    openProfile,
    setIsSellOpen,
    setIsQuickSearchOpen,
    showToast,
    logout,
  } = useMarketplace()

  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'Master Admin & Creator Ops' ||
    user?.email === 'npatelierindia@gmail.com'
  const conciergeEmail = getWorldContactEmail(isAquaticTheme, branding?.contactEmail)

  // Native smooth scroll to anchor
  const scrollToAnchor = (href: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        if (href === '#acquario-tropicale' || href === '#aquarium') {
          setActiveDepartment?.('aquarium')
          router.push('/?dept=aquarium')
          return
        }
        setActiveDepartment?.('crafts')
        router.push(href === '#home' ? '/' : `/${href}`)
        return
      }
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleLinkClick = (href: string, dept?: 'all' | 'crafts' | 'aquarium') => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      if (href === '#acquario-tropicale' || href === '#aquarium' || dept === 'aquarium') {
        setActiveDepartment?.('aquarium')
        router.push('/?dept=aquarium')
        setIsMenuOpen(false)
        return
      }
      setActiveDepartment?.('crafts')
      router.push(href === '#home' ? '/' : `/${href}`)
      setIsMenuOpen(false)
      return
    }

    if (href === '#acquario-tropicale' || href === '#aquarium' || dept === 'aquarium') {
      setActiveNavTab('aquarium')
      setActiveDepartment?.('aquarium')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    } else if (href === '#collection' || href === '#crafts' || dept === 'crafts') {
      setActiveNavTab('crafts')
      setActiveDepartment?.('crafts')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    } else if (href === '#makers') {
      setActiveNavTab('makers')
      if (activeDepartment === 'aquarium') {
        setActiveDepartment?.('crafts')
      }
      setTimeout(() => {
        scrollToAnchor('#makers')
      }, 60)
    } else if (dept === 'all') {
      setActiveNavTab('crafts')
      setActiveDepartment?.('crafts')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (activeDepartment === 'crafts') setActiveNavTab('crafts')
    else if (activeDepartment === 'aquarium') setActiveNavTab('aquarium')
    else if (activeDepartment === 'all' && activeNavTab !== 'makers') setActiveNavTab('crafts')
  }, [activeDepartment])

  const currentNav = activeNavTab

  const siteName = branding?.siteName || 'NP Atelier'
  const tagline = branding?.tagline || 'Luxury Crafts & Exotic Aquatics'

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 w-full pointer-events-none">
        <div className="pointer-events-auto">
          {/* Main Luxury Header */}
          <header
            className={`w-full transition-colors duration-200 ${isAquaticTheme
                ? isScrolled
                  ? 'bg-[#F0F7FC]/95 backdrop-blur-md border-b border-sky-300/65 shadow-[0_10px_28px_rgba(12,74,110,0.10)] py-2.5'
                  : 'bg-[#F0F7FC]/90 backdrop-blur-md border-b border-sky-200/75 py-3.5'
                : isScrolled
                  ? 'bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#8C6D46]/25 shadow-[0_10px_30px_rgba(72,54,30,0.09)] py-2.5'
                  : 'bg-[#F5F0E8]/90 backdrop-blur-md border-b border-[#8C6D46]/18 py-3.5'
              }`}
          >
            <div className="section-shell">
              <div className="flex items-center justify-between gap-2 sm:gap-4">

                {/* Brand Logo & Couture Emblem */}
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault()
                    const wasAquarium = activeDepartment === 'aquarium'
                    setActiveDepartment?.('crafts')
                    setActiveNavTab('crafts')
                    if (wasAquarium && typeof window !== 'undefined' && window.location.pathname === '/') {
                      window.scrollTo({ top: 0, behavior: 'instant' })
                    } else {
                      scrollToAnchor('#home')
                    }
                  }}
                  className="group flex items-center gap-2.5 sm:gap-3 shrink-0 select-none cursor-pointer focus:outline-none"
                >
                  {(isAquaticTheme || (branding?.logoImageUrl &&
                    (branding.logoType === 'image' || branding.logoType === 'both'))) ? (
                    <div
                      className={`h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-full overflow-hidden border transition-transform duration-300 group-hover:scale-105 shrink-0 ${isAquaticTheme
                          ? 'border-emerald-500/75 ring-2 ring-sky-400/40 shadow-[0_4px_14px_rgba(14,165,233,0.18)] bg-white'
                          : 'border-[#B8925A]/55 shadow-[0_3px_12px_rgba(72,54,30,0.14)] bg-[#EDE4DD]'
                        }`}
                    >
                      <img
                        src={isAquaticTheme ? '/acquario-tropicale-logo.jpg' : branding.logoImageUrl}
                        alt={isAquaticTheme ? 'Acquario Tropicale' : branding.siteName}
                        className={`h-full w-full object-cover ${isAquaticTheme ? 'scale-[1.28]' : ''}`}
                      />
                    </div>
                  ) : (
                    <div
                      className={`relative grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full border shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0 ${isAquaticTheme
                          ? 'bg-white text-[#0A2540] border-emerald-500/60'
                          : 'bg-[#FAF6EF] text-[#141210] border-[#B8925A]/55'
                        }`}
                    >
                      <span className="sr-only">NP</span>
                      <NpMonogramSvg
                        className={`h-5 w-auto ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}
                      />
                      <span
                        className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ${isAquaticTheme
                            ? 'bg-[#E11D48] ring-[#F0F7FC]'
                            : 'bg-[#D4AF78] ring-[#F5F0E8]'
                          }`}
                      />
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span
                      suppressHydrationWarning
                      className={`inline-flex items-baseline leading-none ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'
                        }`}
                    >
                      <BrandTitle
                        siteName={isAquaticTheme ? 'Acquario Tropicale' : siteName}
                        svgClassName={`h-[19px] sm:h-[22px] lg:h-[24px] w-auto ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'
                          }`}
                        atelierClassName={`text-[24px] sm:text-[28px] lg:text-[31px] ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'
                          }`}
                        fallbackClassName={`font-tagline font-bold tracking-tight whitespace-nowrap text-[17px] sm:text-[20px] lg:text-[24px] leading-none normal-case ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'
                          }`}
                      />
                    </span>
                    <span
                      suppressHydrationWarning
                      className={`font-tagline italic text-[11px] sm:text-[12px] lg:text-[13px] font-semibold tracking-[0.06em] mt-0.5 truncate max-w-[195px] sm:max-w-[230px] lg:max-w-none ${isAquaticTheme ? 'text-emerald-700' : 'text-[#6B5335]'
                        }`}
                    >
                      {tagline}
                    </span>
                  </div>
                </a>

                {/* Tablet Compact World Switcher Dock (768px - 1023px so switching fits cleanly on 1 line) */}
                <nav aria-label="Department Switcher" className="hidden md:flex lg:hidden items-center shrink-0">
                  <div
                    className={`flex items-center rounded-full border p-0.5 transition-colors duration-200 ${isAquaticTheme
                        ? 'border-sky-300/75 bg-white/95 shadow-[0_4px_14px_rgba(12,74,110,0.10)]'
                        : 'border-[#8C6D46]/25 bg-[#EFE8DC]/90 shadow-[0_4px_12px_rgba(72,54,30,0.08)]'
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleLinkClick('#collection', 'crafts')}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${currentNav === 'crafts'
                          ? isAquaticTheme
                            ? 'bg-[#E11D48] text-white shadow-xs'
                            : 'bg-[#D4AF78] text-[#141210] shadow-xs'
                          : isAquaticTheme
                            ? 'text-[#2C5270] hover:text-emerald-700'
                            : 'text-[#5C4D3C] hover:text-[#141210]'
                        }`}
                    >
                      Crafts
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors duration-150 cursor-pointer flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${currentNav === 'aquarium'
                          ? isAquaticTheme
                            ? 'bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white shadow-xs'
                            : 'bg-[#D4AF78] text-[#141210] shadow-xs'
                          : isAquaticTheme
                            ? 'text-[#2C5270] hover:text-emerald-700'
                            : 'text-[#5C4D3C] hover:text-[#141210]'
                        }`}
                    >
                      <Fish
                        className={`h-3 w-3 ${isAquaticTheme
                            ? currentNav === 'aquarium'
                              ? 'text-white'
                              : 'text-emerald-600'
                            : currentNav === 'aquarium'
                              ? 'text-[#141210]'
                              : 'text-teal-700'
                          }`}
                      />
                      <span className="font-tagline text-xs font-bold tracking-tight">Acquario</span>
                    </button>
                  </div>
                </nav>

                {/* Desktop Center Navigation Dock (instant compositor transitions, zero layoutId stalls) */}
                <nav aria-label="Primary Navigation" className="hidden lg:flex items-center relative">
                  <div
                    className={`flex items-center rounded-full border p-1 relative transition-colors duration-200 ${isAquaticTheme
                        ? 'border-sky-300/75 bg-white/95 shadow-[0_6px_18px_rgba(12,74,110,0.10)]'
                        : 'border-[#8C6D46]/25 bg-[#EFE8DC]/90 shadow-[0_4px_16px_rgba(72,54,30,0.08)]'
                      }`}
                  >

                    {/* Crafts Direct Tab */}
                    <button
                      type="button"
                      onClick={() => handleLinkClick('#collection', 'crafts')}
                      className={`relative rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${currentNav === 'crafts'
                          ? isAquaticTheme
                            ? 'bg-[#E11D48] text-white shadow-[0_4px_12px_rgba(225,29,72,0.28)]'
                            : 'bg-[#D4AF78] text-[#141210] shadow-xs'
                          : isAquaticTheme
                            ? 'text-[#2C5270] hover:text-emerald-700 hover:bg-emerald-50/70'
                            : 'text-[#5C4D3C] hover:text-[#141210]'
                        }`}
                    >
                      <span>Artisan Crafts</span>
                    </button>

                    {/* Acquario Tropicale Direct Tab */}
                    <button
                      type="button"
                      onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                      className={`relative rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-colors duration-150 cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${currentNav === 'aquarium'
                          ? isAquaticTheme
                            ? 'bg-gradient-to-r from-[#E11D48] via-[#DC2626] to-[#F43F5E] text-white shadow-[0_4px_14px_rgba(225,29,72,0.32)]'
                            : 'bg-[#D4AF78] text-[#141210] shadow-xs'
                          : isAquaticTheme
                            ? 'text-[#2C5270] hover:text-emerald-700 hover:bg-emerald-50/70'
                            : 'text-[#5C4D3C] hover:text-[#141210]'
                        }`}
                    >
                      <Fish
                        className={`h-3.5 w-3.5 ${isAquaticTheme
                            ? currentNav === 'aquarium'
                              ? 'text-white'
                              : 'text-emerald-600'
                            : currentNav === 'aquarium'
                              ? 'text-[#141210]'
                              : 'text-teal-700'
                          }`}
                      />
                      <span className="font-tagline text-sm font-bold tracking-tight">Acquario Tropicale</span>
                    </button>
                  </div>
                </nav>

                {/* Right Side Sculpted Action Center */}
                <div className="flex items-center gap-1.5 lg:gap-2.5 shrink-0">
                  {/* Quick Search Spotlight Button */}
                  <button
                    type="button"
                    onClick={() => setIsQuickSearchOpen(true)}
                    className={`hidden sm:flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-semibold shadow-xs transition cursor-pointer ${isAquaticTheme
                        ? 'border-sky-300/75 bg-white text-[#0A2540] hover:border-emerald-500 hover:bg-[#ECFDF5] hover:text-emerald-800'
                        : 'border-[#8C6D46]/28 bg-[#FAF6EF] text-[#141210] hover:border-[#B8925A] hover:bg-[#F3ECE0] hover:text-[#7A5B32]'
                      }`}
                    title="Search catalogue (⌘K)"
                  >
                    <Search
                      className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'
                        }`}
                    />
                    <span className={`hidden xl:inline ${isAquaticTheme ? 'text-[#2C5270]' : 'text-[#5C4D3C]'}`}>
                      Search catalogue...
                    </span>
                    <kbd
                      className={`hidden 2xl:inline-block rounded-md border px-1.5 py-0.5 text-[9px] font-mono font-bold ${isAquaticTheme
                          ? 'bg-[#EBF6FD] border-sky-300/60 text-emerald-700'
                          : 'bg-[#EFE8DC] border-[#8C6D46]/30 text-[#7A5B32]'
                        }`}
                    >
                      ⌘K
                    </kbd>
                  </button>

                  {/* List Craft / Sell Button */}
                  <button
                    type="button"
                    onClick={() => setIsSellOpen(true)}
                    className={`hidden lg:inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold shadow-xs transition cursor-pointer ${isAquaticTheme
                        ? 'border-emerald-400/60 bg-[#ECFDF5] text-emerald-800 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white'
                        : 'border-[#8C6D46]/35 bg-[#FAF6EF] text-[#7A5B32] hover:border-[#D4AF78] hover:bg-[#D4AF78] hover:text-[#141210]'
                      }`}
                  >
                    <Store className="h-3.5 w-3.5 text-current" />
                    <span>List Craft</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    aria-label="View Wishlist"
                    onClick={() => setIsWishlistOpen(true)}
                    className={`hidden md:grid relative h-10 w-10 place-items-center rounded-full border shadow-xs transition duration-150 hover:scale-105 cursor-pointer ${isAquaticTheme
                        ? 'border-sky-300/75 bg-white text-[#0A2540] hover:border-rose-500 hover:text-rose-600'
                        : 'border-[#8C6D46]/28 bg-[#FAF6EF] text-[#141210] hover:border-rose-500 hover:text-rose-500'
                      }`}
                    title="Your Wishlist"
                  >
                    <Heart className="h-4 w-4" />
                    {mounted && wishlist.length > 0 && (
                      <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#E11D48] px-1 text-[9px] font-black text-white shadow-xs">
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  {/* Haute Shopping Bag Button */}
                  <button
                    type="button"
                    aria-label="View Shopping Bag"
                    onClick={() => setIsCartOpen(true)}
                    className={`group relative inline-flex h-10 items-center gap-2 rounded-full border px-3 lg:px-4 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${isAquaticTheme
                        ? 'bg-gradient-to-r from-[#E11D48] via-[#DC2626] to-[#F43F5E] border-rose-500/60 text-white shadow-[0_6px_16px_rgba(225,29,72,0.28)] hover:brightness-105'
                        : 'bg-[#D4AF78] border-[#B8925A]/55 text-[#141210] shadow-[0_4px_14px_rgba(72,54,30,0.12)] hover:bg-[#E5C18A] hover:shadow-[0_6px_18px_rgba(212,175,120,0.28)]'
                      }`}
                  >
                    <ShoppingBag
                      className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isAquaticTheme ? 'text-white' : 'text-[#141210]'
                        }`}
                    />
                    <span
                      className={`hidden lg:inline font-tagline font-bold text-base tracking-wide ${isAquaticTheme ? 'text-white' : 'text-[#141210]'
                        }`}
                    >
                      Bag
                    </span>
                    {mounted && cartCount > 0 && (
                      <span
                        className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-black shadow-xs ${isAquaticTheme
                            ? 'bg-white text-[#E11D48] border border-rose-200'
                            : 'bg-[#141210] text-[#D4AF78]'
                          }`}
                      >
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
                        className={`flex h-10 items-center gap-2 rounded-full border px-2.5 text-xs font-bold shadow-xs transition cursor-pointer ${isAquaticTheme
                            ? 'border-sky-300/75 bg-white text-[#0A2540] hover:border-emerald-500'
                            : 'border-[#8C6D46]/30 bg-[#FAF6EF] text-[#141210] hover:border-[#B8925A]'
                          }`}
                      >
                        {user.avatarImage ? (
                          <img
                            src={user.avatarImage}
                            alt={user.name}
                            className={`h-6 w-6 rounded-full object-cover border ${isAquaticTheme ? 'border-emerald-500/70' : 'border-[#B8925A]/60'
                              }`}
                          />
                        ) : (
                          <span
                            className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-black border ${isAquaticTheme
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-400/60'
                                : 'bg-[#141210] text-[#D4AF78] border-[#8C6D46]/40'
                              }`}
                          >
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                        <span
                          className={`hidden md:inline max-w-[90px] truncate ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'
                            }`}
                        >
                          {user.name}
                        </span>
                        <ChevronDown
                          className={`h-3 w-3 ${isAquaticTheme ? 'text-[#2C5270]' : 'text-[#5C4D3C]'}`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {userDropdownOpen && (
                        <div
                          className={`absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl z-50 ${isAquaticTheme
                              ? 'border-sky-300/75 bg-white text-[#0A2540]'
                              : 'border-[#8C6D46]/30 bg-[#FCF9F4] text-[#141210]'
                            }`}
                        >
                          <div
                            className={`px-3.5 py-2.5 border-b ${isAquaticTheme ? 'border-sky-200' : 'border-[#8C6D46]/20'
                              }`}
                          >
                            <p className={`text-xs font-bold truncate ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}>
                              {user.name}
                            </p>
                            <p className={`text-[10px] truncate ${isAquaticTheme ? 'text-[#2C5270]' : 'text-[#5C4D3C]'}`}>
                              {user.email || 'Artisan Collector'}
                            </p>
                            <span
                              className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${isAquaticTheme
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : 'bg-[#EFE8DC] border-[#8C6D46]/30 text-[#7A5B32]'
                                }`}
                            >
                              <ShieldCheck
                                className={`h-3 w-3 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`}
                              />
                              {isAdmin ? 'Administrator' : 'Artisan Patron & Collector'}
                            </span>
                          </div>

                          <Link
                            href="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${isAquaticTheme
                                ? 'text-[#0A2540] hover:bg-[#EBF6FD] hover:text-emerald-700'
                                : 'text-[#141210] hover:bg-[#EFE8DC] hover:text-[#7A5B32]'
                              }`}
                          >
                            <User className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`} />
                            <span>My Profile &amp; Address</span>
                          </Link>

                          <Link
                            href="/profile?tab=orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${isAquaticTheme
                                ? 'text-[#0A2540] hover:bg-[#EBF6FD] hover:text-emerald-700'
                                : 'text-[#141210] hover:bg-[#EFE8DC] hover:text-[#7A5B32]'
                              }`}
                          >
                            <Package className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`} />
                            <span>My Bespoke Orders</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false)
                              setIsSellOpen(true)
                            }}
                            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${isAquaticTheme
                                ? 'text-[#0A2540] hover:bg-[#EBF6FD] hover:text-emerald-700'
                                : 'text-[#141210] hover:bg-[#EFE8DC] hover:text-[#7A5B32]'
                              }`}
                          >
                            <Store className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`} />
                            <span>Artisan Studio Portal</span>
                          </button>

                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${isAquaticTheme
                                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                  : 'text-[#7A5B32] bg-[#EFE8DC] hover:bg-[#E6DEC9]'
                                }`}
                            >
                              <LayoutDashboard
                                className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`}
                              />
                              <span>Admin Console</span>
                            </Link>
                          )}

                          <div className={`my-1 border-t ${isAquaticTheme ? 'border-sky-200' : 'border-[#8C6D46]/20'}`} />

                          <button
                            type="button"
                            onClick={() => {
                              logout()
                              setUserDropdownOpen(false)
                            }}
                            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${isAquaticTheme
                                ? 'text-rose-600 hover:bg-rose-50'
                                : 'text-rose-600 hover:bg-rose-50'
                              }`}
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
                      aria-label="Sign In"
                      title="Sign In"
                      onClick={() => setIsAuthOpen(true)}
                      className={`hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border px-3 lg:px-4 text-xs font-bold shadow-xs transition cursor-pointer ${isAquaticTheme
                          ? 'border-sky-400/60 bg-white text-[#0369A1] hover:border-emerald-500 hover:bg-emerald-600 hover:text-white'
                          : 'border-[#8C6D46]/35 bg-[#FAF6EF] text-[#7A5B32] hover:border-[#D4AF78] hover:bg-[#D4AF78] hover:text-[#141210]'
                        }`}
                    >
                      <LogIn className="h-3.5 w-3.5 text-current" />
                      <span className="hidden lg:inline">Sign In</span>
                    </button>
                  )}

                  {/* Mobile Hamburger Drawer Toggle with Custom Animated 3-Bar Morph Icon */}
                  <button
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`relative grid h-10 w-10 place-items-center rounded-full border shadow-xs lg:hidden transition duration-200 cursor-pointer active:scale-90 ${isAquaticTheme
                        ? 'border-sky-300/75 bg-white text-[#0A2540] hover:border-emerald-500 hover:bg-[#ECFDF5]'
                        : 'border-[#8C6D46]/30 bg-[#FAF6EF] text-[#141210] hover:border-[#B8925A] hover:bg-[#EFE8DC]'
                      }`}
                  >
                    <div className="relative flex flex-col items-center justify-center w-5 h-5 pointer-events-none">
                      {/* Top Bar */}
                      <span
                        className={`block h-[2px] w-5 rounded-full transition-all duration-300 ease-out origin-center ${isAquaticTheme ? 'bg-[#0A2540]' : 'bg-[#141210]'
                          } ${isMenuOpen
                            ? isAquaticTheme
                              ? 'rotate-45 translate-y-[6px] bg-[#E11D48]'
                              : 'rotate-45 translate-y-[6px] bg-[#7A5B32]'
                            : ''
                          }`}
                      />
                      {/* Middle Bar */}
                      <span
                        className={`block h-[2px] w-3.5 my-[4px] rounded-full transition-all duration-200 ease-out self-start ${isAquaticTheme ? 'bg-emerald-600' : 'bg-[#7A5B32]'
                          } ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`}
                      />
                      {/* Bottom Bar */}
                      <span
                        className={`block h-[2px] w-5 rounded-full transition-all duration-300 ease-out origin-center ${isAquaticTheme ? 'bg-[#0A2540]' : 'bg-[#141210]'
                          } ${isMenuOpen
                            ? isAquaticTheme
                              ? '-rotate-45 -translate-y-[6px] bg-[#E11D48]'
                              : '-rotate-45 -translate-y-[6px] bg-[#7A5B32]'
                            : ''
                          }`}
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* Compact 640px-767px Switcher Strip so switching is visible at every width */}
              <div className="hidden sm:flex md:hidden justify-center pt-2">
                <div
                  className={`flex items-center rounded-full border p-0.5 transition-colors duration-200 ${isAquaticTheme
                      ? 'border-sky-300/75 bg-white/95 shadow-xs'
                      : 'border-[#8C6D46]/25 bg-[#EFE8DC]/90 shadow-xs'
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#collection', 'crafts')}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold transition-colors duration-150 cursor-pointer focus:outline-none ${currentNav === 'crafts'
                        ? isAquaticTheme
                          ? 'bg-[#E11D48] text-white'
                          : 'bg-[#D4AF78] text-[#141210]'
                        : isAquaticTheme
                          ? 'text-[#2C5270] hover:text-emerald-700'
                          : 'text-[#5C4D3C] hover:text-[#141210]'
                      }`}
                  >
                    Artisan Crafts
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold transition-colors duration-150 cursor-pointer flex items-center gap-1 focus:outline-none ${currentNav === 'aquarium'
                        ? isAquaticTheme
                          ? 'bg-[#E11D48] text-white'
                          : 'bg-[#D4AF78] text-[#141210]'
                        : isAquaticTheme
                          ? 'text-[#2C5270] hover:text-emerald-700'
                          : 'text-[#5C4D3C] hover:text-[#141210]'
                      }`}
                  >
                    <Fish
                      className={`h-3 w-3 ${isAquaticTheme
                          ? currentNav === 'aquarium'
                            ? 'text-white'
                            : 'text-emerald-600'
                          : currentNav === 'aquarium'
                            ? 'text-[#141210]'
                            : 'text-teal-700'
                        }`}
                    />
                    <span className="font-tagline">Acquario Tropicale</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
        </div>
      </div>

      {/* 3. Luxury Boutique Mobile Slide-over Drawer (Fixed Side Sheet from Right) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[120] lg:hidden flex justify-end touch-none">
            {/* Cinematic Veil Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onClick={() => setIsMenuOpen(false)}
              className={`fixed inset-0 backdrop-blur-[2px] ${isAquaticTheme ? 'bg-[#0A2540]/35' : 'bg-[#141210]/45'
                }`}
            />

            {/* Haute Couture Slide Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ x: '100%', opacity: 0, transition: { duration: 0.16, ease: 'easeIn' } }}
              className={`relative w-[88%] max-w-[390px] h-full border-l flex flex-col z-10 overflow-hidden transform-gpu will-change-transform touch-auto overscroll-contain ${isAquaticTheme
                  ? 'bg-[#F0F7FC] border-sky-300/70 shadow-[-12px_0_35px_rgba(12,74,110,0.16)]'
                  : 'bg-[#F5F0E8] border-[#8C6D46]/30 shadow-[-12px_0_35px_rgba(72,54,30,0.22)]'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Atelier Header */}
              <div
                className={`flex items-center justify-between border-b px-5 py-4 ${isAquaticTheme
                    ? 'border-sky-200/80 bg-white'
                    : 'border-[#8C6D46]/25 bg-[#FCF9F4]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  {(isAquaticTheme || (branding?.logoImageUrl &&
                    (branding.logoType === 'image' || branding.logoType === 'both'))) ? (
                    <div
                      className={`h-9 w-9 rounded-full overflow-hidden border shadow-xs shrink-0 ${isAquaticTheme
                          ? 'border-emerald-500/75 bg-white'
                          : 'border-[#B8925A]/55 bg-[#EDE4DD]'
                        }`}
                    >
                      <img
                        src={isAquaticTheme ? '/acquario-tropicale-logo.jpg' : branding.logoImageUrl}
                        alt={isAquaticTheme ? 'Acquario Tropicale' : siteName}
                        className={`h-full w-full object-cover ${isAquaticTheme ? 'scale-[1.28]' : ''}`}
                      />
                    </div>
                  ) : (
                    <div
                      className={`grid h-9 w-9 place-items-center rounded-full border shadow-xs ${isAquaticTheme
                          ? 'bg-[#EBF6FD] border-emerald-500/60 text-[#0A2540]'
                          : 'bg-[#EFE8DC] border-[#B8925A]/50 text-[#141210]'
                        }`}
                    >
                      <NpMonogramSvg
                        className={`h-4.5 w-auto ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}
                      />
                    </div>
                  )}
                  <div>
                    <h3 className={`leading-none ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}>
                      <BrandTitle
                        siteName={isAquaticTheme ? 'Acquario Tropicale' : siteName}
                        svgClassName={`h-[15px] w-auto ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}
                        atelierClassName={`text-[22px] ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}
                        fallbackClassName={`font-tagline font-bold tracking-tight whitespace-nowrap text-[17px] leading-none normal-case ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}
                      />
                    </h3>
                    <p
                      className={`font-tagline italic text-[11px] font-semibold tracking-wide ${isAquaticTheme ? 'text-emerald-700' : 'text-[#6B5335]'
                        }`}
                    >
                      Haute Atelier &amp; Aquatics
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setIsMenuOpen(false)}
                  className={`grid h-9 w-9 place-items-center rounded-full border transition active:scale-90 cursor-pointer ${isAquaticTheme
                      ? 'border-sky-300/75 bg-[#EBF6FD] text-[#0A2540] hover:border-emerald-500 hover:text-emerald-700'
                      : 'border-[#8C6D46]/30 bg-[#FAF6EF] text-[#141210] hover:border-[#B8925A] hover:text-[#7A5B32]'
                    }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto sidebar-scroller p-4 space-y-4">
                {/* 1-Click Search Launcher */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsQuickSearchOpen(true)
                  }}
                  className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-xs shadow-xs transition active:scale-[0.98] cursor-pointer ${isAquaticTheme
                      ? 'border-sky-300/70 bg-white text-[#0A2540] hover:border-emerald-500 hover:bg-[#F5FAFF]'
                      : 'border-[#8C6D46]/28 bg-[#FCF9F4] text-[#141210] hover:border-[#B8925A] hover:bg-[#FAF6EF]'
                    }`}
                >
                  <span
                    className={`flex items-center gap-2.5 transition ${isAquaticTheme
                        ? 'text-[#2C5270] group-hover:text-[#0A2540]'
                        : 'text-[#5C4D3C] group-hover:text-[#141210]'
                      }`}
                  >
                    <Search className={`h-4 w-4 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`} />
                    <span className="font-medium">Search 40+ crafts &amp; aquatics...</span>
                  </span>
                  <span
                    className={`rounded-lg border px-2 py-0.5 text-[9px] font-mono font-bold ${isAquaticTheme
                        ? 'bg-[#EBF6FD] border-sky-300/60 text-emerald-700'
                        : 'bg-[#EFE8DC] border-[#8C6D46]/30 text-[#7A5B32]'
                      }`}
                  >
                    ⌘K
                  </span>
                </button>

                {/* Quick Utility Highlights Bar: Bag + Wishlist counters */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsCartOpen(true)
                    }}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-left transition cursor-pointer ${isAquaticTheme
                        ? 'border-sky-300/70 bg-white hover:border-rose-400'
                        : 'border-[#8C6D46]/25 bg-[#FCF9F4] hover:border-[#B8925A]'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className={`h-4 w-4 ${isAquaticTheme ? 'text-[#E11D48]' : 'text-[#7A5B32]'}`} />
                      <span className={`text-xs font-bold ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}>Bag</span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black ${isAquaticTheme ? 'bg-[#E11D48] text-white' : 'bg-[#D4AF78] text-[#141210]'
                        }`}
                    >
                      {mounted ? cartCount : 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsWishlistOpen(true)
                    }}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-left transition cursor-pointer ${isAquaticTheme
                        ? 'border-sky-300/70 bg-white hover:border-rose-400'
                        : 'border-[#8C6D46]/25 bg-[#FCF9F4] hover:border-rose-400'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span className={`text-xs font-bold ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}>
                        Wishlist
                      </span>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${isAquaticTheme
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                        }`}
                    >
                      {mounted ? wishlist.length : 0}
                    </span>
                  </button>
                </div>

                {/* Department Featured Cards */}
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider px-1 mb-2 ${isAquaticTheme ? 'text-emerald-700' : 'text-[#6B5A48]'
                      }`}
                  >
                    Browse Curations
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLinkClick('#collection', 'crafts')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${activeDepartment === 'crafts'
                          ? 'border-[#B8925A] bg-[#EFE8DC] shadow-sm'
                          : isAquaticTheme
                            ? 'border-sky-300/70 bg-white hover:bg-[#F5FAFF]'
                            : 'border-[#8C6D46]/22 bg-[#FCF9F4] hover:bg-[#FAF6EF]'
                        }`}
                    >
                      <Palette
                        className={`h-4 w-4 mb-1.5 ${isAquaticTheme ? 'text-sky-600' : 'text-[#7A5B32]'}`}
                      />
                      <p className={`text-xs font-bold ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}>
                        Artisan Crafts
                      </p>
                      <p className={`text-[10px] truncate ${isAquaticTheme ? 'text-[#2C5270]' : 'text-[#5C4D3C]'}`}>
                        Resin, Candles, Decor
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${activeDepartment === 'aquarium'
                          ? 'border-[#E11D48] bg-gradient-to-br from-[#FFF1F2] via-[#FFFFFF] to-[#ECFDF5] ring-1 ring-[#E11D48]/45 shadow-sm'
                          : 'border-[#8C6D46]/22 bg-[#FCF9F4] hover:bg-[#FAF6EF]'
                        }`}
                    >
                      <Fish
                        className={`h-4 w-4 mb-1.5 ${isAquaticTheme ? 'text-emerald-600' : 'text-teal-700'}`}
                      />
                      <p
                        className={`font-bold font-tagline text-sm ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'
                          }`}
                      >
                        Acquario
                      </p>
                      <p className={`text-[10px] truncate ${isAquaticTheme ? 'text-[#BE123C]' : 'text-[#5C4D3C]'}`}>
                        Fish &amp; Nano Tanks
                      </p>
                    </button>
                  </div>
                </div>

                {/* Primary Navigation Links */}
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider px-1 mb-2 ${isAquaticTheme ? 'text-emerald-700' : 'text-[#6B5A48]'
                      }`}
                  >
                    Menu Directory
                  </p>
                  <nav className="space-y-1">
                    <button
                      type="button"
                      onClick={() => handleLinkClick('#home')}
                      className={`w-full rounded-2xl px-3.5 py-2.5 transition flex items-center justify-between border text-left cursor-pointer ${isAquaticTheme
                          ? 'bg-white hover:bg-[#EBF6FD] border-sky-200/80 text-[#0A2540]'
                          : 'bg-[#FCF9F4] hover:bg-[#EFE8DC] border-[#8C6D46]/20 text-[#141210]'
                        }`}
                    >
                      <span className="text-xs font-bold">Home Sanctuary</span>
                      <span className={`text-xs ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`}>→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick('#collection', 'crafts')}
                      className={`w-full rounded-2xl px-3.5 py-2.5 transition flex items-center justify-between border text-left cursor-pointer ${isAquaticTheme
                          ? 'bg-white hover:bg-[#EBF6FD] border-sky-200/80 text-[#0A2540]'
                          : 'bg-[#FCF9F4] hover:bg-[#EFE8DC] border-[#8C6D46]/20 text-[#141210]'
                        }`}
                    >
                      <span className="text-xs font-bold">Artisan Collection</span>
                      <span className={`text-xs ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`}>→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                      className={`w-full rounded-2xl px-3.5 py-2.5 transition flex items-center justify-between border text-left cursor-pointer font-tagline ${isAquaticTheme
                          ? 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-[#0A2540]'
                          : 'bg-[#FCF9F4] hover:bg-[#EFE8DC] border-[#8C6D46]/20 text-[#141210]'
                        }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <Fish className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-600' : 'text-teal-700'}`} />
                        <span>Acquario Tropicale</span>
                      </span>
                      <span className={`text-xs ${isAquaticTheme ? 'text-[#E11D48]' : 'text-[#7A5B32]'}`}>→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick('#makers')}
                      className={`w-full rounded-2xl px-3.5 py-2.5 transition flex items-center justify-between border text-left cursor-pointer ${isAquaticTheme
                          ? 'bg-white hover:bg-[#EBF6FD] border-sky-200/80 text-[#0A2540]'
                          : 'bg-[#FCF9F4] hover:bg-[#EFE8DC] border-[#8C6D46]/20 text-[#141210]'
                        }`}
                    >
                      <span className="text-xs font-bold">Artisans &amp; Makers</span>
                      <span className={`text-xs ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`}>→</span>
                    </button>
                  </nav>
                </div>

                {/* Sell with Us Banner */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsSellOpen(true)
                  }}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-bold shadow-sm transition cursor-pointer ${isAquaticTheme
                      ? 'border-emerald-400/60 bg-gradient-to-r from-[#ECFDF5] via-[#FFFFFF] to-[#EFF8FF] text-emerald-800 hover:border-emerald-600'
                      : 'border-[#8C6D46]/35 bg-gradient-to-r from-[#FCF9F4] via-[#EFE8DC] to-[#FCF9F4] text-[#7A5B32] hover:border-[#B8925A] hover:text-[#141210]'
                    }`}
                >
                  <Store className={`h-4 w-4 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`} />
                  <span>List Your Craft • Zero Setup Fees</span>
                </button>

                {/* User Authentication / Profile Section */}
                {mounted && user ? (
                  <div
                    className={`space-y-2 rounded-2xl border p-3 ${isAquaticTheme
                        ? 'border-sky-300/70 bg-white'
                        : 'border-[#8C6D46]/25 bg-[#FCF9F4]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {user.avatarImage ? (
                        <img
                          src={user.avatarImage}
                          alt={user.name}
                          className={`h-9 w-9 rounded-full object-cover border ${isAquaticTheme ? 'border-emerald-500' : 'border-[#B8925A]'
                            }`}
                        />
                      ) : (
                        <div
                          className={`grid h-9 w-9 place-items-center rounded-full text-xs font-black border ${isAquaticTheme
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-400/60'
                              : 'bg-[#EFE8DC] text-[#7A5B32] border-[#8C6D46]/35'
                            }`}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold truncate ${isAquaticTheme ? 'text-[#0A2540]' : 'text-[#141210]'}`}>
                          {user.name}
                        </p>
                        <p className={`text-[10px] truncate ${isAquaticTheme ? 'text-[#2C5270]' : 'text-[#5C4D3C]'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-2 gap-2 pt-2 border-t ${isAquaticTheme ? 'border-sky-200' : 'border-[#8C6D46]/20'
                        }`}
                    >
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-bold transition ${isAquaticTheme
                            ? 'border-sky-200 bg-[#F4FAFE] text-[#0A2540] hover:border-emerald-500'
                            : 'border-[#8C6D46]/25 bg-[#FAF6EF] text-[#141210] hover:border-[#B8925A]'
                          }`}
                      >
                        <User className={`h-3 w-3 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-bold transition ${isAquaticTheme
                            ? 'border-sky-200 bg-[#F4FAFE] text-[#0A2540] hover:border-emerald-500'
                            : 'border-[#8C6D46]/25 bg-[#FAF6EF] text-[#141210] hover:border-[#B8925A]'
                          }`}
                      >
                        <Package className={`h-3 w-3 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`} />
                        <span>Orders</span>
                      </Link>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold ${isAquaticTheme
                            ? 'border-emerald-400/60 bg-emerald-50 text-emerald-700'
                            : 'border-[#B8925A]/50 bg-[#EFE8DC] text-[#7A5B32]'
                          }`}
                      >
                        <LayoutDashboard className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-600' : 'text-[#7A5B32]'}`} />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className={`flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-bold transition cursor-pointer ${isAquaticTheme
                          ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
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

                {/* Direct Concierge WhatsApp Card */}
                <div
                  className={`rounded-2xl border p-3 text-center ${isAquaticTheme
                      ? 'border-sky-300/70 bg-white'
                      : 'border-[#8C6D46]/25 bg-[#FCF9F4]'
                    }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider ${isAquaticTheme ? 'text-emerald-700' : 'text-[#7A5B32]'
                      }`}
                  >
                    WhatsApp Concierge &amp; Dispatch
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-bold">
                    <a
                      href={`https://wa.me/919341297124?text=Hi%20${encodeURIComponent(isAquaticTheme ? 'Acquario Tropicale' : 'NP Atelier')}%2C%20I%20want%20to%20inquire%20about%20an%20order!`}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 transition ${isAquaticTheme
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        }`}
                    >
                      <MessageCircle
                        className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-600' : 'text-emerald-600'}`}
                      />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+919341297124"
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 transition ${isAquaticTheme
                          ? 'bg-[#F4FAFE] border-sky-300/70 text-[#0A2540] hover:border-emerald-500'
                          : 'bg-[#FAF6EF] border-[#8C6D46]/30 text-[#141210] hover:border-[#B8925A]'
                        }`}
                    >
                      <Phone className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-sky-600' : 'text-[#7A5B32]'}`} />
                      <span>Call Us</span>
                    </a>
                  </div>
                  <a
                    href={`mailto:${conciergeEmail}`}
                    className={`mt-2 flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2.5 text-[11px] font-bold transition truncate ${isAquaticTheme
                        ? 'bg-[#F4FAFE] border-sky-300/70 text-[#2C5270] hover:border-emerald-500 hover:text-emerald-700'
                        : 'bg-[#FAF6EF] border-[#8C6D46]/25 text-[#5C4D3C] hover:border-[#B8925A] hover:text-[#141210]'
                      }`}
                  >
                    <Mail className={`h-3.5 w-3.5 shrink-0 ${isAquaticTheme ? 'text-sky-600' : 'text-[#7A5B32]'}`} />
                    <span className="truncate">{conciergeEmail}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

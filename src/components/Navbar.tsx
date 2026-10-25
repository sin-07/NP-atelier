"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
import gsap from 'gsap'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuMounted, setIsMenuMounted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [activeNavTab, setActiveNavTab] = useState<'crafts' | 'aquarium' | 'makers'>('crafts')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileDrawerRef = useRef<HTMLDivElement>(null)

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

  // GSAP Mobile Drawer Entrance and Exit Controller - Ultra Smooth & Instant
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuMounted(true)
    } else if (isMenuMounted && mobileDrawerRef.current) {
      gsap.to(mobileDrawerRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.14,
        ease: 'power2.in',
        onComplete: () => {
          setIsMenuMounted(false)
        },
      })
    }
  }, [isMenuOpen, isMenuMounted])

  useEffect(() => {
    if (isMenuMounted && isMenuOpen && mobileDrawerRef.current) {
      const drawer = mobileDrawerRef.current
      const items = drawer.querySelectorAll('.gsap-menu-item')

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.fromTo(
        drawer,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.22, clearProps: 'all' }
      ).fromTo(
        items,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.18, stagger: 0.02, clearProps: 'all' },
        '-=0.12'
      )
    }
  }, [isMenuMounted, isMenuOpen])

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
    isProfileOpen,
    setIsProfileOpen,
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

  // Native smooth scroll to anchor
  const scrollToAnchor = (href: string) => {
    if (typeof window !== 'undefined') {
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
        target.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleLinkClick = (href: string, dept?: 'all' | 'crafts' | 'aquarium') => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      if (href === '#acquario-tropicale' || href === '#aquarium' || dept === 'aquarium') {
        window.location.href = '/?dept=aquarium'
        return
      }
      window.location.href = href === '#home' ? '/' : `/${href}`
      return
    }

    if (href === '#acquario-tropicale' || href === '#aquarium' || dept === 'aquarium') {
      setActiveNavTab('aquarium')
      setActiveDepartment?.('aquarium')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (href === '#collection' || href === '#crafts' || dept === 'crafts') {
      setActiveNavTab('crafts')
      setActiveDepartment?.('crafts')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (href === '#makers') {
      setActiveNavTab('makers')
      if (activeDepartment === 'aquarium') {
        setActiveDepartment?.('crafts')
      }
      setTimeout(() => {
        scrollToAnchor('#makers')
      }, 50)
    } else if (dept === 'all') {
      setActiveNavTab('crafts')
      setActiveDepartment?.('crafts')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
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

  return (
    <div className="fixed top-0 inset-x-0 z-50 w-full pointer-events-none">
      <div className="pointer-events-auto">
        {/* Main Luxury Header */}
        <header
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[#FAF8F5]/98 backdrop-blur-sm border-b border-[#D4AF37]/20 shadow-[0_12px_32px_rgba(20,18,12,0.06)] py-2.5'
              : 'bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#1A160F]/[0.06] py-3.5'
          }`}
        >
        <div className="section-shell">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo & Couture Emblem */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                setActiveDepartment?.('crafts')
                setActiveNavTab('crafts')
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

            {/* Center Navigation Dock with Sliding Pill */}
            <nav className="hidden lg:flex items-center relative">
              <div className="flex items-center rounded-full border border-[#E8DEC7]/90 bg-white/80 p-1 shadow-[0_2px_10px_rgba(20,18,12,0.03)] backdrop-blur-md relative">

                {/* Crafts Direct Tab */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#collection', 'crafts')}
                  className={`relative rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition-colors duration-200 cursor-pointer ${
                    currentNav === 'crafts'
                      ? 'text-[#ECC872]'
                      : 'text-[#4A4339] hover:text-[#141414]'
                  }`}
                >
                  {currentNav === 'crafts' && (
                    <motion.div
                      layoutId="navbarCenterDockPill"
                      className="absolute inset-0 rounded-full bg-[#141414] shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">Artisan Crafts</span>
                </button>

                {/* Acquario Tropicale Direct Tab */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                  className={`relative rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
                    currentNav === 'aquarium'
                      ? 'text-[#ECC872]'
                      : 'text-[#4A4339] hover:text-[#141414]'
                  }`}
                >
                  {currentNav === 'aquarium' && (
                    <motion.div
                      layoutId="navbarCenterDockPill"
                      className="absolute inset-0 rounded-full bg-[#141414] shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Fish className={`h-3.5 w-3.5 relative z-10 ${currentNav === 'aquarium' ? 'text-[#ECC872]' : 'text-teal-600'}`} />
                  <span className="relative z-10 font-serif font-black tracking-tight">Acquario Tropicale</span>
                </button>

                {/* The Collective */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#makers')}
                  className={`relative rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition-colors duration-200 cursor-pointer ${
                    currentNav === 'makers'
                      ? 'text-[#ECC872]'
                      : 'text-[#4A4339] hover:text-[#141414]'
                  }`}
                >
                  {currentNav === 'makers' && (
                    <motion.div
                      layoutId="navbarCenterDockPill"
                      className="absolute inset-0 rounded-full bg-[#141414] shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">The Collective</span>
                </button>
              </div>
            </nav>

            {/* Right Side Sculpted Action Center */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Quick Search Spotlight Button */}
              <button
                type="button"
                onClick={() => setIsQuickSearchOpen(true)}
                className="hidden sm:flex h-10 items-center gap-2 rounded-full border border-[#E2D5BA] bg-white/95 px-3 text-xs font-semibold text-[#4A4339] shadow-xs transition hover:border-[#D4AF37] hover:bg-white hover:text-[#141414] hover:shadow-[0_0_15px_rgba(212,175,55,0.20)] cursor-pointer"
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
                className="hidden sm:grid relative h-10 w-10 place-items-center rounded-full border border-[#E2D5BA] bg-white text-[#4A4339] shadow-xs transition duration-150 hover:scale-105 hover:border-rose-400 hover:text-rose-500 cursor-pointer"
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
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#D4AF37]/40 bg-white p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3.5 py-2.5 border-b border-[#F0E9D8]">
                        <p className="text-xs font-bold text-[#141414] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#7A6A53] truncate">
                          {user.email || 'Artisan Collector'}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#FAF5E8] border border-[#D4AF37]/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#875A10]">
                          <ShieldCheck className="h-3 w-3 text-[#B8860B]" />
                          {isAdmin ? 'Administrator' : 'Artisan Patron & Collector'}
                        </span>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] hover:bg-[#FAF5E8] transition cursor-pointer"
                      >
                        <User className="h-3.5 w-3.5 text-[#B8860B]" />
                        <span>My Profile &amp; Address</span>
                      </Link>

                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#141414] hover:bg-[#FAF5E8] transition cursor-pointer"
                      >
                        <Package className="h-3.5 w-3.5 text-[#B8860B]" />
                        <span>My Bespoke Orders</span>
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

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#875A10] bg-[#FAF5E8]/60 hover:bg-[#FAF5E8] transition"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-[#B8860B]" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="my-1 border-t border-[#F0E9D8]" />

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

              {/* Mobile Hamburger Drawer Toggle with Custom Animated 3-Bar Morph Icon */}
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-[#D8C9A3] bg-white text-[#141414] shadow-xs lg:hidden transition duration-200 cursor-pointer hover:border-[#D4AF37] hover:bg-[#FAF5E8] active:scale-90"
              >
                <div className="relative flex flex-col items-center justify-center w-5 h-5 pointer-events-none">
                  {/* Top Bar */}
                  <span
                    className={`block h-[2px] w-5 rounded-full bg-[#1A1A1A] transition-all duration-300 ease-out origin-center ${
                      isMenuOpen ? 'rotate-45 translate-y-[6px] bg-[#B8860B]' : ''
                    }`}
                  />
                  {/* Middle Bar */}
                  <span
                    className={`block h-[2px] w-3.5 my-[4px] rounded-full bg-[#D4AF37] transition-all duration-200 ease-out self-start ${
                      isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                    }`}
                  />
                  {/* Bottom Bar */}
                  <span
                    className={`block h-[2px] w-5 rounded-full bg-[#1A1A1A] transition-all duration-300 ease-out origin-center ${
                      isMenuOpen ? '-rotate-45 -translate-y-[6px] bg-[#B8860B]' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* 3. Mobile Boutique Drawer Menu with GSAP Stagger Entrance */}
          {isMenuMounted && (
            <div
              ref={mobileDrawerRef}
              className="pb-6 lg:hidden"
            >
              <div className="rounded-3xl border border-[#D4AF37]/50 bg-gradient-to-b from-white via-[#FCF9F1] to-[#F8F2E2] p-5 shadow-[0_16px_40px_rgba(20,18,12,0.15),0_0_20px_rgba(212,175,55,0.12)]">
                {/* Mobile Search Bar */}
                <div className="gsap-menu-item mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsQuickSearchOpen(true)
                    }}
                    className="flex w-full items-center justify-between rounded-full border border-[#E5D7B7] bg-white px-4 py-3 text-xs text-[#141414] shadow-xs hover:border-[#D4AF37] transition"
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
                    className={`gsap-menu-item p-3.5 rounded-2xl border text-left transition ${
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
                    onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                    className={`gsap-menu-item p-3.5 rounded-2xl border text-left transition ${
                      activeDepartment === 'aquarium'
                        ? 'border-teal-500 bg-[#EBF7F8] shadow-sm'
                        : 'border-[#E8DEC7] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <Fish className="h-4 w-4 text-[#0F766E] mb-1.5" />
                    <p className="text-xs font-bold text-[#0C3238] font-serif">Acquario Tropicale</p>
                    <p className="text-[10px] text-[#4F6C72]">Exotic Fish & Rimless Tanks</p>
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="grid gap-1 border-t border-[#E8DEC7] pt-3 text-sm font-bold text-[#141414]">
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#collection', 'crafts')}
                    className="gsap-menu-item rounded-xl px-4 py-2.5 transition flex items-center justify-between hover:bg-[#FAF4E2] text-[#332C22] text-left cursor-pointer"
                  >
                    <span>Artisan Crafts</span>
                    <span className="text-xs font-normal opacity-60">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                    className="gsap-menu-item rounded-xl px-4 py-2.5 transition flex items-center justify-between hover:bg-[#FAF4E2] text-[#0A343A] text-left cursor-pointer font-serif"
                  >
                    <span className="flex items-center gap-2">
                      <Fish className="h-4 w-4 text-teal-600" />
                      <span>Acquario Tropicale</span>
                    </span>
                    <span className="text-xs font-normal opacity-60">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('#makers')}
                    className="gsap-menu-item rounded-xl px-4 py-2.5 transition flex items-center justify-between hover:bg-[#FAF4E2] text-[#332C22] text-left cursor-pointer"
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
                    className="gsap-menu-item flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#FAF5E8] to-[#F5ECD5] py-3 text-xs font-bold text-[#5C4106] shadow-xs cursor-pointer hover:border-[#D4AF37] transition"
                  >
                    <Store className="h-4 w-4 text-[#B8860B]" />
                    <span>Sell With Us • Zero Setup Fees</span>
                  </button>

                  {mounted && user ? (
                    <div className="space-y-2">
                      <div className="gsap-menu-item flex items-center gap-3 rounded-2xl border border-[#D4AF37]/40 bg-[#FAF6ED] p-3">
                        {user.avatarImage ? (
                          <img
                            src={user.avatarImage}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover border border-[#D4AF37]"
                          />
                        ) : (
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#14100A] text-xs font-black text-[#ECC872] border border-[#D4AF37]">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#141414] truncate">{user.name}</p>
                          <p className="text-[10px] text-[#7A6A53] truncate">{user.email}</p>
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#875A10]">
                            {isAdmin ? 'Administrator' : 'Artisan Collector'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="gsap-menu-item flex items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/50 bg-white py-2.5 text-xs font-bold text-[#141414] shadow-xs cursor-pointer hover:bg-[#FAF5E8]"
                        >
                          <User className="h-3.5 w-3.5 text-[#B8860B]" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/profile?tab=orders"
                          onClick={() => setIsMenuOpen(false)}
                          className="gsap-menu-item flex items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/50 bg-white py-2.5 text-xs font-bold text-[#141414] shadow-xs cursor-pointer hover:bg-[#FAF5E8]"
                        >
                          <Package className="h-3.5 w-3.5 text-[#B8860B]" />
                          <span>My Orders</span>
                        </Link>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="gsap-menu-item flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#FAF5E8] py-2.5 text-xs font-bold text-[#875A10]"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#B8860B]" />
                          <span>Open Admin Console</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                        }}
                        className="gsap-menu-item flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50/70 py-2.5 text-xs font-bold text-rose-600 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
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
                      className="gsap-menu-item btn-primary w-full text-xs justify-center py-3 cursor-pointer"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In / Create Account</span>
                    </button>
                  )}

                  {/* Direct Concierge Contact Card */}
                  <div className="gsap-menu-item mt-3 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-b from-[#FAF6ED] to-[#F5ECD5] p-3 text-center shadow-2xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5408]">
                      Concierge &amp; Order Support
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-bold">
                      <a
                        href="https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20want%20to%20inquire%20about%20an%20order!"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-full bg-white border border-[#D4AF37]/40 py-2 text-emerald-700 shadow-2xs hover:bg-[#F0FDF4] transition"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href="tel:+919341297124"
                        className="flex items-center justify-center gap-1.5 rounded-full bg-white border border-[#D4AF37]/40 py-2 text-[#5C4106] shadow-2xs hover:bg-white transition"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#B8860B]" />
                        <span>Call</span>
                      </a>
                    </div>
                    <a
                      href="mailto:npatelierindia@gmail.com"
                      className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#7A5408] hover:underline"
                    >
                      <Mail className="h-3 w-3 text-[#B8860B]" />
                      <span>npatelierindia@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  </div>
  )
}

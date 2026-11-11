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

  // Native smooth scroll to anchor
  const scrollToAnchor = (href: string) => {
    if (typeof window !== 'undefined') {
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
        target.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleLinkClick = (href: string, dept?: 'all' | 'crafts' | 'aquarium') => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      if (href === '#acquario-tropicale' || href === '#aquarium' || dept === 'aquarium') {
        router.push('/?dept=aquarium')
        return
      }
      router.push(href === '#home' ? '/' : `/${href}`)
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
    <>
      <div className="fixed top-0 inset-x-0 z-50 w-full pointer-events-none">
      <div className="pointer-events-auto">
        {/* Main Luxury Header */}
        <header
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#8C6D46]/25 shadow-[0_10px_30px_rgba(72,54,30,0.09)] py-2.5'
              : 'bg-[#F5F0E8]/90 backdrop-blur-md border-b border-[#8C6D46]/18 py-3.5'
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
              className="group flex items-center gap-2.5 sm:gap-3 shrink-0 select-none cursor-pointer"
            >
              {branding?.logoImageUrl &&
              (branding.logoType === 'image' || branding.logoType === 'both') ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.siteName}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-[#B8925A]/55 shadow-[0_3px_12px_rgba(72,54,30,0.14)] bg-[#EDE4DD] transition-transform duration-300 group-hover:scale-105 shrink-0"
                />
              ) : (
                <div className="relative grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-[#FAF6EF] text-[#141210] border border-[#B8925A]/55 shadow-sm transition-all duration-300 group-hover:scale-105 shrink-0">
                  <span className="sr-only">NP</span>
                  <NpMonogramSvg className="h-5 w-auto text-[#141210]" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#D4AF78] ring-2 ring-[#F5F0E8]" />
                </div>
              )}

              <div className="flex flex-col">
                <span
                  suppressHydrationWarning
                  className="inline-flex items-baseline text-[#141210] leading-none"
                >
                  <BrandTitle
                    siteName={siteName}
                    svgClassName="h-[19px] sm:h-[24px] w-auto text-[#141210]"
                    atelierClassName="text-[24px] sm:text-[31px] text-[#141210]"
                    fallbackClassName="font-script text-2xl sm:text-3xl text-[#141210] normal-case"
                  />
                </span>
                <span
                  suppressHydrationWarning
                  className="font-tagline italic text-[11px] sm:text-[13px] font-semibold tracking-[0.06em] text-[#6B5335] mt-0.5 truncate max-w-[165px] sm:max-w-none"
                >
                  Haute Crafts &amp; Living Waters
                </span>
              </div>
            </a>

            {/* Center Navigation Dock with Sliding Pill */}
            <nav className="hidden lg:flex items-center relative">
              <div className="flex items-center rounded-full border border-[#8C6D46]/25 bg-[#EFE8DC]/90 p-1 shadow-[0_4px_16px_rgba(72,54,30,0.08)] backdrop-blur-md relative">

                {/* Crafts Direct Tab */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#collection', 'crafts')}
                  className={`relative rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition-colors duration-200 cursor-pointer ${
                    currentNav === 'crafts'
                      ? 'text-[#141210]'
                      : 'text-[#5C4D3C] hover:text-[#141210]'
                  }`}
                >
                  {currentNav === 'crafts' && (
                    <motion.div
                      layoutId="navbarCenterDockPill"
                      className="absolute inset-0 rounded-full bg-[#D4AF78] shadow-xs"
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
                      ? 'text-[#141210]'
                      : 'text-[#5C4D3C] hover:text-[#141210]'
                  }`}
                >
                  {currentNav === 'aquarium' && (
                    <motion.div
                      layoutId="navbarCenterDockPill"
                      className="absolute inset-0 rounded-full bg-[#D4AF78] shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Fish className={`h-3.5 w-3.5 relative z-10 ${currentNav === 'aquarium' ? 'text-[#141210]' : 'text-teal-700'}`} />
                  <span className="relative z-10 font-tagline text-sm font-bold tracking-tight">Acquario Tropicale</span>
                </button>

                {/* The Collective */}
                <button
                  type="button"
                  onClick={() => handleLinkClick('#makers')}
                  className={`relative rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition-colors duration-200 cursor-pointer ${
                    currentNav === 'makers'
                      ? 'text-[#141210]'
                      : 'text-[#5C4D3C] hover:text-[#141210]'
                  }`}
                >
                  {currentNav === 'makers' && (
                    <motion.div
                      layoutId="navbarCenterDockPill"
                      className="absolute inset-0 rounded-full bg-[#D4AF78] shadow-xs"
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
                className="hidden sm:flex h-10 items-center gap-2 rounded-full border border-[#8C6D46]/28 bg-[#FAF6EF] px-3 text-xs font-semibold text-[#141210] shadow-xs transition hover:border-[#B8925A] hover:bg-[#F3ECE0] hover:text-[#7A5B32] cursor-pointer"
                title="Search catalogue (⌘K)"
              >
                <Search className="h-4 w-4 text-[#7A5B32] transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden xl:inline text-[#5C4D3C]">Search catalogue...</span>
                <kbd className="hidden 2xl:inline-block rounded-md bg-[#EFE8DC] border border-[#8C6D46]/30 px-1.5 py-0.5 text-[9px] text-[#7A5B32] font-mono font-bold">
                  ⌘K
                </kbd>
              </button>

              {/* List Craft / Sell Button */}
              <button
                type="button"
                onClick={() => setIsSellOpen(true)}
                className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-[#8C6D46]/35 bg-[#FAF6EF] px-3.5 text-xs font-bold text-[#7A5B32] shadow-xs transition hover:border-[#D4AF78] hover:bg-[#D4AF78] hover:text-[#141210] cursor-pointer"
              >
                <Store className="h-3.5 w-3.5 text-current" />
                <span>List Craft</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                aria-label="View Wishlist"
                onClick={() => setIsWishlistOpen(true)}
                className="hidden sm:grid relative h-10 w-10 place-items-center rounded-full border border-[#8C6D46]/28 bg-[#FAF6EF] text-[#141210] shadow-xs transition duration-150 hover:scale-105 hover:border-rose-500 hover:text-rose-500 cursor-pointer"
                title="Your Wishlist"
              >
                <Heart className="h-4 w-4" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-xs animate-in zoom-in-50">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Haute Shopping Bag Button - Champagne Gold Primary */}
              <button
                type="button"
                aria-label="View Shopping Bag"
                onClick={() => setIsCartOpen(true)}
                className="group relative inline-flex h-10 items-center gap-2 rounded-full bg-[#D4AF78] border border-[#B8925A]/55 px-4 text-xs font-bold text-[#141210] shadow-[0_4px_14px_rgba(72,54,30,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E5C18A] hover:shadow-[0_6px_18px_rgba(212,175,120,0.28)] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 text-[#141210] transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden sm:inline font-tagline font-bold text-base tracking-wide text-[#141210]">
                  Bag
                </span>
                {mounted && cartCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#141210] px-1.5 text-[10px] font-black text-[#D4AF78] shadow-xs">
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
                    className="flex h-10 items-center gap-2 rounded-full border border-[#8C6D46]/30 bg-[#FAF6EF] px-2.5 text-xs font-bold text-[#141210] shadow-xs hover:border-[#B8925A] transition cursor-pointer"
                  >
                    {user.avatarImage ? (
                      <img
                        src={user.avatarImage}
                        alt={user.name}
                        className="h-6 w-6 rounded-full object-cover border border-[#B8925A]/60"
                      />
                    ) : (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#141210] text-[10px] text-[#D4AF78] font-black border border-[#8C6D46]/40">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                    <span className="hidden md:inline max-w-[90px] truncate text-[#141210]">{user.name}</span>
                    <ChevronDown className="h-3 w-3 text-[#5C4D3C]" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#8C6D46]/30 bg-[#FCF9F4] p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#141210]">
                      <div className="px-3.5 py-2.5 border-b border-[#8C6D46]/20">
                        <p className="text-xs font-bold text-[#141210] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#5C4D3C] truncate">
                          {user.email || 'Artisan Collector'}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#EFE8DC] border border-[#8C6D46]/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#7A5B32]">
                          <ShieldCheck className="h-3 w-3 text-[#7A5B32]" />
                          {isAdmin ? 'Administrator' : 'Artisan Patron & Collector'}
                        </span>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#141210] hover:bg-[#EFE8DC] hover:text-[#7A5B32] transition cursor-pointer"
                      >
                        <User className="h-3.5 w-3.5 text-[#7A5B32]" />
                        <span>My Profile &amp; Address</span>
                      </Link>

                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#141210] hover:bg-[#EFE8DC] hover:text-[#7A5B32] transition cursor-pointer"
                      >
                        <Package className="h-3.5 w-3.5 text-[#7A5B32]" />
                        <span>My Bespoke Orders</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          setIsSellOpen(true)
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#141210] hover:bg-[#EFE8DC] hover:text-[#7A5B32] transition cursor-pointer"
                      >
                        <Store className="h-3.5 w-3.5 text-[#7A5B32]" />
                        <span>Artisan Studio Portal</span>
                      </button>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#7A5B32] bg-[#EFE8DC] hover:bg-[#E6DEC9] transition"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-[#7A5B32]" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="my-1 border-t border-[#8C6D46]/20" />

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
                  className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-[#8C6D46]/35 bg-[#FAF6EF] px-4 text-xs font-bold text-[#7A5B32] shadow-xs transition hover:border-[#D4AF78] hover:bg-[#D4AF78] hover:text-[#141210] cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5 text-current" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Hamburger Drawer Toggle with Custom Animated 3-Bar Morph Icon */}
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-[#8C6D46]/30 bg-[#FAF6EF] text-[#141210] shadow-xs lg:hidden transition duration-200 cursor-pointer hover:border-[#B8925A] hover:bg-[#EFE8DC] active:scale-90"
              >
                <div className="relative flex flex-col items-center justify-center w-5 h-5 pointer-events-none">
                  {/* Top Bar */}
                  <span
                    className={`block h-[2px] w-5 rounded-full bg-[#141210] transition-all duration-300 ease-out origin-center ${
                      isMenuOpen ? 'rotate-45 translate-y-[6px] bg-[#7A5B32]' : ''
                    }`}
                  />
                  {/* Middle Bar */}
                  <span
                    className={`block h-[2px] w-3.5 my-[4px] rounded-full bg-[#7A5B32] transition-all duration-200 ease-out self-start ${
                      isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                    }`}
                  />
                  {/* Bottom Bar */}
                  <span
                    className={`block h-[2px] w-5 rounded-full bg-[#141210] transition-all duration-300 ease-out origin-center ${
                      isMenuOpen ? '-rotate-45 -translate-y-[6px] bg-[#7A5B32]' : ''
                    }`}
                  />
                </div>
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
          className="fixed inset-0 bg-[#141210]/45 backdrop-blur-[2px]"
        />

        {/* Haute Couture Slide Sheet */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ x: '100%', opacity: 0, transition: { duration: 0.16, ease: 'easeIn' } }}
          className="relative w-[88%] max-w-[390px] h-full bg-[#F5F0E8] border-l border-[#8C6D46]/30 shadow-[-12px_0_35px_rgba(72,54,30,0.22)] flex flex-col z-10 overflow-hidden transform-gpu will-change-transform touch-auto overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Top Atelier Header */}
          <div className="flex items-center justify-between border-b border-[#8C6D46]/25 bg-[#FCF9F4] px-5 py-4">
            <div className="flex items-center gap-2.5">
              {branding?.logoImageUrl &&
              (branding.logoType === 'image' || branding.logoType === 'both') ? (
                <img
                  src={branding.logoImageUrl}
                  alt={siteName}
                  className="h-9 w-9 rounded-full object-cover border border-[#B8925A]/55 shadow-xs bg-[#EDE4DD]"
                />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EFE8DC] border border-[#B8925A]/50 text-[#141210] shadow-xs">
                  <NpMonogramSvg className="h-4.5 w-auto text-[#141210]" />
                </div>
              )}
              <div>
                <h3 className="leading-none text-[#141210]">
                  <BrandTitle
                    siteName={siteName}
                    svgClassName="h-[15px] w-auto text-[#141210]"
                    atelierClassName="text-[22px] text-[#141210]"
                  />
                </h3>
                <p className="font-tagline italic text-[11px] font-semibold tracking-wide text-[#6B5335]">
                  Haute Atelier &amp; Aquatics
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#8C6D46]/30 bg-[#FAF6EF] text-[#141210] hover:border-[#B8925A] hover:text-[#7A5B32] transition active:scale-90 cursor-pointer"
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
              className="group flex w-full items-center justify-between rounded-2xl border border-[#8C6D46]/28 bg-[#FCF9F4] px-4 py-3 text-xs text-[#141210] shadow-xs transition active:scale-[0.98] hover:border-[#B8925A] hover:bg-[#FAF6EF] cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-[#5C4D3C] group-hover:text-[#141210] transition">
                <Search className="h-4 w-4 text-[#7A5B32]" />
                <span className="font-medium">Search 40+ crafts &amp; aquatics...</span>
              </span>
              <span className="rounded-lg bg-[#EFE8DC] border border-[#8C6D46]/30 px-2 py-0.5 text-[9px] font-mono font-bold text-[#7A5B32]">
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
                className="flex items-center justify-between rounded-2xl border border-[#8C6D46]/25 bg-[#FCF9F4] p-3 text-left hover:border-[#B8925A] transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#7A5B32]" />
                  <span className="text-xs font-bold text-[#141210]">Bag</span>
                </div>
                <span className="rounded-full bg-[#D4AF78] text-[#141210] px-2 py-0.5 text-[10px] font-black">
                  {mounted ? cartCount : 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsWishlistOpen(true)
                }}
                className="flex items-center justify-between rounded-2xl border border-[#8C6D46]/25 bg-[#FCF9F4] p-3 text-left hover:border-rose-400 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span className="text-xs font-bold text-[#141210]">Wishlist</span>
                </div>
                <span className="rounded-full bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 text-[10px] font-black">
                  {mounted ? wishlist.length : 0}
                </span>
              </button>
            </div>

            {/* Department Featured Cards */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B5A48] px-1 mb-2">
                Browse Curations
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLinkClick('#collection', 'crafts')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    activeDepartment === 'crafts'
                      ? 'border-[#B8925A] bg-[#EFE8DC] shadow-sm'
                      : 'border-[#8C6D46]/22 bg-[#FCF9F4] hover:bg-[#FAF6EF]'
                  }`}
                >
                  <Palette className="h-4 w-4 text-[#7A5B32] mb-1.5" />
                  <p className="text-xs font-bold text-[#141210]">Artisan Crafts</p>
                  <p className="text-[10px] text-[#5C4D3C] truncate">Resin, Candles, Decor</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    activeDepartment === 'aquarium'
                      ? 'border-teal-600 bg-[#E7F4F1] shadow-sm'
                      : 'border-[#8C6D46]/22 bg-[#FCF9F4] hover:bg-[#FAF6EF]'
                  }`}
                >
                  <Fish className="h-4 w-4 text-teal-700 mb-1.5" />
                  <p className="text-xs font-bold text-[#141210] font-tagline text-sm">Acquario</p>
                  <p className="text-[10px] text-[#5C4D3C] truncate">Fish &amp; Nano Tanks</p>
                </button>
              </div>
            </div>

            {/* Primary Navigation Links */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B5A48] px-1 mb-2">
                Menu Directory
              </p>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleLinkClick('#home')}
                  className="w-full rounded-2xl px-3.5 py-2.5 transition flex items-center justify-between bg-[#FCF9F4] hover:bg-[#EFE8DC] border border-[#8C6D46]/20 text-[#141210] text-left cursor-pointer"
                >
                  <span className="text-xs font-bold">Home Sanctuary</span>
                  <span className="text-xs text-[#7A5B32]">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('#collection', 'crafts')}
                  className="w-full rounded-2xl px-3.5 py-2.5 transition flex items-center justify-between bg-[#FCF9F4] hover:bg-[#EFE8DC] border border-[#8C6D46]/20 text-[#141210] text-left cursor-pointer"
                >
                  <span className="text-xs font-bold">Artisan Collection</span>
                  <span className="text-xs text-[#7A5B32]">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('#acquario-tropicale', 'aquarium')}
                  className="w-full rounded-2xl px-3.5 py-2.5 transition flex items-center justify-between bg-[#FCF9F4] hover:bg-[#EFE8DC] border border-[#8C6D46]/20 text-[#141210] text-left cursor-pointer font-tagline"
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <Fish className="h-3.5 w-3.5 text-teal-700" />
                    <span>Acquario Tropicale</span>
                  </span>
                  <span className="text-xs text-[#7A5B32]">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('#makers')}
                  className="w-full rounded-2xl px-3.5 py-2.5 transition flex items-center justify-between bg-[#FCF9F4] hover:bg-[#EFE8DC] border border-[#8C6D46]/20 text-[#141210] text-left cursor-pointer"
                >
                  <span className="text-xs font-bold">The Collective &amp; Makers</span>
                  <span className="text-xs text-[#7A5B32]">→</span>
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#8C6D46]/35 bg-gradient-to-r from-[#FCF9F4] via-[#EFE8DC] to-[#FCF9F4] py-3 text-xs font-bold text-[#7A5B32] shadow-sm hover:border-[#B8925A] hover:text-[#141210] transition cursor-pointer"
            >
              <Store className="h-4 w-4 text-[#7A5B32]" />
              <span>List Your Craft • Zero Setup Fees</span>
            </button>

            {/* User Authentication / Profile Section */}
            {mounted && user ? (
              <div className="space-y-2 rounded-2xl border border-[#8C6D46]/25 bg-[#FCF9F4] p-3">
                <div className="flex items-center gap-3">
                  {user.avatarImage ? (
                    <img
                      src={user.avatarImage}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover border border-[#B8925A]"
                    />
                  ) : (
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EFE8DC] text-xs font-black text-[#7A5B32] border border-[#8C6D46]/35">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#141210] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#5C4D3C] truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#8C6D46]/20">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#8C6D46]/25 bg-[#FAF6EF] py-2 text-[11px] font-bold text-[#141210] hover:border-[#B8925A] transition"
                  >
                    <User className="h-3 w-3 text-[#7A5B32]" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/profile?tab=orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#8C6D46]/25 bg-[#FAF6EF] py-2 text-[11px] font-bold text-[#141210] hover:border-[#B8925A] transition"
                  >
                    <Package className="h-3 w-3 text-[#7A5B32]" />
                    <span>Orders</span>
                  </Link>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#B8925A]/50 bg-[#EFE8DC] py-2 text-xs font-bold text-[#7A5B32]"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#7A5B32]" />
                    <span>Admin Console</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2 text-[11px] font-bold text-rose-600 hover:bg-rose-100 transition cursor-pointer"
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
            <div className="rounded-2xl border border-[#8C6D46]/25 bg-[#FCF9F4] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B32]">
                WhatsApp Concierge &amp; Dispatch
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-bold">
                <a
                  href="https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20want%20to%20inquire%20about%20an%20order!"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 py-2 text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+919341297124"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#FAF6EF] border border-[#8C6D46]/30 py-2 text-[#141210] hover:border-[#B8925A] transition"
                >
                  <Phone className="h-3.5 w-3.5 text-[#7A5B32]" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
</>
  )
}

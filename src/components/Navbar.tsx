"use client"

import { useState, useEffect } from 'react'
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
  UserCircle2,
  X,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
    logout,
  } = useMarketplace()

  const links = [
    { name: 'All Drops', href: '#collection', department: 'all' as const },
    { name: 'Crafts', href: '#collection', department: 'crafts' as const },
    { name: '🐠 Fish & Aquarium', href: '#collection', department: 'aquarium' as const },
    { name: 'Custom Studio', href: '#customize' },
    { name: 'Makers', href: '#makers' },
  ]

  const handleLinkClick = (dept?: 'all' | 'crafts' | 'aquarium') => {
    if (dept && setActiveDepartment) {
      setActiveDepartment(dept)
    }
    setIsMenuOpen(false)
  }

  // Helper to format site name nicely with gold accent on last word
  const renderSiteName = () => {
    const rawName = branding?.siteName || 'NP Atelier'
    const parts = rawName.split(' ')
    if (parts.length > 1) {
      const main = parts.slice(0, -1).join(' ')
      const last = parts[parts.length - 1]
      return (
        <span
          suppressHydrationWarning
          className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#141414] flex items-center gap-1.5 whitespace-nowrap"
        >
          {main} <span className="text-gold-gradient font-bold">{last}</span>
        </span>
      )
    }
    return (
      <span
        suppressHydrationWarning
        className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#141414] whitespace-nowrap"
      >
        {rawName}
      </span>
    )
  }

  return (
    <>
      {/* Top Announcement Bar with Dynamic Settings */}
      <div className="relative z-50 bg-gradient-to-r from-[#FAF4E4] via-[#F6EAC9] to-[#FAF4E4] border-b border-[#E8D6A7] py-2 text-[#4A380A]">
        <div className="section-shell flex items-center justify-between text-xs font-semibold gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-[10px] text-white shadow-sm">
              ★
            </span>
            <span className="tracking-wide truncate" suppressHydrationWarning>
              {branding?.announcementText || 'Handcrafted Artisan Drops & Exotic Aquatics Live • Code ATELIER10 for 10% off'}
            </span>
          </div>

          <div className="hidden items-center gap-3.5 text-[11px] font-medium text-[#6B531C] sm:flex shrink-0">
            <span className="text-[#7A5408] font-bold">✦ 100% Certified Makers & Aquarists</span>
            <span className="text-[#D8C7A0]">&#8226;</span>
            <span>Free Delivery Over <strong className="text-[#5C4106]">&#8377;1,499</strong></span>
            <span className="text-[#D8C7A0]">&#8226;</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-[#D4AF37]/50 px-2.5 py-0.5 text-[11px] font-semibold text-[#5C4106] hover:border-[#D4AF37] hover:bg-white transition-all shadow-xs"
              title="Open Admin & Operations Console"
            >
              <LayoutDashboard className="h-3 w-3 text-[#B8860B]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-[#EEDBBA]/80 bg-[#FDFBF7]/98 shadow-[0_4px_20px_rgba(184,134,11,0.06)]">
        <div className="section-shell">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Dynamic Logo & Name */}
            <a href="#home" className="group flex items-center gap-2.5 sm:gap-3 shrink-0">
              {branding?.logoImageUrl && (branding.logoType === 'image' || branding.logoType === 'both') ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.siteName}
                  className="h-10 sm:h-11 w-auto max-h-11 max-w-[130px] rounded-2xl object-contain border border-[#D4AF37]/50 shadow-[0_4px_16px_rgba(184,134,11,0.18)] bg-white/80 p-0.5 transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <span
                  suppressHydrationWarning
                  className="inline-flex h-10 min-w-10 sm:h-11 sm:min-w-11 px-2.5 items-center justify-center rounded-2xl bg-gradient-to-br from-[#241A06] via-[#141414] to-[#382705] text-[#ECC872] border border-[#D4AF37]/50 font-bold text-sm sm:text-base tracking-wider uppercase shadow-[0_4px_16px_rgba(184,134,11,0.25)] transition-transform duration-200 group-hover:scale-105 overflow-hidden whitespace-nowrap"
                >
                  {branding?.logoText || 'NP'}
                </span>
              )}

              <div>
                {renderSiteName()}
                <span
                  suppressHydrationWarning
                  className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.22em] text-[#7A5408] whitespace-nowrap"
                >
                  {branding?.tagline || 'Luxury Crafts & Exotic Aquatics'}
                </span>
              </div>
            </a>

            {/* Nav Links with Category Switching */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 2xl:gap-8 text-xs xl:text-sm font-semibold tracking-wide text-[#3A3630] shrink-0">
              {links.map((link) => {
                const isActive = link.department && activeDepartment === link.department
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => handleLinkClick(link.department)}
                    className={`relative whitespace-nowrap py-1 transition-colors duration-200 group ${
                      isActive ? 'text-[#7A5408] font-bold' : 'text-[#3A3630] hover:text-[#7A5408]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] rounded-full transition-[width] duration-200 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </a>
                )
              })}
            </nav>

            {/* Curated Action Buttons (Desktop) */}
            <div className="hidden items-center gap-2.5 lg:flex shrink-0">
              {/* Quick Search */}
              <button
                type="button"
                onClick={() => setIsQuickSearchOpen(true)}
                className="group inline-flex h-10 items-center gap-2 rounded-full border border-[#E5D7B7] bg-white px-3.5 text-xs font-semibold text-[#3A3630] shadow-sm transition hover:border-[#D4AF37] hover:shadow-[0_0_12px_rgba(212,175,55,0.2)] hover:text-[#141414] shrink-0 whitespace-nowrap"
                title="Search marketplace (⌘K)"
              >
                <Search className="h-4 w-4 text-[#B8860B] transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden xl:inline text-[#3A3630]">Search crafts & aquatics...</span>
                <span className="xl:hidden text-[#3A3630]">Search</span>
                <kbd className="hidden 2xl:inline-block rounded bg-[#F5EEDC] border border-[#E0D0AB] px-1.5 py-0.5 text-[10px] text-[#735206] font-mono">⌘K</kbd>
              </button>

              {/* Sell Your Craft / Aquatic */}
              <button
                type="button"
                onClick={() => setIsSellOpen(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-gradient-to-r from-[#FAF5E6] to-[#F5ECCF] px-4 text-xs font-bold tracking-wide text-[#4D3505] shadow-xs transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#171103] hover:shadow-[0_0_15px_rgba(212,175,55,0.35)] shrink-0 whitespace-nowrap"
              >
                <Store className="h-4 w-4" />
                <span>Sell Item</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                aria-label="Open wishlist"
                onClick={() => setIsWishlistOpen(true)}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-[#E5D7B7] bg-white text-[#3A3630] shadow-sm transition duration-200 hover:scale-105 hover:border-rose-500/50 hover:text-rose-500 shrink-0"
                title="Wishlist"
              >
                <Heart className="h-4 w-4 xl:h-5 xl:w-5 text-[#8C7A54] transition group-hover:text-rose-500" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                type="button"
                aria-label="Open shopping bag"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex h-10 items-center gap-2 rounded-full bg-[#141414] border border-[#D4AF37]/50 px-4 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.18),0_0_12px_rgba(212,175,55,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25),0_0_18px_rgba(212,175,55,0.4)] hover:bg-[#241D0E] shrink-0 whitespace-nowrap"
              >
                <ShoppingBag className="h-4 w-4 stroke-[2.2] text-[#ECC872]" />
                <span>Bag</span>
                {mounted && cartCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-[#ECC872] to-[#D4AF37] px-1.5 text-[11px] font-bold text-[#141414]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User / Auth */}
              {mounted && user ? (
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex h-10 items-center gap-2 rounded-full border border-[#DDD7CE] bg-white p-1 pr-3 shadow-sm whitespace-nowrap">
                    {user.avatarImage ? (
                      <img
                        src={user.avatarImage}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#241705] text-xs font-bold text-[#fbf3d5]">
                        {user.avatar}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#241705]">{user.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#DDD7CE] bg-white text-rose-600 transition hover:bg-rose-50 hover:border-rose-300"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="btn-gold h-10 text-xs px-4 whitespace-nowrap"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Actions: Cart, Wishlist & Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                aria-label="Wishlist"
                onClick={() => setIsWishlistOpen(true)}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-[#E5D7B7] bg-white text-[#3A3630] shadow-sm"
              >
                <Heart className="h-4 w-4 text-[#8C7A54]" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                aria-label="Shopping bag"
                onClick={() => setIsCartOpen(true)}
                className="relative grid h-10 w-10 place-items-center rounded-full bg-[#141414] border border-[#D4AF37]/50 text-white shadow-sm"
              >
                <ShoppingBag className="h-4 w-4 text-[#ECC872]" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#D4AF37] px-1 text-[9px] font-bold text-[#141414]">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#DFCFA6]/60 bg-white text-[#141414] shadow-sm transition"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Navigation */}
          {isMenuOpen && (
            <div className="pb-5 lg:hidden">
              <div className="glass-card overflow-hidden p-5 shadow-dropdown border border-[#E5E0D8] bg-[#FAF8F5]">
                {/* Search Bar in Mobile */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsQuickSearchOpen(true)
                    }}
                    className="flex w-full items-center justify-between rounded-full border border-[#DDD7CE] bg-white px-4 py-2.5 text-xs text-[#141414]"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-[#8C827A]" />
                      Search crafts & aquatics...
                    </span>
                    <span className="rounded bg-[#EFECE6] border border-[#DDD7CE] px-2 py-0.5 text-[10px] text-[#141414] font-bold">Open</span>
                  </button>
                </div>

                <nav className="grid gap-2 text-sm font-bold text-[#141414]">
                  {links.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => handleLinkClick(link.department)}
                      className={`rounded-xl px-4 py-2.5 transition flex items-center justify-between ${
                        link.department && activeDepartment === link.department
                          ? 'bg-[#E8DCC2] text-[#855A10]'
                          : 'hover:bg-[#EFECE6] hover:text-[#141414]'
                      }`}
                    >
                      <span>{link.name}</span>
                      {link.department && activeDepartment === link.department && (
                        <span className="h-2 w-2 rounded-full bg-[#855A10]" />
                      )}
                    </a>
                  ))}
                </nav>

                <div className="mt-4 grid gap-2.5 border-t border-[#E5E0D8] pt-4">
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-secondary w-full text-xs justify-center"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin & Operations Console
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsSellOpen(true)
                    }}
                    className="btn-primary w-full text-xs justify-center"
                  >
                    <Store className="h-4 w-4" />
                    Sell Your Craft / Aquatic
                  </button>

                  {mounted && user ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="btn-secondary w-full text-xs justify-center"
                    >
                      <UserCircle2 className="h-4 w-4" />
                      Sign Out ({user.name})
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsAuthOpen(true)
                      }}
                      className="btn-primary w-full text-xs justify-center"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In / Register
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

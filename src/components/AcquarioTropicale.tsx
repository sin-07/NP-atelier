"use client"

import { useMemo, useState, useEffect, useDeferredValue } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Fish,
  Waves,
  ShieldCheck,
  Sparkles,
  Droplets,
  Search,
  Mail,
  MessageCircle,
  Package,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle2,
} from 'lucide-react'
import ProductCard from './ProductCard'
import {
  aquariumCategories,
  aquariumCategoryGroups,
  Product,
} from '../data/products'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage, fallbackAquariumImage } from '../utils/fallbackImage'
import { AQUATIC_CONTACT_EMAIL } from '../utils/worldTheme'

const AQUARIUM_BADGE_FILTERS = [
  'All',
  'Live Arrival Guarantee',
  'Captive Bred',
  'Optiwhite Ultra-Clear',
  'Centerpiece Fish',
  'New Drop',
]

export default function AcquarioTropicale() {
  const {
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
  } = useMarketplace()

  const [activeCategory, setActiveCategory] = useState('All')
  const [activeBadge, setActiveBadge] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [visibleCount, setVisibleCount] = useState(12)

  // Filter ONLY aquarium products - NEVER mix with craft items
  const allAquariumProducts = useMemo(() => {
    return products.filter((p: Product) => {
      return (
        p.department === 'aquarium' ||
        aquariumCategories.includes(p.category)
      )
    })
  }, [products])

  // Category pills strictly for aquarium items
  const aquaticCategoryPills = useMemo(() => {
    const dynamicCats = Array.from(
      new Set([
        ...aquariumCategories,
        ...allAquariumProducts.map((p: Product) => p.category).filter(Boolean),
      ])
    )
    return ['All', ...dynamicCats]
  }, [allAquariumProducts])

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(12)
  }, [activeCategory, activeBadge, searchTerm, sortBy])

  // Filtered and sorted list
  const filteredProducts = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase()

    const result = allAquariumProducts.filter((product: Product) => {
      // Category filter
      let matchesCategory = true
      if (activeCategory !== 'All') {
        matchesCategory = product.category === activeCategory
      }

      // Badge filter
      let matchesBadge = true
      if (activeBadge !== 'All') {
        matchesBadge = (product.badges || []).some(
          (b) => b.toLowerCase().includes(activeBadge.toLowerCase())
        )
      }

      // Search query
      const matchesSearch =
        query.length === 0 ||
        [product.title, product.category, product.description, ...(product.badges || [])]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesCategory && matchesBadge && matchesSearch
    })

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const pA = Number.parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0
        const pB = Number.parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0
        return pA - pB
      })
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const pA = Number.parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0
        const pB = Number.parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0
        return pB - pA
      })
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return result
  }, [allAquariumProducts, activeCategory, activeBadge, deferredSearchTerm, sortBy])

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, visibleCount])

  return (
    <section
      id="acquario-tropicale"
      className="relative scroll-mt-24 py-12 sm:py-20 bg-[#051320]"
    >
      {/* Anchor for backwards compatibility */}
      <div id="aquarium" className="relative -top-28 pointer-events-none" />

      <div className="section-shell">
        {/* Main Royal Reef Shell Card (Deep Blue Canvas + Emerald & Coral Glows) */}
        <div className="relative rounded-[2.5rem] sm:rounded-[3.2rem] border border-sky-400/25 bg-gradient-to-b from-[#081F33] via-[#0B2942] to-[#061829] p-5 sm:p-10 lg:p-12 shadow-[0_24px_65px_rgba(2,12,24,0.75)] text-[#F0F8FF] overflow-hidden">
          {/* Blue / Green / Red Ambient Reef Radiance Highlights */}
          <div className="pointer-events-none absolute -top-28 -right-28 h-96 w-96 rounded-full bg-emerald-500/18 blur-[125px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/4 h-80 w-80 rounded-full bg-sky-500/16 blur-[140px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#E11D48]/14 blur-[130px]" />

          {/* SECTION HEADER */}
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Eyebrow Badge (Blue Fill + Emerald Border/Ink + Red Live Pulse) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-[#061A2C] px-4 py-1.5 text-[11px] font-bold text-emerald-300 shadow-xs mb-4">
              <Fish className="h-3.5 w-3.5 text-emerald-400" />
              <span className="uppercase tracking-[0.22em]">Acquario Tropicale • Coming Soon Collection</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#F43F5E] animate-pulse" />
            </div>

            {/* Haute Title (Pearl White + Blue-Green-Red Gradient) */}
            <h2 className="font-tagline text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F0F8FF] leading-[1.15]">
              Acquario{' '}
              <span className="italic font-normal bg-gradient-to-r from-[#38BDF8] via-[#34D399] to-[#FB7185] bg-clip-text text-transparent font-tagline">
                Tropicale
              </span>
            </h2>

            {/* Lead Description */}
            <p className="mt-4 text-xs sm:text-base text-[#B6D4E8] leading-relaxed max-w-2xl mx-auto font-medium">
              A curated world exclusively for tropical aquatic wonders. Captive-bred centerpiece Discus &amp; Show Bettas, ultra-clear low-iron rimless nature aquariums, lush living flora, and professional aquascaping gear.{' '}
              <span className="font-bold text-rose-300 block mt-1.5">
                ✦ Launching Soon — Inquire on WhatsApp or email{' '}
                <a
                  href={`mailto:${AQUATIC_CONTACT_EMAIL}`}
                  className="underline decoration-emerald-400/70 underline-offset-4 text-emerald-300 hover:text-white transition"
                >
                  {AQUATIC_CONTACT_EMAIL}
                </a>{' '}
                for early reservations &amp; launch notifications.
              </span>
            </p>

            {/* 4 Certified Aquatic Trust Badges (Blue Containers + Emerald Green Icons/Borders + Coral Focus) */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10.5px] sm:text-xs font-bold text-[#F0F8FF]">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-[#082238] px-3.5 py-1.5 shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>100% Live Arrival Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-sky-400/35 bg-[#082238] px-3.5 py-1.5 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span>Optiwhite Low-Iron Glass</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-rose-400/35 bg-[#082238] px-3.5 py-1.5 shadow-xs">
                <Package className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span>Temp-Controlled Oxygen Crating</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-[#082238] px-3.5 py-1.5 shadow-xs">
                <Droplets className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Snail-Free Tissue Culture Plants</span>
              </div>
            </div>
          </div>

          {/* VISUAL SHOWCASE CARDS (AQUARIUM EXCLUSIVE) */}
          <div className="relative z-10 mt-10 sm:mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {aquariumCategoryGroups.slice(0, 4).map((cat) => {
              const isSelected = activeCategory === cat.title
              return (
                <button
                  key={cat.title}
                  type="button"
                  onClick={() => {
                    setActiveCategory(isSelected ? 'All' : cat.title)
                  }}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition duration-300 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-[#F43F5E] ring-1 ring-[#F43F5E]/55 shadow-[0_10px_28px_rgba(225,29,72,0.3)] bg-[#0E2F4A]'
                      : 'border-sky-400/25 bg-[#0A243A] hover:border-emerald-400/65 hover:shadow-[0_12px_28px_rgba(16,185,129,0.2)]'
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#051422]">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      width={400}
                      height={250}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = fallbackAquariumImage
                      }}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04101C]/85 via-transparent to-transparent" />
                    
                    {/* BICHO BICH (DEAD CENTER) "COMING SOON" BADGE */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center p-2 bg-[#04101C]/45 pointer-events-none transition-all duration-200">
                      <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#061828]/90 backdrop-blur-xs border border-[#F43F5E]/75 px-3 sm:px-4 py-1.5 shadow-[0_8px_24px_rgba(2,12,24,0.65)] transform transition-transform duration-200 group-hover:scale-105">
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#F43F5E] animate-pulse shrink-0" />
                        <span className="font-tagline text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-rose-300 drop-shadow-sm whitespace-nowrap">
                          Coming Soon
                        </span>
                        <Sparkles className="h-3 w-3 text-emerald-300 shrink-0" />
                      </div>
                    </div>

                    <span className="absolute bottom-2 left-2.5 right-2.5 truncate font-tagline text-xs sm:text-sm font-bold text-[#F0F8FF] drop-shadow-sm">
                      {cat.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-[#092136] border-t border-sky-400/20">
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-300 truncate max-w-[105px]">
                      {cat.badge}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider shrink-0 ${
                        isSelected
                          ? 'bg-[#E11D48] text-white font-bold shadow-xs'
                          : 'bg-rose-500/15 border border-rose-400/40 text-rose-300'
                      }`}
                    >
                      {isSelected ? 'Active ✓' : 'Coming Soon ✦'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* PRECISION FILTERS & COMMAND BAR */}
          <div className="relative z-10 mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-sky-400/25 bg-[#0A243A] p-4 sm:p-6 shadow-[0_10px_28px_rgba(2,12,24,0.45)] space-y-4">
            {/* Top Toolbar: Search + Sort */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search in Acquario Tropicale */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tropical fish, rimless tanks, aquatic plants, filters..."
                  className="w-full rounded-xl border border-sky-400/28 bg-[#051524] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#F0F8FF] placeholder-[#7FAEC9]/70 outline-none transition focus:border-emerald-400"
                />
              </div>

              {/* Sort + Count */}
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-xs font-bold text-emerald-300">
                  {filteredProducts.length} Tropical Specimens
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-sky-400/28 bg-[#051524] px-3 py-2 text-xs font-bold text-[#F0F8FF] outline-none focus:border-emerald-400 cursor-pointer [&>option]:bg-[#081D30] [&>option]:text-[#F0F8FF]"
                >
                  <option value="featured">Featured Specimens</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Category Pills Rail (Aquarium Only) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-1 -mx-1 px-1">
              {aquaticCategoryPills.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#E11D48] text-white border border-rose-400/60 shadow-[0_4px_14px_rgba(225,29,72,0.35)] font-black'
                        : 'border border-sky-400/25 bg-[#051524] text-[#B6D4E8] hover:border-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    {cat === 'All' ? 'All Aquatic Drops' : cat}
                  </button>
                )
              })}
            </div>

            {/* Badge Tag Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <Filter className="h-3 w-3 text-emerald-400" />
                <span>Filter:</span>
              </span>
              {AQUARIUM_BADGE_FILTERS.map((badge) => {
                const isSelected = activeBadge === badge
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => setActiveBadge(badge)}
                    className={`rounded-full px-2.5 py-0.5 font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#E11D48] text-white border border-rose-400/60 font-bold shadow-xs'
                        : 'bg-[#051524] text-[#B6D4E8] border border-sky-400/25 hover:border-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    {badge}
                  </button>
                )
              })}
            </div>
          </div>

          {/* AQUARIUM PRODUCT GRID */}
          <div className="relative z-10 mt-8 sm:mt-10">
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isComingSoon={true}
                    isWishlisted={isWishlisted(product.id ?? product._id)}
                    onWishlistToggle={() => toggleWishlist(product.id ?? product._id)}
                    onAddToCart={() => {
                      addToCart(product, 1)
                      setIsCartOpen(true)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-sky-400/25 bg-[#0A243A] p-10 text-center space-y-3 shadow-xs">
                <Fish className="h-10 w-10 text-emerald-400 mx-auto opacity-85" />
                <h3 className="font-tagline text-xl font-bold text-[#F0F8FF]">
                  No Aquatic Specimens Found
                </h3>
                <p className="text-xs text-[#B6D4E8] max-w-sm mx-auto">
                  Try clearing your search terms or filter tags to discover more tropical wonders.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All')
                    setActiveBadge('All')
                    setSearchTerm('')
                  }}
                  className="rounded-full bg-[#E11D48] text-white px-5 py-2 text-xs font-bold hover:bg-[#F43F5E] transition cursor-pointer shadow-xs"
                >
                  Reset Aquatic Filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > visibleCount && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400/55 bg-gradient-to-r from-[#E11D48] to-[#F43F5E] px-6 py-3 text-xs font-bold text-white hover:brightness-110 shadow-[0_6px_20px_rgba(225,29,72,0.35)] transition cursor-pointer"
                >
                  <span>Load More Aquatic Specimens</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* DIRECT WHATSAPP & EMAIL AQUARIST CONCIERGE BANNER */}
          <div className="relative z-10 mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl border border-emerald-400/30 bg-gradient-to-r from-[#082034] via-[#0B2B44] to-[#0E3652] p-5 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-md">
            <div className="flex items-center gap-4 text-center md:text-left">
              <span className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-emerald-500/15 border border-emerald-400/45 text-emerald-300 shrink-0 shadow-xs">
                <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-400" />
              </span>
              <div>
                <h4 className="font-tagline text-base sm:text-lg font-bold text-[#F0F8FF]">
                  Need Custom Aquascaping or Live Fish Video Selection?
                </h4>
                <p className="text-xs text-[#B6D4E8] mt-0.5">
                  Connect directly with our master aquarist on WhatsApp or email{' '}
                  <a
                    href={`mailto:${AQUATIC_CONTACT_EMAIL}`}
                    className="font-semibold text-emerald-300 underline decoration-emerald-400/50 underline-offset-2 hover:text-white transition"
                  >
                    {AQUATIC_CONTACT_EMAIL}
                  </a>{' '}
                  for live video acclimation proof and custom tank dimensions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full lg:w-auto">
              <a
                href="https://wa.me/919341297124?text=Hi%20Acquario%20Tropicale%2C%20I%20want%20to%20inquire%20about%20Acquario%20Tropicale%20fish%20and%20aquariums!"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 border border-emerald-400/50 text-white hover:bg-emerald-500 px-5 py-3 text-xs font-bold shadow-[0_6px_18px_rgba(16,185,129,0.35)] transition shrink-0 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>WhatsApp Aquarist (+91 93412 97124)</span>
              </a>
              <a
                href={`mailto:${AQUATIC_CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-400/45 bg-[#051524] text-[#F0F8FF] hover:border-emerald-400 hover:text-emerald-300 px-5 py-3 text-xs font-bold shadow-xs transition shrink-0 cursor-pointer"
              >
                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                <span>{AQUATIC_CONTACT_EMAIL}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

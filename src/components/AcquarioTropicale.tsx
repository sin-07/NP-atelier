"use client"

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Fish,
  Waves,
  ShieldCheck,
  Sparkles,
  Droplets,
  Search,
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
import { fallbackCraftImage } from '../utils/fallbackImage'

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
    const query = searchTerm.trim().toLowerCase()

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
  }, [allAquariumProducts, activeCategory, activeBadge, searchTerm, sortBy])

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, visibleCount])

  return (
    <section
      id="acquario-tropicale"
      className="relative scroll-mt-24 py-12 sm:py-20 bg-[#FAF8F5]"
    >
      {/* Anchor for backwards compatibility */}
      <div id="aquarium" className="relative -top-28 pointer-events-none" />

      <div className="section-shell">
        {/* Main Royal Shell Card */}
        <div className="relative rounded-[2.5rem] sm:rounded-[3.2rem] border border-[#D4AF37]/40 bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#F5FAFA] p-5 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(20,18,12,0.06),0_0_1px_1px_rgba(212,175,55,0.25)] text-[#141414] overflow-hidden">
          {/* Subtle Ambient Radiance Highlights */}
          <div className="pointer-events-none absolute -top-28 -right-28 h-96 w-96 rounded-full bg-teal-100/50 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/4 h-80 w-80 rounded-full bg-[#FAF0D4]/70 blur-[140px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-100/40 blur-[130px]" />

          {/* SECTION HEADER */}
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-white/95 px-4 py-1.5 text-[11px] font-bold text-[#0D656E] shadow-xs mb-4">
              <Fish className="h-3.5 w-3.5 text-teal-600" />
              <span className="uppercase tracking-[0.22em]">Acquario Tropicale • Living Waters</span>
            </div>

            {/* Haute Title */}
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141414] leading-[1.15]">
              Acquario{' '}
              <span className="italic font-normal text-gold-gradient font-serif">
                Tropicale
              </span>
            </h2>

            {/* Lead Description */}
            <p className="mt-4 text-xs sm:text-base text-[#524B40] leading-relaxed max-w-2xl mx-auto font-medium">
              A curated world exclusively for tropical aquatic wonders. Captive-bred centerpiece Discus &amp; Show Bettas, ultra-clear low-iron rimless nature aquariums, lush living flora, and professional aquascaping gear.
            </p>

            {/* 4 Certified Aquatic Trust Badges */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10.5px] sm:text-xs font-bold text-[#3B2A08]">
              <div className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/45 bg-white/95 px-3.5 py-1.5 shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>100% Live Arrival Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/45 bg-white/95 px-3.5 py-1.5 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#B8860B] shrink-0" />
                <span>Optiwhite Low-Iron Glass</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/45 bg-white/95 px-3.5 py-1.5 shadow-xs">
                <Package className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Temp-Controlled Oxygen Crating</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/45 bg-white/95 px-3.5 py-1.5 shadow-xs">
                <Droplets className="h-3.5 w-3.5 text-teal-600 shrink-0" />
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
                      ? 'border-teal-500 ring-2 ring-teal-500/40 shadow-[0_8px_24px_rgba(13,148,136,0.18)] bg-teal-50/70'
                      : 'border-[#E8DEC7] bg-white hover:border-teal-500 hover:shadow-md'
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2EDE4]">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      onError={(e) => {
                        e.currentTarget.src = fallbackCraftImage
                      }}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2.5 right-2.5 truncate font-serif text-xs sm:text-sm font-bold text-white drop-shadow-sm">
                      {cat.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white border-t border-[#F0EBE1]">
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#0F766E] truncate max-w-[120px]">
                      {cat.badge}
                    </span>
                    <span className="text-[10px] text-[#B8860B] font-bold shrink-0">
                      {isSelected ? 'Active ✓' : 'Explore →'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* PRECISION FILTERS & COMMAND BAR */}
          <div className="relative z-10 mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-[#E8DEC7] bg-white/95 p-4 sm:p-6 shadow-[0_4px_20px_rgba(20,18,12,0.03)] space-y-4">
            {/* Top Toolbar: Search + Sort */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search in Acquario Tropicale */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tropical fish, rimless tanks, aquatic plants, filters..."
                  className="w-full rounded-xl border border-[#D8CBB2] bg-[#FAF8F5] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#141414] placeholder-[#8A7960] outline-none transition focus:border-teal-600 focus:bg-white"
                />
              </div>

              {/* Sort + Count */}
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-xs font-bold text-[#0D656E]">
                  {filteredProducts.length} Tropical Specimens
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-[#D8CBB2] bg-[#FAF8F5] px-3 py-2 text-xs font-bold text-[#3B2A08] outline-none focus:border-teal-600 cursor-pointer"
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
                        ? 'bg-[#141414] text-[#ECC872] shadow-xs font-black'
                        : 'border border-[#E8DEC7] bg-[#FAF8F5] text-[#5C5242] hover:border-teal-500 hover:text-[#141414]'
                    }`}
                  >
                    {cat === 'All' ? 'All Aquatic Drops' : cat}
                  </button>
                )
              })}
            </div>

            {/* Badge Tag Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-[#7A6A53] font-bold flex items-center gap-1">
                <Filter className="h-3 w-3 text-teal-600" />
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
                        ? 'bg-teal-100 text-teal-900 border border-teal-400 font-bold'
                        : 'bg-[#FAF8F5] text-[#6E6455] border border-[#E8DEC7] hover:border-teal-400 hover:text-[#141414]'
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
              <div className="rounded-3xl border border-[#E8DEC7] bg-white p-10 text-center space-y-3 shadow-xs">
                <Fish className="h-10 w-10 text-teal-600 mx-auto opacity-70" />
                <h3 className="font-serif text-lg font-bold text-[#141414]">
                  No Aquatic Specimens Found
                </h3>
                <p className="text-xs text-[#665D4F] max-w-sm mx-auto">
                  Try clearing your search terms or filter tags to discover more tropical wonders.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All')
                    setActiveBadge('All')
                    setSearchTerm('')
                  }}
                  className="rounded-full bg-[#141414] text-[#ECC872] px-5 py-2 text-xs font-bold hover:bg-[#251D0B] transition cursor-pointer shadow-xs"
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
                  className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white px-6 py-3 text-xs font-bold text-[#4D3605] hover:bg-[#FAF5E8] hover:border-[#D4AF37] shadow-xs transition cursor-pointer"
                >
                  <span>Load More Aquatic Specimens</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* DIRECT WHATSAPP AQUARIST CONCIERGE BANNER */}
          <div className="relative z-10 mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl border border-teal-200 bg-gradient-to-r from-[#F0FDF4] via-[#F0FDFA] to-[#FAF8F5] p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
            <div className="flex items-center gap-4 text-center md:text-left">
              <span className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 shrink-0 shadow-xs">
                <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
              </span>
              <div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#141414]">
                  Need Custom Aquascaping or Live Fish Video Selection?
                </h4>
                <p className="text-xs text-[#524B40] mt-0.5">
                  Connect directly with our master aquarist on WhatsApp. We provide live video acclimation proof and custom tank dimensions.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20want%20to%20inquire%20about%20Acquario%20Tropicale%20fish%20and%20aquariums!"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs font-bold shadow-xs transition shrink-0 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Aquarist (+91 93412 97124)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

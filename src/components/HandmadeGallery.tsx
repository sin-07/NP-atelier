"use client"

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Droplets,
  Fish,
  Grid2X2,
  Heart,
  Info,
  LayoutGrid,
  Minus,
  Package,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Waves,
  X,
} from 'lucide-react'
import ProductCard from './ProductCard'
import {
  aquariumCategories,
  aquariumCategoryGroups,
  craftCategories,
  categoryGroups,
  inspirationTiles,
  Product,
} from '../data/products'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage } from '../utils/fallbackImage'

const BADGE_TAGS = [
  'All',
  'Live Arrival Guarantee',
  'Captive Bred',
  'Trending',
  'New',
  'Optiwhite Glass',
  'Under ₹1,500',
]

const MAKER_ARTICLES = [
  {
    title: 'The Aquascaper’s Blueprint: Crafting a High-Clarity Planted Nature Aquarium',
    date: 'February 14, 2026',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=700&q=80',
    category: 'Aquascaping Masterclass',
  },
  {
    title: '10 Easy DIY Craft Ideas to Elevate Your Home Sanctuary',
    date: 'January 18, 2026',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80',
    category: 'DIY Home Decor',
  },
  {
    title: 'The Art of Botanical UV Resin & Floral Preservation',
    date: 'May 12, 2026',
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=700&q=80',
    category: 'Resin Art Studio',
  },
]

export default function HandmadeGallery() {
  const { ref, isVisible } = useRevealOnScroll()
  const {
    products,
    branding,
    activeDepartment,
    setActiveDepartment,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
    addReview,
  } = useMarketplace()

  const [activeCategory, setActiveCategory] = useState('All')
  const [activeBadge, setActiveBadge] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [layoutMode, setLayoutMode] = useState('grid')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewQuantity, setQuickViewQuantity] = useState(1)
  const [activeQuickTab, setActiveQuickTab] = useState('details')

  // Review Form in Quick View
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  // Determine which showcase cards to show based on department
  const currentCategoryGroups = useMemo(() => {
    if (activeDepartment === 'aquarium') {
      return aquariumCategoryGroups
    }
    if (activeDepartment === 'crafts') {
      return categoryGroups
    }
    // Mixed: show 2 aquatic + 2 craft
    return [
      aquariumCategoryGroups[0],
      categoryGroups[0],
      aquariumCategoryGroups[2],
      categoryGroups[1],
    ]
  }, [activeDepartment])

  // Dynamic Category Pills based on active department
  const categoryPills = useMemo(() => {
    if (activeDepartment === 'aquarium') {
      return ['All Aquatics', ...aquariumCategories]
    }
    if (activeDepartment === 'crafts') {
      return ['All Crafts', ...craftCategories]
    }
    return [
      'All',
      'Live Freshwater Fish',
      'Marine & Saltwater Fish',
      'Aquariums & Nano Tanks',
      'Handmade Jewelry',
      'DIY Home Decor & Crafts',
      'Beauty DIY Products',
      'Cute Handmade Accessories',
    ]
  }, [activeDepartment])

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    let result = products.filter((product: Product) => {
      // Department filter
      if (activeDepartment === 'aquarium') {
        const isAqua =
          product.department === 'aquarium' ||
          aquariumCategories.includes(product.category)
        if (!isAqua) return false
      } else if (activeDepartment === 'crafts') {
        const isCraft =
          product.department === 'crafts' ||
          craftCategories.includes(product.category) ||
          (!product.department && !aquariumCategories.includes(product.category))
        if (!isCraft) return false
      }

      // Category filter
      let matchesCategory = true
      if (activeCategory !== 'All' && activeCategory !== 'All Aquatics' && activeCategory !== 'All Crafts') {
        matchesCategory = product.category === activeCategory
      }

      // Badge / Tag filter
      let matchesBadge = true
      if (activeBadge.startsWith('Under')) {
        const priceNum = Number.parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0
        matchesBadge = priceNum <= 1500
      } else if (activeBadge !== 'All') {
        matchesBadge = (product.badges || []).some(
          (b) => b.toLowerCase() === activeBadge.toLowerCase()
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
      result.sort((a: Product, b: Product) => {
        const pA = Number.parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0
        const pB = Number.parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0
        return pA - pB
      })
    } else if (sortBy === 'price-desc') {
      result.sort((a: Product, b: Product) => {
        const pA = Number.parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0
        const pB = Number.parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0
        return pB - pA
      })
    } else if (sortBy === 'rating') {
      result.sort((a: Product, b: Product) => (b.rating || 4.8) - (a.rating || 4.8))
    }

    return result
  }, [activeDepartment, activeCategory, activeBadge, products, searchTerm, sortBy])

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickViewProduct || !reviewName.trim()) return

    addReview(quickViewProduct.id, {
      name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    })

    setReviewName('')
    setReviewComment('')
    setReviewRating(5)
  }

  return (
    <section id="collection" ref={ref} className={`section-shell py-16 sm:py-24 ${isVisible ? 'is-visible' : ''}`}>
      <div className="reveal is-visible space-y-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="section-eyebrow mb-3.5">
            <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>Curated Marketplace & Living Waters</span>
          </div>
          <h2 className="heading-1">
            Artisan Drops & <span className="italic font-normal text-gold-gradient">Aquatic Wonders</span>
          </h2>
          <p className="body-lead mx-auto mt-4 max-w-2xl text-[#4A4339]">
            Explore handcrafted jewelry, aromatherapy soy candles, and bespoke creations alongside exotic captive-bred fish, ultra-clear low-iron aquariums, and living aquascapes.
          </p>

          {/* Department Switcher Tabs (All | Crafts | Fish & Aquarium) */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white/95 p-1.5 shadow-[0_6px_20px_rgba(184,134,11,0.12)]">
              <button
                type="button"
                onClick={() => {
                  setActiveDepartment?.('all')
                  setActiveCategory('All')
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition duration-200 ${
                  activeDepartment === 'all'
                    ? 'bg-[#141414] text-[#ECC872] shadow-sm'
                    : 'text-[#5A554E] hover:text-[#141414] hover:bg-[#FAF6ED]'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>All Departments</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveDepartment?.('crafts')
                  setActiveCategory('All Crafts')
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition duration-200 ${
                  activeDepartment === 'crafts'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] shadow-[0_2px_10px_rgba(212,175,55,0.35)]'
                    : 'text-[#5A554E] hover:text-[#141414] hover:bg-[#FAF6ED]'
                }`}
              >
                <span>Handmade Crafts</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveDepartment?.('aquarium')
                  setActiveCategory('All Aquatics')
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition duration-200 ${
                  activeDepartment === 'aquarium'
                    ? 'bg-gradient-to-r from-[#008080] via-[#0F52BA] to-[#008080] text-white shadow-[0_4px_16px_rgba(15,82,186,0.35)]'
                    : 'text-[#5A554E] hover:text-[#141414] hover:bg-[#FAF6ED]'
                }`}
              >
                <Fish className="h-4 w-4 text-cyan-300" />
                <span>Living Aquatics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Category Showcase Cards */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
          {currentCategoryGroups.map((cat) => {
            const isSelected = activeCategory === cat.title
            return (
              <button
                key={cat.title}
                type="button"
                onClick={() => {
                  setActiveCategory(isSelected ? 'All' : cat.title)
                }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition duration-300 ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-[0_8px_24px_rgba(184,134,11,0.18)] bg-gradient-to-b from-[#FFFDF8] via-[#FAF4E5] to-[#F5E8C4]'
                    : 'border-[#D4AF37]/45 bg-gradient-to-b from-white via-[#FCF8EE] to-[#FAF3DE] hover:border-[#D4AF37] hover:shadow-[0_8px_24px_rgba(184,134,11,0.14)]'
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF6EC]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    onError={(e) => {
                      e.currentTarget.src = fallbackCraftImage
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 right-2.5 truncate font-serif text-xs sm:text-sm font-bold text-white">
                    {cat.title}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-b from-white to-[#FAF6ED]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5408] truncate max-w-[120px]">
                    {cat.badge}
                  </span>
                  <span className="text-[10px] text-[#141414] font-bold shrink-0">
                    {isSelected ? 'Selected ✓' : 'Browse →'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Filter Toolbar */}
        <div className="glass-card space-y-5 p-5 sm:p-6 border border-[#D4AF37]/50 bg-gradient-to-b from-white via-[#FAF5E8] to-[#F7ECCF]/80 shadow-[0_12px_36px_rgba(184,134,11,0.10),0_0_15px_rgba(212,175,55,0.10)]">
          {/* Search + Category Tabs */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9E7314]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search fish, aquariums, plants, candles, jewelry..."
                className="h-12 w-full rounded-full border border-[#E2D2AD] bg-[#FCFBF8] pl-11 pr-4 text-xs text-[#141414] outline-none transition placeholder:text-[#8C827A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 focus:bg-white sm:text-sm font-medium shadow-xs"
              />
            </div>

            {/* Dynamic Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categoryPills.map((cat) => {
                const isActive =
                  activeCategory === cat ||
                  (cat === 'All Aquatics' && activeCategory === 'All Aquatics') ||
                  (cat === 'All Crafts' && activeCategory === 'All Crafts') ||
                  (cat === 'All' && activeCategory === 'All')
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition duration-200 ${
                      isActive
                        ? 'bg-[#141414] border border-[#D4AF37]/70 text-[#ECC872] shadow-sm'
                        : 'border border-[#E2D2AD] bg-white text-[#4A3810] hover:border-[#D4AF37] hover:bg-[#FAF4E5]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Secondary Filter Row: Badge Chips + Sort + Layout Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E8DEC7] pt-4 text-xs">
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[#694806]">Filter by:</span>
              {BADGE_TAGS.map((tag) => {
                const isSelected = activeBadge === tag
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveBadge(tag)}
                    className={`rounded-full px-3 py-1 font-bold transition ${
                      isSelected
                        ? 'bg-[#141414] border border-[#D4AF37]/70 text-[#ECC872] shadow-sm'
                        : 'border border-[#E2D2AD] bg-[#FAF8F2] text-[#695222] hover:border-[#D4AF37] hover:bg-[#F6ECDA]'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>

            {/* Controls: Sort Dropdown & Layout Grid Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#5A554E]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-[#DDD7CE] bg-white px-3 py-1.5 font-bold text-[#141414] outline-none focus:border-[#141414] shadow-sm"
                >
                  <option value="featured">Featured Drops</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Grid / Masonry Toggle */}
              <div className="flex items-center rounded-full border border-[#DDD7CE] bg-white p-1 shadow-sm">
                <button
                  type="button"
                  title="Grid View"
                  onClick={() => setLayoutMode('grid')}
                  className={`grid h-7 w-7 place-items-center rounded-full transition ${
                    layoutMode === 'grid' ? 'bg-[#141414] text-white font-bold shadow-sm' : 'text-[#5A554E] hover:text-[#141414]'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Compact View"
                  onClick={() => setLayoutMode('masonry')}
                  className={`grid h-7 w-7 place-items-center rounded-full transition ${
                    layoutMode === 'masonry' ? 'bg-[#141414] text-white font-bold shadow-sm' : 'text-[#5A554E] hover:text-[#141414]'
                  }`}
                >
                  <Grid2X2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Display */}
        {filteredProducts.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
            <Package className="h-12 w-12 text-[#8C827A]" />
            <h3 className="mt-4 font-serif text-2xl font-bold text-[#141414]">No Items Found</h3>
            <p className="mt-2 text-sm text-[#5A554E]">
              Try adjusting your category or filter selection.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveDepartment?.('all')
                setActiveCategory('All')
                setActiveBadge('All')
                setSearchTerm('')
              }}
              className="btn-primary mt-6 text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              layoutMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            }`}
          >
            {filteredProducts.map((prod: Product) => (
              <ProductCard
                key={prod.id}
                product={prod}
                isWishlisted={isWishlisted(prod.id)}
                onWishlistToggle={() => toggleWishlist(prod.id)}
                onQuickView={() => {
                  setQuickViewProduct(prod)
                  setQuickViewQuantity(1)
                  setActiveQuickTab('details')
                }}
                onAddToCart={(p, qty) => addToCart(p, qty)}
                onBuyNow={(p) => {
                  addToCart(p, 1)
                  setIsCartOpen(true)
                }}
              />
            ))}
          </div>
        )}

        {/* INSPIRATION & JOURNALS */}
        <section id="inspiration" className="glass-card overflow-hidden p-6 sm:p-10 lg:p-12 border border-[#DFCFA6]/60 bg-gradient-to-b from-white via-[#FCF9F1] to-[#FAF4E5]">
          <div className="text-center max-w-2xl mx-auto">
            <span className="section-eyebrow">
              <BookOpen className="h-3.5 w-3.5 text-[#141414]" /> Maker & Aquarist Journals
            </span>
            <h3 className="mt-3 text-3xl sm:text-4xl text-[#141414] font-serif font-bold tracking-tight">
              Inspiration for Every Creator & Aquarist
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#5A554E]">
              Explore tactile textures, nature aquascaping guides, and artisanal craft tutorials from our creative collective.
            </p>
          </div>

          {/* 3 Editorial Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MAKER_ARTICLES.map((article, i) => (
              <div
                key={i}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#DFCFA6]/60 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]/80 p-4 transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#D4AF37]/80 hover:shadow-[0_12px_32px_rgba(180,135,45,0.10)]"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#EFECE6]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#141414] shadow-sm">
                      {article.category}
                    </span>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C827A]">
                      {article.date}
                    </p>
                    <h4 className="font-serif text-lg font-bold leading-snug text-[#141414] transition group-hover:text-[#5A554E]">
                      {article.title}
                    </h4>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1 group-hover:underline">
                    Read Journal <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tactile Studio Moodboard preview tiles */}
          <div className="mt-8 pt-8 border-t border-[#EAE5DC]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8C827A] text-center mb-4">
              Tactile Studio & Living Water Moodboard
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {inspirationTiles.slice(0, 6).map((tile) => (
                <div
                  key={tile.title}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-[#E5E0D8] bg-[#F6F3EE]"
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackCraftImage
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <span className="text-[10px] font-bold text-white truncate">{tile.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Expanded Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct ? (
          <motion.div
            key="quick-view-modal-backdrop"
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              key="quick-view-modal-card"
              className="relative my-8 w-full max-w-3xl overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F7F1E1] border border-[#DFCFA6]/70 shadow-[0_25px_60px_rgba(180,135,45,0.18)]"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close quick view"
                onClick={() => setQuickViewProduct(null)}
                className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#DDD7CE] bg-white text-[#141414] shadow-sm transition hover:bg-[#F3EFE8]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                {/* Product Image Side */}
                <div className="relative min-h-[300px] bg-[#F6F3EE] lg:min-h-[500px]">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.title}
                    onError={(e) => {
                      e.currentTarget.src = fallbackCraftImage
                    }}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                    {(quickViewProduct.badges || ['Handmade']).map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#141414] shadow-sm"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Stock status badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white shadow-md">
                      ● {quickViewProduct.stock ?? 20} in stock
                    </span>
                  </div>
                </div>

                {/* Details & Interactive Tabs */}
                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C827A]">
                        {quickViewProduct.category}
                      </span>
                      {quickViewProduct.department === 'aquarium' && (
                        <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[9px] font-bold text-cyan-800">
                          Aquatic Specimen
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 font-serif text-2xl font-bold text-[#141414] sm:text-3xl">
                      {quickViewProduct.title}
                    </h3>

                    <div className="mt-3 flex items-center justify-between border-b border-[#EAE5DC] pb-4">
                      <div>
                        <span className="text-2xl font-extrabold text-[#141414]">
                          {quickViewProduct.price}
                        </span>
                        <span className="ml-2 text-xs text-[#8C827A]">Free shipping over ₹1,499</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#141414] text-[#141414]" />
                        <span className="text-sm font-bold text-[#141414]">
                          {quickViewProduct.rating ?? '4.9'}
                        </span>
                        <span className="text-xs text-[#8C827A]">({quickViewProduct.reviews ?? 48})</span>
                      </div>
                    </div>

                    {/* Quick Tabs */}
                    <div className="mt-4 flex border-b border-[#EAE5DC]">
                      {[
                        { id: 'details', label: 'Story & Description' },
                        quickViewProduct.aquaticSpecs
                          ? { id: 'specs', label: 'Aquatic Parameters' }
                          : { id: 'materials', label: 'Materials' },
                        { id: 'reviews', label: 'Customer Reviews' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveQuickTab(tab.id)}
                          className={`border-b-2 px-3 sm:px-4 py-2 text-xs font-bold transition ${
                            activeQuickTab === tab.id
                              ? 'border-[#141414] text-[#141414]'
                              : 'border-transparent text-[#8C827A] hover:text-[#141414]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4 min-h-[140px] text-xs leading-relaxed text-[#4A4339]">
                      {activeQuickTab === 'details' && (
                        <div className="space-y-3">
                          <p>{quickViewProduct.description}</p>
                          {quickViewProduct.department === 'aquarium' && (
                            <div className="flex items-center gap-2 rounded-xl bg-cyan-50 border border-cyan-200 p-2.5 text-cyan-900 font-semibold">
                              <ShieldCheck className="h-4 w-4 text-cyan-700 shrink-0" />
                              <span>Live Arrival Guarantee: Oxygenated bagging + climate controlled thermal transit pack.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activeQuickTab === 'specs' && quickViewProduct.aquaticSpecs && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {quickViewProduct.aquaticSpecs.waterType && (
                            <div className="rounded-xl bg-white/80 border border-[#E5E0D8] p-2.5">
                              <span className="text-[10px] font-bold text-[#8C827A] uppercase block">Water Type</span>
                              <span className="font-bold text-[#141414]">{quickViewProduct.aquaticSpecs.waterType}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.careLevel && (
                            <div className="rounded-xl bg-white/80 border border-[#E5E0D8] p-2.5">
                              <span className="text-[10px] font-bold text-[#8C827A] uppercase block">Care Level</span>
                              <span className="font-bold text-[#141414]">{quickViewProduct.aquaticSpecs.careLevel}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.temperament && (
                            <div className="rounded-xl bg-white/80 border border-[#E5E0D8] p-2.5">
                              <span className="text-[10px] font-bold text-[#8C827A] uppercase block">Temperament</span>
                              <span className="font-bold text-[#141414]">{quickViewProduct.aquaticSpecs.temperament}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.tankSize && (
                            <div className="rounded-xl bg-white/80 border border-[#E5E0D8] p-2.5">
                              <span className="text-[10px] font-bold text-[#8C827A] uppercase block">Minimum Tank</span>
                              <span className="font-bold text-[#141414]">{quickViewProduct.aquaticSpecs.tankSize}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.diet && (
                            <div className="col-span-2 rounded-xl bg-white/80 border border-[#E5E0D8] p-2.5">
                              <span className="text-[10px] font-bold text-[#8C827A] uppercase block">Diet / Nutrition</span>
                              <span className="font-bold text-[#141414]">{quickViewProduct.aquaticSpecs.diet}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.dimensions && (
                            <div className="col-span-2 rounded-xl bg-white/80 border border-[#E5E0D8] p-2.5">
                              <span className="text-[10px] font-bold text-[#8C827A] uppercase block">Dimensions / Flow</span>
                              <span className="font-bold text-[#141414]">{quickViewProduct.aquaticSpecs.dimensions}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activeQuickTab === 'materials' && (
                        <ul className="space-y-1.5 list-disc pl-4 text-xs">
                          <li>Handcrafted with studio-grade natural resins, organic soy waxes, and pure silk threads.</li>
                          <li>100% genuine pressed wild botanicals sealed with crystal clarity.</li>
                          <li>Recyclable, plastic-free boutique packaging and personalized gift notes.</li>
                        </ul>
                      )}

                      {activeQuickTab === 'reviews' && (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#141414]">Verified Buyer</span>
                              <div className="flex text-[#D4AF37]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-[#D4AF37]" />
                                ))}
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-[#5A554E]">
                              "Outstanding quality. Exceeded expectations in every detail!"
                            </p>
                          </div>

                          {/* Post Review Form */}
                          <form onSubmit={handlePostReview} className="space-y-2 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-3">
                            <p className="text-xs font-bold text-[#141414]">Leave a Review</p>
                            <div className="flex gap-2">
                              <input
                                required
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder="Your Name"
                                className="h-8 flex-1 rounded-lg border border-[#DDD7CE] bg-white px-2.5 text-xs text-[#141414] outline-none focus:border-[#141414]"
                              />
                              <select
                                value={reviewRating}
                                onChange={(e) => setReviewRating(Number(e.target.value))}
                                className="h-8 rounded-lg border border-[#DDD7CE] bg-white px-2 text-xs text-[#141414] outline-none focus:border-[#141414]"
                              >
                                <option value={5}>5 Stars (Excellent)</option>
                                <option value={4}>4 Stars (Very Good)</option>
                                <option value={3}>3 Stars (Average)</option>
                              </select>
                            </div>
                            <input
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Write your review notes..."
                              className="h-8 w-full rounded-lg border border-[#DDD7CE] bg-white px-2.5 text-xs text-[#141414] outline-none focus:border-[#141414]"
                            />
                            <button
                              type="submit"
                              className="rounded-lg bg-[#141414] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#2C2C2C] shadow-sm"
                            >
                              Submit Review
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & CTAs */}
                  <div className="mt-6 border-t border-[#EAE5DC] pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-[#DDD7CE] bg-white px-3 py-1.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => setQuickViewQuantity((q) => Math.max(1, q - 1))}
                          className="grid h-6 w-6 place-items-center rounded-full bg-[#EFECE6] text-[#141414] transition hover:bg-[#DDD7CE]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold text-[#141414]">
                          {quickViewQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuickViewQuantity((q) => q + 1)}
                          className="grid h-6 w-6 place-items-center rounded-full bg-[#EFECE6] text-[#141414] transition hover:bg-[#DDD7CE]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart(quickViewProduct, quickViewQuantity)
                          setQuickViewProduct(null)
                        }}
                        className="btn-primary flex-1 py-3 text-xs justify-center"
                      >
                        Add {quickViewQuantity} to Bag
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(quickViewProduct.id)}
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#DDD7CE] bg-white text-[#141414] transition ${
                          isWishlisted(quickViewProduct.id)
                            ? 'border-rose-400 bg-rose-50 text-rose-500'
                            : 'hover:border-[#141414]'
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isWishlisted(quickViewProduct.id) ? 'fill-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

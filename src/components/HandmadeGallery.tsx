"use client"

import { useMemo, useState, useRef, useEffect, useCallback, useDeferredValue } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Fish,
  Grid2X2,
  Heart,
  Info,
  LayoutGrid,
  Minus,
  MessageCircle,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Waves,
  X,
} from 'lucide-react'
import ProductCard from './ProductCard'
import { AtelierScriptText } from './BrandTypography'
import {
  aquariumCategories,
  aquariumCategoryGroups,
  craftCategories,
  categoryGroups,
  inspirationTiles,
  Product,
} from '../data/products'
import { useGsapReveal } from '../hooks/useGsapReveal'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { buildSingleProductWhatsAppMessage, sendWhatsAppOrder } from '../utils/whatsappOrder'
import { lockScroll, unlockScroll } from '../utils/scrollLock'

const BADGE_TAGS = [
  'All',
  'Trending',
  'New',
  'Atelier Signature',
  'Handmade',
  'Best Seller',
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
  const { containerRef } = useGsapReveal({
    selector: '.gsap-gallery-section',
    stagger: 0.035,
    yOffset: 12,
    duration: 0.35,
  })
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
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [layoutMode, setLayoutMode] = useState('grid')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewQuantity, setQuickViewQuantity] = useState(1)
  const [activeQuickTab, setActiveQuickTab] = useState('details')

  const handleQuickViewWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!quickViewProduct) return
    const contactPhone = branding?.contactPhone || '919341297124'
    const waMessage = buildSingleProductWhatsAppMessage({
      title: quickViewProduct.title,
      price: quickViewProduct.price,
      quantity: quickViewQuantity,
      category: quickViewProduct.category,
      department: quickViewProduct.department,
      image: quickViewProduct.image,
      description: quickViewProduct.description,
    })
    sendWhatsAppOrder({
      phone: contactPhone,
      message: waMessage,
      imageUrl: quickViewProduct.image,
      imageFilename: `${(quickViewProduct.title || 'product').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`,
    })
  }

  // Smart Pagination & Load More States to prevent endless scrolling fatigue
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number | 'all'>(12)
  const [visibleCount, setVisibleCount] = useState(12)

  // Reset pagination whenever filters or search terms change
  useEffect(() => {
    setCurrentPage(1)
    setVisibleCount(12)
  }, [activeDepartment, activeCategory, activeBadge, searchTerm, sortBy])

  const hasActiveFilters =
    (activeCategory !== 'All' && activeCategory !== 'All Aquatics' && activeCategory !== 'All Crafts') ||
    activeBadge !== 'All' ||
    searchTerm.trim().length > 0

  const activeFilterCount =
    (activeCategory !== 'All' && activeCategory !== 'All Aquatics' && activeCategory !== 'All Crafts' ? 1 : 0) +
    (activeBadge !== 'All' ? 1 : 0) +
    (searchTerm.trim().length > 0 ? 1 : 0)

  const handleResetFilters = () => {
    setActiveCategory(
      activeDepartment === 'aquarium'
        ? 'All Aquatics'
        : activeDepartment === 'crafts'
        ? 'All Crafts'
        : 'All'
    )
    setActiveBadge('All')
    setSearchTerm('')
    setCurrentPage(1)
    setVisibleCount(12)
  }

  // Review Form in Quick View
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  // Prevent background page double-scrolling when Quick View is open
  useEffect(() => {
    if (quickViewProduct) {
      lockScroll()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setQuickViewProduct(null)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        unlockScroll()
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [quickViewProduct])

  // Determine which showcase cards to show based strictly on crafts
  const currentCategoryGroups = useMemo(() => {
    return categoryGroups
  }, [])

  // Dynamic Category Pills based exclusively on craft categories
  const categoryPills = useMemo(() => {
    const dynamicCrafts = Array.from(
      new Set([
        ...craftCategories,
        ...products
          .filter(
            (p: Product) =>
              p.department === 'crafts' ||
              (!p.department && !aquariumCategories.includes(p.category))
          )
          .map((p: Product) => p.category)
          .filter(Boolean),
      ])
    )
    return ['All Crafts', ...dynamicCrafts]
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase()

    let result = products.filter((product: Product) => {
      // Exclude ALL aquarium items - Crafts section ONLY
      const isAquarium =
        product.department === 'aquarium' ||
        aquariumCategories.includes(product.category)
      if (isAquarium) return false

      // Category filter
      let matchesCategory = true
      if (activeCategory !== 'All' && activeCategory !== 'All Crafts') {
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
  }, [activeDepartment, activeCategory, activeBadge, products, deferredSearchTerm, sortBy])

  // Pagination & progressive display metrics
  const totalItems = filteredProducts.length
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(totalItems / (pageSize as number)) || 1

  const { displayedProducts, displayedEnd } = useMemo(() => {
    if (pageSize === 'all') {
      return {
        displayedProducts: filteredProducts,
        displayedEnd: totalItems,
      }
    }

    // If user clicked "Load More" from page 1, visibleCount tracks continuous loading
    if (visibleCount > (pageSize as number) && currentPage === 1) {
      const slice = filteredProducts.slice(0, visibleCount)
      return {
        displayedProducts: slice,
        displayedEnd: slice.length,
      }
    }

    const start = (currentPage - 1) * (pageSize as number)
    const end = Math.min(start + (pageSize as number), totalItems)
    const slice = filteredProducts.slice(start, end)
    return {
      displayedProducts: slice,
      displayedEnd: end,
    }
  }, [filteredProducts, pageSize, currentPage, visibleCount, totalItems])

  const scrollToCollection = () => {
    if (typeof window === 'undefined') return
    const el = document.getElementById('collection')
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    setVisibleCount(pageSize === 'all' ? totalItems : (pageSize as number))
    scrollToCollection()
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, totalItems))
  }

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

  const handleWishlistToggle = useCallback(
    (id: string | number) => {
      toggleWishlist(id)
    },
    [toggleWishlist]
  )

  const handleQuickView = useCallback((prod: Product) => {
    setQuickViewProduct(prod)
    setQuickViewQuantity(1)
    setActiveQuickTab('details')
  }, [])

  const handleAddToCart = useCallback(
    (p: any, qty?: number) => {
      addToCart(p, qty)
    },
    [addToCart]
  )

  const handleBuyNow = useCallback(
    (p: any) => {
      addToCart(p, 1)
      setIsCartOpen(true)
    },
    [addToCart, setIsCartOpen]
  )

  return (
    <section id="collection" ref={containerRef} className="section-shell py-16 sm:py-24 scroll-mt-24">
      {/* Anchor for crafts */}
      <div id="crafts" className="relative -top-28 pointer-events-none" />

      <div className="space-y-12">
        {/* Section Header */}
        <div className="gsap-gallery-section mx-auto max-w-3xl text-center">
          <div className="section-eyebrow mb-3.5">
            <Sparkles className="h-3.5 w-3.5 text-[#7A5B32]" />
            <span>Artisan Crafts Atelier • Handcrafted Masterpieces</span>
          </div>
          <h2 className="heading-1">
            Artisan Crafts{' '}
            <AtelierScriptText className="text-[1.3em] text-[#141210] font-normal">
              Atelier
            </AtelierScriptText>
          </h2>
          <p className="body-lead mx-auto mt-4 max-w-2xl text-[#5C4D3C]">
            Explore genuine handcrafted jewelry, pressed floral resin, clean aromatherapy soy candles, studio ceramics, and creative kits sculpted with generational passion.
          </p>
        </div>

        {/* Visual Category Showcase Cards */}
        <div className="gsap-gallery-section grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
          {currentCategoryGroups.map((cat) => {
            const isSelected = activeCategory === cat.title
            return (
              <button
                key={cat.title}
                type="button"
                onClick={() => {
                  setActiveCategory(isSelected ? 'All' : cat.title)
                }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-[#B68D52] ring-2 ring-[#D4AF78]/45 shadow-[0_12px_32px_rgba(109,87,56,0.16)] bg-gradient-to-b from-[#FAF6EF] via-[#FCF9F4] to-[#F3ECE1]'
                    : 'border-[#6D5738]/20 bg-gradient-to-b from-[#FCF9F4] via-[#FAF6EF] to-[#F4EDE2] hover:border-[#B68D52]/65 hover:shadow-[0_10px_28px_rgba(68,52,32,0.12)] hover:-translate-y-0.5'
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EFE8DC]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    width={400}
                    height={250}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = fallbackCraftImage
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 right-2.5 truncate font-tagline text-xs sm:text-sm font-bold text-[#F9F5EE]">
                    {cat.title}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-[#FCF9F4]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5B32] truncate max-w-[120px]">
                    {cat.badge}
                  </span>
                  <span className="text-[10px] text-[#141210] font-bold shrink-0">
                    {isSelected ? 'Selected ✓' : 'Browse →'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* LUXURY COMMAND & FILTER SKELETON */}
        <div className="gsap-gallery-section relative rounded-[2rem] sm:rounded-[2.5rem] border border-[#6D5738]/20 bg-gradient-to-b from-[#FCF9F4] via-[#FAF6EF] to-[#F5EFE5] p-4 sm:p-6 lg:p-7 shadow-[0_18px_42px_rgba(68,52,32,0.08)] overflow-hidden">
          {/* Ambient luxury lighting accents */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#D4AF78]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#EDE4DD]/50 blur-3xl" />

          <div className="relative space-y-4 sm:space-y-5">
            {/* TIER 1: Search Console + Controls Toolbar */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Precision Search Input */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A5B32]" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
                  placeholder="Search live fish, aquascapes, jewelry, soy candles, artisan crafts..."
                  className="h-12 w-full rounded-2xl border border-[#6D5738]/25 bg-[#F5F0E8] pl-11 pr-24 text-xs sm:text-sm font-medium text-[#141210] placeholder:text-[#5C4D3C]/65 focus:border-[#B68D52] focus:ring-2 focus:ring-[#D4AF78]/30 focus:shadow-[0_0_24px_rgba(212,175,120,0.18)] shadow-[inset_0_1px_2px_rgba(68,52,32,0.08)] outline-none transition-all"
                />
                {searchTerm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-[#EFE8DC] border border-[#6D5738]/30 px-2.5 py-1 text-[10px] font-bold text-[#7A5B32] hover:bg-[#E5DCCD] transition"
                  >
                    <X className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                ) : (
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-[#5C4D3C] bg-[#EFE8DC] border border-[#6D5738]/25 rounded-lg px-2 py-0.5">
                    <span>
                      {filteredProducts.length} pieces{pageSize !== 'all' && totalPages > 1 ? ` • Pg ${currentPage}/${totalPages}` : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Control Actions: Sort, Grid Mode & Reset */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
                {/* Sort Selector */}
                <div className="relative flex items-center rounded-2xl border border-[#6D5738]/25 bg-[#F5F0E8] px-3 py-2 text-xs font-bold text-[#141210] shadow-xs hover:border-[#B68D52] transition">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#7A5B32] mr-2 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                    }}
                    className="bg-transparent font-bold text-[#141210] outline-none cursor-pointer pr-4 text-xs [&>option]:bg-[#FCF9F4] [&>option]:text-[#141210]"
                  >
                    <option value="featured">Featured Drops</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Layout Density Switcher */}
                <div className="flex items-center rounded-2xl border border-[#6D5738]/25 bg-[#F5F0E8] p-1 shadow-xs">
                  <button
                    type="button"
                    title="Standard View (Showcase Details)"
                    onClick={() => setLayoutMode('grid')}
                    className={`grid h-8 w-8 place-items-center rounded-xl transition cursor-pointer ${
                      layoutMode === 'grid'
                        ? 'bg-[#D4AF78] text-[#141210] shadow-sm font-bold'
                        : 'text-[#5C4D3C] hover:text-[#141210] hover:bg-[#EFE8DC]'
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Compact View (Dense - Fits More, Less Scroll)"
                    onClick={() => setLayoutMode('masonry')}
                    className={`grid h-8 w-8 place-items-center rounded-xl transition cursor-pointer ${
                      layoutMode === 'masonry'
                        ? 'bg-[#D4AF78] text-[#141210] shadow-sm font-bold'
                        : 'text-[#5C4D3C] hover:text-[#141210] hover:bg-[#EFE8DC]'
                    }`}
                  >
                    <Grid2X2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Reset Filter Button if active */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 rounded-2xl border border-rose-500/35 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset ({activeFilterCount})</span>
                  </button>
                )}
              </div>
            </div>

            {/* TIER 2: Curated Category Horizontal Rail */}
            <div className="space-y-2 border-t border-[#6D5738]/20 pt-3.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7A5B32]">
                  Collections & Specialties
                </span>
                <span className="text-[10px] text-[#5C4D3C] hidden sm:inline">
                  Scroll horizontally to explore &rarr;
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1">
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
                      onClick={() => {
                        setActiveCategory(cat)
                      }}
                      className={`relative rounded-xl px-4 py-2 text-xs font-bold transition-colors duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'text-[#141210]'
                          : 'border border-[#6D5738]/25 bg-[#F5F0E8] text-[#5C4D3C] hover:border-[#B68D52]/60 hover:text-[#141210] shadow-xs'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="categoryRailPill"
                          className="absolute inset-0 rounded-xl bg-[#D4AF78] border border-[#C69C5D] shadow-[0_4px_16px_rgba(182,141,82,0.25)]"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#141210] animate-pulse" />}
                        <span>{cat}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* TIER 3: Filter Attributes Rail */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 border-t border-[#6D5738]/20 pt-3 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#7A5B32] shrink-0">
                <Sparkles className="h-3 w-3 text-[#7A5B32]" />
                <span>Filter by:</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 flex-1">
                {BADGE_TAGS.map((tag) => {
                  const isSelected = activeBadge === tag
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setActiveBadge(tag)
                      }}
                      className={`rounded-full px-3.5 py-1.5 font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF78] border border-[#C69C5D] text-[#141210] shadow-sm'
                          : 'border border-[#6D5738]/25 bg-[#F5F0E8] text-[#5C4D3C] hover:border-[#B68D52]/60 hover:text-[#141210]'
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#141210]" />}
                      <span>{tag}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Display */}
        {filteredProducts.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center p-12 text-center border border-[#6D5738]/20 bg-[#FCF9F4] rounded-2xl">
            <Package className="h-12 w-12 text-[#5C4D3C]" />
            <h3 className="mt-4 font-tagline text-2xl font-bold text-[#141210]">No Items Found</h3>
            <p className="mt-2 text-sm text-[#5C4D3C]">
              Try adjusting your category or filter selection.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-primary mt-6 text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div
              id="collection-browse"
              className={`grid transition-all duration-200 ${
                layoutMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3.5'
              }`}
            >
              {displayedProducts.map((prod: Product, idx: number) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  priority={idx < 4}
                  isCompact={layoutMode === 'masonry'}
                  isWishlisted={isWishlisted(prod.id)}
                  onWishlistToggle={handleWishlistToggle}
                  onQuickView={handleQuickView}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>

            {/* LUXURY PAGINATION & PROGRESSIVE DISCOVERY CONSOLE */}
            <div className="mt-8 pt-8 border-t border-[#6D5738]/20 flex flex-col items-center justify-center gap-5">
              {/* Progress Tracker */}
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-xs font-bold text-[#5C4D3C]">
                  Showing <strong className="text-[#141210] font-extrabold">{displayedEnd}</strong> of{' '}
                  <strong className="text-[#141210] font-extrabold">{totalItems}</strong> creations
                </span>

                {/* Gold Gradient Progress Bar */}
                <div className="w-48 sm:w-64 h-1.5 rounded-full bg-[#E5DCCD] overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#7A5B32] via-[#C69C5D] to-[#D4AF78] rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(182,141,82,0.3)]"
                    style={{
                      width: `${Math.min(100, Math.round((displayedEnd / Math.max(1, totalItems)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons: Load More & Page Navigation */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {displayedEnd < totalItems && (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="group inline-flex items-center gap-2 rounded-full bg-[#D4AF78] text-[#141210] hover:bg-[#E5C18A] border border-[#C69C5D]/60 px-6 py-2.5 text-xs font-bold shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#141210] group-hover:rotate-12 transition-transform" />
                    <span>Load More Creations (+{Math.min(12, totalItems - displayedEnd)})</span>
                  </button>
                )}

                {/* Page Numbered Navigator */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-[#6D5738]/25 bg-[#FCF9F4] p-1 shadow-xs">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`grid h-8 w-8 place-items-center rounded-full transition ${
                        currentPage <= 1
                          ? 'opacity-35 cursor-not-allowed text-[#5C4D3C]'
                          : 'text-[#141210] hover:bg-[#EFE8DC] hover:text-[#7A5B32] cursor-pointer'
                      }`}
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = pageNum === currentPage
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`h-8 min-w-[32px] px-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#D4AF78] text-[#141210] border border-[#C69C5D]/50 shadow-xs'
                              : 'text-[#5C4D3C] hover:text-[#141210] hover:bg-[#EFE8DC]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    {/* Next Button */}
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`grid h-8 w-8 place-items-center rounded-full transition ${
                        currentPage >= totalPages
                          ? 'opacity-35 cursor-not-allowed text-[#5C4D3C]'
                          : 'text-[#141210] hover:bg-[#EFE8DC] hover:text-[#7A5B32] cursor-pointer'
                      }`}
                      title="Next Page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Jump & View Density Options */}
              <div className="flex items-center gap-4 text-xs font-semibold text-[#5C4D3C]">
                <button
                  type="button"
                  onClick={scrollToCollection}
                  className="hover:text-[#141210] transition underline decoration-[#7A5B32]/50 underline-offset-4 cursor-pointer"
                >
                  ↑ Scroll to Top of Catalog
                </button>

                {pageSize !== 'all' && totalItems > 12 && (
                  <>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPageSize('all')
                        setVisibleCount(totalItems)
                      }}
                      className="hover:text-[#141210] transition underline decoration-[#7A5B32]/50 underline-offset-4 cursor-pointer"
                    >
                      View All ({totalItems})
                    </button>
                  </>
                )}

                {pageSize === 'all' && (
                  <>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPageSize(12)
                        setVisibleCount(12)
                        setCurrentPage(1)
                        scrollToCollection()
                      }}
                      className="hover:text-[#141210] transition underline decoration-[#7A5B32]/50 underline-offset-4 cursor-pointer"
                    >
                      Show in Pages (12 per view)
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* INSPIRATION & JOURNALS */}
        <section id="inspiration" className="gsap-gallery-section glass-card overflow-hidden p-6 sm:p-10 lg:p-12 border border-[#6D5738]/20 bg-gradient-to-b from-[#FCF9F4] via-[#FAF6EF] to-[#F5EFE5] rounded-3xl">
          <div className="text-center max-w-2xl mx-auto">
            <span className="section-eyebrow">
              <BookOpen className="h-3.5 w-3.5 text-[#7A5B32]" /> Maker & Aquarist Journals
            </span>
            <h3 className="mt-3 text-3xl sm:text-4xl text-[#141210] font-tagline font-semibold tracking-tight">
              Inspiration for Every Creator & Aquarist
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#5C4D3C]">
              Explore tactile textures, nature aquascaping guides, and artisanal craft tutorials from our creative collective.
            </p>
          </div>

          {/* 3 Editorial Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MAKER_ARTICLES.map((article, i) => (
              <div
                key={i}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#6D5738]/20 bg-[#FCF9F4] p-4 transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#B68D52]/70 hover:shadow-[0_12px_28px_rgba(68,52,32,0.12)]"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#EFE8DC]">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-[#141210]/85 border border-[#D4AF78]/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E5C18A] shadow-sm">
                      {article.category}
                    </span>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C4D3C]">
                      {article.date}
                    </p>
                    <h4 className="font-tagline text-xl font-bold leading-snug text-[#141210] transition group-hover:text-[#7A5B32]">
                      {article.title}
                    </h4>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#6D5738]/20 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A5B32] flex items-center gap-1 group-hover:underline">
                    Read Journal <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tactile Studio Moodboard preview tiles */}
          <div className="mt-8 pt-8 border-t border-[#6D5738]/20">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5C4D3C] text-center mb-4">
              Tactile Studio & Living Water Moodboard
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {inspirationTiles.slice(0, 6).map((tile) => (
                <div
                  key={tile.title}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-[#6D5738]/20 bg-[#EFE8DC]"
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
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <span className="text-[10px] font-bold text-[#F9F5EE] truncate">{tile.title}</span>
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
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#141210]/55 backdrop-blur-sm p-0 sm:p-4 overflow-hidden touch-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              key="quick-view-modal-card"
              className="relative my-0 sm:my-8 w-full max-w-3xl max-h-[92vh] sidebar-scroller rounded-t-[2.2rem] sm:rounded-[2.2rem] bg-[#FCF9F4] border border-[#6D5738]/30 shadow-[0_25px_60px_rgba(44,34,20,0.28)] transform-gpu will-change-transform touch-auto overscroll-contain"
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
                className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#6D5738]/30 bg-[#EFE8DC] text-[#141210] shadow-sm transition hover:bg-[#E5DCCD] hover:border-[#B68D52] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                {/* Product Image Side */}
                <div className="relative min-h-[300px] bg-[#EFE8DC] lg:min-h-[500px]">
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
                        className="rounded-full bg-[#141210]/85 border border-[#D4AF78]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E5C18A] shadow-sm"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Stock status badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-[#141210]/85 border border-emerald-400/50 text-emerald-300 px-3 py-1 text-[10px] font-bold shadow-md">
                      ● {quickViewProduct.stock ?? 20} in stock
                    </span>
                  </div>
                </div>

                {/* Details & Interactive Tabs */}
                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A5B32]">
                        {quickViewProduct.category}
                      </span>
                      {quickViewProduct.department === 'aquarium' && (
                        <span className="rounded-full bg-[#EFE8DC] border border-[#6D5738]/25 px-2 py-0.5 text-[9px] font-bold text-[#7A5B32]">
                          Aquatic Specimen
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 font-tagline text-2xl font-bold text-[#141210] sm:text-3xl">
                      {quickViewProduct.title}
                    </h3>

                    <div className="mt-3 flex items-center justify-between border-b border-[#6D5738]/20 pb-4">
                      <div>
                        <span className="text-2xl font-extrabold text-[#141210]">
                          {String(quickViewProduct.price).startsWith('₹')
                            ? quickViewProduct.price
                            : `₹${quickViewProduct.price}`}
                        </span>
                        <span className="ml-2 text-xs text-[#5C4D3C]">Direct Studio Dispatch</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#B68D52] text-[#B68D52]" />
                        <span className="text-sm font-bold text-[#141210]">
                          {quickViewProduct.rating ?? '4.9'}
                        </span>
                        <span className="text-xs text-[#5C4D3C]">({quickViewProduct.reviews ?? 48})</span>
                      </div>
                    </div>

                    {/* Quick Tabs */}
                    <div className="mt-4 flex border-b border-[#6D5738]/20">
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
                          className={`border-b-2 px-3 sm:px-4 py-2 text-xs font-bold transition cursor-pointer ${
                            activeQuickTab === tab.id
                              ? 'border-[#7A5B32] text-[#7A5B32]'
                              : 'border-transparent text-[#5C4D3C] hover:text-[#141210]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4 min-h-[140px] text-xs leading-relaxed text-[#5C4D3C]">
                      {activeQuickTab === 'details' && (
                        <div className="space-y-3">
                          <p>{quickViewProduct.description}</p>
                          {quickViewProduct.department === 'aquarium' && (
                            <div className="flex items-center gap-2 rounded-xl bg-[#F5F0E8] border border-[#6D5738]/25 p-2.5 text-[#141210] font-semibold">
                              <ShieldCheck className="h-4 w-4 text-[#7A5B32] shrink-0" />
                              <span>Live Arrival Guarantee: Oxygenated bagging + climate controlled thermal transit pack.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activeQuickTab === 'specs' && quickViewProduct.aquaticSpecs && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {quickViewProduct.aquaticSpecs.waterType && (
                            <div className="rounded-xl bg-[#F5F0E8] border border-[#6D5738]/20 p-2.5">
                              <span className="text-[10px] font-bold text-[#5C4D3C] uppercase block">Water Type</span>
                              <span className="font-bold text-[#141210]">{quickViewProduct.aquaticSpecs.waterType}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.careLevel && (
                            <div className="rounded-xl bg-[#F5F0E8] border border-[#6D5738]/20 p-2.5">
                              <span className="text-[10px] font-bold text-[#5C4D3C] uppercase block">Care Level</span>
                              <span className="font-bold text-[#141210]">{quickViewProduct.aquaticSpecs.careLevel}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.temperament && (
                            <div className="rounded-xl bg-[#F5F0E8] border border-[#6D5738]/20 p-2.5">
                              <span className="text-[10px] font-bold text-[#5C4D3C] uppercase block">Temperament</span>
                              <span className="font-bold text-[#141210]">{quickViewProduct.aquaticSpecs.temperament}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.tankSize && (
                            <div className="rounded-xl bg-[#F5F0E8] border border-[#6D5738]/20 p-2.5">
                              <span className="text-[10px] font-bold text-[#5C4D3C] uppercase block">Minimum Tank</span>
                              <span className="font-bold text-[#141210]">{quickViewProduct.aquaticSpecs.tankSize}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.diet && (
                            <div className="col-span-2 rounded-xl bg-[#F5F0E8] border border-[#6D5738]/20 p-2.5">
                              <span className="text-[10px] font-bold text-[#5C4D3C] uppercase block">Diet / Nutrition</span>
                              <span className="font-bold text-[#141210]">{quickViewProduct.aquaticSpecs.diet}</span>
                            </div>
                          )}
                          {quickViewProduct.aquaticSpecs.dimensions && (
                            <div className="col-span-2 rounded-xl bg-[#F5F0E8] border border-[#6D5738]/20 p-2.5">
                              <span className="text-[10px] font-bold text-[#5C4D3C] uppercase block">Dimensions / Flow</span>
                              <span className="font-bold text-[#141210]">{quickViewProduct.aquaticSpecs.dimensions}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {activeQuickTab === 'materials' && (
                        <ul className="space-y-1.5 list-disc pl-4 text-xs text-[#5C4D3C]">
                          <li>Handcrafted with studio-grade natural resins, organic soy waxes, and pure silk threads.</li>
                          <li>100% genuine pressed wild botanicals sealed with crystal clarity.</li>
                          <li>Recyclable, plastic-free boutique packaging and personalized gift notes.</li>
                        </ul>
                      )}

                      {activeQuickTab === 'reviews' && (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-[#6D5738]/20 bg-[#F5F0E8] p-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#141210]">Verified Buyer</span>
                              <div className="flex text-[#B68D52]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-[#B68D52]" />
                                ))}
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-[#5C4D3C]">
                              "Outstanding quality. Exceeded expectations in every detail!"
                            </p>
                          </div>

                          {/* Post Review Form */}
                          <form onSubmit={handlePostReview} className="space-y-2 rounded-xl border border-[#6D5738]/20 bg-[#F5F0E8] p-3">
                            <p className="text-xs font-bold text-[#141210]">Leave a Review</p>
                            <div className="flex gap-2">
                              <input
                                required
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder="Your Name"
                                className="h-8 flex-1 rounded-lg border border-[#6D5738]/30 bg-[#FCF9F4] px-2.5 text-xs text-[#141210] placeholder:text-[#5C4D3C]/50 outline-none focus:border-[#B68D52]"
                              />
                              <select
                                value={reviewRating}
                                onChange={(e) => setReviewRating(Number(e.target.value))}
                                className="h-8 rounded-lg border border-[#6D5738]/30 bg-[#FCF9F4] px-2 text-xs text-[#141210] outline-none focus:border-[#B68D52]"
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
                              className="h-8 w-full rounded-lg border border-[#6D5738]/30 bg-[#FCF9F4] px-2.5 text-xs text-[#141210] placeholder:text-[#5C4D3C]/50 outline-none focus:border-[#B68D52]"
                            />
                            <button
                              type="submit"
                              className="rounded-lg bg-[#D4AF78] px-3 py-1 text-xs font-bold text-[#141210] transition hover:bg-[#E5C18A] shadow-sm cursor-pointer"
                            >
                              Submit Review
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & CTAs */}
                  <div className="mt-6 border-t border-[#6D5738]/20 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-[#6D5738]/30 bg-[#F5F0E8] px-3 py-1.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => setQuickViewQuantity((q) => Math.max(1, q - 1))}
                          className="grid h-6 w-6 place-items-center rounded-full bg-[#EFE8DC] text-[#7A5B32] transition hover:bg-[#E5DCCD] cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold text-[#141210]">
                          {quickViewQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuickViewQuantity((q) => q + 1)}
                          className="grid h-6 w-6 place-items-center rounded-full bg-[#EFE8DC] text-[#7A5B32] transition hover:bg-[#E5DCCD] cursor-pointer"
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
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(quickViewProduct.id)
                        }}
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#6D5738]/30 bg-[#F5F0E8] text-[#141210] transition cursor-pointer ${
                          isWishlisted(quickViewProduct.id)
                            ? 'border-rose-400 text-rose-500'
                            : 'hover:border-[#B68D52]'
                        }`}
                        title="Save to wishlist"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isWishlisted(quickViewProduct.id) ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={handleQuickViewWhatsApp}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-emerald-600/35 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 transition shadow-xs cursor-pointer"
                        title="Order via WhatsApp with Photo Preview (+91 93412 97124)"
                      >
                        <MessageCircle className="h-5 w-5" />
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

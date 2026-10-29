"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Search, ShoppingBag, X, Fish } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage } from '../utils/fallbackImage'

const SEARCH_CATEGORIES = [
  'All',
  'Acquario Tropicale',
  'Live Freshwater Fish',
  'Marine & Saltwater Fish',
  'Aquariums & Nano Tanks',
  'Handmade Jewelry',
  'Home Decor',
  'Beauty',
]

export default function QuickSearchModal() {
  const {
    isQuickSearchOpen,
    setIsQuickSearchOpen,
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useMarketplace()

  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const inputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Escape Listener, Autofocus & Rock-Solid Non-Shifting Scroll Lock
  useEffect(() => {
    if (!isQuickSearchOpen) return

    // Prevent background wheel and touch drag from scrolling the underlying page
    const handleWheel = (e: WheelEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQuickSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    // Smooth autofocus for desktop only without causing mobile layout jumps
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    let rafId: number | null = null
    if (!isTouch) {
      rafId = requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true })
      })
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isQuickSearchOpen, setIsQuickSearchOpen])

  // Reset query when modal closes
  useEffect(() => {
    if (!isQuickSearchOpen) {
      setQuery('')
      setSelectedCategory('All')
    }
  }, [isQuickSearchOpen])

  const searchResults = useMemo(() => {
    let list = products

    if (selectedCategory !== 'All') {
      if (
        selectedCategory === 'Acquario Tropicale' ||
        selectedCategory === 'Fish & Aquarium'
      ) {
        list = list.filter(
          (p: any) =>
            p.department === 'aquarium' ||
            p.category.toLowerCase().includes('fish') ||
            p.category.toLowerCase().includes('aquarium')
        )
      } else {
        list = list.filter((p: any) =>
          p.category.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      }
    }

    const cleanQuery = query.trim().toLowerCase()
    if (!cleanQuery) {
      return list.slice(0, 10)
    }

    return list.filter((p: any) =>
      [p.title, p.category, p.description, ...(p.badges || [])]
        .join(' ')
        .toLowerCase()
        .includes(cleanQuery)
    )
  }, [products, query, selectedCategory])

  return (
    <AnimatePresence>
      {isQuickSearchOpen && (
        <motion.div
          key="quick-search-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Quick Search"
          className="fixed inset-0 z-[130] flex items-start justify-center bg-black/75 p-3 sm:p-4 pt-3 sm:pt-20"
          onClick={() => setIsQuickSearchOpen(false)}
        >
          <motion.div
            key="quick-search-card"
            ref={cardRef}
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 360, mass: 0.75 }}
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[rgba(212,175,120,0.30)] bg-[#191713] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,120,0.12)] transform-gpu"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar with Clear and Dedicated Close Button */}
            <div className="relative flex items-center gap-2 border-b border-[rgba(212,175,120,0.25)] bg-[#12110F] p-3 sm:p-4">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#D4AF78]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search fish, aquariums, plants, candles, jewelry..."
                  className="h-11 sm:h-12 w-full rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] pl-10 sm:pl-12 pr-10 text-xs sm:text-base text-[#F5EBDD] outline-none placeholder:text-[#B8AA96]/50 transition focus:border-[#D4AF78] focus:ring-2 focus:ring-[#D4AF78]/30 font-medium"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear query"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8AA96] transition hover:text-[#D4AF78] cursor-pointer p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Quick Exit Button */}
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setIsQuickSearchOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#191713] text-[#F5EBDD] hover:bg-[#0B0B0A] hover:border-[#D4AF78] transition duration-150 active:scale-95 cursor-pointer"
                title="Close Search"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Category Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[rgba(212,175,120,0.2)] bg-[#12110F] px-3 sm:px-5 py-2.5">
              {SEARCH_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF78] text-[#0B0B0A] shadow-[0_2px_10px_rgba(212,175,120,0.3)] font-extrabold'
                      : 'border border-[rgba(212,175,120,0.2)] bg-[#191713] text-[#B8AA96] hover:text-[#F5EBDD] hover:border-[#D4AF78]/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Suggestions & Results List */}
            <div className="max-h-[60vh] sm:max-h-[55vh] sidebar-scroller p-3 sm:p-5 bg-[#0B0B0A]">
              <div className="flex items-center justify-between pb-2.5 text-xs font-bold uppercase tracking-wider text-[#B8AA96]">
                <span>
                  {query ? `Found ${searchResults.length} items` : 'Trending Marketplace Drops'}
                </span>
                <span className="text-[10px] text-[#D4AF78] font-semibold hidden sm:inline">
                  Press ESC to exit
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-serif text-lg font-bold text-[#F5EBDD]">
                    No items found matching "{query}"
                  </p>
                  <p className="mt-1 text-xs text-[#B8AA96]">
                    Try searching for Discus, Betta, Aquarium, Candle, Resin, or Bangles.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {searchResults.map((product: any) => (
                    <div
                      key={product.id}
                      className="group flex items-center justify-between rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#191713] p-2.5 sm:p-3 transition duration-150 hover:border-[rgba(212,175,120,0.55)] hover:bg-[#12110F] hover:shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.src = fallbackCraftImage
                          }}
                          className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover border border-[rgba(212,175,120,0.2)] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF78] truncate">
                              {product.category}
                            </span>
                            {product.department === 'aquarium' && (
                              <span className="rounded-full bg-teal-950/40 border border-teal-500/40 px-1.5 py-0.2 text-[8px] font-bold text-teal-300 shrink-0">
                                Aquarium
                              </span>
                            )}
                          </div>
                          <h4 className="truncate text-xs sm:text-sm font-bold text-[#F5EBDD] group-hover:text-[#D4AF78] transition">
                            {product.title}
                          </h4>
                          <span className="text-xs font-extrabold text-[#D4AF78]">
                            {product.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          aria-label="Wishlist item"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWishlist(product.id)
                          }}
                          className={`grid h-8 w-8 place-items-center rounded-full border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] text-[#F5EBDD] transition hover:border-rose-400 hover:text-rose-400 cursor-pointer ${
                            isWishlisted(product.id)
                              ? 'border-rose-400 bg-rose-950/30 text-rose-400'
                              : ''
                          }`}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              isWishlisted(product.id) ? 'fill-rose-400' : ''
                            }`}
                          />
                        </button>
                        {product.department === 'aquarium' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#12110F] border border-[rgba(212,175,120,0.3)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF78]">
                            Coming Soon
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(product, 1)
                              setIsQuickSearchOpen(false)
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF78] hover:bg-[#E5C18A] px-3 py-1.5 text-xs font-bold text-[#0B0B0A] transition active:scale-95 cursor-pointer"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

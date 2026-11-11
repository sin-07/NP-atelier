"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Search, ShoppingBag, X, Fish } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { useUIModals } from '../context/UIModalContext'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { lockScroll, unlockScroll } from '../utils/scrollLock'

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
  const { isQuickSearchOpen, setIsQuickSearchOpen } = useUIModals()
  const {
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useMarketplace()

  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const inputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Escape Listener, Body Scroll Lock & Responsive Focus
  useEffect(() => {
    if (!isQuickSearchOpen) return

    lockScroll()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQuickSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Smooth autofocus after modal completes its snappy entrance
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)

    // On desktop autofocus immediately; on touch devices give 70ms so viewport doesn't jump
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, isTouch ? 70 : 15)

    return () => {
      clearTimeout(focusTimer)
      unlockScroll()
      window.removeEventListener('keydown', handleKeyDown)
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
      return list.slice(0, 4)
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
          transition={{ duration: 0.12, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Quick Search"
          className="fixed inset-0 z-[130] flex items-start justify-center bg-[#141210]/55 backdrop-blur-xs p-3 sm:p-4 pt-3 sm:pt-20 touch-none overscroll-contain"
          onClick={() => setIsQuickSearchOpen(false)}
        >
          <motion.div
            key="quick-search-card"
            ref={cardRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#6D5738]/25 bg-[#FCF9F4] shadow-[0_25px_60px_rgba(44,34,20,0.28)] transform-gpu touch-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar with Clear and Dedicated Close Button */}
            <div className="relative flex items-center gap-2 border-b border-[#6D5738]/20 bg-[#FAF6EF] p-3 sm:p-4">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#7A5B32]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search fish, aquariums, plants, candles, jewelry..."
                  className="h-11 sm:h-12 w-full rounded-2xl border border-[#6D5738]/25 bg-[#F5F0E8] pl-10 sm:pl-12 pr-10 text-xs sm:text-base text-[#141210] outline-none placeholder:text-[#5C4D3C]/65 transition focus:border-[#B68D52] focus:ring-2 focus:ring-[#D4AF78]/30 font-medium"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear query"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4D3C] transition hover:text-[#7A5B32] cursor-pointer p-1"
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
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#6D5738]/25 bg-[#EFE8DC] text-[#141210] hover:bg-[#E5DCCD] hover:border-[#B68D52] transition duration-150 active:scale-95 cursor-pointer"
                title="Close Search"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Category Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[#6D5738]/20 bg-[#FAF6EF] px-3 sm:px-5 py-2.5">
              {SEARCH_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF78] text-[#141210] border border-[#C69C5D] shadow-xs font-extrabold'
                      : 'border border-[#6D5738]/25 bg-[#F5F0E8] text-[#5C4D3C] hover:text-[#141210] hover:border-[#B68D52]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Suggestions & Results List */}
            <div className="max-h-[60vh] sm:max-h-[55vh] sidebar-scroller p-3 sm:p-5 bg-[#F5F0E8] overscroll-contain">
              <div className="flex items-center justify-between pb-2.5 text-xs font-bold uppercase tracking-wider text-[#5C4D3C]">
                <span>
                  {query ? `Found ${searchResults.length} items` : 'Trending Marketplace Drops'}
                </span>
                <span className="text-[10px] text-[#7A5B32] font-semibold hidden sm:inline">
                  Press ESC to exit
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-tagline text-xl font-bold text-[#141210]">
                    No items found matching "{query}"
                  </p>
                  <p className="mt-1 text-xs text-[#5C4D3C]">
                    Try searching for Discus, Betta, Aquarium, Candle, Resin, or Bangles.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {searchResults.map((product: any) => (
                    <div
                      key={product.id}
                      className="group flex items-center justify-between rounded-2xl border border-[#6D5738]/20 bg-[#FCF9F4] p-2.5 sm:p-3 transition duration-150 hover:border-[#B68D52]/65 hover:bg-[#FAF6EF] hover:shadow-xs"
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
                          className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover border border-[#6D5738]/20 shrink-0 bg-[#EFE8DC]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B32] truncate">
                              {product.category}
                            </span>
                            {product.department === 'aquarium' && (
                              <span className="rounded-full bg-teal-50 border border-teal-600/30 px-1.5 py-0.2 text-[8px] font-bold text-teal-700 shrink-0">
                                Aquarium
                              </span>
                            )}
                          </div>
                          <h4 className="truncate font-tagline text-sm sm:text-base font-bold text-[#141210] group-hover:text-[#7A5B32] transition">
                            {product.title}
                          </h4>
                          <span className="text-xs font-extrabold text-[#141210]">
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
                          className={`grid h-8 w-8 place-items-center rounded-full border border-[#6D5738]/25 bg-[#F5F0E8] text-[#141210] transition hover:border-rose-400 hover:text-rose-500 cursor-pointer ${
                            isWishlisted(product.id)
                              ? 'border-rose-400 bg-rose-50 text-rose-600'
                              : ''
                          }`}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              isWishlisted(product.id) ? 'fill-rose-500' : ''
                            }`}
                          />
                        </button>
                        {product.department === 'aquarium' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EFE8DC] border border-[#6D5738]/25 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7A5B32]">
                            Coming Soon
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(product, 1)
                              setIsQuickSearchOpen(false)
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF78] hover:bg-[#E5C18A] px-3 py-1.5 text-xs font-bold text-[#141210] transition active:scale-95 cursor-pointer"
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

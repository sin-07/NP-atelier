"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Search, ShoppingBag, X, Fish } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage } from '../utils/fallbackImage'

const SEARCH_CATEGORIES = [
  'All',
  'Fish & Aquarium',
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

  useEffect(() => {
    if (isQuickSearchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isQuickSearchOpen])

  const searchResults = useMemo(() => {
    let list = products

    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Fish & Aquarium') {
        list = list.filter((p: any) => p.department === 'aquarium' || p.category.toLowerCase().includes('fish') || p.category.toLowerCase().includes('aquarium'))
      } else {
        list = list.filter((p: any) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()))
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
      {isQuickSearchOpen ? (
        <motion.div
          key="quick-search-backdrop"
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-16 sm:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsQuickSearchOpen(false)}
        >
          <motion.div
            key="quick-search-card"
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-white shadow-[0_20px_60px_rgba(180,135,45,0.22)]"
            initial={{ scale: 0.96, y: -12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="relative border-b border-[#DFCFA6]/60 bg-gradient-to-r from-[#FFFDF9] to-[#FAF6ED] p-4 sm:p-5">
              <Search className="pointer-events-none absolute left-7 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B8860B]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search live fish, rimless tanks, plants, jewelry, candles, resin..."
                className="h-12 w-full rounded-2xl border border-[#DFCFA6]/80 bg-white pl-12 pr-12 text-sm sm:text-base text-[#141414] outline-none placeholder:text-[#8C827A] transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 font-medium"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-[#8C827A] transition hover:text-[#B8860B]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Category Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#DFCFA6]/40 bg-white px-4 py-2.5 sm:px-6">
              {SEARCH_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold transition shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] shadow-[0_2px_10px_rgba(212,175,55,0.3)] font-extrabold'
                      : 'border border-[#DFCFA6]/50 bg-[#FAF7F0] text-[#5A451A] hover:bg-[#FAF2DE] hover:border-[#D4AF37]/60'
                  }`}
                >
                  {cat === 'Fish & Aquarium' ? '🐠 Fish & Aquarium' : cat}
                </button>
              ))}
            </div>

            {/* Suggestions & Results List */}
            <div className="max-h-[55vh] overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2]">
              <div className="flex items-center justify-between pb-3 text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                <span>{query ? `Found ${searchResults.length} items` : 'Trending Marketplace Drops'}</span>
                <span className="text-[10px] text-[#B8860B] font-semibold">Press ESC to exit</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-serif text-lg font-bold text-[#141414]">No items found matching "{query}"</p>
                  <p className="mt-1 text-xs text-[#5A554E]">
                    Try searching for Discus, Betta, Aquarium, Candle, Resin, or Bangles.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2.5">
                  {searchResults.map((product: any) => (
                    <div
                      key={product.id}
                      className="group flex items-center justify-between rounded-2xl border border-[#E5E0D8] bg-white p-2.5 sm:p-3 transition hover:border-[#D4AF37] hover:bg-[#FFFDF9] hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          onError={(e) => {
                            e.currentTarget.src = fallbackCraftImage
                          }}
                          className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover border border-[#E5E0D8] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7314] truncate">
                              {product.category}
                            </span>
                            {product.department === 'aquarium' && (
                              <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[8px] font-bold text-cyan-800 shrink-0">
                                Aquarium
                              </span>
                            )}
                          </div>
                          <h4 className="truncate text-xs sm:text-sm font-bold text-[#141414] group-hover:text-[#B8860B] transition">
                            {product.title}
                          </h4>
                          <span className="text-xs font-extrabold text-[#141414]">
                            {product.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          aria-label="Wishlist item"
                          onClick={() => toggleWishlist(product.id)}
                          className={`grid h-8 w-8 place-items-center rounded-full border border-[#DDD7CE] bg-[#FAF8F5] text-[#141414] transition hover:border-rose-400 hover:text-rose-500 ${
                            isWishlisted(product.id) ? 'border-rose-400 bg-rose-50 text-rose-500' : ''
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${isWishlisted(product.id) ? 'fill-rose-500' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product, 1)
                            setIsQuickSearchOpen(false)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#B8860B]"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

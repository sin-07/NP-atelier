"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import { Heart, Search, ShoppingBag, X, Fish } from 'lucide-react'
import gsap from 'gsap'
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

  const [isMounted, setIsMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const inputRef = useRef<HTMLInputElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isClosingRef = useRef(false)

  // Mount/Unmount sync with GSAP
  useEffect(() => {
    if (isQuickSearchOpen) {
      setIsMounted(true)
      isClosingRef.current = false
    } else if (isMounted && !isClosingRef.current) {
      handleClose()
    }
  }, [isQuickSearchOpen])

  // GSAP Entrance & Body Scroll Lock
  useEffect(() => {
    if (!isMounted) return

    // Freeze background scroll to eliminate GPU repaints
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // GSAP Hardware-Accelerated Entrance
    if (cardRef.current && backdropRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.22 }
      ).fromTo(
        cardRef.current,
        { opacity: 0, y: -16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.26, clearProps: 'transform' },
        '-=0.12'
      )
    }

    // Only auto-focus keyboard on desktop after entrance animation completes
    // to avoid virtual keyboard layout thrashing on mobile devices
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    let focusTimer: NodeJS.Timeout | null = null
    if (!isTouch) {
      focusTimer = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true })
      }, 260)
    }

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      if (focusTimer) clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isMounted])

  const handleClose = () => {
    if (isClosingRef.current) return
    isClosingRef.current = true

    if (cardRef.current && backdropRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsQuickSearchOpen(false)
          setIsMounted(false)
          isClosingRef.current = false
        },
      })

      tl.to(cardRef.current, {
        y: -12,
        scale: 0.96,
        opacity: 0,
        duration: 0.18,
        ease: 'power2.in',
      }).to(
        backdropRef.current,
        {
          opacity: 0,
          duration: 0.18,
          ease: 'power2.in',
        },
        '-=0.12'
      )
    } else {
      setIsQuickSearchOpen(false)
      setIsMounted(false)
      isClosingRef.current = false
    }
  }

  const searchResults = useMemo(() => {
    let list = products

    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Acquario Tropicale' || selectedCategory === 'Fish & Aquarium') {
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

  if (!isMounted) return null

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Quick Search"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 pt-3 sm:pt-20 will-change-[opacity]"
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D4AF37]/50 bg-white shadow-[0_20px_50px_rgba(20,16,8,0.25),0_0_20px_rgba(212,175,55,0.15)] will-change-[transform,opacity]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar with Clear and Dedicated Close Button */}
        <div className="relative flex items-center gap-2 border-b border-[#DFCFA6]/60 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6ED] to-[#FFFDF9] p-3 sm:p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#B8860B]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fish, aquariums, plants, candles, jewelry..."
              className="h-11 sm:h-12 w-full rounded-2xl border border-[#DFCFA6]/80 bg-white pl-10 sm:pl-12 pr-10 text-xs sm:text-base text-[#141414] outline-none placeholder:text-[#8C827A] transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 font-medium"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear query"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] transition hover:text-[#B8860B] cursor-pointer p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Exit Button (Crucial on mobile devices where ESC doesn't exist) */}
          <button
            type="button"
            aria-label="Close search"
            onClick={handleClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#DFCFA6]/80 bg-[#FAF6EE] text-[#5A451A] hover:bg-[#F3E8CD] hover:text-[#141414] hover:border-[#D4AF37] transition duration-150 active:scale-95 cursor-pointer"
            title="Close Search"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Quick Category Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[#DFCFA6]/40 bg-white px-3 sm:px-5 py-2.5">
          {SEARCH_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] shadow-[0_2px_10px_rgba(212,175,55,0.3)] font-extrabold'
                  : 'border border-[#DFCFA6]/50 bg-[#FAF7F0] text-[#5A451A] hover:bg-[#FAF2DE] hover:border-[#D4AF37]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Suggestions & Results List */}
        <div className="max-h-[60vh] sm:max-h-[55vh] sidebar-scroller p-3 sm:p-5 bg-[#FAF7F2]">
          <div className="flex items-center justify-between pb-2.5 text-xs font-bold uppercase tracking-wider text-[#8C827A]">
            <span>{query ? `Found ${searchResults.length} items` : 'Trending Marketplace Drops'}</span>
            <span className="text-[10px] text-[#B8860B] font-semibold hidden sm:inline">Press ESC to exit</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-serif text-lg font-bold text-[#141414]">No items found matching "{query}"</p>
              <p className="mt-1 text-xs text-[#5A554E]">
                Try searching for Discus, Betta, Aquarium, Candle, Resin, or Bangles.
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {searchResults.map((product: any) => (
                <div
                  key={product.id}
                  className="group flex items-center justify-between rounded-2xl border border-[#E5E0D8] bg-white p-2.5 sm:p-3 transition duration-150 hover:border-[#D4AF37] hover:bg-[#FFFDF9] hover:shadow-xs"
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
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover border border-[#E5E0D8] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7314] truncate">
                          {product.category}
                        </span>
                        {product.department === 'aquarium' && (
                          <span className="rounded-full bg-teal-100 px-1.5 py-0.2 text-[8px] font-bold text-teal-800 shrink-0">
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
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product.id)
                      }}
                      className={`grid h-8 w-8 place-items-center rounded-full border border-[#DDD7CE] bg-[#FAF8F5] text-[#141414] transition hover:border-rose-400 hover:text-rose-500 cursor-pointer ${
                        isWishlisted(product.id) ? 'border-rose-400 bg-rose-50 text-rose-500' : ''
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isWishlisted(product.id) ? 'fill-rose-500' : ''}`} />
                    </button>
                    {product.department === 'aquarium' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF4E2] border border-[#D4AF37]/60 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#8C6D2B]">
                        Coming Soon
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product, 1)
                          handleClose()
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#B8860B] active:scale-95 cursor-pointer"
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
      </div>
    </div>
  )
}

"use client"

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Heart, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage } from '../utils/fallbackImage'

export default function WishlistSidebar() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlistedProducts,
    toggleWishlist,
    addToCart,
    moveAllWishlistToCart,
  } = useMarketplace()

  useEffect(() => {
    if (isWishlistOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isWishlistOpen])

  return (
    <AnimatePresence>
      {isWishlistOpen ? (
        <>
          <motion.div
            key="wishlist-overlay"
            className="fixed inset-0 z-[80] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
          />

          <motion.aside
            key="wishlist-drawer"
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col overflow-hidden border-l border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[rgba(212,175,120,0.25)] bg-[#12110F] px-6 py-5 z-10 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#191713] border border-[rgba(212,175,120,0.25)] text-[#D4AF78] font-extrabold shadow-[0_2px_10px_rgba(212,175,120,0.15)]">
                  <Heart className="h-5 w-5 fill-[#D4AF78] text-[#D4AF78]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#F5EBDD] font-bold">Saved Treasures</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8AA96]">
                    {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} saved
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close wishlist"
                onClick={() => setIsWishlistOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(212,175,120,0.25)] bg-[#191713] text-[#F5EBDD] shadow-sm transition hover:bg-[#12110F] hover:border-[#D4AF78]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List with Soft Vignettes and Refined Scroller */}
            <div className="relative flex-1 min-h-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-[#0B0B0A] to-transparent" />

              <div className="h-full sidebar-scroller p-4 sm:p-5 sm:pr-4">
                {wishlistedProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-[rgba(212,175,120,0.25)] bg-[#191713] p-8 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)] text-[#D4AF78]">
                    <Heart className="h-8 w-8 text-[#D4AF78]" />
                  </div>
                  <h4 className="mt-4 text-xl font-bold text-[#F5EBDD]">No saved items yet</h4>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#B8AA96]">
                    Click the heart icon on any handmade craft to save your favorite pieces here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsWishlistOpen(false)}
                    className="btn-primary mt-6 text-xs uppercase tracking-wider"
                  >
                    Browse Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistedProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#191713] p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition duration-300 hover:border-[rgba(212,175,120,0.55)]"
                    >
                      <div className="flex gap-3.5">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#0B0B0A] border border-[rgba(212,175,120,0.2)]">
                          <img
                            src={product.image}
                            alt={product.title}
                            onError={(e) => {
                              e.currentTarget.src = fallbackCraftImage
                            }}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="truncate font-serif text-lg font-bold text-[#F5EBDD]">{product.title}</h5>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleWishlist(product.id)
                                }}
                                aria-label="Remove from wishlist"
                                className="text-[#B8AA96] transition hover:text-rose-400 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#B8AA96]">
                              {product.category}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="text-base font-extrabold text-[#D4AF78]">{product.price}</span>
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(product, 1)
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF78] hover:bg-[#E5C18A] border border-[#D4AF78] px-3.5 py-1.5 text-xs font-bold text-[#0B0B0A] shadow-sm transition"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              Add to Bag
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              </div>

              {/* Subtle bottom scroll fade */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-[#0B0B0A] to-transparent" />
            </div>

            {wishlistedProducts.length > 0 && (
              <div className="shrink-0 border-t border-[rgba(212,175,120,0.25)] bg-[#12110F] p-5 shadow-lg z-10">
                <button
                  type="button"
                  onClick={moveAllWishlistToCart}
                  className="btn-primary w-full shadow-[0_6px_20px_rgba(212,175,120,0.25)] justify-center font-bold tracking-wide"
                >
                  <Sparkles className="h-4 w-4" />
                  Move All to Cart & Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

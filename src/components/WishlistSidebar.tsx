"use client"

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Heart, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { useUIModals } from '../context/UIModalContext'
import { fallbackAquariumImage, fallbackCraftImage } from '../utils/fallbackImage'
import { lockScroll, unlockScroll } from '../utils/scrollLock'
import { getWorldModalTheme } from '../utils/worldTheme'

export default function WishlistSidebar() {
  const { isWishlistOpen, setIsWishlistOpen } = useUIModals()
  const {
    wishlistedProducts,
    toggleWishlist,
    addToCart,
    moveAllWishlistToCart,
    isAquaticTheme,
  } = useMarketplace()
  const wt = getWorldModalTheme(isAquaticTheme)

  useEffect(() => {
    if (isWishlistOpen) {
      lockScroll()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsWishlistOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        unlockScroll()
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isWishlistOpen, setIsWishlistOpen])

  return (
    <AnimatePresence>
      {isWishlistOpen ? (
        <>
          <motion.div
            key="wishlist-overlay"
            className={`fixed inset-0 z-[80] ${wt.backdrop} touch-none`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={() => setIsWishlistOpen(false)}
          />

          <motion.aside
            key="wishlist-drawer"
            className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col overflow-hidden ${wt.drawer} shadow-2xl transform-gpu will-change-transform touch-auto overscroll-contain`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`flex shrink-0 items-center justify-between ${wt.header} px-6 py-5 z-10 shadow-xs`}>
              <div className="flex items-center gap-2.5">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${wt.well} font-extrabold shadow-xs`}>
                  <Heart
                    className={`h-5 w-5 ${
                      isAquaticTheme
                        ? 'fill-[#F43F5E] text-[#F43F5E]'
                        : 'fill-[#B68D52] text-[#B68D52]'
                    }`}
                  />
                </div>
                <div>
                  <h3 className={`font-tagline text-2xl font-bold ${wt.title}`}>Saved Treasures</h3>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${wt.muted}`}>
                    {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} saved
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close wishlist"
                onClick={() => setIsWishlistOpen(false)}
                className={`grid h-10 w-10 place-items-center rounded-full shadow-xs transition ${wt.closeBtn}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List with Soft Vignettes and Refined Scroller */}
            <div className="relative flex-1 min-h-0">
              <div className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b ${wt.topFade}`} />

              <div className="h-full sidebar-scroller p-4 sm:p-5 sm:pr-4">
                {wishlistedProducts.length === 0 ? (
                <div className={`flex h-full flex-col items-center justify-center rounded-3xl ${wt.insetDashed} p-8 text-center`}>
                  <div className={`grid h-16 w-16 place-items-center rounded-full ${wt.well}`}>
                    <Heart className={`h-8 w-8 ${isAquaticTheme ? 'text-[#F43F5E]' : 'text-[#B68D52]'}`} />
                  </div>
                  <h4 className={`mt-4 font-tagline text-xl font-bold ${wt.title}`}>No saved items yet</h4>
                  <p className={`mt-2 max-w-xs text-sm leading-relaxed ${wt.muted}`}>
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
                      className={`group overflow-hidden rounded-2xl ${wt.inset} p-3.5 shadow-[0_4px_16px_rgba(68,52,32,0.08)] transition duration-300 ${
                        isAquaticTheme ? 'hover:border-emerald-400/55' : 'hover:border-[#B68D52]/65'
                      }`}
                    >
                      <div className="flex gap-3.5">
                        <div
                          className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border ${
                            isAquaticTheme
                              ? 'bg-[#081D30] border-sky-400/25'
                              : 'bg-[#EFE8DC] border-[#6D5738]/20'
                          }`}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            onError={(e) => {
                              e.currentTarget.src =
                                product.department === 'aquarium'
                                  ? fallbackAquariumImage
                                  : fallbackCraftImage
                            }}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h5 className={`truncate font-tagline text-lg font-bold ${wt.title}`}>{product.title}</h5>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleWishlist(product.id)
                                }}
                                aria-label="Remove from wishlist"
                                className={`${wt.muted} transition hover:text-rose-500 cursor-pointer`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${wt.accentText}`}>
                              {product.category}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className={`text-base font-extrabold ${wt.title}`}>{product.price}</span>
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(product, 1)
                              }}
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-xs transition ${
                                isAquaticTheme
                                  ? 'bg-[#E11D48] hover:bg-[#F43F5E] border border-rose-400/50 text-white'
                                  : 'bg-[#D4AF78] hover:bg-[#E5C18A] border border-[#C69C5D] text-[#141210]'
                              }`}
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
              <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t ${wt.bottomFade}`} />
            </div>

            {wishlistedProducts.length > 0 && (
              <div className={`shrink-0 border-t p-5 shadow-lg z-10 ${isAquaticTheme ? 'border-sky-400/20 bg-[#081D30]' : 'border-[#6D5738]/20 bg-[#FCF9F4]'}`}>
                <button
                  type="button"
                  onClick={moveAllWishlistToCart}
                  className="btn-primary w-full justify-center font-bold tracking-wide"
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

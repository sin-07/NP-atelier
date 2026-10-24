"use client"

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Gift,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  Mail,
  MessageCircle,
  X,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage } from '../utils/fallbackImage'

export default function CartSidebar() {
  const {
    cartItems,
    cartSubtotal,
    cartFinalTotal,
    discountAmount,
    shippingCost,
    giftWrapCost,
    isGiftWrap,
    setIsGiftWrap,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsAuthOpen,
    showToast,
    user,
    setCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    branding,
  } = useMarketplace()

  const contactPhone = (branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '') || '919341297124'
  const displayPhone = branding?.contactPhone || '+91 93412 97124'
  const siteName = branding?.siteName || 'NP Atelier'

  useEffect(() => {
    if (isCartOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isCartOpen])

  const [couponInput, setCouponInput] = useState('')

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    applyCouponCode(couponInput)
    setCouponInput('')
  }

  const handleProceedToCheckout = () => {
    if (!user) {
      showToast({
        title: 'Sign In Required',
        message: 'Please sign in or create an account to place your order.',
        type: 'info',
      })
      setIsCartOpen(false)
      setIsAuthOpen(true)
      return
    }
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <>
          <motion.div
            key="cart-backdrop"
            aria-label="Close cart overlay"
            className="fixed inset-0 z-[80] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          <motion.aside
            key="cart-sidebar"
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col overflow-hidden border-l border-[#D4AF37]/30 bg-[#FAF7F2] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#DFCFA6]/60 bg-gradient-to-r from-white via-[#FDFBF7] to-[#FAF6ED] px-6 py-5 z-10 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#996515] text-[#1A120B] font-extrabold shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#141414] font-bold">Your Shopping Bag</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C827A]">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setIsCartOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#DFCFA6]/60 bg-white text-[#141414] shadow-sm transition hover:bg-[#FAF6ED] hover:border-[#D4AF37]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List with Soft Vignettes and Refined Scroller */}
            <div className="relative flex-1 min-h-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-[#FAF7F2] to-transparent" />

              <div className="h-full sidebar-scroller p-4 sm:p-5 sm:pr-4">
                {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-[#DDD7CE] bg-white p-8 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#EFECE6] text-[#141414]">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h4 className="mt-4 text-xl font-bold text-[#141414]">Your bag is empty</h4>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#5A554E]">
                    Explore our handmade jewelry, candles, and custom gifts to fill your bag.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="btn-primary mt-6 text-xs uppercase tracking-wider"
                  >
                    Explore Marketplace
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const priceNum = Number.parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0
                    const itemTotal = priceNum * item.quantity

                    return (
                      <article
                        key={item.cartItemId}
                        className="group overflow-hidden rounded-2xl border border-[#DFCFA6]/60 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]/80 p-3.5 shadow-[0_4px_16px_rgba(180,135,45,0.05)] transition duration-200 hover:border-[#D4AF37]/80"
                      >
                        <div className="flex gap-3.5">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F7F2E6] border border-[#DFCFA6]/40">
                            <img
                              src={item.image}
                              alt={item.title}
                              onError={(e) => {
                                e.currentTarget.src = fallbackCraftImage
                              }}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h5 className="truncate font-serif text-lg font-bold text-[#141414]">{item.title}</h5>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  aria-label="Remove item"
                                  className="text-[#8C827A] transition hover:text-rose-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                                {item.category}
                              </p>
                              {item.customization && (
                                <p className="mt-0.5 text-[10px] text-[#5A554E] font-medium">
                                  Bespoke: {item.customization.palette}
                                  {item.customization.personalization ? ` • "${item.customization.personalization}"` : ''}
                                </p>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              {/* Quantity Stepper */}
                              <div className="flex items-center gap-2 rounded-full border border-[#DDD7CE] bg-[#FAF8F5] px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => setCartQuantity(item.cartItemId, item.quantity - 1)}
                                  className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#141414] shadow-sm transition hover:bg-[#EFECE6]"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-5 text-center text-xs font-bold text-[#141414]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCartQuantity(item.cartItemId, item.quantity + 1)}
                                  className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#141414] shadow-sm transition hover:bg-[#EFECE6]"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <span className="text-sm font-extrabold text-[#141414]">₹{itemTotal.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
              </div>

              {/* Subtle bottom scroll fade */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="shrink-0 border-t border-[#EAE5DC] bg-white p-5 shadow-lg z-10">
                {/* Promo Code Input */}
                <div className="mb-3.5">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-[#EFECE6] border border-[#DDD7CE] px-3.5 py-2 text-xs font-bold text-[#141414]">
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-[#141414]" />
                        Code {appliedCoupon.code} Applied ({appliedCoupon.label})
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-[#5A554E] underline hover:text-rose-500"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8C827A]" />
                          <input
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Coupon code..."
                            className="h-9 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] pl-8 pr-3 text-xs text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
                          />
                        </div>
                        <button
                          type="submit"
                          className="rounded-xl bg-gradient-to-r from-[#1A120B] to-[#2E2010] border border-[#D4AF37]/40 px-3.5 text-xs font-bold text-[#F2D785] transition hover:border-[#D4AF37] hover:shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                        >
                          Apply
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-[#5A554E]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#141414]">₹{cartSubtotal.toFixed(0)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-bold text-[#B8860B]">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shippingCost.toFixed(0)}</span>
                  </div>
                  <div className="border-t border-[#DFCFA6]/60 pt-2 flex justify-between text-base font-bold text-[#141414]">
                    <span>Estimated Total</span>
                    <span className="text-xl text-[#875A10] font-extrabold">₹{cartFinalTotal.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="btn-gold mt-4 w-full py-3.5 shadow-[0_6px_20px_rgba(212,175,55,0.35)] justify-center font-bold tracking-wide flex items-center gap-2"
                >
                  {!user ? (
                    <>
                      <Lock className="h-4 w-4 text-[#1A120B]" />
                      <span>Sign In to Place Order</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 fill-current" />
                      <span>Proceed to Order on WhatsApp</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                {user ? (
                  <p className="mt-2 text-center text-[11px] text-[#7A5408] flex items-center justify-center gap-1 font-semibold">
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Direct WhatsApp checkout with verified instant receipt</span>
                  </p>
                ) : (
                  <p className="mt-2 text-center text-[11px] text-[#8C827A] flex items-center justify-center gap-1 font-medium">
                    <Lock className="h-3 w-3 text-[#B8860B]" />
                    <span>Login is required before ordering to track delivery &amp; warranty</span>
                  </p>
                )}

                {/* Concierge Order Assistance */}
                <div className="mt-3 rounded-xl border border-[#D4AF37]/35 bg-gradient-to-r from-[#FAF6ED] to-[#F5ECD5] p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5408]">
                    Questions or Custom Requirements?
                  </p>
                  <div className="mt-1.5 flex items-center justify-center gap-3 text-[11px] font-bold">
                    <a
                      href={`https://wa.me/${contactPhone}?text=Hi%20${encodeURIComponent(siteName)}%2C%20I%20need%20assistance%20with%20my%20bag%20order!`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 transition"
                      title={`WhatsApp ${displayPhone}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{displayPhone}</span>
                    </a>
                    <span className="text-[#D4AF37]">•</span>
                    <a
                      href="mailto:npatelierindia@gmail.com"
                      className="inline-flex items-center gap-1 text-[#5C4106] hover:text-[#141414] transition"
                      title="Email npatelierindia@gmail.com"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email Us</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
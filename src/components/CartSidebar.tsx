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
  MapPin,
  CheckCircle2,
  X,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { useUIModals } from '../context/UIModalContext'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { getSavedShippingAddress, formatAddressOneLine } from '../utils/addressStorage'
import { buildCartWhatsAppMessage, sendWhatsAppOrder } from '../utils/whatsappOrder'
import { lockScroll, unlockScroll } from '../utils/scrollLock'

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, setIsCheckoutOpen, setIsAuthOpen } = useUIModals()
  const {
    cartItems,
    cartSubtotal,
    cartFinalTotal,
    discountAmount,
    shippingCost,
    giftWrapCost,
    isGiftWrap,
    setIsGiftWrap,
    showToast,
    user,
    setCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    createOrder,
    branding,
    selectedRegion,
  } = useMarketplace()

  const contactPhone = (branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '') || '919341297124'
  const displayPhone = branding?.contactPhone || '+91 93412 97124'
  const siteName = branding?.siteName || 'NP Atelier'

  const freeShippingThreshold = 999
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal)
  const isFreeShippingUnlocked = cartSubtotal >= freeShippingThreshold
  const shippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))

  useEffect(() => {
    if (isCartOpen) {
      lockScroll()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsCartOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        unlockScroll()
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isCartOpen, setIsCartOpen])

  const [couponInput, setCouponInput] = useState('')

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    applyCouponCode(couponInput)
    setCouponInput('')
  }

  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleDirectWhatsAppOrder = async () => {
    if (cartItems.length === 0) return

    const saved = getSavedShippingAddress()
    const customerName = (saved?.fullName || (user?.name && user.name !== 'Patron of NP Atelier' ? user.name : '')) || 'Customer'
    const customerPhone = saved?.phone || (user?.phone && user.phone !== '+91 93412 97124' ? user.phone : '')
    const customerAddr = saved?.address
      ? formatAddressOneLine(saved)
      : user?.address && user.address !== 'Civil Lines, Royal Heritage Residency'
        ? `${user.address}, ${user.city || ''}, ${user.state || ''} - ${user.pincode || ''}`
        : 'Will provide on WhatsApp'

    const order = await createOrder({
      fullName: customerName,
      phone: customerPhone,
      email: saved?.email || user?.email || 'whatsapp-order@npatelier.in',
      address: saved?.address || user?.address || 'Provided via WhatsApp chat',
      city: saved?.city || user?.city || 'India',
      state: saved?.state || user?.state || '',
      zip: saved?.zip || user?.pincode || '',
      paymentMethod: 'WhatsApp Order Confirmation',
    })

    const orderId = order?.orderId || `CRFT-${Math.floor(100000 + Math.random() * 900000)}`

    const waMessage = buildCartWhatsAppMessage({
      storeName: siteName,
      orderId,
      customerName,
      customerPhone,
      customerAddress: customerAddr,
      cartItems,
      subtotal: cartSubtotal,
      discountAmount,
      couponCode: appliedCoupon?.code,
      shippingCost,
      total: cartFinalTotal,
      paymentMethod: 'WhatsApp Order Confirmation (Pay on Delivery / UPI)',
    })

    setIsCartOpen(false)
    await sendWhatsAppOrder({
      phone: contactPhone,
      message: waMessage,
      imageUrl: cartItems[0]?.image,
      imageFilename: `${(cartItems[0]?.title || 'cart-order').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`,
    })
  }

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <>
          <motion.div
            key="cart-backdrop"
            aria-label="Close cart overlay"
            className="fixed inset-0 z-[80] bg-[#141210]/45 backdrop-blur-xs touch-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={() => setIsCartOpen(false)}
          />

          <motion.aside
            key="cart-sidebar"
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col overflow-hidden border-l border-[#6D5738]/25 bg-[#F5F0E8] shadow-2xl transform-gpu will-change-transform touch-auto overscroll-contain"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#6D5738]/20 bg-[#FCF9F4] px-6 py-5 z-10 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E5C18A] to-[#D4AF78] text-[#141210] font-extrabold shadow-xs">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-tagline text-2xl text-[#141210] font-bold">Your Shopping Bag</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C4D3C]">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setIsCartOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#6D5738]/25 bg-[#F5F0E8] text-[#141210] shadow-xs transition hover:bg-[#EFE8DC] hover:border-[#B68D52] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping / Fragile Courier Milestone Bar */}
            {cartItems.length > 0 && (
              <div className="shrink-0 border-b border-[#6D5738]/15 bg-[#FAF6EF] px-6 py-3">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-[#141210]">
                    <Truck className="h-3.5 w-3.5 text-[#7A5B32]" />
                    {isFreeShippingUnlocked ? (
                      <span className="text-[#7A5B32] font-bold">
                        ✦ Unlocked: Complimentary Fragile Transit!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-[#7A5B32]">₹{remainingForFreeShipping.toFixed(0)}</strong> for Free Fragile Delivery
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#5C4D3C]">
                    {shippingProgress}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EFE8DC] border border-[#6D5738]/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#B68D52] via-[#D4AF78] to-[#B68D52] transition-all duration-300"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items List with Soft Vignettes and Refined Scroller */}
            <div className="relative flex-1 min-h-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-[#F5F0E8] to-transparent" />

              <div className="h-full sidebar-scroller p-4 sm:p-5 sm:pr-4">
                {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-[#6D5738]/30 bg-[#FCF9F4] p-8 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#EFE8DC] border border-[#6D5738]/25 text-[#7A5B32]">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h4 className="mt-4 font-tagline text-xl font-bold text-[#141210]">Your bag is empty</h4>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#5C4D3C]">
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
                        className="group overflow-hidden rounded-2xl border border-[#6D5738]/20 bg-[#FCF9F4] p-3.5 shadow-[0_4px_16px_rgba(68,52,32,0.08)] transition duration-200 hover:border-[#B68D52]"
                      >
                        <div className="flex gap-3.5">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#EFE8DC] border border-[#6D5738]/20">
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
                                <h5 className="truncate font-tagline text-lg font-bold text-[#141210]">{item.title}</h5>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  aria-label="Remove item"
                                  className="text-[#5C4D3C] transition hover:text-rose-600 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A5B32]">
                                {item.category}
                              </p>
                              {item.customization && (
                                <p className="mt-0.5 text-[10px] text-[#5C4D3C] font-medium">
                                  Bespoke: {item.customization.palette}
                                  {item.customization.personalization ? ` • "${item.customization.personalization}"` : ''}
                                </p>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              {/* Quantity Stepper */}
                              <div className="flex items-center gap-2 rounded-full border border-[#6D5738]/25 bg-[#F5F0E8] px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => setCartQuantity(item.cartItemId, item.quantity - 1)}
                                  className="grid h-6 w-6 place-items-center rounded-full bg-[#EFE8DC] text-[#141210] shadow-xs transition hover:bg-[#E5DCCD] hover:text-[#7A5B32] cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-5 text-center text-xs font-bold text-[#141210]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCartQuantity(item.cartItemId, item.quantity + 1)}
                                  className="grid h-6 w-6 place-items-center rounded-full bg-[#EFE8DC] text-[#141210] shadow-xs transition hover:bg-[#E5DCCD] hover:text-[#7A5B32] cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <span className="text-sm font-extrabold text-[#141210]">₹{itemTotal.toFixed(0)}</span>
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
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-[#F5F0E8] to-transparent" />
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="shrink-0 border-t border-[#6D5738]/20 bg-[#FCF9F4] p-5 shadow-lg z-10">
                {/* Promo Code Input */}
                <div className="mb-3.5">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-[#F5F0E8] border border-[#6D5738]/25 px-3.5 py-2 text-xs font-bold text-[#141210]">
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-[#7A5B32]" />
                        Code {appliedCoupon.code} Applied ({appliedCoupon.label})
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-[#5C4D3C] underline hover:text-rose-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7A5B32]" />
                          <input
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Coupon code..."
                            className="h-9 w-full rounded-xl border border-[#6D5738]/25 bg-[#F5F0E8] pl-8 pr-3 text-xs text-[#141210] placeholder:text-[#5C4D3C]/60 outline-none transition focus:border-[#B68D52] focus:ring-1 focus:ring-[#D4AF78]/40"
                          />
                        </div>
                        <button
                          type="submit"
                          className="rounded-xl bg-[#D4AF78] hover:bg-[#E5C18A] text-[#141210] font-bold px-3.5 text-xs transition shadow-xs cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-[#5C4D3C]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#141210]">₹{cartSubtotal.toFixed(0)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-bold text-[#7A5B32]">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <span>Regional Delivery</span>
                      {selectedRegion && (
                        <span className="rounded bg-[#EFE8DC] border border-[#6D5738]/25 px-1.5 py-0.2 text-[9px] font-extrabold uppercase text-[#7A5B32]">
                          {selectedRegion}
                        </span>
                      )}
                    </span>
                    <span className="text-[#141210] font-bold">₹{shippingCost.toFixed(0)}</span>
                  </div>
                  <div className="border-t border-[#6D5738]/20 pt-2 flex justify-between text-base font-bold text-[#141210]">
                    <span>Estimated Total</span>
                    <span className="text-xl text-[#141210] font-extrabold">₹{cartFinalTotal.toFixed(0)}</span>
                  </div>
                </div>

                {/* Saved Address Preview */}
                {(() => {
                  const saved = getSavedShippingAddress()
                  const hasSaved = Boolean(saved?.address || (user?.address && user.address !== 'Civil Lines, Royal Heritage Residency'))
                  const displayName = saved?.fullName || (user?.name && user.name !== 'Patron of NP Atelier' ? user.name : 'Patron')
                  const displayCity = saved?.city || user?.city || 'Your Location'

                  if (!hasSaved) return null

                  return (
                    <div className="mt-3 rounded-xl border border-[#6D5738]/25 bg-[#F5F0E8] px-3 py-2 text-xs flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="h-3.5 w-3.5 text-[#7A5B32] shrink-0" />
                        <span className="truncate text-[#5C4D3C] text-[11px]">
                          <strong className="text-[#141210]">Deliver to:</strong> {displayName} ({displayCity})
                        </span>
                        <span className="shrink-0 text-[10px] font-bold text-[#7A5B32] bg-[#FCF9F4] rounded-full px-1.5 py-0.5 border border-[#6D5738]/25">
                          Saved ✓
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleProceedToCheckout}
                        className="text-[10px] font-bold text-[#7A5B32] underline hover:text-[#141210] shrink-0 ml-1.5 cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  )
                })()}

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={handleDirectWhatsAppOrder}
                    className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#D4AF78] via-[#ECC872] to-[#D4AF78] hover:brightness-105 text-[#141210] font-extrabold text-sm shadow-[0_4px_18px_rgba(182,141,82,0.28)] transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
                  >
                    <MessageCircle className="h-5 w-5 fill-current" />
                    <span>Order Entire Bag on WhatsApp • ₹{cartFinalTotal.toFixed(0)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-2.5 px-4 rounded-full border border-[#6D5738]/25 bg-[#F5F0E8] hover:bg-[#EFE8DC] hover:border-[#B68D52] text-xs font-bold text-[#141210] transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#7A5B32]" />
                    <span>
                      {getSavedShippingAddress()?.address || (user?.address && user.address !== 'Civil Lines, Royal Heritage Residency')
                        ? 'Review / Change Delivery Address'
                        : 'Add Delivery Address & Order on WhatsApp'}
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#5C4D3C] bg-[#F5F0E8] border border-[#6D5738]/20 rounded-full py-1.5 px-3">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#7A5B32] shrink-0" />
                    <span>100% WhatsApp Direct Orders • COD &amp; Live Tracking</span>
                  </div>
                </div>

                {/* Concierge Order Assistance */}
                <div className="mt-3 rounded-xl border border-[#6D5738]/20 bg-[#F5F0E8] p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B32]">
                    Questions or Custom Requirements?
                  </p>
                  <div className="mt-1.5 flex items-center justify-center gap-3 text-[11px] font-bold">
                    <a
                      href={`https://wa.me/${contactPhone}?text=Hi%20${encodeURIComponent(siteName)}%2C%20I%20need%20assistance%20with%20my%20bag%20order!`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-600 transition"
                      title={`WhatsApp ${displayPhone}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{displayPhone}</span>
                    </a>
                    <span className="text-[#7A5B32]">•</span>
                    <a
                      href="mailto:npatelierindia@gmail.com"
                      className="inline-flex items-center gap-1 text-[#5C4D3C] hover:text-[#141210] transition"
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
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
import { fallbackCraftImage } from '../utils/fallbackImage'
import { getSavedShippingAddress, formatAddressOneLine } from '../utils/addressStorage'

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
    createOrder,
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
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleDirectWhatsAppOrder = async () => {
    if (cartItems.length === 0) return

    const itemsText = cartItems
      .map((item: any, idx: number) => {
        const customText = item.customization
          ? ` [Custom: ${item.customization.palette || ''}${
              item.customization.personalization ? ` / "${item.customization.personalization}"` : ''
            }]`
          : ''
        return `${idx + 1}. *${item.title}* x ${item.quantity} (${item.price})${customText}`
      })
      .join('\n')

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
    const discountText =
      discountAmount > 0
        ? `• *Discount:* -₹${discountAmount.toFixed(0)} (${appliedCoupon?.code || 'COUPON'})\n`
        : ''

    const waMessage = `*✦ NEW WHATSAPP ORDER ✦*
*Store:* ${siteName}
*Order Reference:* #${orderId}
*Date:* ${new Date().toLocaleDateString('en-IN')}

*CUSTOMER DETAILS:*
• *Name:* ${customerName}
${customerPhone ? `• *Mobile:* ${customerPhone}\n` : ''}• *Delivery Address:* ${customerAddr}

*ORDERED ITEMS (${cartItems.length}):*
${itemsText}

*PAYMENT & TOTAL:*
• *Items Subtotal:* ₹${cartSubtotal.toFixed(0)}
${discountText}• *Courier Shipping:* ₹${shippingCost.toFixed(0)}
• *Total Payable:* ₹${cartFinalTotal.toFixed(0)}
• *Payment Mode:* WhatsApp Order Confirmation (Pay on Delivery / UPI)

_Please confirm my order, availability, and dispatch tracking details!_`

    const finalWaUrl = `https://wa.me/${contactPhone}?text=${encodeURIComponent(waMessage)}`

    setIsCartOpen(false)
    if (typeof window !== 'undefined') {
      window.open(finalWaUrl, '_blank')
    }
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
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col overflow-hidden border-l border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[rgba(212,175,120,0.25)] bg-[#191713] px-6 py-5 z-10 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E5C18A] to-[#D4AF78] text-[#0B0B0A] font-extrabold shadow-[0_2px_10px_rgba(212,175,120,0.3)]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#F5EBDD] font-bold">Your Shopping Bag</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8AA96]">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setIsCartOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(212,175,120,0.25)] bg-[#12110F] text-[#F5EBDD] shadow-sm transition hover:bg-[#191713] hover:border-[#D4AF78] hover:text-[#E5C18A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List with Soft Vignettes and Refined Scroller */}
            <div className="relative flex-1 min-h-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-[#0B0B0A] to-transparent" />

              <div className="h-full sidebar-scroller p-4 sm:p-5 sm:pr-4">
                {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-[rgba(212,175,120,0.25)] bg-[#191713] p-8 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#12110F] border border-[rgba(212,175,120,0.25)] text-[#D4AF78]">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h4 className="mt-4 text-xl font-bold text-[#F5EBDD]">Your bag is empty</h4>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#B8AA96]">
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
                        className="group overflow-hidden rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#191713] p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition duration-200 hover:border-[#D4AF78]"
                      >
                        <div className="flex gap-3.5">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)]">
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
                                <h5 className="truncate font-serif text-lg font-bold text-[#F5EBDD]">{item.title}</h5>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  aria-label="Remove item"
                                  className="text-[#B8AA96] transition hover:text-rose-400 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF78]">
                                {item.category}
                              </p>
                              {item.customization && (
                                <p className="mt-0.5 text-[10px] text-[#B8AA96] font-medium">
                                  Bespoke: {item.customization.palette}
                                  {item.customization.personalization ? ` • "${item.customization.personalization}"` : ''}
                                </p>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              {/* Quantity Stepper */}
                              <div className="flex items-center gap-2 rounded-full border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => setCartQuantity(item.cartItemId, item.quantity - 1)}
                                  className="grid h-6 w-6 place-items-center rounded-full bg-[#12110F] text-[#F5EBDD] shadow-sm transition hover:bg-[#191713] hover:text-[#D4AF78] cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-5 text-center text-xs font-bold text-[#F5EBDD]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCartQuantity(item.cartItemId, item.quantity + 1)}
                                  className="grid h-6 w-6 place-items-center rounded-full bg-[#12110F] text-[#F5EBDD] shadow-sm transition hover:bg-[#191713] hover:text-[#D4AF78] cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <span className="text-sm font-extrabold text-[#F5EBDD]">₹{itemTotal.toFixed(0)}</span>
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
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-[#0B0B0A] to-transparent" />
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="shrink-0 border-t border-[rgba(212,175,120,0.25)] bg-[#191713] p-5 shadow-lg z-10">
                {/* Promo Code Input */}
                <div className="mb-3.5">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-[#12110F] border border-[rgba(212,175,120,0.25)] px-3.5 py-2 text-xs font-bold text-[#F5EBDD]">
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-[#D4AF78]" />
                        Code {appliedCoupon.code} Applied ({appliedCoupon.label})
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-[#B8AA96] underline hover:text-rose-400 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#D4AF78]" />
                          <input
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Coupon code..."
                            className="h-9 w-full rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] pl-8 pr-3 text-xs text-[#F5EBDD] placeholder:text-[#B8AA96]/50 outline-none transition focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40"
                          />
                        </div>
                        <button
                          type="submit"
                          className="rounded-xl bg-[#D4AF78] hover:bg-[#E5C18A] text-[#0B0B0A] font-bold px-3.5 text-xs transition shadow-xs cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-[#B8AA96]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#F5EBDD]">₹{cartSubtotal.toFixed(0)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-bold text-[#E5C18A]">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#F5EBDD]">₹{shippingCost.toFixed(0)}</span>
                  </div>
                  <div className="border-t border-[rgba(212,175,120,0.25)] pt-2 flex justify-between text-base font-bold text-[#F5EBDD]">
                    <span>Estimated Total</span>
                    <span className="text-xl text-[#D4AF78] font-extrabold">₹{cartFinalTotal.toFixed(0)}</span>
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
                    <div className="mt-3 rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#12110F] px-3 py-2 text-xs flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="h-3.5 w-3.5 text-[#D4AF78] shrink-0" />
                        <span className="truncate text-[#B8AA96] text-[11px]">
                          <strong className="text-[#F5EBDD]">Deliver to:</strong> {displayName} ({displayCity})
                        </span>
                        <span className="shrink-0 text-[10px] font-bold text-[#D4AF78] bg-[#0B0B0A] rounded-full px-1.5 py-0.5 border border-[rgba(212,175,120,0.3)]">
                          Saved ✓
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleProceedToCheckout}
                        className="text-[10px] font-bold text-[#D4AF78] underline hover:text-[#E5C18A] shrink-0 ml-1.5 cursor-pointer"
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
                    className="w-full py-3.5 px-4 rounded-full bg-[#D4AF78] hover:bg-[#E5C18A] text-[#0B0B0A] font-bold text-sm shadow-[0_4px_18px_rgba(212,175,120,0.25)] transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
                  >
                    <MessageCircle className="h-5 w-5 fill-current" />
                    <span>Order Entire Bag on WhatsApp • ₹{cartFinalTotal.toFixed(0)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-2.5 px-4 rounded-full border border-[rgba(212,175,120,0.25)] bg-[#12110F] hover:bg-[#191713] hover:border-[#D4AF78] text-xs font-bold text-[#F5EBDD] transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#D4AF78]" />
                    <span>
                      {getSavedShippingAddress()?.address || (user?.address && user.address !== 'Civil Lines, Royal Heritage Residency')
                        ? 'Review / Change Delivery Address'
                        : 'Add Delivery Address & Order on WhatsApp'}
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#B8AA96] bg-[#12110F] border border-[rgba(212,175,120,0.20)] rounded-full py-1.5 px-3">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF78] shrink-0" />
                    <span>100% WhatsApp Direct Orders • COD &amp; Live Tracking</span>
                  </div>
                </div>

                {/* Concierge Order Assistance */}
                <div className="mt-3 rounded-xl border border-[rgba(212,175,120,0.20)] bg-[#12110F] p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF78]">
                    Questions or Custom Requirements?
                  </p>
                  <div className="mt-1.5 flex items-center justify-center gap-3 text-[11px] font-bold">
                    <a
                      href={`https://wa.me/${contactPhone}?text=Hi%20${encodeURIComponent(siteName)}%2C%20I%20need%20assistance%20with%20my%20bag%20order!`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#D4AF78] hover:text-[#E5C18A] transition"
                      title={`WhatsApp ${displayPhone}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{displayPhone}</span>
                    </a>
                    <span className="text-[#D4AF78]">•</span>
                    <a
                      href="mailto:npatelierindia@gmail.com"
                      className="inline-flex items-center gap-1 text-[#B8AA96] hover:text-[#F5EBDD] transition"
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
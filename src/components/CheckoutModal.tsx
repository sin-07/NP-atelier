"use client"

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  Waves,
  X,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { lookupPincode } from '../utils/pincodeLookup'

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsAuthOpen,
    showToast,
    branding,
    cartItems,
    cartSubtotal,
    cartFinalTotal,
    discountAmount,
    shippingCost,
    giftWrapCost,
    appliedCoupon,
    createOrder,
    user,
  } = useMarketplace()

  const siteName = branding?.siteName || 'NP Atelier'
  const hasAquariumItems = cartItems.some(
    (item: any) => item.department === 'aquarium' || item.category?.toLowerCase().includes('fish') || item.category?.toLowerCase().includes('aquarium')
  )

  const [step, setStep] = useState('form') // 'form' | 'success'
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null)
  const [isLocatingPin, setIsLocatingPin] = useState(false)
  const [pinStatus, setPinStatus] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.pincode || '',
    paymentMethod: 'upi', // 'upi' | 'card' | 'cod'
    upiId: '',
    cardNumber: '',
    cardExp: '',
    cardCvc: '',
  })

  // Pre-fill user profile address whenever user logs in or modal opens
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        zip: prev.zip || user.pincode || '',
      }))
    }
  }, [user, isCheckoutOpen])

  // Handle live 6-digit Indian PIN code auto-fill in Checkout
  const handlePincodeChange = async (pinRaw: string) => {
    const cleanPin = pinRaw.replace(/[^0-9]/g, '').slice(0, 6)
    setFormData((prev) => ({ ...prev, zip: cleanPin }))

    if (cleanPin.length === 6) {
      setIsLocatingPin(true)
      setPinStatus('Detecting location...')
      try {
        const details = await lookupPincode(cleanPin)
        if (details && details.success) {
          setFormData((prev) => ({
            ...prev,
            zip: cleanPin,
            city: details.city,
            state: details.state,
          }))
          setPinStatus(`Auto-filled: ${details.city}, ${details.state}`)
        } else {
          setPinStatus(null)
        }
      } catch {
        setPinStatus(null)
      } finally {
        setIsLocatingPin(false)
      }
    } else {
      setPinStatus(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      showToast({
        title: 'Sign In Required',
        message: 'Please log in to your account before placing your order.',
        type: 'error',
      })
      setIsCheckoutOpen(false)
      setIsAuthOpen(true)
      return
    }
    const order = createOrder(formData)
    if (order) {
      setConfirmedOrder(order)
      setStep('success')
    }
  }

  const handleClose = () => {
    setIsCheckoutOpen(false)
    setTimeout(() => {
      setStep('form')
      setConfirmedOrder(null)
    }, 300)
  }

  return (
    <AnimatePresence>
      {isCheckoutOpen ? (
        <motion.div
          key="checkout-modal-backdrop"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center overflow-y-auto bg-black/70 p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="checkout-modal-card"
            className="relative my-0 sm:my-8 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[2.2rem] sm:rounded-[2.2rem] bg-white border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(180,135,45,0.22)]"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              aria-label="Close checkout modal"
              onClick={handleClose}
              className="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#DFCFA6]/60 bg-white text-[#141414] shadow-sm transition hover:bg-[#FAF6ED] hover:border-[#D4AF37]"
            >
              <X className="h-5 w-5" />
            </button>

            {!user ? (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#FAF3DE] to-[#faeed1] border-2 border-[#D4AF37]/50 text-[#855A10] shadow-[0_8px_25px_rgba(212,175,55,0.25)]">
                  <Lock className="h-9 w-9 text-[#855A10]" />
                </div>

                <div className="space-y-2">
                  <span className="section-eyebrow">Customer Account Required</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#141414]">
                    Sign In to Place Your Order
                  </h3>
                  <p className="mx-auto max-w-md text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                    To track your shipment in real time, receive delivery alerts, and safeguard your purchase with our certified live transit &amp; craft warranty, please sign in or register before ordering.
                  </p>
                </div>

                {/* Benefits Pill */}
                <div className="mx-auto max-w-md rounded-2xl border border-[#DFCFA6]/60 bg-[#FAF7F2] p-4 text-left text-xs text-[#5A554E] space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-[#141414]">
                    <Sparkles className="h-4 w-4 text-[#B8860B]" />
                    <span>Member Checkout Benefits:</span>
                  </div>
                  <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-[#4A4339]">
                    <li>Auto-populates your verified delivery address and state PIN code</li>
                    <li>Live SMS, email, and WhatsApp dispatch tracking</li>
                    <li>Official GST tax invoice and live arrival transit guarantee</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false)
                      setIsAuthOpen(true)
                    }}
                    className="btn-gold w-full sm:w-auto px-8 py-3.5 font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Sign In or Create Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto rounded-xl border border-[#DFCFA6] bg-white px-6 py-3.5 text-xs font-bold text-[#5A554E] hover:bg-[#FAF6ED] transition cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : step === 'form' ? (
              <div>
                <div className="border-b border-[#DFCFA6]/60 bg-gradient-to-r from-white via-[#FDFBF7] to-[#FAF6ED] px-6 py-6 sm:px-8 text-[#141414]">
                  <div className="flex items-center gap-2">
                    <span className="section-eyebrow">{siteName} Secure Checkout</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8C827A]">
                      <Lock className="h-3.5 w-3.5 text-[#B8860B]" /> 256-bit Encrypted • India
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-3xl text-[#141414] font-bold">Complete Your Order</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Signed In as {user.name} ({user.email})</span>
                    </span>
                    <span className="text-xs text-[#4A4339] font-medium hidden sm:inline">
                      • Direct from certified artisans and breeders
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
                  {/* Live Aquarium Care Banner if order has fish/aquariums */}
                  {hasAquariumItems && (
                    <div className="flex items-center gap-3 rounded-2xl border border-teal-300 bg-teal-50/90 p-3.5 text-xs text-teal-950 font-semibold shadow-xs">
                      <ShieldCheck className="h-5 w-5 text-teal-700 shrink-0" />
                      <div>
                        <span className="font-bold text-teal-900 block">Live Arrival & Fragile Glass Guarantee Included</span>
                        <span>Aquatics packed with pure oxygen and climate insulation. Glass aquariums ship with reinforced wooden corner crating.</span>
                      </div>
                    </div>
                  )}

                  {/* Order Summary Pill */}
                  <div className="rounded-2xl border border-[#DFCFA6]/80 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]/90 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#635B4F]">
                      <span>Order Items ({cartItems.length})</span>
                      <span className="text-[#7A5408] font-extrabold">Total: ₹{cartFinalTotal.toFixed(0)}</span>
                    </div>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {cartItems.map((item: any) => (
                        <div
                          key={item.cartItemId}
                          className="flex shrink-0 items-center gap-2 rounded-xl bg-white/95 border border-[#DFCFA6]/60 p-1.5 pr-3 text-xs"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.src = fallbackCraftImage
                            }}
                            className="h-9 w-9 rounded-lg object-cover"
                          />
                          <div>
                            <p className="max-w-[120px] truncate font-bold text-[#141414]">{item.title}</p>
                            <p className="text-[10px] text-[#635B4F]">{item.quantity}x • {item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Section */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#141414]">
                      <Truck className="h-4 w-4 text-[#B8860B]" /> 1. Shipping Details (India)
                    </h4>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#141414]">Full Name</label>
                        <input
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Ananya Sharma"
                          className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#141414]">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ananya@example.com"
                          className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#141414]">Mobile Number (for live tracking SMS)</label>
                        <input
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-[#141414] flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#B8860B]" />
                            <span>Postal PIN Code (6 Digits)</span>
                          </label>
                          <span className="text-[10px] text-[#8C7A58]">Auto-fills Location</span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={6}
                            required
                            value={formData.zip}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            placeholder="e.g. 560038"
                            className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 pr-20 text-sm font-bold text-[#141414] tracking-wider outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isLocatingPin ? (
                              <Loader2 className="h-3.5 w-3.5 text-[#B8860B] animate-spin" />
                            ) : formData.zip.length === 6 && formData.city ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            ) : null}
                          </div>
                        </div>
                        {pinStatus && (
                          <p className="mt-1 text-[10px] font-semibold text-[#875A10]">
                            {pinStatus}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#141414]">City / Capital</label>
                        <input
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. Bengaluru"
                          className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#141414]">State / Union Territory</label>
                        <input
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="e.g. Karnataka"
                          className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-bold text-[#141414]">Full Street Address</label>
                        <input
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Flat 402, Lotus Residency, MG Road"
                          className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#141414]">
                      <ShieldCheck className="h-4 w-4 text-[#B8860B]" /> 2. Payment Method
                    </h4>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {[
                        { id: 'upi', label: 'UPI Instant', icon: QrCode },
                        { id: 'card', label: 'Debit / Card', icon: CreditCard },
                        { id: 'cod', label: 'Pay on Delivery', icon: PackageCheck },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                            formData.paymentMethod === method.id
                              ? 'border-[#D4AF37] bg-gradient-to-b from-[#FFFDF9] to-[#FAF4E5] text-[#875A10] shadow-sm ring-1 ring-[#D4AF37]/40'
                              : 'border-[#DFCFA6]/60 bg-[#FAF8F5] text-[#5A554E] hover:border-[#D4AF37]'
                          }`}
                        >
                          <method.icon className="h-5 w-5" />
                          <span>{method.label}</span>
                        </button>
                      ))}
                    </div>

                    {formData.paymentMethod === 'upi' && (
                      <div className="mt-3 rounded-2xl border border-[#DFCFA6]/80 bg-[#FAF8F5] p-3.5">
                        <label className="mb-1 block text-xs font-bold text-[#141414]">Enter UPI ID / VPA</label>
                        <input
                          value={formData.upiId}
                          onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                          placeholder="username@okhdfcbank"
                          className="h-10 w-full rounded-xl border border-[#DFCFA6]/80 bg-white px-3 text-sm text-[#141414] outline-none focus:border-[#D4AF37]"
                        />
                        <p className="mt-1.5 text-[11px] text-[#8C827A]">
                          Google Pay, PhonePe, Paytm, and BHIM supported.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-1.5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF6ED] border border-[#DFCFA6]/80 p-4 text-xs text-[#5A554E]">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-[#141414]">₹{cartSubtotal.toFixed(0)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between font-bold text-[#B8860B]">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-₹{discountAmount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? <strong className="text-[#875A10]">FREE</strong> : `₹${shippingCost.toFixed(0)}`}</span>
                    </div>
                    {giftWrapCost > 0 && (
                      <div className="flex justify-between">
                        <span>Boutique Gift Wrapping</span>
                        <span>+₹{giftWrapCost.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="border-t border-[#DFCFA6]/60 pt-2 flex justify-between text-sm font-bold text-[#141414]">
                      <span>Total Due</span>
                      <span className="text-xl text-[#875A10] font-extrabold">₹{cartFinalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-gold w-full py-4 text-base shadow-[0_8px_25px_rgba(212,175,55,0.35)] justify-center font-bold tracking-wide"
                  >
                    <PackageCheck className="h-5 w-5" />
                    Place Order • ₹{cartFinalTotal.toFixed(0)}
                  </button>
                </form>
              </div>
            ) : (
              /* Success Celebration State */
              <div className="p-8 text-center sm:p-12">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#996515] text-[#1A120B] border border-[#F2D785] shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                  <CheckCircle2 className="h-10 w-10 text-[#1A120B]" />
                </div>

                <span className="section-eyebrow mt-5">Order Placed Successfully</span>
                <h3 className="mt-2 font-serif text-3xl sm:text-4xl text-[#141414] font-bold">
                  Thank You for Ordering from {siteName}!
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5A554E]">
                  We have received your order <strong className="text-[#875A10] font-extrabold">#{confirmedOrder?.orderId}</strong>.
                  Our team is now preparing your items with specialized care.
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[#DFCFA6]/80 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]/90 p-4 text-left shadow-sm">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#5A554E]">Estimated Delivery:</span>
                    <strong className="text-[#141414]">{confirmedOrder?.estimatedDelivery}</strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="font-semibold text-[#5A554E]">Shipping to:</span>
                    <strong className="text-[#141414]">{formData.fullName} ({formData.city})</strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="font-semibold text-[#5A554E]">Order Total:</span>
                    <strong className="text-[#875A10] font-extrabold">₹{confirmedOrder?.total?.toFixed(0)}</strong>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-gold"
                  >
                    Continue Exploring
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

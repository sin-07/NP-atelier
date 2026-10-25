"use client"

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Edit3,
  Loader2,
  Lock,
  MapPin,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  Waves,
  Mail,
  MessageCircle,
  X,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { lookupPincode } from '../utils/pincodeLookup'
import { getSavedShippingAddress, saveShippingAddress, findAddressByPhone } from '../utils/addressStorage'

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
    updateUser,
  } = useMarketplace()

  const siteName = branding?.siteName || 'NP Atelier'
  const hasAquariumItems = cartItems.some(
    (item: any) => item.department === 'aquarium' || item.category?.toLowerCase().includes('fish') || item.category?.toLowerCase().includes('aquarium')
  )

  const [step, setStep] = useState<'form' | 'success'>('form')
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null)
  const [waOrderUrl, setWaOrderUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocatingPin, setIsLocatingPin] = useState(false)
  const [pinStatus, setPinStatus] = useState<string | null>(null)
  const [hasSavedAddress, setHasSavedAddress] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [saveForFuture, setSaveForFuture] = useState(true)

  useEffect(() => {
    if (isCheckoutOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isCheckoutOpen])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'cod', // Pay on Delivery
    upiId: '',
    cardNumber: '',
    cardExp: '',
    cardCvc: '',
  })

  // Pre-fill user profile address whenever user logs in or modal opens
  useEffect(() => {
    if (!isCheckoutOpen) return

    const saved = getSavedShippingAddress()
    if (saved && (saved.address || saved.phone || saved.fullName)) {
      setFormData((prev) => ({
        ...prev,
        fullName: saved.fullName || prev.fullName || user?.name || '',
        email: saved.email || prev.email || user?.email || '',
        phone: saved.phone || prev.phone || user?.phone || '',
        address: saved.address || prev.address || user?.address || '',
        city: saved.city || prev.city || user?.city || '',
        state: saved.state || prev.state || user?.state || '',
        zip: saved.zip || prev.zip || user?.pincode || '',
      }))
      const hasFullSaved = Boolean(saved.address && (saved.phone || saved.fullName))
      setHasSavedAddress(hasFullSaved)
      setIsEditingAddress(!hasFullSaved)
    } else if (user) {
      const isCustomUser = Boolean(user.address && user.address !== 'Civil Lines, Royal Heritage Residency')
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
      setHasSavedAddress(isCustomUser)
      setIsEditingAddress(!isCustomUser)
    } else {
      setHasSavedAddress(false)
      setIsEditingAddress(true)
    }
  }, [user, isCheckoutOpen])

  // Handle phone number input with instant address-book lookup
  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({ ...prev, phone: val }))
    const cleanDigits = val.replace(/[^0-9]/g, '')
    if (cleanDigits.length >= 10) {
      const match = findAddressByPhone(val)
      if (match && match.address) {
        setFormData((prev) => ({
          ...prev,
          phone: val,
          fullName: prev.fullName || match.fullName || '',
          email: prev.email || match.email || '',
          address: match.address,
          city: match.city,
          state: match.state,
          zip: match.zip,
        }))
        setHasSavedAddress(true)
        setPinStatus(`✓ Welcome back ${match.fullName ? match.fullName : ''}! Saved address auto-filled.`)
      }
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      showToast({
        title: 'Bag is Empty',
        message: 'Please add items to your cart before placing an order.',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)

    // Build itemized list before clearing cart in createOrder
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

    try {
      const order = await createOrder(formData)
      if (order) {
        const contactPhone = (branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '')
        const targetPhone = contactPhone || '919341297124'
        const discountText =
          discountAmount > 0
            ? `• *Discount:* -₹${discountAmount.toFixed(0)} (${appliedCoupon?.code || 'COUPON'})\n`
            : ''

        const waMessage = `*✦ NEW ORDER CONFIRMATION ✦*
*Store:* ${siteName}
*Order ID:* #${order.orderId}
*Date:* ${order.date || new Date().toLocaleDateString('en-IN')}

*CUSTOMER DETAILS:*
• *Name:* ${formData.fullName}
• *Mobile:* ${formData.phone}
• *Email:* ${formData.email}
• *Delivery Address:* ${formData.address}, ${formData.city}, ${formData.state} - ${formData.zip}

*ORDERED ITEMS (${cartItems.length}):*
${itemsText}

*PAYMENT & TOTAL:*
• *Items Subtotal:* ₹${cartSubtotal.toFixed(0)}
${discountText}• *Courier Shipping:* ₹${shippingCost.toFixed(0)}
• *Total Payable:* ₹${cartFinalTotal.toFixed(0)}
• *Payment Mode:* Pay on Delivery (Cash on Delivery)

_Please confirm my order and share dispatch tracking details!_`

        const finalWaUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`
        setWaOrderUrl(finalWaUrl)
        setConfirmedOrder(order)
        setStep('success')

        if (saveForFuture) {
          saveShippingAddress(formData)
          if (updateUser) {
            updateUser({
              name: formData.fullName,
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.zip,
            })
          }
        }

        // Direct launch WhatsApp in new window/tab
        if (typeof window !== 'undefined') {
          try {
            window.open(finalWaUrl, '_blank')
          } catch (popupErr) {
            console.warn('Popup blocked by browser, user can click the button:', popupErr)
          }
        }
      }
    } catch (err) {
      console.error('Error placing order:', err)
      showToast({
        title: 'Order Placement Error',
        message: 'Could not complete your order. Please try again or chat with us on WhatsApp.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsCheckoutOpen(false)
    setTimeout(() => {
      setStep('form')
      setConfirmedOrder(null)
      setWaOrderUrl('')
    }, 300)
  }

  return (
    <AnimatePresence>
      {isCheckoutOpen ? (
        <motion.div
          key="checkout-modal-backdrop"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="checkout-modal-card"
            className="relative my-0 sm:my-8 w-full max-w-2xl max-h-[92vh] sidebar-scroller rounded-t-[2.2rem] sm:rounded-[2.2rem] bg-white border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(180,135,45,0.22)]"
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

            {step === 'form' ? (
              <div>
                <div className="border-b border-[#DFCFA6]/60 bg-gradient-to-r from-white via-[#FDFBF7] to-[#FAF6ED] px-6 py-6 sm:px-8 text-[#141414]">
                  <div className="flex items-center gap-2">
                    <span className="section-eyebrow">WhatsApp Direct Checkout</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8C827A]">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp Verified Desk • India
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-[#141414] font-bold">
                    Order Confirmation via WhatsApp
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {user ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Signed in as {user.name} ({user.email}) • Address auto-filled</span>
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#FAF5E8] px-2.5 py-0.5 text-[11px] font-bold text-[#875A10]">
                          <Sparkles className="h-3 w-3 text-[#B8860B]" />
                          <span>Guest Checkout • No password required</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCheckoutOpen(false)
                            setIsAuthOpen(true)
                          }}
                          className="text-[11px] font-bold text-[#875A10] underline hover:text-[#5C4106] cursor-pointer"
                        >
                          Have an account? Sign in
                        </button>
                      </div>
                    )}
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
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#141414]">
                        <Truck className="h-4 w-4 text-[#B8860B]" /> 1. Shipping Details (India)
                      </h4>
                      {hasSavedAddress && !isEditingAddress && (
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D2B] hover:text-[#5C4106] bg-white border border-[#DFCFA6] hover:border-[#D4AF37] px-3 py-1 rounded-xl transition shadow-2xs cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-[#B8860B]" />
                          <span>Change / Edit Address</span>
                        </button>
                      )}
                    </div>

                    {/* SAVED ADDRESS CARD (Fast 1-Click Checkout) */}
                    {hasSavedAddress && !isEditingAddress ? (
                      <div className="mt-3 rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC] p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#14120E] text-[#ECC872] shadow-xs shrink-0 mt-0.5">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-[#141414]">{formData.fullName || 'Patron'}</span>
                                {formData.phone && (
                                  <span className="text-xs font-mono font-bold text-[#7A5408] bg-[#FAF3DE] border border-[#E8D49E] px-2 py-0.5 rounded-md">
                                    {formData.phone}
                                  </span>
                                )}
                                <span className="rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                  <span>Saved Address • 1-Click Ready</span>
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-[#4A4339] font-medium leading-relaxed">
                                {formData.address ? `${formData.address}, ` : ''}{formData.city ? `${formData.city}, ` : ''}{formData.state ? `${formData.state} ` : ''}
                                {formData.zip && <span className="font-mono font-bold">- {formData.zip}</span>}
                              </p>
                              {formData.email && (
                                <p className="mt-1 text-[11px] text-[#786D5E]">Invoice will be sent to: {formData.email}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-[#DFCFA6]/60 flex items-center justify-between text-[11px] text-[#7A5408]">
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-[#B8860B]" />
                            <span>Your delivery address is pre-filled. No need to re-type!</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingAddress(true)}
                            className="text-[11px] font-bold text-[#8C6D2B] underline hover:text-[#5C4106] cursor-pointer"
                          >
                            Use Different Address
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* EDITABLE FORM INPUTS */
                      <div className="mt-3 space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
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
                            <label className="mb-1 block text-xs font-bold text-[#141414]">
                              Email Address <span className="text-[#8C827A] font-normal">(Optional for Invoice)</span>
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="your.email@example.com"
                              className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-[#141414]">
                                WhatsApp Mobile Number <span className="text-[#875A10]">(Order tracking)</span>
                              </label>
                            </div>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium font-mono"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-[#141414] flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-[#B8860B]" />
                                <span>Postal PIN Code (6 Digits)</span>
                              </label>
                              <span className="text-[10px] text-[#8C7A58]">Auto-fills City & State</span>
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

                        {/* Save Address Toggle & Cancel Option */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#DFCFA6]/50">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#4A4339]">
                            <input
                              type="checkbox"
                              checked={saveForFuture}
                              onChange={(e) => setSaveForFuture(e.target.checked)}
                              className="h-4 w-4 rounded accent-[#B8860B] border-[#DFCFA6] cursor-pointer"
                            />
                            <span>Remember & save this address for 1-click orders</span>
                          </label>
                          {hasSavedAddress && (
                            <button
                              type="button"
                              onClick={() => setIsEditingAddress(false)}
                              className="text-xs font-bold text-[#8C6D2B] hover:text-[#5C4106] underline cursor-pointer"
                            >
                              Cancel & Use Saved Address
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Section: Pay on Delivery Only */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#141414]">
                      <ShieldCheck className="h-4 w-4 text-[#B8860B]" /> 2. Payment Method
                    </h4>
                    <div className="mt-3 rounded-2xl border border-[#D4AF37] bg-gradient-to-b from-[#FFFDF9] via-[#FAF4E5] to-[#F7ECCF]/60 p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#14120E] text-[#ECC872] shadow-xs shrink-0">
                            <PackageCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#141414]">Pay on Delivery (Cash on Delivery)</p>
                            <p className="text-xs text-[#635B4F] mt-0.5">Pay comfortably to the courier executive upon parcel arrival.</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold shrink-0">
                          Selected ✓
                        </span>
                      </div>
                    </div>
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
                      <span>₹{shippingCost.toFixed(0)}</span>
                    </div>
                    <div className="border-t border-[#DFCFA6]/60 pt-2 flex justify-between text-sm font-bold text-[#141414]">
                      <span>Total Due</span>
                      <span className="text-xl text-[#875A10] font-extrabold">₹{cartFinalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold text-base shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.45)] transition-all flex items-center justify-center gap-3 tracking-wide cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Saving &amp; Opening WhatsApp...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                          <span>Place Order on WhatsApp • ₹{cartFinalTotal.toFixed(0)}</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-[#635B4F] flex items-center justify-center gap-1.5 font-medium">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Saves order to Admin Panel &amp; automatically launches WhatsApp with full order details</span>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Celebration State */
              <div className="p-8 text-center sm:p-12">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-2 border-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>

                <span className="section-eyebrow mt-5 text-emerald-800">Order Placed &amp; Dispatched to WhatsApp</span>
                <h3 className="mt-2 font-serif text-3xl sm:text-4xl text-[#141414] font-bold">
                  Thank You for Ordering from {siteName}!
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5A554E]">
                  Your order <strong className="text-emerald-800 font-extrabold">#{confirmedOrder?.orderId}</strong> is saved. If WhatsApp didn&apos;t open automatically, tap below to send your order receipt directly!
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
                    <strong className="text-[#875A10] font-extrabold">₹{confirmedOrder?.total?.toFixed(0)} (Pay on Delivery)</strong>
                  </div>
                </div>

                {/* Direct WhatsApp Launcher and Navigation Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={
                      waOrderUrl ||
                      `https://wa.me/${(branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '') || '919341297124'}?text=${encodeURIComponent(
                        `Hi ${siteName}, my order is #${confirmedOrder?.orderId} — please confirm dispatch!`
                      )}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white px-7 py-3.5 text-sm font-bold shadow-[0_8px_25px_rgba(16,185,129,0.35)] transition cursor-pointer"
                  >
                    <MessageCircle className="h-5 w-5 fill-current" />
                    <span>Send / Chat on WhatsApp ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto rounded-2xl border border-[#DFCFA6] bg-white px-6 py-3.5 text-sm font-bold text-[#5A554E] hover:bg-[#FAF6ED] transition cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Support and Tracking Info */}
                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50/90 to-teal-50/80 p-3.5 text-center shadow-xs">
                  <p className="text-xs font-bold text-emerald-900">
                    Official Support &amp; Live Dispatch Tracking
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={`https://wa.me/${(branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '') || '919341297124'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{branding?.contactPhone || '+91 93412 97124'}</span>
                    </a>
                    <a
                      href="mailto:npatelierindia@gmail.com"
                      className="inline-flex items-center gap-1.5 rounded-full bg-white border border-emerald-300 px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-50 transition"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>npatelierindia@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

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
import { buildCartWhatsAppMessage, sendWhatsAppOrder } from '../utils/whatsappOrder'

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
    deliverySettings,
    selectedRegion,
    setSelectedRegion,
  } = useMarketplace()

  const currentRegionKey = (selectedRegion || 'north').toLowerCase() as 'north' | 'south' | 'east' | 'west'
  const activeRegionConfig = deliverySettings?.regions?.[currentRegionKey] || deliverySettings?.regions?.north

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

          // Auto-detect matching region from state
          const cleanState = (details.state || '').trim().toLowerCase()
          let matchedRegion: 'north' | 'south' | 'east' | 'west' | null = null
          if (deliverySettings?.regions) {
            for (const [key, conf] of Object.entries(deliverySettings.regions as Record<string, any>)) {
              if (conf.states?.some((s: string) => cleanState.includes(s.toLowerCase()) || s.toLowerCase().includes(cleanState))) {
                matchedRegion = key as any
                break
              }
            }
          }

          if (matchedRegion && deliverySettings.regions[matchedRegion]?.enabled) {
            setSelectedRegion(matchedRegion)
            setPinStatus(
              `Auto-filled: ${details.city}, ${details.state} (${deliverySettings.regions[matchedRegion].name} Zone • ₹${deliverySettings.regions[matchedRegion].fee})`
            )
          } else {
            setPinStatus(`Auto-filled: ${details.city}, ${details.state}`)
          }
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
      const order = await createOrder({
        ...formData,
        deliveryRegion: activeRegionConfig?.name || 'North',
        deliveryRegionKey: currentRegionKey,
        deliveryFee: shippingCost,
      })
      if (order) {
        const contactPhone = (branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '')
        const targetPhone = contactPhone || '919341297124'

        const waMessage = buildCartWhatsAppMessage({
          storeName: siteName,
          orderId: order.orderId,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zip} (${activeRegionConfig?.name || 'North'} Region)`,
          cartItems,
          subtotal: cartSubtotal,
          discountAmount,
          couponCode: appliedCoupon?.code,
          shippingCost,
          total: cartFinalTotal,
          paymentMethod: 'Pay on Delivery (Cash on Delivery / UPI)',
        })

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

        // Direct launch WhatsApp with rich photo support & preview
        sendWhatsAppOrder({
          phone: targetPhone,
          message: waMessage,
          imageUrl: cartItems[0]?.image,
          imageFilename: `${(cartItems[0]?.title || 'order').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`,
        })
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
            className="relative my-0 sm:my-8 w-full max-w-2xl max-h-[92vh] sidebar-scroller rounded-t-[2.2rem] sm:rounded-[2.2rem] bg-[#191713] border border-[rgba(212,175,120,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              aria-label="Close checkout modal"
              onClick={handleClose}
              className="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border border-[rgba(212,175,120,0.25)] bg-[#12110F] text-[#F5EBDD] shadow-sm transition hover:bg-[#0B0B0A] hover:border-[#D4AF78]"
            >
              <X className="h-5 w-5" />
            </button>

            {step === 'form' ? (
              <div>
                <div className="border-b border-[rgba(212,175,120,0.25)] bg-[#12110F] px-6 py-6 sm:px-8 text-[#F5EBDD]">
                  <div className="flex items-center gap-2">
                    <span className="section-eyebrow">WhatsApp Direct Checkout</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B8AA96]">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp Verified Desk • India
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-[#F5EBDD] font-bold">
                    Order Confirmation via WhatsApp
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {user ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>Signed in as {user.name} ({user.email}) • Address auto-filled</span>
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-2.5 py-0.5 text-[11px] font-bold text-[#D4AF78]">
                          <Sparkles className="h-3 w-3 text-[#D4AF78]" />
                          <span>Guest Checkout • No password required</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCheckoutOpen(false)
                            setIsAuthOpen(true)
                          }}
                          className="text-[11px] font-bold text-[#D4AF78] underline hover:text-[#E5C18A] cursor-pointer"
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
                    <div className="flex items-center gap-3 rounded-2xl border border-teal-500/30 bg-teal-950/40 p-3.5 text-xs text-teal-200 font-semibold shadow-xs">
                      <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0" />
                      <div>
                        <span className="font-bold text-teal-300 block">Live Arrival & Fragile Glass Guarantee Included</span>
                        <span>Aquatics packed with pure oxygen and climate insulation. Glass aquariums ship with reinforced wooden corner crating.</span>
                      </div>
                    </div>
                  )}

                  {/* Order Summary Pill */}
                  <div className="rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#12110F] p-4 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#B8AA96]">
                      <span>Order Items ({cartItems.length})</span>
                      <span className="text-[#D4AF78] font-extrabold">Total: ₹{cartFinalTotal.toFixed(0)}</span>
                    </div>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sidebar-scroller">
                      {cartItems.map((item: any) => (
                        <div
                          key={item.cartItemId}
                          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#0B0B0A] border border-[rgba(212,175,120,0.2)] p-1.5 pr-3 text-xs"
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
                            <p className="max-w-[120px] truncate font-bold text-[#F5EBDD]">{item.title}</p>
                            <p className="text-[10px] text-[#B8AA96]">{item.quantity}x • {item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Section */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#F5EBDD]">
                        <Truck className="h-4 w-4 text-[#D4AF78]" /> 1. Shipping Details (India)
                      </h4>
                      {hasSavedAddress && !isEditingAddress && (
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF78] hover:text-[#E5C18A] bg-[#12110F] border border-[rgba(212,175,120,0.25)] hover:border-[#D4AF78] px-3 py-1 rounded-xl transition shadow-2xs cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-[#D4AF78]" />
                          <span>Change / Edit Address</span>
                        </button>
                      )}
                    </div>

                    {/* SAVED ADDRESS CARD (Fast 1-Click Checkout) */}
                    {hasSavedAddress && !isEditingAddress ? (
                      <div className="mt-3 rounded-2xl border border-[rgba(212,175,120,0.35)] bg-[#12110F] p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)] text-[#D4AF78] shadow-xs shrink-0 mt-0.5">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-[#F5EBDD]">{formData.fullName || 'Patron'}</span>
                                {formData.phone && (
                                  <span className="text-xs font-mono font-bold text-[#D4AF78] bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)] px-2 py-0.5 rounded-md">
                                    {formData.phone}
                                  </span>
                                )}
                                <span className="rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                  <span>Saved Address • 1-Click Ready</span>
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-[#B8AA96] font-medium leading-relaxed">
                                {formData.address ? `${formData.address}, ` : ''}{formData.city ? `${formData.city}, ` : ''}{formData.state ? `${formData.state} ` : ''}
                                {formData.zip && <span className="font-mono font-bold text-[#D4AF78]">- {formData.zip}</span>}
                              </p>
                              {formData.email && (
                                <p className="mt-1 text-[11px] text-[#B8AA96]/80">Invoice will be sent to: {formData.email}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-[rgba(212,175,120,0.2)] flex items-center justify-between text-[11px] text-[#B8AA96]">
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-[#D4AF78]" />
                            <span>Your delivery address is pre-filled. No need to re-type!</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingAddress(true)}
                            className="text-[11px] font-bold text-[#D4AF78] underline hover:text-[#E5C18A] cursor-pointer"
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
                            <label className="mb-1 block text-xs font-bold text-[#F5EBDD]">Full Name</label>
                            <input
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="Ananya Sharma"
                              className="h-11 w-full rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-3.5 text-sm text-[#F5EBDD] placeholder-[#B8AA96]/50 outline-none transition focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-bold text-[#F5EBDD]">
                              Email Address <span className="text-[#B8AA96] font-normal">(Optional for Invoice)</span>
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="your.email@example.com"
                              className="h-11 w-full rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-3.5 text-sm text-[#F5EBDD] placeholder-[#B8AA96]/50 outline-none transition focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-[#F5EBDD]">
                                WhatsApp Mobile Number <span className="text-[#D4AF78]">(Order tracking)</span>
                              </label>
                            </div>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="h-11 w-full rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-3.5 text-sm text-[#F5EBDD] placeholder-[#B8AA96]/50 outline-none transition focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium font-mono"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-[#F5EBDD] flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-[#D4AF78]" />
                                <span>Postal PIN Code (6 Digits)</span>
                              </label>
                              <span className="text-[10px] text-[#B8AA96]">Auto-fills City & State</span>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                maxLength={6}
                                required
                                value={formData.zip}
                                onChange={(e) => handlePincodeChange(e.target.value)}
                                placeholder="e.g. 560038"
                                className="h-11 w-full rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-3.5 pr-20 text-sm font-bold text-[#F5EBDD] tracking-wider outline-none transition focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isLocatingPin ? (
                                  <Loader2 className="h-3.5 w-3.5 text-[#D4AF78] animate-spin" />
                                ) : formData.zip.length === 6 && formData.city ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                ) : null}
                              </div>
                            </div>
                            {pinStatus && (
                              <p className="mt-1 text-[10px] font-semibold text-[#D4AF78]">
                                {pinStatus}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-bold text-[#F5EBDD]">City / Capital</label>
                            <input
                              required
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              placeholder="e.g. Bengaluru"
                              className="h-11 w-full rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-3.5 text-sm text-[#F5EBDD] placeholder-[#B8AA96]/50 outline-none transition focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-bold text-[#F5EBDD]">State / Union Territory</label>
                            <input
                              required
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              placeholder="e.g. Karnataka"
                              className="h-11 w-full rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-3.5 text-sm text-[#F5EBDD] placeholder-[#B8AA96]/50 outline-none transition focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-bold text-[#F5EBDD]">Full Street Address</label>
                            <input
                              required
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Flat 402, Lotus Residency, MG Road"
                              className="h-11 w-full rounded-xl border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] px-3.5 text-sm text-[#F5EBDD] placeholder-[#B8AA96]/50 outline-none transition focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                            />
                          </div>
                        </div>

                        {/* Save Address Toggle & Cancel Option */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(212,175,120,0.2)]">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#B8AA96]">
                            <input
                              type="checkbox"
                              checked={saveForFuture}
                              onChange={(e) => setSaveForFuture(e.target.checked)}
                              className="h-4 w-4 rounded accent-[#D4AF78] border-[rgba(212,175,120,0.3)] cursor-pointer"
                            />
                            <span>Remember & save this address for 1-click orders</span>
                          </label>
                          {hasSavedAddress && (
                            <button
                              type="button"
                              onClick={() => setIsEditingAddress(false)}
                              className="text-xs font-bold text-[#D4AF78] hover:text-[#E5C18A] underline cursor-pointer"
                            >
                              Cancel & Use Saved Address
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Regional Delivery Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#F5EBDD]">
                        <Truck className="h-4 w-4 text-[#D4AF78]" /> 2. Delivery Region &amp; Courier Fee
                      </h4>
                      <span className="text-[11px] text-[#D4AF78] font-bold">
                        {activeRegionConfig?.enabled
                          ? `${activeRegionConfig.name} Zone (₹${activeRegionConfig.fee})`
                          : 'Select Zone'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#B8AA96] mb-3">
                      Select your delivery region to calculate dynamic courier charges verified from our logistics database:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {(['north', 'south', 'east', 'west'] as const).map((regKey) => {
                        const reg = deliverySettings.regions?.[regKey]
                        const isSelected = currentRegionKey === regKey
                        const isEnabled = reg?.enabled

                        return (
                          <button
                            key={regKey}
                            type="button"
                            disabled={!isEnabled}
                            onClick={() => {
                              if (isEnabled) {
                                setSelectedRegion(regKey)
                              }
                            }}
                            className={`relative p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                              !isEnabled
                                ? 'opacity-40 border-neutral-800 bg-[#0B0B0A] cursor-not-allowed'
                                : isSelected
                                ? 'border-[#D4AF78] bg-gradient-to-b from-[#221E17] via-[#1A1814] to-[#12110F] shadow-[0_6px_20px_rgba(212,175,120,0.25)] ring-1 ring-[#D4AF78]/50'
                                : 'border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] hover:border-[#D4AF78]/60 hover:bg-[#141310]'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#F5EBDD] font-serif">
                                  {reg?.name || regKey.toUpperCase()}
                                </span>
                                {isSelected && isEnabled && (
                                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#D4AF78] text-[#0B0B0A] text-[9px] font-black shrink-0">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#B8AA96] mt-0.5 leading-tight truncate">
                                {isEnabled ? (reg?.estimatedDays || '2-4 Days') : 'Suspended'}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-[rgba(212,175,120,0.15)] flex items-center justify-between">
                              <span className="text-xs font-black text-[#D4AF78]">
                                {isEnabled ? `₹${reg?.fee}` : '✕'}
                              </span>
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#B8AA96]/80">
                                {isEnabled ? (isSelected ? 'Active' : 'Select') : 'Closed'}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Payment Section: Pay on Delivery Only */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#F5EBDD]">
                      <ShieldCheck className="h-4 w-4 text-[#D4AF78]" /> 3. Payment Method
                    </h4>
                    <div className="mt-3 rounded-2xl border border-[rgba(212,175,120,0.3)] bg-[#12110F] p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)] text-[#D4AF78] shadow-xs shrink-0">
                            <PackageCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#F5EBDD]">Pay on Delivery (Cash on Delivery)</p>
                            <p className="text-xs text-[#B8AA96] mt-0.5">Pay comfortably to the courier executive upon parcel arrival.</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold shrink-0">
                          Selected ✓
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-1.5 rounded-2xl bg-[#12110F] border border-[rgba(212,175,120,0.25)] p-4 text-xs text-[#B8AA96]">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-[#F5EBDD]">₹{cartSubtotal.toFixed(0)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between font-bold text-[#D4AF78]">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-₹{discountAmount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-[#D4AF78]" />
                        <span>Regional Delivery ({activeRegionConfig?.name || 'North'} Zone)</span>
                      </span>
                      <span className="font-bold text-[#F5EBDD]">₹{shippingCost.toFixed(0)}</span>
                    </div>
                    <div className="border-t border-[rgba(212,175,120,0.2)] pt-2 flex justify-between text-sm font-bold text-[#F5EBDD]">
                      <span>Total Due</span>
                      <span className="text-xl text-[#D4AF78] font-extrabold">₹{cartFinalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-[#D4AF78] hover:bg-[#E5C18A] text-[#0B0B0A] font-bold text-base shadow-[0_8px_25px_rgba(212,175,120,0.3)] hover:shadow-[0_12px_30px_rgba(212,175,120,0.4)] transition-all flex items-center justify-center gap-3 tracking-wide cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
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
                    <p className="text-center text-xs text-[#B8AA96] flex items-center justify-center gap-1.5 font-medium">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Saves order to Admin Panel &amp; automatically launches WhatsApp with full order details</span>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Celebration State */
              <div className="p-8 text-center sm:p-12">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#D4AF78] to-[#996515] text-[#0B0B0A] border-2 border-[#D4AF78] shadow-[0_0_30px_rgba(212,175,120,0.4)]">
                  <CheckCircle2 className="h-10 w-10 text-[#0B0B0A]" />
                </div>

                <span className="section-eyebrow mt-5 text-[#D4AF78]">Order Placed &amp; Dispatched to WhatsApp</span>
                <h3 className="mt-2 font-serif text-3xl sm:text-4xl text-[#F5EBDD] font-bold">
                  Thank You for Ordering from {siteName}!
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#B8AA96]">
                  Your order <strong className="text-[#D4AF78] font-extrabold">#{confirmedOrder?.orderId}</strong> is saved. If WhatsApp didn&apos;t open automatically, tap below to send your order receipt directly!
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#12110F] p-4 text-left shadow-sm">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#B8AA96]">Estimated Delivery:</span>
                    <strong className="text-[#F5EBDD]">{confirmedOrder?.estimatedDelivery}</strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="font-semibold text-[#B8AA96]">Shipping to:</span>
                    <strong className="text-[#F5EBDD]">{formData.fullName} ({formData.city})</strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="font-semibold text-[#B8AA96]">Delivery Region:</span>
                    <strong className="text-[#F5EBDD] font-bold">
                      {confirmedOrder?.deliveryRegion || activeRegionConfig?.name || 'North'} Zone (₹{confirmedOrder?.deliveryFee ?? shippingCost})
                    </strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="font-semibold text-[#B8AA96]">Order Total:</span>
                    <strong className="text-[#D4AF78] font-extrabold">₹{confirmedOrder?.total?.toFixed(0)} (Pay on Delivery)</strong>
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#D4AF78] hover:bg-[#E5C18A] text-[#0B0B0A] px-7 py-3.5 text-sm font-bold shadow-[0_8px_25px_rgba(212,175,120,0.3)] transition cursor-pointer"
                  >
                    <MessageCircle className="h-5 w-5 fill-current" />
                    <span>Send / Chat on WhatsApp ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#12110F] px-6 py-3.5 text-sm font-bold text-[#F5EBDD] hover:bg-[#0B0B0A] transition cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Support and Tracking Info */}
                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[rgba(212,175,120,0.25)] bg-[#12110F] p-3.5 text-center shadow-xs">
                  <p className="text-xs font-bold text-[#D4AF78]">
                    Official Support &amp; Live Dispatch Tracking
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={`https://wa.me/${(branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '') || '919341297124'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)] px-3.5 py-1.5 text-xs font-bold text-[#D4AF78] shadow-xs hover:border-[#D4AF78] transition"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{branding?.contactPhone || '+91 93412 97124'}</span>
                    </a>
                    <a
                      href="mailto:npatelierindia@gmail.com"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)] px-3.5 py-1.5 text-xs font-bold text-[#F5EBDD] shadow-xs hover:border-[#D4AF78] transition"
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

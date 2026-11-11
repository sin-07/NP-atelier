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
import { useUIModals } from '../context/UIModalContext'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { lookupPincode } from '../utils/pincodeLookup'
import { getSavedShippingAddress, saveShippingAddress, findAddressByPhone } from '../utils/addressStorage'
import { buildCartWhatsAppMessage, sendWhatsAppOrder } from '../utils/whatsappOrder'
import { lockScroll, unlockScroll } from '../utils/scrollLock'
import { getWorldContactEmail, getWorldModalTheme } from '../utils/worldTheme'

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, setIsAuthOpen } = useUIModals()
  const {
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
    isAquaticTheme,
  } = useMarketplace()
  const wt = getWorldModalTheme(isAquaticTheme)
  const contactEmail = getWorldContactEmail(isAquaticTheme, branding?.contactEmail)

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

  useEffect(() => {
    if (isCheckoutOpen) {
      lockScroll()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        unlockScroll()
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isCheckoutOpen])

  return (
    <AnimatePresence>
      {isCheckoutOpen ? (
        <motion.div
          key="checkout-modal-backdrop"
          className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center ${wt.backdrop} p-0 sm:p-4 overflow-hidden touch-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={handleClose}
        >
          <motion.div
            key="checkout-modal-card"
            className={`relative my-0 sm:my-8 w-full max-w-2xl max-h-[92vh] sidebar-scroller rounded-t-[2.2rem] sm:rounded-[2.2rem] ${wt.card} transform-gpu will-change-transform touch-auto overscroll-contain`}
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close checkout modal"
              onClick={handleClose}
              className={`absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full shadow-xs transition ${wt.closeBtn}`}
            >
              <X className="h-5 w-5" />
            </button>

            {step === 'form' ? (
              <div>
                <div className={`${wt.header} px-6 py-6 sm:px-8 ${wt.title}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="section-eyebrow">WhatsApp Direct Checkout</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${wt.muted}`}>
                      <MessageCircle className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-400' : 'text-emerald-600'}`} /> WhatsApp Verified Desk • India
                    </span>
                  </div>
                  <h3 className={`mt-2 font-tagline text-2xl sm:text-3xl font-bold ${wt.title}`}>
                    Order Confirmation via WhatsApp
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {user ? (
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${wt.greenBadge}`}>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Signed in as {user.name} ({user.email}) • Address auto-filled</span>
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                            isAquaticTheme
                              ? 'border-sky-400/25 bg-[#0B263E] text-emerald-300'
                              : 'border-[#6D5738]/25 bg-[#F5F0E8] text-[#7A5B32]'
                          }`}
                        >
                          <Sparkles className={`h-3 w-3 ${wt.accentText}`} />
                          <span>Guest Checkout • No password required</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCheckoutOpen(false)
                            setIsAuthOpen(true)
                          }}
                          className={`text-[11px] font-bold underline cursor-pointer ${
                            isAquaticTheme ? 'text-sky-300 hover:text-white' : 'text-[#7A5B32] hover:text-[#141210]'
                          }`}
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
                    <div
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-xs font-semibold shadow-xs ${
                        isAquaticTheme
                          ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                          : 'border-teal-600/30 bg-teal-50 text-teal-800'
                      }`}
                    >
                      <ShieldCheck className={`h-5 w-5 shrink-0 ${isAquaticTheme ? 'text-emerald-300' : 'text-teal-600'}`} />
                      <div>
                        <span className={`font-bold block ${isAquaticTheme ? 'text-white' : 'text-teal-900'}`}>
                          Live Arrival & Fragile Glass Guarantee Included
                        </span>
                        <span>Aquatics packed with pure oxygen and climate insulation. Glass aquariums ship with reinforced wooden corner crating.</span>
                      </div>
                    </div>
                  )}

                  {/* Order Summary Pill */}
                  <div className={`rounded-2xl ${wt.inset} p-4 shadow-xs`}>
                    <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${wt.muted}`}>
                      <span>Order Items ({cartItems.length})</span>
                      <span className={`font-extrabold ${isAquaticTheme ? 'text-[#FB7185]' : 'text-[#7A5B32]'}`}>
                        Total: ₹{cartFinalTotal.toFixed(0)}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sidebar-scroller">
                      {cartItems.map((item: any) => (
                        <div
                          key={item.cartItemId}
                          className={`flex shrink-0 items-center gap-2 rounded-xl border p-1.5 pr-3 text-xs ${
                            isAquaticTheme
                              ? 'bg-[#071A2B] border-sky-400/25'
                              : 'bg-[#F5F0E8] border-[#6D5738]/20'
                          }`}
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
                            <p className={`max-w-[120px] truncate font-bold ${wt.title}`}>{item.title}</p>
                            <p className={`text-[10px] ${wt.muted}`}>{item.quantity}x • {item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Section */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${wt.title}`}>
                        <Truck className={`h-4 w-4 ${wt.accentText}`} /> 1. Shipping Details (India)
                      </h4>
                      {hasSavedAddress && !isEditingAddress && (
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(true)}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold border px-3 py-1 rounded-xl transition shadow-2xs cursor-pointer ${
                            isAquaticTheme
                              ? 'text-emerald-300 hover:text-white bg-[#0B263E] border-sky-400/25 hover:border-emerald-400'
                              : 'text-[#7A5B32] hover:text-[#141210] bg-[#FAF6EF] border-[#6D5738]/25 hover:border-[#B68D52]'
                          }`}
                        >
                          <Edit3 className={`h-3.5 w-3.5 ${wt.accentText}`} />
                          <span>Change / Edit Address</span>
                        </button>
                      )}
                    </div>

                    {/* SAVED ADDRESS CARD (Fast 1-Click Checkout) */}
                    {hasSavedAddress && !isEditingAddress ? (
                      <div className={`mt-3 rounded-2xl ${wt.inset} p-4 shadow-xs`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`grid h-10 w-10 place-items-center rounded-xl ${wt.well} shadow-xs shrink-0 mt-0.5`}>
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm font-bold ${wt.title}`}>{formData.fullName || 'Patron'}</span>
                                {formData.phone && (
                                  <span
                                    className={`text-xs font-mono font-bold border px-2 py-0.5 rounded-md ${
                                      isAquaticTheme
                                        ? 'text-sky-200 bg-[#071A2B] border-sky-400/25'
                                        : 'text-[#7A5B32] bg-[#F5F0E8] border-[#6D5738]/25'
                                    }`}
                                  >
                                    {formData.phone}
                                  </span>
                                )}
                                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold inline-flex items-center gap-1 ${wt.greenBadge}`}>
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Saved Address • 1-Click Ready</span>
                                </span>
                              </div>
                              <p className={`mt-1 text-xs font-medium leading-relaxed ${wt.muted}`}>
                                {formData.address ? `${formData.address}, ` : ''}{formData.city ? `${formData.city}, ` : ''}{formData.state ? `${formData.state} ` : ''}
                                {formData.zip && <span className={`font-mono font-bold ${wt.accentText}`}>- {formData.zip}</span>}
                              </p>
                              {formData.email && (
                                <p className={`mt-1 text-[11px] opacity-80 ${wt.muted}`}>Invoice will be sent to: {formData.email}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`mt-3 pt-2.5 border-t ${wt.divider} flex items-center justify-between text-[11px] ${wt.muted}`}>
                          <span className="flex items-center gap-1">
                            <Sparkles className={`h-3 w-3 ${wt.accentText}`} />
                            <span>Your delivery address is pre-filled. No need to re-type!</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingAddress(true)}
                            className={`text-[11px] font-bold underline cursor-pointer ${
                              isAquaticTheme ? 'text-sky-300 hover:text-white' : 'text-[#7A5B32] hover:text-[#141210]'
                            }`}
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
                            <label className={`mb-1 block text-xs font-bold ${wt.title}`}>Full Name</label>
                            <input
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="Ananya Sharma"
                              className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                            />
                          </div>
                          <div>
                            <label className={`mb-1 block text-xs font-bold ${wt.title}`}>
                              Email Address <span className={`${wt.muted} font-normal`}>(Optional for Invoice)</span>
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="your.email@example.com"
                              className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className={`block text-xs font-bold ${wt.title}`}>
                                WhatsApp Mobile Number <span className={wt.accentText}>(Order tracking)</span>
                              </label>
                            </div>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              placeholder="+91 98765 43210"
                              className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium font-mono ${wt.input}`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className={`block text-xs font-bold flex items-center gap-1 ${wt.title}`}>
                                <MapPin className={`h-3 w-3 ${wt.accentText}`} />
                                <span>Postal PIN Code (6 Digits)</span>
                              </label>
                              <span className={`text-[10px] ${wt.muted}`}>Auto-fills City & State</span>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                maxLength={6}
                                required
                                value={formData.zip}
                                onChange={(e) => handlePincodeChange(e.target.value)}
                                placeholder="e.g. 560038"
                                className={`h-11 w-full rounded-xl border px-3.5 pr-20 text-sm font-bold tracking-wider outline-none transition ${wt.input}`}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isLocatingPin ? (
                                  <Loader2 className={`h-3.5 w-3.5 animate-spin ${wt.accentText}`} />
                                ) : formData.zip.length === 6 && formData.city ? (
                                  <CheckCircle2 className={`h-3.5 w-3.5 ${isAquaticTheme ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                ) : null}
                              </div>
                            </div>
                            {pinStatus && (
                              <p className={`mt-1 text-[10px] font-semibold ${wt.accentText}`}>
                                {pinStatus}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className={`mb-1 block text-xs font-bold ${wt.title}`}>City / Capital</label>
                            <input
                              required
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              placeholder="e.g. Bengaluru"
                              className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                            />
                          </div>
                          <div>
                            <label className={`mb-1 block text-xs font-bold ${wt.title}`}>State / Union Territory</label>
                            <input
                              required
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              placeholder="e.g. Karnataka"
                              className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={`mb-1 block text-xs font-bold ${wt.title}`}>Full Street Address</label>
                            <input
                              required
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Flat 402, Lotus Residency, MG Road"
                              className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                            />
                          </div>
                        </div>

                        {/* Save Address Toggle & Cancel Option */}
                        <div className={`pt-2 flex flex-wrap items-center justify-between gap-2 border-t ${wt.divider}`}>
                          <label className={`flex items-center gap-2 cursor-pointer text-xs font-semibold ${wt.muted}`}>
                            <input
                              type="checkbox"
                              checked={saveForFuture}
                              onChange={(e) => setSaveForFuture(e.target.checked)}
                              className={`h-4 w-4 rounded cursor-pointer ${
                                isAquaticTheme ? 'accent-[#E11D48]' : 'accent-[#B68D52]'
                              }`}
                            />
                            <span>Remember & save this address for 1-click orders</span>
                          </label>
                          {hasSavedAddress && (
                            <button
                              type="button"
                              onClick={() => setIsEditingAddress(false)}
                              className={`text-xs font-bold underline cursor-pointer ${
                                isAquaticTheme ? 'text-sky-300 hover:text-white' : 'text-[#7A5B32] hover:text-[#141210]'
                              }`}
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
                      <h4 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${wt.title}`}>
                        <Truck className={`h-4 w-4 ${wt.accentText}`} /> 2. Delivery Region &amp; Courier Fee
                      </h4>
                      <span className={`text-[11px] font-bold ${wt.accentText}`}>
                        {activeRegionConfig?.enabled
                          ? `${activeRegionConfig.name} Zone (₹${activeRegionConfig.fee})`
                          : 'Select Zone'}
                      </span>
                    </div>
                    <p className={`text-[11px] mb-3 ${wt.muted}`}>
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
                                ? isAquaticTheme
                                  ? 'opacity-40 border-sky-400/15 bg-[#061828] cursor-not-allowed'
                                  : 'opacity-40 border-[#6D5738]/20 bg-[#EFE8DC] cursor-not-allowed'
                                : isSelected
                                ? isAquaticTheme
                                  ? 'border-[#F43F5E] bg-gradient-to-b from-[#0E2F4A] via-[#0B253B] to-[#081D30] shadow-xs ring-1 ring-rose-400/50'
                                  : 'border-[#B68D52] bg-gradient-to-b from-[#FAF6EF] via-[#FCF9F4] to-[#F3ECE1] shadow-xs ring-1 ring-[#B68D52]/50'
                                : isAquaticTheme
                                ? 'border-sky-400/20 bg-[#071A2B] hover:border-emerald-400/55 hover:bg-[#0B263E]'
                                : 'border-[#6D5738]/20 bg-[#F5F0E8] hover:border-[#B68D52] hover:bg-[#FAF6EF]'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold font-tagline ${wt.title}`}>
                                  {reg?.name || regKey.toUpperCase()}
                                </span>
                                {isSelected && isEnabled && (
                                  <span
                                    className={`grid h-4 w-4 place-items-center rounded-full text-[9px] font-black shrink-0 ${
                                      isAquaticTheme
                                        ? 'bg-[#E11D48] text-white'
                                        : 'bg-[#D4AF78] text-[#141210]'
                                    }`}
                                  >
                                    ✓
                                  </span>
                                )}
                              </div>
                              <p className={`text-[10px] mt-0.5 leading-tight truncate ${wt.muted}`}>
                                {isEnabled ? (reg?.estimatedDays || '2-4 Days') : 'Suspended'}
                              </p>
                            </div>

                            <div className={`mt-3 pt-2 border-t flex items-center justify-between ${wt.divider}`}>
                              <span className={`text-xs font-black ${wt.accentText}`}>
                                {isEnabled ? `₹${reg?.fee}` : '✕'}
                              </span>
                              <span className={`text-[9px] font-extrabold uppercase tracking-wider opacity-80 ${wt.muted}`}>
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
                    <h4 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${wt.title}`}>
                      <ShieldCheck className={`h-4 w-4 ${wt.accentText}`} /> 3. Payment Method
                    </h4>
                    <div className={`mt-3 rounded-2xl ${wt.inset} p-4 shadow-xs`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-11 w-11 place-items-center rounded-xl ${wt.well} shadow-xs shrink-0`}>
                            <PackageCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${wt.title}`}>Pay on Delivery (Cash on Delivery)</p>
                            <p className={`text-xs mt-0.5 ${wt.muted}`}>Pay comfortably to the courier executive upon parcel arrival.</p>
                          </div>
                        </div>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${wt.greenBadge}`}>
                          Selected ✓
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className={`space-y-1.5 rounded-2xl ${wt.inset} p-4 text-xs ${wt.muted}`}>
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className={`font-bold ${wt.title}`}>₹{cartSubtotal.toFixed(0)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className={`flex justify-between font-bold ${wt.accentText}`}>
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-₹{discountAmount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5">
                        <Truck className={`h-3.5 w-3.5 ${wt.accentText}`} />
                        <span>Regional Delivery ({activeRegionConfig?.name || 'North'} Zone)</span>
                      </span>
                      <span className={`font-bold ${wt.title}`}>₹{shippingCost.toFixed(0)}</span>
                    </div>
                    <div className={`border-t ${wt.divider} pt-2 flex justify-between text-sm font-bold ${wt.title}`}>
                      <span>Total Due</span>
                      <span className={`text-xl font-extrabold ${wt.title}`}>₹{cartFinalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 tracking-wide cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group ${
                        isAquaticTheme
                          ? 'bg-gradient-to-r from-[#E11D48] via-[#DC2626] to-[#F43F5E] hover:brightness-110 text-white shadow-[0_8px_25px_rgba(225,29,72,0.4)]'
                          : 'bg-[#D4AF78] hover:bg-[#E5C18A] text-[#141210] shadow-[0_8px_25px_rgba(182,141,82,0.28)] hover:shadow-[0_12px_30px_rgba(182,141,82,0.35)]'
                      }`}
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
                    <p className={`text-center text-xs flex items-center justify-center gap-1.5 font-medium ${wt.muted}`}>
                      <ShieldCheck className={`h-4 w-4 shrink-0 ${isAquaticTheme ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span>Saves order to Admin Panel &amp; automatically launches WhatsApp with full order details</span>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Celebration State */
              <div className="p-8 text-center sm:p-12">
                <div
                  className={`mx-auto grid h-20 w-20 place-items-center rounded-full border-2 ${
                    isAquaticTheme
                      ? 'bg-gradient-to-br from-[#10B981] to-[#059669] text-[#031F16] border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                      : 'bg-gradient-to-br from-[#E5C18A] to-[#D4AF78] text-[#141210] border-[#B68D52] shadow-[0_0_25px_rgba(182,141,82,0.35)]'
                  }`}
                >
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <span className={`section-eyebrow mt-5 ${wt.accentText}`}>Order Placed &amp; Dispatched to WhatsApp</span>
                <h3 className={`mt-2 font-tagline text-3xl sm:text-4xl font-bold ${wt.title}`}>
                  Thank You for Ordering from {siteName}!
                </h3>
                <p className={`mx-auto mt-3 max-w-md text-sm leading-relaxed ${wt.muted}`}>
                  Your order <strong className={`font-extrabold ${isAquaticTheme ? 'text-[#FB7185]' : 'text-[#7A5B32]'}`}>#{confirmedOrder?.orderId}</strong> is saved. If WhatsApp didn&apos;t open automatically, tap below to send your order receipt directly!
                </p>

                <div className={`mx-auto mt-6 max-w-md rounded-2xl ${wt.inset} p-4 text-left shadow-xs`}>
                  <div className="flex justify-between text-xs">
                    <span className={`font-semibold ${wt.muted}`}>Estimated Delivery:</span>
                    <strong className={wt.title}>{confirmedOrder?.estimatedDelivery}</strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className={`font-semibold ${wt.muted}`}>Shipping to:</span>
                    <strong className={wt.title}>{formData.fullName} ({formData.city})</strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className={`font-semibold ${wt.muted}`}>Delivery Region:</span>
                    <strong className={`font-bold ${wt.title}`}>
                      {confirmedOrder?.deliveryRegion || activeRegionConfig?.name || 'North'} Zone (₹{confirmedOrder?.deliveryFee ?? shippingCost})
                    </strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className={`font-semibold ${wt.muted}`}>Order Total:</span>
                    <strong className={`font-extrabold ${wt.accentText}`}>₹{confirmedOrder?.total?.toFixed(0)} (Pay on Delivery)</strong>
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
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-bold transition cursor-pointer ${
                      isAquaticTheme
                        ? 'bg-gradient-to-r from-[#E11D48] via-[#DC2626] to-[#F43F5E] hover:brightness-110 text-white shadow-[0_8px_25px_rgba(225,29,72,0.4)]'
                        : 'bg-[#D4AF78] hover:bg-[#E5C18A] text-[#141210] shadow-[0_8px_25px_rgba(182,141,82,0.28)]'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5 fill-current" />
                    <span>Send / Chat on WhatsApp ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleClose}
                    className={`w-full sm:w-auto rounded-2xl px-6 py-3.5 text-sm font-bold transition cursor-pointer ${wt.secondaryCta}`}
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Support and Tracking Info */}
                <div className={`mx-auto mt-6 max-w-md rounded-2xl ${wt.inset} p-3.5 text-center shadow-xs`}>
                  <p className={`text-xs font-bold ${wt.accentText}`}>
                    Official Support &amp; Live Dispatch Tracking
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={`https://wa.me/${(branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '') || '919341297124'}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-xs transition ${
                        isAquaticTheme
                          ? 'bg-[#071A2B] border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/15'
                          : 'bg-[#FCF9F4] border-emerald-600/35 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{branding?.contactPhone || '+91 93412 97124'}</span>
                    </a>
                    <a
                      href={`mailto:${contactEmail}`}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-xs transition ${
                        isAquaticTheme
                          ? 'bg-[#071A2B] border-sky-400/25 text-[#F0F8FF] hover:border-emerald-400'
                          : 'bg-[#FCF9F4] border-[#6D5738]/25 text-[#141210] hover:border-[#B68D52]'
                      }`}
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>{contactEmail}</span>
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

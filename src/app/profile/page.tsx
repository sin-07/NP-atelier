"use client"

import { useState, useEffect, Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  User,
  MapPin,
  Package,
  Heart,
  Phone,
  Mail,
  CheckCircle2,
  Truck,
  Store,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Calendar,
  ChevronRight,
  ShoppingBag,
  MessageCircle,
  LayoutDashboard,
  Save,
  Clock,
  Sparkles,
  Compass,
  Check,
  AlertCircle,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { useMarketplace, DEFAULT_PATRON_USER } from '../../context/MarketplaceContext'
import { lookupPincode } from '../../utils/pincodeLookup'
import { getSavedShippingAddress, saveShippingAddress } from '../../utils/addressStorage'
import ToastContainer from '../../components/ToastContainer'
import { BrandTitle } from '../../components/BrandTypography'

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTabParam = searchParams.get('tab')

  const {
    user,
    branding,
    updateUser,
    logout,
    orders,
    refreshOrders,
    wishlistedProducts,
    cartCount,
    addToCart,
    showToast,
    login,
    triggerGlobalLoader,
    setIsAuthOpen,
  } = useMarketplace()

  const currentUser = user || DEFAULT_PATRON_USER

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'concierge'>('profile')
  const [isLocatingPin, setIsLocatingPin] = useState(false)
  const [pinStatus, setPinStatus] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [previewMode, setPreviewMode] = useState<'card' | 'skeleton'>('card')

  // Synchronize initial tab from URL search parameters (e.g. ?tab=orders)
  useEffect(() => {
    if (initialTabParam === 'orders' || initialTabParam === 'wishlist' || initialTabParam === 'concierge') {
      setActiveTab(initialTabParam)
    } else {
      setActiveTab('profile')
    }
  }, [initialTabParam])

  useEffect(() => {
    if (activeTab === 'orders' && refreshOrders) {
      refreshOrders()
    }
  }, [activeTab, refreshOrders])

  // Profile Form State
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
  })

  useEffect(() => {
    const saved = getSavedShippingAddress()
    if (saved && (saved.address || saved.phone || saved.fullName)) {
      setFormState({
        name: saved.fullName || currentUser?.name || '',
        phone: saved.phone || currentUser?.phone || '',
        address: saved.address || currentUser?.address || '',
        pincode: saved.zip || currentUser?.pincode || '',
        city: saved.city || currentUser?.city || '',
        state: saved.state || currentUser?.state || '',
      })
    } else if (currentUser) {
      setFormState({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        pincode: currentUser.pincode || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
      })
    }
  }, [currentUser])

  // Live 6-digit Indian PIN code auto-lookup
  const handlePincodeChange = async (pinRaw: string) => {
    const cleanPin = pinRaw.replace(/[^0-9]/g, '').slice(0, 6)
    setFormState((prev) => ({ ...prev, pincode: cleanPin }))

    if (cleanPin.length === 6) {
      setIsLocatingPin(true)
      setPinStatus('Detecting City & State...')
      try {
        const details = await lookupPincode(cleanPin)
        if (details && details.success) {
          setFormState((prev) => ({
            ...prev,
            pincode: cleanPin,
            city: details.city,
            state: details.state,
          }))
          setPinStatus(`Auto-detected: ${details.city}, ${details.state}`)
          showToast?.({
            title: 'Location Resolved',
            message: `PIN ${cleanPin} mapped to ${details.city}, ${details.state}.`,
            type: 'info',
          })
        } else {
          setPinStatus('Could not resolve PIN automatically. Enter City & State manually.')
        }
      } catch {
        setPinStatus('Please enter City & State manually.')
      } finally {
        setIsLocatingPin(false)
      }
    } else {
      setPinStatus(null)
    }
  }

  // Handle saving customer profile
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      const cleanData = {
        name: formState.name.trim(),
        phone: formState.phone.trim(),
        address: formState.address.trim(),
        pincode: formState.pincode.trim(),
        city: formState.city.trim(),
        state: formState.state.trim(),
      }
      updateUser(cleanData)
      saveShippingAddress({
        fullName: cleanData.name,
        phone: cleanData.phone,
        address: cleanData.address,
        city: cleanData.city,
        state: cleanData.state,
        zip: cleanData.pincode,
      })
      setIsSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }, 250)
  }

  // Filter orders placed by this customer
  const userOrders = useMemo(() => {
    const targetEmail = (currentUser.email || '').toLowerCase().trim()
    return orders.filter((order: any) => {
      const custEmail = (order.customer?.userEmail || order.customer?.email || '').toLowerCase().trim()
      return custEmail === targetEmail || !custEmail || targetEmail === 'patron@npatelier.in'
    })
  }, [orders, currentUser])

  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'Master Admin & Creator Ops' ||
    currentUser?.email === 'npatelierindia@gmail.com'

  // Full Customer Profile Page
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#141210] pb-24">
      <ToastContainer />

      {/* Top Luxury Sticky Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[rgba(122,91,50,0.2)] bg-[#FCF9F4]/95 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(122,91,50,0.24)] bg-[#FAF6EF] px-3.5 py-2 text-xs font-bold text-[#141210] shadow-xs hover:bg-[#EFE8DC] hover:border-[#8C6834] transition active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 text-[#7A5B32]" />
              <span>Back to Storefront</span>
            </Link>

            <div className="hidden sm:block h-5 w-px bg-[rgba(122,91,50,0.22)]" />

            <span className="hidden sm:inline-flex items-center text-lg font-bold tracking-tight text-[#141210]">
              <BrandTitle siteName={branding?.siteName || 'NP Atelier'} />
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(122,91,50,0.24)] bg-[#FAF6EF] px-3 py-1.5 text-xs font-bold text-[#7A5B32] hover:border-[#8C6834] hover:bg-[#EFE8DC] transition shadow-2xs"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-[#7A5B32]" />
                <span className="hidden md:inline">Admin Console</span>
              </Link>
            )}

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout(() => {
                    router.push('/')
                  })
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-600/30 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer shadow-2xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="btn-primary py-1.5 px-3.5 text-xs font-bold shadow-xs cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
        {/* VIP Profile Hero Banner */}
        <div className="relative rounded-[2.2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-6 sm:p-10 shadow-[0_18px_45px_rgba(20,18,16,0.06)] overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-radial from-[#D4AF78]/20 to-transparent blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Avatar circle */}
              <div className="relative shrink-0">
                {currentUser.avatarImage ? (
                  <img
                    src={currentUser.avatarImage}
                    alt={currentUser.name}
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-[#B68D52] shadow-md"
                  />
                ) : (
                  <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-full bg-[#EFE8DC] text-2xl sm:text-3xl font-tagline font-bold text-[#7A5B32] border-2 border-[#B68D52] shadow-md">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[#FCF9F4] text-[#7A5B32] border border-[rgba(122,91,50,0.25)] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* User Identity Info */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-tagline text-2xl sm:text-3xl font-bold text-[#141210]">
                    {currentUser.name || 'Artisan Collector'}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.24)] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#7A5B32] shadow-2xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#7A5B32]" />
                    {isAdmin ? 'Administrator & Studio Creator' : 'Artisan Patron & Collector'}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-[#5C4D3C] font-medium">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#7A5B32]" />
                    <span>{currentUser.email}</span>
                  </span>
                  {currentUser.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#7A5B32]" />
                      <span>{currentUser.phone}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#7A5B32]" />
                    <span>Member since {currentUser.memberSince || '2026'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Account Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto shrink-0">
              <div className="rounded-2xl border border-[rgba(122,91,50,0.2)] bg-[#FAF6EF] p-3 sm:p-4 text-center shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B32]">Orders</p>
                <p className="font-tagline text-xl sm:text-2xl font-bold text-[#141210] mt-0.5">
                  {userOrders.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(122,91,50,0.2)] bg-[#FAF6EF] p-3 sm:p-4 text-center shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B32]">Wishlist</p>
                <p className="font-tagline text-xl sm:text-2xl font-bold text-[#141210] mt-0.5">
                  {wishlistedProducts.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(122,91,50,0.2)] bg-[#FAF6EF] p-3 sm:p-4 text-center shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B32]">Bag</p>
                <p className="font-tagline text-xl sm:text-2xl font-bold text-[#141210] mt-0.5">
                  {cartCount}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-[rgba(122,91,50,0.2)] bg-[#EFE8DC]/75 p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#D4AF78] text-[#141210] font-black shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#141210] hover:bg-[#FCF9F4]'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Delivery Address &amp; Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#D4AF78] text-[#141210] font-black shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#141210] hover:bg-[#FCF9F4]'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Bespoke Orders</span>
              {userOrders.length > 0 && (
                <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#141210] px-1.5 text-[9px] font-black text-[#F5F0E8]">
                  {userOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wishlist')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-[#D4AF78] text-[#141210] font-black shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#141210] hover:bg-[#FCF9F4]'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Saved Wishlist</span>
              {wishlistedProducts.length > 0 && (
                <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-rose-500 px-1.5 text-[9px] font-black text-white">
                  {wishlistedProducts.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('concierge')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition cursor-pointer ${
                activeTab === 'concierge'
                  ? 'bg-[#D4AF78] text-[#141210] font-black shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#141210] hover:bg-[#FCF9F4]'
              }`}
            >
              <Store className="h-4 w-4" />
              <span>Artisan Studio &amp; Concierge</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Profile & Delivery Address */}
        {activeTab === 'profile' && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2 rounded-[2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-[rgba(122,91,50,0.18)] pb-4">
                <div>
                  <h2 className="font-tagline text-xl sm:text-2xl font-bold text-[#141210]">Personal &amp; Delivery Details</h2>
                  <p className="text-xs text-[#5C4D3C] mt-0.5">
                    Update your primary shipping address for 1-click WhatsApp orders and seamless checkout.
                  </p>
                </div>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-600/30 px-3 py-1 text-xs font-bold text-emerald-800 animate-in fade-in">
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleProfileSave} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141210]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Aniket Sharma"
                      className="h-11 w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] px-3.5 text-sm font-medium text-[#141210] placeholder-[#5C4D3C]/55 focus:border-[#8C6834] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141210]">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="h-11 w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] px-3.5 text-sm font-medium text-[#141210] placeholder-[#5C4D3C]/55 focus:border-[#8C6834] outline-none transition"
                    />
                  </div>
                </div>

                {/* 6-digit PIN code with auto detection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#141210]">
                      Delivery PIN Code <span className="text-[#7A5B32]">(6 Digits)</span>
                    </label>
                    {isLocatingPin && (
                      <span className="text-[11px] font-bold text-[#7A5B32] animate-pulse">
                        Resolving location...
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={formState.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="e.g. 110001, 560001, 700001"
                    className="h-11 w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] px-3.5 text-sm font-medium text-[#141210] placeholder-[#5C4D3C]/55 focus:border-[#8C6834] outline-none transition tracking-wider"
                  />
                  {pinStatus && (
                    <p className="mt-1 text-[11px] font-medium text-[#7A5B32]">{pinStatus}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141210]">City / Town</label>
                    <input
                      type="text"
                      value={formState.city}
                      onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                      placeholder="City"
                      className="h-11 w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] px-3.5 text-sm font-medium text-[#141210] placeholder-[#5C4D3C]/55 focus:border-[#8C6834] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141210]">State / Region</label>
                    <input
                      type="text"
                      value={formState.state}
                      onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                      placeholder="State"
                      className="h-11 w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] px-3.5 text-sm font-medium text-[#141210] placeholder-[#5C4D3C]/55 focus:border-[#8C6834] outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#141210]">
                    Street Address / House No. / Landmark
                  </label>
                  <textarea
                    rows={3}
                    value={formState.address}
                    onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                    placeholder="Flat/House No., Street Name, Near Landmark..."
                    className="w-full rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#F5F0E8] p-3 text-sm font-medium text-[#141210] placeholder-[#5C4D3C]/55 focus:border-[#8C6834] outline-none transition"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary py-3.5 px-8 text-xs shadow-md font-bold tracking-wide cursor-pointer disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile & Delivery Address'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Saved Delivery Card & Skeleton Section */}
            <div className="space-y-4">
              <div className="rounded-[2.2rem] border border-[rgba(122,91,50,0.22)] bg-[#FAF6EF] p-6 shadow-xs relative overflow-hidden">
                {/* Header with Card vs Skeleton Toggle Switch */}
                <div className="flex items-center justify-between gap-2 border-b border-[rgba(122,91,50,0.18)] pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#7A5B32]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7A5B32]">
                      Primary Dispatch Card
                    </span>
                  </div>

                  {/* Interactive Toggle Switch: Card vs Skeleton */}
                  <div className="flex items-center gap-1 bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] rounded-full p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('card')}
                      className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                        previewMode === 'card'
                          ? 'bg-[#D4AF78] text-[#141210] shadow-xs'
                          : 'text-[#5C4D3C] hover:text-[#141210]'
                      }`}
                      title="View Live Dispatch Card"
                    >
                      Live Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('skeleton')}
                      className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer flex items-center gap-1 ${
                        previewMode === 'skeleton'
                          ? 'bg-[#D4AF78] text-[#141210] shadow-xs font-black'
                          : 'text-[#5C4D3C] hover:text-[#141210]'
                      }`}
                      title="View New Gold Shimmer Skeleton"
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>New Skeleton</span>
                    </button>
                  </div>
                </div>

                {/* SKELETON STATE: When in skeleton mode OR when address is completely empty */}
                {previewMode === 'skeleton' || (!formState.name && !formState.address && !formState.pincode && previewMode === 'card') ? (
                  <div className="mt-4 rounded-2xl border-2 border-dashed border-[rgba(122,91,50,0.3)] bg-[#F5F0E8] p-5 shadow-xs relative overflow-hidden space-y-3.5">
                    {/* Top Row: Skeleton Monogram + Title + Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-[#E6DDD0] animate-pulse border border-[rgba(122,91,50,0.2)]" />
                        <div className="h-4 w-32 rounded-md bg-[#E6DDD0] animate-pulse" />
                      </div>
                      <div className="h-5 w-20 rounded-full bg-[#E6DDD0] animate-pulse border border-[rgba(122,91,50,0.2)]" />
                    </div>

                    {/* Recipient & Street Skeleton Bars */}
                    <div className="space-y-2 pt-1">
                      <div className="h-5 w-48 rounded-md bg-[#E6DDD0] animate-pulse" />
                      <div className="h-3.5 w-full rounded-md bg-[#E6DDD0]/80 animate-pulse" />
                      <div className="h-3.5 w-4/5 rounded-md bg-[#E6DDD0]/70 animate-pulse" />
                    </div>

                    {/* City & PIN Capsule Skeleton */}
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <div className="h-6 w-36 rounded-full bg-[#D4AF78]/30 animate-pulse border border-[#B68D52]/35" />
                      <div className="h-6 w-24 rounded-full bg-[#E6DDD0]/80 animate-pulse" />
                    </div>

                    {/* Phone & Barcode Skeleton Footer */}
                    <div className="pt-2.5 border-t border-[rgba(122,91,50,0.18)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 rounded-full bg-[#E6DDD0] animate-pulse" />
                        <div className="h-3.5 w-28 rounded-md bg-[#E6DDD0] animate-pulse" />
                      </div>

                      {/* Mini Barcode Skeleton */}
                      <div className="flex items-center gap-0.5 opacity-45">
                        <span className="h-4 w-0.5 bg-[#7A5B32]" />
                        <span className="h-4 w-1 bg-[#7A5B32]" />
                        <span className="h-4 w-0.5 bg-[#7A5B32]" />
                        <span className="h-4 w-1.5 bg-[#7A5B32]" />
                        <span className="h-4 w-0.5 bg-[#7A5B32]" />
                        <span className="h-4 w-1 bg-[#7A5B32]" />
                        <span className="h-4 w-0.5 bg-[#7A5B32]" />
                      </div>
                    </div>

                    {/* Skeleton Live Watermark Pill */}
                    <div className="mt-1 rounded-xl bg-[#FCF9F4] border border-[rgba(122,91,50,0.22)] p-2 flex items-center gap-2 text-[10.5px] font-bold text-[#7A5B32] shadow-2xs">
                      <Sparkles className="h-3.5 w-3.5 text-[#7A5B32] shrink-0 animate-pulse" />
                      <span>New Gold-Shimmer Skeleton • Real-time dispatch blueprint synced with form</span>
                    </div>
                  </div>
                ) : (
                  /* LIVE CARD STATE: Royal Dispatch Passport */
                  <div className="mt-4 rounded-2xl bg-[#FCF9F4] p-5 border border-[rgba(122,91,50,0.24)] shadow-[0_8px_25px_rgba(20,18,16,0.06)] space-y-3 relative overflow-hidden">
                    {/* Vintage Postage Stamp Watermark in Top Right */}
                    <div className="absolute right-3 top-3 hidden sm:flex flex-col items-center justify-center h-12 w-11 rounded-lg border border-dashed border-[rgba(122,91,50,0.38)] bg-[#F5F0E8] p-1 text-center select-none opacity-90">
                      <span className="text-[7.5px] font-black uppercase text-[#7A5B32] leading-none">ATELIER</span>
                      <span className="text-[9px] font-tagline font-black text-[#141210]">POST</span>
                      <span className="text-[7px] text-[#7A5B32] font-bold">2026</span>
                    </div>

                    {/* Top Identity Row */}
                    <div className="flex items-center justify-between pr-0 sm:pr-14">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#7A5B32]">Consignee</span>
                        <p className="font-tagline text-lg font-bold text-[#141210] truncate">
                          {formState.name || user?.name || 'Artisan Collector'}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-600/30 shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>Ready</span>
                      </span>
                    </div>

                    {/* Street Address */}
                    <div className="text-xs text-[#5C4D3C] leading-relaxed">
                      {formState.address || 'Street address details entered on left will appear here.'}
                    </div>

                    {/* Destination Capsule Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] px-3 py-1 text-xs font-bold text-[#7A5B32] shadow-2xs">
                      <MapPin className="h-3.5 w-3.5 text-[#7A5B32] shrink-0" />
                      <span>
                        {[formState.city, formState.state, formState.pincode].filter(Boolean).join(', ') || 'India'}
                      </span>
                    </div>

                    {/* Contact Phone & Barcode Serial */}
                    <div className="pt-2 border-t border-[rgba(122,91,50,0.18)] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#5C4D3C]">
                        <Phone className="h-3.5 w-3.5 text-[#7A5B32]" />
                        <span className="font-mono text-[#141210]">{formState.phone || 'Phone not set'}</span>
                      </div>

                      {/* Stylized Courier Barcode */}
                      <div className="flex items-center gap-1 text-[9px] font-mono text-[#7A5B32] font-bold">
                        <span className="tracking-widest">|||| ||| ||||</span>
                        <span className="hidden sm:inline">EXP-{formState.pincode || '2026'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-Attach WhatsApp Express Notification */}
                <div className="mt-4 rounded-xl bg-[#EFE8DC]/75 p-3 text-[11px] text-[#5C4D3C] border border-[rgba(122,91,50,0.2)] flex items-start gap-2 shadow-2xs">
                  <Truck className="h-4 w-4 text-[#7A5B32] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#141210]">1-Click WhatsApp Express:</strong> This address card is automatically formatted and attached to your WhatsApp order receipt for instant courier dispatch.
                  </span>
                </div>
              </div>

              {/* Enhanced Patron Security & Transit Protection Card */}
              <div className="rounded-[2.2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#141210]">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Patron Vault &amp; Transit Protection</span>
                </div>
                <p className="text-xs text-[#5C4D3C] leading-relaxed">
                  Your delivery address and contact information are encrypted with zero 3rd-party tracking. Fragile crafts and live aquatics include certified transit guarantee.
                </p>

                {/* Security Feature Badges */}
                <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold text-[#7A5B32]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] px-2.5 py-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                    256-Bit Encrypted
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] px-2.5 py-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                    Zero Data Leakage
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] px-2.5 py-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                    Insulated Courier Crating
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bespoke Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-tagline text-xl sm:text-2xl font-bold text-[#141210]">My Bespoke Orders</h2>
                <p className="text-xs text-[#5C4D3C] mt-0.5">
                  Track live status, shipping schedules, and direct WhatsApp concierge updates.
                </p>
              </div>
              <Link
                href="/#collection"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[rgba(122,91,50,0.24)] bg-[#FCF9F4] px-4 py-2 text-xs font-bold text-[#7A5B32] hover:border-[#8C6834] hover:bg-[#EFE8DC] transition"
              >
                <Compass className="h-3.5 w-3.5 text-[#7A5B32]" />
                <span>Explore More Drops</span>
              </Link>
            </div>

            {userOrders.length === 0 ? (
              <div className="rounded-[2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-12 text-center shadow-xs">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] text-[#7A5B32]">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-tagline text-xl sm:text-2xl font-bold text-[#141210]">
                  No Bespoke Orders Yet
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#5C4D3C] max-w-md mx-auto">
                  You haven&apos;t placed any orders yet. Discover our master-crafted resin decors, botanical soy candles, and exotic aquatic drops!
                </p>
                <Link
                  href="/#collection"
                  className="mt-6 btn-primary text-xs py-3 px-8 mx-auto inline-flex"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Explore Masterpieces</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order: any, idx: number) => (
                  <div
                    key={order.orderId || idx}
                    className="rounded-[2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-5 sm:p-7 shadow-xs hover:border-[rgba(122,91,50,0.45)] transition space-y-4"
                  >
                    {/* Order Title Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(122,91,50,0.18)] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-tagline text-base sm:text-lg font-bold text-[#141210]">
                            Order #{order.orderId}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] px-2.5 py-0.5 text-[10px] font-bold text-[#7A5B32]">
                            <Clock className="h-3 w-3 text-[#7A5B32]" />
                            {order.date}
                          </span>
                        </div>
                        <p className="text-xs text-[#5C4D3C] mt-1">
                          Live Status:{' '}
                          <strong className="text-emerald-700 font-bold">{order.status}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-base sm:text-xl font-tagline font-bold text-[#7A5B32]">
                          {order.total || '₹0'}
                        </p>
                        <span className="text-[11px] text-[#5C4D3C] font-bold">
                          {order.items?.length || 1} Item(s)
                        </span>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {order.items?.map((item: any, iIdx: number) => (
                        <div
                          key={iIdx}
                          className="flex items-center gap-3 rounded-2xl bg-[#FAF6EF] p-3 border border-[rgba(122,91,50,0.2)]"
                        >
                          <img
                            src={item.image || '/products/ceramic-mug.jpg'}
                            alt={item.title}
                            className="h-14 w-14 rounded-xl object-cover border border-[rgba(122,91,50,0.2)] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#141210] truncate">{item.title}</p>
                            <p className="text-[11px] text-[#5C4D3C] mt-0.5">
                              Qty: {item.quantity || 1} • <strong className="text-[#7A5B32]">{item.price}</strong>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[rgba(122,91,50,0.18)]">
                      <span className="text-xs text-[#5C4D3C] flex items-center gap-1.5 font-medium">
                        <Truck className="h-4 w-4 text-[#7A5B32]" />
                        <span>Estimated Delivery: {order.estimatedDelivery || '4-5 Business Days'}</span>
                      </span>

                      <a
                        href={`https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20would%20like%20to%20track%20my%20order%20%23${order.orderId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-600/35 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
                      >
                        <MessageCircle className="h-4 w-4 text-emerald-700" />
                        <span>Track on WhatsApp Concierge</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-tagline text-xl sm:text-2xl font-bold text-[#141210]">My Saved Wishlist</h2>
                <p className="text-xs text-[#5C4D3C] mt-0.5">
                  Exclusive handcrafted creations and rare aquatic drops saved for later.
                </p>
              </div>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-12 text-center shadow-xs">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] text-[#7A5B32]">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-tagline text-xl sm:text-2xl font-bold text-[#141210]">
                  Wishlist is Empty
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#5C4D3C] max-w-md mx-auto">
                  Tap the heart icon on any handcrafted artifact or exotic aquatic drop to save it to your bespoke collection.
                </p>
                <Link
                  href="/#collection"
                  className="mt-6 btn-primary text-xs py-3 px-8 mx-auto inline-flex"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Discover Artisan Works</span>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wishlistedProducts.map((prod: any) => (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between rounded-[2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-4.5 shadow-xs hover:border-[rgba(122,91,50,0.45)] transition"
                  >
                    <div className="flex gap-4">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="h-20 w-20 rounded-2xl object-cover border border-[rgba(122,91,50,0.2)] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-[#7A5B32]">
                          {prod.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#141210] truncate mt-0.5">{prod.title}</h4>
                        <p className="text-base font-tagline font-bold text-[#7A5B32] mt-1">
                          {prod.price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(prod, 1)
                          showToast?.({
                            title: 'Added to Bag',
                            message: `"${prod.title}" moved to shopping bag.`,
                            type: 'cart',
                          })
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(122,91,50,0.24)] bg-[#EFE8DC] py-2.5 text-xs font-bold text-[#7A5B32] hover:bg-[#D4AF78] hover:text-[#141210] transition cursor-pointer"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Move to Bag</span>
                      </button>

                      <a
                        href={`https://wa.me/919341297124?text=${encodeURIComponent(
                          `*✦ DIRECT ORDER FROM WISHLIST ✦*\n*Store:* ${branding?.siteName || 'NP Atelier'}\n*Item:* ${prod.title}\n*Price:* ${prod.price}\n\nHi NP Atelier, I would like to order this item directly via WhatsApp!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#D4AF78] text-[#141210] px-3 py-2.5 text-xs font-bold hover:bg-[#E5C18A] transition cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Artisan Studio & Concierge */}
        {activeTab === 'concierge' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2.2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EFE8DC] border border-[rgba(122,91,50,0.22)] text-[#7A5B32]">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="font-tagline text-xl sm:text-2xl font-bold text-[#141210]">
                Sell With NP Atelier • Zero Setup Fees
              </h3>
              <p className="text-xs text-[#5C4D3C] leading-relaxed">
                Are you an independent jewelry artisan, candle crafter, or aquatic breeder? Join our collective to showcase your creations across India with complete shipping and customer service support.
              </p>
              <Link
                href="/#makers"
                className="inline-flex items-center gap-2 btn-primary text-xs py-3 px-6 cursor-pointer"
              >
                <span>Explore Artisan Collective</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2.2rem] border border-[rgba(122,91,50,0.22)] bg-[#FCF9F4] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 border border-emerald-600/25 text-emerald-700">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-tagline text-xl sm:text-2xl font-bold text-[#141210]">
                Direct WhatsApp Concierge
              </h3>
              <p className="text-xs text-[#5C4D3C] leading-relaxed">
                Need urgent customization, bulk gifting inquiries, live fish arrival verification, or instant order assistance? Chat directly with our founder &amp; concierge desk.
              </p>
              <a
                href="https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20am%20in%20my%20customer%20profile%20and%20need%20concierge%20support."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(122,91,50,0.24)] bg-[#D4AF78] px-6 py-3 text-xs font-bold text-[#141210] shadow-md hover:bg-[#E5C18A] transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Open WhatsApp Support (+91 93412 97124)</span>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#7A5B32] border-t-transparent" />
            <p className="font-tagline text-xs font-bold text-[#7A5B32] tracking-wider uppercase">
              Loading Atelier Profile...
            </p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}

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
import { useMarketplace } from '../../context/MarketplaceContext'
import { lookupPincode } from '../../utils/pincodeLookup'
import ToastContainer from '../../components/ToastContainer'

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
    wishlistedProducts,
    cartCount,
    addToCart,
    showToast,
    login,
  } = useMarketplace()

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'concierge'>('profile')
  const [isLocatingPin, setIsLocatingPin] = useState(false)
  const [pinStatus, setPinStatus] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Auth form state if not signed in
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    address: '',
  })

  // Synchronize initial tab from URL search parameters (e.g. ?tab=orders)
  useEffect(() => {
    if (initialTabParam === 'orders' || initialTabParam === 'wishlist' || initialTabParam === 'concierge') {
      setActiveTab(initialTabParam)
    } else {
      setActiveTab('profile')
    }
  }, [initialTabParam])

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
    if (user) {
      setFormState({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        pincode: user.pincode || '',
        city: user.city || '',
        state: user.state || '',
      })
    }
  }, [user])

  // Live 6-digit Indian PIN code auto-lookup
  const handlePincodeChange = async (pinRaw: string, isAuth = false) => {
    const cleanPin = pinRaw.replace(/[^0-9]/g, '').slice(0, 6)
    if (isAuth) {
      setAuthForm((prev) => ({ ...prev, pincode: cleanPin }))
    } else {
      setFormState((prev) => ({ ...prev, pincode: cleanPin }))
    }

    if (cleanPin.length === 6) {
      setIsLocatingPin(true)
      setPinStatus('Detecting City & State...')
      try {
        const details = await lookupPincode(cleanPin)
        if (details && details.success) {
          if (isAuth) {
            setAuthForm((prev) => ({
              ...prev,
              pincode: cleanPin,
              city: details.city,
              state: details.state,
            }))
          } else {
            setFormState((prev) => ({
              ...prev,
              pincode: cleanPin,
              city: details.city,
              state: details.state,
            }))
          }
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
      updateUser({
        name: formState.name.trim(),
        phone: formState.phone.trim(),
        address: formState.address.trim(),
        pincode: formState.pincode.trim(),
        city: formState.city.trim(),
        state: formState.state.trim(),
      })
      setIsSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }, 250)
  }

  // Handle direct sign-in from /profile page if unauthenticated
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(authForm)
  }

  // Filter orders placed by this customer
  const userOrders = useMemo(() => {
    if (!user) return []
    const targetEmail = (user.email || '').toLowerCase().trim()
    return orders.filter((order: any) => {
      const custEmail = (order.customer?.userEmail || order.customer?.email || '').toLowerCase().trim()
      return custEmail === targetEmail || !custEmail
    })
  }, [orders, user])

  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'Master Admin & Creator Ops' ||
    user?.email === 'npatelierindia@gmail.com'

  // If user is not logged in, show luxury Account Sign-In View directly on this page
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] text-[#141414] pb-20">
        <ToastContainer />

        {/* Top Minimal Navigation Bar */}
        <header className="sticky top-0 z-30 border-b border-[#DFCFA6]/60 bg-white/95 backdrop-blur-md shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white px-3.5 py-2 text-xs font-bold text-[#5C4106] shadow-xs hover:bg-[#FAF5E8] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Atelier Storefront</span>
            </Link>

            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#141414]">
              {branding?.siteName || 'NP Atelier'}
            </span>
          </div>
        </header>

        {/* Sign In & Account Creation Hero Card */}
        <main className="max-w-xl mx-auto px-4 pt-12 sm:pt-16">
          <div className="rounded-[2.2rem] border border-[#D4AF37]/40 bg-white p-6 sm:p-10 shadow-[0_20px_60px_rgba(180,135,45,0.18)]">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF5E8] border border-[#D4AF37]/50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#875A10]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#B8860B]" />
                Customer &amp; Patron Portal
              </span>
              <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#141414]">
                {authMode === 'login' ? 'Sign In to Your Account' : 'Create Atelier Account'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#6B5E4F] max-w-sm mx-auto">
                Access your delivery addresses, track live bespoke orders, and view saved collections.
              </p>

              {/* Toggle Login / Register */}
              <div className="mt-6 flex rounded-full border border-[#DFCFA6]/80 bg-[#FAF8F5] p-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 rounded-full py-2.5 text-xs font-bold transition cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-black shadow-sm'
                      : 'text-[#6B5E4F] hover:text-[#141414]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 rounded-full py-2.5 text-xs font-bold transition cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-black shadow-sm'
                      : 'text-[#6B5E4F] hover:text-[#141414]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">Phone Number</label>
                    <input
                      type="tel"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#141414]">
                        Delivery PIN Code <span className="text-[#875A10]">(6 Digits)</span>
                      </label>
                      {isLocatingPin && (
                        <span className="text-[10px] font-bold text-[#B8860B] animate-pulse">
                          Detecting location...
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={authForm.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value, true)}
                      placeholder="e.g. 110001, 400001, 560001"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none"
                    />
                    {pinStatus && (
                      <p className="mt-1 text-[11px] font-medium text-[#875A10]">{pinStatus}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#141414]">City</label>
                      <input
                        type="text"
                        value={authForm.city}
                        onChange={(e) => setAuthForm({ ...authForm, city: e.target.value })}
                        placeholder="City"
                        className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#141414]">State</label>
                      <input
                        type="text"
                        value={authForm.state}
                        onChange={(e) => setAuthForm({ ...authForm, state: e.target.value })}
                        placeholder="State"
                        className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">Delivery Street Address</label>
                    <textarea
                      rows={2}
                      value={authForm.address}
                      onChange={(e) => setAuthForm({ ...authForm, address: e.target.value })}
                      placeholder="Flat/House No., Street Name, Near Landmark..."
                      className="w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] p-3 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-[#141414]">Email Address</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#141414]">Password</label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="btn-gold w-full py-3.5 text-xs shadow-md justify-center font-bold tracking-wide mt-2 cursor-pointer"
              >
                {authMode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                <span>{authMode === 'login' ? 'Sign In to Account' : 'Create Atelier Account'}</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    )
  }

  // Full Customer Profile Page
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#141414] pb-24">
      <ToastContainer />

      {/* Top Luxury Sticky Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[#DFCFA6]/60 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-white px-3.5 py-2 text-xs font-bold text-[#5C4106] shadow-xs hover:bg-[#FAF5E8] transition active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Storefront</span>
            </Link>

            <div className="hidden sm:block h-5 w-px bg-[#DFCFA6]" />

            <span className="hidden sm:inline font-serif text-lg font-bold tracking-tight text-[#141414]">
              {branding?.siteName || 'NP Atelier'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#FAF5E8] px-3 py-1.5 text-xs font-bold text-[#875A10] hover:bg-[#F5ECD5] transition shadow-2xs"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-[#B8860B]" />
                <span className="hidden md:inline">Admin Console</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                logout()
                router.push('/')
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
        {/* VIP Profile Hero Banner */}
        <div className="relative rounded-[2.2rem] border border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]/90 p-6 sm:p-10 shadow-[0_20px_60px_rgba(180,135,45,0.18)] overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-radial from-[#ECC872]/30 to-transparent blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Avatar circle */}
              <div className="relative shrink-0">
                {user.avatarImage ? (
                  <img
                    src={user.avatarImage}
                    alt={user.name}
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg"
                  />
                ) : (
                  <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-full bg-gradient-to-tr from-[#14100A] to-[#2B2319] text-2xl sm:text-3xl font-serif font-black text-[#ECC872] border-2 border-[#D4AF37] shadow-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[#14100A] text-[#ECC872] border border-[#D4AF37] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* User Identity Info */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141414]">
                    {user.name || 'Artisan Collector'}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF5E8] border border-[#D4AF37]/60 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#875A10] shadow-2xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#B8860B]" />
                    {isAdmin ? 'Administrator & Studio Creator' : 'Artisan Patron & Collector'}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-[#6B5E4F] font-medium">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#B8860B]" />
                    <span>{user.email}</span>
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#B8860B]" />
                      <span>{user.phone}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#B8860B]" />
                    <span>Member since {user.memberSince || '2026'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Account Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto shrink-0">
              <div className="rounded-2xl border border-[#DFCFA6]/60 bg-white/90 p-3 sm:p-4 text-center shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#875A10]">Orders</p>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#141414] mt-0.5">
                  {userOrders.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#DFCFA6]/60 bg-white/90 p-3 sm:p-4 text-center shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#875A10]">Wishlist</p>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#141414] mt-0.5">
                  {wishlistedProducts.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#DFCFA6]/60 bg-white/90 p-3 sm:p-4 text-center shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#875A10]">Bag</p>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#141414] mt-0.5">
                  {cartCount}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-[#DFCFA6]/80 bg-white/80 p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-black shadow-md'
                  : 'text-[#6B5A3E] hover:text-[#141414] hover:bg-[#FAF6ED]'
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
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-black shadow-md'
                  : 'text-[#6B5A3E] hover:text-[#141414] hover:bg-[#FAF6ED]'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Bespoke Orders</span>
              {userOrders.length > 0 && (
                <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#14100A] px-1.5 text-[9px] font-black text-[#ECC872]">
                  {userOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wishlist')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-black shadow-md'
                  : 'text-[#6B5A3E] hover:text-[#141414] hover:bg-[#FAF6ED]'
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
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-black shadow-md'
                  : 'text-[#6B5A3E] hover:text-[#141414] hover:bg-[#FAF6ED]'
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
            <div className="lg:col-span-2 rounded-[2rem] border border-[#DFCFA6]/60 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DFCFA6]/40 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#141414]">Personal &amp; Delivery Details</h2>
                  <p className="text-xs text-[#6B5E4F] mt-0.5">
                    Update your primary shipping address for 1-click WhatsApp orders and seamless checkout.
                  </p>
                </div>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800 animate-in fade-in">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleProfileSave} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Aniket Sharma"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none transition"
                    />
                  </div>
                </div>

                {/* 6-digit PIN code with auto detection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#141414]">
                      Delivery PIN Code <span className="text-[#875A10]">(6 Digits)</span>
                    </label>
                    {isLocatingPin && (
                      <span className="text-[11px] font-bold text-[#B8860B] animate-pulse">
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
                    className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none transition tracking-wider"
                  />
                  {pinStatus && (
                    <p className="mt-1 text-[11px] font-medium text-[#875A10]">{pinStatus}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">City / Town</label>
                    <input
                      type="text"
                      value={formState.city}
                      onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                      placeholder="City"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">State / Region</label>
                    <input
                      type="text"
                      value={formState.state}
                      onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                      placeholder="State"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#141414]">
                    Street Address / House No. / Landmark
                  </label>
                  <textarea
                    rows={3}
                    value={formState.address}
                    onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                    placeholder="Flat/House No., Street Name, Near Landmark..."
                    className="w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] p-3 text-sm font-medium text-[#141414] focus:border-[#D4AF37] focus:bg-white outline-none transition"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-gold py-3.5 px-8 text-xs shadow-md font-bold tracking-wide cursor-pointer disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile & Delivery Address'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Saved Delivery Card Preview */}
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-[#DFCFA6]/70 bg-gradient-to-b from-[#FFFDF9] to-[#FAF6ED] p-6 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#875A10]">
                  <MapPin className="h-4 w-4 text-[#B8860B]" />
                  <span>Primary Delivery Card</span>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-4.5 border border-[#DFCFA6]/60 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-base font-bold text-[#141414]">
                      {formState.name || user.name || 'Recipient Name'}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-[#5C4106] leading-relaxed">
                    {formState.address || 'No street address provided yet.'}
                  </p>

                  <p className="text-xs font-bold text-[#141414]">
                    {[formState.city, formState.state, formState.pincode].filter(Boolean).join(', ') || 'India'}
                  </p>

                  <div className="pt-2 border-t border-[#DFCFA6]/40 text-[11px] text-[#6B5E4F] flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#B8860B]" />
                    <span>{formState.phone || 'Phone not set'}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-[#FAF5E8] p-3 text-[11px] text-[#6B5E4F] flex items-start gap-2">
                  <Truck className="h-4 w-4 text-[#B8860B] shrink-0 mt-0.5" />
                  <span>
                    This address will be auto-attached when you order via WhatsApp concierge or standard online checkout.
                  </span>
                </div>
              </div>

              {/* Account Security Card */}
              <div className="rounded-[2rem] border border-[#DFCFA6]/60 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#141414]">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Patron Account Security</span>
                </div>
                <p className="mt-1 text-xs text-[#6B5E4F]">
                  Your account is protected by encrypted session management. We never share your personal shipping address.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bespoke Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">My Bespoke Orders</h2>
                <p className="text-xs text-[#6B5E4F] mt-0.5">
                  Track live status, shipping schedules, and direct WhatsApp concierge updates.
                </p>
              </div>
              <Link
                href="/#collection"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white px-4 py-2 text-xs font-bold text-[#5C4106] hover:bg-[#FAF5E8] transition"
              >
                <Compass className="h-3.5 w-3.5 text-[#B8860B]" />
                <span>Explore More Drops</span>
              </Link>
            </div>

            {userOrders.length === 0 ? (
              <div className="rounded-[2rem] border border-[#DFCFA6]/60 bg-white p-12 text-center shadow-xs">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FAF5E8] border border-[#D4AF37]/40 text-[#B8860B]">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-[#141414]">
                  No Bespoke Orders Yet
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#6B5E4F] max-w-md mx-auto">
                  You haven&apos;t placed any orders yet. Discover our master-crafted resin decors, botanical soy candles, and exotic aquatic drops!
                </p>
                <Link
                  href="/#collection"
                  className="mt-6 btn-gold text-xs py-3 px-8 mx-auto inline-flex"
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
                    className="rounded-[2rem] border border-[#DFCFA6]/60 bg-white p-5 sm:p-7 shadow-xs hover:border-[#D4AF37] transition space-y-4"
                  >
                    {/* Order Title Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFCFA6]/40 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base sm:text-lg font-bold text-[#141414]">
                            Order #{order.orderId}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF5E8] border border-[#D4AF37]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#875A10]">
                            <Clock className="h-3 w-3 text-[#B8860B]" />
                            {order.date}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B5E4F] mt-1">
                          Live Status:{' '}
                          <strong className="text-emerald-700 font-bold">{order.status}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-base sm:text-xl font-serif font-black text-[#141414]">
                          {order.total || '₹0'}
                        </p>
                        <span className="text-[11px] text-[#875A10] font-bold">
                          {order.items?.length || 1} Item(s)
                        </span>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {order.items?.map((item: any, iIdx: number) => (
                        <div
                          key={iIdx}
                          className="flex items-center gap-3 rounded-2xl bg-[#FAF8F5] p-3 border border-[#DFCFA6]/40"
                        >
                          <img
                            src={item.image || '/products/ceramic-mug.jpg'}
                            alt={item.title}
                            className="h-14 w-14 rounded-xl object-cover border border-[#DFCFA6]/50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#141414] truncate">{item.title}</p>
                            <p className="text-[11px] text-[#7A6A53] mt-0.5">
                              Qty: {item.quantity || 1} • <strong className="text-[#141414]">{item.price}</strong>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DFCFA6]/40">
                      <span className="text-xs text-[#6B5E4F] flex items-center gap-1.5 font-medium">
                        <Truck className="h-4 w-4 text-[#B8860B]" />
                        <span>Estimated Delivery: {order.estimatedDelivery || '4-5 Business Days'}</span>
                      </span>

                      <a
                        href={`https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20would%20like%20to%20track%20my%20order%20%23${order.orderId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-600/40 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
                      >
                        <MessageCircle className="h-4 w-4 text-emerald-600" />
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">My Saved Wishlist</h2>
                <p className="text-xs text-[#6B5E4F] mt-0.5">
                  Exclusive handcrafted creations and rare aquatic drops saved for later.
                </p>
              </div>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-[#DFCFA6]/60 bg-white p-12 text-center shadow-xs">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FAF5E8] border border-[#D4AF37]/40 text-rose-500">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-[#141414]">
                  Wishlist is Empty
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#6B5E4F] max-w-md mx-auto">
                  Tap the heart icon on any handcrafted artifact or exotic aquatic drop to save it to your bespoke collection.
                </p>
                <Link
                  href="/#collection"
                  className="mt-6 btn-gold text-xs py-3 px-8 mx-auto inline-flex"
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
                    className="flex flex-col justify-between rounded-[2rem] border border-[#DFCFA6]/60 bg-white p-4.5 shadow-xs hover:border-[#D4AF37] transition"
                  >
                    <div className="flex gap-4">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="h-20 w-20 rounded-2xl object-cover border border-[#DFCFA6]/50 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-[#875A10]">
                          {prod.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#141414] truncate mt-0.5">{prod.title}</h4>
                        <p className="text-base font-serif font-black text-[#141414] mt-1">
                          {prod.price}
                        </p>
                      </div>
                    </div>

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
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#FAF5E8] py-2.5 text-xs font-bold text-[#5C4106] hover:bg-[#F5ECD5] transition cursor-pointer"
                    >
                      <ShoppingBag className="h-4 w-4 text-[#B8860B]" />
                      <span>Move to Shopping Bag</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Artisan Studio & Concierge */}
        {activeTab === 'concierge' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2.2rem] border border-[#DFCFA6]/60 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FAF5E8] border border-[#D4AF37]/40 text-[#B8860B]">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#141414]">
                Sell With NP Atelier • Zero Setup Fees
              </h3>
              <p className="text-xs text-[#6B5E4F] leading-relaxed">
                Are you an independent jewelry artisan, candle crafter, or aquatic breeder? Join our collective to showcase your creations across India with complete shipping and customer service support.
              </p>
              <Link
                href="/#makers"
                className="inline-flex items-center gap-2 btn-gold text-xs py-3 px-6 cursor-pointer"
              >
                <span>Explore Artisan Collective</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2.2rem] border border-[#DFCFA6]/60 bg-gradient-to-b from-[#FFFDF9] to-[#FAF6ED] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#141414]">
                Direct WhatsApp Concierge
              </h3>
              <p className="text-xs text-[#6B5E4F] leading-relaxed">
                Need urgent customization, bulk gifting inquiries, live fish arrival verification, or instant order assistance? Chat directly with our founder &amp; concierge desk.
              </p>
              <a
                href="https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20am%20in%20my%20customer%20profile%20and%20need%20concierge%20support."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-600 bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition"
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
        <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
            <p className="font-serif text-xs font-bold text-[#5C4106] tracking-wider uppercase">
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

"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  X,
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
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { lookupPincode } from '../utils/pincodeLookup'

export default function UserProfileModal() {
  const {
    user,
    isProfileOpen,
    setIsProfileOpen,
    profileTab,
    setProfileTab,
    updateUser,
    logout,
    orders,
    wishlistedProducts,
    addToCart,
    setIsSellOpen,
    showToast,
  } = useMarketplace()

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile')
  const [isLocatingPin, setIsLocatingPin] = useState(false)
  const [pinStatus, setPinStatus] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Local form state
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
  })

  // Synchronize form with user on load or when user data updates
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

  // Synchronize initial tab from context
  useEffect(() => {
    if (profileTab) {
      setActiveTab(profileTab)
    }
  }, [profileTab, isProfileOpen])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isProfileOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isProfileOpen])

  if (!isProfileOpen || !user) return null

  // Filter orders placed by this customer
  const userOrders = orders.filter((order: any) => {
    const custEmail = (order.customer?.userEmail || order.customer?.email || '').toLowerCase().trim()
    const targetEmail = (user.email || '').toLowerCase().trim()
    return custEmail === targetEmail || !custEmail
  })

  // Live Indian PIN code auto-resolution
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
            title: 'Location Detected',
            message: `PIN ${cleanPin} resolved to ${details.city}, ${details.state}.`,
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
    }, 250)
  }

  const isAdmin =
    user.role === 'admin' ||
    user.role === 'Master Admin & Creator Ops' ||
    user.email === 'npatelierindia@gmail.com'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsProfileOpen(false)}
      >
        <motion.div
          key="user-profile-modal"
          className="relative flex flex-col w-full max-w-2xl max-h-[92vh] rounded-[2rem] bg-white border border-[#D4AF37]/40 shadow-[0_25px_70px_rgba(180,135,45,0.25)] overflow-hidden"
          initial={{ scale: 0.95, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={() => setIsProfileOpen(false)}
            className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-[#DFCFA6]/60 bg-white/90 text-[#141414] shadow-sm transition hover:bg-[#FAF6ED] hover:border-[#D4AF37] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Header with Warm Royal Ivory & Gold Theme */}
          <div className="relative border-b border-[#DFCFA6]/60 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]/80 px-6 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Avatar circle */}
              <div className="relative shrink-0">
                {user.avatarImage ? (
                  <img
                    src={user.avatarImage}
                    alt={user.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
                  />
                ) : (
                  <div className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-full bg-gradient-to-tr from-[#14100A] to-[#2B2319] text-xl sm:text-2xl font-serif font-black text-[#ECC872] border-2 border-[#D4AF37] shadow-md">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#14100A] text-[#ECC872] border border-[#D4AF37] shadow-xs">
                  <Sparkles className="h-3 w-3" />
                </div>
              </div>

              {/* User Identity Info */}
              <div className="text-center sm:text-left min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141414] truncate">
                    {user.name || 'Artisan Collector'}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF5E8] border border-[#D4AF37]/60 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#875A10] shadow-2xs">
                    <ShieldCheck className="h-3 w-3 text-[#B8860B]" />
                    {isAdmin ? 'Administrator & Studio Creator' : 'Artisan Patron & Collector'}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6B5E4F]">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-[#B8860B]" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-[#B8860B]" />
                      <span>{user.phone}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#B8860B]" />
                    <span>Member since {user.memberSince || '2026'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 flex rounded-2xl border border-[#DFCFA6]/80 bg-white/80 p-1 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profile')
                  setProfileTab?.('profile')
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-extrabold shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                    : 'text-[#6B5A3E] hover:text-[#141414] hover:bg-[#FAF6ED]'
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Address &amp; Contact</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('orders')
                  setProfileTab?.('orders')
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-extrabold shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                    : 'text-[#6B5A3E] hover:text-[#141414] hover:bg-[#FAF6ED]'
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                <span>My Orders</span>
                {userOrders.length > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#14100A] px-1 text-[9px] font-black text-[#ECC872]">
                    {userOrders.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('wishlist')
                  setProfileTab?.('wishlist')
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-extrabold shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                    : 'text-[#6B5A3E] hover:text-[#141414] hover:bg-[#FAF6ED]'
                }`}
              >
                <Heart className="h-3.5 w-3.5" />
                <span>Wishlist</span>
                {wishlistedProducts.length > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
                    {wishlistedProducts.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Body Content with Custom Luxury Scroller */}
          <div className="flex-1 overflow-y-auto sidebar-scroller p-5 sm:p-7 space-y-6">
            {/* TAB 1: Profile & Delivery Address */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="rounded-2xl border border-[#DFCFA6]/60 bg-[#FAF8F5] p-4 text-xs text-[#5A554E]">
                  <p className="font-bold text-[#141414] flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Auto-Fill Delivery Details</span>
                  </p>
                  <p className="mt-1">
                    Your saved delivery address is automatically applied when placing bespoke orders or requesting orders via WhatsApp concierge.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Aniket Sharma"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-white px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-white px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
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
                    className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-white px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium tracking-wider"
                  />
                  {pinStatus && (
                    <p className="mt-1 text-[11px] font-medium text-[#875A10]">{pinStatus}</p>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">City / Town</label>
                    <input
                      type="text"
                      value={formState.city}
                      onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                      placeholder="City"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-white px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">State / Region</label>
                    <input
                      type="text"
                      value={formState.state}
                      onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                      placeholder="State"
                      className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-white px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#141414]">
                    Street Address / House No. / Landmark
                  </label>
                  <textarea
                    rows={2}
                    value={formState.address}
                    onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                    placeholder="Flat/House No., Street Name, Near Landmark..."
                    className="w-full rounded-xl border border-[#DFCFA6]/80 bg-white p-3 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-gold w-full py-3.5 text-xs shadow-[0_6px_20px_rgba(212,175,55,0.35)] justify-center font-bold tracking-wide cursor-pointer disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile & Delivery Address'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Order History */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="rounded-3xl border border-[#DFCFA6]/60 bg-[#FAF8F5] p-8 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FAF5E8] border border-[#D4AF37]/40 text-[#B8860B]">
                      <Package className="h-7 w-7" />
                    </div>
                    <h4 className="mt-3 font-serif text-lg font-bold text-[#141414]">
                      No Bespoke Orders Yet
                    </h4>
                    <p className="mt-1 text-xs text-[#6B5E4F] max-w-sm mx-auto">
                      You haven’t placed any orders yet. Discover our master-crafted jewelry, botanical decors, and exotic aquatic drops!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false)
                        const el = document.getElementById('collection')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="mt-4 btn-gold text-xs py-2.5 px-6 mx-auto cursor-pointer"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Explore Masterpieces</span>
                    </button>
                  </div>
                ) : (
                  userOrders.map((order: any, idx: number) => (
                    <div
                      key={order.orderId || idx}
                      className="rounded-2xl border border-[#DFCFA6]/60 bg-[#FAF8F5] p-4.5 space-y-3.5 shadow-2xs hover:border-[#D4AF37] transition"
                    >
                      {/* Order Title Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFCFA6]/40 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-sm font-bold text-[#141414]">
                              Order #{order.orderId}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF5E8] border border-[#D4AF37]/40 px-2 py-0.5 text-[10px] font-bold text-[#875A10]">
                              <Clock className="h-3 w-3 text-[#B8860B]" />
                              {order.date}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6B5E4F] mt-0.5">
                            Status:{' '}
                            <strong className="text-emerald-700 font-semibold">{order.status}</strong>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-serif font-black text-[#141414]">
                            {order.total || '₹0'}
                          </p>
                          <span className="text-[10px] text-[#875A10] font-bold">
                            {order.items?.length || 1} Item(s)
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2">
                        {order.items?.map((item: any, iIdx: number) => (
                          <div
                            key={iIdx}
                            className="flex items-center gap-3 rounded-xl bg-white p-2.5 border border-[#DFCFA6]/40"
                          >
                            <img
                              src={item.image || '/products/ceramic-mug.jpg'}
                              alt={item.title}
                              className="h-11 w-11 rounded-lg object-cover border border-[#DFCFA6]/50 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#141414] truncate">{item.title}</p>
                              <p className="text-[10px] text-[#7A6A53]">
                                Qty: {item.quantity || 1} • {item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#DFCFA6]/40">
                        <span className="text-[11px] text-[#6B5E4F] flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5 text-[#B8860B]" />
                          <span>Est. Delivery: {order.estimatedDelivery || '4-5 Days'}</span>
                        </span>

                        <a
                          href={`https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20would%20like%20to%20track%20my%20order%20%23${order.orderId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/40 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Track on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: Saved Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                {wishlistedProducts.length === 0 ? (
                  <div className="rounded-3xl border border-[#DFCFA6]/60 bg-[#FAF8F5] p-8 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FAF5E8] border border-[#D4AF37]/40 text-rose-500">
                      <Heart className="h-7 w-7" />
                    </div>
                    <h4 className="mt-3 font-serif text-lg font-bold text-[#141414]">
                      Wishlist is Empty
                    </h4>
                    <p className="mt-1 text-xs text-[#6B5E4F] max-w-sm mx-auto">
                      Tap the heart icon on any handcrafted artifact or aquatic drop to save it to your bespoke collection.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {wishlistedProducts.map((prod: any) => (
                      <div
                        key={prod.id}
                        className="flex flex-col justify-between rounded-2xl border border-[#DFCFA6]/60 bg-[#FAF8F5] p-3 shadow-2xs hover:border-[#D4AF37] transition"
                      >
                        <div className="flex gap-3">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="h-16 w-16 rounded-xl object-cover border border-[#DFCFA6]/50 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-[#875A10]">
                              {prod.category}
                            </span>
                            <p className="text-xs font-bold text-[#141414] truncate">{prod.title}</p>
                            <p className="text-sm font-serif font-black text-[#141414] mt-0.5">
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
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/50 bg-white py-2 text-xs font-bold text-[#141414] hover:bg-[#FAF5E8] transition cursor-pointer"
                        >
                          <ShoppingBag className="h-3.5 w-3.5 text-[#B8860B]" />
                          <span>Add to Shopping Bag</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer with Quick Links & Logout */}
          <div className="border-t border-[#DFCFA6]/60 bg-[#FFFDF9] px-6 py-4 sm:px-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false)
                  setIsSellOpen(true)
                }}
                className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white px-3.5 py-2 text-xs font-bold text-[#5C4106] hover:bg-[#FAF5E8] transition cursor-pointer"
              >
                <Store className="h-3.5 w-3.5 text-[#B8860B]" />
                <span>Sell With Us</span>
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#FAF5E8] px-3.5 py-2 text-xs font-bold text-[#875A10] hover:bg-[#F5ECD5] transition"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-[#B8860B]" />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                logout()
                setIsProfileOpen(false)
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

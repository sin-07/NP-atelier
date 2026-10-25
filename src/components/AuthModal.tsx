"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  LogIn,
  MapPin,
  Phone,
  Sparkles,
  UserPlus,
  X,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { lookupPincode } from '../utils/pincodeLookup'
import { getSavedShippingAddress } from '../utils/addressStorage'

export default function AuthModal() {
  const router = useRouter()
  const {
    isAuthOpen,
    setIsAuthOpen,
    login,
    user,
    logout,
    showToast,
    cartItems,
    setIsCheckoutOpen,
    openProfile,
    triggerGlobalLoader,
  } = useMarketplace()
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [isLocatingPin, setIsLocatingPin] = useState(false)
  const [pinStatus, setPinStatus] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isAuthOpen])

  const [formState, setFormState] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    phone: user?.phone || '',
    address: user?.address || '',
    pincode: user?.pincode || '',
    city: user?.city || '',
    state: user?.state || '',
  })

  // Pre-fill formState from saved address storage
  useEffect(() => {
    if (!isAuthOpen) return
    const saved = getSavedShippingAddress()
    if (saved && (saved.address || saved.phone || saved.fullName)) {
      setFormState((prev) => ({
        ...prev,
        name: saved.fullName || prev.name || user?.name || '',
        phone: saved.phone || prev.phone || user?.phone || '',
        address: saved.address || prev.address || user?.address || '',
        pincode: saved.zip || prev.pincode || user?.pincode || '',
        city: saved.city || prev.city || user?.city || '',
        state: saved.state || prev.state || user?.state || '',
      }))
    }
  }, [isAuthOpen, user])

  // Handle live 6-digit Indian PIN code auto-detection
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
          setPinStatus('Could not resolve PIN automatically. Enter manually.')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthOpen(false)
    triggerGlobalLoader({
      mode: 'signin',
      title: mode === 'register' ? 'Creating Patron Membership' : 'Authorizing Patron Access',
      subtitle: 'Curated Artisan Marketplace & Living Waters',
      durationMs: 1150,
      onComplete: () => {
        login(formState)
        if (cartItems && cartItems.length > 0) {
          setTimeout(() => {
            setIsCheckoutOpen(true)
          }, 150)
        } else {
          router.push('/profile')
        }
      },
    })
  }

  return (
    <AnimatePresence>
      {isAuthOpen ? (
        <motion.div
          key="auth-modal-backdrop"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthOpen(false)}
        >
          <motion.div
            key="auth-modal-card"
            className="relative my-0 sm:my-8 w-full max-w-lg max-h-[92vh] sidebar-scroller rounded-t-[2.2rem] sm:rounded-[2.2rem] bg-white border border-[#D4AF37]/40 shadow-[0_25px_70px_rgba(180,135,45,0.25)]"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile pull indicator */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden">
              <div className="w-12 h-1 rounded-full bg-stone-300" />
            </div>

            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setIsAuthOpen(false)}
              className="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#DFCFA6]/60 bg-white text-[#141414] shadow-sm transition hover:bg-[#FAF6ED] hover:border-[#D4AF37] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="border-b border-[#DFCFA6]/60 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]/80 p-6 sm:p-8 text-[#141414]">
              <span className="section-eyebrow">Artisan Account</span>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-[#141414] font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Join Atelier NP Circle'}
              </h3>
              <p className="mt-1 text-xs text-[#5A554E] sm:text-sm font-medium">
                Save bespoke wishlists, auto-fill checkout delivery addresses, and sell handcrafted creations.
              </p>

              {/* Mode Tabs */}
              <div className="mt-5 flex rounded-full border border-[#DFCFA6]/80 bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 rounded-full py-2 text-xs font-bold transition cursor-pointer ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-extrabold shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                      : 'text-[#5A451A] hover:text-[#875A10]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 rounded-full py-2 text-xs font-bold transition cursor-pointer ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-extrabold shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                      : 'text-[#5A451A] hover:text-[#875A10]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
              {/* Mode: Register Fields (Address, PIN code, City, State, Phone) */}
              {mode === 'register' && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#141414]">Full Name</label>
                      <input
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Enter full name"
                        className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#141414]">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8C7A58]" />
                        <input
                          type="tel"
                          required
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] pl-9 pr-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141414]">
                      Street Address & House / Flat No.
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formState.address}
                      onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                      placeholder="e.g. Flat 402, Lotus Orchid, 12th Main Road, Indiranagar"
                      className="w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] p-3 text-xs leading-5 text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                    />
                  </div>

                  {/* PIN Code Field with Live Auto-fill */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#141414] flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#B8860B]" />
                        <span>Postal PIN Code (6 Digits)</span>
                      </label>
                      <span className="text-[10px] text-[#8C7A58]">
                        Auto-fills State & City
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={formState.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="e.g. 560038 or 110001"
                        className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 pr-28 text-sm font-bold text-[#141414] tracking-wider outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {isLocatingPin ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C7A58]">
                            <Loader2 className="h-3.5 w-3.5 text-[#B8860B] animate-spin" />
                            <span>Locating...</span>
                          </span>
                        ) : formState.pincode.length === 6 && formState.city ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-full px-2 py-0.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {pinStatus && (
                      <p className="mt-1 text-[11px] font-semibold text-[#7A6020] flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-[#B8860B]" />
                        <span>{pinStatus}</span>
                      </p>
                    )}
                  </div>

                  {/* Auto-filled City & State */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#141414] flex items-center justify-between">
                        <span>City / Capital / District</span>
                        <span className="text-[10px] font-normal text-[#8C7A58]">(Auto-filled)</span>
                      </label>
                      <div className="relative">
                        <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8C7A58]" />
                        <input
                          required
                          value={formState.city}
                          onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                          placeholder="e.g. Bengaluru"
                          className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] pl-9 pr-3.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#141414] flex items-center justify-between">
                        <span>State / Union Territory</span>
                        <span className="text-[10px] font-normal text-[#8C7A58]">(Auto-filled)</span>
                      </label>
                      <input
                        required
                        value={formState.state}
                        onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                        placeholder="e.g. Karnataka"
                        className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Common Fields: Email & Password */}
              <div>
                <label className="mb-1 block text-xs font-bold text-[#141414]">Email Address</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#141414]">Password</label>
                <input
                  type="password"
                  required
                  value={formState.password}
                  onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-gold w-full py-3.5 text-xs shadow-[0_6px_20px_rgba(212,175,55,0.35)] justify-center font-bold tracking-wide cursor-pointer"
                >
                  {mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  <span>{mode === 'login' ? 'Sign In to Account' : 'Create Artisan Account with Address'}</span>
                </button>
              </div>

              {user && (
                <div className="border-t border-[#DFCFA6]/40 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setIsAuthOpen(false)
                    }}
                    className="w-full text-center text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    Log Out of Current Session ({user.name})
                  </button>
                </div>
              )}

              <div className="border-t border-[#DFCFA6]/40 pt-3 text-center">
                <p className="text-[11px] text-[#5A554E]">
                  Authorized store operator or staff?{' '}
                  <a
                    href="/admin/login"
                    onClick={() => setIsAuthOpen(false)}
                    className="font-bold text-[#875A10] underline hover:text-[#B8860B] transition"
                  >
                    Admin Console Login →
                  </a>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
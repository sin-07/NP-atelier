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
import { useUIModals } from '../context/UIModalContext'
import { lookupPincode } from '../utils/pincodeLookup'
import { getSavedShippingAddress } from '../utils/addressStorage'
import { lockScroll, unlockScroll } from '../utils/scrollLock'
import { getWorldModalTheme } from '../utils/worldTheme'

export default function AuthModal() {
  const router = useRouter()
  const { isAuthOpen, setIsAuthOpen, setIsCheckoutOpen, openProfile } = useUIModals()
  const {
    login,
    user,
    logout,
    showToast,
    cartItems,
    triggerGlobalLoader,
    isAquaticTheme,
  } = useMarketplace()
  const wt = getWorldModalTheme(isAquaticTheme)
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

  useEffect(() => {
    if (isAuthOpen) {
      lockScroll()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsAuthOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        unlockScroll()
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isAuthOpen, setIsAuthOpen])

  return (
    <AnimatePresence>
      {isAuthOpen ? (
        <motion.div
          key="auth-modal-backdrop"
          className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center ${wt.backdrop} p-0 sm:p-4 overflow-hidden touch-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={() => setIsAuthOpen(false)}
        >
          <motion.div
            key="auth-modal-card"
            className={`relative my-0 sm:my-8 w-full max-w-lg max-h-[92vh] sidebar-scroller rounded-t-[2.2rem] sm:rounded-[2.2rem] ${wt.card} transform-gpu will-change-transform touch-auto overscroll-contain`}
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile pull indicator */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden">
              <div className={`w-12 h-1 rounded-full ${wt.pullBar}`} />
            </div>

            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setIsAuthOpen(false)}
              className={`absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full shadow-xs transition cursor-pointer ${wt.closeBtn}`}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className={`${wt.header} p-6 sm:p-8 ${wt.title}`}>
              <span className="section-eyebrow">
                {isAquaticTheme ? 'Acquario Account' : 'Artisan Account'}
              </span>
              <h3 className={`mt-2 font-tagline text-2xl sm:text-3xl font-bold ${wt.title}`}>
                {mode === 'login' ? 'Welcome Back' : 'Join Atelier NP Circle'}
              </h3>
              <p className={`mt-1 text-xs sm:text-sm font-medium ${wt.muted}`}>
                Save bespoke wishlists, auto-fill checkout delivery addresses, and sell handcrafted creations.
              </p>

              {/* Mode Tabs */}
              <div
                className={`mt-5 flex rounded-full border p-1 shadow-xs ${
                  isAquaticTheme
                    ? 'border-sky-300/70 bg-[#EBF6FD]'
                    : 'border-[#6D5738]/25 bg-[#F5F0E8]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 rounded-full py-2 text-xs font-bold transition cursor-pointer ${
                    mode === 'login'
                      ? isAquaticTheme
                        ? 'bg-[#E11D48] text-white font-extrabold shadow-xs'
                        : 'bg-[#D4AF78] text-[#141210] font-extrabold shadow-xs'
                      : isAquaticTheme
                      ? 'text-[#2C5270] hover:text-[#0A2540]'
                      : 'text-[#5C4D3C] hover:text-[#141210]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 rounded-full py-2 text-xs font-bold transition cursor-pointer ${
                    mode === 'register'
                      ? isAquaticTheme
                        ? 'bg-[#E11D48] text-white font-extrabold shadow-xs'
                        : 'bg-[#D4AF78] text-[#141210] font-extrabold shadow-xs'
                      : isAquaticTheme
                      ? 'text-[#2C5270] hover:text-[#0A2540]'
                      : 'text-[#5C4D3C] hover:text-[#141210]'
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
                      <label className={`mb-1 block text-xs font-bold ${wt.title}`}>Full Name</label>
                      <input
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Enter full name"
                        className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                      />
                    </div>
                    <div>
                      <label className={`mb-1 block text-xs font-bold ${wt.title}`}>
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <Phone className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${wt.muted}`} />
                        <input
                          type="tel"
                          required
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className={`h-11 w-full rounded-xl border pl-9 pr-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`mb-1 block text-xs font-bold ${wt.title}`}>
                      Street Address & House / Flat No.
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formState.address}
                      onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                      placeholder="e.g. Flat 402, Lotus Orchid, 12th Main Road, Indiranagar"
                      className={`w-full rounded-xl border p-3 text-xs leading-5 outline-none transition font-medium ${wt.input}`}
                    />
                  </div>

                  {/* PIN Code Field with Live Auto-fill */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`block text-xs font-bold flex items-center gap-1.5 ${wt.title}`}>
                        <MapPin className={`h-3.5 w-3.5 ${wt.accentText}`} />
                        <span>Postal PIN Code (6 Digits)</span>
                      </label>
                      <span className={`text-[10px] ${wt.muted}`}>
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
                        className={`h-11 w-full rounded-xl border px-3.5 pr-28 text-sm font-bold tracking-wider outline-none transition ${wt.input}`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {isLocatingPin ? (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${wt.accentText}`}>
                            <Loader2 className={`h-3.5 w-3.5 animate-spin ${wt.accentText}`} />
                            <span>Locating...</span>
                          </span>
                        ) : formState.pincode.length === 6 && formState.city ? (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold border rounded-full px-2 py-0.5 ${wt.greenBadge}`}>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Verified</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {pinStatus && (
                      <p className={`mt-1 text-[11px] font-semibold flex items-center gap-1 ${wt.accentText}`}>
                        <Sparkles className={`h-3 w-3 ${wt.accentText}`} />
                        <span>{pinStatus}</span>
                      </p>
                    )}
                  </div>

                  {/* Auto-filled City & State */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={`mb-1 block text-xs font-bold flex items-center justify-between ${wt.title}`}>
                        <span>City / Capital / District</span>
                        <span className={`text-[10px] font-normal ${wt.muted}`}>(Auto-filled)</span>
                      </label>
                      <div className="relative">
                        <Building2 className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${wt.muted}`} />
                        <input
                          required
                          value={formState.city}
                          onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                          placeholder="e.g. Bengaluru"
                          className={`h-11 w-full rounded-xl border pl-9 pr-3.5 text-sm font-semibold outline-none transition ${wt.input}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`mb-1 block text-xs font-bold flex items-center justify-between ${wt.title}`}>
                        <span>State / Union Territory</span>
                        <span className={`text-[10px] font-normal ${wt.muted}`}>(Auto-filled)</span>
                      </label>
                      <input
                        required
                        value={formState.state}
                        onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                        placeholder="e.g. Karnataka"
                        className={`h-11 w-full rounded-xl border px-3.5 text-sm font-semibold outline-none transition ${wt.input}`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Common Fields: Email & Password */}
              <div>
                <label className={`mb-1 block text-xs font-bold ${wt.title}`}>Email Address</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                />
              </div>

              <div>
                <label className={`mb-1 block text-xs font-bold ${wt.title}`}>Password</label>
                <input
                  type="password"
                  required
                  value={formState.password}
                  onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition font-medium ${wt.input}`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 text-xs justify-center font-bold tracking-wide cursor-pointer"
                >
                  {mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  <span>{mode === 'login' ? 'Sign In to Account' : 'Create Artisan Account with Address'}</span>
                </button>
              </div>

              {user && (
                <div className={`border-t pt-3 ${wt.divider}`}>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setIsAuthOpen(false)
                    }}
                    className={`w-full text-center text-xs font-bold hover:underline cursor-pointer ${
                      isAquaticTheme ? 'text-[#E11D48]' : 'text-rose-600'
                    }`}
                  >
                    Log Out of Current Session ({user.name})
                  </button>
                </div>
              )}

              <div className={`border-t pt-3 text-center ${wt.divider}`}>
                <p className={`text-[11px] ${wt.muted}`}>
                  Authorized store operator or staff?{' '}
                  <a
                    href="/admin/login"
                    onClick={() => setIsAuthOpen(false)}
                    className={`font-bold underline transition ${
                      isAquaticTheme
                        ? 'text-emerald-700 hover:text-emerald-900'
                        : 'text-[#7A5B32] hover:text-[#141210]'
                    }`}
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
"use client"

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogIn, UserPlus, X, Sparkles, KeyRound } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

const DEMO_USER = {
  name: 'Pooja Verma',
  email: 'pooja.verma@example.in',
  password: 'password123',
}

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, login, user, logout, showToast } = useMarketplace()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [formState, setFormState] = useState({
    name: user?.name || DEMO_USER.name,
    email: user?.email || DEMO_USER.email,
    password: DEMO_USER.password,
  })

  const handleFillDemoUser = () => {
    setFormState({
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    })
    if (showToast) {
      showToast({
        title: 'Demo Filled',
        message: 'Demo collector profile filled.',
        type: 'info',
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(formState)
    setIsAuthOpen(false)
  }

  return (
    <AnimatePresence>
      {isAuthOpen ? (
        <motion.div
          key="auth-modal-backdrop"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center overflow-y-auto bg-black/70 p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthOpen(false)}
        >
          <motion.div
            key="auth-modal-card"
            className="relative my-0 sm:my-8 w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-[2.2rem] sm:rounded-[2.2rem] bg-white border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(180,135,45,0.22)]"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
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
              <h3 className="mt-2 font-serif text-3xl text-[#141414] font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Join Atelier NP Circle'}
              </h3>
              <p className="mt-1 text-xs text-[#5A554E] sm:text-sm font-medium">
                Save bespoke wishlists, track handmade shipments, and connect directly with creators.
              </p>

              {/* Mode Tabs */}
              <div className="mt-5 flex rounded-full border border-[#DFCFA6]/80 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 rounded-full py-1.5 text-xs font-bold transition cursor-pointer ${
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
                  className={`flex-1 rounded-full py-1.5 text-xs font-bold transition cursor-pointer ${
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
              {/* Quick Demo Fill Pill */}
              <div className="flex items-center justify-between rounded-xl border border-[#D4AF37]/40 bg-[#FAF7F0] p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-[#B8860B]" />
                  <span className="font-bold text-[#141414]">Demo Collector Profile</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoUser}
                  className="rounded-lg border border-[#D4AF37]/50 bg-white px-2.5 py-1 text-[11px] font-bold text-[#5C4106] hover:bg-[#FAF5E8] transition shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3 text-[#B8860B]" />
                  <span>Pre-fill</span>
                </button>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#141414]">Full Name</label>
                <input
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Your full name"
                  className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                />
              </div>

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
                  {mode === 'login' ? 'Sign In to Account' : 'Create Artisan Account'}
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
                  Looking for creator &amp; inventory management?{' '}
                  <a
                    href="/admin/login"
                    onClick={() => setIsAuthOpen(false)}
                    className="font-bold text-[#875A10] underline hover:text-[#B8860B] transition"
                  >
                    Open Admin Login Portal →
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
"use client"

import { useState } from 'react'
import { CheckCircle2, Mail, Send, Sparkles } from 'lucide-react'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useMarketplace } from '../context/MarketplaceContext'

export default function Newsletter() {
  const { ref, isVisible } = useRevealOnScroll()
  const { showToast, applyCouponCode } = useMarketplace()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribed(true)
    showToast({
      title: 'Welcome to the Circle! 🌸',
      message: 'Here is your ₹150 welcome coupon: WELCOME150',
      type: 'success',
    })
  }

  const handleApplyWelcome = () => {
    applyCouponCode('WELCOME150')
  }

  return (
    <section id="newsletter" ref={ref} className={`section-shell py-14 sm:py-20 ${isVisible ? 'is-visible' : ''}`}>
      <div className="reveal is-visible relative overflow-hidden rounded-[2.5rem] border border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF8] via-[#FAF5E8] to-[#F7ECCF]/90 p-8 sm:p-12 lg:p-16 shadow-[0_16px_45px_rgba(184,134,11,0.12),0_0_20px_rgba(212,175,55,0.10)]">
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" /> Artisan Circle
            </span>
            <h2 className="heading-1 mt-3.5">
              Join the Soft <span className="italic font-normal text-gold-gradient">Handmade Circle</span>
            </h2>
            <p className="body-lead mt-4 max-w-xl text-[#4A4339]">
              Get notified of limited batch drops, maker studio journals, and seasonal DIY tutorials. Plus receive a <strong className="text-[#7A5408] font-bold">₹150 voucher</strong> on your first order.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80"
                alt="Artisan studio box"
                className="h-12 w-12 rounded-xl object-cover border border-[#D4AF37]/50 shadow-sm"
              />
              <p className="text-xs font-semibold text-[#7A5408]">
                ✨ Handcrafted boutique packaging • Dispatched across India
              </p>
            </div>
          </div>

          <div>
            {isSubscribed ? (
              <div className="rounded-3xl border border-[#D4AF37]/60 bg-gradient-to-br from-[#FFFDF8] to-[#FAF4E5] p-6 shadow-sm text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#FAF4E2] to-[#F5E8C4] border border-[#D4AF37]/50 text-[#8F650D]">
                  <CheckCircle2 className="h-6 w-6 text-[#8F650D]" />
                </div>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#141414]">You're on the list! ✨</h3>
                <p className="mt-1 text-xs text-[#4A4339]">
                  Use coupon code below at checkout for ₹150 off:
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="rounded-xl border-2 border-dashed border-[#D4AF37] bg-white px-3.5 py-1.5 font-mono text-sm font-bold text-[#5C4106] shadow-xs">
                    WELCOME150
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyWelcome}
                    className="btn-gold px-4 py-1.5 text-xs font-bold shadow-xs"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9E7314]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-14 w-full rounded-full border border-[#D4AF37]/50 bg-white pl-12 pr-5 text-sm text-[#141414] outline-none shadow-xs transition placeholder:text-[#8C827A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold h-14 px-8 text-sm font-bold shrink-0 shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  Subscribe & Get ₹150
                </button>
              </form>
            )}
            {!isSubscribed && (
              <p className="mt-2.5 text-center text-[11px] text-[#635B4F] sm:text-left">
                🔒 We respect your privacy. Zero spam, unsubscribe anytime.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

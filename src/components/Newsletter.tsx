"use client"

import { useState } from 'react'
import { CheckCircle2, Mail, Send, Sparkles } from 'lucide-react'
import { useGsapReveal } from '../hooks/useGsapReveal'
import { useMarketplace } from '../context/MarketplaceContext'

export default function Newsletter() {
  const { containerRef } = useGsapReveal({
    selector: '.gsap-newsletter-card',
    yOffset: 12,
    duration: 0.35,
  })
  const { showToast, applyCouponCode } = useMarketplace()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribed(true)
    showToast({
      title: 'Welcome to the Circle',
      message: 'Thank you for subscribing to NP Atelier Studio Notes.',
      type: 'success',
    })
  }

  return (
    <section id="newsletter" ref={containerRef} className="section-shell py-14 sm:py-20">
      <div className="gsap-newsletter-card relative overflow-hidden rounded-[2.5rem] border border-[rgba(212,175,120,0.25)] bg-[#191713] p-8 sm:p-12 lg:p-16 shadow-[0_16px_45px_rgba(0,0,0,0.6)]">
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF78]" /> Artisan Circle
            </span>
            <h2 className="heading-1 mt-3.5 text-[#F5EBDD]">
              Join the Soft <span className="italic font-normal text-gold-gradient">Handmade Circle</span>
            </h2>
            <p className="body-lead mt-4 max-w-xl text-[#B8AA96]">
              Get notified of limited batch drops, maker studio journals, and seasonal DIY tutorials directly from our atelier.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80"
                alt="Artisan studio box"
                className="h-12 w-12 rounded-xl object-cover border border-[rgba(212,175,120,0.25)] shadow-sm"
              />
              <p className="text-xs font-semibold text-[#D4AF78]">
                Handcrafted boutique packaging • Dispatched across India
              </p>
            </div>
          </div>

          <div>
            {isSubscribed ? (
              <div className="rounded-3xl border border-[rgba(212,175,120,0.25)] bg-[#12110F] p-6 shadow-sm text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)] text-[#D4AF78]">
                  <CheckCircle2 className="h-6 w-6 text-[#D4AF78]" />
                </div>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#F5EBDD]">You&apos;re on the list!</h3>
                <p className="mt-1 text-xs text-[#B8AA96]">
                  Thank you for joining. You will receive exclusive early access to artisan drops and studio journals.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#D4AF78]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-14 w-full rounded-full border border-[rgba(212,175,120,0.25)] bg-[#0B0B0A] pl-12 pr-5 text-sm text-[#F5EBDD] outline-none shadow-xs transition placeholder:text-[#B8AA96]/50 focus:border-[#D4AF78] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary h-14 px-8 text-sm font-bold shrink-0 shadow-sm cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Subscribe
                </button>
              </form>
            )}
            {!isSubscribed && (
              <p className="mt-2.5 text-center text-[11px] text-[#B8AA96] sm:text-left">
                We respect your privacy. Zero spam, unsubscribe anytime.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

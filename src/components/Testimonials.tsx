"use client"

import { CheckCircle2, Heart, Star, Quote } from 'lucide-react'
import { useGsapReveal } from '../hooks/useGsapReveal'

const TESTIMONIALS_DATA = [
  {
    name: 'Emma Thompson',
    role: 'Interior Designer & Studio Stylist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote:
      'Each piece feels meaningful, intentional, and full of heart. The craftsmanship is both beautiful and inspiring.',
    rating: 5,
    craft: 'Botanical Resin Tray',
  },
  {
    name: 'Maya Chen',
    role: 'Verified Buyer • Silk Bangles Collector',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    quote:
      'The silk bangles and kundan earrings arrived in gorgeous velvet-lined packaging. The craftsmanship feels like high-end boutique couture.',
    rating: 5,
    craft: 'Silk Thread Bangles Set',
  },
  {
    name: 'Iris Bennett',
    role: 'Verified Buyer • Gift Curator',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    quote:
      'Ordering bespoke custom items with custom engravings was so seamless. The seller kept me updated and the hand-poured candle smells heavenly.',
    rating: 5,
    craft: 'Custom Soy Candle',
  },
]

export default function Testimonials() {
  const { containerRef } = useGsapReveal({
    selector: '.gsap-testimonial-item',
    stagger: 0.04,
    yOffset: 12,
    duration: 0.35,
  })

  return (
    <section id="about" ref={containerRef} className="section-shell py-16 sm:py-24">
      <div className="space-y-12">
        {/* Editorial Featured Quote */}
        <div className="gsap-testimonial-item mx-auto max-w-4xl text-center px-4 space-y-4">
          <div className="flex justify-center">
            <Quote className="h-10 w-10 text-[#D4AF78]/60 rotate-180" />
          </div>
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[#F5EBDD] leading-snug">
            &ldquo;Each piece feels meaningful, intentional, and full of heart. The craftsmanship is both beautiful and inspiring.&rdquo;
          </blockquote>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF78]">
            Emma Thompson &#8226; Interior Designer
          </p>
        </div>

        <div className="gsap-testimonial-item mx-auto max-w-2xl text-center pt-6">
          <span className="section-eyebrow">
            <Heart className="h-3.5 w-3.5 text-[#D4AF78]" /> Collector Love
          </span>
          <h2 className="heading-1 mt-3.5">
            Loved by Handmade <span className="italic font-normal text-gold-gradient">Lovers Worldwide</span>
          </h2>
          <p className="body-lead mx-auto mt-3 max-w-2xl text-[#B8A68B]">
            Read authentic reviews from collectors who cherish thoughtful artisan craftsmanship.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <article
              key={idx}
              className="gsap-testimonial-item flex flex-col justify-between rounded-[2rem] border border-[#6D5738]/35 bg-gradient-to-b from-[#181714] via-[#141311] to-[#0E0D0C] p-6 sm:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-[#D4AF78]/70 hover:shadow-[0_16px_36px_rgba(0,0,0,0.8)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-[#D4AF78]">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#D4AF78] text-[#D4AF78]" />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-[#0B0B0A]/90 border border-[#6D5738]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#D4AF78] shadow-xs">
                    <CheckCircle2 className="h-3 w-3 text-[#D4AF78]" /> Verified Purchase
                  </span>
                </div>

                <p className="mt-4 font-serif text-base sm:text-lg italic leading-relaxed text-[#F5EBDD]">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#6D5738]/30 pt-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-11 w-11 rounded-full border border-[#D4AF78] object-cover shadow-sm"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#F5EBDD]">{t.name}</h4>
                    <p className="text-[11px] text-[#B8A68B] font-medium">{t.role}</p>
                  </div>
                </div>
                {t.craft && (
                  <span className="hidden sm:inline-block rounded-full bg-[#0B0B0A]/90 border border-[#6D5738]/40 px-2.5 py-1 text-[10px] font-bold text-[#B8A68B]">
                    {t.craft}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

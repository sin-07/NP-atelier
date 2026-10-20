"use client"

import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Leaf,
} from 'lucide-react'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { fallbackCraftImage } from '../utils/fallbackImage'

const showcaseItems = [
  {
    title: 'Evil Eye Mandala Pendant',
    price: '₹1,599',
    category: 'Handmade Jewelry',
    image: '/products/atelier-evil-eye-pendant.jpg',
    className: 'top-2 left-0 sm:left-4 -rotate-6 w-36 sm:w-44',
  },
  {
    title: 'Royal Discus Aquatic Pair',
    price: '₹2,999',
    category: 'Fish & Aquarium',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b38?auto=format&fit=crop&w=800&q=80',
    className: 'top-8 right-0 sm:right-2 rotate-6 w-40 sm:w-48',
  },
  {
    title: 'Ruby Initial Keychains',
    price: '₹1,299',
    category: 'Accessories',
    image: '/products/atelier-ruby-glitter-keychains.jpg',
    className: 'bottom-2 left-6 -rotate-3 w-36 sm:w-44',
  },
]

export default function Hero() {
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section id="home" ref={ref} className={`section-shell pt-4 sm:pt-8 ${isVisible ? 'is-visible' : ''}`}>
      <div className="reveal is-visible relative overflow-hidden rounded-[2.5rem] border border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF8] via-[#FAF4E5] to-[#F7ECCF]/90 p-6 sm:p-10 lg:p-14 shadow-[0_18px_45px_rgba(184,134,11,0.10),0_0_25px_rgba(212,175,55,0.10)]">
        {/* Radiant Warm Golden Ambient Glow Spheres (lightweight, isolated) */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#F5DE98]/35 blur-2xl pointer-events-none" />
        <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-[#FAD97A]/30 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#E8C86A]/25 blur-2xl pointer-events-none" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Text Content */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="section-eyebrow">
                <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" /> Handcrafted With Soul & Living Nature
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/45 bg-gradient-to-r from-white to-[#FDF9EE] px-3.5 py-1 text-xs font-bold text-[#4D3605] shadow-xs">
                <Users className="h-3.5 w-3.5 text-[#B8860B]" /> 240+ Verified Makers & Aquarists
              </span>
            </div>

            <h1 className="heading-display mt-6 sm:text-6xl lg:text-7xl">
              Where Art Meets <br />
              <span className="italic font-normal text-gold-gradient">
                Living Imagination.
              </span>
            </h1>

            <p className="body-lead mt-6 sm:text-lg">
              Discover a world where creativity and living nature merge through handmade artisan crafts and exotic aquatics. Every piece and specimen is curated with passion, skill, and care.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                className="btn-primary py-4 px-8 text-sm sm:text-base tracking-wide"
              >
                <span>Explore Collection</span>
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </a>

              <a
                href="#collection"
                className="btn-secondary py-4 px-7 text-sm font-bold tracking-wide border-teal-500/50 hover:border-teal-600"
              >
                <span>🐠 Fish & Aquarium</span>
              </a>
            </div>

            {/* Social Proof Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#E8DCC2] pt-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Artisan maker"
                      className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-0.5 text-[#B8860B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#D4AF37] text-[#B8860B]" />
                    ))}
                  </div>
                  <p className="font-bold text-[#141414]">4.9/5 &#8226; 3,400+ Verified Reviews</p>
                </div>
              </div>

              <div className="hidden h-8 w-px bg-[#E2D2B0] sm:block" />

              <div className="text-xs font-semibold text-[#4A4339]">
                <p className="font-bold text-[#141414] flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5 text-[#7A5408]" /> 100% Eco Packaging
                </p>
                <p className="text-[#635B4F]">Biodegradable boxes & honeycomb wrap</p>
              </div>
            </div>
          </div>

          {/* Interactive Floating Showcase */}
          <div className="relative mx-auto h-[460px] w-full max-w-[540px] lg:h-[520px]">
            {/* Center Artisan Ambient Disc */}
            <div className="absolute inset-8 rounded-[3rem] bg-gradient-to-br from-[#FAF5E8] to-[#F5EBD0] border border-[#D4AF37]/45 shadow-[0_8px_30px_rgba(184,134,11,0.08)]" />

            {/* Showcase Floating Cards */}
            {showcaseItems.map((item, idx) => (
              <div
                key={item.title}
                className={`absolute ${item.className}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: idx * 0.08, ease: 'easeOut' }}
                  className="overflow-hidden rounded-[2rem] border border-[#D4AF37]/60 bg-gradient-to-b from-white via-[#FCF8EE] to-[#F7ECCF] p-2.5 shadow-[0_12px_28px_rgba(184,134,11,0.12)] transition-transform duration-200 ease-out hover:scale-[1.03] hover:border-[#D4AF37]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = fallbackCraftImage
                      }}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-white/95 border border-[#D4AF37]/50 px-3 py-1.5 text-[10px] font-bold text-[#141414] shadow-sm">
                      <span className="truncate max-w-[90px]">{item.title}</span>
                      <span className="text-[#9E7314] font-black">{item.price}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}

            {/* Floating Center Pill */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div className="rounded-full border border-[#D4AF37]/75 bg-gradient-to-b from-white via-[#FFFDF8] to-[#FAF3DE] px-6 py-4 text-center shadow-[0_10px_28px_rgba(184,134,11,0.18)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#241A06] to-[#141414] border border-[#D4AF37]/60 text-[#ECC872] font-black text-sm shadow-xs">
                    ★
                  </span>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#946B08]">Limited Drop</p>
                    <p className="font-serif text-lg font-bold text-[#141414]">Spring Artisan Edition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Perks Row */}
        <div className="mt-12 grid grid-cols-2 gap-3.5 border-t border-[#E8DCC2] pt-8 sm:grid-cols-4">
          {[
            { icon: HeartHandshake, title: 'Direct from Makers', desc: 'Zero middlemen markup' },
            { icon: Sparkles, title: 'Bespoke Customization', desc: 'Engraving & color choices' },
            { icon: PackageCheck, title: 'Eco-Friendly Wrap', desc: 'Plastic-free boutique pack' },
            { icon: ShieldCheck, title: 'Artisan Guarantee', desc: '100% safe transit or refund' },
          ].map((perk, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/45 bg-gradient-to-b from-white via-[#FCF9EE] to-[#FAF4E2] p-3.5 shadow-xs transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(184,134,11,0.12)]"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#FAF4E2] to-[#F5E8C4] border border-[#D4AF37]/40 text-[#8F650D]">
                <perk.icon className="h-5 w-5 text-[#8F650D]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#141414]">{perk.title}</p>
                <p className="text-[11px] text-[#6E6860]">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

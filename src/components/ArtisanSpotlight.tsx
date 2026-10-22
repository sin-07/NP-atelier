"use client"

import { ArrowRight, Award, MapPin, Star } from 'lucide-react'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { useGsapReveal } from '../hooks/useGsapReveal'

const ARTISANS = [
  {
    id: 1,
    name: 'Atelier NP Creative Studio',
    role: 'DIY Paint Kits & Bespoke Resin',
    location: 'Flagship Atelier Studio',
    experience: 'Signature Creator',
    rating: 4.99,
    reviews: 580,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    cover: '/products/atelier-diy-paint-kit-sea.jpg',
    bio: 'Where elegance is handcrafted. Creator of signature plaster DIY paint kits, evil eye protective jewelry, and custom ruby gold resin monogram keepsakes.',
    badges: ['Official Atelier Brand', 'Top Rated'],
  },
  {
    id: 2,
    name: 'Clara & Fern Botanicals',
    role: 'Pressed Florals & UV Resin Artist',
    location: 'Portland, OR',
    experience: '5+ Years Crafting',
    rating: 4.98,
    reviews: 680,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80',
    bio: 'Hand-foraging wild meadow blooms, pressing for 6 weeks, and casting in crystalline UV resin to preserve nature.',
    badges: ['Top Rated Artisan', '100% Hand-Foraged'],
  },
  {
    id: 3,
    name: 'Aiden & Co. Apothecary',
    role: 'Hand-Poured Botanical Candles',
    location: 'Burlington, VT',
    experience: '6+ Years Crafting',
    rating: 4.94,
    reviews: 520,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80',
    bio: 'Small-batch soy candles poured at low temperatures with pure wooden wicks, therapeutic essential oils, and dried buds.',
    badges: ['Clean Burn Certified', 'Zero-Plastic'],
  },
]

export default function ArtisanSpotlight() {
  const { containerRef } = useGsapReveal<HTMLElement>({
    targetSelector: '.gsap-artisan-item',
    stagger: 0.04,
    y: 12,
    duration: 0.35,
  })

  return (
    <section ref={containerRef} className="section-shell py-16 sm:py-24">
      <div className="space-y-10">
        <div className="gsap-artisan-item mx-auto max-w-3xl text-center">
          <span className="section-eyebrow">
            <Award className="h-3.5 w-3.5 text-[#B8860B]" /> Meet the Makers
          </span>
          <h2 className="heading-1 mt-3.5">
            Real Craftspeople Behind <span className="italic font-normal text-gold-gradient">Every Creation</span>
          </h2>
          <p className="body-lead mx-auto mt-4 max-w-2xl text-[#4A4339]">
            Every piece in the Atelier NP marketplace is designed and sculpted by independent artisans. When you buy, you directly support their creative studios.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTISANS.map((artisan) => (
            <article
              key={artisan.id}
              className="gsap-artisan-item group overflow-hidden rounded-[2rem] border border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF8] via-[#FAF5E8] to-[#F7ECCF]/80 p-5 shadow-[0_8px_24px_rgba(184,134,11,0.08)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_14px_32px_rgba(184,134,11,0.18)]"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-[#F6F3EE] border border-[#E8DEC7]">
                <img
                  src={artisan.cover}
                  alt={artisan.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = fallbackCraftImage
                  }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="flex items-center gap-1 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-[#ECC872]" /> {artisan.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-white">
                    <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" /> {artisan.rating} ({artisan.reviews})
                  </span>
                </div>
              </div>

              <div className="relative -mt-7 px-2">
                <div className="flex items-end justify-between">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
                  />
                  <span className="rounded-full bg-white/95 border border-[#D4AF37]/50 px-3 py-1 text-[11px] font-bold text-[#735206] shadow-xs">
                    {artisan.experience}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="heading-3">{artisan.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7A5408]">
                    {artisan.role}
                  </p>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#4A4339] line-clamp-3">
                    {artisan.bio}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E8DEC7] pt-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {artisan.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-white/90 border border-[#D4AF37]/45 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#694806]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#collection"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7A5408] transition hover:text-[#4D3505]"
                  >
                    <span>View Crafts</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

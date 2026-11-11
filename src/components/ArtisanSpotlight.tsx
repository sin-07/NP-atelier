"use client"

import { ArrowRight, Award, MapPin, Sparkles, Star } from 'lucide-react'
import { fallbackAquariumImage, fallbackCraftImage } from '../utils/fallbackImage'
import { useGsapReveal } from '../hooks/useGsapReveal'
import { useMarketplace } from '../context/MarketplaceContext'

const FEATURED_MAKERS = [
  {
    id: 'punam-kumari',
    name: 'Punam Kumari',
    role: 'Founder & Lead Resin / Craft Artist',
    studioTag: 'NP Atelier Craft Studio',
    experience: 'Co-Founder & Maker',
    location: 'India',
    image: '/makers/punam-kumari.jpg',
    bio: 'Creator of NP Atelier handmade pressed-flower resin art, botanical candles, keychain keepsakes, and signature DIY craft kits crafted with love.',
    badges: ['Resin Art & Gifts', 'DIY Craft Kits', 'Botanical Keepsakes'],
    actionLabel: 'Explore Crafts',
    actionTarget: 'crafts' as const,
  },
  {
    id: 's-nandan-verma',
    name: 'S. Nandan Verma',
    role: 'Founder, Educator & Aquarist',
    studioTag: 'Acquario Tropicale & Nature Systems',
    experience: 'Founder & Aquarist',
    location: 'India',
    image: '/makers/s-nandan-verma.jpg',
    bio: 'Biology & environmental science educator building self-sustaining Walstad freshwater ecosystems, indoor aquatic tubs, moss terrariums, and planted nature setups.',
    badges: ['Walstad Aquariums', 'Planted Nature Tubs', 'Aquatic Flora & Fauna'],
    actionLabel: 'Explore Aquatics',
    actionTarget: 'aquarium' as const,
  },
]

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
  const { setActiveDepartment } = useMarketplace()
  const { containerRef } = useGsapReveal<HTMLElement>({
    targetSelector: '.gsap-artisan-item',
    stagger: 0.04,
    y: 12,
    duration: 0.35,
  })

  const handleFeaturedAction = (target: 'crafts' | 'aquarium') => {
    if (target === 'aquarium') {
      setActiveDepartment('aquarium')
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }
    const collectionEl = typeof document !== 'undefined' ? document.getElementById('collection') : null
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section ref={containerRef} className="section-shell py-16 sm:py-24">
      <div className="space-y-10">
        <div className="gsap-artisan-item mx-auto max-w-3xl text-center">
          <span className="section-eyebrow">
            <Award className="h-3.5 w-3.5 text-[#8C6838]" /> Meet the Makers
          </span>
          <h2 className="heading-1 mt-3.5">
            Real Craftspeople Behind <span className="italic font-normal text-gold-gradient">Every Creation</span>
          </h2>
          <p className="body-lead mx-auto mt-4 max-w-2xl text-[#524436]">
            Every piece in the Atelier NP marketplace is designed and sculpted by independent artisans. When you buy, you directly support their creative studios.
          </p>
        </div>

        {/* Featured Makers / Creators Portrait Showcase */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {FEATURED_MAKERS.map((maker) => (
            <article
              key={maker.id}
              className="gsap-artisan-item group overflow-hidden rounded-[2rem] border border-[#8C6D46]/30 bg-gradient-to-b from-[#FCF9F4] via-[#FAF6EE] to-[#F3ECE0] p-4 sm:p-5 shadow-[0_10px_28px_rgba(72,54,30,0.09)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-[#B8925A] hover:shadow-[0_18px_40px_rgba(72,54,30,0.14)]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#8C6D46]/25 bg-[#EDE4DD]">
                <img
                  src={maker.image}
                  alt={maker.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src =
                      maker.actionTarget === 'aquarium' ? fallbackAquariumImage : fallbackCraftImage
                  }}
                  className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-4 px-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8C6D46]/30 bg-[#EFE8DC] px-3 py-1 text-[11px] font-bold text-[#7A5B32]">
                    <Sparkles className="h-3 w-3 text-[#8C6838]" />
                    <span>{maker.experience}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#5C4D3C]">
                    <MapPin className="h-3.5 w-3.5 text-[#8C6838]" />
                    <span>{maker.location}</span>
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-tagline text-2xl sm:text-[1.65rem] font-bold text-[#141210]">
                    {maker.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7A5B32] mt-0.5">
                    {maker.role}
                  </p>
                  <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-[#5C4D3C]">
                    {maker.bio}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#8C6D46]/20 pt-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {maker.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-[#EFE8DC] border border-[#8C6D46]/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5C4D3C]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFeaturedAction(maker.actionTarget)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#7A5B32] transition hover:text-[#141210] cursor-pointer"
                  >
                    <span>{maker.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTISANS.map((artisan) => (
            <article
              key={artisan.id}
              className="gsap-artisan-item group overflow-hidden rounded-[2rem] border border-[#8C6D46]/25 bg-gradient-to-b from-[#FCF9F4] via-[#FAF6EE] to-[#F3ECE0] p-5 shadow-[0_8px_24px_rgba(72,54,30,0.08)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-[#B8925A] hover:shadow-[0_16px_36px_rgba(72,54,30,0.14)]"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-[#EDE4DD] border border-[#8C6D46]/25">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#F5EBDD]">
                  <span className="flex items-center gap-1 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-[#D4AF78]" /> {artisan.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#F5EBDD]">
                    <Star className="h-3.5 w-3.5 fill-[#D4AF78] text-[#D4AF78]" /> {artisan.rating} ({artisan.reviews})
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
                    className="h-14 w-14 rounded-full border-2 border-[#D4AF78] object-cover shadow-md"
                  />
                  <span className="rounded-full bg-[#FCF9F4]/95 border border-[#8C6D46]/35 px-3 py-1 text-[11px] font-bold text-[#7A5B32] shadow-xs">
                    {artisan.experience}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-tagline text-xl font-bold text-[#141210]">{artisan.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7A5B32]">
                    {artisan.role}
                  </p>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#5C4D3C] line-clamp-3">
                    {artisan.bio}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#8C6D46]/20 pt-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {artisan.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-[#EFE8DC] border border-[#8C6D46]/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5C4D3C]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#collection"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7A5B32] transition hover:text-[#141210]"
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

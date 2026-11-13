"use client"

import { ArrowRight, Award, MapPin, Quote, Sparkles } from 'lucide-react'
import { fallbackAquariumImage, fallbackCraftImage } from '../utils/fallbackImage'
import { useGsapReveal } from '../hooks/useGsapReveal'
import { useMarketplace } from '../context/MarketplaceContext'

const FEATURED_MAKERS = [
  {
    id: 'poonam-verma',
    name: 'Poonam Verma',
    role: 'Founder • Lead Resin Artist & Educator',
    studioTag: 'NP Atelier Craft Studio',
    experience: 'Founder & Creator',
    location: 'India',
    image: '/makers/punam-kumari.jpg',
    bio: 'Visionary behind NP Atelier—handcrafting pressed-flower resin keepsakes, floral heart charms, keychains, glowing botanical candles, and signature DIY craft kits. Balancing craft business and teaching with family, wellness, and big dreams, she pours care into every handmade creation.',
    quote:
      'Dream Big… Create More… Be Happy — create with love, stay grateful always, and spread positivity through every handmade piece.',
    badges: ['Resin Art & Gifts', 'DIY Craft Kits', 'Teaching & Craft Business', 'Botanical Candles'],
    actionLabel: 'Explore Crafts',
    actionTarget: 'crafts' as const,
  },
  {
    id: 's-nandan-verma',
    name: 'S. Nandan Verma',
    role: 'Co-Founder • Educator & Aquarist',
    studioTag: 'Acquario Tropicale & Nature Systems',
    experience: 'Co-Founder & Aquarist',
    location: 'India',
    image: '/makers/s-nandan-verma.jpg',
    bio: 'Biology, zoology & environmental science educator (M.Sc., Patna) and creator of RAVEN. Cultivates filterless 135L Walstad ecosystems, 90L shrimp & Corydoras indoor tubs, live microfauna cultures (Daphnia & Moina), plant propagation, and Selaginella moss terrariums.',
    quote:
      'Curiosity + Discipline = Freedom — small things make big worlds when you teach, explore, and build from darkness to light.',
    badges: ['135L Walstad & 90L Tubs', 'Biology & Zoology', 'Live Microfauna & Moss', 'Plant Propagation'],
    actionLabel: 'Explore Aquatics',
    actionTarget: 'aquarium' as const,
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
              className="gsap-artisan-item group flex flex-col overflow-hidden rounded-[2rem] border border-[#8C6D46]/30 bg-gradient-to-b from-[#FCF9F4] via-[#FAF6EE] to-[#F3ECE0] p-4 sm:p-5 shadow-[0_10px_28px_rgba(72,54,30,0.09)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-[#B8925A] hover:shadow-[0_18px_40px_rgba(72,54,30,0.14)]"
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

              <div className="mt-4 flex flex-1 flex-col justify-between px-1">
                <div>
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

                    <blockquote className="mt-3.5 rounded-2xl border-l-2 border-[#B8925A] bg-[#EFE8DC]/70 px-3.5 py-2.5">
                      <div className="flex items-start gap-2">
                        <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8C6838]" />
                        <p className="font-tagline italic text-[13.5px] sm:text-sm leading-relaxed text-[#3A2E21]">
                          &ldquo;{maker.quote}&rdquo;
                        </p>
                      </div>
                    </blockquote>
                  </div>
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
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#7A5B32] transition hover:text-[#141210] cursor-pointer shrink-0"
                  >
                    <span>{maker.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

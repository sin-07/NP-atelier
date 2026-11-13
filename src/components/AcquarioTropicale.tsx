"use client"

import { useMemo, useState, useEffect, useDeferredValue } from 'react'
import {
  Fish,
  Waves,
  ShieldCheck,
  Sparkles,
  Droplets,
  Search,
  Mail,
  MessageCircle,
  ChevronRight,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  Video,
  ThermometerSnowflake,
  Compass,
  SlidersHorizontal,
} from 'lucide-react'
import ProductCard from './ProductCard'
import {
  aquariumCategories,
  aquariumCategoryGroups,
  fishAndAquariumProducts,
  Product,
} from '../data/products'
import { useMarketplace } from '../context/MarketplaceContext'
import { fallbackAquariumImage } from '../utils/fallbackImage'
import { AQUATIC_CONTACT_EMAIL } from '../utils/worldTheme'

const AQUARIUM_BADGE_FILTERS = [
  'All',
  'Live Arrival Guarantee',
  'Captive Bred',
  'Optiwhite Ultra-Clear',
  'Centerpiece Fish',
  'New Drop',
]

type StageTabKey = 'fish' | 'tanks' | 'flora'

interface StageShowcase {
  indexLabel: string
  tabLabel: string
  shortLabel: string
  primary: {
    title: string
    subtitle: string
    category: string
    price: string
    badge: string
    image: string
  }
  companion: {
    title: string
    subtitle: string
    category: string
    price: string
    badge: string
    image: string
  }
  telemetry: {
    heading: string
    specs: string
    note: string
  }
}

const AQUARIO_STAGE_DROPS: Record<StageTabKey, StageShowcase> = {
  fish: {
    indexLabel: '01',
    tabLabel: 'Centerpiece Fauna',
    shortLabel: 'Fauna',
    primary: {
      title: 'Royal Blue Diamond Discus Pair',
      subtitle: 'Captive Bred • Peaceful Show Centerpiece',
      category: 'Live Freshwater Fish',
      price: '₹2,999',
      badge: 'Captive Bred',
      image: '/products/royal-discus-aquarium.jpg',
    },
    companion: {
      title: 'Neon Blue Dwarf Gourami Trio',
      subtitle: 'Community Safe • Active Top-Swimmer',
      category: 'Live Freshwater Fish',
      price: '₹549',
      badge: 'Live Guarantee',
      image: '/products/acquario-dwarf-gourami.jpg',
    },
    telemetry: {
      heading: 'Acclimation Chemistry',
      specs: '26–29°C • pH 6.4–7.0',
      note: 'Quarantined 14 days before oxygen crating',
    },
  },
  tanks: {
    indexLabel: '02',
    tabLabel: 'Rimless Glass',
    shortLabel: 'Glass',
    primary: {
      title: 'Ultra-Clear Rimless 60P Aquarium (64L)',
      subtitle: '6mm Optiwhite Low-Iron Edge-Mitered Glass',
      category: 'Aquariums & Nano Tanks',
      price: '₹4,499',
      badge: '91% Clarity',
      image: '/products/acquario-rimless-tank.jpg',
    },
    companion: {
      title: 'Ocellaris Clownfish Bonded Pair',
      subtitle: 'Reef Safe • Saltwater Ready',
      category: 'Marine & Saltwater Fish',
      price: '₹1,899',
      badge: 'Marine Classic',
      image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    },
    telemetry: {
      heading: 'Optical Transmission',
      specs: '91.5% Light Clarity',
      note: 'Invisible silicone seams with foam leveling mat',
    },
  },
  flora: {
    indexLabel: '03',
    tabLabel: 'Planted Flora',
    shortLabel: 'Flora',
    primary: {
      title: 'Anubias Petite on Driftwood Bonsai',
      subtitle: '100% Snail-Free Tissue Culture • Low-Tech Ready',
      category: 'Live Aquatic Plants & Aquascaping',
      price: '₹799',
      badge: 'No CO2 Needed',
      image: '/products/acquario-planted-bonsai.jpg',
    },
    companion: {
      title: 'Samurai Koi Halfmoon Betta',
      subtitle: 'Show Grade Dragon Scale',
      category: 'Live Freshwater Fish',
      price: '₹899',
      badge: 'Show Grade',
      image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    },
    telemetry: {
      heading: 'Walstad & Bio-Filter Prep',
      specs: 'Zero Algae • Zero Pests',
      note: 'Root-conditioned in mineral-rich studio tubs',
    },
  },
}

export default function AcquarioTropicale() {
  const {
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
  } = useMarketplace()

  const [stageTab, setStageTab] = useState<StageTabKey>('fish')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeBadge, setActiveBadge] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [visibleCount, setVisibleCount] = useState(12)

  // Filter ONLY aquarium products - fall back cleanly to built-in aquarium catalog
  const allAquariumProducts = useMemo(() => {
    const filtered = products.filter((p: Product) => {
      return p.department === 'aquarium' || aquariumCategories.includes(p.category)
    })
    return filtered.length > 0 ? filtered : fishAndAquariumProducts
  }, [products])

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const item of allAquariumProducts) {
      map[item.category] = (map[item.category] || 0) + 1
    }
    return map
  }, [allAquariumProducts])

  const aquaticCategoryPills = useMemo(() => {
    const dynamicCats = Array.from(
      new Set([
        ...aquariumCategories,
        ...allAquariumProducts.map((p: Product) => p.category).filter(Boolean),
      ])
    )
    return ['All', ...dynamicCats]
  }, [allAquariumProducts])

  useEffect(() => {
    setVisibleCount(12)
  }, [activeCategory, activeBadge, searchTerm, sortBy])

  const filteredProducts = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase()

    const result = allAquariumProducts.filter((product: Product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const matchesBadge =
        activeBadge === 'All' ||
        (product.badges || []).some((b) =>
          b.toLowerCase().includes(activeBadge.toLowerCase())
        )
      const matchesSearch =
        query.length === 0 ||
        [product.title, product.category, product.description, ...(product.badges || [])]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesCategory && matchesBadge && matchesSearch
    })

    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const pA = Number.parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0
        const pB = Number.parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0
        return pA - pB
      })
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const pA = Number.parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0
        const pB = Number.parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0
        return pB - pA
      })
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return result
  }, [allAquariumProducts, activeCategory, activeBadge, deferredSearchTerm, sortBy])

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, visibleCount])

  const scrollToCatalogue = (categoryFilter?: string) => {
    if (categoryFilter) {
      setActiveCategory(categoryFilter)
    }
    const el = document.getElementById('aquario-catalogue')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const currentStage = AQUARIO_STAGE_DROPS[stageTab]

  return (
    <section
      id="acquario-tropicale"
      className="relative scroll-mt-24 pt-4 sm:pt-6 pb-16 sm:pb-24 bg-[#F0F7FC] text-[#0A2540] overflow-x-clip"
    >
      {/* Anchor for backwards compatibility */}
      <div id="aquarium" className="relative -top-28 pointer-events-none" />

      {/* Subtle Open-Canvas Atmospheric Glows (Zero outer white card box) */}
      <div
        className="pointer-events-none absolute -top-20 -left-24 h-96 w-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(2,132,199,0.14) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute top-16 right-0 h-[28rem] w-[28rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }}
      />

      {/* =====================================================================
          BAND 1: OPEN-CANVAS PANORAMIC MOSAIC HERO (Blue + Emerald Palette)
         ===================================================================== */}
      <div className="section-shell relative z-10">
        {/* Minimal Hairline Studio Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-300/55 pb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <img
              src="/acquario-tropicale-logo.jpg"
              alt="Acquario Tropicale Crest"
              className="h-6 w-6 rounded-full border border-emerald-500/50 object-cover scale-110 shadow-xs"
            />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0369A1]">
              Acquario Tropicale • Patna Nature Studio
            </span>
          </div>

          <a
            href={`mailto:${AQUATIC_CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-[#ECFDF5] px-3.5 py-1 text-[11px] font-bold text-emerald-800 shadow-2xs hover:bg-emerald-100/80 transition"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Launching Soon • Pre-Book via Desk</span>
          </a>
        </div>

        {/* Open 12-Col Architectural Mosaic (Left Editorial Column + Right Feature Panorama & Bento) */}
        <div className="mt-7 sm:mt-10 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* LEFT 5 COLS: Editorial Narrative & Telemetry */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 pt-1">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/75 bg-white/85 px-3 py-1 text-[11px] font-bold text-[#0369A1] shadow-2xs">
                <Waves className="h-3.5 w-3.5 text-emerald-600" />
                <span>Curated Nature Aquatics</span>
              </span>

              <h1 className="mt-4 font-tagline text-4xl sm:text-5xl lg:text-[3.55rem] font-semibold tracking-tight text-[#0A2540] leading-[1.06]">
                Living Waters, <br />
                <span className="italic font-medium bg-gradient-to-r from-[#0369A1] via-[#0D9488] to-[#059669] bg-clip-text text-transparent font-tagline">
                  Sculpted in Serenity.
                </span>
              </h1>

              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#2C5270] leading-relaxed font-medium">
                Captive-bred Royal Blue Discus &amp; Show Bettas, low-iron Optiwhite rimless nature tanks, Walstad ecosystems, and snail-free tissue flora—acclimated in Patna and dispatched with oxygen packing.
              </p>

              {/* Action Row (Navy + Emerald + Clean Email Link, zero red) */}
              <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToCatalogue('All')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0A2540] via-[#0369A1] to-[#0284C7] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(3,105,161,0.24)] hover:brightness-110 hover:-translate-y-0.5 transition cursor-pointer group"
                >
                  <span>Browse Specimen Drops</span>
                  <ArrowUpRight className="h-4 w-4 stroke-[2.4] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <a
                  href="https://wa.me/919341297124?text=Hi%20Acquario%20Tropicale%2C%20I%20want%20to%20inquire%20about%20fish%2C%20plants%2C%20or%20rimless%20tanks!"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/75 bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(5,150,105,0.22)] hover:bg-emerald-700 hover:-translate-y-0.5 transition cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Reserve on WhatsApp</span>
                </a>
              </div>

              <div className="mt-4">
                <a
                  href={`mailto:${AQUATIC_CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0369A1] hover:text-emerald-700 transition"
                >
                  <Mail className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="underline decoration-sky-400/60 underline-offset-4">
                    {AQUATIC_CONTACT_EMAIL}
                  </span>
                </a>
              </div>
            </div>

            {/* Minimal Studio Specification Footer Strip */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t border-sky-300/60 pt-5">
              <div>
                <p className="font-bold text-xs sm:text-sm text-[#0A2540] flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>100% Live</span>
                </p>
                <p className="text-[11px] text-[#2C5270] mt-0.5 leading-snug">
                  Oxygen &amp; insulated pack
                </p>
              </div>

              <div className="border-l border-sky-300/50 pl-3 sm:pl-4">
                <p className="font-bold text-xs sm:text-sm text-[#0A2540] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                  <span>91% Clarity</span>
                </p>
                <p className="text-[11px] text-[#2C5270] mt-0.5 leading-snug">
                  Low-iron Optiwhite glass
                </p>
              </div>

              <div className="border-l border-sky-300/50 pl-3 sm:pl-4">
                <p className="font-bold text-xs sm:text-sm text-[#0A2540] flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>Snail-Free</span>
                </p>
                <p className="text-[11px] text-[#2C5270] mt-0.5 leading-snug">
                  Quarantined tissue flora
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: Asymmetric Panoramic Museum Collage (1 Main Feature + 2 Compact Bento Tiles) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Numbered Underline Stage Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1 rounded-full border border-sky-300/75 bg-white/90 p-1 shadow-xs">
                {(Object.keys(AQUARIO_STAGE_DROPS) as StageTabKey[]).map((key) => {
                  const active = stageTab === key
                  const item = AQUARIO_STAGE_DROPS[key]
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStageTab(key)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-bold transition-colors duration-150 cursor-pointer focus:outline-none ${
                        active
                          ? 'bg-gradient-to-r from-[#0369A1] to-[#059669] text-white shadow-xs'
                          : 'text-[#2C5270] hover:text-[#0A2540] hover:bg-sky-50'
                      }`}
                    >
                      <span className={`font-mono text-[10px] ${active ? 'text-sky-100' : 'text-emerald-700'}`}>
                        {item.indexLabel}
                      </span>
                      <span className="hidden sm:inline">{item.tabLabel}</span>
                      <span className="sm:hidden">{item.shortLabel}</span>
                    </button>
                  )
                })}
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 hidden sm:inline-flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-sky-600" />
                <span>Studio Gallery Preview</span>
              </span>
            </div>

            {/* Primary Wide Panoramic Habitat Feature */}
            <article
              onClick={() => scrollToCatalogue(currentStage.primary.category)}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-sky-300/70 bg-white shadow-[0_18px_42px_rgba(12,74,110,0.10)] transition duration-300 hover:border-emerald-500/70"
            >
              <div className="relative aspect-[16/9] sm:aspect-[16/9] w-full overflow-hidden bg-[#E2F0FA]">
                <img
                  src={currentStage.primary.image}
                  alt={currentStage.primary.title}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = fallbackAquariumImage
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07182B]/95 via-[#07182B]/45 to-transparent" />

                {/* Top Badges */}
                <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-emerald-400/60 px-3 py-1 text-[10.5px] font-extrabold text-emerald-800 shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {currentStage.primary.badge}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#0369A1]/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                    Pre-Book Drop
                  </span>
                </div>

                {/* Bottom Un-cluttered Editorial Caption */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 !text-white">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 drop-shadow-xs">
                      {currentStage.primary.category}
                    </span>
                    <h2 className="font-tagline text-xl sm:text-2xl font-bold leading-snug !text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
                      {currentStage.primary.title}
                    </h2>
                    <span className="block text-xs text-sky-100 mt-0.5 [text-shadow:0_1px_6px_rgba(0,0,0,0.65)]">
                      {currentStage.primary.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-black text-[#0A2540] shadow-xs">
                      {currentStage.primary.price}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white group-hover:bg-emerald-500 transition">
                      <span>Inspect</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Bottom 2-Tile Mosaic Row: Companion Specimen + Water Telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <article
                onClick={() => scrollToCatalogue(currentStage.companion.category)}
                className="group flex items-center gap-3.5 cursor-pointer rounded-2xl border border-sky-300/70 bg-white/95 p-3 shadow-[0_8px_22px_rgba(12,74,110,0.07)] transition hover:-translate-y-0.5 hover:border-emerald-500/75"
              >
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-[#E2F0FA] border border-sky-200 shrink-0">
                  <img
                    src={currentStage.companion.image}
                    alt={currentStage.companion.title}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = fallbackAquariumImage
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block truncate">
                    {currentStage.companion.badge}
                  </span>
                  <h3 className="font-tagline text-sm font-bold text-[#0A2540] leading-snug line-clamp-1 mt-0.5">
                    {currentStage.companion.title}
                  </h3>
                  <p className="text-[11px] text-[#2C5270] truncate mt-0.5">
                    {currentStage.companion.subtitle}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs font-black text-[#0369A1]">
                      {currentStage.companion.price}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 group-hover:underline inline-flex items-center gap-0.5">
                      View <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>

              <div className="flex flex-col justify-between rounded-2xl border border-emerald-400/45 bg-gradient-to-br from-[#F4FAFE] via-white to-[#ECFDF5] p-4 shadow-[0_8px_22px_rgba(12,74,110,0.06)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-[#0369A1]">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{currentStage.telemetry.heading}</span>
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <p className="font-tagline text-lg font-bold text-[#0A2540] mt-1.5">
                  {currentStage.telemetry.specs}
                </p>
                <p className="text-[11px] font-medium text-[#2C5270] mt-1 leading-relaxed">
                  {currentStage.telemetry.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          BAND 2: NUMBERED HABITAT DIVISIONS STRIP
         ===================================================================== */}
      <div className="section-shell mt-10 sm:mt-14">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-4 px-1">
          <div>
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">
              Explore By Division
            </span>
            <h2 className="font-tagline text-xl sm:text-2xl font-bold text-[#0A2540] mt-0.5">
              Aquatic Worlds &amp; Habitat Gear
            </h2>
          </div>
          {activeCategory !== 'All' && (
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="text-xs font-bold text-[#0369A1] hover:text-emerald-700 hover:underline cursor-pointer"
            >
              Show All Divisions ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {aquariumCategoryGroups.slice(0, 4).map((cat, idx) => {
            const isSelected = activeCategory === cat.title
            const count = categoryCounts[cat.title] || 0
            return (
              <button
                key={cat.title}
                type="button"
                onClick={() => {
                  const nextCat = isSelected ? 'All' : cat.title
                  setActiveCategory(nextCat)
                }}
                className={`group flex items-center gap-3.5 rounded-2xl border p-3 text-left transition duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isSelected
                    ? 'border-[#0369A1] bg-gradient-to-r from-[#E0F2FE] via-[#FFFFFF] to-[#ECFDF5] shadow-[0_8px_22px_rgba(3,105,161,0.14)] ring-1 ring-[#0369A1]/30'
                    : 'border-sky-300/65 bg-white hover:border-emerald-500/75 hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(12,74,110,0.06)]'
                }`}
              >
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[#E2F0FA] border border-sky-200/80 shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = fallbackAquariumImage
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="absolute top-1 left-1 rounded bg-[#0A2540]/80 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                    0{idx + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-700">
                    {cat.badge}
                  </span>
                  <h3 className="font-tagline text-sm font-bold text-[#0A2540] leading-snug truncate mt-0.5">
                    {cat.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold text-[#2C5270]">
                      {count} {count === 1 ? 'listing' : 'listings'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 font-extrabold ${
                        isSelected ? 'text-[#0369A1]' : 'text-sky-700 group-hover:text-emerald-700'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Filter'}
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* =====================================================================
          BAND 3: SPECIMEN CATALOGUE COMMAND DOCK & GRID
         ===================================================================== */}
      <div id="aquario-catalogue" className="section-shell mt-10 sm:mt-14 scroll-mt-24">
        <div className="rounded-2xl sm:rounded-3xl border border-sky-300/65 bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(12,74,110,0.07)] space-y-4">
          {/* Toolbar: Search + Count + Sort */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tropical fish, rimless tanks, aquatic plants, filters..."
                className="w-full rounded-xl border border-sky-300/70 bg-[#F4FAFE] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#0A2540] placeholder-[#5A81A0]/75 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <Waves className="h-3.5 w-3.5 text-emerald-600" />
                <span>{filteredProducts.length} Specimens</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-sky-300/70 bg-[#F4FAFE] px-3 py-2 text-xs font-bold text-[#0A2540] outline-none focus:border-emerald-500 cursor-pointer [&>option]:bg-white [&>option]:text-[#0A2540]"
              >
                <option value="featured">Featured Specimens</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Rail */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-0.5 -mx-1 px-1">
            {aquaticCategoryPills.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0369A1] to-[#0284C7] text-white border border-sky-600 shadow-[0_4px_12px_rgba(3,105,161,0.22)] font-black'
                      : 'border border-sky-300/65 bg-[#F4FAFE] text-[#2C5270] hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {cat === 'All' ? 'All Aquatic Drops' : cat}
                </button>
              )
            })}
          </div>

          {/* Badge Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Filter className="h-3 w-3 text-emerald-600" />
              <span>Filter:</span>
            </span>
            {AQUARIUM_BADGE_FILTERS.map((badge) => {
              const isSelected = activeBadge === badge
              return (
                <button
                  key={badge}
                  type="button"
                  onClick={() => setActiveBadge(badge)}
                  className={`rounded-full px-2.5 py-0.5 font-bold transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border border-emerald-600 font-bold shadow-xs'
                      : 'bg-[#F4FAFE] text-[#2C5270] border border-sky-300/65 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {badge}
                </button>
              )
            })}
          </div>
        </div>

        {/* Specimen Product Cards Grid */}
        <div id="aquario-cards-grid" className="mt-7 sm:mt-8">
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isComingSoon={true}
                  isWishlisted={isWishlisted(product.id ?? product._id)}
                  onWishlistToggle={() => toggleWishlist(product.id ?? product._id)}
                  onAddToCart={() => {
                    addToCart(product, 1)
                    setIsCartOpen(true)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-sky-300/65 bg-white p-10 text-center space-y-3 shadow-xs">
              <Fish className="h-10 w-10 text-emerald-600 mx-auto opacity-90" />
              <h3 className="font-tagline text-xl font-bold text-[#0A2540]">
                No Aquatic Specimens Found
              </h3>
              <p className="text-xs text-[#2C5270] max-w-sm mx-auto">
                Try clearing your search terms or filter tags to discover more tropical wonders.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All')
                  setActiveBadge('All')
                  setSearchTerm('')
                }}
                className="rounded-full bg-[#0369A1] text-white px-5 py-2 text-xs font-bold hover:bg-[#0284C7] transition cursor-pointer shadow-xs"
              >
                Reset Aquatic Filters
              </button>
            </div>
          )}

          {filteredProducts.length > visibleCount && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="inline-flex items-center gap-2 rounded-full border border-sky-500/60 bg-gradient-to-r from-[#0369A1] to-[#059669] px-6 py-3 text-xs font-bold text-white hover:brightness-105 shadow-[0_6px_18px_rgba(3,105,161,0.22)] transition cursor-pointer"
              >
                <span>Load More Aquatic Specimens</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          BAND 4: HOW LIVE DISPATCH WORKS + AQUARIST CONCIERGE BANNER
         ===================================================================== */}
      <div className="section-shell mt-12 sm:mt-16 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-sky-300/65 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0F9FF] border border-sky-300/75 text-sky-600 shrink-0">
                <Video className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700">Step 01</span>
                <h4 className="font-tagline text-sm font-bold text-[#0A2540]">Live Video Selection</h4>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-[#2C5270] leading-relaxed">
              See your exact Discus, Betta, or drifted flora swimming live on WhatsApp video before packing begins.
            </p>
          </div>

          <div className="rounded-2xl border border-teal-400/55 bg-[#F2FBF9] p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 border border-teal-400/60 text-teal-700 shrink-0">
                <ThermometerSnowflake className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">Step 02</span>
                <h4 className="font-tagline text-sm font-bold text-[#0A2540]">Pure Oxygen &amp; Insulation</h4>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-[#2C5270] leading-relaxed">
              Double breather bags with pure medical-grade oxygen, heat/cooling packs, and reinforced low-iron glass crating.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/55 bg-[#F4FBF8] p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 border border-emerald-400/60 text-emerald-700 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Step 03</span>
                <h4 className="font-tagline text-sm font-bold text-[#0A2540]">Acclimation Guidance</h4>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-[#2C5270] leading-relaxed">
              Step-by-step drip acclimation guide &amp; live arrival coverage backed by our master aquarist desk.
            </p>
          </div>
        </div>

        {/* Direct WhatsApp & Email Aquarist Concierge Banner */}
        <div className="rounded-2xl sm:rounded-3xl border border-emerald-400/50 bg-gradient-to-r from-[#EFF8FF] via-[#FFFFFF] to-[#ECFDF5] p-5 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-[0_12px_30px_rgba(12,74,110,0.08)]">
          <div className="flex items-center gap-4 text-center md:text-left">
            <span className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-emerald-50 border border-emerald-400/60 text-emerald-700 shrink-0 shadow-xs">
              <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
            </span>
            <div>
              <h4 className="font-tagline text-base sm:text-lg font-bold text-[#0A2540]">
                Need Custom Aquascaping or Live Fish Video Selection?
              </h4>
              <p className="text-xs text-[#2C5270] mt-0.5">
                Connect directly with our master aquarist on WhatsApp or email{' '}
                <a
                  href={`mailto:${AQUATIC_CONTACT_EMAIL}`}
                  className="font-semibold text-emerald-700 underline decoration-emerald-500/55 underline-offset-2 hover:text-emerald-900 transition"
                >
                  {AQUATIC_CONTACT_EMAIL}
                </a>{' '}
                for live video acclimation proof and custom tank dimensions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href="https://wa.me/919341297124?text=Hi%20Acquario%20Tropicale%2C%20I%20want%20to%20inquire%20about%20Acquario%20Tropicale%20fish%20and%20aquariums!"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-700 px-5 py-3 text-xs font-bold shadow-[0_6px_16px_rgba(16,185,129,0.28)] transition shrink-0 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>WhatsApp Aquarist (+91 93412 97124)</span>
            </a>
            <a
              href={`mailto:${AQUATIC_CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-400/60 bg-white text-[#0A2540] hover:border-emerald-500 hover:text-emerald-700 px-5 py-3 text-xs font-bold shadow-xs transition shrink-0 cursor-pointer"
            >
              <Mail className="h-4 w-4 text-sky-600 shrink-0" />
              <span>{AQUATIC_CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

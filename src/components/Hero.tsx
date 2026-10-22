"use client"

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import {
  ArrowUpRight,
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
  Waves,
  ArrowRight,
} from 'lucide-react'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { useMarketplace } from '../context/MarketplaceContext'

type DropKey = 'featured' | 'botanical' | 'monogram'

interface ShowcaseCard {
  id: number
  title: string
  subtitle: string
  artisan: string
  price: string
  category: string
  image: string
  badge: string
  accentColor: string
  rating: string
}

const HERO_DROPS: Record<
  DropKey,
  {
    tabLabel: string
    craft: ShowcaseCard
    aquatic: ShowcaseCard
  }
> = {
  featured: {
    tabLabel: 'Signature Duo',
    craft: {
      id: 1,
      title: 'Evil Eye Mandala Pendant',
      subtitle: 'Hand-poured enamel in 24K gold bezel',
      artisan: 'Atelier NP Studio',
      price: '₹1,599',
      category: 'Handmade Jewelry',
      image: '/products/atelier-evil-eye-pendant.jpg',
      badge: '✦ Signature Talisman',
      accentColor: '#D4AF37',
      rating: '4.9',
    },
    aquatic: {
      id: 101,
      title: 'Royal Discus Nature Aquascape',
      subtitle: 'Low-iron rimless nature aquarium specimen',
      artisan: 'Captive-Bred Sanctuary',
      price: '₹2,999',
      category: 'Exotic Aquatics',
      image: '/products/royal-discus-aquarium.jpg',
      badge: 'Live Arrival Guarantee',
      accentColor: '#0D9488',
      rating: '5.0',
    },
  },
  botanical: {
    tabLabel: 'Botanical Sanctuary',
    craft: {
      id: 2,
      title: 'Pressed Botanical Resin Tray',
      subtitle: 'Real foraged wild meadow blooms in crystal resin',
      artisan: 'Clara & Fern Botanicals',
      price: '₹799',
      category: 'Botanical Decor',
      image: '/products/resin-art-tray.jpg',
      badge: '✦ 100% Hand-Foraged',
      accentColor: '#B8860B',
      rating: '4.95',
    },
    aquatic: {
      id: 102,
      title: 'Samurai Koi Halfmoon Betta',
      subtitle: 'Show-grade iridescent captive-bred betta',
      artisan: 'Aqua Botanica Lab',
      price: '₹899',
      category: 'Freshwater Show Fish',
      image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
      badge: 'Certified Show Grade',
      accentColor: '#0D9488',
      rating: '4.98',
    },
  },
  monogram: {
    tabLabel: 'Bespoke Keepsakes',
    craft: {
      id: 3,
      title: 'Ruby Initial Gold Flake Monogram',
      subtitle: 'Pure gold leaf dipping with crystal resin initials',
      artisan: 'Atelier NP Studio',
      price: '₹1,299',
      category: 'Custom Accessories',
      image: '/products/atelier-ruby-glitter-keychains.jpg',
      badge: '✦ 1-of-1 Bespoke',
      accentColor: '#D4AF37',
      rating: '5.0',
    },
    aquatic: {
      id: 103,
      title: 'Bonded Clownfish Marine Pair',
      subtitle: 'Captive-bred reef safe saltwater specimens',
      artisan: 'Ocean Reef Collective',
      price: '₹3,499',
      category: 'Marine & Saltwater',
      image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
      badge: 'Reef Safe Pair',
      accentColor: '#0284C7',
      rating: '4.9',
    },
  },
}

const VALUE_PERKS = [
  {
    icon: HeartHandshake,
    title: 'Direct Maker Studios',
    desc: 'Zero middlemen markup',
    highlight: '100% fair artisan value',
  },
  {
    icon: ShieldCheck,
    title: 'Live Arrival Guarantee',
    desc: 'Oxygenated thermal packs',
    highlight: 'Full transit protection',
  },
  {
    icon: Sparkles,
    title: 'Direct Artisan Marketplace',
    desc: 'Handmade by skilled makers',
    highlight: 'Zero mass production',
  },
  {
    icon: PackageCheck,
    title: 'Plastic-Free Luxury Packaging',
    desc: 'Honeycomb paper & wax seal',
    highlight: 'Eco biodegradable wrap',
  },
]

export default function Hero() {
  const { ref, isVisible } = useRevealOnScroll()
  const { cart, addToCart, setCartQuantity, removeFromCart, setIsCartOpen, setActiveDepartment } = useMarketplace()
  const [activeTab, setActiveTab] = useState<DropKey>('featured')

  const heroContainerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const currentDrop = HERO_DROPS[activeTab]

  const craftInCart = cart?.find(
    (item: any) =>
      (String(item.cartItemId) === String(currentDrop.craft.id) ||
        String(item.productId) === String(currentDrop.craft.id)) &&
      !item.customization
  )
  const craftQty = craftInCart ? craftInCart.quantity : 0

  const aquaticInCart = cart?.find(
    (item: any) =>
      (String(item.cartItemId) === String(currentDrop.aquatic.id) ||
        String(item.productId) === String(currentDrop.aquatic.id)) &&
      !item.customization
  )
  const aquaticQty = aquaticInCart ? aquaticInCart.quantity : 0

  // GSAP Snappy Luxury Entrance Animation on Mount
  useEffect(() => {
    if (!heroContainerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.fromTo(
        ['.gsap-hero-header', '.gsap-hero-title', '.gsap-hero-text'],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.05, clearProps: 'all' }
      )
        .fromTo(
          ['.gsap-hero-cta', '.gsap-hero-trust'],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.04, clearProps: 'all' },
          '-=0.25'
        )
        .fromTo(
          '.gsap-hero-card',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.42, stagger: 0.06, clearProps: 'all' },
          '-=0.32'
        )
        .fromTo(
          '.gsap-hero-perk',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, clearProps: 'all' },
          '-=0.28'
        )
    }, heroContainerRef)

    return () => ctx.revert()
  }, [])

  // GSAP Smooth Tab Change Animation
  useEffect(() => {
    if (!stageRef.current) return
    const cards = stageRef.current.querySelectorAll('.gsap-hero-card')
    gsap.fromTo(
      cards,
      { opacity: 0.4, scale: 0.96, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
    )
  }, [activeTab])

  const mouseRafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (mouseRafRef.current) {
        cancelAnimationFrame(mouseRafRef.current)
      }
    }
  }, [])

  // GSAP Interactive 3D Parallax on Stage - Throttled with RAF for 60/120fps smoothness
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current || typeof window === 'undefined' || window.innerWidth < 1024) return
    const clientX = e.clientX
    const clientY = e.clientY

    if (mouseRafRef.current) return

    mouseRafRef.current = requestAnimationFrame(() => {
      mouseRafRef.current = null
      if (!stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      const xRatio = (clientX - rect.left) / rect.width - 0.5
      const yRatio = (clientY - rect.top) / rect.height - 0.5

      gsap.to('.gsap-hero-card', {
        x: xRatio * 8,
        y: yRatio * 8,
        rotateY: xRatio * 4,
        rotateX: -yRatio * 4,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto',
      })
    })
  }

  const handleMouseLeave = () => {
    if (mouseRafRef.current) {
      cancelAnimationFrame(mouseRafRef.current)
      mouseRafRef.current = null
    }
    gsap.to('.gsap-hero-card', {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const handleQuickAdd = (item: ShowcaseCard) => {
    addToCart(
      {
        id: item.id,
        title: item.title,
        price: item.price,
        category: item.category,
        image: item.image,
        badges: [item.badge.replace(/^[^a-zA-Z0-9]+/, '').trim()],
        description: item.subtitle,
        rating: Number(item.rating) || 5.0,
      },
      1
    )
    setIsCartOpen(true)
  }

  const handleDepartmentJump = (dept: 'all' | 'crafts' | 'aquarium') => {
    if (setActiveDepartment) {
      setActiveDepartment(dept)
    }
    const collectionEl = document.getElementById('collection')
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" ref={ref} className={`section-shell pt-4 sm:pt-8 ${isVisible ? 'is-visible' : ''}`}>
      {/* Grand Architectural Canvas */}
      <div
        ref={heroContainerRef}
        className="reveal is-visible relative overflow-hidden rounded-[2.5rem] border border-[#D4AF37]/35 bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F8F3E6] p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(184,134,11,0.08),0_0_1px_1px_rgba(212,175,55,0.25)]"
      >
        {/* Soft Ambient Radiance Highlights */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#FAF0D4]/60 blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#F5E6BF]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-[#CCFBF1]/30 blur-3xl pointer-events-none" />

        {/* Top Architectural Header Bar */}
        <div className="gsap-hero-header relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DEC7]/80 pb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" />
              Haute Artisan Craft & Living Waters
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-white/95 px-3 py-1 text-xs font-bold text-[#4D3605] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" />
              Direct Artisan Collective
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-white/90 px-3.5 py-1 text-xs font-semibold text-[#5C4106]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Spring Drops Shipping Nationwide</span>
          </div>
        </div>

        {/* Main Content Grid: Left Editorial + Right Dual Showcase Stage */}
        <div className="relative z-10 mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1.15fr] lg:gap-12">
          {/* Left Editorial Column */}
          <div className="max-w-xl">
            <h1 className="gsap-hero-title font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight text-[#141414] leading-[1.08]">
              Where Fine Art <br />
              <span className="italic font-normal text-gold-gradient font-serif">
                Meets Living Waters.
              </span>
            </h1>

            <p className="gsap-hero-text body-lead mt-5 sm:text-lg text-[#4A4339] leading-relaxed">
              Discover genuine artisan handmade jewelry, wild botanical resin decor, and clean soy candles alongside exotic captive-bred fish, lush planted aquascapes, and rimless nature aquariums.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={() => handleDepartmentJump('crafts')}
                className="gsap-hero-cta btn-primary py-4 px-7 text-sm font-semibold tracking-wide shadow-md group cursor-pointer text-center justify-center"
              >
                <span>Explore Artisan Drops</span>
                <ArrowUpRight className="h-4 w-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDepartmentJump('aquarium')}
                className="gsap-hero-cta inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm font-bold tracking-wide cursor-pointer border border-teal-600/40 bg-gradient-to-r from-[#F0FDFA] to-[#CCFBF1] text-[#0F766E] shadow-sm transition hover:border-teal-600 hover:shadow-md hover:-translate-y-0.5"
              >
                <Waves className="h-4 w-4 text-[#0F766E]" />
                <span>Exotic Fish & Aquatics</span>
              </button>
            </div>

            {/* Guarantee Strip */}
            <div className="gsap-hero-trust mt-10 flex flex-wrap items-center gap-6 border-t border-[#E8DEC7] pt-6">
              <div className="text-xs font-semibold text-[#4A4339]">
                <p className="font-bold text-[#141414] flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5 text-[#7A5408]" /> 100% Eco Packaging
                </p>
                <p className="text-[#635B4F] text-[11px]">Biodegradable boxes & honeycomb wrap</p>
              </div>

              <div className="hidden h-8 w-px bg-[#E2D2B0] sm:block" />

              <div className="text-xs font-semibold text-[#4A4339]">
                <p className="font-bold text-[#141414] flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#B8860B]" /> Live Transit & Arrival Guarantee
                </p>
                <p className="text-[#635B4F] text-[11px]">Oxygenated packs & express fragile couriers</p>
              </div>
            </div>
          </div>

          {/* Right Dual-World Showcase Bento Stage with GSAP Parallax */}
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            {/* Interactive Drop Selector Pills */}
            <div className="mb-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full rounded-full border border-[#D4AF37]/45 bg-white/95 p-1 shadow-xs">
                {(Object.keys(HERO_DROPS) as DropKey[]).map((key) => {
                  const isActive = activeTab === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTab(key)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition duration-150 cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-[#141414] text-[#ECC872] shadow-xs'
                          : 'text-[#615748] hover:text-[#141414] hover:bg-[#FAF4E2]'
                      }`}
                    >
                      {HERO_DROPS[key].tabLabel}
                    </button>
                  )
                })}
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#7A5408]">
                <span>Tap to switch showcase</span>
              </span>
            </div>

            {/* Dual Stage Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              {/* Card 1: Artisan Craft Showcase */}
              <article className="gsap-hero-card group relative overflow-hidden rounded-[2rem] border border-[#D4AF37]/50 bg-gradient-to-b from-white via-[#FCF9EE] to-[#FAF2DB] p-3.5 shadow-[0_12px_32px_rgba(184,134,11,0.12)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_16px_40px_rgba(184,134,11,0.20)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-[#F7F2E6] border border-[#E8DEC7]">
                  <img
                    src={currentDrop.craft.image}
                    alt={currentDrop.craft.title}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = fallbackCraftImage
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Top Floating Badge */}
                  <div className="absolute left-2.5 top-2.5">
                    <span className="inline-flex items-center rounded-full border border-[#D4AF37]/60 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#5C4106] shadow-xs">
                      {currentDrop.craft.badge}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-xl bg-white/95 border border-[#D4AF37]/50 px-3 py-1.5 shadow-sm">
                    <span className="text-[11px] font-bold text-[#141414] truncate max-w-[130px]">
                      {currentDrop.craft.title}
                    </span>
                    <span className="font-extrabold text-[#946B08] text-xs">
                      {currentDrop.craft.price}
                    </span>
                  </div>
                </div>

                {/* Card Sub-Info & Action */}
                <div className="mt-3 px-1 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5408] block">
                      {currentDrop.craft.category}
                    </span>
                    <p className="text-xs text-[#524B40] font-medium">{currentDrop.craft.artisan}</p>
                  </div>

                  {craftQty > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-[#141414] border border-[#D4AF37]/70 p-1 shadow-xs"
                    >
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => {
                          if (craftQty <= 1) removeFromCart(currentDrop.craft.id)
                          else setCartQuantity(currentDrop.craft.id, craftQty - 1)
                        }}
                        className="grid h-6 w-6 place-items-center rounded-full bg-[#251E14] text-[#ECC872] hover:bg-[#382D1C] hover:text-white transition active:scale-90 cursor-pointer"
                      >
                        <Minus className="h-3 w-3 stroke-[2.8]" />
                      </button>
                      <span className="px-1 text-xs font-black text-[#FCE6A8] min-w-5 text-center font-mono">
                        {craftQty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setCartQuantity(currentDrop.craft.id, craftQty + 1)}
                        className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] text-[#141008] hover:brightness-110 transition active:scale-90 cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3 w-3 stroke-[2.8]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(currentDrop.craft)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] border border-[#D4AF37]/60 px-3.5 py-1.5 text-xs font-bold text-[#ECC872] shadow-xs transition hover:bg-[#251D0B] active:scale-95 cursor-pointer"
                      title={`Add ${currentDrop.craft.title} to bag`}
                    >
                      <ShoppingBag className="h-3 w-3" />
                      <span>Bag</span>
                    </button>
                  )}
                </div>
              </article>

              {/* Card 2: Exotic Aquatics Showcase */}
              <article className="gsap-hero-card group relative overflow-hidden rounded-[2rem] border border-teal-500/40 bg-gradient-to-b from-white via-[#F0FDFA] to-[#E6FFFA] p-3.5 shadow-[0_12px_32px_rgba(15,118,110,0.10)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-teal-500 hover:shadow-[0_16px_40px_rgba(15,118,110,0.18)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-[#F0FDFA] border border-teal-600/20">
                  <img
                    src={currentDrop.aquatic.image}
                    alt={currentDrop.aquatic.title}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = fallbackCraftImage
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Top Floating Badge */}
                  <div className="absolute left-2.5 top-2.5">
                    <span className="inline-flex items-center rounded-full border border-teal-600/40 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0F766E] shadow-xs">
                      {currentDrop.aquatic.badge}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-xl bg-white/95 border border-teal-600/40 px-3 py-1.5 shadow-sm">
                    <span className="text-[11px] font-bold text-[#141414] truncate max-w-[130px]">
                      {currentDrop.aquatic.title}
                    </span>
                    <span className="font-extrabold text-[#0F766E] text-xs">
                      {currentDrop.aquatic.price}
                    </span>
                  </div>
                </div>

                {/* Card Sub-Info & Action */}
                <div className="mt-3 px-1 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] block">
                      {currentDrop.aquatic.category}
                    </span>
                    <p className="text-xs text-[#524B40] font-medium">{currentDrop.aquatic.artisan}</p>
                  </div>

                  {aquaticQty > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-[#141414] border border-teal-500/70 p-1 shadow-xs"
                    >
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => {
                          if (aquaticQty <= 1) removeFromCart(currentDrop.aquatic.id)
                          else setCartQuantity(currentDrop.aquatic.id, aquaticQty - 1)
                        }}
                        className="grid h-6 w-6 place-items-center rounded-full bg-teal-950 text-teal-300 hover:bg-teal-900 transition active:scale-90 cursor-pointer"
                      >
                        <Minus className="h-3 w-3 stroke-[2.8]" />
                      </button>
                      <span className="px-1 text-xs font-black text-teal-200 min-w-5 text-center font-mono">
                        {aquaticQty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setCartQuantity(currentDrop.aquatic.id, aquaticQty + 1)}
                        className="grid h-6 w-6 place-items-center rounded-full bg-teal-500 text-teal-950 hover:brightness-110 transition active:scale-90 cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3 w-3 stroke-[2.8]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(currentDrop.aquatic)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] border border-teal-500/50 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#1E293B] active:scale-95 cursor-pointer"
                      title={`Add ${currentDrop.aquatic.title} to bag`}
                    >
                      <ShoppingBag className="h-3 w-3 text-teal-400" />
                      <span>Bag</span>
                    </button>
                  )}
                </div>
              </article>
            </div>

            {/* Bottom Quick Feature Strip */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#D4AF37]/35 bg-white/80 px-4 py-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4D3605]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FAF0D4] text-[#B8860B] text-[10px] font-black">
                  ✦
                </span>
                <span>Both artisan crafts & live aquatics ship in specialized protective packaging</span>
              </div>
              <a
                href="#collection"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7A5408] hover:text-[#4A3405] transition"
              >
                <span>View All 60+ Drops</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Value Perks 4-Column Grid with GSAP Stagger */}
        <div className="mt-12 grid grid-cols-2 gap-3.5 border-t border-[#E8DCC2] pt-8 lg:grid-cols-4">
          {VALUE_PERKS.map((perk, i) => (
            <div
              key={i}
              className="gsap-hero-perk flex items-start gap-3 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-b from-white via-[#FCF9EE] to-[#FAF4E2] p-4 shadow-xs transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-[0_8px_22px_rgba(184,134,11,0.12)]"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#FAF4E2] to-[#F5E8C4] border border-[#D4AF37]/40 text-[#8F650D] shadow-xs">
                <perk.icon className="h-5 w-5 text-[#8F650D]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#141414] truncate">{perk.title}</p>
                <p className="text-[11px] text-[#6E6860] mt-0.5">{perk.desc}</p>
                <span className="mt-1.5 inline-block rounded-full bg-white/90 border border-[#D4AF37]/35 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#735206]">
                  {perk.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

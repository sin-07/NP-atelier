"use client"

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
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
import useReducedMotion from '../hooks/useReducedMotion'
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
    shortLabel: string
    craft: ShowcaseCard
    craft2: ShowcaseCard
  }
> = {
  featured: {
    tabLabel: 'Signature Duos',
    shortLabel: 'Signature',
    craft: {
      id: 4,
      title: 'Celestial Evil Eye Mandala Pendant',
      subtitle: 'Hand-poured enamel in 24K gold bezel',
      artisan: 'Atelier NP Studio',
      price: '₹599',
      category: 'Handmade Jewelry',
      image: '/products/atelier-evil-eye-pendant.jpg',
      badge: '✦ Signature Talisman',
      accentColor: '#D4AF37',
      rating: '4.9',
    },
    craft2: {
      id: 10,
      title: 'Ocean Wave Resin Art Serving Tray',
      subtitle: 'Layered crystal ocean epoxy resin on mango wood',
      artisan: 'NP Resin Art Studio',
      price: '₹1,199',
      category: 'DIY Home Decor & Crafts',
      image: '/products/resin-art-tray.jpg',
      badge: '✦ Statement Piece',
      accentColor: '#B8860B',
      rating: '5.0',
    },
  },
  botanical: {
    tabLabel: 'Botanical & Flora',
    shortLabel: 'Botanical',
    craft: {
      id: 5,
      title: 'Pressed Flower Resin Teardrop Earrings',
      subtitle: 'Real foraged wild meadow blooms in crystal resin',
      artisan: 'Flora Atelier Studio',
      price: '₹649',
      category: 'Handmade Jewelry',
      image: '/products/resin-earrings.jpg',
      badge: '✦ 100% Hand-Foraged',
      accentColor: '#B8860B',
      rating: '4.95',
    },
    craft2: {
      id: 1,
      title: 'Atelier NP Sea Life DIY Paint Kit',
      subtitle: 'Handcrafted plaster marine figurines & acrylics',
      artisan: 'Atelier NP Craft Labs',
      price: '₹449',
      category: 'Beauty DIY Products',
      image: '/products/atelier-diy-paint-kit-sea.jpg',
      badge: '✦ Best Seller DIY Kit',
      accentColor: '#D4AF37',
      rating: '4.98',
    },
  },
  monogram: {
    tabLabel: 'Bespoke Keepsakes',
    shortLabel: 'Bespoke',
    craft: {
      id: 3,
      title: 'Ruby Dip Resin Alphabet Keychains',
      subtitle: 'Pure gold leaf dipping with crystal resin initials',
      artisan: 'Atelier NP Studio',
      price: '₹299',
      category: 'Cute Handmade Accessories',
      image: '/products/atelier-ruby-glitter-keychains.jpg',
      badge: '✦ 1-of-1 Bespoke',
      accentColor: '#D4AF37',
      rating: '5.0',
    },
    craft2: {
      id: 2,
      title: 'Atelier NP Explorer DIY Paint Kit',
      subtitle: 'Hand-cast steam train & coastal lighthouse figurines',
      artisan: 'Atelier NP Craft Labs',
      price: '₹449',
      category: 'DIY Home Decor & Crafts',
      image: '/products/atelier-diy-paint-kit-explorer.jpg',
      badge: '✦ Artisan Favorite',
      accentColor: '#B8860B',
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
    icon: Sparkles,
    title: 'Authentic Handcrafted Art',
    desc: 'Handmade by skilled makers',
    highlight: 'Zero mass production',
  },
  {
    icon: ShieldCheck,
    title: 'Pan-India Fragile Courier',
    desc: 'Shockproof bubble & box',
    highlight: 'Safe transit guarantee',
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
  const reduced = useReducedMotion()
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

  const craft2InCart = cart?.find(
    (item: any) =>
      (String(item.cartItemId) === String(currentDrop.craft2.id) ||
        String(item.productId) === String(currentDrop.craft2.id)) &&
      !item.customization
  )
  const craft2Qty = craft2InCart ? craft2InCart.quantity : 0

  // GSAP Snappy Luxury Entrance Animation on Mount
  useEffect(() => {
    if (reduced) return
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
  }, [reduced])

  // Preload Hero drop images so switching is instant and 0-latency
  useEffect(() => {
    const imagesToPreload = [
      HERO_DROPS.featured.craft.image,
      HERO_DROPS.featured.craft2.image,
      HERO_DROPS.botanical.craft.image,
      HERO_DROPS.botanical.craft2.image,
      HERO_DROPS.monogram.craft.image,
      HERO_DROPS.monogram.craft2.image,
    ]
    imagesToPreload.forEach((src) => {
      if (typeof window !== 'undefined' && src) {
        const img = new Image()
        img.src = src
      }
    })
  }, [])

  // Silky Smooth Tab Change Animation (skips initial mount)
  const isHeroTabInitial = useRef(true)
  useEffect(() => {
    if (isHeroTabInitial.current) {
      isHeroTabInitial.current = false
      return
    }
    if (!stageRef.current) return
    const cards = stageRef.current.querySelectorAll('.gsap-hero-card')
    gsap.killTweensOf(cards)
    gsap.fromTo(
      cards,
      { opacity: 0.75, scale: 0.99 },
      { opacity: 1, scale: 1, duration: 0.22, stagger: 0.03, ease: 'power2.out', clearProps: 'opacity,scale' }
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
    if (reduced || !stageRef.current || typeof window === 'undefined' || window.innerWidth < 1024) return
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
        className="reveal is-visible relative overflow-hidden rounded-[2.5rem] border border-[#6D5738]/35 bg-gradient-to-br from-[#151412] via-[#121110] to-[#0B0B0A] p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_1px_1px_rgba(109,87,56,0.25)]"
      >
        {/* Soft Ambient Radiance Highlights */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#D4AF78]/5 blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#6D5738]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-[#14B8A6]/5 blur-3xl pointer-events-none" />

        {/* Top Architectural Header Bar */}
        <div className="gsap-hero-header relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#6D5738]/30 pb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF78]" />
              Haute Artisan Craft & Couture Atelier
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5738]/40 bg-[#1C1A17] px-3 py-1 text-xs font-bold text-[#D4AF78] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF78]" />
              Direct Artisan Collective
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#6D5738]/35 bg-[#1C1A17] px-3.5 py-1 text-xs font-semibold text-[#F5EBDD]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Artisan Drops Shipping Nationwide</span>
          </div>
        </div>

        {/* Main Content Grid: Left Editorial + Right Dual Showcase Stage */}
        <div className="relative z-10 mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1.15fr] lg:gap-12">
          {/* Left Editorial Column */}
          <div className="max-w-xl">
            <h1 className="gsap-hero-title font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight text-[#F5EBDD] leading-[1.08]">
              Where Fine Art <br />
              <span className="italic font-normal text-gold-gradient font-serif">
                Meets Master Craft.
              </span>
            </h1>

            <p className="gsap-hero-text body-lead mt-5 sm:text-lg text-[#B8A68B] leading-relaxed">
              Discover genuine artisan handmade jewelry, wild botanical resin art, personalized monogram keepsakes, and creative DIY craft kits handcrafted with love by verified independent makers.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={() => handleDepartmentJump('crafts')}
                className="gsap-hero-cta btn-primary py-4 px-7 text-sm font-bold tracking-wide shadow-md group cursor-pointer text-center justify-center"
              >
                <span>Explore Artisan Drops</span>
                <ArrowUpRight className="h-4 w-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const makersEl = document.getElementById('makers')
                  if (makersEl) {
                    makersEl.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="gsap-hero-cta inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-sm font-bold tracking-wide cursor-pointer border border-[#6D5738]/45 bg-[#151412] text-[#F5EBDD] shadow-sm transition hover:border-[#D4AF78] hover:text-[#E5C18A] hover:-translate-y-0.5"
              >
                <span>Meet Atelier Makers</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Guarantee Strip */}
            <div className="gsap-hero-trust mt-10 flex flex-wrap items-center gap-6 border-t border-[#6D5738]/30 pt-6">
              <div className="text-xs font-semibold text-[#B8A68B]">
                <p className="font-bold text-[#F5EBDD] flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5 text-[#D4AF78]" /> 100% Eco Packaging
                </p>
                <p className="text-[#B8A68B]/80 text-[11px]">Biodegradable boxes & honeycomb wrap</p>
              </div>

              <div className="hidden h-8 w-px bg-[#6D5738]/30 sm:block" />

              <div className="text-xs font-semibold text-[#B8A68B]">
                <p className="font-bold text-[#F5EBDD] flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF78]" /> Fragile Transit Protection
                </p>
                <p className="text-[#B8A68B]/80 text-[11px]">Shockproof layers & express tracking nationwide</p>
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
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center justify-between gap-2 mb-2 px-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#D4AF78] flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#D4AF78]" />
                  <span>Curated Drop Collections</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#B8A68B] hidden xs:inline-flex items-center gap-1">
                  <span>Tap to switch showcase</span>
                  <span className="text-[#D4AF78]">✦</span>
                </span>
              </div>

              {/* Seamless Full-Width 3-Tab Segmented Switcher with Smooth Sliding Pill */}
              <div className="grid grid-cols-3 gap-1 rounded-2xl sm:rounded-full border border-[#6D5738]/40 bg-[#151412] p-1 shadow-xs relative">
                {(Object.keys(HERO_DROPS) as DropKey[]).map((key) => {
                  const isActive = activeTab === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTab(key)}
                      className={`relative rounded-xl sm:rounded-full py-1.5 sm:py-2 px-1 sm:px-3 text-center text-[11px] sm:text-xs font-bold transition-colors duration-200 cursor-pointer truncate ${
                        isActive
                          ? 'text-[#0B0B0A]'
                          : 'text-[#B8A68B] hover:text-[#F5EBDD]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="heroDropTabPill"
                          className="absolute inset-0 rounded-xl sm:rounded-full bg-[#D4AF78] shadow-xs"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10 hidden sm:inline">{HERO_DROPS[key].tabLabel}</span>
                      <span className="relative z-10 sm:hidden">{HERO_DROPS[key].shortLabel}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dual Stage Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              {/* Card 1: Artisan Craft Showcase */}
              <article className="gsap-hero-card group relative overflow-hidden rounded-[2rem] border border-[#6D5738]/40 bg-gradient-to-b from-[#181714] via-[#141311] to-[#0E0D0C] p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#D4AF78]/70 hover:shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-[#121110] border border-[#6D5738]/30">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                  {/* Top Floating Badge */}
                  <div className="absolute left-2.5 top-2.5">
                    <span className="inline-flex items-center rounded-full border border-[#6D5738]/50 bg-[#0B0B0A]/90 px-2.5 py-1 text-[10px] font-bold text-[#D4AF78] shadow-xs">
                      {currentDrop.craft.badge}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-xl bg-[#151412]/95 border border-[#6D5738]/45 px-3 py-1.5 shadow-sm">
                    <span className="text-[11px] font-bold text-[#F5EBDD] truncate max-w-[130px]">
                      {currentDrop.craft.title}
                    </span>
                    <span className="font-extrabold text-[#D4AF78] text-xs">
                      {currentDrop.craft.price}
                    </span>
                  </div>
                </div>

                {/* Card Sub-Info & Action */}
                <div className="mt-3 px-1 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF78] block">
                      {currentDrop.craft.category}
                    </span>
                    <p className="text-xs text-[#B8A68B] font-medium">{currentDrop.craft.artisan}</p>
                  </div>

                  {craftQty > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-[#151412] border border-[#D4AF78] p-1 shadow-xs"
                    >
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => {
                          if (craftQty <= 1) removeFromCart(currentDrop.craft.id)
                          else setCartQuantity(currentDrop.craft.id, craftQty - 1)
                        }}
                        className="grid h-6 w-6 place-items-center rounded-full bg-[#24211C] text-[#D4AF78] hover:bg-[#2F2B24] transition active:scale-90 cursor-pointer"
                      >
                        <Minus className="h-3 w-3 stroke-[2.8]" />
                      </button>
                      <span className="px-1 text-xs font-black text-[#F5EBDD] min-w-5 text-center font-mono">
                        {craftQty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setCartQuantity(currentDrop.craft.id, craftQty + 1)}
                        className="grid h-6 w-6 place-items-center rounded-full bg-[#D4AF78] text-[#0B0B0A] hover:bg-[#E5C18A] transition active:scale-90 cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3 w-3 stroke-[2.8]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(currentDrop.craft)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF78] border border-[#E5C18A]/50 px-3.5 py-1.5 text-xs font-bold text-[#0B0B0A] shadow-xs transition hover:bg-[#E5C18A] active:scale-95 cursor-pointer"
                      title={`Add ${currentDrop.craft.title} to bag`}
                    >
                      <ShoppingBag className="h-3 w-3" />
                      <span>Bag</span>
                    </button>
                  )}
                </div>
              </article>

              {/* Card 2: Artisanal Decor & Keepsake Showcase */}
              <article className="gsap-hero-card group relative overflow-hidden rounded-[2rem] border border-[#6D5738]/40 bg-gradient-to-b from-[#181714] via-[#141311] to-[#0E0D0C] p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#D4AF78]/70 hover:shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-[#121110] border border-[#6D5738]/30">
                  <img
                    src={currentDrop.craft2.image}
                    alt={currentDrop.craft2.title}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = fallbackCraftImage
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                  {/* Top Floating Badge */}
                  <div className="absolute left-2.5 top-2.5">
                    <span className="inline-flex items-center rounded-full border border-[#6D5738]/50 bg-[#0B0B0A]/90 px-2.5 py-1 text-[10px] font-bold text-[#D4AF78] shadow-xs">
                      {currentDrop.craft2.badge}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-xl bg-[#151412]/95 border border-[#6D5738]/45 px-3 py-1.5 shadow-sm">
                    <span className="text-[11px] font-bold text-[#F5EBDD] truncate max-w-[130px]">
                      {currentDrop.craft2.title}
                    </span>
                    <span className="font-extrabold text-[#D4AF78] text-xs">
                      {currentDrop.craft2.price}
                    </span>
                  </div>
                </div>

                {/* Card Sub-Info & Action */}
                <div className="mt-3 px-1 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF78] block">
                      {currentDrop.craft2.category}
                    </span>
                    <p className="text-xs text-[#B8A68B] font-medium">{currentDrop.craft2.artisan}</p>
                  </div>

                  {craft2Qty > 0 ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-[#151412] border border-[#D4AF78] p-1 shadow-xs"
                    >
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => {
                          if (craft2Qty <= 1) removeFromCart(currentDrop.craft2.id)
                          else setCartQuantity(currentDrop.craft2.id, craft2Qty - 1)
                        }}
                        className="grid h-6 w-6 place-items-center rounded-full bg-[#24211C] text-[#D4AF78] hover:bg-[#2F2B24] transition active:scale-90 cursor-pointer"
                      >
                        <Minus className="h-3 w-3 stroke-[2.8]" />
                      </button>
                      <span className="px-1 text-xs font-black text-[#F5EBDD] min-w-5 text-center font-mono">
                        {craft2Qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setCartQuantity(currentDrop.craft2.id, craft2Qty + 1)}
                        className="grid h-6 w-6 place-items-center rounded-full bg-[#D4AF78] text-[#0B0B0A] hover:bg-[#E5C18A] transition active:scale-90 cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3 w-3 stroke-[2.8]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(currentDrop.craft2)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF78] border border-[#E5C18A]/50 px-3.5 py-1.5 text-xs font-bold text-[#0B0B0A] shadow-xs transition hover:bg-[#E5C18A] active:scale-95 cursor-pointer"
                      title={`Add ${currentDrop.craft2.title} to bag`}
                    >
                      <ShoppingBag className="h-3 w-3" />
                      <span>Bag</span>
                    </button>
                  )}
                </div>
              </article>
            </div>

            {/* Bottom Quick Feature Strip */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[rgba(212,175,120,0.3)] bg-[#151412]/95 px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F5EBDD]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#242019] border border-[#D4AF78]/35 text-[#D4AF78] text-[10px] font-black shrink-0">
                  ✦
                </span>
                <span className="leading-tight">All bespoke crafts ship in honeycomb protective packaging with wax seal presentation</span>
              </div>
              <a
                href="#collection"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4AF78] hover:text-[#E5C18A] transition-colors shrink-0"
              >
                <span>View All 40+ Crafts</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Value Perks 4-Column Grid with GSAP Stagger */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 border-t border-[rgba(212,175,120,0.25)] pt-8">
          {VALUE_PERKS.map((perk, i) => (
            <div
              key={i}
              className="gsap-hero-perk group h-full flex flex-col justify-between rounded-2xl border border-[rgba(212,175,120,0.25)] bg-gradient-to-b from-[#191714] via-[#141311] to-[#0E0D0C] p-4 sm:p-4.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-[#D4AF78] hover:shadow-[0_12px_32px_rgba(212,175,120,0.18)]"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0B0B0A] border border-[rgba(212,175,120,0.35)] text-[#D4AF78] shadow-xs group-hover:scale-105 group-hover:border-[#D4AF78] transition-all duration-300">
                  <perk.icon className="h-5 w-5 text-[#D4AF78]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-[#F5EBDD] leading-snug group-hover:text-[#E5C18A] transition-colors break-words">
                    {perk.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#B8AA96] mt-1 leading-relaxed break-words">
                    {perk.desc}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[rgba(212,175,120,0.15)] flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF78]/10 border border-[#D4AF78]/30 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF78] shadow-2xs whitespace-normal break-words">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF78] inline-block shrink-0" />
                  <span>{perk.highlight}</span>
                </span>
                <span className="text-[10px] font-bold text-[#B8AA96]/60 group-hover:text-[#D4AF78] transition-colors shrink-0">
                  0{i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

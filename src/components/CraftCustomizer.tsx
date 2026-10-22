"use client"

import { useState, useMemo } from 'react'
import {
  Check,
  Palette,
  Sparkles,
  ShoppingBag,
  FilePenLine,
  Gift,
  Flame,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'

const BASE_CRAFTS = [
  {
    id: 'custom-resin',
    title: 'Pressed Botanical Resin Tray',
    category: 'DIY Home Decor & Crafts',
    basePrice: 799,
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    description: 'High-gloss crystalline resin embedding dried botanicals with scalloped edges.',
  },
  {
    id: 'custom-bangles',
    title: 'Artisan Silk Thread Bangles Set',
    category: 'Handmade Jewelry',
    basePrice: 599,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-wrapped raw silk thread bangles embellished with delicate zari and pearl beadwork.',
  },
  {
    id: 'custom-candle',
    title: 'Botanical Hand-Poured Soy Candle',
    category: 'Beauty DIY Products',
    basePrice: 549,
    image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
    description: 'Pure soy wax blended with essential botanical oils and topped with dried floral petals.',
  },
  {
    id: 'custom-keychain',
    title: 'Ruby Gold Glitter Initial Keychain',
    category: 'Cute Handmade Accessories',
    basePrice: 299,
    image: '/products/atelier-ruby-glitter-keychains.jpg',
    description: 'Custom poured crystal resin monogram letter dipped with chunky 24k gold leaf flakes and gold swivel clip.',
  },
  {
    id: 'custom-pendant',
    title: 'Celestial Evil Eye Mandala Pendant',
    category: 'Handmade Jewelry',
    basePrice: 599,
    image: '/products/atelier-evil-eye-pendant.jpg',
    description: 'Handcrafted cobalt blue mandala evil eye talisman pendant set in high-polish gold bezel on cable chain.',
  },
]

const PALETTES = [
  {
    id: 'classic-gallery',
    name: 'Alabaster & Charcoal',
    tones: ['#141414', '#EFECE6', '#DDD7CE'],
    description: 'Timeless museum contrast with soft gallery bone tones',
  },
  {
    id: 'royal-gold',
    name: 'Royal Amber Gold',
    tones: ['#B8860B', '#F5E6C7', '#73562A'],
    description: 'Warm antique gold leaf, champagne shimmer, and bronze',
  },
  {
    id: 'terracotta-stone',
    name: 'Warm Earth & Terracotta',
    tones: ['#C86A4B', '#EFE2D3', '#8C4830'],
    description: 'Natural clay earthenware and sun-baked pigments',
  },
  {
    id: 'botanical-sage',
    name: 'Botanical Linen & Sage',
    tones: ['#6B7A68', '#EAEFE9', '#414E3F'],
    description: 'Earthy dried botanical leaves and soft linen textures',
  },
]

const ADDONS = [
  {
    id: 'gold-foil',
    name: '24K Gold Flake Inlay',
    price: 149,
    icon: Sparkles,
    description: 'Genuine glimmering metal foils cast permanently into craft',
  },
  {
    id: 'monogram',
    name: 'Bespoke Monogram Inscription',
    price: 199,
    icon: FilePenLine,
    description: 'Initials, anniversary date, or personal quote engraving',
  },
  {
    id: 'gift-pack',
    name: 'Luxury Velvet Ribbon Gift Wrap',
    price: 129,
    icon: Gift,
    description: 'Artisan box, wax-sealed card, and dried botanicals sprig',
  },
  {
    id: 'scent',
    name: 'Pure Botanical Aroma Infusion',
    price: 99,
    icon: Flame,
    description: 'Warm lavender, sandalwood, or jasmine essential oils',
  },
]

export default function CraftCustomizer() {
  const { addToCart, setIsCartOpen } = useMarketplace()

  const [selectedCraft, setSelectedCraft] = useState(BASE_CRAFTS[0])
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0])
  const [customText, setCustomText] = useState('')
  const [selectedAddons, setSelectedAddons] = useState(['gold-foil'])

  const toggleAddon = (addonId) => {
    setSelectedAddons((current) =>
      current.includes(addonId) ? current.filter((id) => id !== addonId) : [...current, addonId]
    )
  }

  const calculatedPrice = useMemo(() => {
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = ADDONS.find((a) => a.id === id)
      return sum + (addon?.price || 0)
    }, 0)
    return selectedCraft.basePrice + addonsTotal
  }, [selectedCraft, selectedAddons])

  const handleAddCustomToBag = () => {
    const customProduct = {
      id: Date.now(),
      title: `Custom ${selectedCraft.title}`,
      price: `₹${calculatedPrice.toFixed(0)}`,
      category: selectedCraft.category,
      image: selectedCraft.image,
      badges: ['Bespoke Custom', 'Artisan Made'],
      description: `Bespoke crafted with ${selectedPalette.name} palette. ${
        customText ? `Personalization: "${customText}". ` : ''
      }Add-ons: ${selectedAddons.join(', ')}.`,
      rating: 5.0,
      reviews: 1,
    }

    addToCart(customProduct, 1, {
      palette: selectedPalette.name,
      personalization: customText,
      addons: selectedAddons,
    })
    setIsCartOpen(true)
  }

  return (
    <section id="customize" className="section-shell py-16 sm:py-24">
      <div className="reveal is-visible space-y-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" /> Interactive Studio
          </span>
          <h2 className="heading-1 mt-3.5">
            Design Your Bespoke <span className="italic font-normal text-gold-gradient">Handmade Craft</span>
          </h2>
          <p className="body-lead mx-auto mt-4 max-w-2xl text-[#4A4339]">
            Choose your artisan base piece, select a curated color mood, and personalize with custom engravings or gold leaf. We craft each one-of-a-kind piece from scratch.
          </p>
        </div>

        {/* Studio Workspace */}
        <div className="glass-card grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10 border border-[#D4AF37]/50 bg-gradient-to-b from-white via-[#FAF5E8] to-[#F7ECCF]/80 shadow-[0_16px_45px_rgba(184,134,11,0.12),0_0_20px_rgba(212,175,55,0.10)]">
          {/* Controls Column */}
          <div className="space-y-8">
            {/* Step 1: Base Craft */}
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#241A06] to-[#141414] border border-[#D4AF37]/50 text-xs font-black text-[#ECC872] shadow-xs">
                  1
                </span>
                <h3 className="font-serif text-2xl text-[#141414] font-bold">Choose Craft Base</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {BASE_CRAFTS.map((craft) => (
                  <button
                    key={craft.id}
                    type="button"
                    onClick={() => setSelectedCraft(craft)}
                    className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition duration-200 ${
                      selectedCraft.id === craft.id
                        ? 'border-[#D4AF37] bg-[#FAF5E8] shadow-sm ring-1 ring-[#D4AF37]'
                        : 'border-[#DFCFA6]/50 bg-gradient-to-b from-white to-[#FAF6ED] hover:border-[#D4AF37]/60'
                    }`}
                  >
                    <p className="text-sm font-bold text-[#141414]">{craft.title}</p>
                    <p className="mt-1 text-xs text-[#8C827A] line-clamp-1">{craft.category}</p>
                    <span className="mt-3 text-sm font-extrabold text-[#141414]">₹{craft.basePrice}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Color Palette */}
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#141414] text-xs font-bold text-white">
                  2
                </span>
                <h3 className="font-serif text-2xl text-[#141414] font-bold">Select Artisan Color Mood</h3>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setSelectedPalette(palette)}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition ${
                      selectedPalette.id === palette.id
                        ? 'border-[#DFCFA6] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC] shadow-sm ring-1 ring-[#DFCFA6]'
                        : 'border-[#DFCFA6]/50 bg-gradient-to-b from-[#FFFDF9]/80 to-[#FAF6ED]/70 hover:border-[#D4AF37]/70'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-[#141414]">{palette.name}</p>
                      <p className="text-xs text-[#8C827A]">{palette.description}</p>
                    </div>
                    <div className="flex -space-x-1.5 pl-2">
                      {palette.tones.map((color, i) => (
                        <span
                          key={i}
                          className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Add-ons & Engraving */}
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#141414] text-xs font-bold text-white">
                  3
                </span>
                <h3 className="font-serif text-2xl text-[#141414] font-bold">Artisan Touches & Add-ons</h3>
              </div>

              <div className="mt-4 space-y-2.5">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id)
                  const Icon = addon.icon

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition ${
                        isChecked
                          ? 'border-[#DFCFA6] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC] shadow-sm'
                          : 'border-[#DFCFA6]/50 bg-gradient-to-b from-[#FFFDF9]/80 to-[#FAF6ED]/70 hover:border-[#D4AF37]/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-xl transition ${
                            isChecked ? 'bg-[#141414] text-white font-bold' : 'bg-[#EFECE6] text-[#141414]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#141414] sm:text-sm">{addon.name}</p>
                          <p className="text-[11px] text-[#8C827A]">{addon.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#141414]">+₹{addon.price}</span>
                        <div
                          className={`grid h-5 w-5 place-items-center rounded-full border transition ${
                            isChecked ? 'border-[#141414] bg-[#141414] text-white' : 'border-[#DDD7CE] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {selectedAddons.includes('monogram') && (
                <div className="mt-3.5">
                  <label className="mb-1 block text-xs font-bold text-[#141414]">
                    Custom Monogram / Inscription Text (Max 24 characters)
                  </label>
                  <input
                    maxLength={24}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g., 'Maya • 2026' or 'Forever Glowing'"
                    className="h-11 w-full rounded-xl border border-[#DFCFA6]/60 bg-gradient-to-b from-[#FFFDF9] to-[#FAF6ED] px-4 text-sm text-[#141414] outline-none focus:border-[#D4AF37] focus:bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#D4AF37]/55 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5E8] to-[#F6EBCE]/80 p-6 lg:p-8 shadow-[0_12px_32px_rgba(184,134,11,0.12),0_0_15px_rgba(212,175,55,0.10)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="section-eyebrow">
                  <Sparkles className="h-3 w-3 text-[#B8860B]" /> Live Custom Preview
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E7314]">
                  1-of-1 Bespoke
                </span>
              </div>

              <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EFECE6] border border-[#E8DEC7] shadow-inner">
                <img
                  src={selectedCraft.image}
                  alt={selectedCraft.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Floating Palette Tag */}
                <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-white/95 px-3 py-1 text-xs font-bold text-[#141414] shadow-xs">
                  <Palette className="h-3.5 w-3.5 text-[#B8860B]" />
                  {selectedPalette.name}
                </div>

                {customText && (
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 rounded-xl border border-[#D4AF37]/60 bg-white/95 p-2 text-center shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#946B08]">Custom Engraving</p>
                    <p className="font-serif text-sm font-semibold italic text-[#141414]">"{customText}"</p>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-2">
                <h4 className="font-serif text-2xl text-[#141414] font-bold">{selectedCraft.title}</h4>
                <p className="text-xs leading-5 text-[#5A554E]">{selectedCraft.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="rounded-full bg-white/90 border border-[#D4AF37]/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#735206]">
                    Palette: {selectedPalette.name}
                  </span>
                  {selectedAddons.map((id) => (
                    <span
                      key={id}
                      className="rounded-full bg-white/90 border border-[#D4AF37]/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#735206]"
                    >
                      {ADDONS.find((a) => a.id === id)?.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#E8DEC7] pt-5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-baseline justify-between gap-3.5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">Total Craft Price</p>
                  <p className="font-serif text-3xl font-extrabold text-[#141414]">₹{calculatedPrice.toFixed(0)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomToBag}
                  className="btn-gold shadow-sm justify-center"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add Custom Craft to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

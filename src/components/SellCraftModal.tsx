"use client"

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Image as ImageIcon, PackagePlus, X } from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { categories } from '../data/products'

const PRESET_IMAGES = [
  { label: 'Resin Flora', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Silk Bangles', url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80' },
  { label: 'Soy Candle', url: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Discus Fish', url: 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b38?auto=format&fit=crop&w=800&q=80' },
  { label: 'Planted Tank', url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ceramic Decor', url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80' },
]

export default function SellCraftModal() {
  const { isSellOpen, setIsSellOpen, addProduct } = useMarketplace()
  const [formState, setFormState] = useState({
    image: PRESET_IMAGES[0].url,
    title: '',
    description: '',
    category: categories[0],
    price: '499',
  })

  const submitProduct = (event) => {
    event.preventDefault()
    if (!formState.title.trim() || !formState.image.trim()) return

    addProduct(formState)
    setIsSellOpen(false)
    setFormState({
      image: PRESET_IMAGES[0].url,
      title: '',
      description: '',
      category: categories[0],
      price: '499',
    })
  }

  return (
    <AnimatePresence>
      {isSellOpen ? (
        <motion.div
          key="sell-modal-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSellOpen(false)}
        >
          <motion.div
            key="sell-modal-card"
            className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[2.2rem] bg-white border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(180,135,45,0.22)]"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close sell modal"
              onClick={() => setIsSellOpen(false)}
              className="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#DFCFA6]/60 bg-white text-[#141414] shadow-sm transition hover:bg-[#FAF6ED] hover:border-[#D4AF37]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="border-b border-[#DFCFA6]/60 bg-gradient-to-r from-white via-[#FDFBF7] to-[#FAF6ED] px-6 py-6 sm:px-8 text-[#141414]">
              <span className="section-eyebrow">Artisan Creator Hub</span>
              <h3 className="mt-2 font-serif text-3xl text-[#141414] font-bold">List Your Handmade Craft</h3>
              <p className="mt-1 text-xs text-[#5A554E] sm:text-sm font-medium">
                Join our collective of independent craft makers. Your listing will appear live in the collection immediately.
              </p>
            </div>

            <form className="space-y-5 p-6 sm:p-8" onSubmit={submitProduct}>
              {/* Preset Image Chooser */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#141414]">
                  1. Select Photo Preset or Enter Image URL
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((img) => {
                    const isSelected = formState.image === img.url
                    return (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => setFormState({ ...formState, image: img.url })}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? 'border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1A120B] font-extrabold shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                            : 'border-[#DFCFA6]/60 bg-[#FAF7F2] text-[#5A451A] hover:border-[#D4AF37]'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        {img.label}
                      </button>
                    )
                  })}
                </div>

                <div className="relative mt-2.5">
                  <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B8860B]" />
                  <input
                    value={formState.image}
                    onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] pl-10 pr-4 text-xs text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#141414]">Craft Title</label>
                  <input
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                    placeholder="e.g. Handmade Resin Trinket Dish"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#141414]">Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Description */}
              <div className="grid gap-4 sm:grid-cols-[1fr_130px]">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#141414]">Story & Materials Description</label>
                  <textarea
                    rows={3}
                    value={formState.description}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    className="w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] p-3 text-xs leading-5 text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 font-medium"
                    placeholder="Describe your handcrafting process, materials, scents, or styling notes..."
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#141414]">Price (₹ INR)</label>
                  <input
                    type="number"
                    min="1"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#DFCFA6]/80 bg-[#FAF8F5] px-3.5 text-sm font-bold text-[#141414] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
                    placeholder="499"
                    required
                  />
                </div>
              </div>

              {/* Live Mini Preview */}
              {formState.title && (
                <div className="flex items-center gap-3.5 rounded-2xl border border-[#DFCFA6]/80 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC]/90 p-3 shadow-sm">
                  <img
                    src={formState.image}
                    alt="Preview"
                    className="h-14 w-14 rounded-xl object-cover bg-[#EFECE6] border border-[#DFCFA6]/50"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">
                      {formState.category}
                    </span>
                    <p className="truncate text-sm font-bold text-[#141414]">{formState.title}</p>
                    <p className="text-xs font-extrabold text-[#875A10]">₹{formState.price}</p>
                  </div>
                  <span className="rounded-full bg-white border border-[#DFCFA6]/80 px-2.5 py-1 text-[10px] font-bold text-[#875A10] shadow-sm">
                    Live Preview
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="btn-gold w-full py-3.5 text-sm shadow-[0_6px_20px_rgba(212,175,55,0.35)] justify-center font-bold tracking-wide"
              >
                <PackagePlus className="h-4 w-4" />
                Publish Live to Marketplace
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
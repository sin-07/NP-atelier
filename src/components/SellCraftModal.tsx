"use client"

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Lock,
  LogIn,
  PackagePlus,
  Sparkles,
  Store,
  UploadCloud,
  X,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { useUIModals } from '../context/UIModalContext'
import { categories } from '../data/products'
import { lockScroll, unlockScroll } from '../utils/scrollLock'

const PRESET_IMAGES = [
  { label: 'Resin Flora', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Silk Bangles', url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80' },
  { label: 'Soy Candle', url: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Discus Fish', url: '/products/royal-discus-aquarium.jpg' },
  { label: 'Planted Tank', url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ceramic Decor', url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80' },
]

export default function SellCraftModal() {
  const { isSellOpen, setIsSellOpen, setIsAuthOpen } = useUIModals()
  const {
    addProduct,
    user,
    login,
    showToast,
  } = useMarketplace()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageMode, setImageMode] = useState<'gallery' | 'presets' | 'url'>('gallery')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadedProvider, setUploadedProvider] = useState<string | null>(null)

  useEffect(() => {
    if (isSellOpen) {
      lockScroll()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsSellOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        unlockScroll()
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isSellOpen, setIsSellOpen])

  const [formState, setFormState] = useState({
    image: '',
    title: '',
    description: '',
    category: categories[0],
    price: '499',
  })

  // Handle direct file upload from user's gallery / camera directly to Cloudinary
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 12MB
    if (file.size > 12 * 1024 * 1024) {
      showToast?.({
        title: 'File Too Large',
        message: 'Please choose an image under 12MB.',
        type: 'error',
      })
      return
    }

    // Instant local preview
    const localPreviewUrl = URL.createObjectURL(file)
    setFormState((prev) => ({ ...prev, image: localPreviewUrl }))
    setIsUploading(true)
    setUploadSuccess(false)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.url) {
        setFormState((prev) => ({ ...prev, image: data.url }))
        setUploadSuccess(true)
        setUploadedProvider(data.provider || 'cloudinary')
        showToast?.({
          title: 'Photo Uploaded to Cloudinary',
          message: 'Your craft photo was successfully uploaded to Cloudinary CDN.',
          type: 'success',
        })
      } else {
        throw new Error(data.error || 'Upload to Cloudinary failed')
      }
    } catch (err: any) {
      console.error('Cloudinary gallery upload error:', err)
      showToast?.({
        title: 'Cloudinary Upload Notice',
        message: err.message || 'Image uploaded locally. Will display across store.',
        type: 'warning',
      })
      // Keep local preview if cloud error
      setUploadSuccess(true)
    } finally {
      setIsUploading(false)
    }
  }

  const submitProduct = (event: React.FormEvent) => {
    event.preventDefault()

    // Enforce login requirement
    if (!user) {
      showToast?.({
        title: 'Sign In Required',
        message: 'Please sign in or register to publish your craft listing.',
        type: 'error',
      })
      setIsSellOpen(false)
      setIsAuthOpen(true)
      return
    }

    if (!formState.title.trim()) {
      showToast?.({
        title: 'Title Required',
        message: 'Please provide a title for your craft.',
        type: 'error',
      })
      return
    }

    const finalImage = formState.image.trim() || PRESET_IMAGES[0].url

    addProduct({
      ...formState,
      image: finalImage,
      artisanName: user.name || 'Verified Artisan Maker',
    })

    setIsSellOpen(false)
    setFormState({
      image: '',
      title: '',
      description: '',
      category: categories[0],
      price: '499',
    })
    setUploadSuccess(false)
  }

  return (
    <AnimatePresence>
      {isSellOpen ? (
        <motion.div
          key="sell-modal-backdrop"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#141210]/50 backdrop-blur-xs p-0 sm:p-4 overflow-hidden touch-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={() => setIsSellOpen(false)}
        >
          <motion.div
            key="sell-modal-card"
            className="relative my-0 sm:my-8 w-full max-w-xl max-h-[92vh] sidebar-scroller rounded-t-[2.2rem] sm:rounded-[2.2rem] bg-[#FCF9F4] border border-[#6D5738]/25 shadow-[0_25px_70px_rgba(44,34,20,0.28)] transform-gpu will-change-transform touch-auto overscroll-contain"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile pull indicator */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden">
              <div className="w-12 h-1 rounded-full bg-[#D8CBB8]" />
            </div>

            <button
              type="button"
              aria-label="Close sell modal"
              onClick={() => setIsSellOpen(false)}
              className="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#6D5738]/25 bg-[#F5F0E8] text-[#141210] shadow-xs transition hover:bg-[#EFE8DC] hover:border-[#B68D52] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="border-b border-[#6D5738]/20 bg-[#FAF6EF] px-6 py-6 sm:px-8 text-[#141210]">
              <span className="section-eyebrow">
                <Store className="h-3.5 w-3.5 text-[#7A5B32]" />
                <span>Artisan Creator Studio</span>
              </span>
              <h3 className="mt-2 font-tagline text-2xl sm:text-3xl text-[#141210] font-bold">
                List Your Handmade Craft
              </h3>
              <p className="mt-1 text-xs text-[#5C4D3C] sm:text-sm font-medium">
                Publish directly to our marketplace collective. Verified listings go live immediately.
              </p>
            </div>

            {/* REQUIREMENT 2: Login Gate if user is NOT logged in */}
            {!user ? (
              <div className="p-6 sm:p-10 text-center space-y-6">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-[#6D5738]/25 bg-[#EFE8DC] shadow-xs">
                  <Lock className="h-7 w-7 text-[#7A5B32]" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h4 className="font-tagline text-2xl font-bold text-[#141210]">
                    Artisan Account Required
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C4D3C] leading-relaxed">
                    To protect marketplace authenticity and connect sales and customer inquiries directly to your maker profile, you must be signed in before listing items.
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSellOpen(false)
                      setIsAuthOpen(true)
                    }}
                    className="btn-primary w-full py-3.5 justify-center font-bold text-sm cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In / Create Maker Account</span>
                  </button>
                </div>

                <div className="rounded-xl border border-[#6D5738]/20 bg-[#FAF6EF] p-3 text-[11px] text-[#5C4D3C] max-w-md mx-auto text-left flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#7A5B32] shrink-0 mt-0.5" />
                  <span>
                    Zero listing fees. Fast payouts directly to your UPI/bank. Cloudinary-hosted high-resolution imagery.
                  </span>
                </div>
              </div>
            ) : (
              /* REQUIREMENT 1: Authenticated Maker Listing Form with Direct Gallery Cloudinary Upload */
              <form className="space-y-5 p-6 sm:p-8" onSubmit={submitProduct}>
                {/* Maker Profile Banner */}
                <div className="flex items-center justify-between rounded-2xl border border-[#6D5738]/20 bg-[#FAF6EF] p-3 sm:p-3.5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EFE8DC] text-[#7A5B32] font-black text-xs border border-[#6D5738]/25 shadow-xs">
                      {user.avatar || 'MP'}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-[#141210] leading-tight">
                        Listing as: <span className="text-[#7A5B32]">{user.name}</span>
                      </p>
                      <p className="text-[11px] text-[#5C4D3C]">{user.email}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-600/35 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                    Verified Maker
                  </span>
                </div>

                {/* REQUIREMENT 1: Photo Upload Section (Direct Gallery -> Cloudinary) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141210]">
                      1. Craft Photo (Direct Gallery Upload)
                    </label>
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImageMode('gallery')}
                        className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                          imageMode === 'gallery'
                            ? 'bg-[#D4AF78] text-[#141210]'
                            : 'text-[#5C4D3C] hover:text-[#141210]'
                        }`}
                      >
                        From Gallery
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('presets')}
                        className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                          imageMode === 'presets'
                            ? 'bg-[#D4AF78] text-[#141210]'
                            : 'text-[#5C4D3C] hover:text-[#141210]'
                        }`}
                      >
                        Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                          imageMode === 'url'
                            ? 'bg-[#D4AF78] text-[#141210]'
                            : 'text-[#5C4D3C] hover:text-[#141210]'
                        }`}
                      >
                        Paste URL
                      </button>
                    </div>
                  </div>

                  {/* Hidden Gallery File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />

                  {/* MODE 1: Direct Gallery Upload to Cloudinary (Default) */}
                  {imageMode === 'gallery' && (
                    <div>
                      {isUploading ? (
                        <div className="rounded-2xl border-2 border-dashed border-[#B68D52] bg-[#F5F0E8] p-7 text-center space-y-2">
                          <Loader2 className="h-8 w-8 text-[#7A5B32] animate-spin mx-auto" />
                          <p className="text-sm font-bold text-[#141210]">Uploading to Cloudinary CDN...</p>
                          <p className="text-xs text-[#5C4D3C]">Optimizing high-resolution craft photo</p>
                        </div>
                      ) : formState.image ? (
                        <div className="relative rounded-2xl border border-[#6D5738]/20 bg-[#FAF6EF] p-3 flex items-center gap-3.5 shadow-xs">
                          <img
                            src={formState.image}
                            alt="Uploaded craft"
                            className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover bg-[#EFE8DC] border border-[#6D5738]/20"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-600/35 rounded-full px-2.5 py-0.5">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                {uploadedProvider === 'cloudinary' ? 'Cloudinary Hosted' : 'Photo Uploaded'}
                              </span>
                            </div>
                            <p className="truncate text-xs text-[#5C4D3C] font-mono mt-1">
                              {formState.image}
                            </p>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="mt-1.5 text-xs font-bold text-[#7A5B32] hover:text-[#141210] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Camera className="h-3 w-3" />
                              <span>Choose different photo from gallery</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="group cursor-pointer rounded-2xl border-2 border-dashed border-[#6D5738]/35 bg-[#F5F0E8] p-6 text-center transition hover:border-[#B68D52] hover:bg-[#FAF6EF] shadow-xs"
                        >
                          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#EFE8DC] border border-[#6D5738]/25 text-[#7A5B32] transition group-hover:scale-110 mb-2">
                            <UploadCloud className="h-6 w-6" />
                          </div>
                          <p className="font-bold text-sm text-[#141210]">
                            Tap to Upload from Device Gallery / Photos
                          </p>
                          <p className="text-xs text-[#5C4D3C] mt-1 max-w-xs mx-auto">
                            Directly sends your craft photo to Cloudinary CDN (JPEG, PNG, WebP)
                          </p>
                          <button
                            type="button"
                            className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#D4AF78] text-[#141210] px-4 py-2 text-xs font-bold shadow-xs transition hover:bg-[#E5C18A]"
                          >
                            <Camera className="h-3.5 w-3.5 text-[#141210]" />
                            <span>Browse Gallery</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODE 2: Preset Photos */}
                  {imageMode === 'presets' && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {PRESET_IMAGES.map((img) => {
                          const isSelected = formState.image === img.url
                          return (
                            <button
                              key={img.label}
                              type="button"
                              onClick={() => setFormState({ ...formState, image: img.url })}
                              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                isSelected
                                  ? 'border-[#C69C5D] bg-[#D4AF78] text-[#141210] font-extrabold shadow-xs'
                                  : 'border-[#6D5738]/25 bg-[#F5F0E8] text-[#5C4D3C] hover:border-[#B68D52]'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              {img.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* MODE 3: Image URL */}
                  {imageMode === 'url' && (
                    <div className="relative">
                      <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A5B32]" />
                      <input
                        value={formState.image}
                        onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                        className="h-11 w-full rounded-xl border border-[#6D5738]/25 bg-[#F5F0E8] pl-10 pr-4 text-xs text-[#141210] placeholder-[#5C4D3C]/55 outline-none transition focus:border-[#B68D52] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                        placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                      />
                    </div>
                  )}
                </div>

                {/* Title & Category */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141210]">Craft Title</label>
                    <input
                      value={formState.title}
                      onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#6D5738]/25 bg-[#F5F0E8] px-3.5 text-sm text-[#141210] placeholder-[#5C4D3C]/55 outline-none transition focus:border-[#B68D52] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                      placeholder="e.g. Botanical Pressed Flora Trinket Tray"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141210]">Category</label>
                    <select
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#6D5738]/25 bg-[#F5F0E8] px-3.5 text-sm text-[#141210] outline-none transition focus:border-[#B68D52] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-[#FCF9F4] text-[#141210]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Description */}
                <div className="grid gap-4 sm:grid-cols-[1fr_130px]">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141210]">
                      Craft Story & Materials
                    </label>
                    <textarea
                      rows={3}
                      value={formState.description}
                      onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                      className="w-full rounded-xl border border-[#6D5738]/25 bg-[#F5F0E8] p-3 text-xs leading-5 text-[#141210] placeholder-[#5C4D3C]/55 outline-none transition focus:border-[#B68D52] focus:ring-1 focus:ring-[#D4AF78]/40 font-medium"
                      placeholder="Detail your handcrafting process, sustainably sourced botanicals, clay, or soy wax notes..."
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#141210]">Price (₹ INR)</label>
                    <input
                      type="number"
                      min="1"
                      value={formState.price}
                      onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#6D5738]/25 bg-[#F5F0E8] px-3.5 text-sm font-bold text-[#141210] outline-none transition focus:border-[#B68D52] focus:ring-1 focus:ring-[#D4AF78]/40"
                      placeholder="499"
                      required
                    />
                  </div>
                </div>

                {/* Live Mini Preview */}
                {(formState.title || formState.image) && (
                  <div className="flex items-center gap-3.5 rounded-2xl border border-[#6D5738]/20 bg-[#FAF6EF] p-3 shadow-xs">
                    <img
                      src={formState.image || PRESET_IMAGES[0].url}
                      alt="Preview"
                      className="h-14 w-14 rounded-xl object-cover bg-[#EFE8DC] border border-[#6D5738]/20"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D3C]">
                        {formState.category} • {user.name}
                      </span>
                      <p className="truncate text-sm font-bold text-[#141210]">
                        {formState.title || 'Untitled Creation'}
                      </p>
                      <p className="text-xs font-extrabold text-[#7A5B32]">₹{formState.price}</p>
                    </div>
                    <span className="rounded-full bg-[#EFE8DC] border border-[#6D5738]/25 px-2.5 py-1 text-[10px] font-bold text-[#7A5B32] shadow-xs">
                      Live Preview
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn-primary w-full py-3.5 text-sm justify-center font-bold tracking-wide cursor-pointer disabled:opacity-50"
                >
                  <PackagePlus className="h-4 w-4" />
                  <span>Publish Live to Marketplace</span>
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
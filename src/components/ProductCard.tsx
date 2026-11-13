"use client"
import { useState, useEffect, memo } from 'react'
import { Eye, Heart, MessageCircle, Minus, Plus, ShoppingBag, Star, Sparkles } from 'lucide-react'
import { fallbackCraftImage, fallbackAquariumImage } from '../utils/fallbackImage'
import { Product } from '../data/products'
import { useMarketplace } from '../context/MarketplaceContext'
import { buildSingleProductWhatsAppMessage, sendWhatsAppOrder } from '../utils/whatsappOrder'

export interface ProductCardProps {
  product: Product | any
  isWishlisted?: boolean
  priority?: boolean
  isCompact?: boolean
  isComingSoon?: boolean
  onWishlistToggle?: (id: string | number) => void
  onQuickView?: (product: Product | any) => void
  onAddToCart?: (product: any, quantity?: number) => void
  onBuyNow?: (product: any) => void
  className?: string
}

function WhatsAppIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.57 14.39C16.32 14.27 15.11 13.67 14.88 13.59C14.65 13.5 14.49 13.46 14.32 13.71C14.15 13.96 13.68 14.52 13.53 14.69C13.38 14.85 13.24 14.87 12.99 14.75C12.74 14.62 11.93 14.36 10.98 13.51C10.23 12.85 9.73 12.03 9.58 11.78C9.43 11.53 9.56 11.4 9.69 11.27C9.8 11.16 9.94 10.98 10.06 10.84C10.19 10.69 10.23 10.59 10.31 10.42C10.39 10.26 10.35 10.11 10.29 9.99C10.23 9.86 9.73 8.64 9.53 8.14C9.32 7.65 9.12 7.72 8.97 7.71C8.83 7.7 8.66 7.7 8.49 7.7C8.33 7.7 8.06 7.76 7.83 8.01C7.6 8.26 6.96 8.86 6.96 10.08C6.96 11.3 7.85 12.48 7.97 12.64C8.1 12.81 9.72 15.31 12.2 16.38C12.79 16.64 13.25 16.79 13.61 16.91C14.21 17.1 14.75 17.07 15.18 17.01C15.66 16.94 16.65 16.41 16.86 15.82C17.06 15.24 17.06 14.74 17 14.64C16.94 14.53 16.82 14.51 16.57 14.39Z" />
    </svg>
  )
}

function ProductCard({
  product,
  isWishlisted = false,
  priority = false,
  isCompact = false,
  isComingSoon = false,
  onWishlistToggle,
  onQuickView,
  onAddToCart,
  onBuyNow,
  className = '',
}: ProductCardProps) {
  const { cart, addToCart, setCartQuantity, removeFromCart, branding, isAquaticTheme } = useMarketplace()
  const [plusPop, setPlusPop] = useState(false)

  const isCardComingSoon = Boolean(
    isComingSoon ||
    product?.department === 'aquarium' ||
    product?.isComingSoon
  )
  const useAquaticPalette = isAquaticTheme || product?.department === 'aquarium' || isComingSoon

  // Direct fast lookup in active cart (instant sync, 0 duplicate re-renders)
  const productIdStr = String(product?.id ?? product?._id ?? '')
  const productAltIdStr = product?._id ? String(product._id) : ''
  const cartItem = cart?.find(
    (item: any) =>
      (String(item.cartItemId) === productIdStr ||
       String(item.productId) === productIdStr ||
       (productAltIdStr && (String(item.productId) === productAltIdStr || String(item.cartItemId) === productAltIdStr))) &&
      !item.customization
  )
  const activeQuantity = cartItem ? cartItem.quantity : 0

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPlusPop(true)
    setTimeout(() => setPlusPop(false), 800)
    if (onAddToCart) {
      onAddToCart(product, 1)
    } else {
      addToCart(product, 1)
    }
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextQty = (activeQuantity || 1) + 1
    setPlusPop(true)
    setTimeout(() => setPlusPop(false), 800)
    const targetId = product.id ?? product._id
    setCartQuantity(targetId, nextQty)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    const targetId = product.id ?? product._id
    if (activeQuantity <= 1) {
      removeFromCart(targetId)
    } else {
      setCartQuantity(targetId, activeQuantity - 1)
    }
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const targetId = product.id ?? product._id
    onWishlistToggle?.(targetId)
  }

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickView?.(product)
  }

  const curr = branding?.currency || '₹'
  const rawPriceStr = product.price != null ? String(product.price).trim() : '999'
  const numericVal = parseFloat(rawPriceStr.replace(/[^0-9.]/g, ''))
  const formattedPrice = !isNaN(numericVal)
    ? `${curr}${numericVal.toLocaleString('en-IN')}`
    : rawPriceStr.startsWith(curr)
    ? rawPriceStr
    : `${curr}${rawPriceStr}`

  const rawOrig = (product as any).originalPrice
  const origNumericVal = rawOrig != null ? parseFloat(String(rawOrig).replace(/[^0-9.]/g, '')) : null
  const formattedOriginalPrice = origNumericVal && !isNaN(origNumericVal)
    ? `${curr}${origNumericVal.toLocaleString('en-IN')}`
    : rawOrig != null
    ? String(rawOrig).startsWith(curr)
      ? String(rawOrig)
      : `${curr}${rawOrig}`
    : null
  const discountPercent =
    origNumericVal && numericVal && origNumericVal > numericVal
      ? Math.round(((origNumericVal - numericVal) / origNumericVal) * 100)
      : null

  const contactPhone = (branding?.contactPhone || '+91 93412 97124').replace(/[^0-9]/g, '')
  const storeName = branding?.siteName || 'NP Atelier'

  const handleWhatsAppAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const targetPhone = contactPhone || '919341297124'
    const waMessage = buildSingleProductWhatsAppMessage({
      storeName,
      title: product.title,
      price: formattedPrice,
      quantity: activeQuantity > 1 ? activeQuantity : 1,
      category: product.category,
      department: product.department,
      image: product.image,
      isComingSoon: isCardComingSoon,
      description: product.description,
    })
    sendWhatsAppOrder({
      phone: targetPhone,
      message: waMessage,
      imageUrl: product.image,
      imageFilename: `${(product.title || 'product').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`,
    })
  }

  return (
    <article
      className={`card-smooth-appear group relative flex flex-col justify-between overflow-hidden ${
        isCompact
          ? 'rounded-[1.15rem] sm:rounded-[1.35rem] p-2 sm:p-2.5'
          : 'rounded-[1.25rem] sm:rounded-[1.65rem] p-2.5 sm:p-3'
      } border transition-[transform,box-shadow,border-color] duration-200 ease-out transform-gpu hover:will-change-transform sm:hover:-translate-y-1 ${
        useAquaticPalette
          ? 'border-sky-300/65 bg-gradient-to-b from-[#FFFFFF] via-[#F7FBFF] to-[#ECF6FD] shadow-[0_10px_26px_rgba(12,74,110,0.10)] sm:hover:shadow-[0_16px_34px_rgba(12,74,110,0.16),0_0_18px_rgba(16,185,129,0.18)] sm:hover:border-emerald-500/70'
          : 'border-[#8C6D46]/25 bg-gradient-to-b from-[#FCF9F4] via-[#FAF6EE] to-[#F3ECE0] shadow-[0_8px_24px_rgba(72,54,30,0.08)] sm:hover:shadow-[0_18px_36px_rgba(72,54,30,0.14),0_0_20px_rgba(212,175,120,0.14)] sm:hover:border-[#B8925A]'
      } ${className}`}
    >
      <div>
        {/* Image Showcase Frame */}
        <div
          className={`relative ${
            isCompact ? 'aspect-square sm:aspect-[4/3.8]' : 'aspect-square sm:aspect-[4/4.3]'
          } w-full overflow-hidden rounded-xl sm:rounded-2xl border ${
            useAquaticPalette ? 'bg-[#E2F0FA] border-sky-200/80' : 'bg-[#EDE4DD] border-[#8C6D46]/20'
          }`}
        >
          <img
            src={product.image}
            alt={product.title}
            width={380}
            height={380}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = isCardComingSoon || product?.department === 'aquarium' ? fallbackAquariumImage : fallbackCraftImage
            }}
            className="h-full w-full object-cover transition-transform duration-300 ease-out sm:group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 sm:group-hover:opacity-100" />

          {/* Luxury Curated Badges */}
          <div className="absolute left-1.5 sm:left-2 top-1.5 sm:top-2 z-10 flex flex-wrap items-center gap-1 max-w-[80%]">
            {product.badges?.[0] ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-1.5 sm:px-2 py-0.5 text-[7.5px] sm:text-[8.5px] font-extrabold uppercase tracking-wider shadow-sm ${
                  useAquaticPalette
                    ? 'bg-white/95 border-emerald-500/50 text-emerald-700'
                    : 'bg-[#0B0B0A]/90 border-[rgba(212,175,120,0.35)] text-[#D4AF78]'
                }`}
              >
                <span className={`h-1 w-1 rounded-full ${useAquaticPalette ? 'bg-emerald-500' : 'bg-[#D4AF78]'}`} />
                <span className="truncate max-w-[90px] sm:max-w-none">{product.badges[0]}</span>
              </span>
            ) : (
              <span
                className={`inline-flex items-center rounded-full border px-1.5 sm:px-2 py-0.5 text-[7.5px] sm:text-[8.5px] font-extrabold uppercase tracking-wider shadow-sm ${
                  useAquaticPalette
                    ? 'bg-white/95 border-emerald-500/45 text-emerald-700'
                    : 'bg-[#0B0B0A]/90 border-[rgba(212,175,120,0.30)] text-[#D4AF78]'
                }`}
              >
                {product.department === 'aquarium' ? 'Aquatics' : 'Artisan'}
              </span>
            )}
            {!isCompact && !isCardComingSoon && product.badges?.[1] && (
              <span
                className={`hidden sm:inline-flex items-center rounded-full border px-1.5 sm:px-2 py-0.5 text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider shadow-sm ${
                  useAquaticPalette
                    ? 'bg-white/95 border-sky-400/50 text-sky-800'
                    : 'bg-[#12110F]/90 border-[rgba(212,175,120,0.25)] text-[#F5EBDD]'
                }`}
              >
                {product.badges[1]}
              </span>
            )}
          </div>

          {/* Refined Corner "Coming Soon" Ribbon (keeps centerpiece specimen unobstructed) */}
          {isCardComingSoon && (
            <div className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 z-20 pointer-events-none">
              <div
                className={`flex items-center gap-1 rounded-full border px-2 sm:px-2.5 py-0.5 sm:py-1 transform transition-transform duration-200 sm:group-hover:scale-105 ${
                  useAquaticPalette
                    ? 'bg-white/95 border-[#E11D48]/65 shadow-[0_4px_12px_rgba(10,37,64,0.16)]'
                    : 'bg-[#0B0B0A]/95 border-[#D4AF78] shadow-[0_6px_16px_rgba(0,0,0,0.6)]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full animate-pulse shrink-0 ${
                    useAquaticPalette ? 'bg-[#E11D48]' : 'bg-[#D4AF78]'
                  }`}
                />
                <span
                  className={`text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.12em] whitespace-nowrap ${
                    useAquaticPalette ? 'text-[#BE123C]' : 'text-[#D4AF78]'
                  }`}
                >
                  Coming Soon
                </span>
              </div>
            </div>
          )}

          {/* Active Bag Quantity Pill on Image */}
          {activeQuantity > 0 && (
            <div
              className={`absolute left-1.5 sm:left-2 bottom-1.5 sm:bottom-2 z-10 flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[8px] sm:text-[9.5px] font-bold shadow-md ${
                useAquaticPalette
                  ? 'bg-white/95 border-rose-500/65 text-[#BE123C]'
                  : 'bg-[#0B0B0A]/95 border-[#D4AF78]/60 text-[#D4AF78]'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  useAquaticPalette ? 'bg-[#E11D48]' : 'bg-[#D4AF78]'
                }`}
              />
              <span>+{activeQuantity} in Bag</span>
            </div>
          )}

          {/* Floating Actions: Wishlist & Quick View */}
          <div className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 z-10 flex flex-col gap-1">
            <button
              type="button"
              aria-pressed={isWishlisted}
              aria-label={`Save ${product.title} to wishlist`}
              onClick={handleWishlistClick}
              className={`grid h-6 w-6 sm:h-7.5 sm:w-7.5 place-items-center rounded-full border shadow-sm transition duration-150 active:scale-90 sm:hover:scale-105 sm:hover:border-rose-500 sm:hover:text-rose-500 cursor-pointer ${
                useAquaticPalette
                  ? 'bg-white/95 border-sky-300/75 text-[#0A2540]'
                  : 'bg-[#FCF9F4]/95 border-[#8C6D46]/30 text-[#141210]'
              }`}
            >
              <Heart
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition ${
                  isWishlisted
                    ? 'fill-rose-500 text-rose-500 scale-105'
                    : useAquaticPalette
                    ? 'text-[#0A2540]'
                    : 'text-[#141210]'
                }`}
              />
            </button>
            <button
              type="button"
              aria-label={`Quick view ${product.title}`}
              onClick={handleQuickViewClick}
              className={`grid h-6 w-6 sm:h-7.5 sm:w-7.5 place-items-center rounded-full border shadow-sm transition duration-150 active:scale-90 sm:hover:scale-105 cursor-pointer ${
                useAquaticPalette
                  ? 'bg-white/95 border-sky-300/75 text-[#0A2540] sm:hover:border-emerald-500 sm:hover:text-emerald-700'
                  : 'bg-[#FCF9F4]/95 border-[#8C6D46]/30 text-[#141210] sm:hover:border-[#B8925A] sm:hover:text-[#7A5B32]'
              }`}
            >
              <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className={`px-0.5 space-y-0.5 sm:space-y-1 ${isCompact ? 'mt-1.5' : 'mt-2'}`}>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px]">
            <span
              className={`font-bold uppercase tracking-[0.1em] truncate ${
                useAquaticPalette ? 'text-emerald-700' : 'text-[#7A5B32]'
              }`}
              title={product.category}
            >
              {product.category}
            </span>
            <div
              className={`flex items-center gap-1 shrink-0 font-bold ${
                useAquaticPalette ? 'text-[#0A2540]' : 'text-[#141210]'
              }`}
            >
              <Star
                className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                  useAquaticPalette
                    ? 'fill-rose-500 text-rose-500'
                    : 'fill-[#D4AF78] text-[#B88B44]'
                }`}
              />
              <span>{product.rating ?? '4.9'}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={handleQuickViewClick}
            className={`cursor-pointer font-tagline font-bold tracking-tight leading-snug transition-colors duration-150 ${
              useAquaticPalette
                ? 'text-[#0A2540] hover:text-emerald-700'
                : 'text-[#141210] hover:text-[#7A5B32]'
            } ${
              isCompact
                ? 'text-sm sm:text-[15px] line-clamp-1 min-h-0'
                : 'text-sm sm:text-base line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem]'
            }`}
            title={product.title}
          >
            {product.title}
          </h3>

        </div>
      </div>

      {/* Footer: Clean Price & Never-Cramped Action Bar */}
      <div
        className={`pt-2.5 sm:pt-3 border-t px-0.5 mt-2 space-y-2 ${
          useAquaticPalette ? 'border-sky-200/85' : 'border-[#8C6D46]/20'
        }`}
      >
        {/* Price & Availability Status */}
        <div className="flex items-center justify-between gap-1.5 py-0.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span
              className={`font-serif font-extrabold tracking-tight leading-none whitespace-nowrap ${
                useAquaticPalette ? 'text-[#0A2540]' : 'text-[#141210]'
              } ${isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}
            >
              {formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span
                className={`text-[10px] sm:text-xs line-through font-medium whitespace-nowrap ${
                  useAquaticPalette ? 'text-[#5A81A0]' : 'text-[#75624C]'
                }`}
              >
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {discountPercent ? (
            <span
              className={`text-[8.5px] sm:text-[9.5px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs shrink-0 ${
                useAquaticPalette
                  ? 'bg-[#E11D48] text-white'
                  : 'text-[#141210] bg-gradient-to-r from-[#D4AF78] to-[#ECC872]'
              }`}
            >
              {discountPercent}% OFF
            </span>
          ) : isCardComingSoon ? (
            <span
              className={`text-[8.5px] sm:text-[9.5px] font-bold border px-2 py-0.5 rounded-full shrink-0 ${
                useAquaticPalette
                  ? 'text-[#BE123C] bg-rose-50 border-rose-300'
                  : 'text-[#7A5B32] bg-[#EFE8DC] border-[#8C6D46]/30'
              }`}
            >
              Coming Soon
            </span>
          ) : (
            <span
              className={`text-[8.5px] sm:text-[9.5px] font-bold border px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                useAquaticPalette
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock</span>
            </span>
          )}
        </div>

        {/* Unified Action Bar */}
        <div className="relative">
          {plusPop && (
            <span
              className={`absolute -top-7 right-2 sm:right-4 z-30 pointer-events-none inline-flex items-center gap-1 rounded-full text-[9px] sm:text-[10px] font-black px-2 py-0.5 animate-bounce border ${
                useAquaticPalette
                  ? 'bg-[#E11D48] text-white border-rose-300 shadow-[0_4px_14px_rgba(225,29,72,0.35)]'
                  : 'bg-[#D4AF78] text-[#141210] border-[#E5C18A] shadow-[0_4px_14px_rgba(212,175,120,0.4)]'
              }`}
            >
              ✨ +{activeQuantity > 1 ? activeQuantity : 1} in Bag!
            </span>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isCardComingSoon ? (
              <button
                type="button"
                onClick={handleWhatsAppAction}
                className="w-full h-8.5 sm:h-9 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 border border-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-98"
                title={`Inquire about ${product.title} on WhatsApp (${contactPhone})`}
              >
                <WhatsAppIcon className="h-4 w-4 text-white shrink-0" />
                <span className="whitespace-nowrap font-bold text-white">Inquire on WhatsApp</span>
              </button>
            ) : activeQuantity > 0 ? (
              <>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`flex-1 min-w-0 h-8.5 sm:h-9 flex items-center justify-between rounded-full border p-0.5 shadow-xs select-none transition-all duration-200 ${
                    useAquaticPalette
                      ? 'bg-[#EBF6FD] border-rose-400/70'
                      : 'bg-[#EFE8DC] border-[#B8925A]'
                  }`}
                >
                  {/* Minus Button */}
                  <button
                    type="button"
                    aria-label={`Decrease ${product.title} quantity`}
                    onClick={handleDecrement}
                    className={`grid h-7 w-7 place-items-center rounded-full border transition duration-150 active:scale-85 cursor-pointer shrink-0 shadow-xs ${
                      useAquaticPalette
                        ? 'bg-white text-sky-700 border-sky-300/70 hover:text-[#0A2540]'
                        : 'bg-[#FAF6EF] text-[#7A5B32] hover:bg-[#E7DDD0] hover:text-[#141210] border-[#8C6D46]/30'
                    }`}
                    title="Decrease (-1)"
                  >
                    <Minus className="h-3 w-3 stroke-[3]" />
                  </button>

                  <div className="flex items-center gap-1 px-1 justify-center flex-1 min-w-0">
                    <span
                      className={`inline-flex items-center justify-center min-w-[18px] px-1 py-0.2 rounded-full text-[11px] font-black font-mono shadow-xs ${
                        useAquaticPalette ? 'bg-[#E11D48] text-white' : 'bg-[#D4AF78] text-[#141210]'
                      }`}
                    >
                      {activeQuantity}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate ${
                        useAquaticPalette ? 'text-[#2C5270]' : 'text-[#5C4D3C]'
                      }`}
                    >
                      in Bag
                    </span>
                  </div>

                  {/* Plus Button */}
                  <button
                    type="button"
                    aria-label={`Increase ${product.title} quantity`}
                    onClick={handleIncrement}
                    className={`grid h-7 w-7 place-items-center rounded-full transition duration-150 active:scale-85 cursor-pointer shadow-xs shrink-0 ${
                      useAquaticPalette
                        ? 'bg-[#E11D48] text-white hover:bg-[#BE123C]'
                        : 'bg-[#D4AF78] text-[#141210] hover:bg-[#E5C18A]'
                    }`}
                    title="Add (+1)"
                  >
                    <Plus className="h-3 w-3 stroke-[3]" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppAction}
                  className={`h-8.5 sm:h-9 rounded-full border transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 px-2.5 sm:px-3 shadow-xs cursor-pointer shrink-0 group/wa ${
                    useAquaticPalette
                      ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white'
                      : 'bg-[#063326] hover:bg-[#084534] border-emerald-400/60 hover:border-emerald-300 text-emerald-300'
                  }`}
                  title={`Order ${product.title} on WhatsApp (${contactPhone})`}
                  aria-label={`Order ${product.title} on WhatsApp`}
                >
                  <WhatsAppIcon className={`h-3.5 w-3.5 group-hover/wa:scale-110 transition-transform shrink-0 ${useAquaticPalette ? 'text-white' : 'text-emerald-400'}`} />
                  <span className={`text-[11px] font-bold transition-colors whitespace-nowrap hidden sm:inline ${useAquaticPalette ? 'text-white' : 'text-white group-hover/wa:text-emerald-300'}`}>
                    WhatsApp
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 min-w-0 h-8.5 sm:h-9 inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 sm:px-3 font-extrabold text-xs transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                    useAquaticPalette
                      ? 'bg-gradient-to-r from-[#E11D48] via-[#DC2626] to-[#F43F5E] hover:brightness-105 border-rose-500/60 text-white shadow-[0_4px_12px_rgba(225,29,72,0.25)]'
                      : 'bg-gradient-to-r from-[#D4AF78] via-[#ECC872] to-[#D4AF78] hover:brightness-105 border-[#F5DC9A]/60 text-[#141210] shadow-[0_2px_10px_rgba(212,175,120,0.25)]'
                  }`}
                  title={`Add ${product.title} to Bag`}
                >
                  <ShoppingBag
                    className={`h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:scale-110 shrink-0 stroke-[2.5] ${
                      useAquaticPalette ? 'text-white' : 'text-[#141210]'
                    }`}
                  />
                  <span className="font-extrabold whitespace-nowrap truncate">Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppAction}
                  className={`h-8.5 sm:h-9 rounded-full border transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 px-2.5 sm:px-3 shadow-xs cursor-pointer shrink-0 group/wa ${
                    useAquaticPalette
                      ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white'
                      : 'bg-[#063326] hover:bg-[#084534] border-emerald-400/60 hover:border-emerald-300 text-emerald-300'
                  }`}
                  title={`Order ${product.title} on WhatsApp (${contactPhone})`}
                  aria-label={`Order ${product.title} on WhatsApp`}
                >
                  <WhatsAppIcon className={`h-3.5 w-3.5 group-hover/wa:scale-110 transition-transform shrink-0 ${useAquaticPalette ? 'text-white' : 'text-emerald-400'}`} />
                  <span className={`text-[11px] font-bold transition-colors whitespace-nowrap hidden sm:inline ${useAquaticPalette ? 'text-white' : 'text-white group-hover/wa:text-emerald-300'}`}>
                    WhatsApp
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)

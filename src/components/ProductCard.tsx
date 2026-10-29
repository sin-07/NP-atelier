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
  const { cart, addToCart, setCartQuantity, removeFromCart, branding } = useMarketplace()
  const [plusPop, setPlusPop] = useState(false)

  const isCardComingSoon = Boolean(
    isComingSoon ||
    product?.department === 'aquarium' ||
    product?.isComingSoon
  )

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
          ? 'rounded-[1.15rem] sm:rounded-[1.35rem] p-1.5 sm:p-2.5'
          : 'rounded-[1.25rem] sm:rounded-[1.65rem] p-2 sm:p-2.5'
      } border border-[rgba(212,175,120,0.25)] bg-[#191713] shadow-[0_8px_24px_rgba(0,0,0,0.65)] sm:hover:shadow-[0_16px_36px_rgba(0,0,0,0.85)] sm:hover:border-[rgba(212,175,120,0.55)] transition-[transform,box-shadow,border-color] duration-200 ease-out transform-gpu hover:will-change-transform ${className}`}
    >
      <div>
        {/* Image Showcase Frame */}
        <div
          className={`relative ${
            isCompact ? 'aspect-square sm:aspect-[4/3.8]' : 'aspect-square sm:aspect-[4/4.3]'
          } w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#0B0B0A] border border-[rgba(212,175,120,0.25)]`}
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/70 via-transparent to-transparent opacity-0 transition-opacity duration-200 sm:group-hover:opacity-100" />

          {/* Luxury Curated Badges */}
          <div className="absolute left-1.5 sm:left-2 top-1.5 sm:top-2 z-10 flex flex-wrap items-center gap-1 max-w-[80%]">
            {product.badges?.[0] ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0B0B0A]/90 border border-[rgba(212,175,120,0.35)] px-1.5 sm:px-2 py-0.5 text-[7.5px] sm:text-[8.5px] font-extrabold uppercase tracking-wider text-[#D4AF78] shadow-sm">
                <span className="h-1 w-1 rounded-full bg-[#D4AF78]" />
                <span className="truncate max-w-[90px] sm:max-w-none">{product.badges[0]}</span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[#0B0B0A]/90 border border-[rgba(212,175,120,0.30)] px-1.5 sm:px-2 py-0.5 text-[7.5px] sm:text-[8.5px] font-extrabold uppercase tracking-wider text-[#D4AF78] shadow-sm">
                {product.department === 'aquarium' ? 'Aquatics' : 'Artisan'}
              </span>
            )}
            {!isCompact && !isCardComingSoon && product.badges?.[1] && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-[#12110F]/90 border border-[rgba(212,175,120,0.25)] px-1.5 sm:px-2 py-0.5 text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider text-[#B8AA96] shadow-sm">
                {product.badges[1]}
              </span>
            )}
          </div>

          {/* BICHO BICH (DEAD CENTER) "COMING SOON" BADGE */}
          {isCardComingSoon && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-2 sm:p-3 bg-black/40 pointer-events-none transition-all duration-200">
              <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#0B0B0A]/95 backdrop-blur-xs border border-[#D4AF78] px-3 sm:px-4 py-1.5 sm:py-2 shadow-[0_8px_24px_rgba(0,0,0,0.7)] transform transition-transform duration-200 sm:group-hover:scale-105">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D4AF78] animate-pulse shrink-0" />
                <span className="font-serif text-[10.5px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#D4AF78] drop-shadow-sm whitespace-nowrap">
                  Coming Soon
                </span>
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#D4AF78]" />
              </div>
            </div>
          )}

          {/* Active Bag Quantity Pill on Image */}
          {activeQuantity > 0 && (
            <div className="absolute left-1.5 sm:left-2 bottom-1.5 sm:bottom-2 z-10 flex items-center gap-1.5 rounded-full bg-[#0B0B0A]/95 border border-[#D4AF78]/60 px-2 py-0.5 text-[8px] sm:text-[9.5px] font-bold text-[#D4AF78] shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF78] animate-pulse" />
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
              className="grid h-6 w-6 sm:h-7.5 sm:w-7.5 place-items-center rounded-full bg-[#12110F]/90 border border-[rgba(212,175,120,0.25)] text-[#F5EBDD] shadow-sm transition duration-150 active:scale-90 sm:hover:scale-105 sm:hover:border-rose-400 sm:hover:text-rose-400 cursor-pointer"
            >
              <Heart
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition ${
                  isWishlisted ? 'fill-rose-500 text-rose-500 scale-105' : 'text-[#F5EBDD]'
                }`}
              />
            </button>
            <button
              type="button"
              aria-label={`Quick view ${product.title}`}
              onClick={handleQuickViewClick}
              className="grid h-6 w-6 sm:h-7.5 sm:w-7.5 place-items-center rounded-full bg-[#12110F]/90 border border-[rgba(212,175,120,0.25)] text-[#F5EBDD] shadow-sm transition duration-150 active:scale-90 sm:hover:scale-105 sm:hover:border-[#D4AF78] sm:hover:text-[#E5C18A] cursor-pointer"
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
              className="font-bold uppercase tracking-[0.1em] truncate text-[#D4AF78]"
              title={product.category}
            >
              {product.category}
            </span>
            <div className="flex items-center gap-1 shrink-0 font-bold text-[#F5EBDD]">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#D4AF78] text-[#D4AF78]" />
              <span>{product.rating ?? '4.9'}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={handleQuickViewClick}
            className={`cursor-pointer font-serif font-bold tracking-tight text-[#F5EBDD] leading-snug transition-colors duration-150 hover:text-[#E5C18A] ${
              isCompact
                ? 'text-xs sm:text-[13px] line-clamp-1 min-h-0'
                : 'text-[12.5px] sm:text-[14px] line-clamp-2 min-h-[2.1rem] sm:min-h-[2.4rem]'
            }`}
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Description */}
          {!isCompact && (
            <p className="text-[10px] sm:text-[11px] leading-relaxed text-[#B8AA96] line-clamp-1">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer: Price on its own row + Streamlined Action Bar */}
      <div className={`pt-1.5 sm:pt-2 border-t border-[rgba(212,175,120,0.25)] px-0.5 ${isCompact ? 'mt-1.5 space-y-1.5' : 'mt-2 space-y-2'}`}>
        {/* Price & Heritage Row */}
        <div className="flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={`font-serif font-extrabold text-[#F5EBDD] tracking-tight whitespace-nowrap ${
              isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            }`}>
              {formattedPrice}
            </span>
            {(product as any).originalPrice && (
              <span className="text-[10px] sm:text-xs text-[#B8AA96]/60 line-through font-medium whitespace-nowrap">
                {typeof (product as any).originalPrice === 'number'
                  ? `${curr}${Number((product as any).originalPrice).toLocaleString('en-IN')}`
                  : String((product as any).originalPrice).startsWith(curr)
                  ? (product as any).originalPrice
                  : `${curr}${(product as any).originalPrice}`}
              </span>
            )}
          </div>

          <span
            className="text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 bg-[#12110F] text-[#D4AF78] border border-[rgba(212,175,120,0.25)]"
          >
            {isCardComingSoon ? 'Coming Soon' : product.department === 'aquarium' ? 'Aquatics' : 'Artisan'}
          </span>
        </div>

        {/* Unified Dual Action Bar: Add to Bag (or Stepper) + 1-Click WhatsApp Companion */}
        <div className="relative">
          {plusPop && (
            <span className="absolute -top-7 right-2 sm:right-4 z-30 pointer-events-none inline-flex items-center gap-1 rounded-full bg-[#D4AF78] text-[#0B0B0A] text-[9px] sm:text-[10px] font-black px-2 py-0.5 shadow-[0_4px_14px_rgba(212,175,120,0.4)] animate-bounce border border-[#E5C18A]">
              ✨ +{activeQuantity > 1 ? activeQuantity : 1} in Bag!
            </span>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isCardComingSoon ? (
              <>
                <button
                  type="button"
                  disabled
                  className={`flex-1 ${
                    isCompact ? 'h-8 sm:h-9 text-[10px] sm:text-[11px]' : 'h-8.5 sm:h-9.5 text-[11px] sm:text-xs'
                  } inline-flex items-center justify-center gap-1.5 rounded-full bg-[#12110F] border border-[rgba(212,175,120,0.25)] px-2 sm:px-3 font-extrabold text-[#D4AF78] shadow-xs select-none cursor-default`}
                  title="Coming Soon to NP Atelier"
                >
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#D4AF78]" />
                  <span className="uppercase tracking-wider text-[10px] sm:text-[11px] font-black">Coming Soon</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppAction}
                  className={`${
                    isCompact ? 'h-8 sm:h-9 px-2 sm:px-2.5' : 'h-8.5 sm:h-9.5 px-2.5 sm:px-3'
                  } rounded-full bg-[#12110F] border border-[rgba(212,175,120,0.30)] text-[#D4AF78] hover:bg-[#191713] hover:border-[#D4AF78] hover:text-[#E5C18A] transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 shrink-0 shadow-xs cursor-pointer group/wa`}
                  title={`Inquire about ${product.title} on WhatsApp (${contactPhone})`}
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#D4AF78] fill-[#D4AF78]/20 group-hover/wa:scale-110 transition-transform shrink-0" />
                  <span className="text-[9.5px] sm:text-[10.5px] font-bold tracking-tight">Inquire</span>
                </button>
              </>
            ) : activeQuantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`flex-1 ${
                  isCompact ? 'h-8 sm:h-9' : 'h-8.5 sm:h-9.5'
                } flex items-center justify-between rounded-full bg-[#0B0B0A] border border-[#D4AF78] p-0.5 shadow-[0_4px_14px_rgba(212,175,120,0.2)] select-none transition-all duration-200`}
              >
                {/* Minus Button */}
                <button
                  type="button"
                  aria-label={`Decrease ${product.title} quantity`}
                  onClick={handleDecrement}
                  className="grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-[#191713] text-[#D4AF78] hover:bg-[#25221B] hover:text-[#F5EBDD] transition duration-150 active:scale-85 cursor-pointer shrink-0 border border-[rgba(212,175,120,0.25)] shadow-xs"
                  title="Decrease (-1)"
                >
                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />
                </button>

                {/* Center Quantity */}
                <div className="flex items-center gap-1 px-1 justify-center flex-1 min-w-0">
                  <span className="inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-full bg-[#D4AF78] text-[#0B0B0A] text-[10px] sm:text-[11px] font-black font-mono shadow-xs">
                    +{activeQuantity}
                  </span>
                  <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#B8AA96] uppercase tracking-wider truncate hidden xs:inline">
                    Bag
                  </span>
                </div>

                {/* Plus Button */}
                <button
                  type="button"
                  aria-label={`Increase ${product.title} quantity`}
                  onClick={handleIncrement}
                  className="grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-[#D4AF78] text-[#0B0B0A] hover:bg-[#E5C18A] transition duration-150 active:scale-85 cursor-pointer shadow-xs shrink-0"
                  title="Add (+1)"
                >
                  <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className={`group/btn flex-1 ${
                  isCompact ? 'h-8 sm:h-9 text-[10px] sm:text-[11px]' : 'h-8.5 sm:h-9.5 text-[11px] sm:text-xs'
                } inline-flex items-center justify-center gap-1.5 rounded-full bg-[#D4AF78] hover:bg-[#E5C18A] border border-[#E5C18A]/50 px-2 sm:px-3 font-bold text-[#0B0B0A] transition-all duration-200 active:scale-[0.98] shadow-xs cursor-pointer min-w-0`}
                title={`Add ${product.title} to Bag`}
              >
                <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0B0B0A] transition-transform duration-200 group-hover/btn:scale-110 shrink-0" />
                <span className="truncate">Add to Bag</span>
              </button>
            )}

            {/* WhatsApp Companion Button */}
            {!isCardComingSoon && (
              <button
                type="button"
                onClick={handleWhatsAppAction}
                className={`${
                  isCompact ? 'h-8 sm:h-9 px-2 sm:px-2.5' : 'h-8.5 sm:h-9.5 px-2.5 sm:px-3'
                } rounded-full bg-[#12110F] border border-[rgba(212,175,120,0.30)] text-[#D4AF78] hover:bg-[#191713] hover:border-[#D4AF78] hover:text-[#E5C18A] transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 shrink-0 shadow-xs cursor-pointer group/wa`}
                title={`Order ${product.title} on WhatsApp (${contactPhone})`}
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#D4AF78] fill-[#D4AF78]/20 group-hover/wa:scale-110 transition-transform shrink-0" />
                <span className="text-[9.5px] sm:text-[10.5px] font-bold tracking-tight">WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)

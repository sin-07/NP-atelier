"use client"

import { useState } from 'react'
import { Eye, Heart, MessageCircle, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { Product } from '../data/products'
import { useMarketplace } from '../context/MarketplaceContext'

export interface ProductCardProps {
  product: Product | any
  isWishlisted?: boolean
  onWishlistToggle?: () => void
  onQuickView?: () => void
  onAddToCart?: (product: any, quantity?: number) => void
  onBuyNow?: (product: any) => void
  className?: string
}

export default function ProductCard({
  product,
  isWishlisted = false,
  onWishlistToggle,
  onQuickView,
  onAddToCart,
  onBuyNow,
  className = '',
}: ProductCardProps) {
  const { cart, addToCart, setCartQuantity, removeFromCart } = useMarketplace()
  const [plusPop, setPlusPop] = useState(false)

  // Find item quantity in active shopping bag
  const cartItem = cart?.find(
    (item: any) =>
      (String(item.cartItemId) === String(product.id) || String(item.productId) === String(product.id)) &&
      !item.customization
  )
  const cartQuantity = cartItem ? cartItem.quantity : 0

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPlusPop(true)
    setTimeout(() => setPlusPop(false), 700)
    if (onAddToCart) {
      onAddToCart(product, 1)
    } else {
      addToCart(product, 1)
    }
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPlusPop(true)
    setTimeout(() => setPlusPop(false), 700)
    setCartQuantity(product.id, cartQuantity + 1)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (cartQuantity <= 1) {
      removeFromCart(product.id)
    } else {
      setCartQuantity(product.id, cartQuantity - 1)
    }
  }

  const rawPriceStr = product.price != null ? String(product.price).trim() : '999'
  const numericVal = parseFloat(rawPriceStr.replace(/[^0-9.]/g, ''))
  const formattedPrice = !isNaN(numericVal)
    ? `₹${numericVal.toLocaleString('en-IN')}`
    : rawPriceStr.startsWith('₹')
    ? rawPriceStr
    : `₹${rawPriceStr}`

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[1.4rem] sm:rounded-[2rem] border border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5E8] to-[#F7ECCF]/80 p-2.5 sm:p-4 shadow-[0_4px_16px_rgba(184,134,11,0.06)] sm:shadow-[0_8px_24px_rgba(184,134,11,0.08)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_14px_32px_rgba(184,134,11,0.18)] ${className}`}
    >
      <div>
        {/* Image Container with Floating Action Pills */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.2rem] sm:rounded-[1.6rem] bg-[#F7F2E6] border border-[#E8DEC7]">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = fallbackCraftImage
            }}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute left-2 sm:left-3 top-2 sm:top-3 flex flex-col items-start gap-1">
            {(product.badges || ['Handmade']).slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[#D4AF37]/50 bg-white/95 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[#694806] shadow-xs"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Active Bag Quantity Pill on Image */}
          {cartQuantity > 0 && (
            <div className="absolute left-2 sm:left-3 bottom-2 sm:bottom-3 z-10 flex items-center gap-1.5 rounded-full bg-[#120F0A]/95 border border-[#D4AF37] px-2.5 py-1 text-[10px] sm:text-[11px] font-black text-[#ECC872] shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{cartQuantity} in Bag</span>
            </div>
          )}

          {/* Floating Actions (Wishlist, Quick View & WhatsApp) */}
          <div className="absolute right-2 sm:right-3 top-2 sm:top-3 flex flex-col gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-pressed={isWishlisted}
              aria-label={`Save ${product.title} to wishlist`}
              onClick={(e) => {
                e.stopPropagation()
                onWishlistToggle?.()
              }}
              className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full border border-[#D4AF37]/50 bg-white/95 text-[#3D2C0A] shadow-xs transition duration-150 active:scale-90 hover:scale-105 hover:border-rose-500/50 hover:bg-rose-50 hover:text-rose-500 cursor-pointer"
            >
              <Heart
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition ${
                  isWishlisted ? 'fill-rose-500 text-rose-500 scale-105' : 'text-[#3D2C0A]'
                }`}
              />
            </button>
            <button
              type="button"
              aria-label={`Quick view ${product.title}`}
              onClick={(e) => {
                e.stopPropagation()
                onQuickView?.()
              }}
              className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full border border-[#D4AF37]/50 bg-white/95 text-[#3D2C0A] shadow-xs transition duration-150 active:scale-90 hover:scale-105 hover:border-[#D4AF37] hover:bg-white cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <a
              href={`https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20want%20to%20order%3A%20${encodeURIComponent(
                product.title
              )}%20%E2%80%94%20please%20confirm%20availability!`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full border border-[#D4AF37]/50 bg-white/95 text-[#25D366] shadow-xs transition duration-150 active:scale-90 hover:scale-105 hover:border-[#25D366] hover:bg-[#F0FDF4] cursor-pointer"
              title="Inquire or order via WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#25D366]" />
            </a>
          </div>

          {/* Desktop Quick Add Overlay on Hover */}
          <div className="hidden sm:block absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 z-10">
            <button
              type="button"
              onClick={cartQuantity > 0 ? handleIncrement : handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#14100A] border border-[#D4AF37]/70 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition hover:bg-[#251D0B] hover:border-[#D4AF37] cursor-pointer"
            >
              {cartQuantity > 0 ? (
                <>
                  <Plus className="h-3.5 w-3.5 stroke-[2.8] text-[#ECC872]" />
                  <span>Add Another (+1)</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5 stroke-[2.2] text-[#ECC872]" />
                  <span>Quick Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-2.5 sm:mt-3.5 px-0.5 sm:px-1">
          <div className="flex items-center justify-between gap-1">
            <span
              className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.14em] truncate ${
                product.department === 'aquarium' ? 'text-teal-800' : 'text-[#7A5408]'
              }`}
            >
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="h-3 w-3 fill-[#D4AF37] text-[#B8860B]" />
              <span className="text-[10px] sm:text-xs font-bold text-[#141414]">{product.rating ?? '4.9'}</span>
            </div>
          </div>

          <h3
            onClick={() => onQuickView?.()}
            className="mt-1 cursor-pointer font-serif text-sm sm:text-base font-bold tracking-tight text-[#141414] line-clamp-2 min-h-[2.4rem] sm:min-h-[2.8rem] leading-snug transition-colors duration-200 hover:text-[#7A5408]"
            title={product.title}
          >
            {product.title}
          </h3>

          <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-[#524B40] line-clamp-1 sm:line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer: Price clearly visible on its own row + Full-width Order Option */}
      <div className="mt-3 sm:mt-4 border-t border-[#E8DEC7] px-0.5 sm:px-1 pt-2.5 sm:pt-3 flex flex-col gap-2">
        {/* Price & Department row - Never clipped, completely visible */}
        <div className="flex items-baseline justify-between gap-1.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg lg:text-xl font-extrabold text-[#141414] tracking-tight whitespace-nowrap">
              {formattedPrice}
            </span>
            {(product as any).originalPrice && (
              <span className="text-[10px] sm:text-xs text-[#8C827A] line-through font-medium whitespace-nowrap">
                {typeof (product as any).originalPrice === 'number'
                  ? `₹${Number((product as any).originalPrice).toLocaleString('en-IN')}`
                  : String((product as any).originalPrice).startsWith('₹')
                  ? (product as any).originalPrice
                  : `₹${(product as any).originalPrice}`}
              </span>
            )}
          </div>
          <span
            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
              product.department === 'aquarium'
                ? 'bg-teal-50 text-teal-800 border border-teal-200/70'
                : 'bg-[#FAF4E2] text-[#7A5408] border border-[#D4AF37]/35'
            }`}
          >
            {product.department === 'aquarium' ? 'Aquatics' : 'Artisan'}
          </span>
        </div>

        {/* Full-width Order Option: Stepper when in bag (+1, +2, etc.), Add to Bag button when 0 */}
        <div className="relative w-full">
          {plusPop && (
            <span className="absolute -top-3.5 right-6 z-20 pointer-events-none inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#ECC872] text-[#120F0A] text-[10px] font-black px-2 py-0.5 shadow-md animate-bounce">
              +1
            </span>
          )}

          {cartQuantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex w-full items-center justify-between rounded-full bg-gradient-to-r from-[#171410] via-[#221C14] to-[#171410] border border-[#D4AF37] p-1 shadow-[0_4px_16px_rgba(212,175,55,0.20)] select-none"
            >
              <button
                type="button"
                aria-label={`Decrease ${product.title} quantity`}
                onClick={handleDecrement}
                className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-[#282115] text-[#ECC872] hover:bg-[#3D3220] hover:text-white transition duration-150 active:scale-90 cursor-pointer shrink-0"
                title="Decrease quantity"
              >
                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
              </button>

              <div className="flex items-center gap-1 sm:gap-1.5 px-1 justify-center flex-1">
                <span className="text-xs sm:text-sm font-black text-[#FCE6A8] font-mono tracking-tight">
                  {cartQuantity}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#C8B896] uppercase tracking-wider">
                  in Bag
                </span>
              </div>

              <button
                type="button"
                aria-label={`Increase ${product.title} quantity`}
                onClick={handleIncrement}
                className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-gradient-to-tr from-[#B8860B] to-[#D4AF37] text-[#141008] hover:brightness-110 transition duration-150 active:scale-90 cursor-pointer shadow-xs shrink-0"
                title="Add one more (+1)"
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="group/btn w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#14120E] border border-[#D4AF37]/70 py-2 sm:py-2.5 px-3 text-xs font-bold text-white transition-all duration-200 hover:bg-[#251D0B] hover:border-[#D4AF37] hover:shadow-[0_4px_16px_rgba(20,18,14,0.25)] active:scale-[0.98] shadow-xs whitespace-nowrap cursor-pointer"
              title={`Order ${product.title} - Add to Bag`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#ECC872] transition-transform duration-200 group-hover/btn:scale-110 shrink-0" />
              <span className="font-bold text-white tracking-wide">Add to Bag</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

"use client"

import { Eye, Heart, MessageCircle, ShoppingBag, Star } from 'lucide-react'
import { fallbackCraftImage } from '../utils/fallbackImage'
import { Product } from '../data/products'

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
          <div className="hidden sm:block absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onAddToCart?.(product, 1)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#14100A] border border-[#D4AF37]/60 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition hover:bg-[#251D0B] hover:border-[#D4AF37] cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5 stroke-[2.2] text-[#ECC872]" />
              Quick Add to Bag
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

        {/* Full-width Order Option Button - Fully visible & easy for users to tap */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart?.(product, 1)
          }}
          className="group/btn w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#14120E] border border-[#D4AF37]/70 py-2 sm:py-2.5 px-3 text-xs font-bold text-white transition-all duration-200 hover:bg-[#251D0B] hover:border-[#D4AF37] hover:shadow-[0_4px_16px_rgba(20,18,14,0.25)] active:scale-[0.98] shadow-xs whitespace-nowrap cursor-pointer"
          title={`Order ${product.title} - Add to Bag`}
        >
          <ShoppingBag className="h-3.5 w-3.5 text-[#ECC872] transition-transform duration-200 group-hover/btn:scale-110 shrink-0" />
          <span className="font-bold text-white tracking-wide">Add to Bag</span>
        </button>
      </div>
    </article>
  )
}

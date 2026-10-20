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
  const formattedPrice = product.price
    ? String(product.price).replace(/^[?,]/, '₹')
    : '₹999'

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5E8] to-[#F7ECCF]/80 p-4 shadow-[0_8px_24px_rgba(184,134,11,0.08)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_14px_32px_rgba(184,134,11,0.18)] ${className}`}
    >
      <div>
        {/* Image Container with Floating Action Pills */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] bg-[#F7F2E6] border border-[#E8DEC7]">
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
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {(product.badges || ['Handmade']).slice(0, 2).map((badge, idx) => (
              <span
                key={badge}
                className="rounded-full border border-[#D4AF37]/50 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#694806] shadow-xs"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Floating Actions (Wishlist & Quick View) */}
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              type="button"
              aria-pressed={isWishlisted}
              aria-label={`Save ${product.title} to wishlist`}
              onClick={(e) => {
                e.stopPropagation()
                onWishlistToggle?.()
              }}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#D4AF37]/50 bg-white/95 text-[#3D2C0A] shadow-xs transition duration-150 hover:scale-105 hover:border-rose-500/50 hover:bg-rose-50 hover:text-rose-500"
            >
              <Heart
                className={`h-4 w-4 transition ${
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
              className="grid h-9 w-9 place-items-center rounded-full border border-[#D4AF37]/50 bg-white/95 text-[#3D2C0A] shadow-xs transition duration-150 hover:scale-105 hover:border-[#D4AF37] hover:bg-white"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Add Overlay on Hover */}
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onAddToCart?.(product, 1)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#141414] border border-[#D4AF37]/60 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition hover:bg-[#251D0B] hover:border-[#D4AF37]"
            >
              <ShoppingBag className="h-3.5 w-3.5 stroke-[2.2] text-[#ECC872]" />
              Quick Add to Bag
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-3.5 px-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                product.department === 'aquarium' ? 'text-teal-800' : 'text-[#7A5408]'
              }`}
            >
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#B8860B]" />
              <span className="text-xs font-bold text-[#141414]">{product.rating ?? '4.9'}</span>
              <span className="text-[10px] text-[#6B6357]">({product.reviews ?? 48})</span>
            </div>
          </div>

          <h3
            onClick={() => onQuickView?.()}
            className="mt-1.5 cursor-pointer truncate font-serif text-lg sm:text-xl font-bold tracking-tight text-[#141414] transition-colors duration-200 hover:text-[#7A5408]"
            title={product.title}
          >
            {product.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#524B40]">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="mt-4 border-t border-[#E8DEC7] px-1 pt-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-[10px] font-bold block uppercase tracking-wider ${
                product.department === 'aquarium' ? 'text-teal-800' : 'text-[#756C5E]'
              }`}
            >
              {product.department === 'aquarium' ? 'Aquatics Direct' : 'Artisan Direct'}
            </span>
            <p className="text-xl font-extrabold text-[#141414] tracking-tight">
              {formattedPrice}
            </p>
          </div>

          <div className="flex gap-1.5">
            <a
              href={`https://wa.me/919341297124?text=Hi%20NP%20Atelier%2C%20I%20want%20to%20order%3A%20${encodeURIComponent(
                product.title
              )}%20%E2%80%94%20please%20confirm%20availability!`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#141414] border border-[#D4AF37]/50 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#251D0B] hover:border-[#D4AF37] hover:shadow-[0_0_14px_rgba(212,175,55,0.3)] active:scale-95 flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="h-3.5 w-3.5 stroke-[2.2] text-[#ECC872]" /> Order Now
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

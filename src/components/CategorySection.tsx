"use client"

import ProductCard from './ProductCard'

interface CategorySectionProps {
  category: any
  products: any[]
  wishlistedIds: Set<any> | any
  onWishlistToggle: (id: any) => void
  onQuickView: (product: any) => void
}

function CategorySection({
  category,
  products,
  wishlistedIds,
  onWishlistToggle,
  onQuickView,
}: CategorySectionProps) {
  return (
    <section className="soft-card overflow-hidden p-5 sm:p-6 lg:p-8">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <span className="section-eyebrow">{category.badge}</span>
          <h3 className="text-3xl sm:text-4xl">{category.title}</h3>
          <p className="max-w-xl text-base leading-7 text-cocoa/70 sm:text-lg">{category.description}</p>
          <div className="inline-flex rounded-full border border-white/[0.06] bg-white/75 px-4 py-2 text-sm font-semibold text-cocoa shadow-soft">
            Curated for a premium handmade mood
          </div>
        </div>

        <div className={`rounded-[1.75rem] bg-gradient-to-br ${category.accent} p-3 sm:p-4`}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistedIds.has(product.id)}
                onWishlistToggle={() => onWishlistToggle(product.id)}
                onQuickView={() => onQuickView(product)}
                onAddToCart={category.onAddToCart}
                onBuyNow={category.onBuyNow}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategorySection

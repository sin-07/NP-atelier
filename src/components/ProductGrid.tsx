import { categories } from '../data/products'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import ProductCard from './ProductCard'

function ProductGrid({ products }: { products: any[] }) {
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section id="collection" ref={ref} className={`section-shell py-16 sm:py-20 ${isVisible ? 'is-visible' : ''}`}>
      <div className="reveal is-visible space-y-8">
        <div className="flex flex-col gap-4 text-center">
          <span className="section-eyebrow">Trending Collection</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#141414]">Get the <span className="text-gold-gradient">Trending</span> Pieces This Season</h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#5A554E] sm:text-lg">
            A gentle mix of handmade essentials, soft textures, and one-of-a-kind accents for your next thoughtful gift or home refresh.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-[#DFCFA6]/70 bg-gradient-to-b from-[#FFFDF9] to-[#FAF6ED] px-4 py-2 text-sm font-semibold text-[#5A451A] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FAF4E5] hover:border-[#D4AF37] hover:text-[#875A10] cursor-pointer"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid

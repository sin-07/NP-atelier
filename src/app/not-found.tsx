import Link from 'next/link'
import { ArrowLeft, Compass, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1A1A1A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Golden halo background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-[#D4AF37]/40 p-8 sm:p-10 shadow-[0_20px_50px_rgba(180,135,45,0.15)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#996515] text-[#1A120B] shadow-[0_4px_16px_rgba(212,175,55,0.35)] border border-[#F2D785]">
          <Compass className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
            404 • EXHIBITION NOT FOUND
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141414]">
            Lost in the <span className="text-gold-gradient">Gallery</span>?
          </h1>
          <p className="text-sm leading-relaxed text-[#6E6860]">
            The piece or page you are looking for has moved or does not exist. Explore our active artisan collections and custom studios below.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="btn-gold w-full justify-center py-3.5 px-6 text-sm font-bold tracking-wide shadow-[0_6px_20px_rgba(212,175,55,0.3)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Atelier Gallery
          </Link>
          <Link
            href="/#collection"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF7F0] text-[#5A451A] py-3.5 px-6 text-sm font-bold tracking-wide hover:bg-[#FAF2DE] hover:border-[#D4AF37] hover:text-[#875A10] transition-colors border border-[#DFCFA6]/80"
          >
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            Browse Artisan Drops
          </Link>
        </div>
      </div>
    </div>
  )
}

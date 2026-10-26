import Link from 'next/link'
import { ArrowLeft, Compass, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#F5EBDD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Golden halo background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF78]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#151412] rounded-3xl border border-[#6D5738]/40 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#E5C18A] to-[#D4AF78] text-[#0B0B0A] shadow-[0_4px_16px_rgba(212,175,120,0.35)] border border-[#F5EBDD]/50">
          <Compass className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF78]">
            404 • EXHIBITION NOT FOUND
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5EBDD]">
            Lost in the <span className="text-gold-gradient">Gallery</span>?
          </h1>
          <p className="text-sm leading-relaxed text-[#B8A68B]">
            The piece or page you are looking for has moved or does not exist. Explore our active artisan collections below.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="btn-gold w-full justify-center py-3.5 px-6 text-sm font-bold tracking-wide shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Atelier Gallery
          </Link>
          <Link
            href="/#collection"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#151412] text-[#F5EBDD] py-3.5 px-6 text-sm font-bold tracking-wide hover:bg-[#1E1D19] hover:border-[#D4AF78] hover:text-[#E5C18A] transition-colors border border-[#6D5738]/50"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF78]" />
            Browse Artisan Drops
          </Link>
        </div>
      </div>
    </div>
  )
}

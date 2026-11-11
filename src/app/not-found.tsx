import Link from 'next/link'
import { ArrowLeft, Compass, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#141210] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Golden halo background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF78]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#FCF9F4] rounded-3xl border border-[#6D5738]/25 p-8 sm:p-10 shadow-[0_20px_50px_rgba(68,52,32,0.12)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#E5C18A] to-[#D4AF78] text-[#141210] shadow-[0_4px_16px_rgba(182,141,82,0.28)] border border-[#B68D52]/40">
          <Compass className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7A5B32]">
            404 • EXHIBITION NOT FOUND
          </span>
          <h1 className="text-3xl sm:text-4xl font-tagline font-bold text-[#141210]">
            Lost in the <span className="text-gold-gradient">Gallery</span>?
          </h1>
          <p className="text-sm leading-relaxed text-[#5C4D3C]">
            The piece or page you are looking for has moved or does not exist. Explore our active artisan collections below.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="btn-gold w-full justify-center py-3.5 px-6 text-sm font-bold tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Atelier Gallery
          </Link>
          <Link
            href="/#collection"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#EFE8DC] text-[#141210] py-3.5 px-6 text-sm font-bold tracking-wide hover:bg-[#E5DCCD] hover:border-[#B68D52] transition-colors border border-[#6D5738]/30"
          >
            <Sparkles className="w-4 h-4 text-[#7A5B32]" />
            Browse Artisan Drops
          </Link>
        </div>
      </div>
    </div>
  )
}

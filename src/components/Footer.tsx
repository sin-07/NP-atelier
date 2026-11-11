"use client"

import { FacebookIcon, InstagramIcon, PinterestIcon } from './Icons'
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Fish,
  Sparkles,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { useGsapReveal } from '../hooks/useGsapReveal'
import { BrandTitle } from './BrandTypography'

export default function Footer() {
  const { branding, setActiveDepartment } = useMarketplace()
  const { containerRef } = useGsapReveal({
    selector: '.gsap-footer-item',
    stagger: 0.035,
    yOffset: 12,
    duration: 0.35,
  })

  const siteName = branding?.siteName || 'NP Atelier'
  const tagline = branding?.tagline || 'Where luxury handmade craftsmanship meets exotic aquatic splendor.'
  const email = branding?.contactEmail || 'npatelierindia@gmail.com'
  const phone = branding?.contactPhone || '+91 93412 97124'

  return (
    <footer id="contact" ref={containerRef} className="mt-20 bg-gradient-to-b from-[#F2ECE2] via-[#EFE7DA] to-[#EAE0D1] text-[#141210] pt-20 pb-12 border-t border-[#6D5738]/20 relative overflow-hidden">
      {/* Subtle top gold halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#D4AF78]/15 to-transparent blur-2xl pointer-events-none" />

      <div className="section-shell relative z-10">
        {/* Tilted Polaroid Gallery Showcase featuring both Crafts and Aquatics */}
        <div className="gsap-footer-item flex justify-center items-center pb-12">
          <div className="relative flex items-center justify-center -space-x-4">
            {/* Left Polaroid - Craft */}
            <div className="group relative -rotate-6 transition-transform duration-200 ease-out hover:rotate-0 hover:scale-105 hover:z-20">
              <div className="rounded-lg bg-gradient-to-b from-white to-[#FDFBF7] p-2 pb-5 shadow-[0_14px_30px_rgba(68,52,32,0.14)] border border-[#B68D52]/35 group-hover:border-[#B68D52] group-hover:shadow-[0_12px_30px_rgba(182,141,82,0.28)] transition-all w-24 sm:w-28">
                <div className="aspect-square w-full overflow-hidden rounded bg-[#EFE8DC] ring-1 ring-[#6D5738]/15">
                  <img
                    src="/products/atelier-evil-eye-pendant.jpg"
                    alt="Art talisman"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[9px] font-bold text-[#141210]">Artisan Jewelry</p>
              </div>
            </div>

            {/* Center Polaroid - Exotic Fish */}
            <div className="group relative z-10 rotate-0 transition-transform duration-200 ease-out hover:scale-105 hover:z-20">
              <div className="rounded-lg bg-gradient-to-b from-white to-[#FDFBF7] p-2 pb-5 shadow-[0_16px_32px_rgba(68,52,32,0.18)] border border-[#B68D52]/55 group-hover:border-[#B68D52] group-hover:shadow-[0_12px_35px_rgba(182,141,82,0.32)] transition-all w-24 sm:w-28">
                <div className="aspect-square w-full overflow-hidden rounded bg-[#EFE8DC] ring-1 ring-[#6D5738]/20">
                  <img
                    src="/products/royal-discus-aquarium.jpg"
                    alt="Royal Blue Discus"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[9px] font-bold text-[#141210]">Exotic Aquatics</p>
              </div>
            </div>

            {/* Right Polaroid - Plaster Art Kit */}
            <div className="group relative rotate-6 transition-transform duration-200 ease-out hover:rotate-0 hover:scale-105 hover:z-20">
              <div className="rounded-lg bg-gradient-to-b from-white to-[#FDFBF7] p-2 pb-5 shadow-[0_14px_30px_rgba(68,52,32,0.14)] border border-[#B68D52]/35 group-hover:border-[#B68D52] group-hover:shadow-[0_12px_30px_rgba(182,141,82,0.28)] transition-all w-24 sm:w-28">
                <div className="aspect-square w-full overflow-hidden rounded bg-[#EFE8DC] ring-1 ring-[#6D5738]/15">
                  <img
                    src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=700&q=80"
                    alt="Planted Rimless Aquarium"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[9px] font-bold text-[#141210]">Aquascaping</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Contact Headline */}
        <div className="gsap-footer-item text-center space-y-4 pb-12 border-b border-[#6D5738]/20">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#7A5B32]">
            Private Inquiries &amp; Commissions
          </p>
          <a
            href={`mailto:${email}`}
            className="block text-xl sm:text-4xl lg:text-5xl font-tagline font-semibold tracking-tight text-[#141210] hover:text-[#7A5B32] transition-colors break-all sm:break-normal"
          >
            {email}
          </a>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(siteName)}%2C%20I%20want%20to%20place%20an%20order!`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600/50 bg-emerald-600 px-5 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-emerald-700 hover:border-emerald-500 hover:shadow-[0_6px_18px_rgba(5,150,105,0.25)] transition cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-white" />
              <span>WhatsApp: {phone}</span>
            </a>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#B68D52]/55 bg-[#FCF9F4] px-5 py-2.5 text-sm sm:text-base font-bold text-[#7A5B32] hover:text-[#141210] hover:bg-[#EFE8DC] hover:border-[#B68D52] shadow-xs transition cursor-pointer"
            >
              <Phone className="h-4 w-4 text-[#7A5B32]" />
              <span>Direct Call: {phone}</span>
            </a>
          </div>
        </div>

        {/* Navigation & Details Grid */}
        <div className="gsap-footer-item pt-10 grid gap-10 md:grid-cols-3 items-center text-center md:text-left">
          {/* Brand Note */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              {branding?.logoImageUrl && (branding.logoType === 'image' || branding.logoType === 'both') ? (
                <div className="h-10 w-10 rounded-full overflow-hidden border border-[#B68D52]/50 bg-[#EDE4DD] shadow-sm shrink-0">
                  <img
                    src={branding.logoImageUrl}
                    alt={siteName}
                    className="h-full w-full object-cover scale-[1.06]"
                  />
                </div>
              ) : (
                <span className="h-2 w-2 rounded-full bg-[#B68D52] shadow-[0_0_8px_rgba(182,141,82,0.5)]" />
              )}
              <BrandTitle
                siteName={siteName}
                showNpMark={true}
                svgClassName="h-6 sm:h-7 w-auto"
                atelierClassName="text-[1.85rem] sm:text-[2.1rem] leading-none text-[#141210]"
                fallbackClassName="font-tagline text-2xl font-bold text-[#141210] tracking-tight"
              />
            </div>
            <p className="font-tagline italic text-[14px] font-medium text-[#5C4D3C] leading-relaxed max-w-xs mx-auto md:mx-0">
              {tagline}
            </p>
          </div>

          {/* Minimal Links Row */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-[0.2em] text-[#5C4D3C]">
            <a href="#home" className="hover:text-[#7A5B32] transition-colors">Home</a>
            <a
              href="#collection"
              onClick={() => setActiveDepartment?.('crafts')}
              className="hover:text-[#7A5B32] transition-colors"
            >
              Artisan Crafts
            </a>
            <a
              href="#acquario-tropicale"
              onClick={() => setActiveDepartment?.('aquarium')}
              className="hover:text-teal-600 transition-colors text-teal-700 font-tagline"
            >
              Acquario Tropicale
            </a>
            <a href="#makers" className="hover:text-[#7A5B32] transition-colors">Makers</a>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#6D5738]/25 bg-[#FCF9F4] text-[#5C4D3C] transition duration-200 hover:border-[#B68D52] hover:bg-[#D4AF78] hover:text-[#141210] hover:shadow-[0_6px_16px_rgba(182,141,82,0.25)]"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#6D5738]/25 bg-[#FCF9F4] text-[#5C4D3C] transition duration-200 hover:border-[#B68D52] hover:bg-[#D4AF78] hover:text-[#141210] hover:shadow-[0_6px_16px_rgba(182,141,82,0.25)]"
            >
              <PinterestIcon className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#6D5738]/25 bg-[#FCF9F4] text-[#5C4D3C] transition duration-200 hover:border-[#B68D52] hover:bg-[#D4AF78] hover:text-[#141210] hover:shadow-[0_6px_16px_rgba(182,141,82,0.25)]"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Legal & Credits Bottom Bar */}
        <div className="gsap-footer-item mt-12 pt-6 border-t border-[#6D5738]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5C4D3C] gap-4">
          <p>© {new Date().getFullYear()} {siteName}. All handcrafted items and aquatic specimens protected by guarantee.</p>
          <div className="flex items-center gap-4">
            <span className="text-teal-700 font-semibold">● Live Fish Safe Arrival Guaranteed</span>
            <span>•</span>
            <span className="text-[#7A5B32] font-semibold">100% Certified Artisans</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

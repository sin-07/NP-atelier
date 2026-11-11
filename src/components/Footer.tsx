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
import { getWorldContactEmail } from '../utils/worldTheme'

export default function Footer() {
  const { branding, setActiveDepartment, isAquaticTheme } = useMarketplace()
  const { containerRef } = useGsapReveal({
    selector: '.gsap-footer-item',
    stagger: 0.035,
    yOffset: 12,
    duration: 0.35,
  })

  const siteName = branding?.siteName || 'NP Atelier'
  const displaySiteName = isAquaticTheme ? 'Acquario Tropicale' : siteName
  const tagline = branding?.tagline || 'Where luxury handmade craftsmanship meets exotic aquatic splendor.'
  const email = getWorldContactEmail(isAquaticTheme, branding?.contactEmail)
  const phone = branding?.contactPhone || '+91 93412 97124'

  return (
    <footer
      id="contact"
      ref={containerRef}
      className={`mt-20 pt-20 pb-12 border-t relative overflow-hidden transition-colors duration-300 ${
        isAquaticTheme
          ? 'bg-gradient-to-b from-[#061828] via-[#05121E] to-[#030B14] text-[#F0F8FF] border-sky-400/25'
          : 'bg-gradient-to-b from-[#F2ECE2] via-[#EFE7DA] to-[#EAE0D1] text-[#141210] border-[#6D5738]/20'
      }`}
    >
      {/* Subtle top glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 blur-2xl pointer-events-none ${
          isAquaticTheme
            ? 'bg-gradient-to-r from-[#38BDF8]/20 via-[#10B981]/20 to-[#E11D48]/20'
            : 'bg-gradient-to-b from-[#D4AF78]/15 to-transparent'
        }`}
      />

      <div className="section-shell relative z-10">
        {/* Tilted Polaroid Gallery Showcase featuring both Crafts and Aquatics */}
        <div className="gsap-footer-item flex justify-center items-center pb-12">
          <div className="relative flex items-center justify-center -space-x-4">
            {/* Left Polaroid - Craft */}
            <div className="group relative -rotate-6 transition-transform duration-200 ease-out hover:rotate-0 hover:scale-105 hover:z-20">
              <div
                className={`rounded-lg p-2 pb-5 border transition-all w-24 sm:w-28 ${
                  isAquaticTheme
                    ? 'bg-gradient-to-b from-[#0D2E4A] to-[#081D30] border-sky-400/35 shadow-[0_14px_30px_rgba(2,12,24,0.65)] group-hover:border-emerald-400'
                    : 'bg-gradient-to-b from-white to-[#FDFBF7] border-[#B68D52]/35 shadow-[0_14px_30px_rgba(68,52,32,0.14)] group-hover:border-[#B68D52] group-hover:shadow-[0_12px_30px_rgba(182,141,82,0.28)]'
                }`}
              >
                <div
                  className={`aspect-square w-full overflow-hidden rounded ring-1 ${
                    isAquaticTheme ? 'bg-[#051524] ring-sky-400/20' : 'bg-[#EFE8DC] ring-[#6D5738]/15'
                  }`}
                >
                  <img
                    src="/products/atelier-evil-eye-pendant.jpg"
                    alt="Art talisman"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p
                  className={`mt-1.5 text-center text-[9px] font-bold ${
                    isAquaticTheme ? 'text-[#F0F8FF]' : 'text-[#141210]'
                  }`}
                >
                  Artisan Jewelry
                </p>
              </div>
            </div>

            {/* Center Polaroid - Exotic Fish */}
            <div className="group relative z-10 rotate-0 transition-transform duration-200 ease-out hover:scale-105 hover:z-20">
              <div
                className={`rounded-lg p-2 pb-5 border transition-all w-24 sm:w-28 ${
                  isAquaticTheme
                    ? 'bg-gradient-to-b from-[#0F3554] to-[#092136] border-rose-400/60 shadow-[0_16px_32px_rgba(2,12,24,0.75)] group-hover:border-rose-400'
                    : 'bg-gradient-to-b from-white to-[#FDFBF7] border-[#B68D52]/55 shadow-[0_16px_32px_rgba(68,52,32,0.18)] group-hover:border-[#B68D52] group-hover:shadow-[0_12px_35px_rgba(182,141,82,0.32)]'
                }`}
              >
                <div
                  className={`aspect-square w-full overflow-hidden rounded ring-1 ${
                    isAquaticTheme ? 'bg-[#051524] ring-emerald-400/30' : 'bg-[#EFE8DC] ring-[#6D5738]/20'
                  }`}
                >
                  <img
                    src="/products/royal-discus-aquarium.jpg"
                    alt="Royal Blue Discus"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p
                  className={`mt-1.5 text-center text-[9px] font-bold ${
                    isAquaticTheme ? 'text-emerald-300' : 'text-[#141210]'
                  }`}
                >
                  Exotic Aquatics
                </p>
              </div>
            </div>

            {/* Right Polaroid - Plaster Art Kit */}
            <div className="group relative rotate-6 transition-transform duration-200 ease-out hover:rotate-0 hover:scale-105 hover:z-20">
              <div
                className={`rounded-lg p-2 pb-5 border transition-all w-24 sm:w-28 ${
                  isAquaticTheme
                    ? 'bg-gradient-to-b from-[#0D2E4A] to-[#081D30] border-emerald-400/35 shadow-[0_14px_30px_rgba(2,12,24,0.65)] group-hover:border-emerald-400'
                    : 'bg-gradient-to-b from-white to-[#FDFBF7] border-[#B68D52]/35 shadow-[0_14px_30px_rgba(68,52,32,0.14)] group-hover:border-[#B68D52] group-hover:shadow-[0_12px_30px_rgba(182,141,82,0.28)]'
                }`}
              >
                <div
                  className={`aspect-square w-full overflow-hidden rounded ring-1 ${
                    isAquaticTheme ? 'bg-[#051524] ring-sky-400/20' : 'bg-[#EFE8DC] ring-[#6D5738]/15'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=700&q=80"
                    alt="Planted Rimless Aquarium"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p
                  className={`mt-1.5 text-center text-[9px] font-bold ${
                    isAquaticTheme ? 'text-[#F0F8FF]' : 'text-[#141210]'
                  }`}
                >
                  Aquascaping
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Contact Headline */}
        <div
          className={`gsap-footer-item text-center space-y-4 pb-12 border-b ${
            isAquaticTheme ? 'border-sky-400/20' : 'border-[#6D5738]/20'
          }`}
        >
          <p
            className={`text-[11px] font-bold uppercase tracking-[0.3em] ${
              isAquaticTheme ? 'text-rose-300' : 'text-[#7A5B32]'
            }`}
          >
            Private Inquiries &amp; Commissions
          </p>
          <a
            href={`mailto:${email}`}
            className={`block text-xl sm:text-4xl lg:text-5xl font-tagline font-semibold tracking-tight transition-colors break-all sm:break-normal ${
              isAquaticTheme
                ? 'text-[#F0F8FF] hover:text-emerald-300'
                : 'text-[#141210] hover:text-[#7A5B32]'
            }`}
          >
            {email}
          </a>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(displaySiteName)}%2C%20I%20want%20to%20place%20an%20order!`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-600 px-5 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-emerald-500 hover:border-emerald-400 hover:shadow-[0_6px_18px_rgba(16,185,129,0.35)] transition cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-white" />
              <span>WhatsApp: {phone}</span>
            </a>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm sm:text-base font-bold shadow-xs transition cursor-pointer ${
                isAquaticTheme
                  ? 'border-sky-400/45 bg-[#0A243A] text-sky-200 hover:text-white hover:bg-[#0E3150] hover:border-emerald-400'
                  : 'border-[#B68D52]/55 bg-[#FCF9F4] text-[#7A5B32] hover:text-[#141210] hover:bg-[#EFE8DC] hover:border-[#B68D52]'
              }`}
            >
              <Phone className={`h-4 w-4 ${isAquaticTheme ? 'text-emerald-400' : 'text-[#7A5B32]'}`} />
              <span>Direct Call: {phone}</span>
            </a>
          </div>
        </div>

        {/* Navigation & Details Grid */}
        <div className="gsap-footer-item pt-10 grid gap-10 md:grid-cols-3 items-center text-center md:text-left">
          {/* Brand Note */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              {(isAquaticTheme || (branding?.logoImageUrl && (branding.logoType === 'image' || branding.logoType === 'both'))) ? (
                <div
                  className={`h-10 w-10 rounded-full overflow-hidden border shadow-sm shrink-0 ${
                    isAquaticTheme
                      ? 'border-emerald-400/75 bg-white'
                      : 'border-[#B68D52]/50 bg-[#EDE4DD]'
                  }`}
                >
                  <img
                    src={isAquaticTheme ? '/acquario-tropicale-logo.jpg' : branding.logoImageUrl}
                    alt={isAquaticTheme ? 'Acquario Tropicale' : siteName}
                    className={`h-full w-full object-cover ${isAquaticTheme ? 'scale-[1.28]' : 'scale-[1.06]'}`}
                  />
                </div>
              ) : (
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAquaticTheme
                      ? 'bg-[#F43F5E] shadow-[0_0_8px_rgba(244,63,94,0.65)]'
                      : 'bg-[#B68D52] shadow-[0_0_8px_rgba(182,141,82,0.5)]'
                  }`}
                />
              )}
              <BrandTitle
                siteName={isAquaticTheme ? 'Acquario Tropicale' : siteName}
                showNpMark={true}
                svgClassName={`h-6 sm:h-7 w-auto ${isAquaticTheme ? 'text-[#F0F8FF]' : 'text-[#141210]'}`}
                atelierClassName={`text-[1.85rem] sm:text-[2.1rem] leading-none ${
                  isAquaticTheme ? 'text-[#F0F8FF]' : 'text-[#141210]'
                }`}
                fallbackClassName={`font-tagline text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap ${
                  isAquaticTheme ? 'text-[#F0F8FF]' : 'text-[#141210]'
                }`}
              />
            </div>
            <p
              className={`font-tagline italic text-[14px] font-medium leading-relaxed max-w-xs mx-auto md:mx-0 ${
                isAquaticTheme ? 'text-[#B6D4E8]' : 'text-[#5C4D3C]'
              }`}
            >
              {tagline}
            </p>
          </div>

          {/* Minimal Links Row */}
          <div
            className={`flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-[0.2em] ${
              isAquaticTheme ? 'text-[#B6D4E8]' : 'text-[#5C4D3C]'
            }`}
          >
            <a
              href="#home"
              onClick={() => setActiveDepartment?.('crafts')}
              className={`transition-colors ${isAquaticTheme ? 'hover:text-emerald-300' : 'hover:text-[#7A5B32]'}`}
            >
              Home
            </a>
            <a
              href="#collection"
              onClick={() => setActiveDepartment?.('crafts')}
              className={`transition-colors ${isAquaticTheme ? 'hover:text-emerald-300' : 'hover:text-[#7A5B32]'}`}
            >
              Artisan Crafts
            </a>
            <a
              href="#acquario-tropicale"
              onClick={() => {
                setActiveDepartment?.('aquarium')
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className={`transition-colors font-tagline ${
                isAquaticTheme
                  ? 'text-rose-400 hover:text-rose-300'
                  : 'text-teal-700 hover:text-teal-600'
              }`}
            >
              Acquario Tropicale
            </a>
            <a
              href="#makers"
              onClick={() => setActiveDepartment?.('crafts')}
              className={`transition-colors ${isAquaticTheme ? 'hover:text-emerald-300' : 'hover:text-[#7A5B32]'}`}
            >
              Makers
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={`grid h-10 w-10 place-items-center rounded-full border transition duration-200 ${
                isAquaticTheme
                  ? 'border-sky-400/30 bg-[#0A243A] text-[#B6D4E8] hover:border-rose-400 hover:bg-[#E11D48] hover:text-white hover:shadow-[0_6px_16px_rgba(225,29,72,0.35)]'
                  : 'border-[#6D5738]/25 bg-[#FCF9F4] text-[#5C4D3C] hover:border-[#B68D52] hover:bg-[#D4AF78] hover:text-[#141210] hover:shadow-[0_6px_16px_rgba(182,141,82,0.25)]'
              }`}
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className={`grid h-10 w-10 place-items-center rounded-full border transition duration-200 ${
                isAquaticTheme
                  ? 'border-sky-400/30 bg-[#0A243A] text-[#B6D4E8] hover:border-emerald-400 hover:bg-emerald-600 hover:text-white hover:shadow-[0_6px_16px_rgba(16,185,129,0.35)]'
                  : 'border-[#6D5738]/25 bg-[#FCF9F4] text-[#5C4D3C] hover:border-[#B68D52] hover:bg-[#D4AF78] hover:text-[#141210] hover:shadow-[0_6px_16px_rgba(182,141,82,0.25)]'
              }`}
            >
              <PinterestIcon className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={`grid h-10 w-10 place-items-center rounded-full border transition duration-200 ${
                isAquaticTheme
                  ? 'border-sky-400/30 bg-[#0A243A] text-[#B6D4E8] hover:border-sky-400 hover:bg-sky-500 hover:text-white hover:shadow-[0_6px_16px_rgba(56,189,248,0.35)]'
                  : 'border-[#6D5738]/25 bg-[#FCF9F4] text-[#5C4D3C] hover:border-[#B68D52] hover:bg-[#D4AF78] hover:text-[#141210] hover:shadow-[0_6px_16px_rgba(182,141,82,0.25)]'
              }`}
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Legal & Credits Bottom Bar */}
        <div
          className={`gsap-footer-item mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4 ${
            isAquaticTheme ? 'border-sky-400/20 text-[#84B6D6]' : 'border-[#6D5738]/15 text-[#5C4D3C]'
          }`}
        >
          <p>© {new Date().getFullYear()} {displaySiteName}. All handcrafted items and aquatic specimens protected by guarantee.</p>
          <div className="flex items-center gap-4">
            <span className={`font-semibold ${isAquaticTheme ? 'text-emerald-300' : 'text-teal-700'}`}>
              ● Live Fish Safe Arrival Guaranteed
            </span>
            <span>•</span>
            <span className={`font-semibold ${isAquaticTheme ? 'text-rose-300' : 'text-[#7A5B32]'}`}>
              100% Certified Artisans
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

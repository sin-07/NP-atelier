"use client"

import { FacebookIcon, InstagramIcon, PinterestIcon } from './Icons'
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Fish,
  Sparkles,
} from 'lucide-react'
import { useMarketplace } from '../context/MarketplaceContext'
import { useGsapReveal } from '../hooks/useGsapReveal'

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
    <footer id="contact" ref={containerRef} className="mt-20 bg-gradient-to-b from-[#0E0E0E] via-[#120F09] to-[#0A0805] text-white pt-20 pb-12 border-t border-[#D4AF37]/25 relative overflow-hidden">
      {/* Subtle top gold halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#D4AF37]/10 to-transparent blur-2xl pointer-events-none" />

      <div className="section-shell relative z-10">
        {/* Tilted Polaroid Gallery Showcase featuring both Crafts and Aquatics */}
        <div className="gsap-footer-item flex justify-center items-center pb-12">
          <div className="relative flex items-center justify-center -space-x-4">
            {/* Left Polaroid - Craft */}
            <div className="group relative -rotate-6 transition-transform duration-200 ease-out hover:rotate-0 hover:scale-105 hover:z-20">
              <div className="rounded-lg bg-gradient-to-b from-white to-[#FDFBF7] p-2 pb-5 shadow-2xl border border-[#D4AF37]/40 group-hover:border-[#D4AF37] group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.3)] transition-all w-24 sm:w-28">
                <div className="aspect-square w-full overflow-hidden rounded bg-[#1A1A1A] ring-1 ring-[#D4AF37]/20">
                  <img
                    src="/products/atelier-evil-eye-pendant.jpg"
                    alt="Art talisman"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[9px] font-bold text-[#141414]">Artisan Jewelry</p>
              </div>
            </div>

            {/* Center Polaroid - Exotic Fish */}
            <div className="group relative z-10 rotate-0 transition-transform duration-200 ease-out hover:scale-105 hover:z-20">
              <div className="rounded-lg bg-gradient-to-b from-white to-[#FDFBF7] p-2 pb-5 shadow-2xl border border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:shadow-[0_12px_35px_rgba(212,175,55,0.35)] transition-all w-24 sm:w-28">
                <div className="aspect-square w-full overflow-hidden rounded bg-[#1A1A1A] ring-1 ring-[#D4AF37]/30">
                  <img
                    src="/products/royal-discus-aquarium.jpg"
                    alt="Royal Blue Discus"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[9px] font-bold text-[#141414]">Exotic Aquatics</p>
              </div>
            </div>

            {/* Right Polaroid - Plaster Art Kit */}
            <div className="group relative rotate-6 transition-transform duration-200 ease-out hover:rotate-0 hover:scale-105 hover:z-20">
              <div className="rounded-lg bg-gradient-to-b from-white to-[#FDFBF7] p-2 pb-5 shadow-2xl border border-[#D4AF37]/40 group-hover:border-[#D4AF37] group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.3)] transition-all w-24 sm:w-28">
                <div className="aspect-square w-full overflow-hidden rounded bg-[#1A1A1A] ring-1 ring-[#D4AF37]/20">
                  <img
                    src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=700&q=80"
                    alt="Planted Rimless Aquarium"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-1.5 text-center text-[9px] font-bold text-[#141414]">Aquascaping</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Contact Headline */}
        <div className="gsap-footer-item text-center space-y-3 pb-12 border-b border-[#D4AF37]/20">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            Private Inquiries & Commissions
          </p>
          <a
            href={`mailto:${email}`}
            className="block text-xl sm:text-4xl lg:text-5xl font-sans font-medium tracking-tight text-white hover:text-[#F2D785] transition-colors break-all sm:break-normal"
          >
            {email}
          </a>
          <a
            href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(siteName)}%2C%20I%20want%20to%20place%20an%20order!`}
            target="_blank"
            rel="noreferrer"
            className="block text-xl sm:text-3xl font-sans font-normal tracking-wide text-[#E8C566] hover:text-[#FFF2BE] transition-colors"
          >
            {phone}
          </a>
        </div>

        {/* Navigation & Details Grid */}
        <div className="gsap-footer-item pt-10 grid gap-10 md:grid-cols-3 items-center text-center md:text-left">
          {/* Brand Note */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              {branding?.logoImageUrl && (branding.logoType === 'image' || branding.logoType === 'both') ? (
                <img
                  src={branding.logoImageUrl}
                  alt={siteName}
                  className="h-7 w-auto object-contain rounded-md border border-[#D4AF37]/40"
                />
              ) : (
                <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              )}
              <p className="font-serif text-2xl font-bold bg-gradient-to-r from-white via-[#F2D785] to-[#D4AF37] bg-clip-text text-transparent tracking-tight">
                {siteName}
              </p>
            </div>
            <p className="text-xs text-[#B5ADA0] leading-relaxed max-w-xs mx-auto md:mx-0">
              {tagline}
            </p>
          </div>

          {/* Minimal Links Row */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-[0.2em] text-[#D8D2C5]">
            <a href="#home" className="hover:text-[#F2D785] transition-colors">Home</a>
            <a
              href="#collection"
              onClick={() => setActiveDepartment?.('crafts')}
              className="hover:text-[#F2D785] transition-colors"
            >
              Crafts
            </a>
            <a
              href="#collection"
              onClick={() => setActiveDepartment?.('aquarium')}
              className="hover:text-[#F2D785] transition-colors text-teal-400"
            >
              Living Aquatics
            </a>
            <a href="#makers" className="hover:text-[#F2D785] transition-colors">Makers</a>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#D4AF37]/30 bg-[#161410] text-[#D0C9BE] transition duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A120B] hover:shadow-[0_0_15px_rgba(212,175,55,0.45)]"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#D4AF37]/30 bg-[#161410] text-[#D0C9BE] transition duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A120B] hover:shadow-[0_0_15px_rgba(212,175,55,0.45)]"
            >
              <PinterestIcon className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#D4AF37]/30 bg-[#161410] text-[#D0C9BE] transition duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A120B] hover:shadow-[0_0_15px_rgba(212,175,55,0.45)]"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Legal & Credits Bottom Bar */}
        <div className="gsap-footer-item mt-12 pt-6 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A69E90] gap-4">
          <p>© {new Date().getFullYear()} {siteName}. All handcrafted items and aquatic specimens protected by guarantee.</p>
          <div className="flex items-center gap-4">
            <span className="text-teal-400 font-semibold">● Live Fish Safe Arrival Guaranteed</span>
            <span>•</span>
            <span className="text-[#D4AF37] font-semibold">100% Certified Artisans</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

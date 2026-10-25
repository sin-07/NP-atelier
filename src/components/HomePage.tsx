"use client"

import Navbar from './Navbar'
import Hero from './Hero'
import HandmadeGallery from './HandmadeGallery'
import AcquarioTropicale from './AcquarioTropicale'
import ArtisanSpotlight from './ArtisanSpotlight'
import Testimonials from './Testimonials'
import FaqSection from './FaqSection'
import Newsletter from './Newsletter'
import Footer from './Footer'

// Modals & Drawers
import CartSidebar from './CartSidebar'
import WishlistSidebar from './WishlistSidebar'
import CheckoutModal from './CheckoutModal'
import QuickSearchModal from './QuickSearchModal'
import AuthModal from './AuthModal'
import SellCraftModal from './SellCraftModal'
import ToastContainer from './ToastContainer'
import BackToTop from './BackToTop'
import MobileBottomDock from './MobileBottomDock'

import { useMarketplace } from '../context/MarketplaceContext'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function HomePage() {
  const { activeDepartment, setActiveDepartment } = useMarketplace()

  const isAquariumView = activeDepartment === 'aquarium'

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#382606]">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main className="pt-28 sm:pt-32 pb-24 sm:pb-0">
        {isAquariumView ? (
          <div className="animate-in fade-in duration-300">
            {/* Top Return Ribbon */}
            <div className="section-shell pt-3 pb-1">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-500/40 bg-gradient-to-r from-[#07181D] via-[#0D2930] to-[#081B20] px-4 py-2.5 text-xs text-[#E0F2FE] shadow-md">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-[#051114] font-bold text-[10px]">
                    ✦
                  </span>
                  <span className="font-medium text-teal-100">
                    Dedicated Department: <strong className="text-white font-serif tracking-wide">Acquario Tropicale</strong> (Exotic Fish, Rimless Tanks & Aquascaping)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDepartment?.('crafts')
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-teal-300/40 px-3 py-1 font-bold text-teal-200 hover:text-white transition cursor-pointer text-[11px]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Artisan Crafts Home</span>
                </button>
              </div>
            </div>

            <AcquarioTropicale />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <Hero />
            <HandmadeGallery />
            <div id="makers">
              <ArtisanSpotlight />
            </div>
            <Testimonials />
            <FaqSection />
            <Newsletter />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Bottom Dock */}
      <MobileBottomDock />

      {/* Modals & Overlays */}
      <CartSidebar />
      <WishlistSidebar />
      <CheckoutModal />
      <QuickSearchModal />
      <AuthModal />
      <SellCraftModal />
      <BackToTop />
    </div>
  )
}


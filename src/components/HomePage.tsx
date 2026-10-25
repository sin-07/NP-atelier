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


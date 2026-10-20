"use client"

import Navbar from './Navbar'
import Hero from './Hero'
import HandmadeGallery from './HandmadeGallery'
import CraftCustomizer from './CraftCustomizer'
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

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#382606]">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main>
        <Hero />
        <HandmadeGallery />
        <CraftCustomizer />
        <div id="makers">
          <ArtisanSpotlight />
        </div>
        <Testimonials />
        <FaqSection />
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />

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


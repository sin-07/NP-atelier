"use client"

import dynamic from 'next/dynamic'
import Navbar from './Navbar'
import Hero from './Hero'
import HandmadeGallery from './HandmadeGallery'
import ArtisanSpotlight from './ArtisanSpotlight'
import Testimonials from './Testimonials'
import FaqSection from './FaqSection'
import Newsletter from './Newsletter'
import Footer from './Footer'
import ToastContainer from './ToastContainer'
import BackToTop from './BackToTop'
import MobileBottomDock from './MobileBottomDock'

// Dynamically imported alternate view & interactive drawers to drastically reduce initial JS payload
const AcquarioTropicale = dynamic(() => import('./AcquarioTropicale'), {
  ssr: false,
  loading: () => (
    <div className="section-shell py-24 text-center">
      <div className="mx-auto h-12 w-12 rounded-full border-2 border-dashed border-[#D4AF78] animate-spin" />
      <p className="mt-4 font-serif text-sm text-[#D4AF78] tracking-widest uppercase font-bold">
        Loading Living Waters...
      </p>
    </div>
  ),
})

const CartSidebar = dynamic(() => import('./CartSidebar'), { ssr: false })
const WishlistSidebar = dynamic(() => import('./WishlistSidebar'), { ssr: false })
const CheckoutModal = dynamic(() => import('./CheckoutModal'), { ssr: false })
const QuickSearchModal = dynamic(() => import('./QuickSearchModal'), { ssr: false })
const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false })
const SellCraftModal = dynamic(() => import('./SellCraftModal'), { ssr: false })

import { useMarketplace } from '../context/MarketplaceContext'

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


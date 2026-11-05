"use client"

import dynamic from 'next/dynamic'
import Navbar from './Navbar'
import Hero from './Hero'
import HandmadeGallery from './HandmadeGallery'
import Footer from './Footer'
import ToastContainer from './ToastContainer'
import BackToTop from './BackToTop'
import MobileBottomDock from './MobileBottomDock'
import { useMarketplace } from '../context/MarketplaceContext'

// Dynamically imported below-the-fold sections to minimize initial client JS bundle
const ArtisanSpotlight = dynamic(() => import('./ArtisanSpotlight'))
const Testimonials = dynamic(() => import('./Testimonials'))
const FaqSection = dynamic(() => import('./FaqSection'))
const Newsletter = dynamic(() => import('./Newsletter'))

// Dynamically imported alternate view to drastically reduce initial JS payload
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

export default function HomePage() {
  const { activeDepartment } = useMarketplace()
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

      {/* Back to Top */}
      <BackToTop />
    </div>
  )
}

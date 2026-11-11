"use client"

import { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import AcquarioTropicale from '../../components/AcquarioTropicale'
import Footer from '../../components/Footer'
import ToastContainer from '../../components/ToastContainer'
import BackToTop from '../../components/BackToTop'
import MobileBottomDock from '../../components/MobileBottomDock'
import { useMarketplace } from '../../context/MarketplaceContext'

export default function AcquarioTropicalePage() {
  const { setActiveDepartment } = useMarketplace()

  useEffect(() => {
    setActiveDepartment?.('aquarium')
  }, [setActiveDepartment])

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[#D4AF78]/30 selection:text-[#141210] bg-[#F5F0E8] text-[#141210]">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main className="pt-28 sm:pt-32 pb-24 sm:pb-0">
        <AcquarioTropicale />
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

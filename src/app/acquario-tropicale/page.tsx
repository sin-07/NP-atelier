"use client"

import { useEffect } from 'react'
import { motion } from 'framer-motion'
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
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[#E11D48]/20 selection:text-[#0A2540] bg-[#F0F7FC] text-[#0A2540]">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Flow with Slide Animation */}
      <main className="pt-28 sm:pt-32 pb-24 sm:pb-0 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="w-full will-change-transform"
        >
          <AcquarioTropicale />
        </motion.div>
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

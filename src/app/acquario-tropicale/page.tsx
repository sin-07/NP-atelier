"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Fish } from 'lucide-react'
import Navbar from '../../components/Navbar'
import AcquarioTropicale from '../../components/AcquarioTropicale'
import Footer from '../../components/Footer'
import CartSidebar from '../../components/CartSidebar'
import WishlistSidebar from '../../components/WishlistSidebar'
import CheckoutModal from '../../components/CheckoutModal'
import QuickSearchModal from '../../components/QuickSearchModal'
import AuthModal from '../../components/AuthModal'
import SellCraftModal from '../../components/SellCraftModal'
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
    <div className="relative min-h-screen overflow-x-hidden selection:bg-teal-500/30 selection:text-teal-900 bg-[#FAF8F5]">
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

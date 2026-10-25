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
        <div className="section-shell pt-3 pb-1">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-500/40 bg-gradient-to-r from-[#07181D] via-[#0D2930] to-[#081B20] px-4 py-2.5 text-xs text-[#E0F2FE] shadow-md">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-[#051114] font-bold text-[10px]">
                <Fish className="h-3 w-3" />
              </span>
              <span className="font-medium text-teal-100">
                Dedicated Department: <strong className="text-white font-serif tracking-wide">Acquario Tropicale</strong> (Exotic Fish, Rimless Tanks & Aquascaping)
              </span>
            </div>
            <Link
              href="/"
              onClick={() => {
                setActiveDepartment?.('crafts')
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-teal-300/40 px-3 py-1 font-bold text-teal-200 hover:text-white transition cursor-pointer text-[11px]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Artisan Crafts Home</span>
            </Link>
          </div>
        </div>

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

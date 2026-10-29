"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '../../components/Navbar'
import AcquarioTropicale from '../../components/AcquarioTropicale'
import Footer from '../../components/Footer'
import ToastContainer from '../../components/ToastContainer'
import BackToTop from '../../components/BackToTop'
import MobileBottomDock from '../../components/MobileBottomDock'
import { useMarketplace } from '../../context/MarketplaceContext'

const CartSidebar = dynamic(() => import('../../components/CartSidebar'), { ssr: false })
const WishlistSidebar = dynamic(() => import('../../components/WishlistSidebar'), { ssr: false })
const CheckoutModal = dynamic(() => import('../../components/CheckoutModal'), { ssr: false })
const QuickSearchModal = dynamic(() => import('../../components/QuickSearchModal'), { ssr: false })
const AuthModal = dynamic(() => import('../../components/AuthModal'), { ssr: false })
const SellCraftModal = dynamic(() => import('../../components/SellCraftModal'), { ssr: false })

export default function AcquarioTropicalePage() {
  const {
    setActiveDepartment,
    isCartOpen,
    isWishlistOpen,
    isCheckoutOpen,
    isQuickSearchOpen,
    isAuthOpen,
    isSellOpen,
  } = useMarketplace()

  const [hasOpenedCart, setHasOpenedCart] = useState(false)
  const [hasOpenedWishlist, setHasOpenedWishlist] = useState(false)
  const [hasOpenedCheckout, setHasOpenedCheckout] = useState(false)
  const [hasOpenedSearch, setHasOpenedSearch] = useState(false)
  const [hasOpenedAuth, setHasOpenedAuth] = useState(false)
  const [hasOpenedSell, setHasOpenedSell] = useState(false)

  useEffect(() => {
    setActiveDepartment?.('aquarium')
  }, [setActiveDepartment])

  useEffect(() => {
    if (isCartOpen) setHasOpenedCart(true)
    if (isWishlistOpen) setHasOpenedWishlist(true)
    if (isCheckoutOpen) setHasOpenedCheckout(true)
    if (isQuickSearchOpen) setHasOpenedSearch(true)
    if (isAuthOpen) setHasOpenedAuth(true)
    if (isSellOpen) setHasOpenedSell(true)
  }, [isCartOpen, isWishlistOpen, isCheckoutOpen, isQuickSearchOpen, isAuthOpen, isSellOpen])

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[#D4AF78]/30 selection:text-[#F5EBDD] bg-[#0B0B0A] text-[#F5EBDD]">
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

      {/* On-Demand Modals & Overlays */}
      {hasOpenedCart && <CartSidebar />}
      {hasOpenedWishlist && <WishlistSidebar />}
      {hasOpenedCheckout && <CheckoutModal />}
      {hasOpenedSearch && <QuickSearchModal />}
      {hasOpenedAuth && <AuthModal />}
      {hasOpenedSell && <SellCraftModal />}
      <BackToTop />
    </div>
  )
}

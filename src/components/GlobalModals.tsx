"use client"

import CartSidebar from './CartSidebar'
import WishlistSidebar from './WishlistSidebar'
import CheckoutModal from './CheckoutModal'
import QuickSearchModal from './QuickSearchModal'
import AuthModal from './AuthModal'
import SellCraftModal from './SellCraftModal'

export default function GlobalModals() {
  return (
    <>
      <CartSidebar />
      <WishlistSidebar />
      <CheckoutModal />
      <QuickSearchModal />
      <AuthModal />
      <SellCraftModal />
    </>
  )
}

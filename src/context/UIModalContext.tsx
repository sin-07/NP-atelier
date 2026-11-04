"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

export interface UIModalState {
  isCartOpen: boolean
  isWishlistOpen: boolean
  isAuthOpen: boolean
  isCheckoutOpen: boolean
  isQuickSearchOpen: boolean
  isSellOpen: boolean
  isProfileOpen: boolean
  profileTab: 'profile' | 'orders' | 'wishlist'
}

export interface UIModalDispatch {
  setIsCartOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setIsWishlistOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setIsAuthOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setIsCheckoutOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setIsQuickSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setIsSellOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setIsProfileOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setProfileTab: (tab: 'profile' | 'orders' | 'wishlist') => void
  openProfile: (tab?: 'profile' | 'orders' | 'wishlist') => void
  closeAllModals: () => void
}

export type UIModalContextType = UIModalState & UIModalDispatch

const UIModalStateContext = createContext<UIModalState | undefined>(undefined)
const UIModalDispatchContext = createContext<UIModalDispatch | undefined>(undefined)

export function UIModalProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false)
  const [isSellOpen, setIsSellOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profileTab, setProfileTab] = useState<'profile' | 'orders' | 'wishlist'>('profile')

  const openProfile = useCallback((tab: 'profile' | 'orders' | 'wishlist' = 'profile') => {
    setProfileTab(tab)
    setIsProfileOpen(true)
    if (typeof window !== 'undefined') {
      const targetUrl = tab === 'profile' ? '/profile' : `/profile?tab=${tab}`
      if (window.location.pathname === '/profile') {
        window.history.pushState(null, '', targetUrl)
      } else {
        window.location.href = targetUrl
      }
    }
  }, [])

  const closeAllModals = useCallback(() => {
    setIsCartOpen(false)
    setIsWishlistOpen(false)
    setIsAuthOpen(false)
    setIsCheckoutOpen(false)
    setIsQuickSearchOpen(false)
    setIsSellOpen(false)
    setIsProfileOpen(false)
  }, [])

  // Dispatch functions are referentially stable across the lifetime of the application
  const dispatchValue = useMemo<UIModalDispatch>(
    () => ({
      setIsCartOpen,
      setIsWishlistOpen,
      setIsAuthOpen,
      setIsCheckoutOpen,
      setIsQuickSearchOpen,
      setIsSellOpen,
      setIsProfileOpen,
      setProfileTab,
      openProfile,
      closeAllModals,
    }),
    [openProfile, closeAllModals]
  )

  const stateValue = useMemo<UIModalState>(
    () => ({
      isCartOpen,
      isWishlistOpen,
      isAuthOpen,
      isCheckoutOpen,
      isQuickSearchOpen,
      isSellOpen,
      isProfileOpen,
      profileTab,
    }),
    [
      isCartOpen,
      isWishlistOpen,
      isAuthOpen,
      isCheckoutOpen,
      isQuickSearchOpen,
      isSellOpen,
      isProfileOpen,
      profileTab,
    ]
  )

  return (
    <UIModalDispatchContext.Provider value={dispatchValue}>
      <UIModalStateContext.Provider value={stateValue}>
        {children}
      </UIModalStateContext.Provider>
    </UIModalDispatchContext.Provider>
  )
}

/** Hook for modals that need state (isCartOpen, etc.) and dispatchers */
export function useUIModals(): UIModalContextType {
  const state = useContext(UIModalStateContext)
  const dispatch = useContext(UIModalDispatchContext)
  if (!state || !dispatch) {
    throw new Error('useUIModals must be used within a UIModalProvider')
  }
  return { ...state, ...dispatch }
}

/** Hook for components that ONLY need to trigger modals (e.g. Navbar buttons, MarketplaceContext) */
export function useModalDispatch(): UIModalDispatch {
  const dispatch = useContext(UIModalDispatchContext)
  if (!dispatch) {
    throw new Error('useModalDispatch must be used within a UIModalProvider')
  }
  return dispatch
}

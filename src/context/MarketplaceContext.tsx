"use client"

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import {
  allInitialProducts,
  aquariumCategories,
  craftCategories,
  Product,
} from '../data/products'

export interface BrandingSettings {
  siteName: string
  tagline: string
  logoType: 'icon' | 'image' | 'both'
  logoText: string
  logoImageUrl: string
  announcementText: string
  contactEmail: string
  contactPhone: string
  currency: string
}

export const DEFAULT_BRANDING: BrandingSettings = {
  siteName: 'NP Atelier',
  tagline: 'Luxury Crafts & Exotic Aquatics',
  logoType: 'icon',
  logoText: 'NP',
  logoImageUrl: '',
  announcementText: 'Handcrafted Artisan Drops & Exotic Aquatics Live • Code ATELIER10 for 10% off',
  contactEmail: 'npatelierindia@gmail.com',
  contactPhone: '+91 93412 97124',
  currency: '₹',
}

const MarketplaceContext = createContext<any>(null)

const STORAGE_KEYS = {
  auth: 'ateliernp-auth-user-v1',
  cart: 'ateliernp-cart-v1',
  wishlist: 'ateliernp-wishlist-v1',
  products: 'ateliernp-products-v4',
  orders: 'ateliernp-orders-v2',
  coupons: 'ateliernp-coupons-v1',
  branding: 'ateliernp-branding-v2',
}

const DEFAULT_COUPONS = {
  ATELIER10: { code: 'ATELIER10', type: 'percent', value: 10, label: '10% Off Atelier & Aquatics Drop' },
  AQUA15: { code: 'AQUA15', type: 'percent', value: 15, label: '15% Off Fish & Aquarium Gear' },
  CRAFTY10: { code: 'CRAFTY10', type: 'percent', value: 10, label: '10% Off Artisan Crafts' },
  HANDMADE20: { code: 'HANDMADE20', type: 'percent', value: 20, label: '20% Off Spring Sale' },
  FREESHIP: { code: 'FREESHIP', type: 'shipping', value: 0, label: 'Free Delivery Across India' },
  WELCOME150: { code: 'WELCOME150', type: 'fixed', value: 150, label: '₹150 Off First Order' },
}

const SEED_ORDERS = [
  {
    orderId: 'CRFT-849201',
    date: 'Aug 24, 2026',
    items: [
      {
        id: 1,
        title: 'Atelier NP Sea Life DIY Paint Kit',
        price: '₹449',
        quantity: 2,
        image: '/products/atelier-diy-paint-kit-sea.jpg',
        category: 'Beauty DIY Products',
        department: 'crafts',
      },
      {
        id: 102,
        title: 'Samurai Koi Halfmoon Plakat Betta (Show Grade)',
        price: '₹899',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
        category: 'Live Freshwater Fish',
        department: 'aquarium',
      },
    ],
    subtotal: 1797,
    discount: 180,
    shipping: 0,
    giftWrap: 49,
    total: 1666,
    customer: {
      fullName: 'Pooja Verma',
      email: 'pooja.verma@example.in',
      city: 'Bengaluru, Karnataka',
      phone: '+91 98765 43210',
      address: '42 Lotus Boulevard, Indiranagar',
    },
    status: 'Aquatic Packing & Oxygenation',
    estimatedDelivery: 'Aug 29, 2026',
  },
  {
    orderId: 'CRFT-773194',
    date: 'Aug 23, 2026',
    items: [
      {
        id: 105,
        title: 'Ultra-Clear Rimless 60P Low-Iron Glass Aquarium (64 Liters)',
        price: '₹4,499',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
        category: 'Aquariums & Nano Tanks',
        department: 'aquarium',
      },
    ],
    subtotal: 4499,
    discount: 0,
    shipping: 0,
    giftWrap: 0,
    total: 4499,
    customer: {
      fullName: 'Rohan Mehra',
      email: 'rohan.mehra@example.in',
      city: 'Mumbai, Maharashtra',
      phone: '+91 98200 12345',
      address: '15 Sea View Apartments, Bandra West',
    },
    status: 'Shipped (Express Courier)',
    estimatedDelivery: 'Aug 27, 2026',
  },
]

function safeReadStorage<T>(key: string, fallbackValue: T): T {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  try {
    const storedValue = window.localStorage.getItem(key)
    if (!storedValue) return fallbackValue
    const parsed = JSON.parse(storedValue)

    // Ensure all products include missing seed items and clean currency
    if (Array.isArray(parsed) && key === STORAGE_KEYS.products) {
      const storedIds = new Set(parsed.map((p) => String(p.id)))
      const missingDefaults = allInitialProducts.filter((p) => !storedIds.has(String(p.id)))
      const combined = [...missingDefaults, ...parsed]
      return combined.map((p) => ({
        ...p,
        price: typeof p.price === 'string' && p.price.includes('$')
          ? p.price.replace('$', '₹')
          : p.price,
      })) as unknown as T
    }
    return parsed
  } catch {
    return fallbackValue
  }
}

function buildAvatar(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING)
  const [products, setProducts] = useState<Product[]>(allInitialProducts)
  const [cart, setCart] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([1, 102, 105])
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>(SEED_ORDERS)
  const [availableCoupons, setAvailableCoupons] = useState<any>(DEFAULT_COUPONS)
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isGiftWrap, setIsGiftWrap] = useState(false)
  const [activeDepartment, setActiveDepartment] = useState<'all' | 'crafts' | 'aquarium'>('all')

  // Drawer / Modal toggles
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isSellOpen, setIsSellOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false)

  // Toasts
  const [toasts, setToasts] = useState<any[]>([])

  const showToast = useCallback(({ title, message, type = 'info' }: { title: string; message: string; type?: string }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6)
    setToasts((current) => [...current, { id, title, message, type }])

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string | number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  // Sync state to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.branding, JSON.stringify(branding))
      document.title = `${branding.siteName} | ${branding.tagline}`
    }
  }, [branding])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products))
    }
  }, [products])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart))
    }
  }, [cart])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist))
    }
  }, [wishlist])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders))
    }
  }, [orders])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.coupons, JSON.stringify(availableCoupons))
    }
  }, [availableCoupons])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        window.localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(user))
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.auth)
      }
    }
  }, [user])

  // Hydrate from localStorage on client mount, then sync with backend API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBranding = safeReadStorage<BrandingSettings | null>(STORAGE_KEYS.branding, null)
      if (storedBranding && storedBranding.siteName) {
        setBranding(storedBranding)
      }

      const storedCart = safeReadStorage<any[] | null>(STORAGE_KEYS.cart, null)
      if (storedCart) setCart(storedCart)

      const storedWishlist = safeReadStorage<any[] | null>(STORAGE_KEYS.wishlist, null)
      if (storedWishlist) setWishlist(storedWishlist)

      const storedUser = safeReadStorage<any>(STORAGE_KEYS.auth, null)
      if (storedUser) setUser(storedUser)

      const storedOrders = safeReadStorage<any[] | null>(STORAGE_KEYS.orders, null)
      if (storedOrders) setOrders(storedOrders)

      const storedCoupons = safeReadStorage<any>(STORAGE_KEYS.coupons, null)
      if (storedCoupons) setAvailableCoupons(storedCoupons)
    }

    // 1. Fetch Branding
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.settings) {
          setBranding((prev) => ({ ...prev, ...data.settings }))
        }
      })
      .catch(() => {})

    // 2. Fetch Products
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data?.products) && data.products.length > 0) {
          setProducts(data.products)
        }
      })
      .catch(() => {})

    // 3. Fetch Orders
    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data?.orders)) {
          setOrders(data.orders)
        }
      })
      .catch(() => {})
  }, [])

  const updateBranding = async (newBranding: Partial<BrandingSettings>) => {
    setBranding((current) => {
      const updated = { ...current, ...newBranding }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEYS.branding, JSON.stringify(updated))
        document.title = `${updated.siteName} | ${updated.tagline}`
      }
      return updated
    })

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBranding),
      })
      const data = await res.json()
      if (data?.success && data?.settings) {
        setBranding(data.settings)
      }
    } catch (err) {
      console.error('Failed to sync branding to server:', err)
    }

    showToast({
      title: 'Branding Updated Live! 🎨',
      message: 'New store name & logo applied permanently across the entire website.',
      type: 'success',
    })
  }

  const resetBranding = async () => {
    await updateBranding(DEFAULT_BRANDING)
    showToast({
      title: 'Branding Reset',
      message: 'Storefront branding restored to default settings.',
      type: 'info',
    })
  }

  const productLookup = useMemo(() => {
    const map = new Map<string | number, Product>()
    for (const item of products) {
      map.set(item.id, item)
    }
    return map
  }, [products])

  const wishlistedProducts = useMemo(
    () => wishlist.map((id) => productLookup.get(id)).filter(Boolean),
    [wishlist, productLookup]
  )

  const isWishlisted = useCallback((id: string | number) => wishlist.includes(id), [wishlist])

  const toggleWishlist = (productId: string | number) => {
    const product = productLookup.get(productId)
    const title = product?.title || 'Item'

    setWishlist((current) => {
      const exists = current.includes(productId)
      if (exists) {
        showToast({
          title: 'Removed from Saved',
          message: `${title} was removed from your favorites.`,
          type: 'info',
        })
        return current.filter((id) => id !== productId)
      }

      showToast({
        title: 'Saved to Wishlist! 💖',
        message: `${title} added to your curated list.`,
        type: 'success',
      })
      return [...current, productId]
    })
  }

  const addToCart = (product: any, quantity: number | string = 1, customization: any = null) => {
    const safeQuantity = Math.max(1, Math.floor(Number(quantity)) || 1)
    const cartItemId = customization ? `${product.id}-${Date.now()}` : product.id

    setCart((current) => {
      const existingIndex = current.findIndex((item) => {
        if (customization) return false
        return item.productId === product.id && !item.customization
      })

      if (existingIndex > -1) {
        const next = [...current]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + safeQuantity,
        }
        return next
      }

      return [
        ...current,
        {
          cartItemId,
          productId: product.id,
          quantity: safeQuantity,
          customization,
          department: product.department || (aquariumCategories.includes(product.category) ? 'aquarium' : 'crafts'),
        },
      ]
    })

    showToast({
      title: 'Added to Bag! 🛍️',
      message: `${safeQuantity}x "${product.title}" is ready in your cart.`,
      type: 'cart',
    })
  }

  const setCartQuantity = (cartItemId: string | number, quantity: number | string) => {
    const targetQty = Number.parseInt(String(quantity), 10) || 0
    if (targetQty <= 0) {
      removeFromCart(cartItemId)
      return
    }

    setCart((current) =>
      current.map((item) =>
        (item.cartItemId || item.productId) === cartItemId ? { ...item, quantity: targetQty } : item
      )
    )
  }

  const removeFromCart = (cartItemId: string | number) => {
    setCart((current) => current.filter((item) => (item.cartItemId || item.productId) !== cartItemId))
    showToast({
      title: 'Item Removed',
      message: 'Product removed from your shopping bag.',
      type: 'info',
    })
  }

  const moveAllWishlistToCart = () => {
    if (wishlistedProducts.length === 0) return

    setCart((current) => {
      const next = [...current]
      for (const prod of wishlistedProducts) {
        if (!prod) continue
        const existingIdx = next.findIndex((item) => item.productId === prod.id && !item.customization)
        if (existingIdx > -1) {
          next[existingIdx].quantity += 1
        } else {
          next.push({
            cartItemId: prod.id,
            productId: prod.id,
            quantity: 1,
            customization: null,
            department: prod.department || (aquariumCategories.includes(prod.category) ? 'aquarium' : 'crafts'),
          })
        }
      }
      return next
    })

    setWishlist([])
    setIsWishlistOpen(false)
    setIsCartOpen(true)

    showToast({
      title: 'Wishlist Moved to Bag! 🎁',
      message: `${wishlistedProducts.length} items moved to your bag.`,
      type: 'cart',
    })
  }

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = productLookup.get(item.productId)
          if (!product) return null

          return {
            ...product,
            cartItemId: item.cartItemId || item.productId,
            customization: item.customization,
            quantity: item.quantity,
            department: product.department || item.department || (aquariumCategories.includes(product.category) ? 'aquarium' : 'crafts'),
          }
        })
        .filter(Boolean),
    [cart, productLookup]
  )

  const cartRawSubtotal = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const amount = Number.parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0
        return total + amount * item.quantity
      }, 0),
    [cartItems]
  )

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.type === 'percent') {
      return (cartRawSubtotal * appliedCoupon.value) / 100
    }
    if (appliedCoupon.type === 'fixed') {
      return Math.min(cartRawSubtotal, appliedCoupon.value)
    }
    return 0
  }, [appliedCoupon, cartRawSubtotal])

  const shippingCost = useMemo(() => {
    if (cartRawSubtotal >= 1499 || appliedCoupon?.type === 'shipping' || cartItems.length === 0) {
      return 0
    }
    return 49
  }, [appliedCoupon, cartItems.length, cartRawSubtotal])

  const giftWrapCost = useMemo(() => (isGiftWrap && cartItems.length > 0 ? 49 : 0), [isGiftWrap, cartItems.length])

  const cartFinalTotal = useMemo(
    () => Math.max(0, cartRawSubtotal - discountAmount + shippingCost + giftWrapCost),
    [cartRawSubtotal, discountAmount, shippingCost, giftWrapCost]
  )

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems])

  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase()
    if (availableCoupons[cleanCode]) {
      setAppliedCoupon(availableCoupons[cleanCode])
      showToast({
        title: 'Coupon Applied! 🎉',
        message: `${availableCoupons[cleanCode].label} has been activated.`,
        type: 'success',
      })
      return { success: true, message: 'Coupon applied successfully!' }
    }
    showToast({
      title: 'Invalid Code',
      message: 'Code not recognized. Try ATELIER10 or AQUA15',
      type: 'error',
    })
    return { success: false, message: 'Invalid coupon code.' }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    showToast({
      title: 'Coupon Removed',
      message: 'Discount code has been detached.',
      type: 'info',
    })
  }

  const addCoupon = (coupon: any) => {
    const code = coupon.code.trim().toUpperCase()
    setAvailableCoupons((current: any) => ({
      ...current,
      [code]: {
        code,
        type: coupon.type || 'percent',
        value: Number(coupon.value) || 10,
        label: coupon.label || `${coupon.value}% Discount`,
      },
    }))
    showToast({
      title: 'Coupon Created! 🎟️',
      message: `Coupon code "${code}" is now active in store.`,
      type: 'success',
    })
  }

  const deleteCoupon = (code: string) => {
    setAvailableCoupons((current: any) => {
      const next = { ...current }
      delete next[code]
      return next
    })
    showToast({
      title: 'Coupon Deleted',
      message: `Coupon "${code}" has been disabled.`,
      type: 'info',
    })
  }

  const clearCart = () => setCart([])

  const createOrder = async (orderData: any) => {
    const hasAquariumItem = cartItems.some((i: any) => i.department === 'aquarium')
    const newOrder = {
      orderId: `CRFT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cartItems],
      subtotal: cartRawSubtotal,
      discount: discountAmount,
      shipping: shippingCost,
      giftWrap: giftWrapCost,
      total: cartFinalTotal,
      customer: orderData,
      status: hasAquariumItem ? 'Aquatic Packing & Oxygenation' : 'Handcrafting & Packing',
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
    }

    setOrders((current) => [newOrder, ...current])
    clearCart()
    setAppliedCoupon(null)

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })
    } catch (err) {
      console.error('Failed to sync new order to server:', err)
    }

    showToast({
      title: 'Order Confirmed! 🌟',
      message: `Order #${newOrder.orderId} placed successfully. We are preparing your shipment!`,
      type: 'success',
    })

    return newOrder
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrders((current) =>
      current.map((order) => (order.orderId === orderId ? { ...order, status: newStatus } : order))
    )

    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
    } catch (err) {
      console.error('Failed to sync order status to server:', err)
    }

    showToast({
      title: 'Order Status Updated',
      message: `Order #${orderId} marked as "${newStatus}".`,
      type: 'success',
    })
  }

  const login = ({ name, email }: { name: string; email: string }) => {
    const cleanedName = name.trim()
    const cleanedEmail = email.trim().toLowerCase()

    setUser({
      name: cleanedName,
      email: cleanedEmail,
      avatar: buildAvatar(cleanedName),
      avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      memberSince: '2026',
    })

    showToast({
      title: `Welcome, ${cleanedName}! 🌸`,
      message: `Signed in to ${branding.siteName}.`,
      type: 'success',
    })
  }

  const logout = () => {
    setUser(null)
    showToast({
      title: 'Signed Out',
      message: 'Come back soon for more handcrafted & aquatic drops!',
      type: 'info',
    })
  }

  const addProduct = async (productData: any) => {
    const rawPrice = String(productData.price || '').trim()
    const formattedPrice = rawPrice.startsWith('₹') ? rawPrice : `₹${rawPrice}`

    const isAquarium =
      productData.department === 'aquarium' ||
      aquariumCategories.includes(productData.category)

    const nextProduct: Product = {
      id: Date.now(),
      title: productData.title.trim(),
      description: (productData.description || '').trim(),
      department: isAquarium ? 'aquarium' : 'crafts',
      category: productData.category.trim(),
      subCategory: productData.subCategory || productData.category.trim(),
      price: formattedPrice,
      image:
        productData.image?.trim() ||
        (isAquarium
          ? 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b38?auto=format&fit=crop&w=800&q=80'
          : '/products/ceramic-mug.jpg'),
      badges: productData.badges || ['New', 'In Stock'],
      rating: 5.0,
      reviews: 1,
      stock: productData.stock !== undefined ? Number(productData.stock) : 25,
      isUserCreated: true,
      artisanName: productData.artisanName || user?.name || (isAquarium ? 'Aquatic Master' : 'Local Artisan'),
      aquaticSpecs: productData.aquaticSpecs,
    }

    setProducts((current) => [nextProduct, ...current])

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextProduct),
      })
    } catch (err) {
      console.error('Failed to sync new product to server:', err)
    }

    showToast({
      title: 'Product Listed Live! 🎨',
      message: `"${nextProduct.title}" is now available in ${nextProduct.category}.`,
      type: 'success',
    })
  }

  const editProduct = async (productId: string | number, updatedData: any) => {
    let updatedItem: any = null
    setProducts((current) =>
      current.map((prod) => {
        if (prod.id === productId) {
          let updatedPrice = prod.price
          if (updatedData.price) {
            const raw = String(updatedData.price).trim()
            updatedPrice = raw.startsWith('₹') ? raw : `₹${raw}`
          }

          const isAquarium =
            updatedData.department === 'aquarium' ||
            aquariumCategories.includes(updatedData.category || prod.category)

          updatedItem = {
            ...prod,
            ...updatedData,
            department: isAquarium ? 'aquarium' : 'crafts',
            price: updatedPrice,
          }
          return updatedItem
        }
        return prod
      })
    )

    if (updatedItem) {
      try {
        await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem),
        })
      } catch (err) {
        console.error('Failed to sync edited product to server:', err)
      }
    }

    showToast({
      title: 'Product Updated! ✏️',
      message: 'Product details saved & updated permanently.',
      type: 'success',
    })
  }

  const deleteProduct = async (productId: string | number) => {
    setProducts((current) => current.filter((prod) => prod.id !== productId))

    try {
      await fetch(`/api/products?id=${productId}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to sync deleted product to server:', err)
    }

    showToast({
      title: 'Product Deleted',
      message: 'Product removed from marketplace and database.',
      type: 'info',
    })
  }

  const addReview = (productId: string | number, review: any) => {
    setProducts((current) =>
      current.map((prod) => {
        if (prod.id === productId) {
          const currentCount = prod.reviews || 10
          const currentRating = prod.rating || 4.8
          const newRating = Number(((currentRating * currentCount + review.rating) / (currentCount + 1)).toFixed(1))
          return {
            ...prod,
            rating: newRating,
            reviews: currentCount + 1,
          }
        }
        return prod
      })
    )

    showToast({
      title: 'Review Posted! ⭐',
      message: 'Thank you for sharing your feedback with the community.',
      type: 'success',
    })
  }

  const value = {
    branding,
    updateBranding,
    resetBranding,
    products,
    cartItems,
    cartSubtotal: cartRawSubtotal,
    cartFinalTotal,
    discountAmount,
    shippingCost,
    giftWrapCost,
    isGiftWrap,
    setIsGiftWrap,
    cartCount,
    wishlist,
    wishlistedProducts,
    appliedCoupon,
    availableCoupons,
    orders,
    user,
    toasts,
    activeDepartment,
    setActiveDepartment,
    isCartOpen,
    isWishlistOpen,
    isAuthOpen,
    isSellOpen,
    isCheckoutOpen,
    isQuickSearchOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    setIsSellOpen,
    setIsCheckoutOpen,
    setIsQuickSearchOpen,
    toggleWishlist,
    isWishlisted,
    moveAllWishlistToCart,
    addToCart,
    setCartQuantity,
    removeFromCart,
    clearCart,
    applyCouponCode,
    removeCoupon,
    addCoupon,
    deleteCoupon,
    createOrder,
    updateOrderStatus,
    login,
    logout,
    addProduct,
    editProduct,
    deleteProduct,
    addReview,
    showToast,
    removeToast,
  }

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMarketplace() {
  const context = useContext(MarketplaceContext)

  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider')
  }

  return context
}

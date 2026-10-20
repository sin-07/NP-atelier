import fs from 'fs'
import path from 'path'
import { allInitialProducts, Product } from '../data/products'

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

export const SEED_ORDERS = [
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
    status: 'Shipped (Express Fragile Courier)',
    estimatedDelivery: 'Aug 27, 2026',
  },
]

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const SETTINGS_FILE = path.join(DATA_DIR, 'db-settings.json')
const PRODUCTS_FILE = path.join(DATA_DIR, 'db-products.json')
const ORDERS_FILE = path.join(DATA_DIR, 'db-orders.json')

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// In-memory fallback in case filesystem is restricted or read-only
let memorySettings: BrandingSettings = { ...DEFAULT_BRANDING }
let memoryProducts: Product[] = [...allInitialProducts]
let memoryOrders: any[] = [...SEED_ORDERS]

export async function getSettings(): Promise<BrandingSettings> {
  try {
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(SETTINGS_FILE)) {
      await fs.promises.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_BRANDING, null, 2), 'utf8')
      memorySettings = { ...DEFAULT_BRANDING }
      return memorySettings
    }
    const raw = await fs.promises.readFile(SETTINGS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    memorySettings = { ...DEFAULT_BRANDING, ...parsed }
    return memorySettings
  } catch (err) {
    console.error('Failed reading settings from disk, using memory state:', err)
    return memorySettings
  }
}

export async function saveSettings(settings: Partial<BrandingSettings>): Promise<BrandingSettings> {
  try {
    ensureDirExists(DATA_DIR)
    const current = await getSettings()
    const updated: BrandingSettings = {
      ...current,
      ...settings,
    }
    await fs.promises.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf8')
    memorySettings = updated
    return updated
  } catch (err) {
    console.error('Failed writing settings to disk, saving in memory:', err)
    memorySettings = { ...memorySettings, ...settings }
    return memorySettings
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(PRODUCTS_FILE)) {
      await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(allInitialProducts, null, 2), 'utf8')
      memoryProducts = [...allInitialProducts]
      return memoryProducts
    }
    const raw = await fs.promises.readFile(PRODUCTS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure missing seeds (like newly introduced fish & aquarium items) are present
      const storedIds = new Set(parsed.map((p) => String(p.id)))
      const missing = allInitialProducts.filter((p) => !storedIds.has(String(p.id)))
      if (missing.length > 0) {
        const merged = [...missing, ...parsed]
        await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(merged, null, 2), 'utf8')
        memoryProducts = merged
        return merged
      }
      memoryProducts = parsed
      return parsed
    }
    return memoryProducts
  } catch (err) {
    console.error('Failed reading products from disk, using memory state:', err)
    return memoryProducts
  }
}

export async function saveAllProducts(products: Product[]): Promise<Product[]> {
  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8')
    memoryProducts = products
    return products
  } catch (err) {
    console.error('Failed writing products to disk, saving in memory:', err)
    memoryProducts = products
    return memoryProducts
  }
}

export async function addProductToDb(product: Product): Promise<Product[]> {
  const current = await getProducts()
  const next = [product, ...current]
  return await saveAllProducts(next)
}

export async function updateProductInDb(id: number | string, data: Partial<Product>): Promise<Product[]> {
  const current = await getProducts()
  const next = current.map((p) => (String(p.id) === String(id) ? { ...p, ...data } : p))
  return await saveAllProducts(next)
}

export async function deleteProductFromDb(id: number | string): Promise<Product[]> {
  const current = await getProducts()
  const next = current.filter((p) => String(p.id) !== String(id))
  return await saveAllProducts(next)
}

export async function getOrders(): Promise<any[]> {
  try {
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(ORDERS_FILE)) {
      await fs.promises.writeFile(ORDERS_FILE, JSON.stringify(SEED_ORDERS, null, 2), 'utf8')
      memoryOrders = [...SEED_ORDERS]
      return memoryOrders
    }
    const raw = await fs.promises.readFile(ORDERS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      memoryOrders = parsed
      return parsed
    }
    return memoryOrders
  } catch (err) {
    console.error('Failed reading orders from disk, using memory state:', err)
    return memoryOrders
  }
}

export async function addOrderToDb(order: any): Promise<any[]> {
  const current = await getOrders()
  const next = [order, ...current]
  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(ORDERS_FILE, JSON.stringify(next, null, 2), 'utf8')
  } catch (err) {
    console.error('Failed writing orders to disk, saving in memory:', err)
  }
  memoryOrders = next
  return next
}

export async function updateOrderStatusInDb(orderId: string, status: string): Promise<any[]> {
  const current = await getOrders()
  const next = current.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, status } : o))
  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(ORDERS_FILE, JSON.stringify(next, null, 2), 'utf8')
  } catch (err) {
    console.error('Failed updating order status on disk, saving in memory:', err)
  }
  memoryOrders = next
  return next
}

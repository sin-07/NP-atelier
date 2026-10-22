import fs from 'fs'
import path from 'path'
import { allInitialProducts, Product } from '../data/products'
import { getDb } from './mongodb'

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
  // 1. Try MongoDB Atlas
  try {
    const db = await getDb()
    const doc = await db.collection('settings').findOne({ _id: 'global_settings' as any })
    if (doc) {
      const { _id, ...rest } = doc
      memorySettings = { ...DEFAULT_BRANDING, ...rest } as BrandingSettings
      return memorySettings
    }
    // Seed default settings into MongoDB
    await db.collection('settings').updateOne(
      { _id: 'global_settings' as any },
      { $set: { ...DEFAULT_BRANDING, updatedAt: new Date() } },
      { upsert: true }
    )
    return memorySettings
  } catch (mongoErr) {
    console.warn('MongoDB settings fetch fallback to disk:', mongoErr)
  }

  // 2. Disk / memory fallback
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
    return memorySettings
  }
}

export async function saveSettings(settings: Partial<BrandingSettings>): Promise<BrandingSettings> {
  const current = await getSettings()
  const updated: BrandingSettings = {
    ...current,
    ...settings,
  }

  // 1. Save to MongoDB Atlas
  try {
    const db = await getDb()
    await db.collection('settings').updateOne(
      { _id: 'global_settings' as any },
      { $set: { ...updated, updatedAt: new Date() } },
      { upsert: true }
    )
  } catch (mongoErr) {
    console.warn('MongoDB saveSettings fallback:', mongoErr)
  }

  // 2. Save to local disk & memory fallback
  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf8')
  } catch (err) {
    // Memory fallback
  }

  memorySettings = updated
  return updated
}

export async function getProducts(): Promise<Product[]> {
  // 1. Try MongoDB Atlas
  try {
    const db = await getDb()
    const collection = db.collection<Product>('products')
    const count = await collection.countDocuments()

    if (count === 0) {
      // Auto-seed initial catalog to MongoDB Atlas
      await collection.insertMany(allInitialProducts.map((p) => ({ ...p })))
      memoryProducts = [...allInitialProducts]
      return memoryProducts
    }

    const docs = await collection.find({}).sort({ _id: -1 }).toArray()
    const cleanDocs = docs.map((doc: any) => {
      const { _id, ...rest } = doc
      return {
        ...rest,
        id: rest.id || _id.toString(),
      } as Product
    })

    // Ensure any newly added default catalog seed products exist
    const storedIds = new Set(cleanDocs.map((p) => String(p.id)))
    const missing = allInitialProducts.filter((p) => !storedIds.has(String(p.id)))
    if (missing.length > 0) {
      await collection.insertMany(missing.map((p) => ({ ...p })))
      const combined = [...missing, ...cleanDocs]
      memoryProducts = combined
      return combined
    }

    memoryProducts = cleanDocs
    return cleanDocs
  } catch (mongoErr) {
    console.warn('MongoDB getProducts fallback to disk:', mongoErr)
  }

  // 2. Disk / memory fallback
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
    return memoryProducts
  }
}

export async function saveAllProducts(products: Product[]): Promise<Product[]> {
  try {
    const db = await getDb()
    const collection = db.collection('products')
    for (const p of products) {
      await collection.updateOne(
        { id: p.id as any },
        { $set: { ...p, updatedAt: new Date() } },
        { upsert: true }
      )
    }
  } catch (mongoErr) {
    console.warn('MongoDB saveAllProducts fallback:', mongoErr)
  }

  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8')
  } catch (err) {
    // Memory fallback
  }

  memoryProducts = products
  return products
}

export async function addProductToDb(product: Product): Promise<Product[]> {
  // 1. Insert to MongoDB
  try {
    const db = await getDb()
    await db.collection('products').insertOne({
      ...product,
      createdAt: new Date(),
    } as any)
  } catch (mongoErr) {
    console.warn('MongoDB addProductToDb fallback:', mongoErr)
  }

  // 2. Update local disk/memory
  const current = await getProducts()
  const exists = current.some((p) => String(p.id) === String(product.id))
  const next = exists ? current : [product, ...current]

  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(next, null, 2), 'utf8')
  } catch {}

  memoryProducts = next
  return next
}

export async function updateProductInDb(id: number | string, data: Partial<Product>): Promise<Product[]> {
  // 1. Update in MongoDB
  try {
    const db = await getDb()
    await db.collection('products').updateOne(
      {
        $or: [
          { id: id as any },
          { id: Number(id) as any },
          { id: String(id) as any },
        ],
      },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    )
  } catch (mongoErr) {
    console.warn('MongoDB updateProductInDb fallback:', mongoErr)
  }

  // 2. Update local
  const current = await getProducts()
  const next = current.map((p) => (String(p.id) === String(id) ? { ...p, ...data } : p))

  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(next, null, 2), 'utf8')
  } catch {}

  memoryProducts = next
  return next
}

export async function deleteProductFromDb(id: number | string): Promise<Product[]> {
  // 1. Delete from MongoDB
  try {
    const db = await getDb()
    await db.collection('products').deleteOne({
      $or: [
        { id: id as any },
        { id: Number(id) as any },
        { id: String(id) as any },
      ],
    })
  } catch (mongoErr) {
    console.warn('MongoDB deleteProductFromDb fallback:', mongoErr)
  }

  // 2. Update local
  const current = await getProducts()
  const next = current.filter((p) => String(p.id) !== String(id))

  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(next, null, 2), 'utf8')
  } catch {}

  memoryProducts = next
  return next
}

export async function getOrders(): Promise<any[]> {
  // 1. Try MongoDB Atlas
  try {
    const db = await getDb()
    const collection = db.collection('orders')
    const count = await collection.countDocuments()

    if (count === 0) {
      await collection.insertMany(SEED_ORDERS.map((o) => ({ ...o, createdAt: new Date() })))
      memoryOrders = [...SEED_ORDERS]
      return memoryOrders
    }

    const docs = await collection.find({}).sort({ _id: -1 }).toArray()
    const cleanDocs = docs.map((doc: any) => {
      const { _id, ...rest } = doc
      return {
        ...rest,
        id: rest.orderId || rest.id || _id.toString(),
      }
    })
    memoryOrders = cleanDocs
    return cleanDocs
  } catch (mongoErr) {
    console.warn('MongoDB getOrders fallback to disk:', mongoErr)
  }

  // 2. Disk / memory fallback
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
    return memoryOrders
  }
}

export async function addOrderToDb(order: any): Promise<any[]> {
  // 1. Insert to MongoDB Atlas
  try {
    const db = await getDb()
    await db.collection('orders').insertOne({
      ...order,
      createdAt: new Date(),
    })
  } catch (mongoErr) {
    console.warn('MongoDB addOrderToDb fallback:', mongoErr)
  }

  // 2. Local fallback
  const current = await getOrders()
  const next = [order, ...current]
  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(ORDERS_FILE, JSON.stringify(next, null, 2), 'utf8')
  } catch {}

  memoryOrders = next
  return next
}

export async function updateOrderStatusInDb(orderId: string, status: string): Promise<any[]> {
  // 1. Update in MongoDB Atlas
  try {
    const db = await getDb()
    await db.collection('orders').updateOne(
      {
        $or: [
          { orderId: orderId as any },
          { id: orderId as any },
        ],
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    )
  } catch (mongoErr) {
    console.warn('MongoDB updateOrderStatusInDb fallback:', mongoErr)
  }

  // 2. Local fallback
  const current = await getOrders()
  const next = current.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, status } : o))
  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(ORDERS_FILE, JSON.stringify(next, null, 2), 'utf8')
  } catch {}

  memoryOrders = next
  return next
}

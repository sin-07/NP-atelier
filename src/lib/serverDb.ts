import dns from 'dns'
import fs from 'fs'
import path from 'path'
import { allInitialProducts, Product } from '../data/products'
import { getDb } from './mongodb'

try {
  dns.setDefaultResultOrder?.('ipv4first')
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch {}

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

export type RegionKey = 'north' | 'south' | 'east' | 'west'

export interface DeliveryRegionConfig {
  id: RegionKey
  name: string
  fee: number
  enabled: boolean
  estimatedDays: string
  description: string
  states: string[]
}

export interface RegionalDeliverySettings {
  regions: {
    north: DeliveryRegionConfig
    south: DeliveryRegionConfig
    east: DeliveryRegionConfig
    west: DeliveryRegionConfig
  }
  freeDeliveryThreshold?: number
  updatedAt?: string | Date
}

export const DEFAULT_DELIVERY_SETTINGS: RegionalDeliverySettings = {
  regions: {
    north: {
      id: 'north',
      name: 'North',
      fee: 49,
      enabled: true,
      estimatedDays: '2-4 Business Days',
      description: 'Delhi NCR, Punjab, Haryana, UP, Uttarakhand, Rajasthan, J&K, Chandigarh',
      states: [
        'Delhi',
        'Haryana',
        'Punjab',
        'Himachal Pradesh',
        'Jammu and Kashmir',
        'Ladakh',
        'Uttar Pradesh',
        'Uttarakhand',
        'Rajasthan',
        'Chandigarh',
      ],
    },
    south: {
      id: 'south',
      name: 'South',
      fee: 69,
      enabled: true,
      estimatedDays: '3-5 Business Days',
      description: 'Karnataka, Tamil Nadu, Kerala, Telangana, Andhra Pradesh, Goa, Puducherry',
      states: [
        'Karnataka',
        'Tamil Nadu',
        'Kerala',
        'Telangana',
        'Andhra Pradesh',
        'Goa',
        'Puducherry',
      ],
    },
    east: {
      id: 'east',
      name: 'East',
      fee: 79,
      enabled: true,
      estimatedDays: '4-6 Business Days',
      description: 'West Bengal, Bihar, Jharkhand, Odisha, Assam & North-East States',
      states: [
        'West Bengal',
        'Bihar',
        'Jharkhand',
        'Odisha',
        'Assam',
        'Arunachal Pradesh',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Tripura',
        'Sikkim',
      ],
    },
    west: {
      id: 'west',
      name: 'West',
      fee: 59,
      enabled: true,
      estimatedDays: '2-4 Business Days',
      description: 'Maharashtra, Gujarat, Madhya Pradesh, Chhattisgarh, Daman & Diu',
      states: [
        'Maharashtra',
        'Gujarat',
        'Madhya Pradesh',
        'Chhattisgarh',
        'Dadra and Nagar Haveli and Daman and Diu',
      ],
    },
  },
}

export const SEED_ORDERS: any[] = []

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const SETTINGS_FILE = path.join(DATA_DIR, 'db-settings.json')
const PRODUCTS_FILE = path.join(DATA_DIR, 'db-products.json')
const ORDERS_FILE = path.join(DATA_DIR, 'db-orders.json')
const DELIVERY_FILE = path.join(DATA_DIR, 'db-delivery.json')

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// High-speed In-Memory Cache Layer with Micro-TTL & Mutation Invalidation
let cachedSettings: { data: BrandingSettings; expiresAt: number } | null = null
let cachedDelivery: { data: RegionalDeliverySettings; expiresAt: number } | null = null
let cachedProducts: { data: Product[]; expiresAt: number } | null = null
let cachedOrders: { data: any[]; expiresAt: number } | null = null

const SETTINGS_TTL_MS = 120 * 1000 // 2 minutes
const DELIVERY_TTL_MS = 120 * 1000 // 2 minutes
const PRODUCTS_TTL_MS = 60 * 1000  // 60 seconds
const ORDERS_TTL_MS = 15 * 1000    // 15 seconds

export function invalidateAllCaches() {
  cachedSettings = null
  cachedDelivery = null
  cachedProducts = null
  cachedOrders = null
}

// In-memory fallback in case filesystem is restricted or read-only
let memorySettings: BrandingSettings = { ...DEFAULT_BRANDING }
let memoryProducts: Product[] = [...allInitialProducts]
let memoryOrders: any[] = []
let memoryDelivery: RegionalDeliverySettings = JSON.parse(JSON.stringify(DEFAULT_DELIVERY_SETTINGS))

export async function getSettings(): Promise<BrandingSettings> {
  const now = Date.now()
  if (cachedSettings && cachedSettings.expiresAt > now) {
    return cachedSettings.data
  }

  // 1. Try MongoDB Atlas
  try {
    const db = await getDb()
    const doc = await db.collection('settings').findOne({ _id: 'global_settings' as any })
    if (doc) {
      const { _id, ...rest } = doc
      memorySettings = { ...DEFAULT_BRANDING, ...rest } as BrandingSettings
      cachedSettings = { data: memorySettings, expiresAt: now + SETTINGS_TTL_MS }
      return memorySettings
    }
    // Seed default settings into MongoDB
    await db.collection('settings').updateOne(
      { _id: 'global_settings' as any },
      { $set: { ...DEFAULT_BRANDING, updatedAt: new Date() } },
      { upsert: true }
    )
    cachedSettings = { data: memorySettings, expiresAt: now + SETTINGS_TTL_MS }
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
      cachedSettings = { data: memorySettings, expiresAt: now + SETTINGS_TTL_MS }
      return memorySettings
    }
    const raw = await fs.promises.readFile(SETTINGS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    memorySettings = { ...DEFAULT_BRANDING, ...parsed }
    cachedSettings = { data: memorySettings, expiresAt: now + SETTINGS_TTL_MS }
    return memorySettings
  } catch (err) {
    cachedSettings = { data: memorySettings, expiresAt: now + SETTINGS_TTL_MS }
    return memorySettings
  }
}

export async function saveSettings(settings: Partial<BrandingSettings>): Promise<BrandingSettings> {
  cachedSettings = null
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
  cachedSettings = { data: updated, expiresAt: Date.now() + SETTINGS_TTL_MS }
  return updated
}

export async function getProducts(): Promise<Product[]> {
  const now = Date.now()
  if (cachedProducts && cachedProducts.expiresAt > now) {
    return cachedProducts.data
  }

  // 1. Try MongoDB Atlas (single round-trip: no redundant countDocuments)
  try {
    const db = await getDb()
    const collection = db.collection<Product>('products')

    const docs = await collection.find({}).sort({ _id: -1 }).toArray()
    if (docs.length === 0) {
      // Auto-seed initial catalog to MongoDB Atlas
      await collection.insertMany(allInitialProducts.map((p) => ({ ...p })))
      memoryProducts = [...allInitialProducts]
      cachedProducts = { data: memoryProducts, expiresAt: now + PRODUCTS_TTL_MS }
      return memoryProducts
    }

    const cleanDocs = docs.map((doc: any) => {
      const { _id, ...rest } = doc
      return {
        ...rest,
        id: rest.id || _id.toString(),
      } as Product
    })

    // Return unique products deduplicated by id
    const seenIds = new Set<string>()
    const uniqueDocs: Product[] = []
    for (const p of cleanDocs) {
      const key = String(p.id)
      if (!seenIds.has(key)) {
        seenIds.add(key)
        uniqueDocs.push(p)
      }
    }

    memoryProducts = uniqueDocs
    cachedProducts = { data: uniqueDocs, expiresAt: now + PRODUCTS_TTL_MS }
    return uniqueDocs
  } catch (mongoErr) {
    console.warn('MongoDB getProducts fallback to disk:', mongoErr)
  }

  // 2. Disk / memory fallback
  try {
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(PRODUCTS_FILE)) {
      await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(allInitialProducts, null, 2), 'utf8')
      memoryProducts = [...allInitialProducts]
      cachedProducts = { data: memoryProducts, expiresAt: now + PRODUCTS_TTL_MS }
      return memoryProducts
    }
    const raw = await fs.promises.readFile(PRODUCTS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryProducts = parsed
      cachedProducts = { data: parsed, expiresAt: now + PRODUCTS_TTL_MS }
      return parsed
    }
    cachedProducts = { data: memoryProducts, expiresAt: now + PRODUCTS_TTL_MS }
    return memoryProducts
  } catch (err) {
    cachedProducts = { data: memoryProducts, expiresAt: now + PRODUCTS_TTL_MS }
    return memoryProducts
  }
}

export async function saveAllProducts(products: Product[]): Promise<Product[]> {
  cachedProducts = null
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
  cachedProducts = { data: products, expiresAt: Date.now() + PRODUCTS_TTL_MS }
  return products
}

export async function addProductToDb(product: Product): Promise<Product[]> {
  cachedProducts = null
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
  cachedProducts = { data: next, expiresAt: Date.now() + PRODUCTS_TTL_MS }
  return next
}

export async function updateProductInDb(id: number | string, data: Partial<Product>): Promise<Product[]> {
  cachedProducts = null
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
  cachedProducts = { data: next, expiresAt: Date.now() + PRODUCTS_TTL_MS }
  return next
}

export async function deleteProductFromDb(id: number | string): Promise<Product[]> {
  cachedProducts = null
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
  cachedProducts = { data: next, expiresAt: Date.now() + PRODUCTS_TTL_MS }
  return next
}

export async function getOrders(): Promise<any[]> {
  const now = Date.now()
  if (cachedOrders && cachedOrders.expiresAt > now) {
    return cachedOrders.data
  }

  // 1. Try MongoDB Atlas (single query, no redundant countDocuments)
  try {
    const db = await getDb()
    const collection = db.collection('orders')
    const docs = await collection.find({}).sort({ _id: -1 }).toArray()
    if (docs.length === 0) {
      memoryOrders = []
      cachedOrders = { data: [], expiresAt: now + ORDERS_TTL_MS }
      return []
    }

    const cleanDocs = docs.map((doc: any) => {
      const { _id, ...rest } = doc
      return {
        ...rest,
        id: rest.orderId || rest.id || _id.toString(),
      }
    })
    memoryOrders = cleanDocs
    cachedOrders = { data: cleanDocs, expiresAt: now + ORDERS_TTL_MS }
    return cleanDocs
  } catch (mongoErr) {
    console.warn('MongoDB getOrders fallback to disk:', mongoErr)
  }

  // 2. Disk / memory fallback
  try {
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(ORDERS_FILE)) {
      await fs.promises.writeFile(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8')
      memoryOrders = []
      cachedOrders = { data: [], expiresAt: now + ORDERS_TTL_MS }
      return []
    }
    const raw = await fs.promises.readFile(ORDERS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      memoryOrders = parsed
      cachedOrders = { data: parsed, expiresAt: now + ORDERS_TTL_MS }
      return parsed
    }
    cachedOrders = { data: memoryOrders, expiresAt: now + ORDERS_TTL_MS }
    return memoryOrders
  } catch (err) {
    cachedOrders = { data: memoryOrders, expiresAt: now + ORDERS_TTL_MS }
    return memoryOrders
  }
}

export async function addOrderToDb(order: any): Promise<any[]> {
  cachedOrders = null
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
  cachedOrders = { data: next, expiresAt: Date.now() + ORDERS_TTL_MS }
  return next
}

export async function updateOrderStatusInDb(orderId: string, status: string): Promise<any[]> {
  cachedOrders = null
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
  cachedOrders = { data: next, expiresAt: Date.now() + ORDERS_TTL_MS }
  return next
}

export async function getDeliverySettings(): Promise<RegionalDeliverySettings> {
  const now = Date.now()
  if (cachedDelivery && cachedDelivery.expiresAt > now) {
    return cachedDelivery.data
  }

  // 1. Try MongoDB Atlas
  try {
    const db = await getDb()
    const doc = await db.collection('delivery_settings').findOne({ _id: 'regional_delivery' as any })
    if (doc) {
      const { _id, ...rest } = doc
      const merged: RegionalDeliverySettings = {
        ...DEFAULT_DELIVERY_SETTINGS,
        ...rest,
        regions: {
          north: { ...DEFAULT_DELIVERY_SETTINGS.regions.north, ...(rest.regions?.north || {}) },
          south: { ...DEFAULT_DELIVERY_SETTINGS.regions.south, ...(rest.regions?.south || {}) },
          east: { ...DEFAULT_DELIVERY_SETTINGS.regions.east, ...(rest.regions?.east || {}) },
          west: { ...DEFAULT_DELIVERY_SETTINGS.regions.west, ...(rest.regions?.west || {}) },
        },
      }
      memoryDelivery = merged
      cachedDelivery = { data: merged, expiresAt: now + DELIVERY_TTL_MS }
      return merged
    }

    // Seed default regional delivery into MongoDB
    await db.collection('delivery_settings').updateOne(
      { _id: 'regional_delivery' as any },
      { $set: { ...DEFAULT_DELIVERY_SETTINGS, updatedAt: new Date() } },
      { upsert: true }
    )
    cachedDelivery = { data: memoryDelivery, expiresAt: now + DELIVERY_TTL_MS }
    return memoryDelivery
  } catch (mongoErr) {
    console.warn('MongoDB delivery settings fetch fallback to disk:', mongoErr)
  }

  // 2. Disk / memory fallback
  try {
    ensureDirExists(DATA_DIR)
    if (!fs.existsSync(DELIVERY_FILE)) {
      await fs.promises.writeFile(DELIVERY_FILE, JSON.stringify(DEFAULT_DELIVERY_SETTINGS, null, 2), 'utf8')
      memoryDelivery = JSON.parse(JSON.stringify(DEFAULT_DELIVERY_SETTINGS))
      cachedDelivery = { data: memoryDelivery, expiresAt: now + DELIVERY_TTL_MS }
      return memoryDelivery
    }
    const raw = await fs.promises.readFile(DELIVERY_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    const merged: RegionalDeliverySettings = {
      ...DEFAULT_DELIVERY_SETTINGS,
      ...parsed,
      regions: {
        north: { ...DEFAULT_DELIVERY_SETTINGS.regions.north, ...(parsed.regions?.north || {}) },
        south: { ...DEFAULT_DELIVERY_SETTINGS.regions.south, ...(parsed.regions?.south || {}) },
        east: { ...DEFAULT_DELIVERY_SETTINGS.regions.east, ...(parsed.regions?.east || {}) },
        west: { ...DEFAULT_DELIVERY_SETTINGS.regions.west, ...(parsed.regions?.west || {}) },
      },
    }
    memoryDelivery = merged
    cachedDelivery = { data: merged, expiresAt: now + DELIVERY_TTL_MS }
    return merged
  } catch (err) {
    cachedDelivery = { data: memoryDelivery, expiresAt: now + DELIVERY_TTL_MS }
    return memoryDelivery
  }
}

export async function saveDeliverySettings(settings: Partial<RegionalDeliverySettings>): Promise<RegionalDeliverySettings> {
  cachedDelivery = null
  const current = await getDeliverySettings()
  const updated: RegionalDeliverySettings = {
    ...current,
    ...settings,
    regions: {
      north: { ...current.regions.north, ...(settings.regions?.north || {}) },
      south: { ...current.regions.south, ...(settings.regions?.south || {}) },
      east: { ...current.regions.east, ...(settings.regions?.east || {}) },
      west: { ...current.regions.west, ...(settings.regions?.west || {}) },
    },
    updatedAt: new Date().toISOString(),
  }

  // 1. Save to MongoDB Atlas
  try {
    const db = await getDb()
    await db.collection('delivery_settings').updateOne(
      { _id: 'regional_delivery' as any },
      { $set: { ...updated, updatedAt: new Date() } },
      { upsert: true }
    )
  } catch (mongoErr) {
    console.warn('MongoDB saveDeliverySettings fallback:', mongoErr)
  }

  // 2. Save to local disk & memory fallback
  try {
    ensureDirExists(DATA_DIR)
    await fs.promises.writeFile(DELIVERY_FILE, JSON.stringify(updated, null, 2), 'utf8')
  } catch (err) {
    // Memory fallback
  }

  memoryDelivery = updated
  cachedDelivery = { data: updated, expiresAt: Date.now() + DELIVERY_TTL_MS }
  return updated
}

export async function validateAndCalculateDelivery(regionInput: string): Promise<{
  valid: boolean
  regionKey: RegionKey | null
  regionName: string
  fee: number
  enabled: boolean
  estimatedDays: string
  error?: string
}> {
  const settings = await getDeliverySettings()
  const clean = String(regionInput || '').trim().toLowerCase()

  let key: RegionKey | null = null
  if (clean === 'north') key = 'north'
  else if (clean === 'south') key = 'south'
  else if (clean === 'east') key = 'east'
  else if (clean === 'west') key = 'west'

  if (!key) {
    return {
      valid: false,
      regionKey: null,
      regionName: '',
      fee: 0,
      enabled: false,
      estimatedDays: '',
      error: `Invalid delivery region "${regionInput}". Must be one of North, South, East, or West.`,
    }
  }

  const regionConfig = settings.regions[key]
  if (!regionConfig || !regionConfig.enabled) {
    return {
      valid: false,
      regionKey: key,
      regionName: regionConfig?.name || key.toUpperCase(),
      fee: regionConfig?.fee || 0,
      enabled: false,
      estimatedDays: regionConfig?.estimatedDays || '',
      error: `Delivery to ${regionConfig?.name || key.toUpperCase()} region is currently suspended by administration.`,
    }
  }

  return {
    valid: true,
    regionKey: key,
    regionName: regionConfig.name,
    fee: Number(regionConfig.fee) || 0,
    enabled: true,
    estimatedDays: regionConfig.estimatedDays || '2-5 Business Days',
  }
}


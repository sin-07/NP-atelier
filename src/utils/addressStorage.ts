export interface SavedShippingAddress {
  fullName: string
  phone: string
  email?: string
  address: string
  city: string
  state: string
  zip: string
  isDefault?: boolean
  updatedAt?: number
}

const PRIMARY_ADDRESS_KEY = 'ateliernp-saved-shipping-address'
const ADDRESS_BOOK_KEY = 'ateliernp-address-book'

/**
 * Sanitize 10-digit Indian mobile number for reliable index lookup
 */
export function sanitizePhoneNumber(phoneRaw: string): string {
  const digits = (phoneRaw || '').replace(/[^0-9]/g, '')
  return digits.length >= 10 ? digits.slice(-10) : digits
}

/**
 * Retrieve primary saved shipping address from browser localStorage
 */
export function getSavedShippingAddress(): SavedShippingAddress | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(PRIMARY_ADDRESS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedShippingAddress
    if (parsed && (parsed.address?.trim() || parsed.phone?.trim() || parsed.fullName?.trim())) {
      return parsed
    }
    return null
  } catch (err) {
    console.warn('Could not read saved shipping address:', err)
    return null
  }
}

/**
 * Persist shipping address to browser localStorage and update address book index
 */
export function saveShippingAddress(addr: Partial<SavedShippingAddress>): SavedShippingAddress | null {
  if (typeof window === 'undefined') return null
  try {
    const current = getSavedShippingAddress() || {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
    }

    const merged: SavedShippingAddress = {
      fullName: (addr.fullName ?? current.fullName ?? '').trim(),
      phone: (addr.phone ?? current.phone ?? '').trim(),
      email: (addr.email ?? current.email ?? '').trim(),
      address: (addr.address ?? current.address ?? '').trim(),
      city: (addr.city ?? current.city ?? '').trim(),
      state: (addr.state ?? current.state ?? '').trim(),
      zip: (addr.zip ?? current.zip ?? '').trim(),
      isDefault: true,
      updatedAt: Date.now(),
    }

    // Only persist if there's meaningful data
    if (merged.address || merged.phone || merged.fullName) {
      window.localStorage.setItem(PRIMARY_ADDRESS_KEY, JSON.stringify(merged))

      // Also maintain address book indexed by phone and email
      const phoneClean = sanitizePhoneNumber(merged.phone)
      const emailClean = (merged.email || '').toLowerCase().trim()

      const rawBook = window.localStorage.getItem(ADDRESS_BOOK_KEY)
      const book: Record<string, SavedShippingAddress> = rawBook ? JSON.parse(rawBook) : {}

      if (phoneClean.length === 10) {
        book[`phone:${phoneClean}`] = merged
      }
      if (emailClean && emailClean.includes('@')) {
        book[`email:${emailClean}`] = merged
      }

      window.localStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(book))
      return merged
    }
    return null
  } catch (err) {
    console.warn('Could not save shipping address:', err)
    return null
  }
}

/**
 * Look up a saved address by customer phone number
 */
export function findAddressByPhone(phoneRaw: string): SavedShippingAddress | null {
  if (typeof window === 'undefined') return null
  const clean = sanitizePhoneNumber(phoneRaw)
  if (clean.length !== 10) return null

  try {
    const rawBook = window.localStorage.getItem(ADDRESS_BOOK_KEY)
    if (!rawBook) return null
    const book: Record<string, SavedShippingAddress> = JSON.parse(rawBook)
    return book[`phone:${clean}`] || null
  } catch {
    return null
  }
}

/**
 * Look up a saved address by customer email
 */
export function findAddressByEmail(emailRaw: string): SavedShippingAddress | null {
  if (typeof window === 'undefined') return null
  const clean = (emailRaw || '').toLowerCase().trim()
  if (!clean || !clean.includes('@')) return null

  try {
    const rawBook = window.localStorage.getItem(ADDRESS_BOOK_KEY)
    if (!rawBook) return null
    const book: Record<string, SavedShippingAddress> = JSON.parse(rawBook)
    return book[`email:${clean}`] || null
  } catch {
    return null
  }
}

/**
 * Format address into single line string
 */
export function formatAddressOneLine(addr?: Partial<SavedShippingAddress> | null): string {
  if (!addr) return ''
  const parts = [
    addr.address?.trim(),
    addr.city?.trim(),
    addr.state?.trim(),
    addr.zip?.trim() ? `- ${addr.zip.trim()}` : '',
  ].filter(Boolean)
  return parts.join(', ').replace(', - ', ' - ')
}

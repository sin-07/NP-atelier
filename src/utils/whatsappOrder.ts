/**
 * WhatsApp Order & Image Integration Utility for NP Atelier
 * Formats rich order messages and handles photo sharing / links for WhatsApp
 */

export function getAbsoluteImageUrl(imgSrc?: string): string {
  if (!imgSrc) return ''
  const clean = String(imgSrc).trim()
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean
  }
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    return `${origin}${clean.startsWith('/') ? '' : '/'}${clean}`
  }
  return clean
}

export interface SingleProductOrderParams {
  storeName?: string
  contactPhone?: string
  title: string
  price: string | number
  quantity?: number
  category?: string
  department?: string
  image?: string
  isComingSoon?: boolean
  description?: string
}

export function buildSingleProductWhatsAppMessage(params: SingleProductOrderParams): string {
  const store = params.storeName || 'NP Atelier'
  const qty = params.quantity && params.quantity > 1 ? params.quantity : 1
  const imgUrl = getAbsoluteImageUrl(params.image)
  const dept = params.department === 'aquarium' ? 'Exotic Aquatics (Acquario Tropicale)' : 'Artisan Handmade Crafts'

  if (params.isComingSoon) {
    return `*✦ NOTIFY ON LAUNCH INQUIRY ✦*
*Store:* ${store}
*Item:* ${params.title}
*Price:* ${params.price}
*Department:* ${dept}
${imgUrl ? `📸 *Product Photo:* ${imgUrl}\n` : ''}
_Hi ${store}, please notify me when "${params.title}" launches and becomes available for order!_`
  }

  return `*✦ NEW PRODUCT ORDER ✦*
*Store:* ${store}
*Item:* ${params.title}
*Price:* ${params.price}${qty > 1 ? ` (Qty: ${qty})` : ''}
*Category:* ${params.category || 'Handmade Craft'}
*Department:* ${dept}
${imgUrl ? `📸 *Product Photo Preview:* ${imgUrl}\n` : ''}
_Hi ${store}, I would like to order this item directly. Please confirm availability & dispatch tracking details!_`
}

export interface MultiItemCartOrderParams {
  storeName?: string
  orderId?: string
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  cartItems: Array<{
    title: string
    quantity: number
    price: string | number
    image?: string
    customization?: any
  }>
  subtotal: number
  discountAmount?: number
  couponCode?: string
  shippingCost?: number
  total: number
  paymentMethod?: string
}

export function buildCartWhatsAppMessage(params: MultiItemCartOrderParams): string {
  const store = params.storeName || 'NP Atelier'
  const ref = params.orderId || `CRFT-${Math.floor(100000 + Math.random() * 900000)}`
  const dateStr = new Date().toLocaleDateString('en-IN')

  const itemsList = params.cartItems
    .map((item, idx) => {
      const customText = item.customization
        ? ` [Custom: ${item.customization.palette || ''}${
            item.customization.personalization ? ` / "${item.customization.personalization}"` : ''
          }]`
        : ''
      const photoUrl = getAbsoluteImageUrl(item.image)
      return `${idx + 1}. *${item.title}* x ${item.quantity} (${item.price})${customText}${
        photoUrl ? `\n   📸 Photo: ${photoUrl}` : ''
      }`
    })
    .join('\n\n')

  const discountText =
    params.discountAmount && params.discountAmount > 0
      ? `• *Discount:* -₹${params.discountAmount.toFixed(0)} (${params.couponCode || 'COUPON'})\n`
      : ''

  const custName = params.customerName || 'Customer'
  const custPhone = params.customerPhone ? `• *Mobile:* ${params.customerPhone}\n` : ''
  const custAddr = params.customerAddress || 'Will provide in WhatsApp chat'

  return `*✦ NEW WHATSAPP ORDER ✦*
*Store:* ${store}
*Order Reference:* #${ref}
*Date:* ${dateStr}

*CUSTOMER DETAILS:*
• *Name:* ${custName}
${custPhone}• *Delivery Address:* ${custAddr}

*ORDERED ITEMS (${params.cartItems.length}):*
${itemsList}

*PAYMENT & TOTAL:*
• *Items Subtotal:* ₹${params.subtotal.toFixed(0)}
${discountText}• *Courier Shipping:* ₹${(params.shippingCost || 0).toFixed(0)}
• *Total Payable:* ₹${params.total.toFixed(0)}
• *Payment Mode:* ${params.paymentMethod || 'WhatsApp Order Confirmation (Pay on Delivery / UPI)'}

_Please confirm my order, product availability, and dispatch tracking details!_`
}

/**
 * Triggers WhatsApp share:
 * - On supported mobile browsers, attempts native Web Share API with the real image file
 * - Falls back seamlessly to wa.me with rich image link preview
 */
export async function sendWhatsAppOrder({
  phone,
  message,
  imageUrl,
  imageFilename = 'np-atelier-product.jpg',
}: {
  phone: string
  message: string
  imageUrl?: string
  imageFilename?: string
}): Promise<boolean> {
  const cleanPhone = phone.replace(/[^0-9]/g, '') || '919341297124'
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

  // 1. Mobile file share attempt via Web Share API
  if (
    typeof navigator !== 'undefined' &&
    typeof window !== 'undefined' &&
    navigator.share &&
    navigator.canShare &&
    imageUrl
  ) {
    try {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      if (isMobile) {
        const fullUrl = getAbsoluteImageUrl(imageUrl)
        const response = await fetch(fullUrl, { mode: 'cors' })
        if (response.ok) {
          const blob = await response.blob()
          const file = new File([blob], imageFilename, {
            type: blob.type || 'image/jpeg',
          })
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              text: message,
              title: 'NP Atelier Order',
            })
            return true
          }
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // User closed native share sheet intentionally
        return false
      }
      // On CORS failure or Web Share rejection, fall through to wa.me
      console.warn('Native file share skipped, using direct WhatsApp link:', err)
    }
  }

  // 2. Direct WhatsApp URL fallback with rich photo preview
  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank')
  }
  return true
}

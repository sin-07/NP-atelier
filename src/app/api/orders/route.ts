import { NextResponse } from 'next/server'
import {
  getOrders,
  addOrderToDb,
  updateOrderStatusInDb,
  validateAndCalculateDelivery,
} from '../../../lib/serverDb'

export async function GET() {
  try {
    const orders = await getOrders()
    return NextResponse.json({ success: true, orders })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1. Identify selected delivery region
    const regionInput =
      body.deliveryRegion ||
      body.customer?.deliveryRegion ||
      body.customer?.region ||
      body.region ||
      'north'

    // 2. Validate region and fetch verified charge from database
    const deliveryCheck = await validateAndCalculateDelivery(regionInput)
    if (!deliveryCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: deliveryCheck.error || 'Invalid or disabled delivery region selected.',
        },
        { status: 400 }
      )
    }

    const verifiedDeliveryFee = deliveryCheck.fee
    const verifiedRegionName = deliveryCheck.regionName
    const verifiedRegionKey = deliveryCheck.regionKey

    // 3. Recalculate subtotal from item list securely to prevent price tampering
    let calculatedSubtotal = 0
    if (Array.isArray(body.items) && body.items.length > 0) {
      for (const item of body.items) {
        const rawPrice =
          typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
            : Number(item.price) || 0
        const qty = Math.max(1, Number(item.quantity) || 1)
        calculatedSubtotal += rawPrice * qty
      }
    } else {
      calculatedSubtotal = Math.max(0, Number(body.subtotal) || 0)
    }

    // 4. Secure discount validation
    const declaredDiscount = Math.max(0, Number(body.discount) || 0)
    const verifiedDiscount = Math.min(declaredDiscount, calculatedSubtotal)

    // 5. Calculate verified total: Subtotal - Discount + Verified Regional Delivery Fee
    const verifiedTotal = Math.max(0, calculatedSubtotal - verifiedDiscount + verifiedDeliveryFee)

    const newOrder = {
      ...body,
      orderId: body.orderId || `CRFT-${Math.floor(100000 + Math.random() * 900000)}`,
      date:
        body.date ||
        new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: body.status || 'Aquatic & Craft Packing',
      // Regional delivery details saved with order
      deliveryRegion: verifiedRegionName,
      deliveryRegionKey: verifiedRegionKey,
      deliveryFee: verifiedDeliveryFee,
      shipping: verifiedDeliveryFee, // backward compatibility
      subtotal: calculatedSubtotal,
      discount: verifiedDiscount,
      total: verifiedTotal,
      customer: {
        ...(body.customer || {}),
        deliveryRegion: verifiedRegionName,
        deliveryFee: verifiedDeliveryFee,
      },
      estimatedDelivery:
        body.estimatedDelivery ||
        new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
        }),
    }

    const updatedList = await addOrderToDb(newOrder)
    return NextResponse.json({ success: true, order: newOrder, orders: updatedList })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json()
    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'orderId and status required' }, { status: 400 })
    }

    const updatedList = await updateOrderStatusInDb(orderId, status)
    return NextResponse.json({ success: true, orders: updatedList })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getOrders, addOrderToDb, updateOrderStatusInDb } from '../../../lib/serverDb'

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
    const newOrder = {
      ...body,
      orderId: body.orderId || `CRFT-${Math.floor(100000 + Math.random() * 900000)}`,
      date:
        body.date ||
        new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: body.status || 'Aquatic & Craft Packing',
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

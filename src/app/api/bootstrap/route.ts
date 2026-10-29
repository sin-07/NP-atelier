import { NextResponse } from 'next/server'
import { getSettings, getDeliverySettings, getProducts } from '../../../lib/serverDb'

export async function GET() {
  try {
    const [settings, delivery, products] = await Promise.all([
      getSettings(),
      getDeliverySettings(),
      getProducts(),
    ])

    return NextResponse.json(
      {
        success: true,
        settings,
        delivery,
        products,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

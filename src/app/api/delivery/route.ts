import { NextResponse } from 'next/server'
import { getDeliverySettings, saveDeliverySettings } from '../../../lib/serverDb'

export async function GET() {
  try {
    const settings = await getDeliverySettings()
    return NextResponse.json({ success: true, settings })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid delivery settings payload' }, { status: 400 })
    }

    const updated = await saveDeliverySettings(body)
    return NextResponse.json({ success: true, settings: updated })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

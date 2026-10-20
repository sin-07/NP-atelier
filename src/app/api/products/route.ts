import { NextResponse } from 'next/server'
import {
  getProducts,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb,
} from '../../../lib/serverDb'
import { Product } from '../../../data/products'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ success: true, products })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body: Product = await req.json()
    if (!body.title || !body.price || !body.category) {
      return NextResponse.json({ success: false, error: 'Missing required product fields' }, { status: 400 })
    }

    const newProduct: Product = {
      ...body,
      id: body.id || Date.now(),
      rating: body.rating || 5.0,
      reviews: body.reviews || 1,
      stock: body.stock !== undefined ? Number(body.stock) : 20,
    }

    const updatedList = await addProductToDb(newProduct)
    return NextResponse.json({ success: true, product: newProduct, products: updatedList })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product id is required' }, { status: 400 })
    }

    const updatedList = await updateProductInDb(id, data)
    const updatedProduct = updatedList.find((p: any) => String(p.id) === String(id))
    return NextResponse.json({ success: true, product: updatedProduct, products: updatedList })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product id is required' }, { status: 400 })
    }

    const updatedList = await deleteProductFromDb(id)
    return NextResponse.json({ success: true, products: updatedList })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

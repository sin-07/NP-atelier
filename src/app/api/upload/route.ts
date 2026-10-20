import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { uploadToCloudinary } from '../../../lib/cloudinary'

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

    // 1. Handle multipart/form-data file uploads
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Try uploading to Cloudinary
      try {
        const originalName = file.name || 'image.png'
        const ext = path.extname(originalName) || '.png'
        const cleanBase = path
          .basename(originalName, ext)
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .slice(0, 30)
        const publicId = `${cleanBase}_${Date.now()}`

        const cloudRes = await uploadToCloudinary(buffer, {
          folder: 'atelier_craft_marketplace',
          publicId,
        })

        return NextResponse.json({
          success: true,
          url: cloudRes.secure_url,
          publicId: cloudRes.public_id,
          provider: 'cloudinary',
        })
      } catch (cloudErr: any) {
        console.warn('Cloudinary upload warning (falling back to local storage):', cloudErr.message)

        // Fallback to local storage
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        const originalName = file.name || 'image.png'
        const ext = path.extname(originalName) || '.png'
        const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30)
        const filename = `${cleanBase}-${Date.now()}${ext}`
        const filepath = path.join(uploadsDir, filename)

        await fs.promises.writeFile(filepath, buffer)
        return NextResponse.json({
          success: true,
          url: `/uploads/${filename}`,
          filename,
          provider: 'local_fallback',
        })
      }
    }

    // 2. Handle JSON base64 dataUrl uploads
    const body = await req.json()
    if (body.dataUrl) {
      try {
        const cloudRes = await uploadToCloudinary(body.dataUrl, {
          folder: 'atelier_craft_marketplace',
        })

        return NextResponse.json({
          success: true,
          url: cloudRes.secure_url,
          publicId: cloudRes.public_id,
          provider: 'cloudinary',
        })
      } catch (cloudErr: any) {
        console.warn('Cloudinary base64 upload warning (falling back to local):', cloudErr.message)

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        const matches = body.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        if (matches && matches.length === 3) {
          const mimeType = matches[1]
          const base64Data = matches[2]
          const ext = mimeType.includes('png') ? '.png' : mimeType.includes('jpeg') || mimeType.includes('jpg') ? '.jpg' : '.png'
          const filename = `upload-${Date.now()}${ext}`
          const filepath = path.join(uploadsDir, filename)
          const buffer = Buffer.from(base64Data, 'base64')

          await fs.promises.writeFile(filepath, buffer)
          return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`,
            filename,
            provider: 'local_fallback',
          })
        }
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid upload payload' }, { status: 400 })
  } catch (err: any) {
    console.error('File upload failed:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

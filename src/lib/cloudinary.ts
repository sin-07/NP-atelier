import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

// Configure Cloudinary with environment variables or provided credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  format?: string
  width?: number
  height?: number
  bytes?: number
}

/**
 * Upload a Buffer or Base64 data string to Cloudinary
 */
export async function uploadToCloudinary(
  fileData: Buffer | string,
  options: {
    folder?: string
    publicId?: string
    resourceType?: 'image' | 'video' | 'raw' | 'auto'
  } = {}
): Promise<CloudinaryUploadResult> {
  const folder = options.folder || 'atelier_craft_marketplace'
  const resourceType = options.resourceType || 'image'

  // If base64 string, upload directly
  if (typeof fileData === 'string' && fileData.startsWith('data:')) {
    const result: UploadApiResponse = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: resourceType,
      public_id: options.publicId,
      overwrite: true,
    })

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    }
  }

  // If buffer, use upload_stream
  const buffer = Buffer.isBuffer(fileData) ? fileData : Buffer.from(fileData)

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: options.publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary stream upload returned an empty response'))
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          })
        }
      }
    )

    stream.end(buffer)
  })
}

export { cloudinary }

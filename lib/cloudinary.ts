import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export async function uploadImage(
  file: string,
  folder = 'brocante'
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      { width: 1200, height: 1200, crop: 'limit' },
    ],
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function getOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  const { width = 800, height, quality = 'auto' } = options

  // Transform Cloudinary URL to add optimizations
  if (!url.includes('res.cloudinary.com')) return url

  const transformations = [`q_${quality}`, 'f_auto', `w_${width}`]
  if (height) transformations.push(`h_${height}`, 'c_fill')

  return url.replace('/upload/', `/upload/${transformations.join(',')}/`)
}

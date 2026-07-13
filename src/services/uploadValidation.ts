import type { MediaType } from '../types/domain'

const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const videoMimeTypes = new Set(['video/mp4', 'video/webm'])
const imageMaxSize = 10 * 1024 * 1024
const videoMaxSize = 50 * 1024 * 1024

export interface UploadFileLike {
  name: string
  type: string
  size: number
}

export type UploadValidationResult =
  | { ok: true; mediaType: MediaType }
  | { ok: false; message: string }

export function validateUploadFile(file: UploadFileLike): UploadValidationResult {
  if (imageMimeTypes.has(file.type)) {
    if (file.size > imageMaxSize) return { ok: false, message: '图片不能超过 10MB。' }
    return { ok: true, mediaType: 'image' }
  }

  if (videoMimeTypes.has(file.type)) {
    if (file.size > videoMaxSize) return { ok: false, message: '视频不能超过 50MB。' }
    return { ok: true, mediaType: 'video' }
  }

  return { ok: false, message: '仅支持 JPG、PNG、WebP、AVIF、MP4、WebM。' }
}

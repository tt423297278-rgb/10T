import { validateUploadFile, type UploadFileLike } from '../../services/uploadValidation'

export const canteenRatingImageLimit = 4
export const canteenRatingImageAccept = 'image/jpeg,image/png,image/webp,image/avif'

export type CanteenRatingImageValidationResult =
  | { ok: true }
  | { ok: false; message: string }

export function validateCanteenRatingImages(
  files: UploadFileLike[],
  existingCount = 0,
): CanteenRatingImageValidationResult {
  if (existingCount + files.length > canteenRatingImageLimit) {
    return { ok: false, message: `每次评价最多上传 ${canteenRatingImageLimit} 张图片。` }
  }

  for (const file of files) {
    const validation = validateUploadFile(file)
    if (!validation.ok) return validation
    if (validation.mediaType !== 'image') {
      return { ok: false, message: '评价图片暂不支持视频，请选择 JPG、PNG、WebP 或 AVIF。' }
    }
  }

  return { ok: true }
}

import { describe, expect, it } from 'vitest'
import { canteenRatingImageLimit, validateCanteenRatingImages } from './canteenRatingPhotos'

const image = { name: 'meal.webp', type: 'image/webp', size: 1024 * 1024 }

describe('validateCanteenRatingImages', () => {
  it('accepts up to four supported images', () => {
    expect(validateCanteenRatingImages(Array.from({ length: canteenRatingImageLimit }, () => image))).toEqual({ ok: true })
  })

  it('counts images already selected', () => {
    expect(validateCanteenRatingImages([image, image], 3)).toEqual({
      ok: false,
      message: '每次评价最多上传 4 张图片。',
    })
  })

  it('rejects videos and oversized images', () => {
    expect(validateCanteenRatingImages([{ name: 'meal.mp4', type: 'video/mp4', size: 1024 }]).ok).toBe(false)
    expect(validateCanteenRatingImages([{ name: 'huge.jpg', type: 'image/jpeg', size: 11 * 1024 * 1024 }]).ok).toBe(false)
  })
})

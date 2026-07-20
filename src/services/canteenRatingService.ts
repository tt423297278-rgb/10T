import { supabase } from '../lib/supabase/client'
import {
  normalizeCanteenRatingReview,
  validateCanteenRatingReview,
  validateCanteenRatingScores,
} from '../features/canteen/canteenRatings'
import {
  canteenRatingImageLimit,
  validateCanteenRatingImages,
} from '../features/canteen/canteenRatingPhotos'
import type { CanteenRating, CanteenRatingScores, CanteenRatingSummary } from '../types/domain'

interface RatingSummaryRow {
  place_id: string
  rating_count: number | string
  taste_avg: number | string
  service_avg: number | string
  value_avg: number | string
  environment_avg: number | string
  overall_avg: number | string
}

interface OwnRatingRow {
  place_id: string
  taste_score: number | string
  service_score: number | string
  value_score: number | string
  environment_score: number | string
  review_text: string | null
  updated_at: string
}

async function requireUserId() {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Authentication required')
  return data.user.id
}

function toNumber(value: number | string) {
  return Number(value)
}

async function uploadRatingImages(ratingId: string, userId: string, imageFiles: File[]) {
  if (!supabase || !imageFiles.length) return

  const validation = validateCanteenRatingImages(imageFiles)
  if (!validation.ok) throw new Error(validation.message)

  const { count, error: countError } = await supabase
    .from('canteen_rating_media')
    .select('id', { count: 'exact', head: true })
    .eq('rating_id', ratingId)
  if (countError) throw countError
  const existingCount = count ?? 0
  if (existingCount + imageFiles.length > canteenRatingImageLimit) {
    throw new Error(`Canteen rating photo limit exceeded: ${canteenRatingImageLimit}`)
  }

  const uploaded: Array<{ path: string; file: File }> = []
  try {
    for (const [index, file] of imageFiles.entries()) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = `${userId}/${ratingId}/${Date.now()}-${index}-${safeName}`
      const { error: uploadError } = await supabase.storage.from('canteen-rating-media').upload(path, file, {
        contentType: file.type,
        upsert: false,
      })
      if (uploadError) throw uploadError
      uploaded.push({ path, file })
    }

    const { error: insertError } = await supabase.from('canteen_rating_media').insert(
      uploaded.map(({ path, file }, index) => ({
        rating_id: ratingId,
        user_id: userId,
        storage_path: path,
        alt: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        position: existingCount + index,
      })),
    )
    if (insertError) throw insertError
  } catch (error) {
    if (uploaded.length) {
      await supabase.storage.from('canteen-rating-media').remove(uploaded.map(({ path }) => path))
    }
    throw error
  }
}

export const canteenRatingService = {
  isConfigured: Boolean(supabase),

  async listSummaries(placeIds: string[]): Promise<Record<string, CanteenRatingSummary>> {
    if (!supabase || !placeIds.length) return {}

    const { data, error } = await supabase.rpc('get_canteen_rating_summaries', {
      target_place_ids: placeIds,
    })
    if (error) throw error

    return ((data ?? []) as RatingSummaryRow[]).reduce<Record<string, CanteenRatingSummary>>(
      (summaries, row) => {
        summaries[row.place_id] = {
          placeId: row.place_id,
          ratingCount: toNumber(row.rating_count),
          taste: toNumber(row.taste_avg),
          service: toNumber(row.service_avg),
          value: toNumber(row.value_avg),
          environment: toNumber(row.environment_avg),
          overall: toNumber(row.overall_avg),
        }
        return summaries
      },
      {},
    )
  },

  async getOwnRating(placeId: string): Promise<CanteenRating | null> {
    const userId = await requireUserId()
    const { data, error } = await supabase!
      .from('canteen_ratings')
      .select('place_id,taste_score,service_score,value_score,environment_score,review_text,updated_at')
      .eq('user_id', userId)
      .eq('place_id', placeId)
      .maybeSingle()
    if (error) throw error
    if (!data) return null

    const row = data as OwnRatingRow
    return {
      placeId: row.place_id,
      taste: toNumber(row.taste_score),
      service: toNumber(row.service_score),
      value: toNumber(row.value_score),
      environment: toNumber(row.environment_score),
      reviewText: row.review_text ?? '',
      updatedAt: row.updated_at,
    }
  },

  async saveRating(
    placeId: string,
    scores: CanteenRatingScores,
    reviewText: string,
    imageFiles: File[] = [],
  ) {
    if (!validateCanteenRatingScores(scores)) {
      throw new Error('Invalid canteen rating scores')
    }
    if (!validateCanteenRatingReview(reviewText)) {
      throw new Error('Invalid canteen rating review')
    }
    const imageValidation = validateCanteenRatingImages(imageFiles)
    if (!imageValidation.ok) throw new Error(imageValidation.message)

    const normalizedReviewText = normalizeCanteenRatingReview(reviewText)

    const userId = await requireUserId()
    const { data, error } = await supabase!.from('canteen_ratings').upsert(
      {
        user_id: userId,
        place_id: placeId,
        taste_score: scores.taste,
        service_score: scores.service,
        value_score: scores.value,
        environment_score: scores.environment,
        review_text: normalizedReviewText || null,
        visited_confirmed: true,
      },
      { onConflict: 'user_id,place_id' },
    ).select('id').single()
    if (error) throw error

    await uploadRatingImages(data.id as string, userId, imageFiles)
  },
}

export function toCanteenRatingMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()

  if (normalized.includes('authentication required')) return '请先登录，再提交到店评分。'
  if (normalized.includes('supabase is not configured')) return '当前未配置 Supabase，暂时不能保存真实评分。'
  if (normalized.includes('get_canteen_rating_summaries') || normalized.includes('canteen_ratings')) {
    return '评分数据表尚未部署，请先执行最新的 Supabase 迁移。'
  }
  if (normalized.includes('photo limit exceeded') || normalized.includes('最多上传')) {
    return `每条评价最多保留 ${canteenRatingImageLimit} 张图片。`
  }
  if (normalized.includes('canteen-rating-media') || normalized.includes('canteen_rating_media')) {
    return '评价图片存储尚未部署，请先执行最新的 Supabase 迁移。'
  }
  if (normalized.includes('invalid canteen rating review')) return '一句话点评最多 120 个字。'
  if (normalized.includes('invalid canteen rating')) return '请把四项评分都设置为 0.5–5 星。'
  return '评分保存失败，请稍后重试。'
}

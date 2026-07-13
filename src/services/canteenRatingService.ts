import { supabase } from '../lib/supabase/client'
import { validateCanteenRatingScores } from '../features/canteen/canteenRatings'
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
      .select('place_id,taste_score,service_score,value_score,environment_score,updated_at')
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
      updatedAt: row.updated_at,
    }
  },

  async saveRating(placeId: string, scores: CanteenRatingScores) {
    if (!validateCanteenRatingScores(scores)) {
      throw new Error('Invalid canteen rating scores')
    }

    const userId = await requireUserId()
    const { error } = await supabase!.from('canteen_ratings').upsert(
      {
        user_id: userId,
        place_id: placeId,
        taste_score: scores.taste,
        service_score: scores.service,
        value_score: scores.value,
        environment_score: scores.environment,
        visited_confirmed: true,
      },
      { onConflict: 'user_id,place_id' },
    )
    if (error) throw error
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
  if (normalized.includes('invalid canteen rating')) return '请把四项评分都设置为 0.5–5 星。'
  return '评分保存失败，请稍后重试。'
}

import { supabase } from '../lib/supabase/client'
import {
  validateCanteenSubmission,
  type CanteenSubmissionDraft,
  type ValidatedCanteenSubmission,
} from '../features/canteen/canteenSubmissions'

async function requireUserId() {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Authentication required')
  return data.user.id
}

export const canteenSubmissionService = {
  isConfigured: Boolean(supabase),

  async create(draft: CanteenSubmissionDraft) {
    const validation = validateCanteenSubmission(draft)
    if (!validation.ok) throw new Error('Invalid canteen place submission')

    const userId = await requireUserId()
    const value: ValidatedCanteenSubmission = validation.value
    const { data, error } = await supabase!
      .from('canteen_place_submissions')
      .insert({
        submitter_id: userId,
        name: value.name,
        region: value.region,
        city: value.city,
        district: value.district || null,
        address: value.address || null,
        longitude: value.longitude,
        latitude: value.latitude,
        amap_poi_id: value.amapPoiId || null,
        category: value.category,
        price: value.price || null,
        note: value.note || null,
        taste_score: value.scores.taste,
        service_score: value.scores.service,
        value_score: value.scores.value,
        environment_score: value.scores.environment,
        visited_confirmed: value.visitedConfirmed,
        status: 'reviewing',
      })
      .select('id,status')
      .single()
    if (error) throw error

    return data as { id: string; status: 'reviewing' }
  },
}

export function toCanteenSubmissionMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()

  if (normalized.includes('authentication required')) return '请先登录，再推荐餐厅。'
  if (normalized.includes('supabase is not configured')) return '当前未配置 Supabase，暂时不能保存餐厅推荐。'
  if (normalized.includes('canteen_place_submissions')) return '餐厅投稿表尚未部署，请先执行最新的 Supabase 迁移。'
  if (normalized.includes('invalid canteen place submission')) return '请检查必填资料和四项评分。'
  if (normalized.includes('duplicate key')) return '这家餐厅已经提交过，请等待审核。'
  return '餐厅推荐提交失败，请稍后重试。'
}

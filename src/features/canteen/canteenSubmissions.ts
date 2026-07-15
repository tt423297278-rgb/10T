import { validateCanteenRatingScores } from './canteenRatings'
import type { CanteenRatingScores } from '../../types/domain'

export interface CanteenSubmissionDraft {
  name: string
  region: string
  city: string
  district: string
  address: string
  longitude: number | null
  latitude: number | null
  amapPoiId: string
  category: string
  price: string
  note: string
  scores: CanteenRatingScores
  visitedConfirmed: boolean
}

export type CanteenSubmissionField =
  | 'name'
  | 'region'
  | 'city'
  | 'district'
  | 'address'
  | 'category'
  | 'price'
  | 'note'
  | 'scores'
  | 'visitedConfirmed'

export interface ValidatedCanteenSubmission extends Omit<CanteenSubmissionDraft, 'scores'> {
  scores: CanteenRatingScores
}

export type CanteenSubmissionValidation =
  | { ok: true; value: ValidatedCanteenSubmission }
  | { ok: false; errors: Partial<Record<CanteenSubmissionField, string>> }

const limits = {
  name: 80,
  region: 40,
  city: 40,
  district: 60,
  address: 200,
  category: 40,
  price: 60,
  note: 500,
} as const

function clean(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function validateCanteenSubmission(
  draft: CanteenSubmissionDraft,
): CanteenSubmissionValidation {
  const value: ValidatedCanteenSubmission = {
    name: clean(draft.name),
    region: clean(draft.region),
    city: clean(draft.city),
    district: clean(draft.district),
    address: clean(draft.address),
    longitude: Number.isFinite(draft.longitude) ? draft.longitude : null,
    latitude: Number.isFinite(draft.latitude) ? draft.latitude : null,
    amapPoiId: clean(draft.amapPoiId),
    category: clean(draft.category),
    price: clean(draft.price),
    note: draft.note.trim(),
    scores: { ...draft.scores },
    visitedConfirmed: draft.visitedConfirmed,
  }
  const errors: Partial<Record<CanteenSubmissionField, string>> = {}

  if (!value.name) errors.name = '请填写餐厅名称。'
  else if (value.name.length > limits.name) errors.name = `餐厅名称不能超过 ${limits.name} 个字。`

  if (!value.region) errors.region = '请选择省份或地区。'
  else if (value.region.length > limits.region) errors.region = '省份或地区名称过长。'

  if (!value.city) errors.city = '请填写餐厅所在城市。'
  else if (value.city.length > limits.city) errors.city = '城市名称过长。'

  if (value.address && value.address.length < 5) errors.address = '地址过短，请补充街道、商场或门牌信息。'
  else if (value.address.length > limits.address) errors.address = `地址不能超过 ${limits.address} 个字。`

  const hasLongitude = Number.isFinite(value.longitude)
  const hasLatitude = Number.isFinite(value.latitude)
  if (hasLongitude !== hasLatitude) {
    errors.address = '地图位置数据不完整，请重新选取或清空地址。'
  } else if (
    hasLongitude
    && hasLatitude
    && (value.longitude! < -180 || value.longitude! > 180 || value.latitude! < -90 || value.latitude! > 90)
  ) {
    errors.address = '地图位置超出有效范围，请重新选取。'
  }

  if (!value.category) errors.category = '请选择食物分类。'
  else if (value.category.length > limits.category) errors.category = '食物分类名称过长。'

  if (value.district.length > limits.district) errors.district = '区县名称过长，请检查后再提交。'
  if (value.price.length > limits.price) errors.price = '人均价格说明过长，请简化后再提交。'
  if (value.note.length > limits.note) errors.note = `推荐理由不能超过 ${limits.note} 个字。`

  if (!validateCanteenRatingScores(value.scores)) {
    errors.scores = '请完成口味、服务、性价比和环境四项评分，每项支持 0.5–5 星。'
  }
  if (!value.visitedConfirmed) {
    errors.visitedConfirmed = '请确认你已经实际到店消费过。'
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value }
}

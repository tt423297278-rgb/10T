import type { CanteenRatingScores } from '../../types/domain'

export const canteenRatingDimensions = [
  { key: 'taste', label: '口味' },
  { key: 'service', label: '服务' },
  { key: 'value', label: '性价比' },
  { key: 'environment', label: '环境' },
] as const

export type CanteenRatingDimension = (typeof canteenRatingDimensions)[number]['key']

export const emptyCanteenRatingScores: CanteenRatingScores = {
  taste: 0,
  service: 0,
  value: 0,
  environment: 0,
}

export const canteenRatingReviewMaxLength = 120

export function normalizeCanteenRatingReview(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function validateCanteenRatingReview(value: string) {
  return normalizeCanteenRatingReview(value).length <= canteenRatingReviewMaxLength
}

export function isValidCanteenRatingScore(value: number) {
  return Number.isFinite(value) && value >= 0.5 && value <= 5 && Number.isInteger(value * 2)
}

export function validateCanteenRatingScores(scores: CanteenRatingScores) {
  return canteenRatingDimensions.every(({ key }) => isValidCanteenRatingScore(scores[key]))
}

export function getCanteenOverallRating(scores: CanteenRatingScores) {
  const total = canteenRatingDimensions.reduce((sum, { key }) => sum + scores[key], 0)
  return Math.round((total / canteenRatingDimensions.length) * 10) / 10
}

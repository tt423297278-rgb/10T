import { describe, expect, it } from 'vitest'
import {
  canteenRatingReviewMaxLength,
  getCanteenOverallRating,
  isValidCanteenRatingScore,
  normalizeCanteenRatingReview,
  validateCanteenRatingReview,
  validateCanteenRatingScores,
} from './canteenRatings'

describe('canteen ratings', () => {
  it('accepts half-star increments from 0.5 through 5', () => {
    expect(isValidCanteenRatingScore(0.5)).toBe(true)
    expect(isValidCanteenRatingScore(4.5)).toBe(true)
    expect(isValidCanteenRatingScore(5)).toBe(true)
    expect(isValidCanteenRatingScore(0)).toBe(false)
    expect(isValidCanteenRatingScore(4.2)).toBe(false)
    expect(isValidCanteenRatingScore(5.5)).toBe(false)
  })

  it('requires all four dimensions and calculates their overall average', () => {
    const scores = { taste: 4.5, service: 4, value: 5, environment: 3.5 }
    expect(validateCanteenRatingScores(scores)).toBe(true)
    expect(getCanteenOverallRating(scores)).toBe(4.3)
    expect(validateCanteenRatingScores({ ...scores, service: 0 })).toBe(false)
  })

  it('normalizes an optional one-line review and enforces its maximum length', () => {
    expect(normalizeCanteenRatingReview('  锅底很香，\n 服务也很热情。  ')).toBe('锅底很香， 服务也很热情。')
    expect(validateCanteenRatingReview('')).toBe(true)
    expect(validateCanteenRatingReview('好吃，值得再来。')).toBe(true)
    expect(validateCanteenRatingReview('好'.repeat(canteenRatingReviewMaxLength + 1))).toBe(false)
  })
})

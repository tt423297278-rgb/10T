import { describe, expect, it } from 'vitest'
import {
  getCanteenOverallRating,
  isValidCanteenRatingScore,
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
})

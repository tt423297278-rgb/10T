import { describe, expect, it } from 'vitest'
import { pickPopularCanteenCity, popularCanteenCities } from './canteenPopularCities'

describe('canteen popular city defaults', () => {
  it('selects a city from the configured tourist city list', () => {
    expect(pickPopularCanteenCity(() => 0)).toEqual(popularCanteenCities[0])
    expect(pickPopularCanteenCity(() => 0.9999)).toEqual(popularCanteenCities.at(-1))
  })

  it('keeps every city paired with an available region', () => {
    expect(popularCanteenCities.every((item) => item.city && item.region)).toBe(true)
  })
})

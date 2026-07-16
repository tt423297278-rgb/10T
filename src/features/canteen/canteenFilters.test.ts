import { describe, expect, it } from 'vitest'
import type { CanteenPlace } from '../../types/domain'
import {
  allFilterValue,
  canteenPriceBands,
  filterCanteenPlaces,
  getCanteenPriceBandId,
  getCanteenPriceEstimate,
  getCanteenCategories,
  getCanteenCities,
  isCanteenSortId,
  normalizeCanteenNameQuery,
  pickCanteenPlace,
  sortCanteenPlaces,
} from './canteenFilters'

const places: CanteenPlace[] = [
  {
    id: 'sh-hotpot',
    region: '上海',
    city: '上海',
    district: '宝山区',
    category: '火锅',
    name: '上海火锅',
    address: '测试地址',
    price: '人均 28 元',
    sourceSheet: '上海篇',
    sourceUrl: 'https://example.com/sh',
    sourceRow: 3,
  },
  {
    id: 'bj-hotpot',
    region: '北京',
    city: '北京',
    district: '朝阳区',
    category: '火锅',
    name: '北京火锅',
    address: '测试地址',
    price: '人均 50-60 元',
    sourceSheet: '北京篇',
    sourceUrl: 'https://example.com/bj',
    sourceRow: 3,
  },
  {
    id: 'bj-noodles',
    region: '北京',
    city: '北京',
    district: '东城区',
    category: '面食',
    name: '北京面馆',
    address: '测试地址',
    sourceSheet: '北京篇',
    sourceUrl: 'https://example.com/bj',
    sourceRow: 4,
    status: 'closed',
  },
]

describe('canteen filters', () => {
  it('returns sorted unique city and city-specific category options', () => {
    expect(getCanteenCities(places)).toEqual(['北京', '上海'])
    expect(getCanteenCategories(places, '北京')).toEqual(['火锅', '面食'])
  })

  it('filters by city and category together', () => {
    expect(
      filterCanteenPlaces(places, { city: '北京', category: '火锅' }).map(
        (place) => place.id,
      ),
    ).toEqual(['bj-hotpot'])
    expect(
      filterCanteenPlaces(places, { city: allFilterValue, category: '火锅' }),
    ).toHaveLength(2)
  })

  it('normalizes free-form price text into stable price bands', () => {
    expect(canteenPriceBands).toHaveLength(6)
    expect(getCanteenPriceEstimate('人均 50-60 元左右')).toBe(55)
    expect(getCanteenPriceEstimate('3-5 人同行共 200 元')).toBe(200)
    expect(getCanteenPriceBandId('人均 28 元')).toBe('under-30')
    expect(getCanteenPriceBandId('200 元起')).toBe('over-200')
    expect(getCanteenPriceBandId('记不得了，价格不贵')).toBe('unknown')
  })

  it('matches any selected price band and includes unknown prices explicitly', () => {
    expect(
      filterCanteenPlaces(places, {
        city: allFilterValue,
        category: allFilterValue,
        priceBands: ['under-30', 'unknown'],
        includeClosed: true,
      }).map((place) => place.id),
    ).toEqual(['sh-hotpot', 'bj-noodles'])
  })

  it('matches partial restaurant names after normalizing case and spaces', () => {
    expect(normalizeCanteenNameQuery('  Bei Jing 火 锅  ')).toBe('beijing火锅')
    expect(
      filterCanteenPlaces(places, {
        city: allFilterValue,
        category: allFilterValue,
        nameQuery: ' 京 火 锅 ',
      }).map((place) => place.id),
    ).toEqual(['bj-hotpot'])
  })

  it('combines restaurant name search with the other filters', () => {
    expect(
      filterCanteenPlaces(places, {
        city: '北京',
        category: '面食',
        nameQuery: '面馆',
        priceBands: ['unknown'],
      }).map((place) => place.id),
    ).toEqual([])
    expect(
      filterCanteenPlaces(places, {
        city: '北京',
        category: '面食',
        nameQuery: '面馆',
        priceBands: ['unknown'],
        includeClosed: true,
      }).map((place) => place.id),
    ).toEqual(['bj-noodles'])
    expect(
      filterCanteenPlaces(places, {
        city: '上海',
        category: allFilterValue,
        nameQuery: '面馆',
      }),
    ).toHaveLength(0)
  })

  it('hides closed restaurants unless the user explicitly includes them', () => {
    expect(
      filterCanteenPlaces(places, {
        city: allFilterValue,
        category: allFilterValue,
      }).map((place) => place.id),
    ).toEqual(['sh-hotpot', 'bj-hotpot'])
    expect(
      filterCanteenPlaces(places, {
        city: allFilterValue,
        category: allFilterValue,
        includeClosed: true,
      }),
    ).toHaveLength(3)
  })

  it('sorts rated restaurants before unrated restaurants with stable tie breakers', () => {
    const summaries = {
      'sh-hotpot': {
        placeId: 'sh-hotpot',
        ratingCount: 3,
        taste: 4.5,
        service: 4,
        value: 4,
        environment: 4,
        overall: 4.2,
      },
      'bj-hotpot': {
        placeId: 'bj-hotpot',
        ratingCount: 8,
        taste: 4,
        service: 4,
        value: 4,
        environment: 4,
        overall: 4,
      },
    }

    expect(sortCanteenPlaces(places, summaries, 'rating').map((place) => place.id)).toEqual([
      'sh-hotpot',
      'bj-hotpot',
      'bj-noodles',
    ])
    expect(sortCanteenPlaces(places, summaries, 'count').map((place) => place.id)).toEqual([
      'bj-hotpot',
      'sh-hotpot',
      'bj-noodles',
    ])
    expect(sortCanteenPlaces(places, {}, 'rating')).toEqual(places)
    expect(isCanteenSortId('rating')).toBe(true)
    expect(isCanteenSortId('unknown')).toBe(false)
  })

  it('picks from the filtered list without going out of bounds', () => {
    expect(pickCanteenPlace(places, () => 0)?.id).toBe('sh-hotpot')
    expect(pickCanteenPlace(places, () => 1)?.id).toBe('bj-noodles')
    expect(pickCanteenPlace([], () => 0)).toBeUndefined()
  })
})

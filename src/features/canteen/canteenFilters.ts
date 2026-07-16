import type { CanteenPlace, CanteenRatingSummary } from '../../types/domain'

export const allFilterValue = 'all'

export const canteenPriceBands = [
  { id: 'under-30', label: '30 元及以下' },
  { id: '31-50', label: '31–50 元' },
  { id: '51-100', label: '51–100 元' },
  { id: '101-200', label: '101–200 元' },
  { id: 'over-200', label: '200 元以上' },
  { id: 'unknown', label: '价格不详' },
] as const

export const canteenSortOptions = [
  { id: 'default', label: '默认顺序' },
  { id: 'rating', label: '评分最高' },
  { id: 'count', label: '评价最多' },
] as const

export type CanteenPriceBandId = (typeof canteenPriceBands)[number]['id']
export type CanteenSortId = (typeof canteenSortOptions)[number]['id']

export interface CanteenFilters {
  city: string
  category: string
  nameQuery?: string
  priceBands?: CanteenPriceBandId[]
  includeClosed?: boolean
}

export function isCanteenPriceBandId(value: string): value is CanteenPriceBandId {
  return canteenPriceBands.some((band) => band.id === value)
}

export function isCanteenSortId(value: string): value is CanteenSortId {
  return canteenSortOptions.some((option) => option.id === value)
}

export function getCanteenPriceEstimate(price?: string) {
  if (!price) return null

  const rangePattern = '(\\d+(?:\\.\\d+)?)(?:\\s*[-–—~至到]\\s*(\\d+(?:\\.\\d+)?))?'
  const explicitMatch =
    price.match(new RegExp(`人均\\s*${rangePattern}`)) ??
    price.match(new RegExp(`${rangePattern}\\s*(?:元|块)(?:\\s*\\/\\s*人)?`)) ??
    price.match(new RegExp(`${rangePattern}\\s*\\/\\s*人`))
  const explicitValues = explicitMatch?.slice(1, 3).filter(Boolean).map(Number) ?? []

  const fallbackValues = [...price.matchAll(/\d+(?:\.\d+)?/g)]
    .map((match) => Number(match[0]))
    .filter((value) => value > 0 && value <= 5000)
  const values = explicitValues.length ? explicitValues : fallbackValues

  if (!values.length) return null

  const estimate = values.length >= 2 ? (values[0] + values[1]) / 2 : values[0]
  return /(?:以上|起|\+)/.test(price) ? estimate + 0.01 : estimate
}

export function getCanteenPriceBandId(price?: string): CanteenPriceBandId {
  const estimate = getCanteenPriceEstimate(price)
  if (estimate === null) return 'unknown'
  if (estimate <= 30) return 'under-30'
  if (estimate <= 50) return '31-50'
  if (estimate <= 100) return '51-100'
  if (estimate <= 200) return '101-200'
  return 'over-200'
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((left, right) =>
    left.localeCompare(right, 'zh-CN'),
  )
}

export function getCanteenCities(places: CanteenPlace[]) {
  return uniqueSorted(places.map((place) => place.city))
}

export function getCanteenCategories(
  places: CanteenPlace[],
  city = allFilterValue,
) {
  const cityPlaces =
    city === allFilterValue
      ? places
      : places.filter((place) => place.city === city)
  return uniqueSorted(cityPlaces.map((place) => place.category))
}

export function normalizeCanteenNameQuery(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('zh-CN')
    .replace(/\s+/g, '')
}

export function filterCanteenPlaces(
  places: CanteenPlace[],
  filters: CanteenFilters,
) {
  const normalizedNameQuery = normalizeCanteenNameQuery(filters.nameQuery ?? '')

  return places.filter((place) => {
    const matchesStatus = filters.includeClosed || place.status !== 'closed'
    const matchesCity =
      filters.city === allFilterValue || place.city === filters.city
    const matchesCategory =
      filters.category === allFilterValue || place.category === filters.category
    const matchesPrice =
      !filters.priceBands?.length || filters.priceBands.includes(getCanteenPriceBandId(place.price))
    const matchesName =
      !normalizedNameQuery || normalizeCanteenNameQuery(place.name).includes(normalizedNameQuery)
    return matchesStatus && matchesCity && matchesCategory && matchesPrice && matchesName
  })
}

export function sortCanteenPlaces(
  places: CanteenPlace[],
  summaries: Record<string, CanteenRatingSummary> | undefined,
  sort: CanteenSortId,
) {
  if (sort === 'default') return places

  return places
    .map((place, index) => ({ place, index, summary: summaries?.[place.id] }))
    .sort((left, right) => {
      const leftHasRatings = Boolean(left.summary?.ratingCount)
      const rightHasRatings = Boolean(right.summary?.ratingCount)

      if (leftHasRatings !== rightHasRatings) return leftHasRatings ? -1 : 1
      if (!leftHasRatings || !rightHasRatings) return left.index - right.index

      const primaryDifference = sort === 'rating'
        ? right.summary!.overall - left.summary!.overall
        : right.summary!.ratingCount - left.summary!.ratingCount
      if (primaryDifference) return primaryDifference

      const secondaryDifference = sort === 'rating'
        ? right.summary!.ratingCount - left.summary!.ratingCount
        : right.summary!.overall - left.summary!.overall
      return secondaryDifference || left.index - right.index
    })
    .map(({ place }) => place)
}

export function pickCanteenPlace(places: CanteenPlace[], random = Math.random) {
  if (!places.length) return undefined
  const index = Math.min(
    places.length - 1,
    Math.max(0, Math.floor(random() * places.length)),
  )
  return places[index]
}

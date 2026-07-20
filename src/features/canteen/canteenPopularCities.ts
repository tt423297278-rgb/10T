export const popularCanteenCities = [
  { city: '北京', region: '北京' },
  { city: '上海', region: '上海' },
  { city: '广州', region: '广东' },
  { city: '杭州', region: '浙江' },
  { city: '成都', region: '四川' },
  { city: '重庆', region: '重庆' },
  { city: '西安', region: '陕西' },
  { city: '长沙', region: '湖南' },
  { city: '南京', region: '江苏' },
  { city: '厦门', region: '福建' },
] as const

export function pickPopularCanteenCity(random = Math.random) {
  const randomIndex = Math.floor(random() * popularCanteenCities.length)
  const safeIndex = Math.max(0, Math.min(randomIndex, popularCanteenCities.length - 1))
  return popularCanteenCities[safeIndex]!
}

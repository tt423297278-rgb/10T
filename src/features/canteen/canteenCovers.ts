export type CanteenFlavorTone = 'classic' | 'fresh' | 'smoke' | 'spicy' | 'staple' | 'sweet' | 'western'

export interface CanteenCover {
  tone: CanteenFlavorTone
  src: string
  label: string
}

const covers: Record<CanteenFlavorTone, Omit<CanteenCover, 'tone'>> = {
  classic: { src: '/images/canteen/covers/canteen-cover-classic.webp', label: '家常风味' },
  fresh: { src: '/images/canteen/covers/canteen-cover-fresh.webp', label: '鲜蔬海味' },
  smoke: { src: '/images/canteen/covers/canteen-cover-smoke.webp', label: '烟火烧烤' },
  spicy: { src: '/images/canteen/covers/canteen-cover-spicy.webp', label: '香辣热锅' },
  staple: { src: '/images/canteen/covers/canteen-cover-staple.webp', label: '面点主食' },
  sweet: { src: '/images/canteen/covers/canteen-cover-sweet.webp', label: '甜品饮品' },
  western: { src: '/images/canteen/covers/canteen-cover-western.webp', label: '西式简餐' },
}

export function getCanteenFlavorTone(searchText: string): CanteenFlavorTone {
  if (/(火锅|串串|川菜|湘菜|麻辣|香辣)/.test(searchText)) return 'spicy'
  if (/(甜品|蛋糕|饮品|奶茶|咖啡|冰)/.test(searchText)) return 'sweet'
  if (/(素食|轻食|水果|海鲜|河鲜|鱼)/.test(searchText)) return 'fresh'
  if (/(西餐|汉堡|披萨|意面)/.test(searchText)) return 'western'
  if (/(面食|米粉|米饭|简餐|早餐|小吃|包子|饺子)/.test(searchText)) return 'staple'
  if (/(烧烤|烤肉|牛排|羊肉|炭火)/.test(searchText)) return 'smoke'
  return 'classic'
}

export function getCanteenCover(searchText: string): CanteenCover {
  const tone = getCanteenFlavorTone(searchText)
  return { tone, ...covers[tone] }
}

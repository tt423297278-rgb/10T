import { describe, expect, it } from 'vitest'
import { getCanteenCover } from './canteenCovers'

describe('getCanteenCover', () => {
  it.each([
    ['火锅 / 串串', 'spicy', '香辣热锅', 'canteen-cover-spicy.webp'],
    ['甜品 / 饮品', 'sweet', '甜品饮品', 'canteen-cover-sweet.webp'],
    ['海鲜 / 河鲜', 'fresh', '鲜蔬海味', 'canteen-cover-fresh.webp'],
    ['面食 / 米粉', 'staple', '面点主食', 'canteen-cover-staple.webp'],
    ['烧烤 / 烤肉', 'smoke', '烟火烧烤', 'canteen-cover-smoke.webp'],
    ['西餐 BlackSweet 厚牛菠萝包·汉堡', 'western', '西式简餐', 'canteen-cover-western.webp'],
    ['其他美食 张姐·山西麻辣拌', 'spicy', '香辣热锅', 'canteen-cover-spicy.webp'],
    ['地方菜', 'classic', '家常风味', 'canteen-cover-classic.webp'],
  ] as const)('maps %s to its category cover', (category, tone, label, filename) => {
    const cover = getCanteenCover(category)

    expect(cover.tone).toBe(tone)
    expect(cover.label).toBe(label)
    expect(cover.src).toContain(filename)
  })
})

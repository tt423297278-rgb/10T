import fs from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { canteenImportStats, canteenRegions } from '../src/data/canteenManifest'
import type { CanteenPlace } from '../src/types/domain'

const cleanComparable = (value: string | undefined) =>
  (value ?? '').toLowerCase().replace(/[\s（）()【】[\]·.，,、/\\:：;；'"“”‘’_-]/g, '')

const invalidTitlePattern = /^(?:无|暂无|人均|均价|价格|随便一家|任意一家|任何一家|店名不详)$|忘记|忘了|记不清|不记得|不知道.*(?:名|叫)|没有.*名字|无招牌/

async function loadGeneratedRecords() {
  const groups = await Promise.all(canteenRegions.map(async (region) => {
    const filePath = path.resolve(process.cwd(), `public${region.file}`)
    return JSON.parse(await fs.readFile(filePath, 'utf8')) as CanteenPlace[]
  }))
  return groups.flat()
}

describe('generated canteen data quality', () => {
  it('keeps manifest totals aligned with all 32 generated region files', async () => {
    const records = await loadGeneratedRecords()
    expect(canteenRegions).toHaveLength(32)
    expect(records).toHaveLength(canteenImportStats.recordCount)
    expect(canteenRegions.reduce((sum, region) => sum + region.count, 0)).toBe(records.length)
  })

  it('does not expose prices, unknown stores, or duplicated fields as card titles', async () => {
    const records = await loadGeneratedRecords()
    const invalidRecords = records.filter((record) => {
      const name = record.name.trim()
      const priceTitle = /^(?:人均|均价|价格|¥|￥)?\s*\d+(?:\.\d+)?(?:\s*[-~—至到+]\s*\d+(?:\.\d+)?)?\s*(?:元|块|左右|起|以内|不到|以上|以下|每人)?(?:吧|钱)?$/i.test(name)
      return !name
        || priceTitle
        || invalidTitlePattern.test(name)
        || cleanComparable(name) === cleanComparable(record.address)
        || (record.categoryDetail && cleanComparable(name) === cleanComparable(record.categoryDetail))
    })

    expect(invalidRecords).toEqual([])
  })
})

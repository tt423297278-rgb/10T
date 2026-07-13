import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadCanteenRegion } from './canteenDataService'

describe('canteen data service', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads a region data array', async () => {
    const payload = [{ id: 'place-1' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => payload }))

    await expect(loadCanteenRegion('/data/region.json')).resolves.toEqual(payload)
  })

  it('rejects failed responses and invalid payloads', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false, status: 404 }))
    await expect(loadCanteenRegion('/missing.json')).rejects.toThrow('404')

    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({}) }))
    await expect(loadCanteenRegion('/invalid.json')).rejects.toThrow('格式无效')
  })
})

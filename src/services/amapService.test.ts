import { describe, expect, it } from 'vitest'
import { formatAmapPoiAddress } from './amapService'

describe('amap service helpers', () => {
  it('builds a readable address without repeating municipality names', () => {
    expect(formatAmapPoiAddress({
      region: '重庆市',
      city: '重庆市',
      district: '巴南区',
      address: '红光大道69号',
    })).toBe('重庆市巴南区红光大道69号')
  })

  it('keeps partial POI address fields usable', () => {
    expect(formatAmapPoiAddress({ district: '蜀山区', address: '长江西路189号' }))
      .toBe('蜀山区长江西路189号')
  })
})

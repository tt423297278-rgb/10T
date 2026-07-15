import { describe, expect, it } from 'vitest'
import { validateCanteenSubmission, type CanteenSubmissionDraft } from './canteenSubmissions'

const validDraft: CanteenSubmissionDraft = {
  name: '  凡人老火锅  ',
  region: '重庆',
  city: '重庆',
  district: '巴南区',
  address: '理工大学外面 18 号',
  longitude: 106.5407,
  latitude: 29.4021,
  amapPoiId: 'B001TEST',
  category: '火锅 / 串串',
  price: '人均 80 元',
  note: '锅底香，晚饭时可能需要排队。',
  scores: { taste: 4.5, service: 4, value: 4.5, environment: 3.5 },
  visitedConfirmed: true,
}

describe('canteen restaurant submissions', () => {
  it('normalizes a complete real-visit submission', () => {
    const result = validateCanteenSubmission(validDraft)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.name).toBe('凡人老火锅')
      expect(result.value.address).toBe('理工大学外面 18 号')
    }
  })

  it('allows fans to omit an unknown address', () => {
    const result = validateCanteenSubmission({
      ...validDraft,
      address: '',
      longitude: null,
      latitude: null,
      amapPoiId: '',
    })

    expect(result.ok).toBe(true)
  })

  it('requires identity, city, category, four scores and visit confirmation', () => {
    const result = validateCanteenSubmission({
      ...validDraft,
      name: '',
      city: '',
      address: '',
      longitude: null,
      latitude: null,
      amapPoiId: '',
      category: '',
      scores: { ...validDraft.scores, service: 0 },
      visitedConfirmed: false,
    })

    expect(result).toEqual({
      ok: false,
      errors: {
        name: '请填写餐厅名称。',
        city: '请填写餐厅所在城市。',
        category: '请选择食物分类。',
        scores: '请完成口味、服务、性价比和环境四项评分，每项支持 0.5–5 星。',
        visitedConfirmed: '请确认你已经实际到店消费过。',
      },
    })
  })
})

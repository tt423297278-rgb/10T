import { describe, expect, it } from 'vitest'
import { validateReportReason } from './communityService'

describe('community actions', () => {
  it('requires a meaningful report reason', () => {
    expect(validateReportReason('太短').ok).toBe(false)
    expect(validateReportReason('疑似搬运未授权图片，需要管理员确认来源').ok).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import type { FanEvent } from '../../types/domain'
import { getEffectiveEventStatus } from './eventTime'

const event: FanEvent = {
  id: 'tour',
  title: '巡演测试',
  type: '演出',
  status: '即将开始',
  startsAt: '2026-07-17T19:30:00+08:00',
  endsAt: '2026-07-19T22:00:00+08:00',
  location: '广州',
  platform: '线下',
  memberIds: [],
  description: '测试活动',
  sourceLabel: '测试来源',
  updatedAt: '2026-07-18',
}

describe('getEffectiveEventStatus', () => {
  it('derives upcoming, active and ended states from the event window', () => {
    expect(getEffectiveEventStatus(event, new Date('2026-07-17T10:00:00+08:00'))).toBe('即将开始')
    expect(getEffectiveEventStatus(event, new Date('2026-07-18T13:00:00+08:00'))).toBe('正在进行')
    expect(getEffectiveEventStatus(event, new Date('2026-07-20T00:00:00+08:00'))).toBe('已结束')
  })

  it('preserves editorial statuses that dates must not override', () => {
    expect(getEffectiveEventStatus({ ...event, status: '已延期' }, new Date('2026-07-20T00:00:00+08:00'))).toBe('已延期')
  })
})

import { describe, expect, it } from 'vitest'
import type { FanEvent } from '../../types/domain'
import { getVisibleEventIndexEvents } from './eventIndex'

const baseEvent: FanEvent = {
  id: 'base',
  title: '测试活动',
  type: '演出',
  status: '即将开始',
  startsAt: '2026-07-24T19:30:00+08:00',
  location: '测试地点',
  platform: '线下',
  memberIds: [],
  description: '测试活动说明',
  sourceLabel: '测试来源',
  updatedAt: '2026-07-18',
}

describe('getVisibleEventIndexEvents', () => {
  it('hides ended and cancelled events, then puts the nearest unfinished event first', () => {
    const events: FanEvent[] = [
      { ...baseEvent, id: 'ended', status: '已结束', startsAt: '2026-07-01T10:00:00+08:00' },
      { ...baseEvent, id: 'later', status: '待确认', startsAt: '2026-07-28T10:00:00+08:00' },
      { ...baseEvent, id: 'cancelled', status: '已取消', startsAt: '2026-07-02T10:00:00+08:00' },
      { ...baseEvent, id: 'next', status: '即将开始', startsAt: '2026-07-24T10:00:00+08:00' },
      { ...baseEvent, id: 'active', status: '正在进行', startsAt: '2026-07-20T10:00:00+08:00' },
    ]

    expect(getVisibleEventIndexEvents(events).map((event) => event.id)).toEqual(['active', 'next', 'later'])
  })

  it('does not mutate the source event order', () => {
    const events: FanEvent[] = [
      { ...baseEvent, id: 'later', startsAt: '2026-07-28T10:00:00+08:00' },
      { ...baseEvent, id: 'next', startsAt: '2026-07-24T10:00:00+08:00' },
    ]

    getVisibleEventIndexEvents(events)

    expect(events.map((event) => event.id)).toEqual(['later', 'next'])
  })
})

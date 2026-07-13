import { describe, expect, it } from 'vitest'
import { filterEvents } from './eventFilters'
import type { FanEvent } from '../../types/domain'

const events: FanEvent[] = [
  {
    id: 'a',
    title: '多人直播',
    type: '直播',
    status: '即将开始',
    startsAt: '2026-07-05T12:00:00+08:00',
    endsAt: '2026-07-05T14:00:00+08:00',
    platform: '待确认平台',
    location: '线上',
    memberIds: ['member-1', 'member-2'],
    description: '待补充',
    sourceLabel: '占位数据',
    updatedAt: '2026-07-01',
  },
  {
    id: 'b',
    title: '线下活动',
    type: '线下活动',
    status: '待确认',
    startsAt: '2026-08-02T18:00:00+08:00',
    platform: '待确认',
    location: '待确认城市',
    memberIds: ['member-3'],
    description: '待补充',
    sourceLabel: '占位数据',
    updatedAt: '2026-07-01',
  },
]

describe('filterEvents', () => {
  it('filters by member, type, status and month', () => {
    const result = filterEvents(events, {
      memberId: 'member-1',
      type: '直播',
      status: '即将开始',
      month: '2026-07',
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('a')
  })

  it('returns all events when every filter is set to all', () => {
    expect(
      filterEvents(events, {
        memberId: 'all',
        type: 'all',
        status: 'all',
        month: 'all',
      }),
    ).toHaveLength(2)
  })
})

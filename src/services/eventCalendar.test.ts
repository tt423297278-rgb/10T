import { describe, expect, it } from 'vitest'
import { buildEventIcs, formatIcsDate } from './eventCalendar'
import type { FanEvent } from '../types/domain'

const event: FanEvent = {
  id: 'event-1',
  title: '七月陪伴直播记录',
  type: '直播',
  status: '即将开始',
  startsAt: '2026-07-06T20:00:00+08:00',
  endsAt: '2026-07-06T21:30:00+08:00',
  location: '线上',
  platform: '平台待确认',
  memberIds: ['member-1'],
  description: '活动说明',
  sourceLabel: '本地模拟数据',
  updatedAt: '2026-07-01',
}

describe('event calendar helpers', () => {
  it('formats dates as UTC ICS timestamps', () => {
    expect(formatIcsDate('2026-07-06T20:00:00+08:00')).toBe('20260706T120000Z')
  })

  it('builds an ICS document for an event', () => {
    const ics = buildEventIcs(event, ['成员一'])

    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('SUMMARY:七月陪伴直播记录')
    expect(ics).toContain('DTSTART:20260706T120000Z')
    expect(ics).toContain('DTEND:20260706T133000Z')
    expect(ics).toContain('DESCRIPTION:活动说明\\n参与成员：成员一\\n信息来源：本地模拟数据')
  })
})

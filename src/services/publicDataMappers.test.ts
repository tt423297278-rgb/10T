import { describe, expect, it } from 'vitest'
import { mapEventRow, mapMemberRow, mapOfficialUpdateRow } from './publicDataMappers'

describe('public data mappers', () => {
  it('maps a Supabase member row into the Member domain model without inventing private facts', () => {
    const member = mapMemberRow({
      id: 'member-1',
      name: '测试成员',
      display_order: 1,
      avatar_url: null,
      cover_url: null,
      bio: '公开简介',
      tags: ['成长中'],
      profile_status: 'verified',
      member_timeline: [],
      member_works: [],
      member_media: [],
    })

    expect(member.name).toBe('测试成员')
    expect(member.intro).toBe('公开简介')
    expect(member.birthday).toBeUndefined()
    expect(member.profileStatus).toBe('verified')
  })

  it('maps event rows and keeps related member ids', () => {
    const event = mapEventRow({
      id: 'event-1',
      title: '活动',
      type: '直播',
      status: '即将开始',
      starts_at: '2026-07-01T20:00:00+08:00',
      ends_at: null,
      location: '线上',
      platform: '待确认平台',
      description: '活动简介',
      source_label: '后台录入',
      source_url: null,
      cover_url: null,
      updated_at: '2026-07-01T00:00:00+08:00',
      notes: null,
      event_members: [{ member_id: 'member-1' }, { member_id: 'member-2' }],
    })

    expect(event.memberIds).toEqual(['member-1', 'member-2'])
    expect(event.startsAt).toBe('2026-07-01T20:00:00+08:00')
  })

  it('maps official update rows with member links', () => {
    const update = mapOfficialUpdateRow({
      id: 'update-1',
      title: '动态',
      body: '公开动态',
      type: '活动通知',
      published_at: '2026-07-01T10:00:00+08:00',
      source_label: '后台录入',
      source_url: null,
      official_update_members: [{ member_id: 'member-3' }],
    })

    expect(update.memberIds).toEqual(['member-3'])
    expect(update.sourceLabel).toBe('后台录入')
  })
})

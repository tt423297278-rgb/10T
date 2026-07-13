import { describe, expect, it } from 'vitest'
import { mapBadgeRow, mapFavoriteRow, mapFollowRow, mapNotificationRow, mapProfileRow } from './profileMappers'

describe('profile mappers', () => {
  it('maps the current user profile into a display model', () => {
    const profile = mapProfileRow({
      user_id: 'user-1',
      nickname: '麦田同行者',
      avatar_url: null,
      bio: '',
      role: 'user',
      status: 'active',
      created_at: '2026-07-01T08:00:00+08:00',
    })

    expect(profile.nickname).toBe('麦田同行者')
    expect(profile.bio).toBe('简介待补充')
    expect(profile.roleLabel).toBe('普通用户')
  })

  it('maps follow and favorite rows with related names', () => {
    expect(mapFollowRow({ member_id: 'member-1', created_at: '2026-07-01', members: { name: '成员一' } })).toEqual({
      memberId: 'member-1',
      memberName: '成员一',
      createdAt: '2026-07-01',
    })

    expect(mapFavoriteRow({ id: 'fav-1', target_id: 'post-1', created_at: '2026-07-01', posts: { title: '一篇记录' } })).toEqual({
      id: 'fav-1',
      targetId: 'post-1',
      title: '一篇记录',
      createdAt: '2026-07-01',
    })
  })

  it('maps badge and notification rows into readable profile items', () => {
    expect(mapBadgeRow({ id: 'user-badge-1', earned_at: '2026-07-01', badges: { name: '初次签到', description: '完成第一次签到' } })).toEqual({
      id: 'user-badge-1',
      name: '初次签到',
      description: '完成第一次签到',
      earnedAt: '2026-07-01',
    })

    expect(mapNotificationRow({ id: 'notice-1', type: 'comment', title: '有新评论', body: '你的记录收到回复', target_url: '/community/post-1', read_at: null, created_at: '2026-07-01' })).toEqual({
      id: 'notice-1',
      type: 'comment',
      title: '有新评论',
      body: '你的记录收到回复',
      targetUrl: '/community/post-1',
      read: false,
      createdAt: '2026-07-01',
    })
  })
})

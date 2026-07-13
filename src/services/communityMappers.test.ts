import { describe, expect, it } from 'vitest'
import { mapCommentRow, mapPostRow } from './communityMappers'

describe('community mappers', () => {
  it('maps post rows with member links and author profile', () => {
    const post = mapPostRow({
      id: 'post-1',
      title: '活动记录',
      body: '今天整理了公开行程。',
      category: '活动记录',
      status: 'published',
      author_id: 'user-1',
      created_at: '2026-07-01T10:00:00+08:00',
      like_count: 3,
      comment_count: 2,
      favorite_count: 1,
      post_members: [{ member_id: 'member-1' }],
      profiles: { nickname: '麦田记录员' },
      post_media: [{ type: 'image' }],
    })

    expect(post.id).toBe('post-1')
    expect(post.authorName).toBe('麦田记录员')
    expect(post.memberIds).toEqual(['member-1'])
    expect(post.hasImage).toBe(true)
    expect(post.hasVideo).toBe(false)
    expect(post.status).toBe('已发布')
  })

  it('maps comment rows with author nickname and parent id', () => {
    const comment = mapCommentRow({
      id: 'comment-1',
      post_id: 'post-1',
      author_id: 'user-2',
      parent_id: 'parent-1',
      body: '整理得很清楚。',
      status: 'published',
      created_at: '2026-07-01T11:00:00+08:00',
      profiles: { nickname: '田埂旁' },
    })

    expect(comment.authorName).toBe('田埂旁')
    expect(comment.parentId).toBe('parent-1')
    expect(comment.status).toBe('已发布')
  })
})

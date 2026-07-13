import { describe, expect, it } from 'vitest'
import { mapAdminCommentRow, mapAdminPostRow, mapAdminReportRow } from './adminMappers'

describe('admin mappers', () => {
  it('maps reviewing posts into queue items', () => {
    const item = mapAdminPostRow({
      id: 'post-1',
      title: '活动记录需要补来源',
      status: 'reviewing',
      category: '活动记录',
      created_at: '2026-07-01T08:00:00+08:00',
      profiles: { nickname: '麦田记录员' },
    })

    expect(item).toMatchObject({
      id: 'post-1',
      type: 'post',
      title: '活动记录需要补来源',
      ownerName: '麦田记录员',
      statusLabel: '审核中',
    })
  })

  it('maps comments and reports into queue items', () => {
    expect(mapAdminCommentRow({
      id: 'comment-1',
      body: '这条评论需要确认',
      status: 'hidden',
      created_at: '2026-07-01T09:00:00+08:00',
      profiles: null,
    }).statusLabel).toBe('已隐藏')

    expect(mapAdminReportRow({
      id: 'report-1',
      target_type: 'post',
      reason: '疑似搬运未授权图片',
      status: 'open',
      created_at: '2026-07-01T10:00:00+08:00',
      profiles: { nickname: '举报用户' },
    })).toMatchObject({
      type: 'report',
      title: '疑似搬运未授权图片',
      ownerName: '举报用户',
      statusLabel: '待处理',
    })
  })
})

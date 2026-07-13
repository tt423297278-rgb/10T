import type { CommunityPost, OfficialUpdate, PointLedgerEntry } from '../types/domain'
import { communityPostImages, officialUpdateImages } from './imageSources'

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: '把最近的活动做成一页手册',
    body: '整理了活动时间、成员关联和待确认信息，适合后续做成可收藏模板。',
    category: '活动记录',
    authorName: '麦田记录员',
    memberIds: ['member-1', 'member-2'],
    createdAt: '2026-07-01T09:30:00+08:00',
    status: '已发布',
    hasImage: true,
    hasVideo: false,
    coverImage: communityPostImages['post-1'],
    likeCount: 128,
    commentCount: 18,
    favoriteCount: 42,
  },
  {
    id: 'post-2',
    title: '今日签到一句：慢慢生长，也会长出答案',
    body: '签到卡片视觉可以更像手册盖章，而不是积分游戏。',
    category: '成长记录',
    authorName: '田埂旁',
    memberIds: [],
    createdAt: '2026-07-01T08:12:00+08:00',
    status: '审核中',
    hasImage: false,
    hasVideo: false,
    likeCount: 64,
    commentCount: 9,
    favoriteCount: 20,
  },
]

export const officialUpdates: OfficialUpdate[] = [
  {
    id: 'update-1',
    title: '成员动态示例：公开信息待后台录入',
    type: '活动通知',
    publishedAt: '2026-07-01T10:00:00+08:00',
    memberIds: ['member-1', 'member-5'],
    body: '这里仅展示后台录入的官方公开信息，不与粉丝帖子混合。',
    sourceLabel: '本地模拟数据',
    coverImage: officialUpdateImages['update-1'],
  },
  {
    id: 'update-2',
    title: '作品发布占位',
    type: '作品发布',
    publishedAt: '2026-06-28T18:00:00+08:00',
    memberIds: ['member-6'],
    body: '后续需要填写原始来源、发布时间和最后更新时间。',
    sourceLabel: '本地模拟数据',
    coverImage: officialUpdateImages['update-2'],
  },
]

export const pointLedger: PointLedgerEntry[] = [
  { id: 'point-1', amount: 5, reason: '每日签到', balanceAfter: 125, createdAt: '2026-07-01T08:00:00+08:00' },
  { id: 'point-2', amount: 2, reason: '发布成长记录', balanceAfter: 120, createdAt: '2026-06-30T20:00:00+08:00' },
  { id: 'point-3', amount: 5, reason: '每日签到', balanceAfter: 118, createdAt: '2026-06-30T08:00:00+08:00' },
]

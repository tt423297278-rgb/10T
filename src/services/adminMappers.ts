type ContentStatus = 'draft' | 'reviewing' | 'published' | 'hidden' | 'deleted'

const contentStatusLabels: Record<ContentStatus, string> = {
  draft: '草稿',
  reviewing: '审核中',
  published: '已发布',
  hidden: '已隐藏',
  deleted: '已删除',
}

const reportStatusLabels: Record<string, string> = {
  open: '待处理',
  resolved: '已处理',
  rejected: '已驳回',
}

export interface AdminQueueItem {
  id: string
  type: 'post' | 'comment' | 'report'
  title: string
  meta: string
  ownerName: string
  status: string
  statusLabel: string
  createdAt: string
}

export interface AdminPostRow {
  id: string
  title: string
  status: ContentStatus
  category: string
  created_at: string
  profiles?: { nickname: string | null } | Array<{ nickname: string | null }> | null
}

export interface AdminCommentRow {
  id: string
  body: string
  status: ContentStatus
  created_at: string
  profiles?: { nickname: string | null } | Array<{ nickname: string | null }> | null
}

export interface AdminReportRow {
  id: string
  target_type: string
  reason: string
  status: string
  created_at: string
  profiles?: { nickname: string | null } | Array<{ nickname: string | null }> | null
}

function nickname(profile: AdminPostRow['profiles']) {
  const resolved = Array.isArray(profile) ? profile[0] : profile
  return resolved?.nickname ?? '用户资料待补充'
}

export function mapAdminPostRow(row: AdminPostRow): AdminQueueItem {
  return {
    id: row.id,
    type: 'post',
    title: row.title,
    meta: row.category,
    ownerName: nickname(row.profiles),
    status: row.status,
    statusLabel: contentStatusLabels[row.status],
    createdAt: row.created_at,
  }
}

export function mapAdminCommentRow(row: AdminCommentRow): AdminQueueItem {
  return {
    id: row.id,
    type: 'comment',
    title: row.body,
    meta: '评论',
    ownerName: nickname(row.profiles),
    status: row.status,
    statusLabel: contentStatusLabels[row.status],
    createdAt: row.created_at,
  }
}

export function mapAdminReportRow(row: AdminReportRow): AdminQueueItem {
  return {
    id: row.id,
    type: 'report',
    title: row.reason,
    meta: row.target_type,
    ownerName: nickname(row.profiles),
    status: row.status,
    statusLabel: reportStatusLabels[row.status] ?? row.status,
    createdAt: row.created_at,
  }
}

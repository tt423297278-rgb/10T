import { supabase } from '../lib/supabase/client'
import {
  mapAdminCommentRow,
  mapAdminPostRow,
  mapAdminReportRow,
  type AdminCommentRow,
  type AdminPostRow,
  type AdminQueueItem,
  type AdminReportRow,
} from './adminMappers'

export interface AdminDashboard {
  counts: {
    pendingPosts: number
    pendingEvents: number
    openReports: number
  }
  queue: AdminQueueItem[]
}

const demoQueue: AdminQueueItem[] = [
  {
    id: 'demo-post-1',
    type: 'post',
    title: '活动记录需要补来源',
    meta: '活动记录',
    ownerName: '麦田记录员',
    status: 'reviewing',
    statusLabel: '审核中',
    createdAt: '2026-07-01T08:00:00+08:00',
  },
  {
    id: 'demo-comment-1',
    type: 'comment',
    title: '评论内容需要确认是否涉及隐私',
    meta: '评论',
    ownerName: '田埂旁',
    status: 'reviewing',
    statusLabel: '审核中',
    createdAt: '2026-07-01T09:00:00+08:00',
  },
  {
    id: 'demo-report-1',
    type: 'report',
    title: '疑似搬运未授权图片',
    meta: 'post',
    ownerName: '同行用户',
    status: 'open',
    statusLabel: '待处理',
    createdAt: '2026-07-01T10:00:00+08:00',
  },
]

function demoDashboard(): AdminDashboard {
  return {
    counts: {
      pendingPosts: demoQueue.filter((item) => item.type === 'post').length,
      pendingEvents: 4,
      openReports: demoQueue.filter((item) => item.type === 'report').length,
    },
    queue: demoQueue,
  }
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboard> {
    if (!supabase) return demoDashboard()

    const [postsCount, eventsCount, reportsCount, posts, comments, reports] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'reviewing'),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', '待确认'),
      supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabase
        .from('posts')
        .select('id,title,status,category,created_at,profiles(nickname)')
        .in('status', ['reviewing', 'hidden'])
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('comments')
        .select('id,body,status,created_at,profiles(nickname)')
        .in('status', ['reviewing', 'hidden'])
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('reports')
        .select('id,target_type,reason,status,created_at,profiles(nickname)')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(20),
    ])

    for (const result of [postsCount, eventsCount, reportsCount, posts, comments, reports]) {
      if (result.error) throw result.error
    }

    const queue = [
      ...(posts.data as AdminPostRow[]).map(mapAdminPostRow),
      ...(comments.data as AdminCommentRow[]).map(mapAdminCommentRow),
      ...(reports.data as AdminReportRow[]).map(mapAdminReportRow),
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return {
      counts: {
        pendingPosts: postsCount.count ?? 0,
        pendingEvents: eventsCount.count ?? 0,
        openReports: reportsCount.count ?? 0,
      },
      queue,
    }
  },

  async updatePostStatus(id: string, status: 'published' | 'hidden' | 'deleted') {
    if (!supabase) return
    const { error } = await supabase.from('posts').update({ status }).eq('id', id)
    if (error) throw error
  },

  async updateCommentStatus(id: string, status: 'published' | 'hidden' | 'deleted') {
    if (!supabase) return
    const { error } = await supabase.from('comments').update({ status }).eq('id', id)
    if (error) throw error
  },

  async updateReportStatus(id: string, status: 'resolved' | 'rejected') {
    if (!supabase) return
    const { error } = await supabase.from('reports').update({ status, handled_at: new Date().toISOString() }).eq('id', id)
    if (error) throw error
  },
}

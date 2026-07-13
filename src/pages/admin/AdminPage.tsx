import { NavLink, useLocation } from 'react-router-dom'
import { Activity, BadgeCheck, CalendarDays, Flag, MessageSquare, Settings, Shield, UserRound, UsersRound } from 'lucide-react'
import { useAppStore } from '../../app/store/useAppStore'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAdminDashboardQuery, useAdminModerationMutation } from '../../hooks/useAdminData'
import type { AdminQueueItem } from '../../services/adminMappers'

const adminLinks = [
  ['/admin', '概览', Shield],
  ['/admin/members', '成员管理', UsersRound],
  ['/admin/events', '活动管理', CalendarDays],
  ['/admin/updates', '动态管理', Activity],
  ['/admin/posts', '帖子审核', MessageSquare],
  ['/admin/comments', '评论审核', MessageSquare],
  ['/admin/reports', '举报处理', Flag],
  ['/admin/users', '用户管理', UserRound],
  ['/admin/check-ins', '签到积分', BadgeCheck],
  ['/admin/badges', '徽章规则', BadgeCheck],
  ['/admin/settings', '设置', Settings],
] as const

const routeType: Record<string, AdminQueueItem['type'] | undefined> = {
  '/admin/posts': 'post',
  '/admin/comments': 'comment',
  '/admin/reports': 'report',
}

export default function AdminPage() {
  const location = useLocation()
  const setToast = useAppStore((state) => state.setToast)
  const dashboardQuery = useAdminDashboardQuery()
  const moderation = useAdminModerationMutation()
  const current = adminLinks.find(([path]) => path === location.pathname)?.[1] ?? '概览'
  const dashboard = dashboardQuery.data
  const visibleType = routeType[location.pathname]
  const queue = dashboard?.queue.filter((item) => !visibleType || item.type === visibleType) ?? []

  const moderate = async (item: AdminQueueItem, action: 'publish' | 'hide' | 'delete' | 'resolve' | 'reject') => {
    try {
      if (item.type === 'post') {
        await moderation.mutateAsync({ type: 'post', id: item.id, status: action === 'publish' ? 'published' : action === 'hide' ? 'hidden' : 'deleted' })
      } else if (item.type === 'comment') {
        await moderation.mutateAsync({ type: 'comment', id: item.id, status: action === 'publish' ? 'published' : action === 'hide' ? 'hidden' : 'deleted' })
      } else {
        await moderation.mutateAsync({ type: 'report', id: item.id, status: action === 'resolve' ? 'resolved' : 'rejected' })
      }
      setToast('审核操作已提交')
    } catch {
      setToast('审核操作失败，请检查管理员权限和网络连接')
    }
  }

  return (
    <section className="field-container py-12">
      <PageMeta title={`后台管理｜${current}`} description="长期运营后台框架、审核队列和基础管理入口。" path={location.pathname} />
      <SectionHeader
        level={1}
        eyebrow="后台管理"
        title={current}
        description="后台操作需要管理员身份，并继续依赖 Supabase RLS 和服务端权限校验，不只靠前端隐藏按钮。"
      />
      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <aside className="paper-panel h-fit p-3">
          <nav className="grid gap-1" aria-label="后台导航">
            {adminLinks.map(([path, label, Icon]) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/admin'}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-2 rounded-field px-3 py-2 text-sm ${isActive ? 'bg-wheat/15 text-wheat-strong' : 'text-field-soft hover:bg-field-muted'}`
                }
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="grid gap-5">
          {dashboardQuery.isLoading ? <StateBlock type="loading" title="正在读取后台数据" description="审核队列和运营计数正在加载。" /> : null}
          {dashboardQuery.isError ? <StateBlock type="error" title="后台数据读取失败" description="请检查 Supabase 管理员权限、RLS 策略或网络连接。" /> : null}

          {dashboard ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Metric label="待审核帖子" value={dashboard.counts.pendingPosts} />
                <Metric label="待确认活动" value={dashboard.counts.pendingEvents} />
                <Metric label="举报待处理" value={dashboard.counts.openReports} />
              </div>

              {location.pathname === '/admin' || visibleType ? (
                <div className="paper-panel overflow-hidden">
                  <div className="border-b border-paper-line p-5">
                    <h2 className="font-serif text-2xl font-semibold">{visibleType ? current : '审核队列'}</h2>
                  </div>
                  <div className="divide-y divide-paper-line">
                    {queue.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="grid gap-4 p-5 text-sm md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-field-ink">{item.title}</span>
                            <StatusBadge>{item.statusLabel}</StatusBadge>
                          </div>
                          <p className="mt-1 text-field-soft">{item.meta} · {item.ownerName} · {new Date(item.createdAt).toLocaleString('zh-CN')}</p>
                        </div>
                        <ModerationActions item={item} pending={moderation.isPending} onAction={moderate} />
                      </div>
                    ))}
                    {!queue.length ? <p className="p-5 text-sm text-field-soft">当前队列为空。</p> : null}
                  </div>
                </div>
              ) : (
                <div className="paper-panel p-5">
                  <h2 className="font-serif text-2xl font-semibold">{current}</h2>
                  <p className="mt-2 text-field-soft">该模块已保留入口。下一轮将继续补充列表、表单、权限状态和管理员操作日志。</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="paper-panel p-5">
      <p className="text-sm text-field-soft">{label}</p>
      <p className="font-mono text-3xl font-semibold">{value}</p>
    </div>
  )
}

function ModerationActions({
  item,
  pending,
  onAction,
}: {
  item: AdminQueueItem
  pending: boolean
  onAction: (item: AdminQueueItem, action: 'publish' | 'hide' | 'delete' | 'resolve' | 'reject') => void
}) {
  if (item.type === 'report') {
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={pending} onClick={() => onAction(item, 'resolve')}>标记处理</Button>
        <Button variant="ghost" disabled={pending} onClick={() => onAction(item, 'reject')}>驳回</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" disabled={pending} onClick={() => onAction(item, 'publish')}>发布</Button>
      <Button variant="ghost" disabled={pending} onClick={() => onAction(item, 'hide')}>隐藏</Button>
      <Button variant="danger" disabled={pending} onClick={() => onAction(item, 'delete')}>删除</Button>
    </div>
  )
}

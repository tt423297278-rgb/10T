import { Link, NavLink, useLocation } from 'react-router-dom'
import { Bell, BookOpen, CalendarDays, Medal, MessageSquare, Settings, Star, UserRound, Wheat } from 'lucide-react'
import { calculateCheckInStats } from '../../features/check-in/checkInLogic'
import { useAppStore } from '../../app/store/useAppStore'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { useCheckInsQuery } from '../../hooks/useCheckInData'
import { useProfileSnapshotQuery } from '../../hooks/useProfileData'

const profileLinks = [
  ['/profile', '资料', UserRound],
  ['/profile/posts', '我的发布', BookOpen],
  ['/profile/comments', '评论', MessageSquare],
  ['/profile/favorites', '收藏', Star],
  ['/profile/following', '关注', Wheat],
  ['/profile/check-ins', '签到', CalendarDays],
  ['/profile/points', '麦粒值', Wheat],
  ['/profile/badges', '徽章', Medal],
  ['/profile/notifications', '通知', Bell],
  ['/profile/settings', '设置', Settings],
] as const

const today = new Date().toISOString().slice(0, 10)

function formatDate(value: string) {
  return new Date(value).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function ProfilePage() {
  const location = useLocation()
  const user = useAppStore((state) => state.user)
  const snapshotQuery = useProfileSnapshotQuery(user)
  const checkInsQuery = useCheckInsQuery()
  const snapshot = snapshotQuery.data
  const checkInStats = calculateCheckInStats(checkInsQuery.data ?? [], today)
  const currentLabel = profileLinks.find(([path]) => path === location.pathname)?.[1] ?? '资料'
  const balance = snapshot?.pointLedger[0]?.balanceAfter ?? 0

  return (
    <section className="field-container py-12">
      <PageMeta title={`个人中心｜${currentLabel}`} description="用户资料、签到、麦粒值、内容、关注、提醒和徽章。" path={location.pathname} />
      <SectionHeader
        level={1}
        eyebrow="个人中心"
        title={currentLabel}
        description="这里汇总自己的签到、发布、收藏、关注和通知。配置 Supabase 后会读取真实账号数据。"
      />

      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <aside className="paper-panel h-fit p-3">
          <nav className="grid gap-1" aria-label="个人中心导航">
            {profileLinks.map(([path, label, Icon]) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/profile'}
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
          {!user ? (
            <StateBlock
              type="auth"
              title="登录后查看个人手册"
              description="个人资料、签到、收藏和通知只对本人可见。"
              action={<Button asChild><Link to="/login">去登录</Link></Button>}
            />
          ) : null}

          {user && snapshotQuery.isLoading ? (
            <StateBlock type="loading" title="正在读取个人中心" description="正在整理你的资料、内容和陪伴记录。" />
          ) : null}

          {user && snapshotQuery.isError ? (
            <StateBlock type="error" title="个人中心读取失败" description="请检查 Supabase 权限、登录状态或网络连接后重试。" />
          ) : null}

          {snapshot ? (
            <>
              <div className="paper-panel p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-field-soft">{snapshot.profile.roleLabel}</p>
                    <h2 className="mt-1 font-serif text-2xl font-semibold">{snapshot.profile.nickname}</h2>
                    <p className="mt-2 max-w-2xl text-field-soft">{snapshot.profile.bio}</p>
                  </div>
                  <Button variant="secondary" asChild>
                    <Link to="/profile/settings">编辑资料</Link>
                  </Button>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-field bg-field-muted p-4"><p className="font-mono text-2xl font-semibold">{checkInStats.currentStreak}</p><p className="text-sm text-field-soft">连续签到</p></div>
                  <div className="rounded-field bg-field-muted p-4"><p className="font-mono text-2xl font-semibold">{checkInStats.totalDays}</p><p className="text-sm text-field-soft">累计签到</p></div>
                  <div className="rounded-field bg-field-muted p-4"><p className="font-mono text-2xl font-semibold">{balance}</p><p className="text-sm text-field-soft">麦粒值</p></div>
                  <div className="rounded-field bg-field-muted p-4"><p className="font-mono text-2xl font-semibold">{snapshot.notifications.filter((item) => !item.read).length}</p><p className="text-sm text-field-soft">未读通知</p></div>
                </div>
              </div>

              {location.pathname === '/profile' ? (
                <div className="grid gap-5 md:grid-cols-2">
                  <Panel title="最近发布" empty={!snapshot.posts.length} emptyText="还没有发布内容。">
                    {snapshot.posts.slice(0, 3).map((post) => <ListLine key={post.id} title={post.title} meta={`${post.category} · ${post.status}`} />)}
                  </Panel>
                  <Panel title="关注成员" empty={!snapshot.following.length} emptyText="还没有关注成员。">
                    {snapshot.following.map((item) => <ListLine key={item.memberId} title={item.memberName} meta={`关注于 ${item.createdAt.slice(0, 10)}`} />)}
                  </Panel>
                </div>
              ) : null}

              {location.pathname === '/profile/posts' ? (
                <Panel title="我的发布" empty={!snapshot.posts.length} emptyText="你还没有发布内容。">
                  {snapshot.posts.map((post) => <ListLine key={post.id} title={post.title} meta={`${post.category} · ${post.status} · ${formatDate(post.createdAt)}`} />)}
                </Panel>
              ) : null}

              {location.pathname === '/profile/comments' ? (
                <Panel title="我的评论" empty={!snapshot.comments.length} emptyText="你还没有留下评论。">
                  {snapshot.comments.map((comment) => <ListLine key={comment.id} title={comment.body} meta={`${comment.status} · ${formatDate(comment.createdAt)}`} />)}
                </Panel>
              ) : null}

              {location.pathname === '/profile/favorites' ? (
                <Panel title="我的收藏" empty={!snapshot.favorites.length} emptyText="还没有收藏内容。">
                  {snapshot.favorites.map((favorite) => <ListLine key={favorite.id} title={favorite.title} meta={`收藏于 ${formatDate(favorite.createdAt)}`} />)}
                </Panel>
              ) : null}

              {location.pathname === '/profile/following' ? (
                <Panel title="关注成员" empty={!snapshot.following.length} emptyText="还没有关注成员。">
                  {snapshot.following.map((item) => <ListLine key={item.memberId} title={item.memberName} meta={`关注于 ${item.createdAt.slice(0, 10)}`} />)}
                </Panel>
              ) : null}

              {location.pathname === '/profile/check-ins' ? (
                <Panel title="签到记录" empty={!checkInStats.totalDays} emptyText="还没有签到记录。">
                  {(checkInsQuery.data ?? []).map((date) => <ListLine key={date} title={date} meta="已盖章" />)}
                </Panel>
              ) : null}

              {location.pathname === '/profile/points' ? (
                <Panel title="麦粒值明细" empty={!snapshot.pointLedger.length} emptyText="还没有麦粒值明细。">
                  {snapshot.pointLedger.map((entry) => <ListLine key={entry.id} title={entry.reason} meta={`${entry.amount > 0 ? '+' : ''}${entry.amount} · 余额 ${entry.balanceAfter} · ${formatDate(entry.createdAt)}`} />)}
                </Panel>
              ) : null}

              {location.pathname === '/profile/badges' ? (
                <Panel title="我的徽章" empty={!snapshot.badges.length} emptyText="还没有获得徽章。">
                  {snapshot.badges.map((badge) => <ListLine key={badge.id} title={badge.name} meta={`${badge.description} · ${formatDate(badge.earnedAt)}`} />)}
                </Panel>
              ) : null}

              {location.pathname === '/profile/notifications' ? (
                <Panel title="通知" empty={!snapshot.notifications.length} emptyText="暂无通知。">
                  {snapshot.notifications.map((notice) => <ListLine key={notice.id} title={notice.title} meta={`${notice.read ? '已读' : '未读'} · ${notice.body}`} />)}
                </Panel>
              ) : null}

              {location.pathname === '/profile/settings' ? (
                <div className="paper-panel p-5">
                  <h3 className="font-serif text-xl font-semibold">资料设置</h3>
                  <p className="mt-2 text-field-soft">昵称、头像、简介和账号安全将在后续表单中接入 Supabase 更新。当前页面先保留权限和信息结构。</p>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function Panel({ title, empty, emptyText, children }: { title: string; empty: boolean; emptyText: string; children: React.ReactNode }) {
  return (
    <div className="paper-panel p-5">
      <h3 className="font-serif text-xl font-semibold">{title}</h3>
      <div className="mt-3 grid gap-3">
        {empty ? <p className="rounded-field bg-field-muted p-4 text-sm text-field-soft">{emptyText}</p> : children}
      </div>
    </div>
  )
}

function ListLine({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-field border border-paper-line bg-field-surface p-4">
      <p className="font-medium text-field-ink">{title}</p>
      <p className="mt-1 text-sm text-field-soft">{meta}</p>
    </div>
  )
}

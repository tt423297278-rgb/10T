import { Link, useParams } from 'react-router-dom'
import { Bell, CalendarPlus, Copy, Share2, Star } from 'lucide-react'
import { useAppStore } from '../../app/store/useAppStore'
import { Button } from '../../components/common/Button'
import { MediaFrame } from '../../components/common/MediaFrame'
import { PageMeta } from '../../components/common/PageMeta'
import { StateBlock } from '../../components/common/StateBlock'
import { StatusBadge } from '../../components/common/StatusBadge'
import { authService } from '../../features/auth/authService'
import { useEventsQuery, useMembersQuery } from '../../hooks/usePublicData'
import { buildEventIcs, downloadTextFile } from '../../services/eventCalendar'
import { eventActions } from '../../services/eventActions'

export default function EventDetailPage() {
  const { eventId } = useParams()
  const user = useAppStore((state) => state.user)
  const setToast = useAppStore((state) => state.setToast)
  const membersQuery = useMembersQuery()
  const eventsQuery = useEventsQuery()
  const members = membersQuery.data ?? []
  const events = eventsQuery.data ?? []
  const event = events.find((item) => item.id === eventId)

  if (eventsQuery.isLoading) {
    return <StateBlock type="loading" title="正在读取活动" description="请稍候。" />
  }

  if (!event) return <StateBlock type="error" title="活动不存在" description="请回到活动日历重新选择。" />

  const eventMembers = members.filter((member) => event.memberIds.includes(member.id))
  const memberNames = eventMembers.map((member) => member.name)
  const eventText = [
    event.title,
    `时间：${new Date(event.startsAt).toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'short' })}`,
    `地点：${event.platform} · ${event.location}`,
    `成员：${memberNames.join('、') || '待确认'}`,
    `状态：${event.status}`,
    `来源：${event.sourceLabel}`,
  ].join('\n')

  const requireConfiguredUser = () => {
    if (!user) {
      setToast('请先登录后再操作')
      return false
    }
    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，真实提醒和收藏写入不可用')
      return false
    }
    return true
  }

  const setReminder = async () => {
    if (!requireConfiguredUser()) return
    try {
      await eventActions.setReminder(event.id, event.startsAt)
      setToast('已设置活动提醒')
    } catch {
      setToast('提醒设置失败，请检查登录状态或权限')
    }
  }

  const toggleFavorite = async () => {
    if (!requireConfiguredUser()) return
    try {
      const result = await eventActions.toggleFavorite(event.id)
      setToast(result === 'added' ? '已收藏活动' : '已取消收藏')
    } catch {
      setToast('收藏操作失败，请检查登录状态或权限')
    }
  }

  const downloadIcs = () => {
    const ics = buildEventIcs(event, memberNames)
    downloadTextFile(`${event.title.replace(/[\\/:*?"<>|]/g, '-')}.ics`, ics, 'text/calendar;charset=utf-8')
    setToast('ICS 文件已生成')
  }

  const copyEvent = async () => {
    await navigator.clipboard.writeText(eventText)
    setToast('活动信息已复制')
  }

  const shareEvent = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: event.title, text: event.description, url })
      return
    }
    await navigator.clipboard.writeText(url)
    setToast('链接已复制，可手动分享')
  }

  return (
    <section className="field-container py-12">
      <PageMeta title={event.title} description={event.description} path={`/events/${event.id}`} />
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <MediaFrame
          title={event.title}
          alt={event.coverImage?.alt ?? `${event.title} 封面占位`}
          src={event.coverImage?.status === 'approved' || event.coverImage?.status === 'placeholder' ? event.coverImage.src : undefined}
          tone={event.coverTone}
          objectPosition={event.coverImage?.objectPosition ?? 'center center'}
        />
        <div>
          <div className="flex flex-wrap gap-2"><StatusBadge>{event.status}</StatusBadge><StatusBadge>{event.type}</StatusBadge></div>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-field-ink">{event.title}</h1>
          <p className="mt-4 text-field-soft">{event.description}</p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-field-soft">开始时间</dt><dd>{new Date(event.startsAt).toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'short' })}</dd></div>
            <div><dt className="text-field-soft">结束时间</dt><dd>{event.endsAt ? new Date(event.endsAt).toLocaleString('zh-CN', { timeStyle: 'short' }) : '待确认'}</dd></div>
            <div><dt className="text-field-soft">地点</dt><dd>{event.location}</dd></div>
            <div><dt className="text-field-soft">平台</dt><dd>{event.platform}</dd></div>
            <div>
              <dt className="text-field-soft">来源</dt>
              <dd>
                {event.sourceUrl ? (
                  <a className="font-semibold text-field-green underline-offset-4 hover:underline" href={event.sourceUrl} target="_blank" rel="noreferrer">
                    {event.sourceLabel}
                  </a>
                ) : (
                  event.sourceLabel
                )}
              </dd>
            </div>
            <div><dt className="text-field-soft">最后更新</dt><dd>{event.updatedAt}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={setReminder}><Bell size={16} aria-hidden="true" />设置提醒</Button>
            <Button variant="secondary" onClick={toggleFavorite}><Star size={16} aria-hidden="true" />收藏活动</Button>
            <Button variant="secondary" onClick={downloadIcs}><CalendarPlus size={16} aria-hidden="true" />生成 ICS</Button>
            <Button variant="ghost" onClick={copyEvent}><Copy size={16} aria-hidden="true" />复制信息</Button>
            <Button variant="ghost" onClick={shareEvent}><Share2 size={16} aria-hidden="true" />分享</Button>
          </div>
        </div>
      </div>
      <div className="paper-panel mt-10 p-5">
        <h2 className="font-serif text-2xl font-semibold">关联成员</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {membersQuery.isLoading ? (
            <span className="text-sm text-field-soft">成员读取中</span>
          ) : eventMembers.length ? (
            eventMembers.map((member) => (
              <Link key={member.id} to={`/members/${member.id}`} className="rounded-full border border-paper-line bg-field-surface px-3 py-1.5 text-sm">
                {member.name}
              </Link>
            ))
          ) : (
            <span className="text-sm text-field-soft">关联成员待确认</span>
          )}
        </div>
        <p className="mt-4 text-sm text-field-soft">{event.notes ?? '暂无注意事项。'}</p>
      </div>
    </section>
  )
}

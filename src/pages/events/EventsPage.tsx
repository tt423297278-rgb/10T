import { useMemo, useState } from 'react'
import { CalendarDays, Clock3, MapPin, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { EventStatus, EventType, FanEvent, Member } from '../../types/domain'
import { filterEvents } from '../../features/events/eventFilters'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useEventsQuery, useMembersQuery } from '../../hooks/usePublicData'

const eventTypes: Array<EventType | 'all'> = ['all', '直播', '演出', '综艺', '音乐', '品牌活动', '线下活动', '公开行程', '其他']
const eventStatuses: Array<EventStatus | 'all'> = ['all', '待确认', '即将开始', '正在进行', '已结束', '已取消', '已延期']
const emptyMembers: Member[] = []
const emptyEvents: FanEvent[] = []
const yearOptions = ['2026', '2027']
const monthOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))

function getDaysInMonth(month: string) {
  const [year, monthNumber] = month.split('-').map(Number)
  if (!year || !monthNumber) return 31
  return new Date(year, monthNumber, 0).getDate()
}

function getMonthStartOffset(month: string) {
  const day = new Date(`${month}-01T00:00:00+08:00`).getDay()
  return (day + 6) % 7
}

function isEventOnDay(event: FanEvent, month: string, day: number) {
  const dayStart = new Date(`${month}-${String(day).padStart(2, '0')}T00:00:00+08:00`).getTime()
  const dayEnd = new Date(`${month}-${String(day).padStart(2, '0')}T23:59:59+08:00`).getTime()
  const eventStart = new Date(event.startsAt).getTime()
  const eventEnd = new Date(event.endsAt ?? event.startsAt).getTime()
  return eventStart <= dayEnd && eventEnd >= dayStart
}

function getEventShortTitle(event: FanEvent) {
  if (event.title.includes('天才厨人')) return '天才厨人录制'
  if (event.title.includes('品牌线下')) return '品牌线下'
  if (event.title.includes('Ready To The Top')) return '鹭卓上海站'
  if (event.title.includes('Threshold')) return '李耕耘生日会'
  if (event.title.includes('哦啦音乐节')) return '哦啦音乐节'
  if (event.title.includes('数到一')) return '李昊香港'
  const tourCity = event.title.match(/巡回演唱会\s*(\S+站)/)?.[1]
  if (tourCity) return `巡演${tourCity.replace('站', '')}`
  return event.title.length > 10 ? `${event.title.slice(0, 10)}…` : event.title
}

function getEventToneClass(event: FanEvent) {
  if (event.status === '已结束') return 'border-paper-line bg-field-muted/45 text-field-soft line-through decoration-paper-line'
  if (event.status === '正在进行') return 'border-brick/30 bg-brick/[0.08] text-brick'
  if (event.status === '即将开始') return 'border-field-green/35 bg-field-surface text-field-green shadow-[inset_3px_0_0_rgba(36,77,56,0.22)]'
  if (event.type === '演出') return 'border-field-green/25 bg-field-surface text-field-green'
  if (event.type === '综艺') return 'border-sky-blue/45 bg-field-surface text-field-ink'
  if (event.type === '音乐') return 'border-wheat/35 bg-field-surface text-soil-brown'
  return 'border-soil-brown/20 bg-field-surface text-soil-brown'
}

function getDayState(dayEvents: FanEvent[]) {
  if (!dayEvents.length) return 'empty'
  if (dayEvents.every((event) => event.status === '已结束')) return 'ended'
  if (dayEvents.some((event) => event.status === '正在进行')) return 'active'
  if (dayEvents.some((event) => event.status === '即将开始')) return 'upcoming'
  return 'pending'
}

function getDayCellClass(dayEvents: FanEvent[], isSelected: boolean) {
  if (isSelected) return 'border-field-green/65 bg-field-green/12 shadow-field-sm ring-1 ring-field-green/20'
  const state = getDayState(dayEvents)
  if (state === 'ended') return 'border-paper-line/80 bg-field-muted/28 text-field-soft'
  if (state === 'active') return 'border-brick/35 bg-brick/[0.08] shadow-[inset_0_0_0_1px_rgba(138,69,50,0.10)]'
  if (state === 'upcoming') return 'border-field-green/35 bg-field-green/[0.07] shadow-[inset_0_0_0_1px_rgba(36,77,56,0.08)]'
  if (state === 'pending') return 'border-wheat/35 bg-wheat/10'
  return 'border-paper-line bg-field-surface/70'
}

function getCalendarEventTextClass(count: number) {
  if (count <= 1) return 'px-2 py-2 text-sm leading-snug'
  if (count === 2) return 'px-2 py-1.5 text-[13px] leading-snug'
  if (count === 3) return 'px-1.5 py-1 text-[12px] leading-tight'
  return 'px-1.5 py-0.5 text-[11px] leading-tight'
}

function getCalendarEventGridClass(count: number) {
  if (count <= 1) return 'mt-3 gap-1.5'
  if (count === 2) return 'mt-2.5 gap-1.5'
  return 'mt-2 gap-1'
}

function EventListItem({ event, members }: { event: FanEvent; members: Member[] }) {
  const eventMembers = members.filter((member) => event.memberIds.includes(member.id))
  const isEnded = event.status === '已结束'

  return (
    <Link
      to={`/events/${event.id}`}
      className={`group block rounded-[14px] border p-3 transition duration-300 ease-field hover:-translate-y-0.5 hover:shadow-field-sm ${
        isEnded
          ? 'border-paper-line bg-field-muted/35 opacity-82 hover:border-paper-line'
          : 'border-field-green/18 bg-field-surface/92 shadow-[inset_4px_0_0_rgba(36,77,56,0.18)] hover:border-field-green/35 hover:bg-field-surface'
      }`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge>{event.status}</StatusBadge>
        <span className="field-tag">{event.type}</span>
      </div>
      <h3 className={`mt-2 font-serif text-lg font-semibold leading-snug group-hover:text-field-green ${isEnded ? 'text-field-soft' : 'text-field-ink'}`}>
        {event.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-field-soft">{event.description}</p>
      <div className="mt-3 grid gap-1.5 text-xs text-field-soft">
        <span className="record-meta">
          <Clock3 size={14} aria-hidden="true" />
          {new Date(event.startsAt).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
        <span className="record-meta">
          <MapPin size={14} aria-hidden="true" />
          {event.location}
        </span>
        <span className="record-meta">
          <UsersRound size={14} aria-hidden="true" />
          {eventMembers.map((member) => member.name).join('、') || '待确认'}
        </span>
      </div>
    </Link>
  )
}

export default function EventsPage() {
  const membersQuery = useMembersQuery()
  const eventsQuery = useEventsQuery()
  const members = membersQuery.data ?? emptyMembers
  const events = eventsQuery.data ?? emptyEvents
  const [memberId, setMemberId] = useState('all')
  const [type, setType] = useState<EventType | 'all'>('all')
  const [status, setStatus] = useState<EventStatus | 'all'>('all')
  const [month, setMonth] = useState('2026-07')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const filteredEvents = useMemo(() => filterEvents(events, { memberId, type, status, month }), [events, memberId, type, status, month])
  const [selectedYear, selectedMonth] = month.split('-')

  const calendarDays = Array.from({ length: getDaysInMonth(month) }, (_, index) => {
    const day = index + 1
    const dayEvents = filteredEvents.filter((event) => isEventOnDay(event, month, day))
    return { day, dayEvents }
  })
  const selectedEvents = selectedDay ? filteredEvents.filter((event) => isEventOnDay(event, month, selectedDay)) : filteredEvents
  const calendarBlanks = Array.from({ length: getMonthStartOffset(month) }, (_, index) => `blank-${index}`)
  const activeDayLabel = selectedDay ? `${month}-${String(selectedDay).padStart(2, '0')}` : '本月筛选结果'

  return (
    <section className="events-atmosphere py-12">
      <div className="field-container">
        <PageMeta title="活动日历" description="支持成员、类型、状态和月份筛选的活动日历原型。" path="/events" />
        <SectionHeader
          level={1}
          eyebrow="田野月历"
          title="把公开活动整理成田野日程"
          description="活动数据优先读取 Supabase；不自动抓取第三方平台，待确认信息保持克制标注。"
        />

      <div className="journal-sheet event-glass-panel mb-6 grid gap-3 p-4 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-semibold text-field-ink">
          成员
          <select
            value={memberId}
            onChange={(event) => {
              setMemberId(event.target.value)
              setSelectedDay(null)
            }}
            className="field-input"
          >
            <option value="all">全部成员</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-field-ink">
          类型
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value as EventType | 'all')
              setSelectedDay(null)
            }}
            className="field-input"
          >
            {eventTypes.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? '全部类型' : item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-field-ink">
          状态
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as EventStatus | 'all')
              setSelectedDay(null)
            }}
            className="field-input"
          >
            {eventStatuses.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? '全部状态' : item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-field-ink">
          年月
          <span className="grid grid-cols-[1fr_.8fr] gap-2">
            <select
              value={selectedYear}
              onChange={(event) => {
                setMonth(`${event.target.value}-${selectedMonth}`)
                setSelectedDay(null)
              }}
              className="field-input"
              aria-label="选择年份"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year} 年</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(event) => {
                setMonth(`${selectedYear}-${event.target.value}`)
                setSelectedDay(null)
              }}
              className="field-input"
              aria-label="选择月份"
            >
              {monthOptions.map((monthValue) => (
                <option key={monthValue} value={monthValue}>{Number(monthValue)} 月</option>
              ))}
            </select>
          </span>
        </label>
      </div>

      {eventsQuery.isLoading ? (
        <StateBlock type="loading" title="正在读取活动" description="活动日历正在加载。" />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,.55fr)] 2xl:grid-cols-[minmax(0,2.25fr)_minmax(20rem,.6fr)]">
          <div className="paper-panel calendar-shell event-glass-panel hidden overflow-hidden p-4 md:block lg:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-paper-line pb-4">
              <div>
                <p className="field-tag">田野月历</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-field-ink">
                  {selectedYear} 年 {Number(selectedMonth)} 月
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-field-soft">
                <span className="rounded-[7px] border border-field-green/25 bg-field-green/10 px-2 py-1 text-field-green">待开始</span>
                <span className="rounded-[7px] border border-paper-line bg-field-muted/45 px-2 py-1">已结束</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-field-soft">
              {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2.5">
              {calendarBlanks.map((blank) => (
                <div key={blank} className="min-h-32 rounded-[12px] border border-paper-line/35 bg-field-muted/20" aria-hidden="true" />
              ))}
              {calendarDays.map(({ day, dayEvents }) => (
                <button
                  key={day}
                  type="button"
                  aria-pressed={selectedDay === day}
                  onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                  className={`interactive-press relative flex min-h-32 flex-col rounded-[12px] border p-2 text-left transition duration-300 hover:-translate-y-px hover:border-field-green/35 ${getDayCellClass(dayEvents, selectedDay === day)}`}
                >
                  {getDayState(dayEvents) === 'ended' ? (
                    <span className="pointer-events-none absolute right-2 top-2 rotate-[-8deg] rounded-[5px] border border-paper-line px-1.5 py-0.5 text-[10px] font-bold text-field-soft opacity-80">
                      已结束
                    </span>
                  ) : null}
                  <span className="font-serif text-base font-semibold leading-none text-field-soft/90">{day}</span>
                  {dayEvents.length ? (
                    <span className={`grid ${getCalendarEventGridClass(dayEvents.length)}`}>
                      {dayEvents.map((event) => (
                        <span
                          key={event.id}
                          className={`flex min-h-0 items-center rounded-[8px] border font-semibold ${getCalendarEventTextClass(dayEvents.length)} ${getEventToneClass(event)}`}
                        >
                          {getEventShortTitle(event)}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-3">
            <div className="paper-panel event-glass-panel border-field-green/18 p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-field-green/18 bg-field-green/12 text-field-green">
                  <CalendarDays size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="field-tag">{activeDayLabel}</p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-field-ink">
                    {selectedDay ? '当天日程' : '活动索引'}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-field-soft">
                    {selectedDay ? '再次点击日期可返回全部筛选结果。' : '左侧月历显示简称，右侧用于快速扫读和进入详情。'}
                  </p>
                </div>
              </div>
            </div>
            {selectedEvents.length ? (
              <div className="grid gap-2.5">
                {selectedEvents.map((event) => <EventListItem key={event.id} event={event} members={members} />)}
              </div>
            ) : (
              <StateBlock type="empty" title="这一天没有活动" description="可以选择其他日期，或放宽成员、类型和状态筛选。" />
            )}
          </div>
        </div>
      )}

      <div className="mt-8 md:hidden">
        <SectionHeader title="移动端时间线" description="手机端不照搬桌面月历，优先展示可扫读的时间线。" />
      </div>
      </div>
    </section>
  )
}

import type { EventStatus, FanEvent } from '../../types/domain'

type EventDateStyle = 'medium' | 'full'

const fixedStatuses: EventStatus[] = ['待确认', '已取消', '已延期']

export function getEffectiveEventStatus(event: FanEvent, now = new Date()): EventStatus {
  if (fixedStatuses.includes(event.status)) return event.status

  const currentTime = now.getTime()
  const startTime = new Date(event.startsAt).getTime()
  const endTime = new Date(event.endsAt ?? event.startsAt).getTime()

  if (currentTime > endTime) return '已结束'
  if (currentTime >= startTime) return '正在进行'
  return '即将开始'
}

export function withEffectiveEventStatus(event: FanEvent, now = new Date()): FanEvent {
  return { ...event, status: getEffectiveEventStatus(event, now) }
}

export function formatEventStartLabel(event: FanEvent, dateStyle: EventDateStyle = 'full') {
  const start = new Date(event.startsAt)
  if (event.timeTbd) {
    return `${start.toLocaleDateString('zh-CN', { dateStyle })} · 具体时间待公布`
  }
  return start.toLocaleString('zh-CN', { dateStyle, timeStyle: 'short' })
}

export function formatEventEndLabel(event: FanEvent, dateStyle: EventDateStyle = 'full') {
  if (!event.endsAt) return '待确认'
  const end = new Date(event.endsAt)
  if (event.timeTbd) {
    return `${end.toLocaleDateString('zh-CN', { dateStyle })} · 具体时间待公布`
  }
  return end.toLocaleString('zh-CN', { dateStyle, timeStyle: 'short' })
}

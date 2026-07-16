import type { FanEvent } from '../../types/domain'

type EventDateStyle = 'medium' | 'full'

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

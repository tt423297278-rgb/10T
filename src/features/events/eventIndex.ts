import type { EventStatus, FanEvent } from '../../types/domain'

const visibleEventIndexStatuses = new Set<EventStatus>([
  '待确认',
  '即将开始',
  '正在进行',
  '已延期',
])

export function getVisibleEventIndexEvents(events: FanEvent[]) {
  return events
    .filter((event) => visibleEventIndexStatuses.has(event.status))
    .slice()
    .sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime())
}

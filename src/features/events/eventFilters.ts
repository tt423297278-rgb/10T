import type { EventStatus, EventType, FanEvent } from '../../types/domain'

export interface EventFilters {
  memberId: string | 'all'
  type: EventType | 'all'
  status: EventStatus | 'all'
  month: string | 'all'
}

export function filterEvents(events: FanEvent[], filters: EventFilters): FanEvent[] {
  return events.filter((event) => {
    const matchesMember = filters.memberId === 'all' || event.memberIds.includes(filters.memberId)
    const matchesType = filters.type === 'all' || event.type === filters.type
    const matchesStatus = filters.status === 'all' || event.status === filters.status
    const matchesMonth = filters.month === 'all' || event.startsAt.slice(0, 7) === filters.month
    return matchesMember && matchesType && matchesStatus && matchesMonth
  })
}

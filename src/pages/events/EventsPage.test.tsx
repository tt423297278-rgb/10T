// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FanEvent } from '../../types/domain'
import EventsPage from './EventsPage'

const { testEvents } = vi.hoisted(() => {
  const baseEvent: FanEvent = {
    id: 'future-event',
    title: '测试巡演活动',
    type: '演出',
    status: '即将开始',
    startsAt: '2026-07-24T19:30:00+08:00',
    location: '测试场馆',
    platform: '线下',
    memberIds: [],
    description: '用于验证日历与活动索引双向联动。',
    sourceLabel: '测试来源',
    updatedAt: '2026-07-18',
  }

  return {
    testEvents: [
      baseEvent,
      {
        ...baseEvent,
        id: 'ended-event',
        title: '已结束测试活动',
        status: '已结束' as const,
        startsAt: '2026-07-13T10:00:00+08:00',
      },
    ],
  }
})

vi.mock('../../hooks/usePublicData', () => ({
  useMembersQuery: () => ({ data: [], isLoading: false }),
  useEventsQuery: () => ({ data: testEvents, isLoading: false }),
}))

describe('EventsPage calendar linkage', () => {
  const scrollIntoView = vi.fn()

  afterEach(cleanup)

  beforeEach(() => {
    scrollIntoView.mockClear()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    })
  })

  it('highlights the corresponding calendar day while an event card is hovered or focused', () => {
    render(<MemoryRouter><EventsPage /></MemoryRouter>)

    const eventCard = screen.getByTestId('event-index-future-event')
    const calendarDay = screen.getByTestId('calendar-day-24')
    const calendarEvent = screen.getByTestId('calendar-event-future-event')

    fireEvent.mouseEnter(eventCard)
    expect(eventCard.getAttribute('data-linked')).toBe('true')
    expect(calendarDay.getAttribute('data-linked')).toBe('true')
    expect(calendarEvent.getAttribute('data-linked')).toBe('true')

    fireEvent.mouseLeave(eventCard)
    expect(calendarDay.getAttribute('data-linked')).toBe('false')

    fireEvent.focus(eventCard)
    expect(calendarDay.getAttribute('data-linked')).toBe('true')
  })

  it('shows and highlights every event on a selected day, including ended events', async () => {
    render(<MemoryRouter><EventsPage /></MemoryRouter>)

    expect(screen.queryByTestId('event-index-ended-event')).toBeNull()
    fireEvent.click(screen.getByTestId('calendar-day-13'))

    const endedEventCard = screen.getByTestId('event-index-ended-event')
    expect(endedEventCard.getAttribute('data-linked')).toBe('true')
    expect(screen.getByTestId('calendar-day-13').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('heading', { name: '当天活动' })).toBeTruthy()
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled())
  })
})

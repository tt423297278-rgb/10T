import { describe, expect, it } from 'vitest'
import { aidBoardEvents } from './agriAidTimeline'
import { homeAidHighlights } from './homeAidHighlights'

describe('home aid highlights', () => {
  it('stay aligned with their source timeline events', () => {
    const eventsById = new Map(aidBoardEvents.map((event) => [event.id, event]))

    homeAidHighlights.forEach((highlight) => {
      const source = eventsById.get(highlight.sourceEventId)
      expect(source).toBeDefined()
      expect(highlight).toMatchObject({
        date: source?.date,
        title: source?.title,
        location: source?.location,
      })
      expect(source?.pendingConfirm).not.toBe(true)
    })
  })
})

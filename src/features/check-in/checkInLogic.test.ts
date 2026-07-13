import { describe, expect, it } from 'vitest'
import { calculateCheckInStats } from './checkInLogic'

describe('calculateCheckInStats', () => {
  it('calculates total days and current streak from dated records', () => {
    const stats = calculateCheckInStats(
      ['2026-06-27', '2026-06-29', '2026-06-30', '2026-07-01'],
      '2026-07-01',
    )

    expect(stats.totalDays).toBe(4)
    expect(stats.currentStreak).toBe(3)
    expect(stats.checkedInToday).toBe(true)
  })

  it('does not count a streak through a missing day', () => {
    const stats = calculateCheckInStats(['2026-06-29', '2026-07-01'], '2026-07-01')

    expect(stats.totalDays).toBe(2)
    expect(stats.currentStreak).toBe(1)
  })
})

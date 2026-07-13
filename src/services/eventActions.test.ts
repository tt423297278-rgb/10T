import { describe, expect, it } from 'vitest'
import { getDefaultReminderTime } from './eventActions'

describe('event actions', () => {
  it('sets the default reminder 30 minutes before event start', () => {
    expect(getDefaultReminderTime('2026-07-06T20:00:00+08:00')).toBe('2026-07-06T11:30:00.000Z')
  })
})

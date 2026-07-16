import { describe, expect, it } from 'vitest'
import { events } from './events'

describe('public event data', () => {
  it('keeps event ids unique and the fallback list chronological', () => {
    expect(new Set(events.map((event) => event.id)).size).toBe(events.length)
    expect(events.map((event) => event.startsAt.slice(0, 10))).toEqual(
      [...events].sort((left, right) => left.startsAt.localeCompare(right.startsAt)).map((event) => event.startsAt.slice(0, 10)),
    )
  })

  it('records the verified August schedule and exact announced festival members', () => {
    const guiyang = events.find((event) => event.id === 'guiyang-super-galaxy-left-bank-2026-0801')
    const hangzhou = events.find((event) => event.id === 'tour-2026-hangzhou')
    const zhengzhou = events.find((event) => event.id === 'tour-2026-zhengzhou')
    const chengdu = events.find((event) => event.id === 'tour-2026-chengdu')

    expect(guiyang?.memberIds).toEqual(['member-2', 'member-5', 'member-6', 'member-7', 'member-8', 'member-10'])
    expect(guiyang?.timeTbd).toBe(true)
    expect(hangzhou?.startsAt).toContain('2026-08-07')
    expect(zhengzhou?.startsAt).toContain('2026-08-21')
    expect(chengdu?.startsAt).toContain('2026-08-28')
    expect(chengdu?.location).toBe('东安湖体育公园多功能体育馆')
  })
})

import { describe, expect, it } from 'vitest'
import { getFanHomeDecor } from './fanHomeDecor'

describe('getFanHomeDecor', () => {
  it('returns the canteen fan-home copy for the canteen route', () => {
    expect(getFanHomeDecor('/canteen').title).toBe('一起去吃饭吧')
  })

  it('matches detail routes to their parent section', () => {
    expect(getFanHomeDecor('/events/summer-live').title).toBe('不落下每一次见面')
  })

  it('returns a welcoming default for unmatched routes', () => {
    expect(getFanHomeDecor('/unknown').title).toBe('今天也在一起')
  })

  it.each([
    ['/', 'home-field'],
    ['/members', 'people-wheat'],
    ['/events/summer-live', 'event-wildflower'],
    ['/agri-aid', 'aid-seedling'],
    ['/canteen', 'canteen-harvest'],
    ['/gallery', 'memory-film'],
  ] as const)('maps %s to the %s visual theme', (path, visualTheme) => {
    expect(getFanHomeDecor(path).visualTheme).toBe(visualTheme)
  })
})

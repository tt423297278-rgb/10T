import { describe, expect, it } from 'vitest'
import { mapCheckInRow, mapPointLedgerRow } from './checkInMappers'

describe('check-in mappers', () => {
  it('maps check-in rows to date strings used by streak calculation', () => {
    expect(mapCheckInRow({ id: 'check-1', check_date: '2026-07-01', created_at: '2026-07-01T08:00:00+08:00' })).toBe(
      '2026-07-01',
    )
  })

  it('maps point ledger rows to domain entries', () => {
    const entry = mapPointLedgerRow({
      id: 'ledger-1',
      amount: 5,
      balance_after: 125,
      reason: '每日签到',
      created_at: '2026-07-01T08:00:00+08:00',
    })

    expect(entry.reason).toBe('每日签到')
    expect(entry.balanceAfter).toBe(125)
  })
})

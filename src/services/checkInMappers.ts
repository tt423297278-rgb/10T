import type { PointLedgerEntry } from '../types/domain'

export interface CheckInRow {
  id: string
  check_date: string
  created_at: string
}

export interface PointLedgerRow {
  id: string
  amount: number
  balance_after: number
  reason: string
  created_at: string
}

export function mapCheckInRow(row: CheckInRow): string {
  return row.check_date
}

export function mapPointLedgerRow(row: PointLedgerRow): PointLedgerEntry {
  return {
    id: row.id,
    amount: row.amount,
    reason: row.reason,
    balanceAfter: row.balance_after,
    createdAt: row.created_at,
  }
}

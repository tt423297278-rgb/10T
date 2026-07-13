import { supabase } from '../lib/supabase/client'
import { mapCheckInRow, mapPointLedgerRow, type CheckInRow, type PointLedgerRow } from './checkInMappers'
import { pointLedger as fallbackPointLedger } from '../data/community'

const fallbackCheckIns = ['2026-06-28', '2026-06-29', '2026-06-30']

export interface PerformCheckInResult {
  checkDate: string
  alreadyChecked: boolean
  amount: number
  balanceAfter: number
}

export const checkInService = {
  async listCheckIns() {
    if (!supabase) return fallbackCheckIns

    const { data, error } = await supabase
      .from('check_ins')
      .select('id,check_date,created_at')
      .order('check_date', { ascending: true })

    if (error) throw error
    return (data as CheckInRow[]).map(mapCheckInRow)
  },

  async listPointLedger() {
    if (!supabase) return fallbackPointLedger

    const { data, error } = await supabase
      .from('point_ledger')
      .select('id,amount,balance_after,reason,created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as PointLedgerRow[]).map(mapPointLedgerRow)
  },

  async performDailyCheckIn(): Promise<PerformCheckInResult> {
    if (!supabase) {
      return {
        checkDate: '2026-07-01',
        alreadyChecked: false,
        amount: 5,
        balanceAfter: 125,
      }
    }

    const { data, error } = await supabase.rpc('perform_daily_check_in')
    if (error) throw error
    const result = Array.isArray(data) ? data[0] : data

    return {
      checkDate: result.check_date,
      alreadyChecked: result.already_checked,
      amount: result.amount,
      balanceAfter: result.balance_after,
    }
  },
}

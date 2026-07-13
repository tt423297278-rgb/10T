export interface CheckInStats {
  totalDays: number
  currentStreak: number
  checkedInToday: boolean
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

export function calculateCheckInStats(records: string[], today: string): CheckInStats {
  const checkedDates = new Set(records)
  let currentStreak = 0
  const cursor = new Date(`${today}T00:00:00.000Z`)

  while (checkedDates.has(formatDate(cursor))) {
    currentStreak += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return {
    totalDays: checkedDates.size,
    currentStreak,
    checkedInToday: checkedDates.has(today),
  }
}

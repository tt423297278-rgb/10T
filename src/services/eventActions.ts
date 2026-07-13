import { supabase } from '../lib/supabase/client'

export function getDefaultReminderTime(startsAt: string) {
  const date = new Date(startsAt)
  date.setMinutes(date.getMinutes() - 30)
  return date.toISOString()
}

async function requireUserId() {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Authentication required')
  return data.user.id
}

export const eventActions = {
  async setReminder(eventId: string, startsAt: string) {
    const userId = await requireUserId()
    const { error } = await supabase!.from('event_reminders').upsert(
      {
        event_id: eventId,
        user_id: userId,
        remind_at: getDefaultReminderTime(startsAt),
      },
      { onConflict: 'event_id,user_id' },
    )
    if (error) throw error
  },

  async toggleFavorite(eventId: string) {
    const userId = await requireUserId()
    const { data: existing, error: readError } = await supabase!
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', 'event')
      .eq('target_id', eventId)
      .maybeSingle()
    if (readError) throw readError

    if (existing) {
      const { error } = await supabase!.from('favorites').delete().eq('id', existing.id)
      if (error) throw error
      return 'removed' as const
    }

    const { error } = await supabase!.from('favorites').insert({ user_id: userId, target_type: 'event', target_id: eventId })
    if (error) throw error
    return 'added' as const
  },
}

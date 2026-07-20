import { supabase } from '../lib/supabase/client'
import { events as fallbackEvents } from '../data/events'
import { members as fallbackMembers } from '../data/members'
import { officialUpdates as fallbackOfficialUpdates } from '../data/community'
import { mapEventRow, mapMemberRow, mapOfficialUpdateRow, type EventRow, type MemberRow, type OfficialUpdateRow } from './publicDataMappers'
import { withEffectiveEventStatus } from '../features/events/eventTime'

export const publicDataService = {
  async listMembers() {
    if (!supabase) return fallbackMembers

    const { data, error } = await supabase
      .from('members')
      .select('id,name,display_order,avatar_url,cover_url,bio,tags,profile_status,member_timeline(id,happened_on,title,description,source_label),member_works(id,type,title,description,source_url),member_media(id,type,url,poster_url,alt,source_label,source_url)')
      .order('display_order', { ascending: true })

    if (error) throw error
    return (data as MemberRow[]).map(mapMemberRow)
  },

  async listEvents() {
    if (!supabase) return fallbackEvents.map((event) => withEffectiveEventStatus(event))

    const { data, error } = await supabase
      .from('events')
      .select('id,title,type,status,starts_at,ends_at,location,platform,description,source_label,source_url,cover_url,updated_at,notes,event_members(member_id)')
      .order('starts_at', { ascending: true })

    if (error) throw error
    return (data as EventRow[]).map(mapEventRow).map((event) => withEffectiveEventStatus(event))
  },

  async listOfficialUpdates() {
    if (!supabase) return fallbackOfficialUpdates

    const { data, error } = await supabase
      .from('official_updates')
      .select('id,title,body,type,published_at,source_label,source_url,official_update_members(member_id)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return (data as OfficialUpdateRow[]).map(mapOfficialUpdateRow)
  },
}

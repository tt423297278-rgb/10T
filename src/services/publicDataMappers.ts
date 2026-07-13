import type { EventStatus, EventType, FanEvent, Member, OfficialUpdate } from '../types/domain'

interface MemberTimelineRow {
  id: string
  happened_on: string | null
  title: string
  description: string
  source_label: string
}

interface MemberWorkRow {
  id: string
  type: string
  title: string
  description: string
  source_url?: string | null
}

interface MemberMediaRow {
  id: string
  type: 'image' | 'video'
  url: string
  poster_url?: string | null
  alt: string
  source_label: string
  source_url?: string | null
}

export interface MemberRow {
  id: string
  name: string
  display_order: number
  avatar_url: string | null
  cover_url: string | null
  bio: string
  tags: string[] | null
  profile_status: string
  member_timeline?: MemberTimelineRow[] | null
  member_works?: MemberWorkRow[] | null
  member_media?: MemberMediaRow[] | null
}

export interface EventRow {
  id: string
  title: string
  type: string
  status: string
  starts_at: string
  ends_at: string | null
  location: string
  platform: string
  description: string
  source_label: string
  source_url: string | null
  cover_url: string | null
  updated_at: string
  notes: string | null
  event_members?: Array<{ member_id: string }> | null
}

export interface OfficialUpdateRow {
  id: string
  title: string
  body: string
  type: string
  published_at: string
  source_label: string
  source_url: string | null
  official_update_members?: Array<{ member_id: string }> | null
}

export function mapMemberRow(row: MemberRow): Member {
  const tags = row.tags?.length ? row.tags : ['公开资料待补充']

  return {
    id: row.id,
    name: row.name,
    shortTag: tags[0] ?? '成长记录',
    intro: row.bio || '资料待核验，当前仅展示公开资料占位。',
    tags,
    recentStatus: '活动状态由活动日历自动关联',
    profileStatus: row.profile_status === 'verified' ? 'verified' : 'placeholder',
    avatarTone: 'from-field-green to-sprout-green',
    image: row.avatar_url
      ? {
          src: row.avatar_url,
          alt: `${row.name} 授权成员图片`,
          sourceId: `supabase-member-${row.id}`,
          status: 'approved',
          sourceLabel: '后台录入授权素材',
          objectPosition: 'center center',
          mobileObjectPosition: 'center top',
        }
      : undefined,
    interests: ['公开兴趣待补充'],
    timeline:
      row.member_timeline?.map((item) => ({
        id: item.id,
        date: item.happened_on ?? '待核验日期',
        title: item.title,
        description: item.description,
        sourceLabel: item.source_label,
      })) ?? [],
    works:
      row.member_works?.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        sourceLabel: item.source_url ? '公开来源' : '后台录入',
      })) ?? [],
    media:
      row.member_media?.map((item) => ({
        id: item.id,
        type: item.type,
        url: item.url,
        poster: item.poster_url ?? undefined,
        alt: item.alt,
        sourceLabel: item.source_label,
        sourceUrl: item.source_url ?? undefined,
      })) ?? [],
  }
}

export function mapEventRow(row: EventRow): FanEvent {
  return {
    id: row.id,
    title: row.title,
    type: row.type as EventType,
    status: row.status as EventStatus,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    location: row.location,
    platform: row.platform,
    memberIds: row.event_members?.map((item) => item.member_id) ?? [],
    description: row.description,
    sourceLabel: row.source_label,
    sourceUrl: row.source_url ?? undefined,
    coverTone: row.cover_url ? undefined : 'from-wheat to-field-green',
    coverImage: row.cover_url
      ? {
          src: row.cover_url,
          alt: `${row.title} 活动封面`,
          sourceId: `supabase-event-${row.id}`,
          status: 'approved',
          sourceLabel: '后台录入授权素材',
          objectPosition: 'center center',
        }
      : undefined,
    updatedAt: row.updated_at.slice(0, 10),
    notes: row.notes ?? undefined,
  }
}

export function mapOfficialUpdateRow(row: OfficialUpdateRow): OfficialUpdate {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    publishedAt: row.published_at,
    memberIds: row.official_update_members?.map((item) => item.member_id) ?? [],
    body: row.body,
    sourceLabel: row.source_label,
    sourceUrl: row.source_url ?? undefined,
  }
}

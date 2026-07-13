export interface ProfileDisplay {
  userId: string
  nickname: string
  avatarUrl?: string
  bio: string
  role: 'user' | 'admin'
  roleLabel: string
  status: string
  createdAt: string
}

export interface ProfileRow {
  user_id: string
  nickname: string
  avatar_url: string | null
  bio: string | null
  role: 'user' | 'admin'
  status: string
  created_at: string
}

export interface FollowDisplay {
  memberId: string
  memberName: string
  createdAt: string
}

export interface FollowRow {
  member_id: string
  created_at: string
  members?: { name: string | null } | Array<{ name: string | null }> | null
}

export interface FavoriteDisplay {
  id: string
  targetId: string
  title: string
  createdAt: string
}

export interface FavoriteRow {
  id: string
  target_id: string
  created_at: string
  posts?: { title: string | null } | Array<{ title: string | null }> | null
}

export interface BadgeDisplay {
  id: string
  name: string
  description: string
  earnedAt: string
}

export interface BadgeRow {
  id: string
  earned_at: string
  badges?: { name: string | null; description: string | null } | Array<{ name: string | null; description: string | null }> | null
}

export interface NotificationDisplay {
  id: string
  type: string
  title: string
  body: string
  targetUrl?: string
  read: boolean
  createdAt: string
}

export interface NotificationRow {
  id: string
  type: string
  title: string
  body: string
  target_url: string | null
  read_at: string | null
  created_at: string
}

function firstRelated<T>(value: T | T[] | null | undefined): T | undefined {
  if (Array.isArray(value)) return value[0]
  return value ?? undefined
}

export function mapProfileRow(row: ProfileRow): ProfileDisplay {
  return {
    userId: row.user_id,
    nickname: row.nickname,
    avatarUrl: row.avatar_url ?? undefined,
    bio: row.bio?.trim() || '简介待补充',
    role: row.role,
    roleLabel: row.role === 'admin' ? '管理员' : '普通用户',
    status: row.status,
    createdAt: row.created_at,
  }
}

export function mapFollowRow(row: FollowRow): FollowDisplay {
  const member = firstRelated(row.members)
  return {
    memberId: row.member_id,
    memberName: member?.name ?? '成员资料待补充',
    createdAt: row.created_at,
  }
}

export function mapFavoriteRow(row: FavoriteRow): FavoriteDisplay {
  const post = firstRelated(row.posts)
  return {
    id: row.id,
    targetId: row.target_id,
    title: post?.title ?? '内容待补充',
    createdAt: row.created_at,
  }
}

export function mapBadgeRow(row: BadgeRow): BadgeDisplay {
  const badge = firstRelated(row.badges)
  return {
    id: row.id,
    name: badge?.name ?? '徽章待补充',
    description: badge?.description ?? '徽章规则待补充',
    earnedAt: row.earned_at,
  }
}

export function mapNotificationRow(row: NotificationRow): NotificationDisplay {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    targetUrl: row.target_url ?? undefined,
    read: Boolean(row.read_at),
    createdAt: row.created_at,
  }
}

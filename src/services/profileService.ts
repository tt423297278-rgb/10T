import { supabase } from '../lib/supabase/client'
import { communityPosts, pointLedger as fallbackPointLedger } from '../data/community'
import { members } from '../data/members'
import type { CommunityComment, CommunityPost, PointLedgerEntry } from '../types/domain'
import { mapCommentRow, mapPostRow, type CommentRow, type PostRow } from './communityMappers'
import {
  mapBadgeRow,
  mapFavoriteRow,
  mapFollowRow,
  mapNotificationRow,
  mapProfileRow,
  type BadgeDisplay,
  type BadgeRow,
  type FavoriteDisplay,
  type FavoriteRow,
  type FollowDisplay,
  type FollowRow,
  type NotificationDisplay,
  type NotificationRow,
  type ProfileDisplay,
  type ProfileRow,
} from './profileMappers'

export interface ProfileFallbackUser {
  id: string
  nickname: string
  role: 'guest' | 'user' | 'admin'
}

export interface ProfileSnapshot {
  profile: ProfileDisplay
  posts: CommunityPost[]
  comments: CommunityComment[]
  favorites: FavoriteDisplay[]
  following: FollowDisplay[]
  badges: BadgeDisplay[]
  notifications: NotificationDisplay[]
  pointLedger: PointLedgerEntry[]
}

function demoProfile(user?: ProfileFallbackUser | null): ProfileDisplay {
  return {
    userId: user?.id ?? 'demo-user',
    nickname: user?.nickname ?? '麦田同行者',
    bio: '简介待补充。后续可在这里记录陪伴、收藏和发布内容。',
    role: user?.role === 'admin' ? 'admin' : 'user',
    roleLabel: user?.role === 'admin' ? '管理员' : '普通用户',
    status: 'active',
    createdAt: '2026-07-01T08:00:00+08:00',
  }
}

function demoSnapshot(user?: ProfileFallbackUser | null): ProfileSnapshot {
  return {
    profile: demoProfile(user),
    posts: communityPosts,
    comments: [],
    favorites: communityPosts.slice(0, 1).map((post) => ({
      id: `favorite-${post.id}`,
      targetId: post.id,
      title: post.title,
      createdAt: post.createdAt,
    })),
    following: members.slice(0, 4).map((member, index) => ({
      memberId: member.id,
      memberName: member.name,
      createdAt: `2026-07-0${index + 1}`,
    })),
    badges: [
      { id: 'badge-demo-1', name: '初次签到', description: '完成第一次签到后获得', earnedAt: '2026-07-01T08:00:00+08:00' },
      { id: 'badge-demo-2', name: '陪伴手册', description: '开始记录自己的陪伴时间', earnedAt: '2026-07-01T09:00:00+08:00' },
    ],
    notifications: [
      {
        id: 'notice-demo-1',
        type: 'system',
        title: '资料仍是原型数据',
        body: '配置 Supabase 后会读取你的真实关注、收藏和通知。',
        read: false,
        createdAt: '2026-07-01T10:00:00+08:00',
      },
    ],
    pointLedger: fallbackPointLedger,
  }
}

async function currentUserId() {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Authentication required')
  return data.user.id
}

export const profileService = {
  async getSnapshot(fallbackUser?: ProfileFallbackUser | null): Promise<ProfileSnapshot> {
    if (!supabase) return demoSnapshot(fallbackUser)

    const userId = await currentUserId()

    const [
      profileResult,
      postsResult,
      commentsResult,
      favoritesResult,
      followingResult,
      badgesResult,
      notificationsResult,
      pointLedgerResult,
    ] = await Promise.all([
      supabase.from('profiles').select('user_id,nickname,avatar_url,bio,role,status,created_at').eq('user_id', userId).single(),
      supabase
        .from('posts')
        .select('id,title,body,category,status,author_id,created_at,like_count,comment_count,favorite_count,profiles(nickname),post_members(member_id),post_media(type)')
        .eq('author_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('comments')
        .select('id,post_id,author_id,parent_id,body,status,created_at,profiles(nickname)')
        .eq('author_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('favorites')
        .select('id,target_id,created_at,posts(title)')
        .eq('user_id', userId)
        .eq('target_type', 'post')
        .order('created_at', { ascending: false }),
      supabase
        .from('user_follows')
        .select('member_id,created_at,members(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('user_badges')
        .select('id,earned_at,badges(name,description)')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false }),
      supabase
        .from('notifications')
        .select('id,type,title,body,target_url,read_at,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('point_ledger')
        .select('id,amount,balance_after,reason,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ])

    if (profileResult.error) throw profileResult.error
    if (postsResult.error) throw postsResult.error
    if (commentsResult.error) throw commentsResult.error
    if (favoritesResult.error) throw favoritesResult.error
    if (followingResult.error) throw followingResult.error
    if (badgesResult.error) throw badgesResult.error
    if (notificationsResult.error) throw notificationsResult.error
    if (pointLedgerResult.error) throw pointLedgerResult.error

    return {
      profile: mapProfileRow(profileResult.data as ProfileRow),
      posts: (postsResult.data as PostRow[]).map(mapPostRow),
      comments: (commentsResult.data as CommentRow[]).map(mapCommentRow),
      favorites: (favoritesResult.data as FavoriteRow[]).map(mapFavoriteRow),
      following: (followingResult.data as FollowRow[]).map(mapFollowRow),
      badges: (badgesResult.data as BadgeRow[]).map(mapBadgeRow),
      notifications: (notificationsResult.data as NotificationRow[]).map(mapNotificationRow),
      pointLedger: (pointLedgerResult.data ?? []).map((entry) => ({
        id: entry.id,
        amount: entry.amount,
        reason: entry.reason,
        balanceAfter: entry.balance_after,
        createdAt: entry.created_at,
      })),
    }
  },
}

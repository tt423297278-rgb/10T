import type { CommunityComment, CommunityPost, PostCategory } from '../types/domain'

type ContentStatus = 'draft' | 'reviewing' | 'published' | 'hidden' | 'deleted'

const statusMap: Record<ContentStatus, CommunityPost['status']> = {
  draft: '审核中',
  reviewing: '审核中',
  published: '已发布',
  hidden: '已隐藏',
  deleted: '已删除',
}

export interface PostRow {
  id: string
  title: string
  body: string
  category: string
  status: ContentStatus
  author_id: string
  created_at: string
  like_count: number
  comment_count: number
  favorite_count: number
  profiles?: { nickname: string | null } | Array<{ nickname: string | null }> | null
  post_members?: Array<{ member_id: string }> | null
  post_media?: Array<{ type: 'image' | 'video'; url?: string | null; alt?: string | null; source_label?: string | null }> | null
}

export interface CommentRow {
  id: string
  post_id: string
  author_id: string
  parent_id: string | null
  body: string
  status: ContentStatus
  created_at: string
  profiles?: { nickname: string | null } | Array<{ nickname: string | null }> | null
}

function getNickname(profile: PostRow['profiles']): string {
  const resolved = Array.isArray(profile) ? profile[0] : profile
  return resolved?.nickname ?? '麦田同行者'
}

export function mapPostRow(row: PostRow): CommunityPost {
  const media = row.post_media ?? []
  const firstImage = media.find((item) => item.type === 'image' && item.url)

  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category as PostCategory,
    authorId: row.author_id,
    authorName: getNickname(row.profiles),
    memberIds: row.post_members?.map((item) => item.member_id) ?? [],
    createdAt: row.created_at,
    status: statusMap[row.status],
    hasImage: media.some((item) => item.type === 'image'),
    hasVideo: media.some((item) => item.type === 'video'),
    coverImage: firstImage?.url
      ? {
          src: firstImage.url,
          alt: firstImage.alt ?? `${row.title} 帖子图片`,
          sourceId: `supabase-post-${row.id}`,
          status: 'approved',
          sourceLabel: firstImage.source_label ?? '用户上传审核通过素材',
          objectPosition: 'center center',
        }
      : undefined,
    likeCount: row.like_count,
    commentCount: row.comment_count,
    favoriteCount: row.favorite_count,
  }
}

export function mapCommentRow(row: CommentRow): CommunityComment {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    authorName: getNickname(row.profiles),
    parentId: row.parent_id ?? undefined,
    body: row.body,
    status: statusMap[row.status],
    createdAt: row.created_at,
  }
}

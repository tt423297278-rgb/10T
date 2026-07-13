import { supabase } from '../lib/supabase/client'
import { communityPosts } from '../data/community'
import { mapCommentRow, mapPostRow, type CommentRow, type PostRow } from './communityMappers'
import type { CommunityPost, PostCategory } from '../types/domain'
import { validateUploadFile } from './uploadValidation'

export interface CreatePostInput {
  title: string
  body: string
  category: PostCategory
  memberIds: string[]
  mediaFiles?: File[]
}

export interface CreateCommentInput {
  postId: string
  body: string
  parentId?: string
}

export interface ReportInput {
  targetType: 'post' | 'comment'
  targetId: string
  reason: string
}

export function validateReportReason(reason: string) {
  const trimmed = reason.trim()
  if (trimmed.length < 8) {
    return { ok: false as const, message: '请至少填写 8 个字说明举报原因。' }
  }
  if (trimmed.length > 300) {
    return { ok: false as const, message: '举报原因请控制在 300 字以内。' }
  }
  return { ok: true as const, value: trimmed }
}

async function requireUserId() {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Authentication required')
  return data.user.id
}

export const communityService = {
  async listPosts(): Promise<CommunityPost[]> {
    if (!supabase) return communityPosts

    const { data, error } = await supabase
      .from('posts')
      .select('id,title,body,category,status,author_id,created_at,like_count,comment_count,favorite_count,profiles(nickname),post_members(member_id),post_media(type)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as PostRow[]).map(mapPostRow)
  },

  async listComments(postId: string) {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('comments')
      .select('id,post_id,author_id,parent_id,body,status,created_at,profiles(nickname)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return (data as CommentRow[]).map(mapCommentRow)
  },

  async createPost(input: CreatePostInput) {
    const authorId = await requireUserId()
    const { data, error } = await supabase!
      .from('posts')
      .insert({
        author_id: authorId,
        title: input.title,
        body: input.body,
        category: input.category,
        status: 'reviewing',
      })
      .select('id')
      .single()

    if (error) throw error

    if (input.memberIds.length) {
      const { error: linkError } = await supabase!
        .from('post_members')
        .insert(input.memberIds.map((memberId) => ({ post_id: data.id, member_id: memberId })))
      if (linkError) throw linkError
    }

    const postId = data.id as string

    if (input.mediaFiles?.length) {
      await Promise.all(input.mediaFiles.map((file) => communityService.uploadPostMedia(postId, file, authorId)))
    }

    return postId
  },

  async uploadPostMedia(postId: string, file: File, userId?: string) {
    const ownerId = userId ?? await requireUserId()
    const validation = validateUploadFile(file)
    if (!validation.ok) throw new Error(validation.message)

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const path = `${ownerId}/${postId}/${Date.now()}-${safeName}`
    const { error: uploadError } = await supabase!.storage.from('post-media').upload(path, file, {
      contentType: file.type,
      upsert: false,
    })
    if (uploadError) throw uploadError

    const { data } = supabase!.storage.from('post-media').getPublicUrl(path)
    const { error: insertError } = await supabase!.from('post_media').insert({
      post_id: postId,
      type: validation.mediaType,
      url: data.publicUrl,
      poster_url: null,
      alt: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    })
    if (insertError) throw insertError
  },

  async createComment(input: CreateCommentInput) {
    const authorId = await requireUserId()
    const { error } = await supabase!.from('comments').insert({
      post_id: input.postId,
      author_id: authorId,
      parent_id: input.parentId ?? null,
      body: input.body,
      status: 'published',
    })

    if (error) throw error
  },

  async toggleLike(targetId: string) {
    const userId = await requireUserId()
    const { data: existing, error: readError } = await supabase!
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', 'post')
      .eq('target_id', targetId)
      .maybeSingle()

    if (readError) throw readError

    if (existing) {
      const { error } = await supabase!.from('likes').delete().eq('id', existing.id)
      if (error) throw error
      return 'removed' as const
    }

    const { error } = await supabase!.from('likes').insert({ user_id: userId, target_type: 'post', target_id: targetId })
    if (error) throw error
    return 'added' as const
  },

  async toggleFavorite(targetId: string) {
    const userId = await requireUserId()
    const { data: existing, error: readError } = await supabase!
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', 'post')
      .eq('target_id', targetId)
      .maybeSingle()

    if (readError) throw readError

    if (existing) {
      const { error } = await supabase!.from('favorites').delete().eq('id', existing.id)
      if (error) throw error
      return 'removed' as const
    }

    const { error } = await supabase!.from('favorites').insert({ user_id: userId, target_type: 'post', target_id: targetId })
    if (error) throw error
    return 'added' as const
  },

  async deletePost(postId: string) {
    await requireUserId()
    const { error } = await supabase!.from('posts').delete().eq('id', postId)
    if (error) throw error
  },

  async reportTarget(input: ReportInput) {
    const reporterId = await requireUserId()
    const validation = validateReportReason(input.reason)
    if (!validation.ok) throw new Error(validation.message)

    const { error } = await supabase!.from('reports').insert({
      reporter_id: reporterId,
      target_type: input.targetType,
      target_id: input.targetId,
      reason: validation.value,
      status: 'open',
    })
    if (error) throw error
  },
}

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useAppStore } from '../../app/store/useAppStore'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { PostCard } from '../../components/community/PostCard'
import { authService } from '../../features/auth/authService'
import { toAuthMessage } from '../../features/auth/authErrors'
import { useMembersQuery } from '../../hooks/usePublicData'
import { useCommunityPostsQuery, useCreatePostMutation, useDeletePostMutation, useReportTargetMutation, useToggleFavoriteMutation, useToggleLikeMutation } from '../../hooks/useCommunityData'
import type { PostCategory } from '../../types/domain'

const categories: PostCategory[] = ['日常讨论', '活动记录', '节目观后感', '粉丝作品', '摄影分享', '应援记录', '成员资讯', '成长记录', '其他']

export default function CommunityPage() {
  const user = useAppStore((state) => state.user)
  const setToast = useAppStore((state) => state.setToast)
  const membersQuery = useMembersQuery()
  const postsQuery = useCommunityPostsQuery()
  const createPost = useCreatePostMutation()
  const likePost = useToggleLikeMutation()
  const favoritePost = useToggleFavoriteMutation()
  const deletePost = useDeletePostMutation()
  const reportPost = useReportTargetMutation()
  const members = membersQuery.data ?? []
  const posts = postsQuery.data ?? []
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<PostCategory>('日常讨论')
  const [memberId, setMemberId] = useState('none')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const submitPost = async () => {
    setFormError(null)
    if (!user) {
      setFormError('请先登录后再发布内容。')
      return
    }
    if (!title.trim() || !body.trim()) {
      setFormError('标题和正文都需要填写。')
      return
    }
    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，发布操作仅在真实环境生效。')
      return
    }

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        category,
        memberIds: memberId === 'none' ? [] : [memberId],
        mediaFiles,
      })
      setTitle('')
      setBody('')
      setMemberId('none')
      setMediaFiles([])
      setToast('发布成功，内容已进入审核流程。')
    } catch (error) {
      setFormError(toAuthMessage(error))
    }
  }

  const handleLike = async (postId: string) => {
    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，点赞将在真实环境生效。')
      return
    }
    await likePost.mutateAsync(postId)
  }

  const handleFavorite = async (postId: string) => {
    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，收藏将在真实环境生效。')
      return
    }
    await favoritePost.mutateAsync(postId)
  }

  const handleReport = async (postId: string) => {
    if (!user) {
      setToast('请先登录后再举报内容。')
      return
    }
    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，举报将在真实环境生效。')
      return
    }
    const reason = window.prompt('请填写举报原因，至少 8 个字。')
    if (!reason) return
    try {
      await reportPost.mutateAsync({ targetType: 'post', targetId: postId, reason })
      setToast('举报已提交，管理员会在后台处理。')
    } catch (error) {
      setToast(toAuthMessage(error))
    }
  }

  const handleDelete = async (postId: string) => {
    if (!window.confirm('确认删除这条内容吗？删除后将不再展示。')) return
    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，删除将在真实环境生效。')
      return
    }
    try {
      await deletePost.mutateAsync(postId)
      setToast('内容已删除。')
    } catch (error) {
      setToast(toAuthMessage(error))
    }
  }

  return (
    <section className="atmosphere-page community-atmosphere py-12">
      <div className="field-container">
      <PageMeta title="粉丝社区" description="克制、温暖的粉丝互动社区，支持帖子、评论、点赞、收藏和审核状态。" path="/community" />
      <SectionHeader
        level={1}
        eyebrow="田埂留言"
        title="麦田回声"
        description="像田埂边的留言纸一样记录讨论、摄影、活动和成长内容；未配置时使用本地模拟数据。"
        action={<Button disabled={!user}><PlusCircle size={16} aria-hidden="true" />发布记录</Button>}
      />
      {!user ? <StateBlock type="auth" title="登录后发布和互动" description="游客可以阅读公开内容，发布、点赞、评论和收藏需要登录。" /> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="grid gap-4">
          {postsQuery.isLoading ? (
            <StateBlock type="loading" title="正在读取社区内容" description="帖子列表正在加载。" />
          ) : posts.length ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                members={members}
                onLike={user ? handleLike : undefined}
                onFavorite={user ? handleFavorite : undefined}
                onReport={user ? handleReport : undefined}
                onDelete={user ? handleDelete : undefined}
                canDelete={Boolean(user && post.authorId === user.id)}
                isMutating={likePost.isPending || favoritePost.isPending || reportPost.isPending || deletePost.isPending}
              />
            ))
          ) : (
            <StateBlock type="empty" title="还没有社区内容" description="第一条认真记录会出现在这里。" />
          )}
        </div>

        <aside className="grid h-fit gap-4">
          <div className="paper-panel record-card p-5">
            <p className="field-tag">田野记录单</p>
            <h2 className="mt-2 font-serif text-xl font-semibold">发布记录</h2>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-sm font-semibold">
                标题
                <input value={title} onChange={(event) => setTitle(event.target.value)} className="field-input" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                分类
                <select value={category} onChange={(event) => setCategory(event.target.value as PostCategory)} className="field-input">
                  {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                关联成员
                <select value={memberId} onChange={(event) => setMemberId(event.target.value)} className="field-input">
                  <option value="none">不关联成员</option>
                  {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                正文
                <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={5} className="field-input py-2" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                图片或短视频
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
                  onChange={(event) => setMediaFiles(Array.from(event.target.files ?? []))}
                  className="field-input py-2 text-sm"
                />
              </label>
              {mediaFiles.length ? <p className="text-xs text-field-soft">已选择 {mediaFiles.length} 个文件，发布时会上传到 Supabase Storage。</p> : null}
              {formError ? <p className="rounded-[10px] bg-brick/10 px-3 py-2 text-sm text-brick">{formError}</p> : null}
              <Button disabled={!user} isLoading={createPost.isPending} onClick={submitPost}>发布</Button>
            </div>
          </div>
          <div className="paper-panel p-5">
            <p className="field-tag">审核与安全</p>
            <h2 className="mt-2 font-serif text-xl font-semibold">社区状态</h2>
            <div className="mt-4 grid gap-3 text-sm text-field-soft">
              <p>发布后默认进入审核中。</p>
              <p>点赞、收藏写入 Supabase 的 likes/favorites 表。</p>
              <p>举报会写入 reports 表，作者可以删除自己的内容。</p>
              <p>评论在帖子详情页提交。</p>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </section>
  )
}

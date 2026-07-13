import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import { StateBlock } from '../../components/common/StateBlock'
import { PostCard } from '../../components/community/PostCard'
import { Button } from '../../components/common/Button'
import { useAppStore } from '../../app/store/useAppStore'
import { useMembersQuery } from '../../hooks/usePublicData'
import { useCommunityPostsQuery, useCreateCommentMutation, useDeletePostMutation, usePostCommentsQuery, useReportTargetMutation, useToggleFavoriteMutation, useToggleLikeMutation } from '../../hooks/useCommunityData'
import { authService } from '../../features/auth/authService'
import { toAuthMessage } from '../../features/auth/authErrors'

export default function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)
  const setToast = useAppStore((state) => state.setToast)
  const membersQuery = useMembersQuery()
  const postsQuery = useCommunityPostsQuery()
  const commentsQuery = usePostCommentsQuery(postId)
  const createComment = useCreateCommentMutation(postId)
  const likePost = useToggleLikeMutation()
  const favoritePost = useToggleFavoriteMutation()
  const deletePost = useDeletePostMutation()
  const reportPost = useReportTargetMutation()
  const members = membersQuery.data ?? []
  const post = postsQuery.data?.find((item) => item.id === postId)
  const comments = commentsQuery.data ?? []
  const [commentBody, setCommentBody] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (postsQuery.isLoading) return <StateBlock type="loading" title="正在读取内容" description="请稍候。" />
  if (!post) return <StateBlock type="error" title="内容不存在" description="可能已删除、隐藏或链接有误。" />

  const submitComment = async () => {
    setErrorMessage(null)
    if (!user) {
      setErrorMessage('请先登录后再评论。')
      return
    }
    if (!commentBody.trim()) {
      setErrorMessage('评论内容不能为空。')
      return
    }
    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，评论将在真实环境生效。')
      return
    }

    try {
      await createComment.mutateAsync({ postId: post.id, body: commentBody.trim() })
      setCommentBody('')
      setToast('评论已发布')
    } catch (error) {
      setErrorMessage(toAuthMessage(error))
    }
  }

  const handleReport = async (targetId: string, targetType: 'post' | 'comment' = 'post') => {
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
      await reportPost.mutateAsync({ targetType, targetId, reason })
      setToast('举报已提交，管理员会在后台处理。')
    } catch (error) {
      setToast(toAuthMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('确认删除这条内容吗？删除后将返回社区列表。')) return
    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，删除将在真实环境生效。')
      return
    }
    try {
      await deletePost.mutateAsync(post.id)
      setToast('内容已删除。')
      navigate('/community')
    } catch (error) {
      setToast(toAuthMessage(error))
    }
  }

  return (
    <section className="field-container py-12">
      <PageMeta title={post.title} description={post.body} path={`/community/${post.id}`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div>
          <PostCard
            post={post}
            members={members}
            onLike={user ? (id) => likePost.mutate(id) : undefined}
            onFavorite={user ? (id) => favoritePost.mutate(id) : undefined}
            onReport={user ? (id) => handleReport(id) : undefined}
            onDelete={user ? handleDelete : undefined}
            canDelete={Boolean(user && post.authorId === user.id)}
            isMutating={likePost.isPending || favoritePost.isPending || reportPost.isPending || deletePost.isPending}
          />
          <div className="paper-panel mt-6 p-5">
            <p className="field-tag">田埂留言</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">评论</h2>
            <div className="mt-4 grid gap-3">
              {commentsQuery.isLoading ? (
                <StateBlock type="loading" title="正在读取评论" description="评论列表正在加载。" />
              ) : comments.length ? (
                comments.map((comment) => (
                  <article key={comment.id} className="rounded-[10px] border border-paper-line bg-field-surface p-3">
                    <p className="text-sm font-semibold text-field-ink">{comment.authorName}</p>
                    <p className="mt-1 text-sm text-field-soft">{comment.body}</p>
                    <button
                      type="button"
                      disabled={!user || reportPost.isPending}
                      onClick={() => handleReport(comment.id, 'comment')}
                      className="mt-2 text-xs text-field-soft underline-offset-4 hover:text-brick hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      举报评论
                    </button>
                  </article>
                ))
              ) : (
                <StateBlock type="empty" title="还没有评论" description="可以留下第一条认真回应。" />
              )}
            </div>
            <label className="mt-5 grid gap-1 text-sm font-semibold">
              发表评论
              <textarea value={commentBody} onChange={(event) => setCommentBody(event.target.value)} rows={4} className="field-input py-2" />
            </label>
            {errorMessage ? <p className="mt-3 rounded-[10px] bg-brick/10 px-3 py-2 text-sm text-brick">{errorMessage}</p> : null}
            <Button disabled={!user} isLoading={createComment.isPending} onClick={submitComment} className="mt-4">发表评论</Button>
          </div>
        </div>
        <aside className="paper-panel h-fit p-5 text-sm text-field-soft">
          <p className="field-tag">内容安全</p>
          <h2 className="mt-2 font-serif text-xl font-semibold text-field-ink">审核说明</h2>
          <p className="mt-3">举报会进入后台队列；作者可以删除自己的内容，管理员可在后台隐藏或删除违规内容。</p>
          <Button variant="secondary" disabled={!user} onClick={() => handleReport(post.id)} className="mt-4 w-full">举报这篇内容</Button>
        </aside>
      </div>
    </section>
  )
}

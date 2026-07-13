import { Flag, Heart, MessageCircle, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CommunityPost, Member } from '../../types/domain'
import { StatusBadge } from '../common/StatusBadge'
import { MediaFrame } from '../common/MediaFrame'

interface PostCardProps {
  post: CommunityPost
  members: Member[]
  onLike?: (postId: string) => void
  onFavorite?: (postId: string) => void
  onReport?: (postId: string) => void
  onDelete?: (postId: string) => void
  canDelete?: boolean
  isMutating?: boolean
}

export function PostCard({ post, members, onLike, onFavorite, onReport, onDelete, canDelete, isMutating }: PostCardProps) {
  const relatedMembers = members.filter((member) => post.memberIds.includes(member.id))

  return (
    <article className="paper-panel letter-card record-card p-5 hover:shadow-field-md">
      {post.coverImage ? (
        <MediaFrame
          title={post.title}
          alt={post.coverImage.alt}
          src={post.coverImage.status === 'approved' || post.coverImage.status === 'placeholder' ? post.coverImage.src : undefined}
          className="archive-photo mb-4 [&>div]:aspect-[16/9] [&>div]:min-h-0"
          objectPosition={post.coverImage.objectPosition ?? 'center center'}
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge>{post.status}</StatusBadge>
        <span className="field-tag">{post.category}</span>
      </div>
      <h3 className="mt-3 font-serif text-xl font-semibold text-field-ink">
        <Link to={`/community/${post.id}`}>{post.title}</Link>
      </h3>
      <p className="mt-2 text-sm text-field-soft">{post.body}</p>
      <p className="record-meta mt-3 text-xs">
        {post.authorName} · {new Date(post.createdAt).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })}
        {relatedMembers.length ? ` · ${relatedMembers.map((member) => member.name).join('、')}` : ''}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-field-soft">
        <button
          type="button"
          disabled={!onLike || isMutating}
          onClick={() => onLike?.(post.id)}
          className="interactive-press inline-flex min-h-10 items-center gap-1 rounded-field px-2 transition hover:bg-field-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Heart size={16} aria-hidden="true" />
          {post.likeCount}
        </button>
        <Link to={`/community/${post.id}`} className="interactive-press inline-flex min-h-10 items-center gap-1 rounded-field px-2 transition hover:bg-field-muted">
          <MessageCircle size={16} aria-hidden="true" />
          {post.commentCount}
        </Link>
        <button
          type="button"
          disabled={!onFavorite || isMutating}
          onClick={() => onFavorite?.(post.id)}
          className="interactive-press inline-flex min-h-10 items-center gap-1 rounded-field px-2 transition hover:bg-field-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Star size={16} aria-hidden="true" />
          {post.favoriteCount}
        </button>
        <button
          type="button"
          disabled={!onReport || isMutating}
          onClick={() => onReport?.(post.id)}
          className="interactive-press inline-flex min-h-10 items-center gap-1 rounded-field px-2 transition hover:bg-field-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Flag size={16} aria-hidden="true" />
          举报
        </button>
        {canDelete ? (
          <button
            type="button"
            disabled={!onDelete || isMutating}
            onClick={() => onDelete?.(post.id)}
            className="interactive-press inline-flex min-h-10 items-center gap-1 rounded-field px-2 text-brick transition hover:bg-brick/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} aria-hidden="true" />
            删除
          </button>
        ) : null}
      </div>
    </article>
  )
}

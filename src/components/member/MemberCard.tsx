import { ArrowRight, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Member } from '../../types/domain'
import { MediaFrame } from '../common/MediaFrame'
import { Button } from '../common/Button'
import { cn } from '../../lib/utils/cn'
import { getCompanionSticker } from '../../data/companionStickers'

export function MemberCard({
  member,
  featured = false,
  compact = false,
}: {
  member: Member
  featured?: boolean
  compact?: boolean
}) {
  const order = member.id.replace(/\D/g, '').padStart(2, '0')
  const visibleTags = compact ? member.tags.slice(0, 2) : member.tags.slice(0, 3)
  const sticker = getCompanionSticker(member.id)

  if (compact) {
    return (
      <article className="paper-panel dossier-card record-card member-card-compact flex h-full flex-col overflow-hidden hover:shadow-field-md">
        {sticker ? (
          <Link
            to={`/members/${member.id}`}
            className="member-sticker-card-art"
            aria-label={`查看${member.name}的成员档案`}
          >
            <img
              src={sticker.src}
              alt={`${member.name}卡通贴纸头像`}
              width="360"
              height="592"
              loading="lazy"
              decoding="async"
            />
            <span className="member-sticker-card-number">NO. {order}</span>
          </Link>
        ) : null}
        <div className="flex flex-1 flex-col p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="field-tag">田野伙伴</p>
            <button
              className="interactive-press flex min-h-11 min-w-11 items-center justify-center rounded-[9px] text-field-soft transition hover:bg-sprout-green/12 hover:text-field-green"
              aria-label={`收藏 ${member.name}`}
            >
              <Bookmark size={15} aria-hidden="true" />
            </button>
          </div>
          <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-field-ink">{member.name}</h3>
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-paper-line/70 pt-2">
            <p className="truncate text-xs font-semibold text-soil-brown">{member.shortTag}</p>
            <Link
              to={`/members/${member.id}`}
              className="interactive-press inline-flex min-h-11 shrink-0 items-center gap-1 px-1 text-xs font-semibold text-field-green"
            >
              详情 <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'paper-panel dossier-card record-card flex h-full flex-col overflow-hidden hover:shadow-field-md',
        featured ? 'md:col-span-2' : '',
        compact ? 'member-card-compact' : '',
      )}
    >
      <MediaFrame
        title={member.name}
        alt={member.image?.alt ?? `${member.name} 授权照片占位`}
        src={member.image?.status === 'approved' || member.image?.status === 'placeholder' ? member.image.src : undefined}
        tone={member.avatarTone}
        objectPosition={member.image?.mobileObjectPosition ?? member.image?.objectPosition ?? 'center center'}
        fit="cover"
        className={
          featured
            ? 'md:grid md:grid-cols-[1.1fr_.9fr]'
            : compact
              ? 'archive-photo rounded-b-none border-x-0 border-t-0 [&>div]:aspect-square [&>div]:min-h-0'
              : 'archive-photo [&>div]:aspect-[4/5] [&>div]:min-h-0'
        }
        captionClassName={compact ? 'sr-only' : undefined}
      />
      <div className={cn('flex flex-1 flex-col', compact ? 'p-3' : 'p-4')}>
        <div className={cn('flex items-start justify-between', compact ? 'gap-2' : 'gap-3')}>
          <div>
            <p className="field-tag">档案 NO. {order}</p>
            <h3 className={cn('mt-1 font-serif font-semibold text-field-ink', compact ? 'text-xl leading-tight' : 'text-2xl')}>
              {member.name}
            </h3>
            <p className={cn('mt-1 font-semibold text-soil-brown', compact ? 'text-xs' : 'text-sm')}>{member.shortTag}</p>
          </div>
          <button
            className={cn(
              'interactive-press flex items-center justify-center rounded-[10px] text-field-soft transition hover:bg-sprout-green/12 hover:text-field-green',
              'min-h-11 min-w-11',
            )}
            aria-label={`收藏 ${member.name}`}
          >
            <Bookmark size={compact ? 16 : 18} aria-hidden="true" />
          </button>
        </div>
        <p className={cn('member-card-intro text-field-soft', compact ? 'mt-2 text-xs leading-relaxed' : 'mt-3 text-sm')}>{member.intro}</p>
        <div className={cn('flex flex-wrap gap-2', compact ? 'mt-3' : 'mt-4')}>
          {visibleTags.map((tag) => (
            <span key={tag} className="field-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className={cn('mt-auto flex items-center justify-between gap-2', compact ? 'pt-3' : 'gap-3 pt-5')}>
          <p className="member-card-status text-xs text-field-soft">{member.recentStatus}</p>
          <Button asChild variant="ghost" className={compact ? 'min-h-11 px-1.5 text-xs' : 'px-2'}>
            <Link to={`/members/${member.id}`}>
              详情 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

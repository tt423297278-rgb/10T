import { CalendarPlus, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FanEvent, Member } from '../../types/domain'
import { StatusBadge } from '../common/StatusBadge'
import { Button } from '../common/Button'
import { MediaFrame } from '../common/MediaFrame'
import { cn } from '../../lib/utils/cn'

type EventCardProps = {
  event: FanEvent
  members: Member[]
  compact?: boolean
}

export function EventCard({ event, members, compact = false }: EventCardProps) {
  const eventMembers = members.filter((member) => event.memberIds.includes(member.id))

  return (
    <article className={cn('paper-panel dossier-card record-card date-spine flex h-full flex-col hover:shadow-field-md', compact ? 'p-3' : 'p-4')}>
      {event.coverImage ? (
        <MediaFrame
          title={event.title}
          alt={event.coverImage.alt}
          src={event.coverImage.status === 'approved' || event.coverImage.status === 'placeholder' ? event.coverImage.src : undefined}
          tone={event.coverTone}
          className={cn('archive-photo [&>div]:min-h-0', compact ? 'mb-3 [&>div]:aspect-[2/1]' : 'mb-4 [&>div]:aspect-[16/9]')}
          objectPosition={event.coverImage.objectPosition ?? 'center center'}
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge>{event.status}</StatusBadge>
        <span className="field-tag">{event.type}</span>
      </div>
      <h3 className={cn('mt-3 line-clamp-2 font-serif font-semibold text-field-ink', compact ? 'text-lg leading-snug' : 'text-xl')}>
        <Link to={`/events/${event.id}`}>{event.title}</Link>
      </h3>
      <p className={cn('mt-2 text-sm text-field-soft', compact ? 'line-clamp-1' : 'line-clamp-2')}>{event.description}</p>
      <div className={cn('grid gap-2', compact ? 'mt-3' : 'mt-4')}>
        <span className="record-meta">
          <Clock3 size={compact ? 14 : 16} aria-hidden="true" />
          {new Date(event.startsAt).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
        <span className="record-meta line-clamp-1">{event.platform} · {event.location}</span>
        <span className={cn('record-meta', compact ? 'line-clamp-1' : 'line-clamp-2')}>参与成员：{eventMembers.map((member) => member.name).join('、') || '待确认'}</span>
      </div>
      <div className={cn('mt-auto', compact ? 'pt-4' : 'pt-5')}>
        <Button asChild variant="secondary" className={cn('w-fit', compact && 'min-h-9 px-3 text-xs')}>
          <Link to={`/events/${event.id}`}>
            <CalendarPlus size={compact ? 14 : 16} aria-hidden="true" />
            查看活动
          </Link>
        </Button>
      </div>
    </article>
  )
}

import { useEffect, useState } from 'react'
import { CalendarDays, ExternalLink, MapPin, Tags } from 'lucide-react'
import type { AidBoardEvent } from '../../data/agriAidTimeline'
import { AgriAidEventIllustration } from './AgriAidEventIllustration'

type AgriAidEventDetailProps = {
  event: AidBoardEvent
}

export function AgriAidEventDetail({ event }: AgriAidEventDetailProps) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [event.id])

  const showApprovedPhoto = Boolean(
    event.image.localPath &&
    event.image.usageStatus === 'approved' &&
    (event.image.matchLevel === 'exact' || event.image.matchLevel === 'contextual') &&
    !imageFailed,
  )

  const visualLabel = showApprovedPhoto
    ? event.image.matchLevel === 'exact'
      ? '事件资料图'
      : '相关资料图'
    : event.image.matchLevel === 'placeholder'
      ? '图片待补充'
      : imageFailed
        ? '图片加载失败 · 原创插画'
        : '原创事件插画'

  return (
    <article className="agri-board-detail paper-panel" aria-live="polite">
      <figure className="agri-board-detail-media">
        {showApprovedPhoto ? (
          <img
            src={event.image.localPath}
            alt={event.image.alt}
            loading="eager"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="agri-board-detail-illustration"
            role="img"
            aria-label={`${event.title}原创事件示意插画`}
          >
            <AgriAidEventIllustration event={event} />
          </div>
        )}
        <figcaption>{visualLabel}</figcaption>
      </figure>
      <div className="agri-board-detail-copy">
        <div className="agri-board-detail-meta">
          <span>{event.year}</span>
          <span>{event.date}</span>
          <span>{event.category}</span>
          {event.pendingConfirm ? <span>待核验</span> : null}
        </div>
        <h3>{event.title}</h3>
        <p className="agri-board-detail-summary">{event.summary}</p>
        {event.detail ? <p className="agri-board-detail-body">{event.detail}</p> : null}
        <div className="agri-board-detail-facts">
          <span>
            <CalendarDays size={16} aria-hidden="true" />
            {event.year}.{event.date}
          </span>
          {event.location ? (
            <span>
              <MapPin size={16} aria-hidden="true" />
              {event.location}
            </span>
          ) : null}
          {event.tags?.length ? (
            <span>
              <Tags size={16} aria-hidden="true" />
              {event.tags.join(' / ')}
            </span>
          ) : null}
        </div>
        <div className="agri-board-detail-source">
          <span>
            {event.image.sourceName ? `资料来源：${event.image.sourceName}` : '视觉来源：本项目原创插画'}
          </span>
          {event.image.sourceUrl ? (
            <a href={event.image.sourceUrl} target="_blank" rel="noreferrer">
              查看来源
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

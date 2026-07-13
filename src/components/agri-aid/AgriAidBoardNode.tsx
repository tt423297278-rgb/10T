import type { CSSProperties } from 'react'
import type { AidBoardEvent } from '../../data/agriAidTimeline'
import { AgriAidEventIllustration } from './AgriAidEventIllustration'

type AgriAidBoardNodeProps = {
  event: AidBoardEvent
  index: number
  active: boolean
  selected: boolean
  onActivate: (id: string) => void
  onSelect: (id: string) => void
}

export function AgriAidBoardNode({
  event,
  index,
  active,
  selected,
  onActivate,
  onSelect,
}: AgriAidBoardNodeProps) {
  return (
    <button
      type="button"
      className={`agri-board-node agri-board-node-${event.importance ?? 'normal'} ${active ? 'agri-board-node-active' : ''} ${selected ? 'agri-board-node-selected' : ''}`}
      style={{ '--node-index': index } as CSSProperties}
      data-icon={event.icon}
      data-year={event.year}
      aria-label={`${event.year} ${event.date} ${event.title}`}
      aria-pressed={selected}
      onMouseEnter={() => onActivate(event.id)}
      onFocus={() => onActivate(event.id)}
      onClick={() => onSelect(event.id)}
    >
      <span className="agri-board-node-order" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <span className="agri-board-node-illustration" aria-hidden="true">
        <AgriAidEventIllustration event={event} />
      </span>
      <span className="agri-board-node-date">{event.date}</span>
      <span className="agri-board-node-title">{event.title}</span>
      <span className="agri-board-node-category">{event.category}</span>
      <span className="agri-board-node-summary">{event.summary}</span>
    </button>
  )
}

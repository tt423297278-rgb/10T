import type { SVGProps } from 'react'
import type { AidEventIcon } from '../../data/agriAidTimeline'

type AgriAidIconProps = {
  type: AidEventIcon
  title?: string
} & Omit<SVGProps<SVGSVGElement>, 'type'>

function WheatMark() {
  return (
    <g className="agri-board-icon-wheat" strokeLinecap="round">
      <path d="M72 62c0-12 1-22 4-33" />
      <path d="M76 38c5-4 8-9 8-15-6 2-9 7-8 15Z" />
      <path d="M74 47c-5-3-9-8-10-14 6 1 10 6 10 14Z" />
      <path d="M73 56c6-3 10-8 11-15-7 1-11 6-11 15Z" />
    </g>
  )
}

export function AgriAidIcon({ type, title, className, ...props }: AgriAidIconProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg
      viewBox="0 0 96 96"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={`agri-board-icon-svg ${className ?? ''}`}
      {...props}
    >
      <rect className="agri-board-icon-paper" x="9" y="9" width="78" height="78" rx="18" />
      {type === 'company' ? (
        <g {...common}>
          <path d="M27 70V43l21-16 21 16v27" />
          <path d="M37 70V53h22v17" />
          <path d="M48 27v-9" />
          <path className="agri-board-icon-gold" d="M48 18h18l-4 6 4 6H48" />
          <path d="M24 70h50" />
          <WheatMark />
        </g>
      ) : null}
      {type === 'live' ? (
        <g {...common}>
          <rect x="30" y="19" width="36" height="56" rx="8" />
          <path d="M42 31v23l18-11.5L42 31Z" />
          <path className="agri-board-icon-gold" d="M24 34c-5 7-5 17 0 24M72 34c5 7 5 17 0 24" />
          <path d="M43 65h10" />
          <WheatMark />
        </g>
      ) : null}
      {type === 'donation' ? (
        <g {...common}>
          <path d="M28 47h40v25H28z" />
          <path d="M28 47l8-14h24l8 14" />
          <path className="agri-board-icon-gold" d="M48 38c-8-8-18 1-10 9l10 9 10-9c8-8-2-17-10-9Z" />
          <path d="M21 72c7 7 17 8 27 0 10 8 20 7 27 0" />
        </g>
      ) : null}
      {type === 'farmProduct' ? (
        <g {...common}>
          <path d="M24 50h48l-6 24H30l-6-24Z" />
          <path d="M34 50c0-12 28-12 28 0" />
          <path className="agri-board-icon-gold" d="M36 43c-6-10 5-19 12-10 7-9 18 0 12 10" />
          <path d="M37 59h22M35 67h26" />
          <WheatMark />
        </g>
      ) : null}
      {type === 'strawberry' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M48 27c-11 0-20 8-18 22 2 13 12 25 18 30 6-5 16-17 18-30 2-14-7-22-18-22Z" />
          <path d="M40 27c0-8 9-10 16-4" />
          <path d="M35 33c5-5 10-8 13-8 4 0 9 3 13 8" />
          <path d="M42 44h.1M53 45h.1M47 56h.1M39 60h.1M57 60h.1" />
        </g>
      ) : null}
      {type === 'pepper' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M35 29c17 2 30 15 30 32 0 11-10 18-19 12-9-5-6-17-12-28-4-8-8-13 1-16Z" />
          <path d="M36 28c2-8 9-10 15-5" />
          <path d="M41 39c8 6 12 16 14 28" />
          <WheatMark />
        </g>
      ) : null}
      {type === 'crayfish' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M35 58c4-15 22-15 26 0 2 9-4 17-13 17s-15-8-13-17Z" />
          <path d="M34 56 20 43M62 56l14-13M28 45l-8-9M68 45l8-9" />
          <path d="M41 54h.1M55 54h.1M37 66h22" />
          <path d="M32 32c8 5 24 5 32 0" />
        </g>
      ) : null}
      {type === 'pig' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M26 54c0-16 12-27 29-27 11 0 19 8 19 19 0 17-14 28-31 28-10 0-17-8-17-20Z" />
          <path d="M32 36 24 27M61 30l9-7M50 54h.1M63 51h.1" />
          <path d="M36 63c7 4 19 4 26-1" />
        </g>
      ) : null}
      {type === 'jujube' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M24 55h48l-7 20H31l-7-20Z" />
          <path d="M32 55c2-11 30-11 32 0" />
          <path d="M37 38c-6-9 8-15 12-6 5-9 18-2 11 7-5 7-18 7-23-1Z" />
          <path d="M33 63h30M40 69h16" />
          <path d="M62 25h10v9" />
          <path d="M72 29c-8 0-12 4-14 10" />
        </g>
      ) : null}
      {type === 'soap' ? (
        <g {...common}>
          <rect className="agri-board-icon-gold" x="27" y="40" width="42" height="28" rx="10" />
          <path d="M37 52h22M34 59h28" />
          <path d="M34 30c-4-9 9-14 12-5 5-10 18-3 11 6" />
          <path d="M61 27c7-6 16 2 10 9" />
        </g>
      ) : null}
      {type === 'tree' ? (
        <g {...common}>
          <path d="M48 72V44" />
          <path className="agri-board-icon-gold" d="M48 46c-14-2-18-17-10-26 11 3 15 13 10 26Z" />
          <path d="M49 47c14-3 19-17 10-27-11 3-15 13-10 27Z" />
          <path d="M23 74c12-8 38-8 50 0" />
          <path d="M66 64l10-24" />
          <path d="M72 40l10 4-8 7" />
        </g>
      ) : null}
      {type === 'flower' ? (
        <g {...common}>
          <path d="M48 76V50" />
          <path className="agri-board-icon-gold" d="M48 45c-8-11 5-22 12-10 11-7 18 8 7 14 5 12-11 18-17 7-9 9-22-2-14-13-9-9 4-20 12-8Z" />
          <path d="M38 66c-7-1-12-5-15-12M58 62c8-3 12-9 14-18" />
          <path d="M24 76c14-7 34-7 48 0" />
        </g>
      ) : null}
      {type === 'greenhouse' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M20 67c2-24 16-40 28-40s26 16 28 40" />
          <path d="M25 67h46M48 27v40M30 47h36M36 35c6 8 6 22 6 32M60 35c-6 8-6 22-6 32" />
          <path d="M38 58c5-6 15-6 20 0" />
        </g>
      ) : null}
      {type === 'industry' ? (
        <g {...common}>
          <path d="M34 58c-5-8-2-19 7-24 8-5 19-2 24 7s2 19-7 24-19 2-24-7Z" />
          <path d="M42 53c-2-4-1-9 3-11 4-3 9-1 12 3 2 4 1 9-3 11-4 3-9 1-12-3Z" />
          <path className="agri-board-icon-gold" d="M24 69c16-12 32-6 48-18" />
          <path d="M27 42h-8M77 58h-8M35 25l-4-7M63 75l4 7" />
          <WheatMark />
        </g>
      ) : null}
      {type === 'truck' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M22 51h34v18H22zM56 57h12l7 12H56z" />
          <path d="M31 72a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM64 72a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
          <path d="M33 36c5-8 18-8 23 0M38 42c4-4 11-4 15 0" />
        </g>
      ) : null}
      {type === 'farmMachine' ? (
        <g {...common}>
          <path d="M21 61h23l9-18h18l6 18" />
          <path className="agri-board-icon-gold" d="M31 75a14 14 0 1 0 0-28 14 14 0 0 0 0 28ZM70 72a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path d="M31 47V34h17M48 34l8 9" />
          <path d="M21 39h12" />
        </g>
      ) : null}
      {type === 'map' ? (
        <g {...common}>
          <path d="M23 69V28l17-7 16 7 17-7v41l-17 7-16-7-17 7Z" />
          <path d="M40 21v41M56 28v41" />
          <path className="agri-board-icon-gold" d="M49 51c8-9 12-16 12-22a12 12 0 0 0-24 0c0 6 4 13 12 22Z" />
          <path d="M49 29h.1" />
        </g>
      ) : null}
      {type === 'school' || type === 'sportsField' ? (
        <g {...common}>
          <path d="M25 70V42l23-15 23 15v28" />
          <path className="agri-board-icon-gold" d="M37 70V52h22v18" />
          <path d="M33 45h30M48 27v-8M48 19h16" />
          {type === 'sportsField' ? <path d="M23 77c16-6 34-6 50 0M35 60h26" /> : <path d="M39 60h18" />}
        </g>
      ) : null}
      {type === 'book' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M22 28h24c5 0 8 3 8 8v38c0-5-3-8-8-8H22z" />
          <path d="M54 36c0-5 3-8 8-8h12v38H62c-5 0-8 3-8 8" />
          <path d="M33 40h11M33 50h10M63 40h6M63 50h6" />
        </g>
      ) : null}
      {type === 'salt' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M25 67c8-22 38-22 46 0H25Z" />
          <path d="M31 57c4-6 12-9 17-9s13 3 17 9" />
          <path d="M26 74h44M38 40h.1M48 34h.1M58 41h.1" />
          <path d="M22 30c13 6 38 6 52 0" />
        </g>
      ) : null}
      {type === 'clothes' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M35 25h26l13 13-9 11-7-6v31H38V43l-7 6-9-11 13-13Z" />
          <path d="M42 25c1 6 4 10 6 12 2-2 5-6 6-12" />
          <path d="M38 55h20" />
        </g>
      ) : null}
      {type === 'archive' ? (
        <g {...common}>
          <path d="M28 22h36l8 8v44H28z" />
          <path d="M64 22v10h8" />
          <path d="M38 42h22M38 52h18" />
          <path className="agri-board-icon-gold" d="M36 65h20v10H36z" />
          <path d="M60 67h8" />
        </g>
      ) : null}
      {type === 'award' ? (
        <g {...common}>
          <path className="agri-board-icon-gold" d="M34 21h28v16c0 12-7 22-14 26-7-4-14-14-14-26V21Z" />
          <path d="M34 29H22c0 11 5 18 14 19M62 29h12c0 11-5 18-14 19" />
          <path d="M48 35l3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1 3-6Z" />
          <path d="M39 75h18M44 63v12M52 63v12" />
        </g>
      ) : null}
      {type === 'milestone' ? (
        <g {...common}>
          <path d="M34 74V24" />
          <path className="agri-board-icon-gold" d="M34 26h34l-7 10 7 10H34" />
          <path d="M28 74h26" />
          <path d="M59 58l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1 4-8Z" />
          <WheatMark />
        </g>
      ) : null}
      {type === 'review' ? (
        <g {...common}>
          <path d="M25 68c13-22 31-15 45-39" />
          <path className="agri-board-icon-gold" d="M32 30h31v27H32z" />
          <path d="M41 24v10M55 24v10M38 43h19" />
          <path d="M28 76c4 0 8-2 10-5M50 70c4 1 8 0 11-3" />
        </g>
      ) : null}
    </svg>
  )
}

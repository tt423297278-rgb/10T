import type { ReactNode } from 'react'

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  level = 2,
  compact = false,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  level?: 1 | 2
  compact?: boolean
}) {
  const HeadingTag = level === 1 ? 'h1' : 'h2'

  return (
    <div className={`${compact ? 'mb-5 gap-3 md:mb-6' : 'mb-7 gap-4 md:mb-8'} flex flex-col sm:flex-row sm:items-end sm:justify-between`}>
      <div className="max-w-2xl">
        {eyebrow ? <p className={`field-tag ${compact ? 'mb-3' : 'mb-4'}`}>{eyebrow}</p> : null}
        <HeadingTag className={`wheat-line font-serif font-semibold leading-tight text-field-ink ${compact ? 'text-2xl sm:text-[1.72rem]' : 'text-2xl sm:text-3xl'}`}>
          {title}
        </HeadingTag>
        {description ? <p className={`${compact ? 'mt-2 text-sm' : 'mt-3'} max-w-xl text-field-soft`}>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

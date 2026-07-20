import type { ReactNode } from 'react'
import { Heart } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import {
  companionStickers,
  getCompanionStickerFromPathname,
} from '../../data/companionStickers'

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
  const location = useLocation()
  const memberSticker = getCompanionStickerFromPathname(location.pathname)
  const sticker = memberSticker ?? companionStickers[title.length % companionStickers.length]

  return (
    <div className={`section-header-scrapbook ${compact ? 'mb-5 gap-3 md:mb-6' : 'mb-7 gap-4 md:mb-8'} flex flex-col sm:flex-row sm:items-end sm:justify-between`}>
      <div className="section-header-copy max-w-2xl">
        {eyebrow ? <p className={`field-tag ${compact ? 'mb-3' : 'mb-4'}`}>{eyebrow}</p> : null}
        <HeadingTag className={`wheat-line font-serif font-semibold leading-tight text-field-ink ${compact ? 'text-2xl sm:text-[1.72rem]' : 'text-2xl sm:text-3xl'}`}>
          {title}
        </HeadingTag>
        {description ? <p className={`${compact ? 'mt-2 text-sm' : 'mt-3'} max-w-xl text-field-soft`}>{description}</p> : null}
      </div>
      <div className="section-header-side">
        <img
          className="section-header-wheat-art"
          src="/images/decor/wheat-bundle-sticker.webp"
          alt=""
          width="1024"
          height="1536"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        {action}
        <span className="section-header-keepsake" aria-hidden="true">
          <span className="section-header-keepsake-tape" />
          <img src={sticker.src} alt="" width="360" height="592" loading="lazy" decoding="async" />
          <span>
            <small>小家存档</small>
            <strong>{eyebrow ?? '田野手账'}</strong>
            <i><Heart size={11} fill="currentColor" /> 一起翻这一页</i>
          </span>
        </span>
      </div>
    </div>
  )
}

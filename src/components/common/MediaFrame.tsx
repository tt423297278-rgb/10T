import { ImageOff, Play } from 'lucide-react'
import { useState } from 'react'
import { fallbackImage } from '../../data/imageSources'
import { cn } from '../../lib/utils/cn'

export function MediaFrame({
  title,
  alt,
  src,
  tone = 'from-sky-blue to-sprout-green',
  video,
  className,
  captionClassName,
  fit = 'cover',
  objectPosition = 'center center',
  loading = 'lazy',
}: {
  title: string
  alt: string
  src?: string
  tone?: string
  video?: boolean
  className?: string
  captionClassName?: string
  fit?: 'cover' | 'contain'
  objectPosition?: string
  loading?: 'eager' | 'lazy'
}) {
  const [failed, setFailed] = useState(false)
  const imageSrc = src && !failed ? src : failed ? fallbackImage.src : undefined
  const imageAlt = failed ? fallbackImage.alt : alt

  return (
    <figure className={cn('media-frame overflow-hidden rounded-field border border-paper-line bg-field-muted', className)}>
      <div
        className={cn(
          'relative flex aspect-[4/3] min-h-40 items-center justify-center bg-gradient-to-br p-6 text-center text-paper-white',
          imageSrc ? 'from-field-green to-sprout-green' : tone,
        )}
        role="img"
        aria-label={imageAlt}
      >
        {imageSrc && fit === 'contain' ? (
          <img
            src={imageSrc}
            alt=""
            loading={loading}
            decoding="async"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-md"
            style={{ objectPosition }}
          />
        ) : null}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            loading={loading}
            decoding="async"
            className={cn(
              'media-frame-image absolute inset-0 h-full w-full opacity-0',
              fit === 'contain' ? 'object-contain p-1.5' : 'object-cover',
            )}
            style={{ objectPosition }}
            onLoad={(event) => {
              event.currentTarget.classList.remove('opacity-0')
              event.currentTarget.classList.add('opacity-100')
            }}
            onError={() => setFailed(true)}
          />
        ) : null}
        {!imageSrc ? (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,239,227,.24),transparent_32%),linear-gradient(90deg,rgba(244,239,227,.12)_1px,transparent_1px)] bg-[length:auto,24px_24px]" />
        ) : null}
        {!imageSrc ? (
          <div className="relative">
            {video ? <Play className="mx-auto mb-3" aria-hidden="true" /> : <ImageOff className="mx-auto mb-3" aria-hidden="true" />}
            <p className="font-serif text-lg font-semibold">{title}</p>
            <p className="mt-1 text-xs opacity-85">等待授权素材</p>
          </div>
        ) : null}
      </div>
      <figcaption className={cn('px-3 py-2 text-xs text-field-soft', captionClassName)}>{alt}</figcaption>
    </figure>
  )
}

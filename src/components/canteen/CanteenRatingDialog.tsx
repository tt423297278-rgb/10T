import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Star, X } from 'lucide-react'
import { Button } from '../common/Button'
import {
  canteenRatingDimensions,
  emptyCanteenRatingScores,
  validateCanteenRatingScores,
  type CanteenRatingDimension,
} from '../../features/canteen/canteenRatings'
import { toCanteenRatingMessage } from '../../services/canteenRatingService'
import type {
  CanteenPlace,
  CanteenRating,
  CanteenRatingScores,
  CanteenRatingSummary,
} from '../../types/domain'

interface RatingStarsProps {
  value: number
  size?: number
  label?: string
}

export function RatingStars({ value, size = 16, label }: RatingStarsProps) {
  const clampedValue = Math.max(0, Math.min(5, value))
  const gap = 2
  const width = size * 5 + gap * 4

  const stars = (filled: boolean) => (
    <span className="flex" style={{ gap }} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={1.8}
          fill={filled ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  )

  return (
    <span
      className="relative inline-flex shrink-0 text-wheat-strong"
      style={{ width, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <span className="absolute inset-0 text-field-soft/45">{stars(false)}</span>
      <span
        className="absolute inset-y-0 left-0 overflow-hidden text-wheat-strong"
        style={{ width: `${(clampedValue / 5) * 100}%` }}
      >
        <span className="block" style={{ width }}>
          {stars(true)}
        </span>
      </span>
    </span>
  )
}

function RatingInput({
  dimension,
  label,
  value,
  onChange,
}: {
  dimension: CanteenRatingDimension
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="grid gap-2 rounded-[12px] border border-paper-line bg-field-muted/35 p-3">
      <span className="flex items-center justify-between gap-3">
        <span className="font-semibold text-field-ink">{label}</span>
        <span className="flex items-center gap-2 text-sm tabular-nums text-field-soft">
          <RatingStars value={value} />
          {value ? `${value.toFixed(1)} 星` : '未评分'}
        </span>
      </span>
      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`${label}评分，0.5 星递增`}
        className="h-11 w-full cursor-pointer accent-field-green touch-manipulation"
        data-rating-dimension={dimension}
      />
      <span className="flex justify-between text-[11px] text-field-soft" aria-hidden="true">
        <span>未评分</span>
        <span>2.5</span>
        <span>5 星</span>
      </span>
    </label>
  )
}

function RatingSummaryPanel({ summary }: { summary?: CanteenRatingSummary }) {
  if (!summary) {
    return (
      <div className="rounded-[12px] border border-paper-line bg-field-muted/35 p-4 text-sm text-field-soft">
        这家店还没有评分，欢迎实际到店后留下第一份评价。
      </div>
    )
  }

  return (
    <div className="rounded-[12px] border border-wheat-gold/35 bg-wheat-gold/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <RatingStars value={summary.overall} size={18} label={`综合评分 ${summary.overall.toFixed(1)} 星`} />
          <strong className="font-serif text-2xl tabular-nums text-field-ink">{summary.overall.toFixed(1)}</strong>
        </div>
        <span className="text-xs text-field-soft">{summary.ratingCount} 人评价</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        {canteenRatingDimensions.map(({ key, label }) => (
          <div key={key} className="rounded-[8px] bg-paper-light/65 px-2 py-1.5 text-center">
            <dt className="text-xs text-field-soft">{label}</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-field-ink">{summary[key].toFixed(1)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

interface CanteenRatingDialogProps {
  place: CanteenPlace
  summary?: CanteenRatingSummary
  ownRating?: CanteenRating | null
  ownRatingLoading: boolean
  ownRatingError?: unknown
  isConfigured: boolean
  userId?: string
  returnTo: string
  isSaving: boolean
  onClose: () => void
  onSubmit: (scores: CanteenRatingScores) => Promise<void>
}

export function CanteenRatingDialog({
  place,
  summary,
  ownRating,
  ownRatingLoading,
  ownRatingError,
  isConfigured,
  userId,
  returnTo,
  isSaving,
  onClose,
  onSubmit,
}: CanteenRatingDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const [scores, setScores] = useState<CanteenRatingScores>(emptyCanteenRatingScores)
  const [visitedConfirmed, setVisitedConfirmed] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (ownRating) {
      setScores({
        taste: ownRating.taste,
        service: ownRating.service,
        value: ownRating.value,
        environment: ownRating.environment,
      })
    } else if (!ownRatingLoading) {
      setScores(emptyCanteenRatingScores)
    }
  }, [ownRating, ownRatingLoading, place.id])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusableElements?.length) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  const setScore = (dimension: CanteenRatingDimension, value: number) => {
    setScores((current) => ({ ...current, [dimension]: value }))
    setErrorMessage(null)
  }

  const handleSubmit = async () => {
    if (!validateCanteenRatingScores(scores)) {
      setErrorMessage('请完成口味、服务、性价比和环境四项评分，每项可按 0.5 星调整。')
      return
    }
    if (!visitedConfirmed) {
      setErrorMessage('请先确认你已经实际到店消费过。')
      return
    }

    setErrorMessage(null)
    try {
      await onSubmit(scores)
    } catch (error) {
      setErrorMessage(toCanteenRatingMessage(error))
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-field-ink/55 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="canteen-rating-title"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-[18px] border border-paper-line bg-paper-light p-5 shadow-field-md sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="field-tag">到店评分</p>
            <h2 id="canteen-rating-title" className="mt-2 font-serif text-2xl font-semibold text-field-ink">
              {place.name}
            </h2>
            <p className="mt-1 text-sm text-field-soft">{place.city} · {place.district}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="关闭评分窗口"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-[10px] text-field-soft transition hover:bg-field-muted hover:text-field-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-green"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5">
          <RatingSummaryPanel summary={summary} />
        </div>

        {!isConfigured ? (
          <div className="mt-5 rounded-[12px] border border-brick/25 bg-brick/8 p-4 text-sm leading-6 text-field-ink" role="status">
            当前本地环境没有配置 Supabase，暂时只能查看评分界面，不能保存真实评价。
          </div>
        ) : !userId ? (
          <div className="mt-5 rounded-[12px] border border-paper-line bg-field-muted/35 p-4 text-sm leading-6 text-field-ink">
            <p>评分只开放给登录用户，每个账号对同一家餐厅只保留一份评价。</p>
            <Button asChild className="mt-4 w-full sm:w-auto">
              <Link to={`/login?redirect=${encodeURIComponent(returnTo)}`}>登录后评分</Link>
            </Button>
          </div>
        ) : ownRatingLoading ? (
          <p className="mt-5 rounded-[12px] bg-field-muted/35 p-4 text-sm text-field-soft" role="status">正在读取你的历史评分…</p>
        ) : ownRatingError ? (
          <p className="mt-5 rounded-[12px] border border-brick/25 bg-brick/8 p-4 text-sm text-brick" role="alert">
            {toCanteenRatingMessage(ownRatingError)}
          </p>
        ) : (
          <div className="mt-5">
            <div className="grid gap-3">
              {canteenRatingDimensions.map(({ key, label }) => (
                <RatingInput
                  key={key}
                  dimension={key}
                  label={label}
                  value={scores[key]}
                  onChange={(value) => setScore(key, value)}
                />
              ))}
            </div>

            <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 rounded-[10px] border border-paper-line bg-field-surface p-3 text-sm leading-6 text-field-ink">
              <input
                type="checkbox"
                checked={visitedConfirmed}
                onChange={(event) => {
                  setVisitedConfirmed(event.target.checked)
                  setErrorMessage(null)
                }}
                className="mt-1 size-4 accent-field-green"
              />
              <span>我确认自己已经实际到店消费，并按真实体验评分。</span>
            </label>

            {errorMessage ? (
              <p className="mt-3 rounded-[10px] border border-brick/25 bg-brick/8 px-3 py-2 text-sm text-brick" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={onClose} disabled={isSaving}>取消</Button>
              <Button onClick={handleSubmit} isLoading={isSaving}>
                {ownRating ? '更新我的评分' : '提交评分'}
              </Button>
            </div>
            <p className="mt-3 text-xs leading-5 text-field-soft">
              一人一店只保留一份评分；再次提交会更新原评价，不会重复计数。
            </p>
          </div>
        )}
      </section>
    </div>,
    document.body,
  )
}

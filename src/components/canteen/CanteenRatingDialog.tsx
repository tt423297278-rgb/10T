import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Camera, ImagePlus, MapPin, ShieldCheck, Star, UtensilsCrossed, X } from 'lucide-react'
import { Button } from '../common/Button'
import {
  canteenRatingDimensions,
  emptyCanteenRatingScores,
  getCanteenOverallRating,
  validateCanteenRatingScores,
  type CanteenRatingDimension,
} from '../../features/canteen/canteenRatings'
import {
  canteenRatingImageAccept,
  canteenRatingImageLimit,
  validateCanteenRatingImages,
} from '../../features/canteen/canteenRatingPhotos'
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

export function CanteenScoreInput({
  dimension,
  label,
  value,
  onChange,
  idPrefix = 'canteen-rating',
}: {
  dimension: CanteenRatingDimension
  label: string
  value: number
  onChange: (value: number) => void
  idPrefix?: string
}) {
  const inputId = `${idPrefix}-${dimension}`
  const starSize = 34
  const starGap = 5
  const starWidth = starSize * 5 + starGap * 4

  const stars = (filled: boolean) => (
    <span className="flex" style={{ gap: starGap }} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={starSize}
          strokeWidth={1.55}
          fill={filled ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  )

  return (
    <div className="canteen-rating-dimension">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="font-semibold text-field-ink">
          {label}
        </label>
        <output
          htmlFor={inputId}
          className="min-w-[4.5rem] text-right text-sm font-semibold tabular-nums text-field-soft"
        >
          {value ? `${value.toFixed(1)} 星` : '点亮星星'}
        </output>
      </div>
      <div className="canteen-star-input mt-2" style={{ width: starWidth }}>
        <span className="absolute inset-0 text-[#b8afa0]">{stars(false)}</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden text-[#b27832]"
          style={{ width: `${(Math.max(0, Math.min(5, value)) / 5) * 100}%` }}
        >
          <span className="block" style={{ width: starWidth }}>
            {stars(true)}
          </span>
        </span>
        <input
          id={inputId}
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          onClick={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect()
            const ratio = (event.clientX - bounds.left) / bounds.width
            const nextValue = Math.max(0.5, Math.min(5, Math.round(ratio * 10) / 2))
            onChange(nextValue)
          }}
          aria-label={`${label}评分，0.5 星递增`}
          aria-valuetext={value ? `${value.toFixed(1)} 星` : '未评分'}
          className="absolute inset-0 z-10 h-11 w-full cursor-pointer opacity-0 touch-manipulation"
          data-rating-dimension={dimension}
        />
      </div>
      <p className="mt-1 text-xs text-field-soft">点击星星评分，可用方向键按半星调整</p>
    </div>
  )
}

function RatingSummaryPanel({ summary }: { summary?: CanteenRatingSummary }) {
  if (!summary) {
    return (
      <div className="canteen-rating-summary-empty">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-wheat-gold/15 text-wheat-strong">
          <Star size={24} strokeWidth={1.7} aria-hidden="true" />
        </div>
        <div>
          <strong className="font-serif text-lg text-field-ink">等你留下第一份到店评分</strong>
          <p className="mt-1 text-sm text-field-soft">四项分数会共同组成这家店的综合评分。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="canteen-rating-summary">
      <div className="canteen-rating-score-seal">
        <strong>{summary.overall.toFixed(1)}</strong>
        <span>综合分</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <RatingStars value={summary.overall} size={20} label={`综合评分 ${summary.overall.toFixed(1)} 星`} />
          <span className="text-sm text-field-soft">{summary.ratingCount} 人评价</span>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
          {canteenRatingDimensions.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-2 border-b border-paper-line/70 pb-1 sm:block sm:border-0 sm:pb-0">
              <dt className="text-field-soft">{label}</dt>
              <dd className="font-semibold tabular-nums text-field-ink">{summary[key].toFixed(1)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

interface RatingPhotoDraft {
  id: string
  file: File
  previewUrl: string
}

function RatingPhotoPicker({
  drafts,
  error,
  onFilesSelected,
  onRemove,
}: {
  drafts: RatingPhotoDraft[]
  error: string | null
  onFilesSelected: (files: File[]) => void
  onRemove: (id: string) => void
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const remaining = canteenRatingImageLimit - drafts.length

  return (
    <section className="canteen-photo-section" aria-labelledby={`${inputId}-title`}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 id={`${inputId}-title`} className="flex items-center gap-2 font-serif text-lg font-semibold text-field-ink">
            <Camera size={18} strokeWidth={1.8} aria-hidden="true" />
            晒晒这一餐
          </h3>
          <p id={`${inputId}-hint`} className="mt-1 text-sm text-field-soft">最多 4 张，支持 JPG、PNG、WebP、AVIF，单张不超过 10MB。</p>
        </div>
        <span className="text-xs font-semibold tabular-nums text-field-soft">{drafts.length}/{canteenRatingImageLimit}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {remaining > 0 ? (
          <label htmlFor={inputId} className="canteen-photo-add">
            <ImagePlus size={24} strokeWidth={1.7} aria-hidden="true" />
            <span>添加图片</span>
            <small>还可选 {remaining} 张</small>
          </label>
        ) : null}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={canteenRatingImageAccept}
          aria-describedby={`${inputId}-hint`}
          className="sr-only"
          onChange={(event) => {
            onFilesSelected(Array.from(event.target.files ?? []))
            if (inputRef.current) inputRef.current.value = ''
          }}
        />
        {drafts.map((draft, index) => (
          <figure key={draft.id} className="canteen-photo-preview">
            <img src={draft.previewUrl} alt={`已选择的评价图片：${draft.file.name}`} />
            <figcaption>{index + 1}</figcaption>
            <button
              type="button"
              aria-label={`移除图片 ${draft.file.name}`}
              onClick={() => onRemove(draft.id)}
              className="canteen-photo-remove"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </figure>
        ))}
      </div>
      {error ? <p className="mt-3 text-sm text-brick" role="alert">{error}</p> : null}
    </section>
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
  onSubmit: (scores: CanteenRatingScores, imageFiles: File[]) => Promise<void>
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
  const previewUrlsRef = useRef(new Set<string>())
  const [scores, setScores] = useState<CanteenRatingScores>(emptyCanteenRatingScores)
  const [visitedConfirmed, setVisitedConfirmed] = useState(false)
  const [photoDrafts, setPhotoDrafts] = useState<RatingPhotoDraft[]>([])
  const [photoError, setPhotoError] = useState<string | null>(null)
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

  useEffect(() => () => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrlsRef.current.clear()
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    if (dialogRef.current) dialogRef.current.scrollTop = 0
    closeButtonRef.current?.focus({ preventScroll: true })

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

  const addPhotoDrafts = (files: File[]) => {
    const validation = validateCanteenRatingImages(files, photoDrafts.length)
    if (!validation.ok) {
      setPhotoError(validation.message)
      return
    }

    const nextDrafts = files.map((file, index) => {
      const previewUrl = URL.createObjectURL(file)
      previewUrlsRef.current.add(previewUrl)
      return {
        id: `${file.name}-${file.lastModified}-${index}-${previewUrl}`,
        file,
        previewUrl,
      }
    })
    setPhotoDrafts((current) => [...current, ...nextDrafts])
    setPhotoError(null)
  }

  const removePhotoDraft = (id: string) => {
    setPhotoDrafts((current) => {
      const target = current.find((draft) => draft.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
        previewUrlsRef.current.delete(target.previewUrl)
      }
      return current.filter((draft) => draft.id !== id)
    })
    setPhotoError(null)
  }

  const handleSubmit = async () => {
    if (!isConfigured) return

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
      await onSubmit(scores, photoDrafts.map((draft) => draft.file))
    } catch (error) {
      setErrorMessage(toCanteenRatingMessage(error))
    }
  }

  const canShowRatingEditor = !isConfigured || Boolean(userId && !ownRatingLoading && !ownRatingError)
  const completedScoreCount = canteenRatingDimensions.filter(({ key }) => scores[key] > 0).length
  const liveOverallScore = validateCanteenRatingScores(scores)
    ? getCanteenOverallRating(scores)
    : null

  return createPortal(
    <div
      className="canteen-rating-backdrop fixed inset-0 z-50 grid place-items-center p-3 sm:p-5"
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
        className="canteen-rating-dialog max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto sm:max-h-[calc(100dvh-2.5rem)]"
      >
        <header className="canteen-rating-header">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-wheat-strong">
              <UtensilsCrossed size={15} strokeWidth={1.8} aria-hidden="true" />
              到店品鉴单
            </p>
            <h2 id="canteen-rating-title" className="mt-2 font-serif text-2xl font-semibold text-field-ink sm:text-3xl">
              {place.name}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-field-soft">
              <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />
              {place.city} · {place.district}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="关闭评分窗口"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-line bg-paper-light/80 text-field-soft transition duration-200 hover:border-wheat-gold/60 hover:text-field-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wheat-gold motion-reduce:transition-none"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="px-4 pb-0 pt-4 sm:px-7 sm:pt-6">
          <RatingSummaryPanel summary={summary} />

          {!isConfigured ? (
            <div className="canteen-rating-preview-note mt-4" role="status">
              <ShieldCheck size={18} strokeWidth={1.8} aria-hidden="true" />
              <p><strong>本地预览：</strong>评分与图片选择都可体验，但不会保存或上传。</p>
            </div>
          ) : !userId ? (
            <div className="mt-5 rounded-[14px] border border-paper-line bg-field-muted/35 p-4 text-sm leading-6 text-field-ink">
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
          ) : null}

          {canShowRatingEditor ? (
            <div className="mt-6">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-field-ink">这一餐，感受如何？</h3>
                  <p className="mt-1 text-sm text-field-soft">每项都需要评分，综合分取四项等权平均。</p>
                </div>
                <output
                  className={`canteen-rating-live-score${liveOverallScore !== null ? ' is-ready' : ''}`}
                  aria-live="polite"
                >
                  <span>{liveOverallScore !== null ? '本次综合评分' : `已完成 ${completedScoreCount}/4`}</span>
                  {liveOverallScore !== null ? (
                    <span className="inline-flex items-center gap-2">
                      <RatingStars
                        value={liveOverallScore}
                        size={14}
                        label={`本次综合评分 ${liveOverallScore.toFixed(1)} 星`}
                      />
                      <strong>{liveOverallScore.toFixed(1)}</strong>
                      <small>/ 5.0</small>
                    </span>
                  ) : (
                    <small>完成四项后自动计算</small>
                  )}
                </output>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {canteenRatingDimensions.map(({ key, label }) => (
                  <CanteenScoreInput
                    key={key}
                    dimension={key}
                    label={label}
                    value={scores[key]}
                    onChange={(value) => setScore(key, value)}
                  />
                ))}
              </div>

              <RatingPhotoPicker
                drafts={photoDrafts}
                error={photoError}
                onFilesSelected={addPhotoDrafts}
                onRemove={removePhotoDraft}
              />

              <label className="canteen-visited-confirmation">
                <input
                  type="checkbox"
                  checked={visitedConfirmed}
                  onChange={(event) => {
                    setVisitedConfirmed(event.target.checked)
                    setErrorMessage(null)
                  }}
                  className="mt-0.5 size-5 shrink-0 accent-field-green"
                />
                <span>
                  <strong className="block text-field-ink">我确认自己已经实际到店消费</strong>
                  <small className="mt-0.5 block text-field-soft">请根据真实体验评分，并只上传自己拍摄或有权使用的图片。</small>
                </span>
              </label>

              {errorMessage ? (
                <p className="mt-3 rounded-[10px] border border-brick/25 bg-brick/8 px-3 py-2 text-sm text-brick" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <div className="canteen-rating-actions">
                <p className="text-xs leading-5 text-field-soft sm:max-w-xs">
                  {!isConfigured
                    ? '当前是本地交互预览，不会创建评价或上传图片。'
                    : '一人一店只保留一份评分；再次提交会更新分数，图片将进入个人评价素材。'}
                </p>
                <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                  <Button variant="ghost" onClick={onClose} disabled={isSaving}>取消</Button>
                  <Button onClick={handleSubmit} isLoading={isSaving} disabled={!isConfigured}>
                    {!isConfigured ? '预览模式，无法提交' : ownRating ? '更新我的评价' : '发布到店评价'}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>,
    document.body,
  )
}

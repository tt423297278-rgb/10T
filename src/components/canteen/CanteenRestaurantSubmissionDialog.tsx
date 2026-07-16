import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  ClipboardCheck,
  MapPin,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  Store,
  Soup,
  WalletCards,
  X,
} from 'lucide-react'
import { Button } from '../common/Button'
import { CanteenScoreInput } from './CanteenRatingDialog'
import { CanteenAmapPicker } from './CanteenAmapPicker'
import {
  validateCanteenSubmission,
  type CanteenSubmissionDraft,
  type CanteenSubmissionField,
} from '../../features/canteen/canteenSubmissions'
import { canteenRatingDimensions, emptyCanteenRatingScores, getCanteenOverallRating } from '../../features/canteen/canteenRatings'
import { toCanteenSubmissionMessage } from '../../services/canteenSubmissionService'
import type { CanteenRatingDimension } from '../../features/canteen/canteenRatings'
import type { AmapPoiSelection } from '../../services/amapService'
import type { CanteenRegionManifest } from '../../types/domain'

interface CanteenRestaurantSubmissionDialogProps {
  regions: CanteenRegionManifest[]
  initialRegion?: string
  initialCity?: string
  isConfigured: boolean
  userId?: string
  returnTo: string
  isSaving: boolean
  onClose: () => void
  onSubmit: (draft: CanteenSubmissionDraft) => Promise<void>
}

const emptyDraft: CanteenSubmissionDraft = {
  name: '',
  region: '',
  city: '',
  district: '',
  address: '',
  longitude: null,
  latitude: null,
  amapPoiId: '',
  category: '',
  price: '',
  note: '',
  scores: emptyCanteenRatingScores,
  visitedConfirmed: false,
}

const fieldOrder: CanteenSubmissionField[] = [
  'name',
  'region',
  'city',
  'district',
  'address',
  'category',
  'price',
  'note',
  'scores',
  'visitedConfirmed',
]

function RequiredMark() {
  return <span className="text-brick" aria-hidden="true">*</span>
}

export function CanteenRestaurantSubmissionDialog({
  regions,
  initialRegion,
  initialCity,
  isConfigured,
  userId,
  returnTo,
  isSaving,
  onClose,
  onSubmit,
}: CanteenRestaurantSubmissionDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const [draft, setDraft] = useState<CanteenSubmissionDraft>(() => ({
    ...emptyDraft,
    region: initialRegion ?? '',
    city: initialCity ?? '',
    scores: { ...emptyCanteenRatingScores },
  }))
  const [errors, setErrors] = useState<Partial<Record<CanteenSubmissionField, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [amapPickerOpen, setAmapPickerOpen] = useState(false)
  const categories = useMemo(
    () => Array.from(new Set(regions.flatMap((region) => region.categories))).sort((a, b) => a.localeCompare(b, 'zh-CN')),
    [regions],
  )
  const completedScoreCount = canteenRatingDimensions.filter(({ key }) => draft.scores[key] > 0).length
  const liveOverallScore = completedScoreCount === canteenRatingDimensions.length
    ? getCanteenOverallRating(draft.scores)
    : null
  const amapSelection = useMemo<AmapPoiSelection | undefined>(() => {
    if (!Number.isFinite(draft.longitude) || !Number.isFinite(draft.latitude)) return undefined
    return {
      id: draft.amapPoiId,
      name: draft.name,
      address: draft.address,
      region: draft.region,
      city: draft.city,
      district: draft.district,
      longitude: draft.longitude!,
      latitude: draft.latitude!,
    }
  }, [draft.address, draft.amapPoiId, draft.city, draft.district, draft.latitude, draft.longitude, draft.name, draft.region])

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

  const clearFieldError = (field: CanteenSubmissionField) => {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
    setSubmitError(null)
  }

  const updateText = (field: 'name' | 'region' | 'city' | 'district' | 'address' | 'category' | 'price' | 'note', value: string) => {
    setDraft((current) => field === 'address'
      ? { ...current, address: value, longitude: null, latitude: null, amapPoiId: '' }
      : { ...current, [field]: value })
    clearFieldError(field)
  }

  const selectAmapPoi = (poi: AmapPoiSelection) => {
    const matchedRegion = regions.find((item) => poi.region.includes(item.name))?.name
    setDraft((current) => ({
      ...current,
      name: current.name.trim() || poi.name,
      region: current.region || matchedRegion || '',
      city: current.city.trim() || poi.city,
      district: current.district.trim() || poi.district,
      address: poi.address,
      longitude: poi.longitude,
      latitude: poi.latitude,
      amapPoiId: poi.id,
    }))
    clearFieldError('name')
    clearFieldError('region')
    clearFieldError('city')
    clearFieldError('district')
    clearFieldError('address')
  }

  const setScore = (dimension: CanteenRatingDimension, value: number) => {
    setDraft((current) => ({ ...current, scores: { ...current.scores, [dimension]: value } }))
    clearFieldError('scores')
  }

  const focusFirstError = (nextErrors: Partial<Record<CanteenSubmissionField, string>>) => {
    const field = fieldOrder.find((item) => nextErrors[item])
    if (!field) return
    const targetId = field === 'scores' ? 'canteen-submit-score-taste' : `canteen-submit-${field}`
    requestAnimationFrame(() => document.getElementById(targetId)?.focus())
  }

  const handleSubmit = async () => {
    const validation = validateCanteenSubmission(draft)
    if (!validation.ok) {
      setErrors(validation.errors)
      focusFirstError(validation.errors)
      return
    }
    if (!isConfigured || !userId) return

    setErrors({})
    setSubmitError(null)
    try {
      await onSubmit(validation.value)
    } catch (error) {
      setSubmitError(toCanteenSubmissionMessage(error))
    }
  }

  const inputClass = (field: CanteenSubmissionField) => (
    `field-input min-h-12 w-full ${errors[field] ? 'border-brick focus:border-brick focus:ring-brick/25' : ''}`
  )
  const describedBy = (field: CanteenSubmissionField, hintId?: string) => (
    [hintId, errors[field] ? `canteen-submit-${field}-error` : ''].filter(Boolean).join(' ') || undefined
  )

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
        aria-labelledby="canteen-submit-title"
        className="canteen-rating-dialog canteen-submit-dialog max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto sm:max-h-[calc(100dvh-2.5rem)]"
      >
        <header className="canteen-rating-header canteen-submit-header">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-wheat-strong">
              <Store size={15} strokeWidth={1.8} aria-hidden="true" />
              禾伙人新店推荐
            </p>
            <h2 id="canteen-submit-title" className="mt-2 font-serif text-2xl font-semibold text-field-ink sm:text-3xl">
              把你吃过的好店，补进食堂
            </h2>
            <p className="mt-1 text-sm leading-6 text-field-soft">资料和四项评分会一起进入审核，通过后才会公开。</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="关闭推荐餐厅窗口"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-line bg-paper-light/80 text-field-soft transition duration-200 hover:border-wheat-gold/60 hover:text-field-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wheat-gold motion-reduce:transition-none"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="px-4 pb-6 pt-4 sm:px-7 sm:pb-7 sm:pt-6">
          {!isConfigured ? (
            <div className="canteen-rating-preview-note" role="status">
              <ShieldCheck size={18} strokeWidth={1.8} aria-hidden="true" />
              <p><strong>本地预览：</strong>可以完整填写和打分，但不会创建真实投稿。</p>
            </div>
          ) : !userId ? (
            <div className="canteen-submit-login-note" role="status">
              <BadgeCheck size={20} strokeWidth={1.8} aria-hidden="true" />
              <div>
                <strong>登录后才可提交</strong>
                <p>你可以先查看和填写表单，登录后再提交审核。</p>
              </div>
            </div>
          ) : (
            <div className="canteen-submit-login-note is-ready" role="status">
              <BadgeCheck size={20} strokeWidth={1.8} aria-hidden="true" />
              <div>
                <strong>已满足账号条件</strong>
                <p>请只推荐自己实际吃过、信息可核验的门店。</p>
              </div>
            </div>
          )}

          <form className="mt-6" onSubmit={(event) => { event.preventDefault(); void handleSubmit() }} noValidate>
            <section aria-labelledby="canteen-submit-info-title">
              <div className="canteen-submit-section-heading">
                <span>01</span>
                <div>
                  <h3 id="canteen-submit-info-title">餐厅资料</h3>
                  <p>带 <RequiredMark /> 的内容必须填写清楚，方便后续核验。</p>
                </div>
              </div>

              <div className="canteen-submit-fields mt-4 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 sm:col-span-2" htmlFor="canteen-submit-name">
                  <span className="canteen-submit-label"><Store size={16} aria-hidden="true" />餐厅名称 <RequiredMark /></span>
                  <input
                    id="canteen-submit-name"
                    value={draft.name}
                    maxLength={80}
                    autoComplete="organization"
                    placeholder="请填写门店招牌上的完整名称"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy('name')}
                    className={inputClass('name')}
                    onChange={(event) => updateText('name', event.target.value)}
                  />
                  {errors.name ? <span id="canteen-submit-name-error" className="canteen-submit-error" role="alert">{errors.name}</span> : null}
                </label>

                <label className="grid gap-1.5" htmlFor="canteen-submit-region">
                  <span className="canteen-submit-label"><MapPin size={16} aria-hidden="true" />省份 / 地区 <RequiredMark /></span>
                  <select
                    id="canteen-submit-region"
                    value={draft.region}
                    aria-invalid={Boolean(errors.region)}
                    aria-describedby={describedBy('region')}
                    className={inputClass('region')}
                    onChange={(event) => updateText('region', event.target.value)}
                  >
                    <option value="">请选择省份 / 地区</option>
                    {regions.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                  </select>
                  {errors.region ? <span id="canteen-submit-region-error" className="canteen-submit-error" role="alert">{errors.region}</span> : null}
                </label>

                <label className="grid gap-1.5" htmlFor="canteen-submit-city">
                  <span className="canteen-submit-label"><MapPin size={16} aria-hidden="true" />城市 <RequiredMark /></span>
                  <input
                    id="canteen-submit-city"
                    value={draft.city}
                    maxLength={40}
                    autoComplete="address-level2"
                    placeholder="例如：重庆、合肥"
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={describedBy('city')}
                    className={inputClass('city')}
                    onChange={(event) => updateText('city', event.target.value)}
                  />
                  {errors.city ? <span id="canteen-submit-city-error" className="canteen-submit-error" role="alert">{errors.city}</span> : null}
                </label>

                <label className="grid gap-1.5" htmlFor="canteen-submit-district">
                  <span className="canteen-submit-label">区 / 县 <small>选填</small></span>
                  <input
                    id="canteen-submit-district"
                    value={draft.district}
                    maxLength={60}
                    autoComplete="address-level3"
                    placeholder="例如：巴南区"
                    aria-invalid={Boolean(errors.district)}
                    aria-describedby={describedBy('district')}
                    className={inputClass('district')}
                    onChange={(event) => updateText('district', event.target.value)}
                  />
                  {errors.district ? <span id="canteen-submit-district-error" className="canteen-submit-error" role="alert">{errors.district}</span> : null}
                </label>

                <label className="grid gap-1.5" htmlFor="canteen-submit-category">
                  <span className="canteen-submit-label"><Soup size={16} aria-hidden="true" />食物分类 <RequiredMark /></span>
                  <select
                    id="canteen-submit-category"
                    value={draft.category}
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={describedBy('category')}
                    className={inputClass('category')}
                    onChange={(event) => updateText('category', event.target.value)}
                  >
                    <option value="">请选择最接近的分类</option>
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  {errors.category ? <span id="canteen-submit-category-error" className="canteen-submit-error" role="alert">{errors.category}</span> : null}
                </label>

                <div className="grid gap-1.5 sm:col-span-2">
                  <label className="canteen-submit-label" htmlFor="canteen-submit-address"><MapPin size={16} aria-hidden="true" />详细地址 <small>选填</small></label>
                  <input
                    id="canteen-submit-address"
                    value={draft.address}
                    maxLength={200}
                    autoComplete="street-address"
                    placeholder="知道就填写，不知道可以留空"
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={describedBy('address', 'canteen-submit-address-hint')}
                    className={inputClass('address')}
                    onChange={(event) => updateText('address', event.target.value)}
                  />
                  <div className="canteen-address-actions">
                    <span id="canteen-submit-address-hint" className="text-xs text-field-soft">
                      可以手填，也可以按店名从高德地图搜索；选取后会自动带回地址。
                    </span>
                    <button
                      type="button"
                      className="canteen-amap-toggle"
                      aria-expanded={amapPickerOpen}
                      aria-controls="canteen-amap-picker-panel"
                      onClick={() => setAmapPickerOpen((open) => !open)}
                    >
                      <MapPinned size={17} aria-hidden="true" />
                      {amapPickerOpen ? '收起地图选取' : '从高德地图选取'}
                    </button>
                  </div>
                  {amapSelection ? (
                    <p className="canteen-amap-selected-note" role="status">
                      已选取地图位置 · {amapSelection.longitude.toFixed(5)}, {amapSelection.latitude.toFixed(5)}
                    </p>
                  ) : null}
                  {errors.address ? <span id="canteen-submit-address-error" className="canteen-submit-error" role="alert">{errors.address}</span> : null}
                  {amapPickerOpen ? (
                    <div id="canteen-amap-picker-panel">
                      <CanteenAmapPicker
                        restaurantName={draft.name}
                        city={draft.city}
                        selection={amapSelection}
                        onSelect={selectAmapPoi}
                      />
                    </div>
                  ) : null}
                </div>

                <label className="grid gap-1.5" htmlFor="canteen-submit-price">
                  <span className="canteen-submit-label"><WalletCards size={16} aria-hidden="true" />人均价格 <small>选填</small></span>
                  <input
                    id="canteen-submit-price"
                    value={draft.price}
                    maxLength={60}
                    inputMode="text"
                    placeholder="例如：人均 80 元"
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={describedBy('price')}
                    className={inputClass('price')}
                    onChange={(event) => updateText('price', event.target.value)}
                  />
                  {errors.price ? <span id="canteen-submit-price-error" className="canteen-submit-error" role="alert">{errors.price}</span> : null}
                </label>

                <label className="grid gap-1.5 sm:col-span-2" htmlFor="canteen-submit-note">
                  <span className="canteen-submit-label"><MessageSquareText size={16} aria-hidden="true" />推荐理由 / 到店提醒 <small>选填</small></span>
                  <textarea
                    id="canteen-submit-note"
                    value={draft.note}
                    maxLength={500}
                    rows={3}
                    placeholder="可以写招牌菜、排队情况、营业时段等真实体验"
                    aria-invalid={Boolean(errors.note)}
                    aria-describedby={describedBy('note', 'canteen-submit-note-count')}
                    className={`${inputClass('note')} min-h-24 resize-y py-3`}
                    onChange={(event) => updateText('note', event.target.value)}
                  />
                  <span id="canteen-submit-note-count" className="text-right text-xs tabular-nums text-field-soft">{draft.note.length}/500</span>
                  {errors.note ? <span id="canteen-submit-note-error" className="canteen-submit-error" role="alert">{errors.note}</span> : null}
                </label>
              </div>
            </section>

            <section className="mt-8 border-t border-paper-line pt-7" aria-labelledby="canteen-submit-rating-title">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="canteen-submit-section-heading">
                  <span>02</span>
                  <div>
                    <h3 id="canteen-submit-rating-title">先留下你的到店评分 <RequiredMark /></h3>
                    <p>四项都要评分，支持半星；这份评分随餐厅资料一起审核。</p>
                  </div>
                </div>
                <output className={`canteen-rating-live-score${liveOverallScore !== null ? ' is-ready' : ''}`} aria-live="polite">
                  <span>{liveOverallScore !== null ? '本次综合评分' : `已完成 ${completedScoreCount}/4`}</span>
                  {liveOverallScore !== null ? (
                    <span className="inline-flex items-baseline gap-1">
                      <strong>{liveOverallScore.toFixed(1)}</strong>
                      <small>/ 5.0</small>
                    </span>
                  ) : (
                    <small>完成四项后自动计算</small>
                  )}
                </output>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2" aria-invalid={Boolean(errors.scores)} aria-describedby={errors.scores ? 'canteen-submit-scores-error' : undefined}>
                {canteenRatingDimensions.map(({ key, label }) => (
                  <CanteenScoreInput
                    key={key}
                    idPrefix="canteen-submit-score"
                    dimension={key}
                    label={label}
                    value={draft.scores[key]}
                    onChange={(value) => setScore(key, value)}
                  />
                ))}
              </div>
              {errors.scores ? <p id="canteen-submit-scores-error" className="canteen-submit-error mt-3" role="alert">{errors.scores}</p> : null}
            </section>

            <section className="mt-7 border-t border-paper-line pt-6" aria-labelledby="canteen-submit-confirm-title">
              <div className="canteen-submit-section-heading">
                <span>03</span>
                <div>
                  <h3 id="canteen-submit-confirm-title">确认真实到店</h3>
                  <p>投稿会标记提交账号，并进入后台审核队列。</p>
                </div>
              </div>
              <label className={`canteen-visited-confirmation mt-4 ${errors.visitedConfirmed ? 'has-error' : ''}`} htmlFor="canteen-submit-visitedConfirmed">
                <input
                  id="canteen-submit-visitedConfirmed"
                  type="checkbox"
                  checked={draft.visitedConfirmed}
                  aria-invalid={Boolean(errors.visitedConfirmed)}
                  aria-describedby={errors.visitedConfirmed ? 'canteen-submit-visitedConfirmed-error' : undefined}
                  className="mt-0.5 size-5 shrink-0 accent-field-green"
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, visitedConfirmed: event.target.checked }))
                    clearFieldError('visitedConfirmed')
                  }}
                />
                <span>
                  <strong className="block text-field-ink">我确认自己已经实际到店消费，并愿意为所填信息负责 <RequiredMark /></strong>
                  <small className="mt-0.5 block text-field-soft">请勿提交网传清单、广告信息或无法核验的门店。</small>
                </span>
              </label>
              {errors.visitedConfirmed ? <p id="canteen-submit-visitedConfirmed-error" className="canteen-submit-error mt-2" role="alert">{errors.visitedConfirmed}</p> : null}
            </section>

            {submitError ? <p className="mt-4 rounded-[10px] border border-brick/25 bg-brick/8 px-3 py-2 text-sm text-brick" role="alert">{submitError}</p> : null}

            <div className="canteen-submit-actions mt-7">
              <div className="flex items-start gap-2 text-xs leading-5 text-field-soft">
                <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-field-green" aria-hidden="true" />
                <p>提交后状态为“待审核”；审核通过前不会出现在公开餐厅列表。</p>
              </div>
              <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>取消</Button>
                {!isConfigured ? (
                  <Button type="submit" disabled>预览模式，无法提交</Button>
                ) : !userId ? (
                  <Button asChild>
                    <Link to={`/login?redirect=${encodeURIComponent(returnTo)}`}>登录后提交</Link>
                  </Button>
                ) : (
                  <Button type="submit" isLoading={isSaving}>提交审核</Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>,
    document.body,
  )
}

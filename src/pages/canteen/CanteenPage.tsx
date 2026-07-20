import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import {
  ArrowDownWideNarrow,
  ArrowUpRight,
  Beef,
  Beer,
  BookOpen,
  Compass,
  CookingPot,
  Croissant,
  CircleOff,
  CupSoda,
  Dices,
  Fish,
  Flame,
  Leaf,
  Map,
  MapPin,
  MapPinned,
  Pizza,
  Plus,
  RotateCcw,
  Salad,
  Sandwich,
  Search,
  Sparkles,
  Soup,
  UtensilsCrossed,
  WalletCards,
  X,
} from 'lucide-react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../../app/store/useAppStore'
import { CanteenPickDialog } from '../../components/canteen/CanteenPickDialog'
import { CanteenRatingDialog, RatingStars } from '../../components/canteen/CanteenRatingDialog'
import { CanteenRestaurantSubmissionDialog } from '../../components/canteen/CanteenRestaurantSubmissionDialog'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'
import { StateBlock } from '../../components/common/StateBlock'
import {
  canteenImportStats,
  canteenRegions,
  canteenSnapshotDate,
  canteenSourceUrl,
} from '../../data/canteenManifest'
import {
  allFilterValue,
  canteenPriceBands,
  canteenSortOptions,
  filterCanteenPlaces,
  isCanteenPriceBandId,
  isCanteenSortId,
  pickCanteenPlace,
  sortCanteenPlaces,
  type CanteenPriceBandId,
  type CanteenSortId,
} from '../../features/canteen/canteenFilters'
import { getCanteenCover } from '../../features/canteen/canteenCovers'
import { pickPopularCanteenCity, popularCanteenCities } from '../../features/canteen/canteenPopularCities'
import { loadCanteenRegion } from '../../services/canteenDataService'
import { canteenRatingService } from '../../services/canteenRatingService'
import { canteenSubmissionService } from '../../services/canteenSubmissionService'
import {
  useCanteenRatingSummaries,
  useOwnCanteenRating,
  useSaveCanteenRating,
} from '../../hooks/useCanteenRatings'
import { useCreateCanteenSubmission } from '../../hooks/useCanteenSubmissions'
import type { CanteenSubmissionDraft } from '../../features/canteen/canteenSubmissions'
import type { CanteenPlace, CanteenRatingScores, CanteenRatingSummary } from '../../types/domain'

const countFormatter = new Intl.NumberFormat('zh-CN')
function CanteenCategoryIcon({ category }: { category: string }) {
  let Icon = UtensilsCrossed

  if (/(甜品|饮品|奶茶|咖啡|冰)/.test(category)) Icon = CupSoda
  else if (/(火锅|串串|汤锅|炖菜)/.test(category)) Icon = CookingPot
  else if (/(烧烤|烤肉)/.test(category)) Icon = Flame
  else if (/(面食|米粉)/.test(category)) Icon = Soup
  else if (/(早餐|小吃)/.test(category)) Icon = Croissant
  else if (/(米饭|简餐)/.test(category)) Icon = Sandwich
  else if (/(海鲜|河鲜)/.test(category)) Icon = Fish
  else if (/(卤味|熟食)/.test(category)) Icon = Beef
  else if (/素食/.test(category)) Icon = Leaf
  else if (/(酒馆|夜宵)/.test(category)) Icon = Beer
  else if (/西餐/.test(category)) Icon = Pizza
  else if (/(东南亚|异国菜)/.test(category)) Icon = Salad
  else if (/地方菜/.test(category)) Icon = CookingPot

  return <Icon size={18} strokeWidth={1.9} />
}

function CanteenCard({
  place,
  picked,
  ratingSummary,
  onRate,
}: {
  place: CanteenPlace
  picked: boolean
  ratingSummary?: CanteenRatingSummary
  onRate: () => void
}) {
  const cover = getCanteenCover([place.category, place.categoryDetail, place.name].filter(Boolean).join(' '))

  return (
    <article
      id={`canteen-place-${place.id}`}
      data-flavor={cover.tone}
      className={`canteen-place-card relative flex h-full min-w-0 flex-col overflow-hidden rounded-[12px] border bg-field-surface/92 p-3 shadow-field-sm transition duration-300 ease-field motion-reduce:transition-none ${
        picked
          ? 'border-wheat-gold ring-2 ring-wheat-gold/35'
          : 'border-paper-line hover:-translate-y-0.5 hover:border-field-green/30 hover:shadow-field-md motion-reduce:hover:translate-y-0'
      }`}
    >
      {picked ? (
        <span className="absolute right-2.5 top-2.5 z-30 rotate-[-7deg] rounded-[6px] border-2 border-wheat-gold bg-paper-light px-2 py-0.5 font-serif text-[11px] font-bold text-soil-brown shadow-field-sm">
          开饭签
        </span>
      ) : null}
      <figure className="canteen-card-cover -mx-3 -mt-3 mb-3">
        <img
          src={cover.src}
          alt=""
          loading="lazy"
          decoding="async"
          width="960"
          height="600"
        />
        <span className="canteen-card-mast" aria-hidden="true">
          <CanteenCategoryIcon category={place.category} />
        </span>
        <span className="canteen-card-cover-badge">品类示意 · {cover.label}</span>
        <figcaption className="sr-only">
          {cover.label}品类示意图，并非{place.name}的门店实拍
        </figcaption>
      </figure>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="field-tag max-w-full truncate px-1.5 py-0.5 text-[11px]" title={`${place.city} · ${place.district}`}>
          {place.city} · {place.district}
        </span>
        <span className="max-w-full truncate rounded-[6px] border border-wheat-gold/35 bg-wheat-gold/10 px-1.5 py-0.5 text-[11px] font-semibold text-soil-brown" title={place.category}>
          {place.category}
        </span>
        {place.status === 'closed' ? (
          <span className="inline-flex items-center gap-1 rounded-[6px] border border-brick/30 bg-brick/8 px-1.5 py-0.5 text-[11px] font-semibold text-brick">
            <CircleOff size={12} aria-hidden="true" />
            已停业 / 搬迁
          </span>
        ) : null}
      </div>
      <h3 className="mt-2.5 min-h-12 line-clamp-2 font-sans text-[15px] font-bold leading-6 tracking-[0.01em] text-field-ink" title={place.name}>{place.name}</h3>
      {place.categoryDetail ? (
        <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-field-soft" title={`原表菜系：${place.categoryDetail}`}>原表菜系：{place.categoryDetail}</p>
      ) : null}
      <div className="mt-3 grid gap-2 text-xs leading-5 text-field-soft">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-field-green" aria-hidden="true" />
          <span className="line-clamp-3" title={place.address}>{place.address}</span>
        </p>
        {place.price ? (
          <p className="flex items-start gap-2">
            <WalletCards className="mt-0.5 size-3.5 shrink-0 text-field-green" aria-hidden="true" />
            <span className="line-clamp-1" title={place.price}>{place.price}</span>
          </p>
        ) : null}
      </div>
      {place.tips ? (
        <div className="mt-3 rounded-[8px] border border-sky-blue/60 bg-sky-blue/18 px-2.5 py-2 text-xs leading-5 text-field-ink" title={`到店提醒：${place.tips}`}>
          <p className="line-clamp-3"><span className="font-semibold">到店提醒：</span>{place.tips}</p>
        </div>
      ) : null}
      {place.note ? <p className="mt-3 line-clamp-2 text-xs leading-5 text-field-soft" title={`禾伙人记录：${place.note}`}>禾伙人记录：{place.note}</p> : null}
      <button
        type="button"
        onClick={onRate}
        className="canteen-rating-button mt-auto flex min-h-11 w-full items-center justify-between gap-1 rounded-[7px] border border-wheat-gold/30 bg-wheat-gold/8 px-1.5 py-1 text-left text-[10px] font-semibold text-field-ink transition duration-200 hover:border-wheat-gold/55 hover:bg-wheat-gold/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-green motion-reduce:transition-none"
        aria-label={ratingSummary ? `查看或更新${place.name}的评分，当前综合 ${ratingSummary.overall.toFixed(1)} 星` : `为${place.name}评分`}
      >
        <span className="flex min-w-0 items-center gap-1">
          <RatingStars value={ratingSummary?.overall ?? 0} size={11} />
          <span className="shrink-0 whitespace-nowrap tabular-nums">{ratingSummary ? ratingSummary.overall.toFixed(1) : '暂无'}</span>
        </span>
        <span className="shrink-0 whitespace-nowrap text-field-green">{ratingSummary ? `${ratingSummary.ratingCount} 人` : '去评分'}</span>
      </button>
      <div className="mt-2 border-t border-paper-line pt-2.5 text-[11px] text-field-soft">
        <a
          href={place.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1 font-semibold leading-4 text-field-green underline decoration-field-green/30 underline-offset-4 hover:decoration-field-green"
        >
          核对原表 · {place.sourceSheet}第 {place.sourceRow} 行
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

export default function CanteenPage() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useAppStore((state) => state.user)
  const setToast = useAppStore((state) => state.setToast)
  const [pageSize] = useState(() => window.matchMedia('(max-width: 767px)').matches ? 12 : 24)
  const [places, setPlaces] = useState<CanteenPlace[]>([])
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [retryKey, setRetryKey] = useState(0)
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [pickDialogOpen, setPickDialogOpen] = useState(false)
  const [ratingPlace, setRatingPlace] = useState<CanteenPlace | null>(null)
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false)
  const [defaultPopularCity] = useState(() => pickPopularCanteenCity())

  const regionParam = searchParams.get('region') ?? allFilterValue
  const selectedRegion = canteenRegions.find((region) => region.name === regionParam)
  const region = selectedRegion?.name ?? allFilterValue
  const cityParam = searchParams.get('city') ?? allFilterValue
  const city = selectedRegion?.cities.includes(cityParam) ? cityParam : allFilterValue
  const categoryParam = searchParams.get('category') ?? allFilterValue
  const category = selectedRegion?.categories.includes(categoryParam) ? categoryParam : allFilterValue
  const nameQuery = (searchParams.get('q') ?? '').slice(0, 80)
  const includeClosed = searchParams.get('closed') === 'include'
  const sortParam = searchParams.get('sort') ?? 'default'
  const sort = isCanteenSortId(sortParam) ? sortParam : 'default'
  const deferredNameQuery = useDeferredValue(nameQuery)
  const selectedPriceBands = useMemo(
    () => searchParams.getAll('price').filter(isCanteenPriceBandId),
    [searchParams],
  )
  const priceFilterKey = selectedPriceBands.join(',')

  useEffect(() => {
    if (searchParams.has('region') || searchParams.has('city')) return

    const params = new URLSearchParams(searchParams)
    params.set('region', defaultPopularCity.region)
    params.set('city', defaultPopularCity.city)
    setSearchParams(params, { replace: true })
  }, [defaultPopularCity, searchParams, setSearchParams])

  useEffect(() => {
    if (!selectedRegion) {
      setPlaces([])
      setLoadState('idle')
      return
    }

    const controller = new AbortController()
    setPlaces([])
    setLoadState('loading')

    loadCanteenRegion(selectedRegion.file, controller.signal)
      .then((data) => {
        setPlaces(data)
        setLoadState('success')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoadState('error')
      })

    return () => controller.abort()
  }, [retryKey, selectedRegion])

  useEffect(() => {
    setVisibleCount(pageSize)
    setPickedId(null)
    setPickDialogOpen(false)
  }, [category, city, deferredNameQuery, includeClosed, pageSize, priceFilterKey, region, sort])

  const filteredPlaces = useMemo(
    () => filterCanteenPlaces(places, {
      city,
      category,
      nameQuery: deferredNameQuery,
      priceBands: selectedPriceBands,
      includeClosed,
    }),
    [category, city, deferredNameQuery, includeClosed, places, selectedPriceBands],
  )
  const closedPlacesCount = useMemo(
    () => places.filter((place) => place.status === 'closed').length,
    [places],
  )
  const ratingPlaceIds = useMemo(
    () => places.map((place) => place.id),
    [places],
  )
  const ratingSummariesQuery = useCanteenRatingSummaries(ratingPlaceIds)
  const sortedPlaces = useMemo(
    () => sortCanteenPlaces(filteredPlaces, ratingSummariesQuery.data, sort),
    [filteredPlaces, ratingSummariesQuery.data, sort],
  )
  const visiblePlaces = useMemo(
    () => sortedPlaces.slice(0, visibleCount),
    [sortedPlaces, visibleCount],
  )
  const ownRatingQuery = useOwnCanteenRating(ratingPlace?.id, user?.id)
  const saveRatingMutation = useSaveCanteenRating(ratingPlace?.id)
  const createSubmissionMutation = useCreateCanteenSubmission()
  const pickedPlace = sortedPlaces.find((place) => place.id === pickedId)

  const closeRatingDialog = useCallback(() => setRatingPlace(null), [])
  const closePickDialog = useCallback(() => setPickDialogOpen(false), [])
  const closeSubmissionDialog = useCallback(() => setSubmissionDialogOpen(false), [])

  const submitRating = async (scores: CanteenRatingScores, imageFiles: File[]) => {
    await saveRatingMutation.mutateAsync({ scores, imageFiles })
    setToast(ownRatingQuery.data ? '评分已更新' : '评分已提交')
    closeRatingDialog()
  }

  const submitRestaurant = async (draft: CanteenSubmissionDraft) => {
    await createSubmissionMutation.mutateAsync(draft)
    setToast('餐厅推荐已提交，审核通过后会出现在食堂里')
    closeSubmissionDialog()
  }

  const updateFilters = (
    nextRegion: string,
    nextCity: string,
    nextCategory: string,
    nextPriceBands: CanteenPriceBandId[] = selectedPriceBands,
    nextNameQuery: string = nameQuery,
    nextIncludeClosed: boolean = includeClosed,
    nextSort: CanteenSortId = sort,
  ) => {
    const params = new URLSearchParams()
    if (nextRegion !== allFilterValue) params.set('region', nextRegion)
    if (nextCity !== allFilterValue) params.set('city', nextCity)
    if (nextCategory !== allFilterValue) params.set('category', nextCategory)
    nextPriceBands.forEach((priceBand) => params.append('price', priceBand))
    if (nextNameQuery) params.set('q', nextNameQuery.slice(0, 80))
    if (nextIncludeClosed) params.set('closed', 'include')
    if (nextSort !== 'default') params.set('sort', nextSort)
    setSearchParams(params, { replace: true })
  }

  const resetFilters = () => updateFilters(defaultPopularCity.region, defaultPopularCity.city, allFilterValue, [], '', false, 'default')

  const togglePriceBand = (priceBand: CanteenPriceBandId) => {
    const nextPriceBands = selectedPriceBands.includes(priceBand)
      ? selectedPriceBands.filter((item) => item !== priceBand)
      : [...selectedPriceBands, priceBand]
    updateFilters(region, city, category, nextPriceBands)
  }

  const handlePick = () => {
    const place = pickCanteenPlace(filteredPlaces)
    setPickedId(place?.id ?? null)
    setPickDialogOpen(Boolean(place))
  }

  const resultTitle = selectedRegion
    ? `找到 ${countFormatter.format(filteredPlaces.length)} 个吃饭去处`
    : `已整理 ${countFormatter.format(canteenImportStats.recordCount)} 条巡吃记录`
  const priceSummary = selectedPriceBands.length
    ? canteenPriceBands
        .filter((band) => selectedPriceBands.includes(band.id))
        .map((band) => band.label)
        .join('、')
    : '全部人均'
  const nameSummary = deferredNameQuery.trim() ? `店名“${deferredNameQuery.trim()}”` : '全部店名'
  const statusSummary = includeClosed ? '含已停业记录' : '仅显示可到店记录'
  const sortSummary = canteenSortOptions.find((option) => option.id === sort)?.label ?? '默认顺序'

  return (
    <section className="canteen-page py-8 md:py-10">
      <PageMeta
        title="禾伙人食堂"
        description="按省份、城市、餐厅名称、食物分类和人均价格浏览禾伙人共同整理的餐厅记录，并查看真实到店评分。"
        path="/canteen"
      />
      <div className="field-container">
        <div className="canteen-hero relative overflow-hidden rounded-[18px] border border-paper-light/12 px-5 py-7 text-paper-light shadow-field-md md:px-9 md:py-8">
          <picture className="canteen-hero-media" aria-hidden="true">
            <source media="(max-width: 639px)" srcSet="/images/canteen/canteen-hero-feast-mobile.webp" />
            <img src="/images/canteen/canteen-hero-feast.webp" alt="" decoding="async" fetchPriority="high" />
          </picture>
          <div className="canteen-hero-shade" aria-hidden="true" />
          <div className="canteen-hero-glow" aria-hidden="true" />
          <div className="relative z-10 flex min-h-[240px] flex-col justify-between md:min-h-[260px]">
            <div className="max-w-3xl">
              <span className="canteen-hero-kicker inline-flex items-center gap-2 text-sm font-semibold text-wheat-gold">
                <UtensilsCrossed size={18} aria-hidden="true" />
                禾伙人食堂 · 城市寻味手账
              </span>
              <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-paper-light md:text-5xl">
                到了这座城，今天吃什么？
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-paper-light/84 md:text-lg">
                已整理全国巡吃表中的 {countFormatter.format(canteenImportStats.recordCount)} 条记录。先选省份和城市，再按分类与人均缩小范围；拿不定主意，就抽一张开饭签。
              </p>
            </div>
            <div className="canteen-hero-facts mt-7 flex flex-wrap gap-2.5" aria-label="食堂索引概览">
              <span>
                <BookOpen size={16} aria-hidden="true" />
                <strong>{countFormatter.format(canteenImportStats.recordCount)}</strong> 条寻味记录
              </span>
              <span>
                <MapPinned size={16} aria-hidden="true" />
                <strong>{canteenImportStats.sourceFileCount}</strong> 份地区食单
              </span>
              <span>
                <Sparkles size={16} aria-hidden="true" />
                随机抽一家
              </span>
            </div>
          </div>
        </div>

        <div className="canteen-filter-panel relative z-10 mt-5 rounded-[14px] border border-paper-line bg-paper-light/95 p-4 shadow-field-md md:grid md:grid-cols-2 md:items-end md:gap-4 md:p-5 lg:grid-cols-[15.5rem_14rem_15rem_auto_1fr]">
          <label className="grid gap-1.5 text-sm font-semibold text-field-ink">
            <span className="canteen-filter-label"><MapPinned size={16} aria-hidden="true" />省份 / 地区</span>
            <select
              value={region}
              onChange={(event) => updateFilters(event.target.value, allFilterValue, allFilterValue)}
              className="canteen-select field-input min-h-12"
            >
              <option value={allFilterValue}>请选择省份 / 地区</option>
              {canteenRegions.map((item) => (
                <option key={item.id} value={item.name}>{item.name}（{countFormatter.format(item.count)}）</option>
              ))}
            </select>
          </label>
          <label className="mt-4 grid gap-1.5 text-sm font-semibold text-field-ink md:mt-0">
            <span className="canteen-filter-label"><Map size={16} aria-hidden="true" />城市</span>
            <select
              value={city}
              onChange={(event) => updateFilters(region, event.target.value, category)}
              className="canteen-select field-input min-h-12"
              disabled={!selectedRegion}
            >
              <option value={allFilterValue}>{selectedRegion ? '该地区全部城市' : '请先选择省份 / 地区'}</option>
              {selectedRegion?.cities.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="mt-4 grid gap-1.5 text-sm font-semibold text-field-ink md:mt-0">
            <span className="canteen-filter-label"><Soup size={16} aria-hidden="true" />食物分类</span>
            <select
              value={category}
              onChange={(event) => updateFilters(region, city, event.target.value)}
              className="canteen-select field-input min-h-12"
              disabled={!selectedRegion}
            >
              <option value={allFilterValue}>全部分类</option>
              {selectedRegion?.categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <Button
            variant="ghost"
            className="canteen-reset mt-4 w-full min-h-12 md:mt-0 md:w-auto"
            onClick={resetFilters}
            disabled={!selectedRegion}
          >
            <RotateCcw size={17} aria-hidden="true" />
            清空筛选
          </Button>
          <div className="canteen-filter-doodle" aria-hidden="true">
            <div className="canteen-filter-doodle-copy">
              <span>今日寻味路线</span>
              <strong>选城 · 挑味 · 开饭</strong>
            </div>
            <svg viewBox="0 0 170 72" role="presentation">
              <path className="canteen-doodle-route" d="M8 56 C30 36, 48 64, 70 44 S112 34, 132 48" />
              <circle cx="8" cy="56" r="2.8" />
              <circle cx="132" cy="48" r="2.8" />
              <path className="canteen-doodle-steam" d="M113 12c-6 6 5 9-1 15M126 9c-7 7 5 10-2 17M139 13c-5 5 4 8-1 13" />
              <path className="canteen-doodle-bowl" d="M98 32h55c-2 19-12 29-27 29s-25-10-28-29Z" />
              <path className="canteen-doodle-bowl" d="M104 62h44M149 10l-31 29M157 15l-34 27" />
              <path className="canteen-doodle-spark" d="m79 13 1.5 4.5L85 19l-4.5 1.5L79 25l-1.5-4.5L73 19l4.5-1.5L79 13Z" />
            </svg>
            <span className="canteen-filter-doodle-stamp">10T</span>
          </div>
          <div className="canteen-name-search mt-4 md:col-span-2 lg:col-span-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <label htmlFor="canteen-name-query" className="canteen-filter-label text-sm font-semibold text-field-ink">
                <Search size={17} strokeWidth={2.1} aria-hidden="true" />
                餐厅名称
              </label>
              <span id="canteen-name-query-help" className="text-xs font-normal text-field-soft">
                {selectedRegion ? `在${selectedRegion.name}的餐厅中搜索` : '选择省份 / 地区后即可搜索'}
              </span>
            </div>
            <div className="canteen-name-search-control mt-1.5">
              <Search className="canteen-name-search-icon" size={18} aria-hidden="true" />
              <input
                id="canteen-name-query"
                type="search"
                value={nameQuery}
                maxLength={80}
                autoComplete="off"
                enterKeyHint="search"
                disabled={!selectedRegion}
                aria-describedby="canteen-name-query-help"
                placeholder={selectedRegion ? '输入店名关键词' : '请先选择省份 / 地区'}
                onChange={(event) => updateFilters(region, city, category, selectedPriceBands, event.target.value)}
                className="field-input min-h-12 w-full pl-11 pr-12"
              />
              {nameQuery ? (
                <button
                  type="button"
                  className="canteen-name-search-clear"
                  onClick={() => updateFilters(region, city, category, selectedPriceBands, '')}
                  aria-label="清空餐厅名称搜索"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
          <label className="mt-4 grid gap-1.5 text-sm font-semibold text-field-ink md:col-span-2 lg:col-span-1">
            <span className="canteen-filter-label">
              <ArrowDownWideNarrow size={17} strokeWidth={2.1} aria-hidden="true" />
              评价排序
            </span>
            <select
              value={sort}
              disabled={!selectedRegion}
              aria-describedby="canteen-sort-help"
              onChange={(event) => updateFilters(
                region,
                city,
                category,
                selectedPriceBands,
                nameQuery,
                includeClosed,
                event.target.value as CanteenSortId,
              )}
              className="canteen-select field-input min-h-12"
            >
              {canteenSortOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <span id="canteen-sort-help" className="text-[11px] font-normal leading-4 text-field-soft">
              暂无评分时保持原表顺序
            </span>
          </label>
          <div className="canteen-popular-cities mt-4 border-t border-paper-line pt-4 md:col-span-2 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="canteen-popular-label">
                <Compass size={18} strokeWidth={2.2} aria-hidden="true" />
                旅游热门城市
              </span>
              <span className="text-xs text-field-soft">一键切换地区与城市</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2" aria-label="热门旅游城市">
              {popularCanteenCities.map((item) => {
                const selected = region === item.region && city === item.city
                return (
                  <button
                    key={item.city}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => updateFilters(item.region, item.city, allFilterValue, [])}
                    className="canteen-city-chip"
                  >
                    {item.city}
                  </button>
                )
              })}
            </div>
          </div>
          <fieldset className="mt-4 border-t border-paper-line pt-4 md:col-span-2 lg:col-span-5">
            <legend className="px-1 text-sm font-semibold text-field-ink">
              <span className="canteen-filter-label canteen-price-label"><WalletCards size={20} strokeWidth={2.25} aria-hidden="true" />人均价格（可多选）</span>
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {canteenPriceBands.map((band) => {
                const selected = selectedPriceBands.includes(band.id)
                return (
                  <button
                    key={band.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={!selectedRegion}
                    onClick={() => togglePriceBand(band.id)}
                    className={`canteen-price-chip min-h-11 rounded-[10px] border px-3 text-sm font-semibold transition duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-45 ${
                      selected
                        ? 'border-field-green bg-field-green text-paper-light shadow-field-sm'
                        : 'border-paper-line bg-field-surface text-field-soft hover:border-field-green/40 hover:text-field-green'
                    }`}
                  >
                    {band.label}
                  </button>
                )
              })}
              {closedPlacesCount ? (
                <button
                  type="button"
                  aria-pressed={includeClosed}
                  disabled={!selectedRegion}
                  onClick={() => updateFilters(region, city, category, selectedPriceBands, nameQuery, !includeClosed)}
                  className={`min-h-11 rounded-[10px] border px-3 text-sm font-semibold transition duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-45 ${
                    includeClosed
                      ? 'border-brick/55 bg-brick/10 text-brick'
                      : 'border-paper-line bg-field-surface text-field-soft hover:border-brick/35 hover:text-brick'
                  }`}
                >
                  {includeClosed ? '已包含' : '包含'} {closedPlacesCount} 家已停业 / 搬迁
                </button>
              ) : null}
            </div>
          </fieldset>
        </div>

        <div className="canteen-results-heading mt-8 flex flex-col gap-4 border-b border-paper-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="field-tag">食堂索引</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-field-ink" aria-live="polite">{resultTitle}</h2>
            <p className="mt-1 text-sm text-field-soft">
              {selectedRegion ? `${region} · ${city === allFilterValue ? '全部城市' : city} · ${category === allFilterValue ? '全部分类' : category} · ${priceSummary} · ${nameSummary} · ${statusSummary} · ${sortSummary}` : `${canteenImportStats.sourceFileCount} 个地区文件 · ${canteenImportStats.cityCount} 个城市或县级地点`}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="canteen-submit-entry w-full shrink-0 sm:w-auto"
            onClick={() => setSubmissionDialogOpen(true)}
            aria-haspopup="dialog"
          >
            <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
            推荐一家餐厅
          </Button>
        </div>

        {!selectedRegion ? (
          <div className="mt-6">
            <StateBlock type="empty" title="先选一个省份或地区" description={`全量数据已就位，共 ${countFormatter.format(canteenImportStats.recordCount)} 条。选择地区后再按城市和食物分类缩小范围。`} />
          </div>
        ) : loadState === 'loading' ? (
          <div className="mt-6"><StateBlock type="loading" title="正在翻开地区食谱" description={`正在读取${selectedRegion.name}的 ${countFormatter.format(selectedRegion.count)} 条记录。`} /></div>
        ) : loadState === 'error' ? (
          <div className="mt-6"><StateBlock type="error" title="这个地区的数据没有加载成功" description="请检查本地开发服务后重试。" action={<Button variant="secondary" onClick={() => setRetryKey((value) => value + 1)}>重新加载</Button>} /></div>
        ) : filteredPlaces.length ? (
          <>
            {ratingSummariesQuery.isError ? (
              <p className="mt-5 rounded-[10px] border border-brick/25 bg-brick/8 px-3 py-2 text-sm text-brick" role="status">
                评分服务暂不可用，餐厅浏览和筛选不受影响。
              </p>
            ) : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {visiblePlaces.map((place) => (
                <CanteenCard
                  key={place.id}
                  place={place}
                  picked={place.id === pickedId}
                  ratingSummary={ratingSummariesQuery.data?.[place.id]}
                  onRate={() => setRatingPlace(place)}
                />
              ))}
            </div>
            {visibleCount < filteredPlaces.length ? (
              <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-sm text-field-soft">已显示 {countFormatter.format(visiblePlaces.length)} / {countFormatter.format(filteredPlaces.length)} 条</p>
                <Button variant="secondary" onClick={() => setVisibleCount((value) => value + pageSize)}>再看 {Math.min(pageSize, filteredPlaces.length - visibleCount)} 家</Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-6">
            <StateBlock type="empty" title="没有找到符合条件的餐厅" description="可以换一个店名关键词、城市、食物分类或人均区间，也可以查看该地区的全部记录。" action={<Button variant="secondary" onClick={() => updateFilters(region, allFilterValue, allFilterValue, [], '')}>查看该地区全部记录</Button>} />
          </div>
        )}

        <aside className="mt-8 rounded-[14px] border border-paper-line bg-field-muted/45 p-4 text-sm leading-6 text-field-soft md:flex md:items-center md:justify-between md:gap-5">
          <p>
            当前数据来自 {canteenImportStats.sourceFileCount} 个授权 CSV，整理日期 {canteenSnapshotDate}；已去除 {countFormatter.format(canteenImportStats.duplicateCount)} 条重复记录，剔除 {countFormatter.format(canteenImportStats.excludedRowCount)} 行无效内容，隐藏 {countFormatter.format(canteenImportStats.privacyRedactionCount)} 条自由文本联系方式，并默认收起 {countFormatter.format(canteenImportStats.closedRecordCount)} 条明确停业或搬迁记录。营业时间、价格和门店状态仍可能变化，出发前请再次核验。
          </p>
          <a href={canteenSourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 shrink-0 items-center gap-1.5 font-semibold text-field-green underline decoration-field-green/30 underline-offset-4 hover:decoration-field-green md:mt-0">
            查看完整巡吃表
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </aside>
      </div>
      <button
        type="button"
        onClick={handlePick}
        disabled={loadState !== 'success' || !filteredPlaces.length}
        className="canteen-random-fab"
        aria-haspopup="dialog"
        aria-label="从当前筛选结果中随机选择一家餐厅"
      >
        <span className="canteen-random-fab-icon" aria-hidden="true"><Dices size={23} /></span>
        <span className="canteen-random-fab-copy">
          <strong>替我<br className="hidden md:block" />选一家</strong>
          <small>随机开饭签</small>
        </span>
      </button>
      <CanteenPickDialog
        open={pickDialogOpen}
        place={pickedPlace}
        onClose={closePickDialog}
        onPickAgain={handlePick}
      />
      {ratingPlace ? (
        <CanteenRatingDialog
          place={ratingPlace}
          summary={ratingSummariesQuery.data?.[ratingPlace.id]}
          ownRating={ownRatingQuery.data}
          ownRatingLoading={ownRatingQuery.isLoading}
          ownRatingError={ownRatingQuery.error}
          isConfigured={canteenRatingService.isConfigured}
          userId={user?.id}
          returnTo={`${location.pathname}${location.search}`}
          isSaving={saveRatingMutation.isPending}
          onClose={closeRatingDialog}
          onSubmit={submitRating}
        />
      ) : null}
      {submissionDialogOpen ? (
        <CanteenRestaurantSubmissionDialog
          regions={canteenRegions}
          initialRegion={region === allFilterValue ? undefined : region}
          initialCity={city === allFilterValue ? undefined : city}
          isConfigured={canteenSubmissionService.isConfigured}
          userId={user?.id}
          returnTo={`${location.pathname}${location.search}`}
          isSaving={createSubmissionMutation.isPending}
          onClose={closeSubmissionDialog}
          onSubmit={submitRestaurant}
        />
      ) : null}
    </section>
  )
}

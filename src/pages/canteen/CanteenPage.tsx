import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Dices, MapPin, RotateCcw, UtensilsCrossed, WalletCards } from 'lucide-react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../../app/store/useAppStore'
import { CanteenRatingDialog, RatingStars } from '../../components/canteen/CanteenRatingDialog'
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
  filterCanteenPlaces,
  isCanteenPriceBandId,
  pickCanteenPlace,
  type CanteenPriceBandId,
} from '../../features/canteen/canteenFilters'
import { loadCanteenRegion } from '../../services/canteenDataService'
import { canteenRatingService } from '../../services/canteenRatingService'
import {
  useCanteenRatingSummaries,
  useOwnCanteenRating,
  useSaveCanteenRating,
} from '../../hooks/useCanteenRatings'
import type { CanteenPlace, CanteenRatingScores, CanteenRatingSummary } from '../../types/domain'

const pageSize = 24
const countFormatter = new Intl.NumberFormat('zh-CN')

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
  return (
    <article
      id={`canteen-place-${place.id}`}
      className={`relative flex h-full min-w-0 flex-col rounded-[12px] border bg-field-surface/92 p-3 shadow-field-sm transition duration-300 ease-field motion-reduce:transition-none ${
        picked
          ? 'border-wheat-gold ring-2 ring-wheat-gold/35'
          : 'border-paper-line hover:-translate-y-0.5 hover:border-field-green/30 hover:shadow-field-md motion-reduce:hover:translate-y-0'
      }`}
    >
      {picked ? (
        <span className="absolute right-2.5 top-2.5 rotate-[-7deg] rounded-[6px] border-2 border-wheat-gold bg-paper-light px-2 py-0.5 font-serif text-[11px] font-bold text-soil-brown">
          开饭签
        </span>
      ) : null}
      <div className={`flex flex-wrap items-center gap-1.5 ${picked ? 'pr-14' : ''}`}>
        <span className="field-tag max-w-full truncate px-1.5 py-0.5 text-[11px]" title={`${place.city} · ${place.district}`}>
          {place.city} · {place.district}
        </span>
        <span className="max-w-full truncate rounded-[6px] border border-wheat-gold/35 bg-wheat-gold/10 px-1.5 py-0.5 text-[11px] font-semibold text-soil-brown" title={place.category}>
          {place.category}
        </span>
      </div>
      <h2 className="mt-3 line-clamp-2 font-serif text-lg font-semibold leading-snug text-field-ink" title={place.name}>{place.name}</h2>
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
        className="mt-auto flex min-h-11 w-full items-center justify-between gap-2 rounded-[9px] border border-wheat-gold/30 bg-wheat-gold/8 px-2.5 py-2 text-left text-xs font-semibold text-field-ink transition duration-200 hover:border-wheat-gold/55 hover:bg-wheat-gold/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-green motion-reduce:transition-none"
        aria-label={ratingSummary ? `查看或更新${place.name}的评分，当前综合 ${ratingSummary.overall.toFixed(1)} 星` : `为${place.name}评分`}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <RatingStars value={ratingSummary?.overall ?? 0} />
          <span className="tabular-nums">{ratingSummary ? ratingSummary.overall.toFixed(1) : '暂无'}</span>
        </span>
        <span className="shrink-0 text-field-green">{ratingSummary ? `${ratingSummary.ratingCount} 人` : '去评分'}</span>
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
  const [places, setPlaces] = useState<CanteenPlace[]>([])
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [retryKey, setRetryKey] = useState(0)
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [ratingPlace, setRatingPlace] = useState<CanteenPlace | null>(null)

  const regionParam = searchParams.get('region') ?? allFilterValue
  const selectedRegion = canteenRegions.find((region) => region.name === regionParam)
  const region = selectedRegion?.name ?? allFilterValue
  const cityParam = searchParams.get('city') ?? allFilterValue
  const city = selectedRegion?.cities.includes(cityParam) ? cityParam : allFilterValue
  const categoryParam = searchParams.get('category') ?? allFilterValue
  const category = selectedRegion?.categories.includes(categoryParam) ? categoryParam : allFilterValue
  const selectedPriceBands = useMemo(
    () => searchParams.getAll('price').filter(isCanteenPriceBandId),
    [searchParams],
  )
  const priceFilterKey = selectedPriceBands.join(',')

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
  }, [category, city, priceFilterKey, region])

  const filteredPlaces = useMemo(
    () => filterCanteenPlaces(places, { city, category, priceBands: selectedPriceBands }),
    [category, city, places, selectedPriceBands],
  )
  const visiblePlaces = useMemo(
    () => filteredPlaces.slice(0, visibleCount),
    [filteredPlaces, visibleCount],
  )
  const visiblePlaceIds = useMemo(
    () => visiblePlaces.map((place) => place.id),
    [visiblePlaces],
  )
  const ratingSummariesQuery = useCanteenRatingSummaries(visiblePlaceIds)
  const ownRatingQuery = useOwnCanteenRating(ratingPlace?.id, user?.id)
  const saveRatingMutation = useSaveCanteenRating(ratingPlace?.id, visiblePlaceIds)
  const pickedPlace = filteredPlaces.find((place) => place.id === pickedId)

  const closeRatingDialog = useCallback(() => setRatingPlace(null), [])

  const submitRating = async (scores: CanteenRatingScores) => {
    await saveRatingMutation.mutateAsync(scores)
    setToast(ownRatingQuery.data ? '评分已更新' : '评分已提交')
    closeRatingDialog()
  }

  const updateFilters = (
    nextRegion: string,
    nextCity: string,
    nextCategory: string,
    nextPriceBands: CanteenPriceBandId[] = selectedPriceBands,
  ) => {
    const params = new URLSearchParams()
    if (nextRegion !== allFilterValue) params.set('region', nextRegion)
    if (nextCity !== allFilterValue) params.set('city', nextCity)
    if (nextCategory !== allFilterValue) params.set('category', nextCategory)
    nextPriceBands.forEach((priceBand) => params.append('price', priceBand))
    setSearchParams(params, { replace: true })
  }

  const resetFilters = () => updateFilters(allFilterValue, allFilterValue, allFilterValue, [])

  const togglePriceBand = (priceBand: CanteenPriceBandId) => {
    const nextPriceBands = selectedPriceBands.includes(priceBand)
      ? selectedPriceBands.filter((item) => item !== priceBand)
      : [...selectedPriceBands, priceBand]
    updateFilters(region, city, category, nextPriceBands)
  }

  const handlePick = () => {
    const place = pickCanteenPlace(filteredPlaces)
    setPickedId(place?.id ?? null)
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

  return (
    <section className="py-10 md:py-14">
      <PageMeta
        title="禾伙人食堂"
        description="按省份、城市、食物分类和人均价格浏览禾伙人共同整理的餐厅记录，并查看真实到店评分。"
        path="/canteen"
      />
      <div className="field-container">
        <div className="relative overflow-hidden rounded-[20px] border border-field-green/18 bg-field-green px-5 py-8 text-paper-light shadow-field-md md:px-9 md:py-10">
          <div className="pointer-events-none absolute -right-10 -top-14 size-56 rounded-full border border-paper-light/12" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 right-20 size-44 rounded-full border border-wheat-gold/25" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-wheat-gold">
              <UtensilsCrossed size={18} aria-hidden="true" />
              禾伙人食堂
            </span>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-paper-light md:text-5xl">
              到了这座城，今天吃什么？
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-paper-light/82 md:text-lg">
              已整理全国巡吃表中的 {countFormatter.format(canteenImportStats.recordCount)} 条记录。先选省份和城市，再按分类与人均缩小范围；拿不定主意，就抽一张开饭签。
            </p>
          </div>
        </div>

        <div className="relative z-10 -mt-4 mx-2 rounded-[16px] border border-paper-line bg-paper-light/95 p-4 shadow-field-md md:mx-6 md:grid md:grid-cols-2 md:items-end md:gap-4 md:p-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="grid gap-1.5 text-sm font-semibold text-field-ink">
            省份 / 地区
            <select
              value={region}
              onChange={(event) => updateFilters(event.target.value, allFilterValue, allFilterValue)}
              className="field-input min-h-12"
            >
              <option value={allFilterValue}>请选择省份 / 地区</option>
              {canteenRegions.map((item) => (
                <option key={item.id} value={item.name}>{item.name}（{countFormatter.format(item.count)}）</option>
              ))}
            </select>
          </label>
          <label className="mt-4 grid gap-1.5 text-sm font-semibold text-field-ink md:mt-0">
            城市
            <select
              value={city}
              onChange={(event) => updateFilters(region, event.target.value, category)}
              className="field-input min-h-12"
              disabled={!selectedRegion}
            >
              <option value={allFilterValue}>{selectedRegion ? '该地区全部城市' : '请先选择省份 / 地区'}</option>
              {selectedRegion?.cities.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="mt-4 grid gap-1.5 text-sm font-semibold text-field-ink md:mt-0">
            食物分类
            <select
              value={category}
              onChange={(event) => updateFilters(region, city, event.target.value)}
              className="field-input min-h-12"
              disabled={!selectedRegion}
            >
              <option value={allFilterValue}>全部分类</option>
              {selectedRegion?.categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <Button
            variant="ghost"
            className="mt-4 w-full min-h-12 md:mt-0 md:w-auto"
            onClick={resetFilters}
            disabled={!selectedRegion}
          >
            <RotateCcw size={17} aria-hidden="true" />
            清空筛选
          </Button>
          <fieldset className="mt-4 border-t border-paper-line pt-4 md:col-span-2 lg:col-span-4">
            <legend className="px-1 text-sm font-semibold text-field-ink">人均价格（可多选）</legend>
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
                    className={`min-h-11 rounded-[10px] border px-3 text-sm font-semibold transition duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-45 ${
                      selected
                        ? 'border-field-green bg-field-green text-paper-light shadow-field-sm'
                        : 'border-paper-line bg-field-surface text-field-soft hover:border-field-green/40 hover:text-field-green'
                    }`}
                  >
                    {band.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-b border-paper-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="field-tag">食堂索引</p>
            <p className="mt-3 font-serif text-2xl font-semibold text-field-ink" aria-live="polite">{resultTitle}</p>
            <p className="mt-1 text-sm text-field-soft">
              {selectedRegion ? `${region} · ${city === allFilterValue ? '全部城市' : city} · ${category === allFilterValue ? '全部分类' : category} · ${priceSummary}` : `${canteenImportStats.sourceFileCount} 个地区文件 · ${canteenImportStats.cityCount} 个城市或县级地点`}
            </p>
          </div>
          <Button onClick={handlePick} disabled={loadState !== 'success' || !filteredPlaces.length} className="w-full sm:w-auto">
            <Dices size={18} aria-hidden="true" />
            替我选一家
          </Button>
        </div>

        <div aria-live="polite">
          {pickedPlace ? (
            <div className="mt-5 rounded-[12px] border border-wheat-gold/45 bg-wheat-gold/10 px-4 py-4 text-sm text-field-ink">
              <p><span className="font-semibold text-soil-brown">开饭签选中了：</span>{pickedPlace.city} · {pickedPlace.name}</p>
              <p className="mt-1 text-field-soft">{pickedPlace.category} · {pickedPlace.address}</p>
              <a href={pickedPlace.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold text-field-green underline decoration-field-green/30 underline-offset-4 hover:decoration-field-green">
                核对原表
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          ) : null}
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
            <StateBlock type="empty" title="这个组合还没有记录" description="可以换一个城市、食物分类或人均区间，也可以清空筛选查看该地区的全部记录。" action={<Button variant="secondary" onClick={() => updateFilters(region, allFilterValue, allFilterValue, [])}>查看该地区全部记录</Button>} />
          </div>
        )}

        <aside className="mt-8 rounded-[14px] border border-paper-line bg-field-muted/45 p-4 text-sm leading-6 text-field-soft md:flex md:items-center md:justify-between md:gap-5">
          <p>
            当前数据来自 {canteenImportStats.sourceFileCount} 个授权 CSV，整理日期 {canteenSnapshotDate}；已去除 {countFormatter.format(canteenImportStats.duplicateCount)} 条重复记录，并剔除 {countFormatter.format(canteenImportStats.excludedRowCount)} 行表头、空行、无明确店名或无食物信息的内容。营业时间、价格和门店状态可能变化，出发前请再次核验。
          </p>
          <a href={canteenSourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 shrink-0 items-center gap-1.5 font-semibold text-field-green underline decoration-field-green/30 underline-offset-4 hover:decoration-field-green md:mt-0">
            查看完整巡吃表
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </aside>
      </div>
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
    </section>
  )
}

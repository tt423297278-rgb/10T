import { useEffect, useId, useRef, useState } from 'react'
import { AlertCircle, Check, LoaderCircle, MapPinned, Search } from 'lucide-react'
import { Button } from '../common/Button'
import {
  amapConfig,
  createAmapSelectionMap,
  searchAmapPlaces,
  toAmapMessage,
  type AmapMapController,
  type AmapPoiSelection,
} from '../../services/amapService'

interface CanteenAmapPickerProps {
  restaurantName: string
  city: string
  selection?: AmapPoiSelection
  onSelect: (poi: AmapPoiSelection) => void
}

export function CanteenAmapPicker({
  restaurantName,
  city,
  selection,
  onSelect,
}: CanteenAmapPickerProps) {
  const searchId = useId()
  const mapRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<AmapMapController | null>(null)
  const selectionRef = useRef(selection)
  selectionRef.current = selection
  const [query, setQuery] = useState(restaurantName)
  const [mapState, setMapState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    amapConfig.isConfigured ? 'loading' : 'idle',
  )
  const [results, setResults] = useState<AmapPoiSelection[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!amapConfig.isConfigured || !mapRef.current) return
    let active = true
    let controller: AmapMapController | null = null
    setMapState('loading')

    createAmapSelectionMap(mapRef.current)
      .then((nextController) => {
        controller = nextController
        if (!active) {
          nextController.destroy()
          return
        }
        controllerRef.current = nextController
        if (selectionRef.current) nextController.focus(selectionRef.current)
        setMapState('ready')
      })
      .catch((error: unknown) => {
        if (!active) return
        setMapState('error')
        setMessage(toAmapMessage(error))
      })

    return () => {
      active = false
      controllerRef.current = null
      controller?.destroy()
    }
  }, [])

  useEffect(() => {
    if (selection && controllerRef.current) controllerRef.current.focus(selection)
  }, [selection])

  const handleSearch = async () => {
    const keyword = query.trim()
    if (keyword.length < 2) {
      setMessage('请输入至少 2 个字的店名或地点关键词。')
      return
    }

    setIsSearching(true)
    setMessage(null)
    try {
      const nextResults = await searchAmapPlaces(keyword, city)
      setResults(nextResults)
      setMessage(nextResults.length ? null : '没有找到匹配地点，可以换个店名或去掉分店名称再试。')
    } catch (error) {
      setResults([])
      setMessage(toAmapMessage(error))
    } finally {
      setIsSearching(false)
    }
  }

  const choosePoi = (poi: AmapPoiSelection) => {
    onSelect(poi)
    controllerRef.current?.focus(poi)
    setMessage(`已选取“${poi.name}”，地址已自动带回表单。`)
  }

  if (!amapConfig.isConfigured) {
    return (
      <div className="canteen-amap-unavailable" role="status">
        <AlertCircle size={19} strokeWidth={1.8} aria-hidden="true" />
        <div>
          <strong>高德地图尚未配置</strong>
          <p>配置 Web 端 Key 和安全设置后即可搜索门店；现在可以手填地址，也可以留空。</p>
        </div>
      </div>
    )
  }

  return (
    <section className="canteen-amap-picker" aria-labelledby={`${searchId}-title`}>
      <div className="canteen-amap-picker-heading">
        <div>
          <h4 id={`${searchId}-title`}><MapPinned size={18} aria-hidden="true" />从高德地图选店</h4>
          <p>先搜索店名，再从结果中选择正确门店。</p>
        </div>
        <span>高德地图</span>
      </div>

      <div className="canteen-amap-search-row mt-3">
        <label htmlFor={searchId} className="sr-only">高德地图门店搜索</label>
        <div className="canteen-amap-search-control">
          <Search size={17} aria-hidden="true" />
          <input
            id={searchId}
            value={query}
            maxLength={80}
            autoComplete="off"
            placeholder={city ? `在${city}搜索店名或地点` : '搜索店名或地点'}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              void handleSearch()
            }}
          />
        </div>
        <Button type="button" variant="secondary" onClick={() => void handleSearch()} isLoading={isSearching}>
          搜索门店
        </Button>
      </div>

      <div className="canteen-amap-layout mt-3">
        <div className="canteen-amap-map-shell">
          <div ref={mapRef} className="canteen-amap-map" role="img" aria-label="高德地图地点预览" />
          {mapState === 'loading' ? (
            <div className="canteen-amap-map-state" role="status">
              <LoaderCircle className="animate-spin" size={22} aria-hidden="true" />
              正在加载地图…
            </div>
          ) : mapState === 'error' ? (
            <div className="canteen-amap-map-state is-error" role="alert">地图没有加载成功</div>
          ) : null}
        </div>

        <div className="canteen-amap-results" aria-label="高德地图搜索结果">
          {results.length ? results.map((poi) => {
            const selected = Boolean(
              selection
              && selection.longitude === poi.longitude
              && selection.latitude === poi.latitude,
            )
            return (
              <button
                key={`${poi.id}-${poi.longitude}-${poi.latitude}`}
                type="button"
                aria-pressed={selected}
                onClick={() => choosePoi(poi)}
                className="canteen-amap-result"
              >
                <span className="min-w-0">
                  <strong>{poi.name}</strong>
                  <small>{poi.address || `${poi.city}${poi.district}` || '地址信息待补充'}</small>
                </span>
                <span className="canteen-amap-result-action">
                  {selected ? <><Check size={15} aria-hidden="true" />已选择</> : '选择'}
                </span>
              </button>
            )
          }) : (
            <div className="canteen-amap-empty">
              <Search size={21} strokeWidth={1.7} aria-hidden="true" />
              <p>输入店名开始搜索，结果会显示在这里。</p>
            </div>
          )}
        </div>
      </div>

      {message ? <p className="canteen-amap-message" role="status">{message}</p> : null}
      <p className="canteen-amap-credit">地点搜索与地图数据由高德地图提供。</p>
    </section>
  )
}

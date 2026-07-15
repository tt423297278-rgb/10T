const amapKey = String(import.meta.env.VITE_AMAP_KEY ?? '').trim()
const amapSecurityJsCode = String(import.meta.env.VITE_AMAP_SECURITY_JS_CODE ?? '').trim()
const amapServiceHost = String(import.meta.env.VITE_AMAP_SERVICE_HOST ?? '').trim()
const amapLoaderUrl = 'https://webapi.amap.com/loader.js'

interface AmapRawLocation {
  lng?: number
  lat?: number
  getLng?: () => number
  getLat?: () => number
}

interface AmapRawPoi {
  id?: string
  name?: string
  address?: string | string[]
  pname?: string | string[]
  cityname?: string | string[]
  adname?: string | string[]
  location?: AmapRawLocation
}

interface AmapSearchResult {
  info?: string
  poiList?: { pois?: AmapRawPoi[] }
}

interface AmapMapInstance {
  add: (overlay: unknown) => void
  remove: (overlay: unknown) => void
  setCenter: (position: [number, number]) => void
  setZoom: (zoom: number) => void
  destroy: () => void
}

interface AmapNamespace {
  Map: new (container: HTMLElement, options: Record<string, unknown>) => AmapMapInstance
  Marker: new (options: Record<string, unknown>) => unknown
  PlaceSearch: new (options: Record<string, unknown>) => {
    search: (
      keyword: string,
      callback: (status: string, result: AmapSearchResult | string) => void,
    ) => void
  }
}

interface AmapLoader {
  load: (options: {
    key: string
    version: '2.0'
    plugins: string[]
  }) => Promise<AmapNamespace>
}

declare global {
  interface Window {
    AMapLoader?: AmapLoader
    _AMapSecurityConfig?: {
      securityJsCode?: string
      serviceHost?: string
    }
  }
}

export interface AmapPoiSelection {
  id: string
  name: string
  address: string
  region: string
  city: string
  district: string
  longitude: number
  latitude: number
}

export interface AmapMapController {
  focus: (poi: AmapPoiSelection) => void
  destroy: () => void
}

let amapPromise: Promise<AmapNamespace> | null = null

function textValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export function formatAmapPoiAddress(parts: {
  region?: string
  city?: string
  district?: string
  address?: string
}) {
  const values = [parts.region, parts.city, parts.district, parts.address]
    .map((value) => value?.trim() ?? '')
    .filter(Boolean)
  return values.filter((value, index) => index === 0 || value !== values[index - 1]).join('')
}

function normalizeAmapPoi(poi: AmapRawPoi): AmapPoiSelection | null {
  const longitude = poi.location?.getLng?.() ?? poi.location?.lng
  const latitude = poi.location?.getLat?.() ?? poi.location?.lat
  const name = textValue(poi.name).trim()
  if (!name || !Number.isFinite(longitude) || !Number.isFinite(latitude)) return null

  const region = textValue(poi.pname).trim()
  const city = textValue(poi.cityname).trim()
  const district = textValue(poi.adname).trim()
  const streetAddress = textValue(poi.address).trim()
  return {
    id: textValue(poi.id).trim(),
    name,
    region,
    city,
    district,
    address: formatAmapPoiAddress({ region, city, district, address: streetAddress }),
    longitude: Number(longitude),
    latitude: Number(latitude),
  }
}

function loadAmapLoader() {
  if (window.AMapLoader) return Promise.resolve(window.AMapLoader)

  return new Promise<AmapLoader>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-amap-loader="true"]')
    const script = existing ?? document.createElement('script')
    const handleLoad = () => {
      if (window.AMapLoader) resolve(window.AMapLoader)
      else reject(new Error('AMap loader unavailable'))
    }
    const handleError = () => reject(new Error('AMap loader failed'))

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })
    if (!existing) {
      script.src = amapLoaderUrl
      script.async = true
      script.dataset.amapLoader = 'true'
      document.head.append(script)
    }
  })
}

async function loadAmap() {
  if (!amapConfig.isConfigured) throw new Error('AMap is not configured')
  if (!amapPromise) {
    window._AMapSecurityConfig = amapServiceHost
      ? { serviceHost: amapServiceHost }
      : { securityJsCode: amapSecurityJsCode }
    amapPromise = loadAmapLoader()
      .then((loader) => loader.load({
        key: amapKey,
        version: '2.0',
        plugins: ['AMap.PlaceSearch'],
      }))
      .catch((error: unknown) => {
        amapPromise = null
        throw error
      })
  }
  return amapPromise
}

export const amapConfig = {
  isConfigured: Boolean(amapKey && (amapSecurityJsCode || amapServiceHost)),
  usesServiceProxy: Boolean(amapServiceHost),
}

export async function searchAmapPlaces(keyword: string, city: string) {
  const query = keyword.trim()
  if (!query) return []
  const AMap = await loadAmap()

  return new Promise<AmapPoiSelection[]>((resolve, reject) => {
    const placeSearch = new AMap.PlaceSearch({
      city: city.trim() || '全国',
      citylimit: Boolean(city.trim()),
      pageSize: 8,
      pageIndex: 1,
      extensions: 'all',
    })
    placeSearch.search(query, (status, result) => {
      if (status === 'no_data') {
        resolve([])
        return
      }
      if (status !== 'complete' || typeof result === 'string') {
        reject(new Error(typeof result === 'string' ? result : result.info ?? 'AMap search failed'))
        return
      }
      resolve((result.poiList?.pois ?? []).map(normalizeAmapPoi).filter((poi): poi is AmapPoiSelection => Boolean(poi)))
    })
  })
}

export async function createAmapSelectionMap(container: HTMLElement): Promise<AmapMapController> {
  const AMap = await loadAmap()
  const map = new AMap.Map(container, {
    viewMode: '2D',
    zoom: 11,
    resizeEnable: true,
  })
  let marker: unknown | null = null

  return {
    focus(poi) {
      if (marker) map.remove(marker)
      marker = new AMap.Marker({
        position: [poi.longitude, poi.latitude],
        title: poi.name,
        anchor: 'bottom-center',
      })
      map.add(marker)
      map.setCenter([poi.longitude, poi.latitude])
      map.setZoom(16)
    },
    destroy() {
      map.destroy()
    },
  }
}

export function toAmapMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
  if (message.includes('not configured')) return '尚未配置高德地图 Key，当前可以手填地址或留空。'
  if (message.includes('loader')) return '高德地图加载失败，请检查网络和 Key 配置后重试。'
  return '没有完成地点搜索，请稍后重试或直接留空。'
}

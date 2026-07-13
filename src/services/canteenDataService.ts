import type { CanteenPlace } from '../types/domain'

export async function loadCanteenRegion(file: string, signal?: AbortSignal) {
  const response = await fetch(file, { signal })
  if (!response.ok) {
    throw new Error(`食堂数据加载失败：${response.status}`)
  }

  const data: unknown = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('食堂数据格式无效')
  }

  return data as CanteenPlace[]
}

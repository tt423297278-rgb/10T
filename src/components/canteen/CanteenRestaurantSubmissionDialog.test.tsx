// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CanteenRestaurantSubmissionDialog } from './CanteenRestaurantSubmissionDialog'
import type { CanteenRegionManifest } from '../../types/domain'

const regions: CanteenRegionManifest[] = [
  {
    id: 'cq',
    name: '重庆',
    file: '/cq.json',
    count: 12,
    cities: ['重庆'],
    categories: ['火锅 / 串串', '地方菜'],
  },
]

afterEach(cleanup)

describe('CanteenRestaurantSubmissionDialog', () => {
  it('prefills the current city, keeps address optional, and still requires four scores and a visit confirmation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <MemoryRouter>
        <CanteenRestaurantSubmissionDialog
          regions={regions}
          initialRegion="重庆"
          initialCity="重庆"
          isConfigured
          userId="user-1"
          returnTo="/canteen?region=重庆&city=重庆"
          isSaving={false}
          onClose={() => undefined}
          onSubmit={onSubmit}
        />
      </MemoryRouter>,
    )

    expect((screen.getByLabelText(/省份 \/ 地区/) as HTMLSelectElement).value).toBe('重庆')
    expect((screen.getByLabelText(/城市/) as HTMLInputElement).value).toBe('重庆')

    fireEvent.click(screen.getByRole('button', { name: '提交审核' }))
    expect(await screen.findByText('请填写餐厅名称。')).toBeTruthy()
    expect(screen.getByText(/请完成口味、服务、性价比和环境四项评分/)).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText(/餐厅名称/), { target: { value: '  凡人老火锅  ' } })
    fireEvent.change(screen.getByLabelText(/食物分类/), { target: { value: '火锅 / 串串' } })
    fireEvent.change(screen.getByLabelText('口味评分，0.5 星递增'), { target: { value: '4.5' } })
    fireEvent.change(screen.getByLabelText('服务评分，0.5 星递增'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('性价比评分，0.5 星递增'), { target: { value: '4.5' } })
    fireEvent.change(screen.getByLabelText('环境评分，0.5 星递增'), { target: { value: '3.5' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: '提交审核' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: '凡人老火锅',
        region: '重庆',
        city: '重庆',
        address: '',
        longitude: null,
        latitude: null,
        amapPoiId: '',
        category: '火锅 / 串串',
        scores: { taste: 4.5, service: 4, value: 4.5, environment: 3.5 },
        visitedConfirmed: true,
      }))
    })
  })

  it('keeps the full form visible in local preview without a fake submit action', () => {
    const onSubmit = vi.fn()
    render(
      <MemoryRouter>
        <CanteenRestaurantSubmissionDialog
          regions={regions}
          isConfigured={false}
          returnTo="/canteen"
          isSaving={false}
          onClose={() => undefined}
          onSubmit={onSubmit}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText(/本地预览/)).toBeTruthy()
    expect(screen.getByLabelText(/餐厅名称/)).toBeTruthy()
    expect(screen.getByLabelText(/详细地址/).parentElement?.textContent).toContain('选填')
    expect(screen.getAllByRole('slider')).toHaveLength(4)
    fireEvent.click(screen.getByRole('button', { name: '从高德地图选取' }))
    expect(screen.getByText('高德地图尚未配置')).toBeTruthy()
    const submitButton = screen.getByRole('button', { name: '预览模式，无法提交' }) as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

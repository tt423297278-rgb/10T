// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CanteenRatingDialog } from './CanteenRatingDialog'
import type { CanteenPlace } from '../../types/domain'

const place: CanteenPlace = {
  id: 'place-1',
  region: '重庆',
  city: '重庆',
  district: '渝中区',
  category: '火锅 / 串串',
  name: '测试火锅店',
  address: '测试地址',
  sourceSheet: '重庆篇',
  sourceUrl: 'https://example.com',
  sourceRow: 3,
}

afterEach(cleanup)

describe('CanteenRatingDialog', () => {
  it('submits four half-star scores after visit confirmation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:meal-photo'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    })
    render(
      <MemoryRouter>
        <CanteenRatingDialog
          place={place}
          ownRating={null}
          ownRatingLoading={false}
          isConfigured
          userId="user-1"
          returnTo="/canteen?region=重庆"
          isSaving={false}
          onClose={() => undefined}
          onSubmit={onSubmit}
        />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('口味评分，0.5 星递增'), { target: { value: '4.5' } })
    fireEvent.change(screen.getByLabelText('服务评分，0.5 星递增'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('性价比评分，0.5 星递增'), { target: { value: '3.5' } })
    fireEvent.change(screen.getByLabelText('环境评分，0.5 星递增'), { target: { value: '5' } })
    expect(screen.getByText('本次综合评分')).toBeTruthy()
    expect(screen.getByText('4.3')).toBeTruthy()
    expect(screen.getByLabelText('本次综合评分 4.3 星')).toBeTruthy()
    const imageFile = new File(['meal'], 'meal.webp', { type: 'image/webp' })
    fireEvent.change(screen.getByLabelText(/添加图片/), { target: { files: [imageFile] } })
    expect(screen.getByAltText('已选择的评价图片：meal.webp')).toBeTruthy()
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: '发布到店评价' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { taste: 4.5, service: 4, value: 3.5, environment: 5 },
        [imageFile],
      )
    })
  })

  it('shows an interactive preview without exposing a fake submit action when Supabase is unavailable', () => {
    const onSubmit = vi.fn()
    render(
      <MemoryRouter>
        <CanteenRatingDialog
          place={place}
          ownRatingLoading={false}
          isConfigured={false}
          returnTo="/canteen"
          isSaving={false}
          onClose={() => undefined}
          onSubmit={onSubmit}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText(/本地预览/)).toBeTruthy()
    expect(screen.getAllByRole('slider')).toHaveLength(4)
    expect(screen.getByLabelText(/添加图片/)).toBeTruthy()
    expect(screen.getByText('已完成 0/4')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('口味评分，0.5 星递增'), { target: { value: '4.5' } })
    expect(screen.getByText('4.5 星')).toBeTruthy()
    expect(screen.getByText('已完成 1/4')).toBeTruthy()

    const visitedConfirmation = screen.getByRole('checkbox')
    fireEvent.click(visitedConfirmation)
    expect((visitedConfirmation as HTMLInputElement).checked).toBe(true)

    const submitButton = screen.getByRole('button', { name: '预览模式，无法提交' }) as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    fireEvent.click(submitButton)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

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
    fireEvent.click(screen.getByLabelText('我确认自己已经实际到店消费，并按真实体验评分。'))
    fireEvent.click(screen.getByRole('button', { name: '提交评分' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ taste: 4.5, service: 4, value: 3.5, environment: 5 })
    })
  })

  it('does not expose a fake submit action when Supabase is unavailable', () => {
    render(
      <MemoryRouter>
        <CanteenRatingDialog
          place={place}
          ownRatingLoading={false}
          isConfigured={false}
          returnTo="/canteen"
          isSaving={false}
          onClose={() => undefined}
          onSubmit={vi.fn()}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText(/没有配置 Supabase/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: '提交评分' })).toBeNull()
  })
})

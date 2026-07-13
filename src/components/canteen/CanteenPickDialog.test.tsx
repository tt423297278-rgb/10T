// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CanteenPickDialog } from './CanteenPickDialog'
import type { CanteenPlace } from '../../types/domain'

const place: CanteenPlace = {
  id: 'place-1',
  region: '重庆',
  city: '重庆',
  district: '渝中区',
  category: '火锅 / 串串',
  categoryDetail: '重庆火锅',
  name: '巷子老火锅',
  address: '解放碑街道测试路 18 号',
  price: '人均 88 元',
  sourceSheet: '重庆篇',
  sourceUrl: 'https://example.com',
  sourceRow: 12,
}

afterEach(cleanup)

describe('CanteenPickDialog', () => {
  it('announces the selected restaurant and closes with Escape', () => {
    const onClose = vi.fn()
    render(
      <CanteenPickDialog
        open
        place={place}
        onClose={onClose}
        onPickAgain={vi.fn()}
      />,
    )

    expect(screen.getByRole('dialog', { name: '巷子老火锅' })).toBeTruthy()
    expect(screen.getByText('解放碑街道测试路 18 号')).toBeTruthy()
    expect(screen.getByRole('button', { name: '关闭开饭签' })).toBe(document.activeElement)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('offers a clear action to draw again', () => {
    const onPickAgain = vi.fn()
    render(
      <CanteenPickDialog
        open
        place={place}
        onClose={vi.fn()}
        onPickAgain={onPickAgain}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '再抽一家' }))
    expect(onPickAgain).toHaveBeenCalledOnce()
  })
})

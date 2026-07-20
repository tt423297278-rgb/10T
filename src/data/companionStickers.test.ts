import { describe, expect, it } from 'vitest'
import {
  companionStickers,
  getCompanionSticker,
  getCompanionStickerFromPathname,
} from './companionStickers'

describe('companionStickers', () => {
  it('keeps one unique sticker for every member', () => {
    expect(companionStickers).toHaveLength(10)
    expect(new Set(companionStickers.map((sticker) => sticker.memberId)).size).toBe(10)
    expect(new Set(companionStickers.map((sticker) => sticker.src)).size).toBe(10)
  })

  it('resolves a sticker from a member id', () => {
    expect(getCompanionSticker('member-10')?.name).toBe('王一珩')
    expect(getCompanionSticker('missing-member')).toBeUndefined()
  })

  it('locks member-detail routes to that member sticker', () => {
    companionStickers.forEach((sticker) => {
      expect(getCompanionStickerFromPathname(`/members/${sticker.memberId}`)).toEqual(sticker)
    })

    expect(getCompanionStickerFromPathname('/members')).toBeUndefined()
    expect(getCompanionStickerFromPathname('/events/member-1')).toBeUndefined()
    expect(getCompanionStickerFromPathname('/members/member-11')).toBeUndefined()
  })
})

export interface CompanionSticker {
  memberId: string
  name: string
  src: string
}

export const companionStickers: CompanionSticker[] = [
  { memberId: 'member-1', name: '蒋敦豪', src: '/images/members/stickers/member-sticker-01.webp' },
  { memberId: 'member-2', name: '鹭卓', src: '/images/members/stickers/member-sticker-02.webp' },
  { memberId: 'member-3', name: '李耕耘', src: '/images/members/stickers/member-sticker-03.webp' },
  { memberId: 'member-4', name: '李昊', src: '/images/members/stickers/member-sticker-04.webp' },
  { memberId: 'member-5', name: '赵一博', src: '/images/members/stickers/member-sticker-05.webp' },
  { memberId: 'member-6', name: '卓沅', src: '/images/members/stickers/member-sticker-06.webp' },
  { memberId: 'member-7', name: '赵小童', src: '/images/members/stickers/member-sticker-07.webp' },
  { memberId: 'member-8', name: '何浩楠', src: '/images/members/stickers/member-sticker-08.webp' },
  { memberId: 'member-9', name: '陈少熙', src: '/images/members/stickers/member-sticker-09.webp' },
  { memberId: 'member-10', name: '王一珩', src: '/images/members/stickers/member-sticker-10.webp' },
]

export function getCompanionSticker(memberId: string) {
  return companionStickers.find((sticker) => sticker.memberId === memberId)
}

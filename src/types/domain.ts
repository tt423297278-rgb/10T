export type EventType =
  | '直播'
  | '演出'
  | '综艺'
  | '音乐'
  | '品牌活动'
  | '线下活动'
  | '生日'
  | '节目录制'
  | '公开行程'
  | '其他'

export type EventStatus = '待确认' | '即将开始' | '正在进行' | '已结束' | '已取消' | '已延期'

export type MediaType = 'image' | 'video'
export type PostCategory =
  | '日常讨论'
  | '活动记录'
  | '节目观后感'
  | '粉丝作品'
  | '摄影分享'
  | '应援记录'
  | '成员资讯'
  | '成长记录'
  | '其他'

export interface MediaItem {
  id: string
  type: MediaType
  url: string
  poster?: string
  alt: string
  sourceLabel: string
  sourceUrl?: string
}

export type ImageAssetStatus = 'approved' | 'pending' | 'placeholder'

export interface ImageAsset {
  src: string
  alt: string
  sourceId: string
  status: ImageAssetStatus
  sourceLabel: string
  objectPosition?: string
  mobileObjectPosition?: string
}

export interface Member {
  id: string
  name: string
  shortTag: string
  intro: string
  tags: string[]
  recentStatus: string
  profileStatus: 'placeholder' | 'verified'
  avatarTone: string
  image?: ImageAsset
  birthday?: string
  birthplace?: string
  interests: string[]
  timeline: TimelineItem[]
  works: WorkItem[]
  media: MediaItem[]
}

export interface TimelineItem {
  id: string
  date: string
  title: string
  description: string
  sourceLabel: string
}

export interface WorkItem {
  id: string
  type: string
  title: string
  description: string
  sourceLabel: string
}

export interface FanEvent {
  id: string
  title: string
  type: EventType
  status: EventStatus
  startsAt: string
  endsAt?: string
  timeTbd?: boolean
  location: string
  platform: string
  memberIds: string[]
  description: string
  sourceLabel: string
  sourceUrl?: string
  coverTone?: string
  coverImage?: ImageAsset
  updatedAt: string
  notes?: string
}

export interface OfficialUpdate {
  id: string
  title: string
  type: string
  publishedAt: string
  memberIds: string[]
  body: string
  sourceLabel: string
  sourceUrl?: string
  coverImage?: ImageAsset
}

export interface CommunityPost {
  id: string
  title: string
  body: string
  category: PostCategory
  authorId?: string
  authorName: string
  memberIds: string[]
  createdAt: string
  status: '已发布' | '审核中' | '已隐藏' | '已删除'
  hasImage: boolean
  hasVideo: boolean
  coverImage?: ImageAsset
  likeCount: number
  commentCount: number
  favoriteCount: number
}

export interface CommunityComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  parentId?: string
  body: string
  status: '已发布' | '审核中' | '已隐藏' | '已删除'
  createdAt: string
}

export interface PointLedgerEntry {
  id: string
  amount: number
  reason: string
  balanceAfter: number
  createdAt: string
}

export interface CanteenPlace {
  id: string
  region: string
  city: string
  district: string
  category: string
  categoryDetail?: string
  name: string
  address: string
  price?: string
  tips?: string
  note?: string
  status?: 'closed'
  sourceSheet: string
  sourceUrl: string
  sourceRow: number
}

export interface CanteenRatingScores {
  taste: number
  service: number
  value: number
  environment: number
}

export interface CanteenRating extends CanteenRatingScores {
  placeId: string
  reviewText: string
  updatedAt: string
}

export interface CanteenRatingSummary extends CanteenRatingScores {
  placeId: string
  ratingCount: number
  overall: number
}

export interface CanteenRegionManifest {
  id: string
  name: string
  file: string
  count: number
  cities: string[]
  categories: string[]
}

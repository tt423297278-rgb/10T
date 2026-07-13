export interface MomentRecord {
  id: string
  title: string
  quote: string
  context: string
  sourceLabel: string
  season: string
  members: string[]
  tone: 'green' | 'gold' | 'mist'
}

export interface GalleryRecord {
  id: string
  title: string
  description: string
  type: '照片' | '视频'
  src: string
  alt: string
  sourceLabel: string
  members: string[]
  aspect: 'wide' | 'portrait'
}

export const momentRecords: MomentRecord[] = [
  {
    id: 'moment-01',
    title: '清晨下田前的集合',
    quote: '把今天也认真过完。',
    context: '用于收藏节目里适合做成手卡的短句和画面，正式内容等待用户补充来源。',
    sourceLabel: '用户待补充来源',
    season: '田野记录',
    members: ['十个勤天'],
    tone: 'green',
  },
  {
    id: 'moment-02',
    title: '雨后麦田边的停顿',
    quote: '慢一点，也是在往前走。',
    context: '保留名场面标题、出现成员、出处和时间码字段，后续可接入后台收藏。',
    sourceLabel: '占位收藏',
    season: '语录手卡',
    members: ['多人'],
    tone: 'mist',
  },
  {
    id: 'moment-03',
    title: '收工后的院子',
    quote: '有些陪伴，是一起把日子种下去。',
    context: '适合记录温暖瞬间、经典台词和粉丝整理的片段说明。',
    sourceLabel: '待确认出处',
    season: '名场面',
    members: ['待关联成员'],
    tone: 'gold',
  },
]

export const galleryRecords: GalleryRecord[] = [
  {
    id: 'gallery-imported-01',
    title: '田野举旗群像',
    description: '多人站在田野边的群像，适合承接网站的青年、土地和共同劳作气质。',
    type: '照片',
    src: '/images/gallery/imported/field-group-01.jpg',
    alt: '十个勤天成员在田野中举起工具和旗帜的群像照片',
    sourceLabel: '用户本地素材',
    members: ['十个勤天'],
    aspect: 'wide',
  },
  {
    id: 'gallery-imported-02',
    title: '田间劳作远景',
    description: '以土地和劳作为主体的远景照片，适合做助农和田野记录的氛围图。',
    type: '照片',
    src: '/images/gallery/imported/field-work-01.jpg',
    alt: '成员在田地中劳作的远景照片',
    sourceLabel: '用户本地素材',
    members: ['十个勤天'],
    aspect: 'wide',
  },
  {
    id: 'gallery-imported-03',
    title: '室内合照记录',
    description: '成员在室内空间的合影，用于记录团队阶段和节目之外的相处画面。',
    type: '照片',
    src: '/images/gallery/imported/studio-group-01.jpeg',
    alt: '十个勤天成员室内合照',
    sourceLabel: '用户本地素材',
    members: ['十个勤天'],
    aspect: 'wide',
  },
  {
    id: 'gallery-support-01',
    title: '助农行动时间线',
    description: '把助农关键节点做成信息图，适合在禾伙人栏目中继续拆解。',
    type: '照片',
    src: '/images/support/support-timeline-2023-2024.jpg',
    alt: '十个勤天助农行动时间线信息图',
    sourceLabel: '用户本地素材',
    members: ['禾伙人助农'],
    aspect: 'portrait',
  },
  {
    id: 'gallery-01',
    title: '田埂劳作群像',
    description: '自然劳作场景，适合作为首页和影像馆的田野氛围素材。',
    type: '照片',
    src: '/images/hero/user-carousel/hero-user-02.jpg',
    alt: '田野中多人劳作的远景照片',
    sourceLabel: '用户本地素材',
    members: ['十个勤天'],
    aspect: 'wide',
  },
  {
    id: 'gallery-02',
    title: '十位成员群像记录',
    description: '用于展示成员合影、节目截图和粉丝整理图集的入口。',
    type: '照片',
    src: '/images/hero/user-carousel/hero-user-01.jpg',
    alt: '十个勤天成员群像照片',
    sourceLabel: '用户本地素材',
    members: ['十个勤天'],
    aspect: 'wide',
  },
  {
    id: 'gallery-03',
    title: '麦田边的自拍视频画面',
    description: '视频展示区占位，后续可接入封面、播放弹窗和来源信息。',
    type: '视频',
    src: '/images/news/community-01.webp',
    alt: '成员在麦田边分享记录的节目画面',
    sourceLabel: '本地占位素材',
    members: ['成员记录'],
    aspect: 'wide',
  },
  {
    id: 'gallery-04',
    title: '活动现场留影',
    description: '整理成员照片、活动物料和公开视觉内容，保持来源标注。',
    type: '照片',
    src: '/images/activities/activity-02.webp',
    alt: '活动现场相关视觉素材',
    sourceLabel: '本地占位素材',
    members: ['活动关联'],
    aspect: 'wide',
  },
]

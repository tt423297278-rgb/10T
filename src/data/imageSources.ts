import type { ImageAsset, ImageAssetStatus } from '../types/domain'

export interface ImageSourceRecord {
  id: string
  localPath: string
  usage: string
  subject: string
  originalSourcePage: string
  publisherOrRightsHolder: string
  downloadedAt: string
  licenseNote: string
  status: ImageAssetStatus
}

export interface PendingImageCandidate {
  id: string
  intendedPath: string
  usage: string
  subject: string
  sourcePage: string
  publisherOrRightsHolder: string
  licenseStatus: 'pending'
  note: string
}

const downloadedAt = '2026-07-01'
const memberDownloadedAt = '2026-07-02'
const userHeroDownloadedAt = '2026-07-06'
const placeholderSource = '本项目本地生成的无真人脸占位图'
const placeholderLicense = 'placeholder：原创占位素材，仅用于开发演示；不代表成员真实外貌，正式上线前应替换为已授权图片。'
const iqiyiSeasonPage = 'https://www.iqiyi.com/kszt/1gr1a168fhq.html'
const iqiyiPublisher = '爱奇艺《种地吧》节目方'
const userConfirmedIqiyiLicense =
  'approved：用户已明确确认爱奇艺相关素材可下载并用于当前项目；素材已本地化保存为 WebP，未去除水印、Logo、署名或版权标识。'
const userProvidedHeroLicense =
  'approved：用户本地文件夹提供的首页轮播素材；已复制到项目 public 目录，用于当前网站首页 Hero 轮播展示。'
const memberPortraitLicense =
  'approved：用户已确认公开成员照片素材可用于当前项目；素材已本地化保存为 WebP，仅做等比裁切、低饱和压缩和尺寸适配，未去除水印、Logo、署名或版权标识。'

export const heroGroupPortrait: ImageAsset & {
  desktopSrc: string
  mobileSrc: string
  copyrightNote: string
} = {
  src: '/images/hero/iqiyi-zdb-group-hero.webp',
  desktopSrc: '/images/hero/iqiyi-zdb-group-hero.webp',
  mobileSrc: '/images/hero/iqiyi-zdb-group-hero-mobile.webp',
  alt: '十个勤天十位成员群像',
  sourceId: 'iqiyi-zdb-group-hero',
  status: 'approved',
  sourceLabel: '爱奇艺《种地吧》官方页面素材',
  objectPosition: 'center top',
  mobileObjectPosition: 'center top',
  copyrightNote: '用户确认该爱奇艺相关素材可用于当前项目；已本地化保存，未去除原始版权标识。',
}

export const heroCarouselImages: Array<ImageAsset & {
  desktopSrc: string
  mobileSrc: string
  caption: string
  copyrightNote: string
}> = [
  ['01', '十个勤天首页群像轮播图 1', '首页群像轮播 1', 'center center'],
  ['02', '十个勤天首页群像轮播图 2', '首页群像轮播 2', 'center 52%'],
  ['03', '十个勤天首页群像轮播图 3', '首页群像轮播 3', 'center center'],
  ['04', '十个勤天首页群像轮播图 4', '首页群像轮播 4', 'center 48%'],
  ['05', '十个勤天首页群像轮播图 5', '首页群像轮播 5', 'center center'],
].map(([order, alt, caption, objectPosition]) => {
  const src = `/images/hero/user-carousel/hero-user-${order}.jpg`

  return {
    src,
    desktopSrc: src,
    mobileSrc: src,
    alt,
    sourceId: `user-hero-carousel-${order}`,
    status: 'approved',
    sourceLabel: '用户本地提供素材',
    objectPosition,
    mobileObjectPosition: objectPosition,
    caption,
    copyrightNote: userProvidedHeroLicense,
  }
})

const memberNames = ['蒋敦豪', '鹭卓', '李耕耘', '李昊', '赵一博', '卓沅', '赵小童', '何浩楠', '陈少熙', '王一珩']

const memberPortraitSources = [
  {
    page: 'https://www.duitang.com/blog/?id=1549164654',
    publisher: '堆糖用户：老是闪退我也醉了',
  },
  {
    page: 'https://www.duitang.com/blog/?id=1519532700',
    publisher: '堆糖用户：Zhcir',
  },
  {
    page: 'https://www.duitang.com/blog/?id=1523878277',
    publisher: '堆糖用户：Sky_123',
  },
  {
    page: 'https://www.duitang.com/blog/?id=1523875588',
    publisher: '堆糖图片页',
  },
  {
    page: 'https://api.duitang.com/blog/?id=1539396334',
    publisher: '堆糖用户：Sky_123',
  },
  {
    page: 'https://www.duitang.com/blog/?id=1523879390',
    publisher: '堆糖用户：Sky_123',
  },
  {
    page: 'https://www.duitang.com/blog/?id=1524093445',
    publisher: '堆糖用户：Sky_123',
  },
  {
    page: 'https://www.duitang.com/blog/?id=1523293218',
    publisher: '堆糖用户：娟嗯',
  },
  {
    page: 'https://www.duitang.com/blog/?id=1538636461',
    publisher: '堆糖用户：醉璟壹',
  },
  {
    page: 'https://www.duitang.com/blog/?id=1524196218',
    publisher: '堆糖用户：Sky_123',
  },
]

const memberPortraitFocus = [
  'center top',
  'center top',
  'center top',
  'center top',
  'center top',
  'center top',
  'center top',
  'center top',
  'center top',
  'center top',
]

export const memberImages: Record<string, ImageAsset> = Object.fromEntries(
  memberNames.map((name, index) => {
    const order = String(index + 1).padStart(2, '0')
    return [
      `member-${index + 1}`,
      {
        src: `/images/members/member-${order}.webp`,
        alt: `${name} 成员介绍照片`,
        sourceId: `member-${order}-portrait`,
        status: 'approved',
        sourceLabel: '公开图片页成员照片',
        objectPosition: memberPortraitFocus[index] ?? 'center 18%',
        mobileObjectPosition: memberPortraitFocus[index] ?? 'center 18%',
      },
    ]
  }),
)

export const activityImages: Record<string, ImageAsset> = {
  'event-luzhuo-shanghai': {
    src: '/images/activities/event-luzhuo-shanghai.webp',
    alt: '鹭卓个人巡演上海站活动封面',
    sourceId: 'event-luzhuo-shanghai',
    status: 'approved',
    sourceLabel: '公开活动信息整理素材',
    objectPosition: 'center top',
  },
  'event-ligengyun-birthday': {
    src: '/images/activities/event-ligengyun-birthday.webp',
    alt: '李耕耘 2026 生日会活动海报',
    sourceId: 'event-ligengyun-birthday',
    status: 'approved',
    sourceLabel: '新浪新闻转载公开活动素材',
    objectPosition: 'center center',
  },
  'event-lihao-hongkong': {
    src: '/images/activities/event-lihao-hongkong.webp',
    alt: '李昊香港个人演唱会活动海报',
    sourceId: 'event-lihao-hongkong',
    status: 'approved',
    sourceLabel: '新浪新闻转载公开活动素材',
    objectPosition: 'center center',
  },
  'event-hehaonan-july': {
    src: '/images/activities/event-hehaonan-july.webp',
    alt: '何浩楠七月行程图',
    sourceId: 'event-hehaonan-july',
    status: 'approved',
    sourceLabel: '新浪新闻转载何浩楠工作室行程图',
    objectPosition: 'center center',
  },
  'event-ola-chongqing': {
    src: '/images/activities/event-ola-chongqing.webp',
    alt: '重庆哦啦音乐节 2026 年 7 月 12 日阵容海报',
    sourceId: 'event-ola-chongqing',
    status: 'approved',
    sourceLabel: '新浪新闻转载重庆哦啦音乐节公开海报',
    objectPosition: 'center center',
  },
  'tour-2026-xiamen': {
    src: '/images/activities/tour-2026-xiamen.webp',
    alt: '十个勤天 2026 贰零贰贰巡回演唱会主视觉',
    sourceId: 'tour-2026-xiamen',
    status: 'approved',
    sourceLabel: '新浪新闻转载十个勤天官方微博相关素材',
    objectPosition: 'center center',
  },
  'tour-2026-guangzhou': {
    src: '/images/activities/tour-2026-guangzhou.webp',
    alt: '十个勤天 2026 贰零贰贰巡回演唱会主视觉',
    sourceId: 'tour-2026-guangzhou',
    status: 'approved',
    sourceLabel: '新浪新闻转载十个勤天官方微博相关素材',
    objectPosition: 'center center',
  },
  'event-1': {
    src: '/images/activities/iqiyi-zdb-ep50.webp',
    alt: '十个勤天十位成员穿工装合影',
    sourceId: 'iqiyi-zdb-ep50',
    status: 'approved',
    sourceLabel: '爱奇艺《种地吧》官方视频缩略图',
  },
  'event-2': {
    src: '/images/activities/iqiyi-zdb-wheat-gaze.webp',
    alt: '成员在收割机驾驶室中的节目画面',
    sourceId: 'iqiyi-zdb-wheat-gaze',
    status: 'approved',
    sourceLabel: '爱奇艺《种地吧》官方视频缩略图',
  },
  'event-3': {
    src: '/images/activities/iqiyi-zdb-ep49.webp',
    alt: '十个勤天成员舞台演唱节目画面',
    sourceId: 'iqiyi-zdb-ep49',
    status: 'approved',
    sourceLabel: '爱奇艺《种地吧》官方视频缩略图',
  },
}

export const officialUpdateImages: Record<string, ImageAsset> = {
  'update-1': {
    src: '/images/news/iqiyi-zdb-first-photo.webp',
    alt: '十个勤天成员在室内交流的节目画面',
    sourceId: 'iqiyi-zdb-first-photo',
    status: 'approved',
    sourceLabel: '爱奇艺《种地吧》官方视频缩略图',
  },
  'update-2': {
    src: '/images/activities/iqiyi-zdb-ep49.webp',
    alt: '十个勤天成员舞台演唱节目画面',
    sourceId: 'iqiyi-zdb-ep49',
    status: 'approved',
    sourceLabel: '爱奇艺《种地吧》官方视频缩略图',
  },
}

export const communityPostImages: Record<string, ImageAsset> = {
  'post-1': {
    src: '/images/news/iqiyi-zdb-wheat-vlog.webp',
    alt: '成员在麦田边分享丰收记录的节目画面',
    sourceId: 'iqiyi-zdb-wheat-vlog',
    status: 'approved',
    sourceLabel: '爱奇艺《种地吧》官方视频缩略图',
  },
}

export const fallbackImage: ImageAsset = {
  src: '/images/placeholders/image-fallback.webp',
  alt: '图片加载失败占位图',
  sourceId: 'image-fallback-placeholder',
  status: 'placeholder',
  sourceLabel: '本地图片失败占位图',
}

export const imageSources: ImageSourceRecord[] = [
  {
    id: 'agri-aid-header-wheatfield-generated',
    localPath: 'public/images/agri-aid/agri-aid-header-wheatfield.webp',
    usage: '助农专题页表头麦田与麦穗背景',
    subject: '低饱和纸艺麦田、麦穗与远山',
    originalSourcePage: 'OpenAI Image 2 本地生成',
    publisherOrRightsHolder: '本项目原创生成素材',
    downloadedAt: '2026-07-10',
    licenseNote: 'approved：由用户明确要求使用 Image 2 为当前项目原创生成；未裁剪或复用参考图，不含人物、Logo、文字和第三方水印。',
    status: 'approved',
  },
  {
    id: 'iqiyi-zdb-group-hero',
    localPath: 'public/images/hero/iqiyi-zdb-group-hero.webp',
    usage: '首页首屏桌面十位成员群像主视觉',
    subject: '十个勤天十位成员群像',
    originalSourcePage: iqiyiSeasonPage,
    publisherOrRightsHolder: iqiyiPublisher,
    downloadedAt,
    licenseNote: userConfirmedIqiyiLicense,
    status: 'approved',
  },
  {
    id: 'iqiyi-zdb-group-hero-mobile',
    localPath: 'public/images/hero/iqiyi-zdb-group-hero-mobile.webp',
    usage: '首页首屏移动端十位成员群像主视觉',
    subject: '十个勤天十位成员群像移动端适配图',
    originalSourcePage: iqiyiSeasonPage,
    publisherOrRightsHolder: iqiyiPublisher,
    downloadedAt,
    licenseNote: userConfirmedIqiyiLicense,
    status: 'approved',
  },
  ...heroCarouselImages.map((image, index) => ({
    id: image.sourceId,
    localPath: `public/images/hero/user-carousel/hero-user-${String(index + 1).padStart(2, '0')}.jpg`,
    usage: '首页 Hero 群像轮播图',
    subject: image.alt,
    originalSourcePage: 'C:\\Users\\Administrator\\Desktop\\图片',
    publisherOrRightsHolder: '用户本地提供',
    downloadedAt: userHeroDownloadedAt,
    licenseNote: userProvidedHeroLicense,
    status: 'approved' as const,
  })),
  {
    id: 'iqiyi-zdb-ep50',
    localPath: 'public/images/activities/iqiyi-zdb-ep50.webp',
    usage: '活动卡片封面和群像备用素材',
    subject: '种地吧第50期 十个勤天开收割机收割142亩小麦',
    originalSourcePage: iqiyiSeasonPage,
    publisherOrRightsHolder: iqiyiPublisher,
    downloadedAt,
    licenseNote: userConfirmedIqiyiLicense,
    status: 'approved',
  },
  {
    id: 'iqiyi-zdb-wheat-gaze',
    localPath: 'public/images/activities/iqiyi-zdb-wheat-gaze.webp',
    usage: '活动卡片封面',
    subject: '王一珩远望麦田感叹时光',
    originalSourcePage: iqiyiSeasonPage,
    publisherOrRightsHolder: iqiyiPublisher,
    downloadedAt,
    licenseNote: userConfirmedIqiyiLicense,
    status: 'approved',
  },
  {
    id: 'iqiyi-zdb-ep49',
    localPath: 'public/images/activities/iqiyi-zdb-ep49.webp',
    usage: '音乐活动和动态封面',
    subject: '种地吧第49期 十个勤天合唱《后陡门的夏》',
    originalSourcePage: iqiyiSeasonPage,
    publisherOrRightsHolder: iqiyiPublisher,
    downloadedAt,
    licenseNote: userConfirmedIqiyiLicense,
    status: 'approved',
  },
  {
    id: 'iqiyi-zdb-first-photo',
    localPath: 'public/images/news/iqiyi-zdb-first-photo.webp',
    usage: '成员动态封面',
    subject: '十个勤天复刻首张合影相关视频缩略图',
    originalSourcePage: iqiyiSeasonPage,
    publisherOrRightsHolder: iqiyiPublisher,
    downloadedAt,
    licenseNote: userConfirmedIqiyiLicense,
    status: 'approved',
  },
  {
    id: 'iqiyi-zdb-wheat-vlog',
    localPath: 'public/images/news/iqiyi-zdb-wheat-vlog.webp',
    usage: '社区精选封面',
    subject: '蒋敦豪分享小麦丰收相关视频缩略图',
    originalSourcePage: iqiyiSeasonPage,
    publisherOrRightsHolder: iqiyiPublisher,
    downloadedAt,
    licenseNote: userConfirmedIqiyiLicense,
    status: 'approved',
  },
  {
    id: 'tour-2026-xiamen',
    localPath: 'public/images/activities/tour-2026-xiamen.webp',
    usage: '十个勤天 2026《贰零贰贰》巡回演唱会厦门站活动封面',
    subject: '十个勤天 2026《贰零贰贰》巡回演唱会主视觉',
    originalSourcePage: 'https://www.sina.cn/news/detail/5314394634062485.html',
    publisherOrRightsHolder: '十个勤天官方微博 / 新浪新闻转载页面',
    downloadedAt: '2026-07-02',
    licenseNote: 'approved：用户要求接入公开平台近期活动素材；素材已本地化保存为 WebP，未去除水印、Logo、署名或版权标识。',
    status: 'approved',
  },
  {
    id: 'tour-2026-guangzhou',
    localPath: 'public/images/activities/tour-2026-guangzhou.webp',
    usage: '十个勤天 2026《贰零贰贰》巡回演唱会广州站活动封面',
    subject: '十个勤天 2026《贰零贰贰》巡回演唱会主视觉',
    originalSourcePage: 'https://www.sina.cn/news/detail/5315572435782110.html',
    publisherOrRightsHolder: '十个勤天官方微博 / 新浪新闻转载页面',
    downloadedAt: '2026-07-02',
    licenseNote: 'approved：用户要求接入公开平台近期活动素材；素材已本地化保存为 WebP，未去除水印、Logo、署名或版权标识。',
    status: 'approved',
  },
  {
    id: 'event-luzhuo-shanghai',
    localPath: 'public/images/activities/event-luzhuo-shanghai.webp',
    usage: '鹭卓个人巡演上海站活动封面',
    subject: '鹭卓 Ready To The Top II 2026 巡回演唱会上海站',
    originalSourcePage: 'https://www.mercedes-benzarena.com/',
    publisherOrRightsHolder: '梅赛德斯-奔驰文化中心公开演出信息 / 本地成员图适配封面',
    downloadedAt: '2026-07-02',
    licenseNote: 'approved：活动信息来自公开演出页面；封面使用本项目已接入成员图适配生成，未新增未授权第三方图片。',
    status: 'approved',
  },
  {
    id: 'event-ligengyun-birthday',
    localPath: 'public/images/activities/event-ligengyun-birthday.webp',
    usage: '李耕耘 2026 生日会活动封面',
    subject: '李耕耘 2026 生日会',
    originalSourcePage: 'https://www.sina.cn/news/detail/5308569403786017.html',
    publisherOrRightsHolder: '李耕耘工作室 / 新浪新闻转载页面',
    downloadedAt: '2026-07-02',
    licenseNote: 'approved：用户要求接入公开平台近期活动素材；素材已本地化保存为 WebP，未去除水印、Logo、署名或版权标识。',
    status: 'approved',
  },
  {
    id: 'event-lihao-hongkong',
    localPath: 'public/images/activities/event-lihao-hongkong.webp',
    usage: '李昊香港个人演唱会活动封面',
    subject: '李昊「数到一」香港演唱会',
    originalSourcePage: 'https://www.sina.cn/news/detail/5307855005811069.html',
    publisherOrRightsHolder: '公开活动发布方 / 新浪新闻转载页面',
    downloadedAt: '2026-07-02',
    licenseNote: 'approved：用户要求接入公开平台近期活动素材；素材已本地化保存为 WebP，未去除水印、Logo、署名或版权标识。',
    status: 'approved',
  },
  {
    id: 'event-hehaonan-july',
    localPath: 'public/images/activities/event-hehaonan-july.webp',
    usage: '何浩楠七月个人行程活动封面',
    subject: '何浩楠 2026 年 7 月行程图',
    originalSourcePage: 'https://www.sina.cn/news/detail/5315504470496812.html',
    publisherOrRightsHolder: '何浩楠工作室 / 新浪新闻转载页面',
    downloadedAt: '2026-07-02',
    licenseNote: 'approved：用户要求接入公开平台近期活动素材；素材已本地化保存为 WebP，未去除水印、Logo、署名或版权标识。',
    status: 'approved',
  },
  {
    id: 'event-ola-chongqing',
    localPath: 'public/images/activities/event-ola-chongqing.webp',
    usage: '重庆哦啦音乐节活动封面',
    subject: '重庆哦啦音乐节 2026 年 7 月 12 日阵容',
    originalSourcePage: 'https://www.sina.cn/news/detail/5310083535735675.html',
    publisherOrRightsHolder: '重庆哦啦音乐节 / 新浪新闻转载页面',
    downloadedAt: '2026-07-02',
    licenseNote: 'approved：用户要求接入公开平台近期活动素材；素材已本地化保存为 WebP，未去除水印、Logo、署名或版权标识。',
    status: 'approved',
  },
  {
    id: 'hero-group-placeholder',
    localPath: 'public/images/hero/group-portrait-placeholder.webp',
    usage: '首页首屏桌面群像主视觉',
    subject: '十个勤天十位成员群像占位',
    originalSourcePage: placeholderSource,
    publisherOrRightsHolder: '本项目生成',
    downloadedAt,
    licenseNote: placeholderLicense,
    status: 'placeholder',
  },
  {
    id: 'hero-group-placeholder-mobile',
    localPath: 'public/images/hero/group-portrait-placeholder-mobile.webp',
    usage: '首页首屏移动端群像主视觉',
    subject: '十个勤天十位成员群像占位',
    originalSourcePage: placeholderSource,
    publisherOrRightsHolder: '本项目生成',
    downloadedAt,
    licenseNote: placeholderLicense,
    status: 'placeholder',
  },
  ...memberNames.map((name, index) => {
    const order = String(index + 1).padStart(2, '0')
    const source = memberPortraitSources[index]!
    return {
      id: `member-${order}-portrait`,
      localPath: `public/images/members/member-${order}.webp`,
      usage: '成员卡片和成员详情头图',
      subject: `${name} 成员介绍照片`,
      originalSourcePage: source.page,
      publisherOrRightsHolder: source.publisher,
      downloadedAt: memberDownloadedAt,
      licenseNote: memberPortraitLicense,
      status: 'approved' as const,
    }
  }),
  ...[
    ['activity-01-placeholder', 'public/images/activities/activity-01.webp', '活动卡片封面', '七月陪伴直播记录'],
    ['activity-02-placeholder', 'public/images/activities/activity-02.webp', '活动卡片封面', '公开行程占位'],
    ['activity-03-placeholder', 'public/images/activities/activity-03.webp', '活动卡片封面', '音乐内容整理日'],
    ['update-01-placeholder', 'public/images/news/update-01.webp', '成员动态封面', '后陡门通讯'],
    ['update-02-placeholder', 'public/images/news/update-02.webp', '成员动态封面', '作品发布占位'],
    ['community-01-placeholder', 'public/images/news/community-01.webp', '社区帖子封面', '田野手册'],
    ['image-fallback-placeholder', 'public/images/placeholders/image-fallback.webp', '图片加载失败占位', '通用占位'],
    ['paper-grain-placeholder', 'public/images/textures/paper-grain.webp', '纸张纹理备用素材', '纸张颗粒'],
  ].map(([id, localPath, usage, subject, source = placeholderSource, publisher = '本项目生成', license = placeholderLicense, status = 'placeholder']) => ({
    id,
    localPath,
    usage,
    subject,
    originalSourcePage: source,
    publisherOrRightsHolder: publisher,
    downloadedAt,
    licenseNote: license,
    status: status as ImageAssetStatus,
  })),
]

export const pendingImageCandidates: PendingImageCandidate[] = [
  {
    id: 'candidate-weibo-official-group',
    intendedPath: 'public/images/hero/group-portrait-official.webp',
    usage: '首页首屏十位成员官方群像',
    subject: '十个勤天官方微博群像合照',
    sourcePage: 'https://weibo.com/a/hot/7643477903415299_1.html?type=new',
    publisherOrRightsHolder: '十个勤天官方微博或原发布账号',
    licenseStatus: 'pending',
    note: '微博公开发布不等于允许下载接入独立网站；未见明确转载授权，因此未下载。',
  },
]

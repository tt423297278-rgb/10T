export type AgriAidImageSourceType =
  | 'official'
  | 'government'
  | 'media'
  | 'userProvided'
  | 'illustration'
  | 'placeholder'

export type AgriAidImageMatchLevel = 'exact' | 'contextual' | 'illustration' | 'placeholder'

export type AgriAidImageUsageStatus = 'approved' | 'pending' | 'linkOnly' | 'rejected'

export type AgriAidEventImage = {
  localPath?: string
  alt: string
  sourceUrl?: string
  sourceTitle?: string
  sourceName?: string
  sourceType: AgriAidImageSourceType
  matchLevel: AgriAidImageMatchLevel
  usageStatus: AgriAidImageUsageStatus
  note?: string
}

type EventReference = {
  url: string
  title: string
  name: string
  sourceType: Extract<AgriAidImageSourceType, 'official' | 'government' | 'media'>
  matchLevel: Extract<AgriAidImageMatchLevel, 'exact' | 'contextual'>
}

const timelineReference: EventReference = {
  url: 'https://www.sina.cn/news/detail/5307889400940878.html',
  title: '十个勤天助农行动年份资料汇总',
  name: '新浪新闻公开资料页',
  sourceType: 'media',
  matchLevel: 'exact',
}

const references = {
  jinyun: {
    url: 'https://yule.360.com/detail/3411546',
    title: '“十个勤天来了”系列直播正式启动',
    name: '360娱乐公开报道',
    sourceType: 'media',
    matchLevel: 'exact',
  },
  xishuangbanna: {
    url: 'https://weibo.com/7827781925/4939681050925829',
    title: '新农人溯源新乡村系列直播第二站景洪',
    name: '十个勤天官方微博',
    sourceType: 'official',
    matchLevel: 'exact',
  },
  tengger: {
    url: 'https://gongyi.weibo.com/r/229982',
    title: '百万森林计划——腾格里沙漠锁边行动',
    name: '微博微公益',
    sourceType: 'official',
    matchLevel: 'exact',
  },
  xuyi: {
    url: 'https://www.xuyi.gov.cn/col/887_815381/art/17119008/1713833226179ZQvFPYtj.html',
    title: '2024年盱眙龙虾开捕活动举行',
    name: '盱眙县人民政府',
    sourceType: 'government',
    matchLevel: 'contextual',
  },
  ningxiang: {
    url: 'https://jhs.moa.gov.cn/gzdt/202412/t20241204_6467421.htm',
    title: '坚持“三个注重” 加快打造宁乡花猪百亿产业',
    name: '农业农村部农村合作经济指导司',
    sourceType: 'government',
    matchLevel: 'contextual',
  },
  rikaze: {
    url: 'https://www.cfrd.org.cn/news/news_detail.aspx?articleid=4448',
    title: '驰援西藏日喀则地震灾区救援行动进展',
    name: '中国乡村发展基金会',
    sourceType: 'official',
    matchLevel: 'contextual',
  },
  nangqianLive: {
    url: 'https://news.sina.com.cn/zx/gj/2025-03-17/doc-inepxqhn0746903.shtml',
    title: '“十个勤天”重返青海囊谦',
    name: '青海新闻网 / 新浪新闻转载',
    sourceType: 'media',
    matchLevel: 'exact',
  },
  nangqianSalt: {
    url: 'https://www.nangqian.gov.cn/index.php?c=show&id=8757',
    title: '囊谦“八大盐场”的嬗变',
    name: '囊谦县人民政府',
    sourceType: 'government',
    matchLevel: 'contextual',
  },
  ainongDay: {
    url: 'https://www.cnhan.com/html/yule/20250520/1115863.htm',
    title: '直播11小时，累计观看破1.4亿！“十个勤天”破圈助农',
    name: '汉网公开报道',
    sourceType: 'media',
    matchLevel: 'exact',
  },
  nangqianResult: {
    url: 'https://m.tibet.cn/cn/news/zcdt/202601/t20260104_7911939.html',
    title: '澜沧江畔，产业花开正当时',
    name: '中国西藏网',
    sourceType: 'media',
    matchLevel: 'exact',
  },
  motuo: {
    url: 'https://www.sina.cn/news/detail/5275739488259845.html',
    title: '美丽墨脱 好物天成推荐会资料',
    name: '新浪新闻公开资料页',
    sourceType: 'media',
    matchLevel: 'exact',
  },
  desertRose: {
    url: 'https://www.forestry.gov.cn/c/www/hxzltklmgsmbyzjz/615376.jhtml',
    title: '塔克拉玛干沙漠被“锁”记',
    name: '国家林业和草原局',
    sourceType: 'government',
    matchLevel: 'contextual',
  },
  qiele: {
    url: 'https://www.xj.chinanews.com.cn/dizhou/2026-04-18/detail-ihfcqyyi3995813.shtml',
    title: '“十个勤天”一场直播背后，是“沙漠种枣人”李鹏的17年',
    name: '中新网新疆',
    sourceType: 'media',
    matchLevel: 'exact',
  },
} satisfies Record<string, EventReference>

function illustration(
  eventTitle: string,
  reference: EventReference = timelineReference,
  note?: string,
): AgriAidEventImage {
  return {
    alt: `${eventTitle}资料图片候选`,
    sourceUrl: reference.url,
    sourceTitle: reference.title,
    sourceName: reference.name,
    sourceType: reference.sourceType,
    matchLevel: reference.matchLevel,
    usageStatus: 'linkOnly',
    note:
      `报道页面与事件相符，但未见允许独立网站转载其图片的明确授权，因此不下载、不显示外部图片；页面改用本项目原创事件插画。${note ? ` ${note}` : ''}`,
  }
}

export const agriAidImageSources: Record<string, AgriAidEventImage> = {
  '2023-company-founded': illustration('十个勤天农业发展公司成立'),
  '2023-jinyun-live': illustration('缙云直播助农', references.jinyun),
  '2023-xishuangbanna-live': illustration('西双版纳直播助农', references.xishuangbanna),
  '2023-mid-autumn-live': illustration('中秋节直播助农'),
  '2023-northeast-live': illustration('东北直播助农'),
  '2024-tengger-trees': illustration('腾格里沙漠种梭梭树', references.tengger),
  '2024-minqin-ginseng-fruit': illustration('民勤直播助农销售人参果', references.tengger),
  '2024-tongnan-pepper': illustration('重庆潼南收购农户滞销二荆条'),
  '2024-jiande-strawberry': illustration('建德收购农户草莓'),
  '2024-xuyi-crayfish': illustration('盱眙帮助养殖户销售龙虾', references.xuyi, '该政府页面为同地区同品类资料，未作为事件照片使用。'),
  '2024-ainong-day': illustration('爱侬日直播助农'),
  '2024-food-donation': illustration('赵小童向环卫工人捐赠食品'),
  '2024-autumn-live': illustration('晒秋日直播助农'),
  '2024-ningxiang-pig': illustration('帮助宁乡花猪拓展销售渠道', references.ningxiang, '该政府页面为同地区同产业资料，未作为事件照片使用。'),
  '2025-linkou-soap': illustration('林口带村民出售手工沙棘皂'),
  '2025-rikaze-clothes': illustration('向日喀则灾区捐赠冬衣', references.rikaze, '基金会页面用于灾区援助背景核对，未作为十个勤天捐赠事件照片使用。'),
  '2025-youth-foundation': illustration('赵小童向青少年基金会捐款'),
  '2025-niangla-greenhouse': illustration('娘拉乡帮建水培大棚', references.nangqianLive),
  '2025-nangqian-live': illustration('囊谦芫根助农推广直播', references.nangqianLive),
  '2025-jiande-strawberry-again': illustration('建德再次收购农户滞销草莓'),
  '2025-nangqian-salt': illustration('帮助囊谦盐农打开销路', references.nangqianSalt),
  '2025-ainong-day': illustration('爱侬日直播助农', references.ainongDay),
  '2025-jiang-minqin-donation': illustration('蒋敦豪向民勤捐款'),
  '2025-zxt-school-field': illustration('赵小童为囊谦藏医学校翻新操场'),
  '2025-zxt-water-truck': illustration('赵小童向民勤捐赠洒水车'),
  '2025-autumn-nangqian-result': illustration('囊谦特色产品销售额1060.2万元', references.nangqianResult),
  '2025-lihao-aide-donation': illustration('李昊向爱德基金会捐款'),
  '2026-zxt-linyi-donation': illustration('赵小童向临沂基金会捐款并捐赠水彩笔'),
  '2026-lihao-yangfan': illustration('李昊向扬帆计划捐赠'),
  '2026-hhn-books': illustration('何浩楠向河北小学捐赠图书'),
  '2026-motuo-live': illustration('墨脱推荐会直播推广特色产品', references.motuo),
  '2026-taklamakan-rose': illustration('塔克拉玛干沙漠种沙漠玫瑰', references.desertRose, '国家林草局页面为同地区同植物类型资料，未作为事件照片使用。'),
  '2026-zyb-farm-machine': illustration('赵一博向民勤捐赠四轮打坑机'),
  '2026-minqin-water': illustration('禾伙人向民勤相关基地捐赠苏打水'),
  '2026-qiele-jujube-live': illustration('策勒助农直播红枣18万单', references.qiele),
  '2026-qiele-fans': illustration('策勒助农直播禾伙人购买18万单', references.qiele, '与上一节点属于同一场策勒直播，共用事件资料来源，但页面视觉插画仍独立。'),
}

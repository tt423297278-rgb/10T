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

function userMaterial(eventTitle: string, filename: string, note?: string): AgriAidEventImage {
  return {
    localPath: `/images/agri-aid/crops/${filename}`,
    alt: `${eventTitle}相关助农资料图`,
    sourceTitle: '用户提供的助农行动资料图',
    sourceName: '用户提供素材',
    sourceType: 'userProvided',
    matchLevel: 'contextual',
    usageStatus: 'approved',
    note: `该图片来自用户提供的助农时间线资料，用作事件背景资料，不标注为独立新闻现场图。${note ? ` ${note}` : ''}`,
  }
}

function sourcedPhoto(
  eventTitle: string,
  localPath: string,
  reference: EventReference,
  matchLevel: Extract<AgriAidImageMatchLevel, 'exact' | 'contextual'> = reference.matchLevel,
  note?: string,
): AgriAidEventImage {
  return {
    localPath,
    alt: `${eventTitle}公开资料照片`,
    sourceUrl: reference.url,
    sourceTitle: reference.title,
    sourceName: reference.name,
    sourceType: reference.sourceType,
    matchLevel,
    usageStatus: 'approved',
    note: `图片保留原始画面和已有标识，右侧卡片同时提供来源链接。${note ? ` ${note}` : ''}`,
  }
}

export const agriAidImageSources: Record<string, AgriAidEventImage> = {
  '2023-company-founded': userMaterial('十个勤天农业发展公司成立', '2023-company-founded.webp'),
  '2023-jinyun-live': sourcedPhoto('缙云直播助农', '/assets/agri-aid/events/2023-jinyun-live.webp', references.jinyun),
  '2023-xishuangbanna-live': userMaterial('西双版纳直播助农', '2023-xishuangbanna-live.webp'),
  '2023-mid-autumn-live': userMaterial('中秋节直播助农', '2023-mid-autumn-live.webp'),
  '2023-northeast-live': userMaterial('东北直播助农', '2023-northeast-live.webp'),
  '2024-tengger-trees': userMaterial('腾格里沙漠种梭梭树', '2024-tengger-tree.webp'),
  '2024-minqin-ginseng-fruit': userMaterial('民勤直播助农销售人参果', '2024-minqin-ginseng-fruit.webp'),
  '2024-tongnan-pepper': userMaterial('重庆潼南收购农户滞销二荆条', '2024-tongnan-pepper.webp'),
  '2024-jiande-strawberry': userMaterial('建德收购农户草莓', '2024-jiande-strawberry.webp'),
  '2024-xuyi-crayfish': userMaterial('盱眙帮助养殖户销售龙虾', '2024-xuyi-crayfish.webp', '来源页为盱眙县政府同地区同品类报道。'),
  '2024-ainong-day': userMaterial('爱侬日直播助农', '2024-ainong-day.webp'),
  '2024-food-donation': userMaterial('赵小童向环卫工人捐赠食品', '2024-cleaner-donation.webp'),
  '2024-autumn-live': userMaterial('晒秋日直播助农', '2024-shaiqiu-live.webp'),
  '2024-ningxiang-pig': userMaterial('帮助宁乡花猪拓展销售渠道', '2024-ningxiang-pig.webp'),
  '2025-linkou-soap': userMaterial('林口带村民出售手工沙棘皂', '2025-linkou-soap.webp'),
  '2025-rikaze-clothes': sourcedPhoto('向日喀则灾区捐赠冬衣', '/assets/agri-aid/events/2025-rikaze-relief.webp', references.rikaze, 'contextual', '该图来自同批次日喀则救援物资报道。'),
  '2025-youth-foundation': userMaterial('赵小童向青少年基金会捐款', '2025-lihao-donation.webp', '暂以公益捐赠资料图呈现，等待补充该事件独立照片。'),
  '2025-niangla-greenhouse': userMaterial('娘拉乡帮建水培大棚', '2025-xiangqian-turnip.webp', '暂以囊谦产业帮扶资料图呈现。'),
  '2025-nangqian-live': userMaterial('囊谦芫根助农推广直播', '2025-xiangqian-turnip.webp'),
  '2025-jiande-strawberry-again': userMaterial('建德再次收购农户滞销草莓', '2025-jiande-return.webp'),
  '2025-nangqian-salt': sourcedPhoto('帮助囊谦盐农打开销路', '/assets/agri-aid/events/2025-nangqian-saltfield.webp', references.nangqianSalt, 'contextual'),
  '2025-ainong-day': userMaterial('爱侬日直播助农', '2025-ainong-day.webp'),
  '2025-jiang-minqin-donation': userMaterial('蒋敦豪向民勤捐款', '2025-minqin-donation.webp'),
  '2025-zxt-school-field': userMaterial('赵小童为囊谦藏医学校翻新操场', '2025-school-playground.webp'),
  '2025-zxt-water-truck': userMaterial('赵小童向民勤捐赠洒水车', '2025-water-truck.webp'),
  '2025-autumn-nangqian-result': userMaterial('囊谦特色产品销售额1060.2万元', '2025-shaiqiu-result.webp'),
  '2025-lihao-aide-donation': userMaterial('李昊向爱德基金会捐款', '2025-lihao-donation.webp'),
  '2026-zxt-linyi-donation': userMaterial('赵小童向临沂基金会捐款并捐赠水彩笔', '2026-linyi-donation.webp'),
  '2026-lihao-yangfan': userMaterial('李昊向扬帆计划捐赠', '2026-yangfan-donation.webp'),
  '2026-hhn-books': userMaterial('何浩楠向河北小学捐赠图书', '2026-books-donation.webp'),
  '2026-motuo-live': userMaterial('墨脱推荐会直播推广特色产品', '2026-motuo-live.webp'),
  '2026-taklamakan-rose': userMaterial('塔克拉玛干沙漠种沙漠玫瑰', '2026-desert-rose.webp'),
  '2026-zyb-farm-machine': userMaterial('赵一博向民勤捐赠四轮打坑机', '2026-minqin-machine.webp'),
  '2026-minqin-water': userMaterial('禾伙人向民勤相关基地捐赠苏打水', '2025-water-truck.webp', '暂以同地区水资源帮扶资料图呈现。'),
  '2026-qiele-jujube-live': sourcedPhoto('策勒助农直播红枣18万单', '/assets/agri-aid/events/2026-qiele-jujube-live.webp', references.qiele, 'exact'),
  '2026-qiele-fans': sourcedPhoto('策勒助农直播禾伙人购买18万单', '/assets/agri-aid/events/2026-qiele-orchard.webp', references.qiele, 'contextual', '与上一节点属于同一场策勒直播，使用产地果园资料图。'),
}

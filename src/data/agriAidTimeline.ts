import { agriAidImageSources, type AgriAidEventImage } from './agriAidImageSources'

export type AidBoardYear = '2023' | '2024' | '2025' | '2026'

export type AidBoardCategory =
  | '产业起点'
  | '直播助农'
  | '应急收购'
  | '公益捐赠'
  | '生态公益'
  | '产业帮扶'
  | '地方推广'
  | '个人公益'
  | '重点成果'
  | '长期回访'
  | '产品深加工'
  | '社会认可'

export type AidEventIcon =
  | 'company'
  | 'live'
  | 'farmProduct'
  | 'donation'
  | 'tree'
  | 'truck'
  | 'school'
  | 'book'
  | 'strawberry'
  | 'pepper'
  | 'crayfish'
  | 'pig'
  | 'jujube'
  | 'soap'
  | 'map'
  | 'award'
  | 'industry'
  | 'archive'
  | 'milestone'
  | 'review'
  | 'salt'
  | 'clothes'
  | 'sportsField'
  | 'farmMachine'
  | 'flower'
  | 'greenhouse'

export type AidBoardEvent = {
  id: string
  year: AidBoardYear
  date: string
  title: string
  category: AidBoardCategory
  summary: string
  detail?: string
  location?: string
  icon: AidEventIcon
  importance?: 'normal' | 'major' | 'milestone'
  tags?: string[]
  pendingConfirm?: boolean
  image: AgriAidEventImage
}

type AidBoardEventDraft = Omit<AidBoardEvent, 'image'>

export type AidRegionResult = {
  id: string
  region: string
  result: string
  type: string
  icon: AidEventIcon
}

export type AidModeCard = {
  id: string
  mode: string
  description: string
  example: string
  icon: AidEventIcon
}

export type AidDonationRecord = {
  id: string
  date: string
  text: string
}

export type AidRecognitionCard = {
  id: string
  title: string
  content: string
  icon: AidEventIcon
}

export type AidArchiveImage = {
  id: string
  title: string
  description: string
  image: string
  type: '时间线' | '成果图' | '模式总结' | '公益资料' | '传播记录'
  yearRange?: string
}

export const aidBoardYears = ['全部', '2023', '2024', '2025', '2026'] as const

export const aidBoardCategories = [
  '全部',
  '产业起点',
  '直播助农',
  '应急收购',
  '公益捐赠',
  '生态公益',
  '产业帮扶',
  '地方推广',
  '个人公益',
  '重点成果',
  '长期回访',
  '产品深加工',
] as const

export const aidBoardYearLabels: Record<AidBoardYear, string> = {
  '2023': '从土地出发',
  '2024': '多地助农扩展',
  '2025': '公益与产业并行',
  '2026': '行动仍在继续',
}

const aidBoardEventDrafts: AidBoardEventDraft[] = [
  {
    id: '2023-company-founded',
    year: '2023',
    date: '2023.02.21',
    title: '十个勤天农业发展公司成立',
    category: '产业起点',
    summary: '十个勤天（杭州）农业发展有限责任公司成立，助农行动有了更长期的承载主体。',
    detail: '从节目里的土地实践延伸到长期农业连接，后续直播助农、地方合作和产业帮扶都可以围绕这一主体持续沉淀。',
    location: '杭州',
    icon: 'company',
    importance: 'milestone',
    tags: ['农业发展', '助农起点', '长期陪伴'],
  },
  {
    id: '2023-jinyun-live',
    year: '2023',
    date: '2023.08.08',
    title: '缙云直播助农',
    category: '直播助农',
    summary: '通过直播助农帮助地方农产品获得更多关注和销售机会。',
    detail: '让粉丝参与从观看走向购买，帮助地方特产获得更直接的曝光与销售入口。',
    location: '缙云',
    icon: 'live',
    importance: 'normal',
    tags: ['直播助农', '地方农产'],
  },
  {
    id: '2023-xishuangbanna-live',
    year: '2023',
    date: '2023.08.31',
    title: '西双版纳直播助农',
    category: '直播助农',
    summary: '以直播形式推广西双版纳相关农产品，让更多地方特色被看见。',
    detail: '通过地域主题直播，把农产品、产地故事和成员参与连接起来，增强助农内容的可持续性。',
    location: '西双版纳',
    icon: 'farmProduct',
    importance: 'normal',
    tags: ['直播助农', '地方推广'],
  },
  {
    id: '2023-mid-autumn-live',
    year: '2023',
    date: '2023.09.25',
    title: '中秋节直播助农',
    category: '直播助农',
    summary: '借助中秋节节点开展直播助农，推动节令农产品销售。',
    detail: '节日节点适合做礼盒、家庭消费和地方风物表达，也让助农行动更容易被大众理解和参与。',
    icon: 'live',
    importance: 'normal',
    tags: ['中秋节', '直播助农'],
  },
  {
    id: '2023-northeast-live',
    year: '2023',
    date: '2023.10.26',
    title: '东北直播助农',
    category: '直播助农',
    summary: '推广东北地区农产品，助农足迹继续向更多地区扩展。',
    detail: '这一节点展示了助农行动不是一次性内容，而是可以持续覆盖不同产区与不同品类。',
    location: '东北',
    icon: 'farmProduct',
    importance: 'normal',
    tags: ['东北', '直播助农'],
  },
  {
    id: '2024-tengger-trees',
    year: '2024',
    date: '2024.03.12',
    title: '腾格里沙漠种梭梭树',
    category: '生态公益',
    summary: '在腾格里沙漠种下 18 万棵梭梭树，把助农行动与生态治理结合。',
    detail: '生态行动回应了土地、水源、风沙与长期生产环境之间的关系，是助农行动里“守护土地”的延伸。',
    location: '腾格里沙漠',
    icon: 'tree',
    importance: 'major',
    tags: ['生态公益', '梭梭树', '沙漠治理'],
  },
  {
    id: '2024-minqin-ginseng-fruit',
    year: '2024',
    date: '2024.03.12',
    title: '民勤直播助农，销售人参果',
    category: '直播助农',
    summary: '通过直播帮助民勤人参果扩大销售和关注。',
    detail: '民勤样本把直播助农、地方合作和长期回访连接在一起，成为后续可复用的助农路径之一。',
    location: '民勤',
    icon: 'farmProduct',
    importance: 'normal',
    tags: ['民勤', '人参果', '直播助农'],
  },
  {
    id: '2024-tongnan-pepper',
    year: '2024',
    date: '2024.04.20',
    title: '重庆潼南收购农户滞销二荆条',
    category: '应急收购',
    summary: '收购农户滞销二荆条，帮助缓解销售压力并支持销售推广。',
    detail: '这类事件更接近产业帮扶：不是只做曝光，而是参与到农户产品的销售压力与流通问题中。',
    location: '重庆潼南',
    icon: 'pepper',
    importance: 'major',
    tags: ['应急收购', '二荆条', '重庆潼南'],
  },
  {
    id: '2024-jiande-strawberry',
    year: '2024',
    date: '2024.04.26',
    title: '建德收购农户草莓',
    category: '应急收购',
    summary: '收购农户草莓，帮助当地农产品打开销售通路。',
    detail: '鲜果销售对时间窗口要求高，收购和推广能在关键节点帮助农户降低损耗。',
    location: '建德',
    icon: 'strawberry',
    importance: 'normal',
    tags: ['应急收购', '草莓', '建德'],
  },
  {
    id: '2024-xuyi-crayfish',
    year: '2024',
    date: '2024.05.10',
    title: '盱眙帮助养殖户销售龙虾',
    category: '应急收购',
    summary: '帮助养殖户销售龙虾，拓展销售渠道。',
    detail: '助农品类从水果、地方特产延展到水产，让行动模型更完整。',
    location: '盱眙',
    icon: 'crayfish',
    importance: 'normal',
    tags: ['龙虾', '盱眙', '助销'],
  },
  {
    id: '2024-ainong-day',
    year: '2024',
    date: '2024.05.18',
    title: '爱侬日直播助农',
    category: '直播助农',
    summary: '通过爱侬日直播助农活动，持续推动公益助农传播。',
    detail: '固定主题日可以让粉丝形成记忆，也利于后续把助农活动沉淀成长期栏目。',
    icon: 'live',
    importance: 'normal',
    tags: ['爱侬日', '直播助农'],
  },
  {
    id: '2024-food-donation',
    year: '2024',
    date: '2024.05.24',
    title: '赵小童向环卫工人捐赠食品',
    category: '公益捐赠',
    summary: '赵小童向环卫工人捐赠 100 箱食品，把公益善意落到具体人群。',
    detail: '公益捐赠作为助农板块的一部分，记录的是成员把公共关注转化为具体善意的路径。',
    icon: 'donation',
    importance: 'major',
    tags: ['赵小童', '环卫工人', '100箱食品'],
  },
  {
    id: '2024-autumn-live',
    year: '2024',
    date: '2024.10.28',
    title: '晒秋日直播助农',
    category: '直播助农',
    summary: '通过晒秋日直播助农，推广秋收季农产品。',
    detail: '晒秋是农事和乡土生活中的鲜明符号，用它组织直播内容，更贴近田野手册的表达。',
    icon: 'live',
    importance: 'normal',
    tags: ['晒秋日', '直播助农', '秋收'],
  },
  {
    id: '2024-ningxiang-pig',
    year: '2024',
    date: '2024.12.23',
    title: '帮助宁乡花猪拓展销售渠道',
    category: '产业帮扶',
    summary: '帮助宁乡花猪拓展销售渠道，让优质地方农产品被更多人看见。',
    detail: '这一类事件体现“卖出一次”之外的价值：帮助地方产品被更多渠道认识和承接。',
    location: '宁乡',
    icon: 'pig',
    importance: 'normal',
    tags: ['宁乡花猪', '销售渠道', '产业帮扶'],
  },
  {
    id: '2025-linkou-soap',
    year: '2025',
    date: '2025.01.01',
    title: '林口带村民出售手工沙棘皂',
    category: '产品深加工',
    summary: '帮助村民销售手工沙棘皂，推动地方农产品从原料走向深加工产品。',
    detail: '从原料到手工产品，深加工可以提升地方产品附加值，也让助农不只停留在初级农产品销售。',
    location: '黑龙江林口',
    icon: 'soap',
    importance: 'normal',
    tags: ['林口', '沙棘皂', '产品深加工'],
  },
  {
    id: '2025-rikaze-clothes',
    year: '2025',
    date: '2025.01.08',
    title: '向日喀则灾区捐赠冬衣',
    category: '公益捐赠',
    summary: '十个勤天向日喀则灾区捐赠冬衣，总价值 458 万余元。',
    detail: '灾区捐赠强调及时性和实用性，属于助农公益记录中重要的应急行动。',
    location: '日喀则',
    icon: 'clothes',
    importance: 'milestone',
    tags: ['日喀则', '冬衣', '458万余元'],
  },
  {
    id: '2025-youth-foundation',
    year: '2025',
    date: '2025.02.05',
    title: '赵小童向青少年基金会捐款',
    category: '个人公益',
    summary: '赵小童向青少年基金会捐款，具体金额待进一步确认。',
    detail: '待补充公开来源后，可以继续完善金额、用途和后续反馈。',
    icon: 'donation',
    importance: 'normal',
    tags: ['赵小童', '青少年基金会'],
    pendingConfirm: true,
  },
  {
    id: '2025-niangla-greenhouse',
    year: '2025',
    date: '2025.03.10',
    title: '娘拉乡帮建水培大棚',
    category: '产业帮扶',
    summary: '帮助娘拉乡建设水培大棚，推动当地产业基础建设。',
    detail: '该事件资料待继续核验，当前保留为产业帮扶线索节点。',
    location: '娘拉乡',
    icon: 'greenhouse',
    importance: 'normal',
    tags: ['水培大棚', '产业帮扶'],
    pendingConfirm: true,
  },
  {
    id: '2025-nangqian-live',
    year: '2025',
    date: '2025.03.11',
    title: '囊谦芫根助农推广直播',
    category: '直播助农',
    summary: '囊谦芫根助农推广直播，单平台近 200 万人次观看，销售额超 190 万元。',
    detail: '该事件体现直播助农的传播力：产地故事、成员参与和平台流量共同推动产品被看见。',
    location: '青海囊谦',
    icon: 'live',
    importance: 'milestone',
    tags: ['囊谦', '芫根', '190万元', '直播助农'],
  },
  {
    id: '2025-jiande-strawberry-again',
    year: '2025',
    date: '2025.04.21',
    title: '建德再次收购农户滞销草莓',
    category: '长期回访',
    summary: '再次收购建德农户滞销草莓，体现对帮扶地区的持续关注。',
    detail: '长期回访让助农行动不只是一次事件，而是能持续追踪产区需求和后续结果。',
    location: '建德',
    icon: 'strawberry',
    importance: 'normal',
    tags: ['建德', '草莓', '长期回访'],
  },
  {
    id: '2025-nangqian-salt',
    year: '2025',
    date: '2025.04.25',
    title: '帮助囊谦盐农打开销路',
    category: '产业帮扶',
    summary: '帮助囊谦盐农打开销路，让地方特色产业获得更多销售机会。',
    detail: '地方合作强调对产地实际问题的理解：谁在生产、产品如何流通、需要什么样的持续支持。',
    location: '青海囊谦',
    icon: 'salt',
    importance: 'normal',
    tags: ['囊谦', '盐农', '产业帮扶'],
  },
  {
    id: '2025-ainong-day',
    year: '2025',
    date: '2025.05.18',
    title: '爱侬日直播助农',
    category: '直播助农',
    summary: '持续开展爱侬日直播助农，延续公益助农行动。',
    detail: '同一主题的延续意味着助农内容开始拥有固定节奏，便于后续形成年份记录。',
    icon: 'live',
    importance: 'normal',
    tags: ['爱侬日', '直播助农'],
  },
  {
    id: '2025-jiang-minqin-donation',
    year: '2025',
    date: '2025.05.31',
    title: '蒋敦豪向民勤捐款 30 万元',
    category: '个人公益',
    summary: '蒋敦豪向民勤捐款 30 万元，用实际行动支持地方公益与乡村发展。',
    detail: '个人捐赠与地区回访共同构成助农记录里的长期陪伴维度。',
    location: '民勤',
    icon: 'donation',
    importance: 'major',
    tags: ['蒋敦豪', '民勤', '30万元'],
  },
  {
    id: '2025-zxt-school-field',
    year: '2025',
    date: '2025.07.01',
    title: '赵小童为囊谦藏医学校翻新操场',
    category: '公益捐赠',
    summary: '赵小童为囊谦藏医学校翻新操场，支持当地教育环境改善。',
    detail: '助农公益不只围绕产品，也包括地方公共空间、教育场景和基础生活条件。',
    location: '青海囊谦',
    icon: 'sportsField',
    importance: 'major',
    tags: ['赵小童', '囊谦', '学校操场'],
  },
  {
    id: '2025-zxt-water-truck',
    year: '2025',
    date: '2025.10.04',
    title: '赵小童向民勤捐赠洒水车',
    category: '公益捐赠',
    summary: '赵小童向民勤捐赠洒水车，持续支持民勤生态与农业相关工作。',
    detail: '这类公益更贴近日常生产生活，适合被记录为地方长期陪伴的一部分。',
    location: '民勤',
    icon: 'truck',
    importance: 'major',
    tags: ['赵小童', '民勤', '洒水车'],
  },
  {
    id: '2025-autumn-nangqian-result',
    year: '2025',
    date: '2025.10.28',
    title: '晒秋日直播助农，囊谦特色产品销售额 1060.2 万元',
    category: '重点成果',
    summary: '晒秋日直播助农推广囊谦特色产品，总销售额达 1060.2 万元。',
    detail: '把地方特色产品、主题节点和直播助农连接起来，形成较清晰的年度成果样本。',
    location: '青海囊谦',
    icon: 'farmProduct',
    importance: 'milestone',
    tags: ['囊谦', '晒秋日', '1060.2万元'],
  },
  {
    id: '2025-lihao-aide-donation',
    year: '2025',
    date: '2025.11.28',
    title: '李昊向爱德基金会捐款 60 万元',
    category: '个人公益',
    summary: '李昊向爱德基金会捐款 60 万元，支持公益项目持续开展。',
    detail: '成员个人公益行为与团队助农行动一起构成网站长期记录的一部分。',
    icon: 'donation',
    importance: 'major',
    tags: ['李昊', '爱德基金会', '60万元'],
  },
  {
    id: '2026-zxt-linyi-donation',
    year: '2026',
    date: '2026.01.27',
    title: '赵小童向临沂基金会捐款并捐赠水彩笔',
    category: '个人公益',
    summary: '赵小童向临沂基金会捐款 77 万元，并捐赠水彩笔 11 万元。',
    detail: '这条记录把资金支持与具体物资支持结合起来，更容易对应到地方公益场景。',
    location: '临沂',
    icon: 'donation',
    importance: 'major',
    tags: ['赵小童', '临沂基金会', '77万元', '水彩笔11万元'],
  },
  {
    id: '2026-lihao-yangfan',
    year: '2026',
    date: '2026.02.02',
    title: '李昊向扬帆计划捐赠 361616 元',
    category: '个人公益',
    summary: '李昊向扬帆计划捐赠 361616 元，支持公益项目。',
    detail: '公益捐赠记录会继续以来源、金额、用途和后续反馈为维度维护。',
    icon: 'donation',
    importance: 'major',
    tags: ['李昊', '扬帆计划', '361616元'],
  },
  {
    id: '2026-hhn-books',
    year: '2026',
    date: '2026.03.04',
    title: '何浩楠向河北小学捐赠图书',
    category: '公益捐赠',
    summary: '何浩楠向河北小学捐赠图书，支持乡村教育阅读资源建设。',
    detail: '图书捐赠属于低调但可持续影响的公益行动，适合在资料库中持续追踪反馈。',
    location: '河北',
    icon: 'book',
    importance: 'normal',
    tags: ['何浩楠', '河北小学', '图书捐赠'],
  },
  {
    id: '2026-motuo-live',
    year: '2026',
    date: '2026.03.12',
    title: '墨脱推荐会直播推广特色产品',
    category: '地方推广',
    summary: '墨脱推荐会直播推广香蕉、香橼、石斛、高山茶等特色产品，帮助扩大地方产品影响力。',
    detail: '墨脱推荐会更像地方产品专题，用一组产品建立对产地风物的系统认识。',
    location: '西藏墨脱',
    icon: 'farmProduct',
    importance: 'major',
    tags: ['墨脱', '香蕉', '香橼', '石斛', '高山茶'],
  },
  {
    id: '2026-taklamakan-rose',
    year: '2026',
    date: '2026.03.25',
    title: '塔克拉玛干沙漠种沙漠玫瑰',
    category: '生态公益',
    summary: '在塔克拉玛干沙漠种植沙漠玫瑰，将公益行动与生态关注结合。',
    detail: '生态行动在助农板块里承担土地修复和长期环境关注的叙事功能。',
    location: '塔克拉玛干沙漠',
    icon: 'flower',
    importance: 'normal',
    tags: ['沙漠玫瑰', '生态公益'],
  },
  {
    id: '2026-zyb-farm-machine',
    year: '2026',
    date: '2026.04.06',
    title: '赵一博向民勤捐赠四轮打坑机',
    category: '公益捐赠',
    summary: '赵一博向民勤捐赠四轮打坑机，支持当地生态种植和农业作业。',
    detail: '工具类捐赠与土地作业直接相关，能更具体地回应产地真实需求。',
    location: '民勤',
    icon: 'farmMachine',
    importance: 'major',
    tags: ['赵一博', '民勤', '四轮打坑机'],
  },
  {
    id: '2026-minqin-water',
    year: '2026',
    date: '2026.04.07',
    title: '禾伙人向民勤相关基地捐赠苏打水',
    category: '公益捐赠',
    summary: '禾伙人向民勤相关基地捐赠八千多箱苏打水，具体基地名称待确认。',
    detail: '该信息仍需补充公开来源和基地名称，当前以待确认状态保留。',
    location: '民勤',
    icon: 'donation',
    importance: 'normal',
    tags: ['禾伙人', '民勤', '苏打水'],
    pendingConfirm: true,
  },
  {
    id: '2026-qiele-jujube-live',
    year: '2026',
    date: '2026.04.11',
    title: '策勒助农直播，1小时卖出红枣18万单',
    category: '重点成果',
    summary: '策勒助农直播 1 小时卖出红枣 18 万单、90 吨，销售额破 500 万元。',
    detail: '这个节点适合作为直播助农转化样本记录：短时间内形成订单、吨数和销售额的综合结果。',
    location: '策勒',
    icon: 'jujube',
    importance: 'milestone',
    tags: ['策勒', '红枣', '18万单', '90吨', '500万元'],
  },
  {
    id: '2026-qiele-fans',
    year: '2026',
    date: '2026.04.11',
    title: '策勒助农直播，禾伙人购买18万单',
    category: '直播助农',
    summary: '策勒助农直播中，禾伙人购买 18 万单，助力地方农产品销售。',
    detail: '粉丝参与让助农从“看见”走向“购买支持”，也是社区陪伴感的一部分。',
    location: '策勒',
    icon: 'live',
    importance: 'major',
    tags: ['禾伙人', '策勒', '红枣', '直播助农'],
  },
]

export const aidBoardEvents: AidBoardEvent[] = aidBoardEventDrafts.map((event) => ({
  ...event,
  image: agriAidImageSources[event.id] ?? {
    alt: `${event.title}图片待补充`,
    sourceType: 'placeholder',
    matchLevel: 'placeholder',
    usageStatus: 'pending',
    note: '该事件尚未建立图片来源记录。',
  },
}))

export const aidRegionResults: AidRegionResult[] = [
  { id: 'minqin-tree', region: '甘肃民勤', result: '种 18 万棵梭梭树，占地约 500 亩；带动“请到民勤种棵树”，截至 2026 年 5 月，线上报名超 5 万人，累计 4.6 万人次参与，完成公益造林 1.5 万亩。', type: '生态公益', icon: 'tree' },
  { id: 'minqin-return', region: '甘肃民勤', result: '蒋敦豪捐款 30 万元；赵小童捐赠洒水车；赵一博捐赠四轮打坑机。', type: '持续回访', icon: 'farmMachine' },
  { id: 'nangqian-live', region: '青海囊谦', result: '芫根直播销售额超 190 万元；直接带动就业 46 人，发放工资 110 余万元，分红 30 万元。', type: '产业帮扶', icon: 'farmProduct' },
  { id: 'nangqian-material', region: '青海囊谦', result: '收购芫根原材料 216 余万元；间接带动就业 1267 人，实现约 1.2 万农牧民增收。', type: '产业帮扶', icon: 'farmProduct' },
  { id: 'salt-income', region: '白扎茶哈村盐场', result: '129 户盐农平均每户增收 2—3 万元；盐场整体投资约 300 余万元。', type: '地方产业', icon: 'salt' },
  { id: 'salt-tourism', region: '白扎茶哈村盐场', result: '形成“夏季文旅观光 + 冬季古法采盐”双季联动。', type: '文旅助农', icon: 'salt' },
  { id: 'motuo-products', region: '西藏墨脱', result: '推荐会直播推广香蕉、香橼、石斛、高山茶等，帮助扩大特色产品影响力。', type: '地方推广', icon: 'farmProduct' },
  { id: 'qiele-jujube', region: '新疆策勒', result: '1 小时售出 18 万单红枣，90 吨，销售额破 500 万元。', type: '直播助农', icon: 'jujube' },
  { id: 'linkou-soap', region: '黑龙江林口', result: '年产 27 万块沙棘皂，带动农村妇女就业。', type: '产品深加工', icon: 'soap' },
  { id: 'jiande-strawberry', region: '建德草莓', result: '鲜甜走俏，助农增收。', type: '应急收购', icon: 'strawberry' },
  { id: 'tongnan-pepper', region: '潼南二荆条', result: '香辣出圈，销量增长。', type: '农产品推广', icon: 'pepper' },
  { id: 'xuyi-crayfish', region: '盱眙龙虾', result: '线上线下双轮热销。', type: '农产品推广', icon: 'crayfish' },
  { id: 'ningxiang-pig', region: '宁乡花猪', result: '优质土猪受欢迎。', type: '农产品推广', icon: 'pig' },
  { id: 'nujiang-apple', region: '怒江苹果', result: '5.2 万斤爱心助销。', type: '爱心助销', icon: 'farmProduct' },
  { id: 'huzhu-potato', region: '互助土豆', result: '37 吨助农直发。', type: '爱心助销', icon: 'farmProduct' },
]

export const aidModeCards: AidModeCard[] = [
  { id: 'mode-live', mode: '零佣金直播助农', description: '公益直播不抽取农户佣金，产品和收益直接归属农户。', example: '策勒红枣、囊谦芫根、爱侬日、晒秋日。', icon: 'live' },
  { id: 'mode-purchase', mode: '应急收购', description: '针对销售压力，直接收购或帮助拓宽渠道。', example: '建德草莓、盱眙龙虾、潼南二荆条。', icon: 'farmProduct' },
  { id: 'mode-industry', mode: '产业帮扶', description: '帮助建设产业基础和后续销售渠道。', example: '囊谦水培大棚、浓缩颗粒车间、盐田提质改造。', icon: 'greenhouse' },
  { id: 'mode-processing', mode: '产品深加工', description: '帮助地方开发新产品，提高附加值。', example: '林口沙棘皂、囊谦芫根饮料、红盐衍生品。', icon: 'soap' },
  { id: 'mode-eco', mode: '生态公益', description: '将助农与生态治理结合。', example: '民勤梭梭树、塔克拉玛干沙漠玫瑰。', icon: 'tree' },
  { id: 'mode-donation', mode: '个人公益捐赠', description: '成员以个人名义捐款或捐物。', example: '蒋敦豪 30 万元、赵小童 77 万元、李昊 60 万元、何浩楠捐赠图书。', icon: 'donation' },
  { id: 'mode-review', mode: '长期回访', description: '对帮扶过的地区持续关注和二次支持。', example: '民勤设备捐赠、囊谦持续推广、建德二次收购草莓。', icon: 'map' },
]

export const aidDonationRecords: AidDonationRecord[] = [
  { id: 'donation-20240524', date: '2024.05.24', text: '赵小童向环卫工人捐赠 100 箱食品。' },
  { id: 'donation-20250108', date: '2025.01.08', text: '十个勤天向日喀则灾区捐赠冬衣，总价值 458 万余元。' },
  { id: 'donation-20250531', date: '2025.05.31', text: '蒋敦豪向民勤捐款 30 万元。' },
  { id: 'donation-20250701', date: '2025.07.01', text: '赵小童为囊谦藏医学校翻新操场。' },
  { id: 'donation-20251004', date: '2025.10.04', text: '赵小童向民勤捐赠洒水车。' },
  { id: 'donation-20251128', date: '2025.11.28', text: '李昊向爱德基金会捐款 60 万元。' },
  { id: 'donation-20260127', date: '2026.01.27', text: '赵小童向临沂基金会捐款 77 万元，并捐赠水彩笔 11 万元。' },
  { id: 'donation-20260202', date: '2026.02.02', text: '李昊向扬帆计划捐赠 361616 元。' },
  { id: 'donation-20260304', date: '2026.03.04', text: '何浩楠向河北小学捐赠图书。' },
  { id: 'donation-20260406', date: '2026.04.06', text: '赵一博向民勤捐赠四轮打坑机。' },
]

export const aidRecognitionCards: AidRecognitionCard[] = [
  { id: 'recognition-official', title: '官方认可', content: '获联合国粮农组织感谢信，感谢参与世界粮食日推广活动。', icon: 'award' },
  { id: 'recognition-media', title: '媒体报道', content: '青海省人民政府官网、甘肃民勤县人民政府官网、《人民日报》等进行正面报道。', icon: 'map' },
  { id: 'recognition-awards', title: '荣誉奖项', content: '获“微博年度公益口碑人物”“年度综艺团体”等荣誉。', icon: 'award' },
  { id: 'recognition-cctv', title: '央视相关', content: '连续两年登上中央广播电视总台春节联欢晚会。', icon: 'award' },
  { id: 'recognition-impact', title: '传播影响', content: '在囊谦直播后，微博主榜热搜 4 次，文娱热搜 5 次，相关话题阅读量近 2000 万次，“囊谦”词条微信指数上涨。', icon: 'award' },
  { id: 'recognition-model', title: '模式价值', content: '证明“综艺 IP + 助农公益 + 产业陪伴”模式具有可行性，让地方农产品、乡村故事和农户需求被更多人看见。', icon: 'map' },
]

export const aidRecognitionSummary = [
  { title: '公益助农', text: '用行动传递温暖，让丰收更有意义。' },
  { title: '媒体关注', text: '记录乡村故事，传递助农力量。' },
  { title: '乡村振兴', text: '携手共创美好生活，共绘乡村新未来。' },
]

export const aidArchiveImages: AidArchiveImage[] = [
  { id: 'timeline-2023-2024', title: '助农行动时间线', description: '完整长图资料存档，保留原始资料阅读入口。', image: '/images/agri-aid/timeline-2023-2024.jpg', type: '时间线', yearRange: '2023 - 2024' },
  { id: 'timeline-2025-2026', title: '助农行动时间线', description: '后续年份的完整资料图，集中放在图册中查看。', image: '/images/agri-aid/timeline-2025-2026.jpg', type: '时间线', yearRange: '2025 - 2026' },
  { id: 'results', title: '重点成果记录', description: '用于核对地区成果、公益反馈和阶段性总结。', image: '/images/agri-aid/results.jpg', type: '成果图' },
  { id: 'models', title: '助农模式总结', description: '整理直播助农、产业帮扶和公益行动之间的协作方式。', image: '/images/agri-aid/models.jpg', type: '模式总结' },
  { id: 'donation', title: '公益捐赠资料', description: '集中保存捐赠相关资料，避免散落在事件卡片中。', image: '/images/agri-aid/donation.jpg', type: '公益资料' },
  { id: 'media-impact', title: '传播影响记录', description: '保存对外传播和内容扩散相关资料。', image: '/images/agri-aid/media-impact.jpg', type: '传播记录' },
]

export interface EventAnnouncement {
  id: string
  title: string
  publishedAt: string
  summary: string
  locations: string[]
  sourceLabel: string
  sourceUrl: string
}

export const eventAnnouncements: EventAnnouncement[] = [
  {
    id: 'jiangdunhao-national-tour-five-cities-2026',
    title: '蒋敦豪「你来啦」全国巡回演唱会官宣五城',
    publishedAt: '2026-07-15',
    summary: '北京、杭州、广州、南京、成都五城已经官宣，具体场馆、日期和开票安排尚未公布。',
    locations: ['北京', '杭州', '广州', '南京', '成都'],
    sourceLabel: '种地吧蒋敦豪 / 蒋敦豪 Official',
    sourceUrl: 'https://www.sina.cn/news/detail/5320909525092748.html',
  },
]

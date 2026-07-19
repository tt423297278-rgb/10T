export type FanVisualTheme =
  | 'home-field'
  | 'people-wheat'
  | 'event-wildflower'
  | 'aid-seedling'
  | 'canteen-harvest'
  | 'memory-film'

export interface FanHomeDecor {
  eyebrow: string
  title: string
  note: string
  stickerIndexes: [number, number, number]
  visualTheme: FanVisualTheme
}

interface FanHomeDecorRoute {
  path: string
  decor: FanHomeDecor
}

const defaultDecor: FanHomeDecor = {
  eyebrow: '家禾手账',
  title: '今天也在一起',
  note: '慢慢翻，喜欢的每一页都有人陪你记住。',
  stickerIndexes: [0, 4, 8],
  visualTheme: 'home-field',
}

const routeDecor: FanHomeDecorRoute[] = [
  {
    path: '/members',
    decor: {
      visualTheme: 'people-wheat',
      eyebrow: '十人小队',
      title: '十个人，一起长成',
      note: '从一号房到十号房，每个人都有一页自己的故事。',
      stickerIndexes: [1, 5, 9],
    },
  },
  {
    path: '/events',
    decor: {
      visualTheme: 'event-wildflower',
      eyebrow: '见面日历',
      title: '不落下每一次见面',
      note: '把期待写进日历，也把见面后的快乐好好收起来。',
      stickerIndexes: [0, 3, 7],
    },
  },
  {
    path: '/agri-aid',
    decor: {
      visualTheme: 'aid-seedling',
      eyebrow: '土地来信',
      title: '把喜欢落到土地上',
      note: '认真看见每一份劳动，也把支持送到真正需要的地方。',
      stickerIndexes: [2, 6, 9],
    },
  },
  {
    path: '/canteen',
    decor: {
      visualTheme: 'canteen-harvest',
      eyebrow: '开饭小队',
      title: '一起去吃饭吧',
      note: '选一座城，翻一张饭签，今天也要好好吃饭。',
      stickerIndexes: [1, 4, 8],
    },
  },
  {
    path: '/check-in',
    decor: {
      visualTheme: 'aid-seedling',
      eyebrow: '今日到场',
      title: '你来啦，盖个章吧',
      note: '平凡的一天也值得留下记号，我们慢慢攒成一片麦田。',
      stickerIndexes: [0, 5, 6],
    },
  },
  {
    path: '/community',
    decor: {
      visualTheme: 'event-wildflower',
      eyebrow: '家禾客厅',
      title: '这里都是家禾',
      note: '想说的话放在这里，友好一点，真诚一点。',
      stickerIndexes: [3, 7, 9],
    },
  },
  {
    path: '/moments',
    decor: {
      visualTheme: 'memory-film',
      eyebrow: '快乐存档',
      title: '好笑的都要记下来',
      note: '名场面不只用来重温，也是在一起走过的证据。',
      stickerIndexes: [2, 5, 8],
    },
  },
  {
    path: '/gallery',
    decor: {
      visualTheme: 'memory-film',
      eyebrow: '影像抽屉',
      title: '把这一刻留住',
      note: '照片会褪色，喜欢和陪伴不会。',
      stickerIndexes: [1, 6, 7],
    },
  },
  {
    path: '/updates',
    decor: {
      visualTheme: 'memory-film',
      eyebrow: '田边通讯',
      title: '蹲一个新消息',
      note: '公开信息认真核对，没确认的事先不着急。',
      stickerIndexes: [0, 4, 9],
    },
  },
  {
    path: '/about',
    decor: {
      visualTheme: 'people-wheat',
      eyebrow: '小家说明',
      title: '一起把这里照顾好',
      note: '这是粉丝共同维护的手账，不是官方站点。',
      stickerIndexes: [2, 4, 6],
    },
  },
  {
    path: '/rules',
    decor: {
      visualTheme: 'aid-seedling',
      eyebrow: '相处约定',
      title: '温柔也要有边界',
      note: '尊重成员，也尊重每一位来这里说话的人。',
      stickerIndexes: [3, 5, 8],
    },
  },
]

export function getFanHomeDecor(pathname: string): FanHomeDecor {
  const match = routeDecor.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  )

  return match?.decor ?? defaultDecor
}

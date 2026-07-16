import {
  CalendarDays,
  HandHeart,
  Home,
  Images,
  MessageSquareQuote,
  MessageSquareText,
  MoreHorizontal,
  Sprout,
  UserRound,
  UsersRound,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppStore } from '../../app/store/useAppStore'

const primaryTabs = [
  { to: '/', label: '首页', icon: Home },
  { to: '/members', label: '成员', icon: UsersRound },
  { to: '/canteen', label: '食堂', icon: UtensilsCrossed },
  { to: '/community', label: '社区', icon: MessageSquareText },
]

const secondaryTabs = [
  { to: '/events', label: '活动', description: '查看近期公开行程', icon: CalendarDays },
  { to: '/agri-aid', label: '助农', description: '浏览助农行动档案', icon: HandHeart },
  { to: '/check-in', label: '签到', description: '记录今天的陪伴', icon: Sprout },
  { to: '/moments', label: '名场面', description: '收藏共同记忆', icon: MessageSquareQuote },
  { to: '/gallery', label: '影像馆', description: '查看田野影像', icon: Images },
]

export function MobileTabBar() {
  const [moreOpen, setMoreOpen] = useState(false)
  const dialogRef = useRef<HTMLElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const user = useAppStore((state) => state.user)
  const moreActive = secondaryTabs.some((tab) => location.pathname.startsWith(tab.to))

  useEffect(() => {
    if (!moreOpen) return undefined
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreOpen(false)
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    const previousOverflow = document.body.style.overflow
    const moreButton = moreButtonRef.current
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      moreButton?.focus({ preventScroll: true })
    }
  }, [moreOpen])

  return (
    <>
      {moreOpen ? (
        <div className="fixed inset-0 z-50 bg-field-ink/38 backdrop-blur-[2px] md:hidden" role="presentation" onMouseDown={() => setMoreOpen(false)}>
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-more-title"
            className="absolute inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] rounded-[20px] border border-paper-line bg-paper-light p-4 shadow-field-lg"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p id="mobile-more-title" className="font-serif text-xl font-semibold text-field-ink">更多入口</p>
                <p className="mt-1 text-xs text-field-soft">活动、助农与个人服务</p>
              </div>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full border border-paper-line text-field-soft"
                aria-label="关闭更多导航"
                onClick={() => setMoreOpen(false)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav className="grid grid-cols-2 gap-2" aria-label="更多导航">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex min-h-16 items-center gap-3 rounded-[14px] border px-3 py-2.5 ${
                        isActive
                          ? 'border-field-green/30 bg-sprout-green/12 text-field-green'
                          : 'border-paper-line bg-field-surface text-field-ink'
                      }`
                    }
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold">{tab.label}</span>
                      <span className="mt-0.5 block text-[11px] text-field-soft">{tab.description}</span>
                    </span>
                  </NavLink>
                )
              })}
              <NavLink
                to={user ? '/profile' : '/login'}
                onClick={() => setMoreOpen(false)}
                className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-wheat/30 bg-wheat/10 px-3 font-semibold text-soil-brown"
              >
                <UserRound size={19} aria-hidden="true" />
                {user ? `个人中心 · ${user.nickname}` : '登录 / 注册'}
              </NavLink>
            </nav>
          </section>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-line bg-field-surface/96 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1.5 backdrop-blur md:hidden" aria-label="移动端主导航">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === '/'}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-1 rounded-[10px] text-xs font-medium ${
                    isActive ? 'bg-sprout-green/12 text-field-green' : 'text-field-soft'
                  }`
                }
              >
                <Icon size={19} aria-hidden="true" />
                <span>{tab.label}</span>
              </NavLink>
            )
          })}
          <button
            ref={moreButtonRef}
            type="button"
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-[10px] text-xs font-medium ${
              moreActive || moreOpen ? 'bg-sprout-green/12 text-field-green' : 'text-field-soft'
            }`}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(true)}
          >
            <MoreHorizontal size={20} aria-hidden="true" />
            <span>更多</span>
          </button>
        </div>
      </nav>
    </>
  )
}

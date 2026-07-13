import { CalendarDays, HandHeart, Home, Images, MessageSquareQuote, MessageSquareText, Sprout, UsersRound, UtensilsCrossed } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '首页', icon: Home },
  { to: '/members', label: '成员', icon: UsersRound },
  { to: '/events', label: '活动', icon: CalendarDays },
  { to: '/agri-aid', label: '助农', icon: HandHeart },
  { to: '/canteen', label: '食堂', icon: UtensilsCrossed },
  { to: '/check-in', label: '签到', icon: Sprout },
  { to: '/community', label: '社区', icon: MessageSquareText },
  { to: '/moments', label: '名场面', icon: MessageSquareQuote },
  { to: '/gallery', label: '影像', icon: Images },
]

export function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-line bg-field-surface/95 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-2 backdrop-blur md:hidden" aria-label="移动端主导航">
      <div className="mx-auto flex max-w-md gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex min-h-13 min-w-[4.25rem] flex-col items-center justify-center gap-1 rounded-[10px] text-[13px] font-medium ${
                  isActive ? 'bg-sprout-green/12 text-field-green' : 'text-field-soft'
                }`
              }
            >
              <Icon size={19} aria-hidden="true" />
              <span>{tab.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

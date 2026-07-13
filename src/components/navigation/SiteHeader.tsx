import { useEffect, useState } from 'react'
import { Menu, Sprout, UserRound } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '../common/Button'
import { useAppStore } from '../../app/store/useAppStore'
import { authService } from '../../features/auth/authService'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/members', label: '成员' },
  { to: '/events', label: '活动' },
  { to: '/agri-aid', label: '助农' },
  { to: '/canteen', label: '食堂' },
  { to: '/check-in', label: '签到' },
  { to: '/community', label: '社区' },
  { to: '/moments', label: '名场面' },
  { to: '/gallery', label: '影像馆' },
]

export function SiteHeader() {
  const user = useAppStore((state) => state.user)
  const signOutLocal = useAppStore((state) => state.signOut)
  const setToast = useAppStore((state) => state.setToast)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const solidHeader = scrolled || location.pathname !== '/'

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      signOutLocal()
    } catch {
      setToast('退出失败，请稍后重试')
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b transition duration-200 ${
        solidHeader
          ? 'border-paper-line/80 bg-paper-light/94 shadow-field-sm'
          : 'border-paper-line/40 bg-paper-light/72 text-field-ink'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-field focus:bg-field-surface focus:px-3 focus:py-2"
      >
        跳到主要内容
      </a>
      <div className="field-container flex h-16 items-center justify-between gap-3 md:h-[4.5rem] md:gap-5">
        <Link
          to="/"
          className="flex min-h-11 shrink-0 items-center gap-2.5 font-serif text-lg font-semibold text-field-ink md:min-h-12 md:text-xl"
        >
          <span className="flex size-9 items-center justify-center rounded-[11px] border border-field-green/18 bg-field-green/12 text-field-green md:size-10">
            <Sprout size={22} aria-hidden="true" />
          </span>
          十个勤天手册
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-2 overflow-x-auto whitespace-nowrap lg:gap-2.5 xl:gap-3 md:flex" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-field px-3 py-2.5 text-[14px] font-semibold transition hover:bg-field-muted lg:px-3.5 xl:px-4 xl:text-[15px] ${
                  isActive
                    ? solidHeader
                      ? 'bg-sprout-green/12 text-field-green'
                      : 'bg-field-green/10 text-field-green'
                    : 'text-field-soft'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                to="/profile"
                className="inline-flex min-h-12 items-center gap-2 rounded-[10px] px-4 py-2.5 text-base font-semibold text-field-soft"
              >
                <UserRound size={18} aria-hidden="true" />
                {user.nickname}
              </Link>
              <Button variant="ghost" className="min-h-12 px-5 text-base" onClick={handleSignOut}>
                退出
              </Button>
            </>
          ) : (
            <Button asChild variant="secondary" className="min-h-12 px-5 text-base">
              <Link to="/login">登录</Link>
            </Button>
          )}
        </div>
        <Button variant="ghost" className="min-h-11 px-3 md:hidden" aria-label="打开导航">
          <Menu size={22} aria-hidden="true" />
        </Button>
      </div>
    </header>
  )
}

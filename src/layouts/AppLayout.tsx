import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/navigation/SiteHeader'
import { MobileTabBar } from '../components/navigation/MobileTabBar'
import { BackToTopButton } from '../components/navigation/BackToTopButton'
import { useAppStore } from '../app/store/useAppStore'

export function AppLayout() {
  const toast = useAppStore((state) => state.toast)
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          id="main-content"
          className={`min-h-[70dvh] ${location.pathname === '/canteen' ? 'canteen-main' : ''}`}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <SiteFooter />
      <MobileTabBar />
      <BackToTopButton />
      {toast ? (
        <motion.div
          className="fixed bottom-24 left-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 rounded-field border border-paper-line bg-field-surface px-4 py-3 text-sm text-field-ink shadow-field-md md:bottom-6"
          initial={reduceMotion ? false : { opacity: 0, y: 14, x: '-50%' }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, x: '-50%' }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 10, x: '-50%' }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {toast}
        </motion.div>
      ) : null}
    </div>
  )
}

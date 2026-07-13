import { useEffect, useState } from 'react'
import { ArrowUp, Sprout } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

export function BackToTopButton() {
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 520)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <motion.button
      type="button"
      aria-label="回到页面顶部"
      className="fixed bottom-24 right-4 z-50 grid size-13 place-items-center rounded-[16px] border border-field-green/22 bg-paper-light/92 text-field-green shadow-field-md backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-sprout-green/14 md:bottom-8 md:right-8 md:size-14"
      initial={false}
      animate={visible ? { opacity: 1, y: 0, pointerEvents: 'auto' } : { opacity: 0, y: 16, pointerEvents: 'none' }}
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
      onClick={scrollToTop}
    >
      <Sprout className="size-6" aria-hidden="true" />
      <ArrowUp className="absolute right-2 top-2 size-3.5 text-wheat-strong" aria-hidden="true" />
    </motion.button>
  )
}

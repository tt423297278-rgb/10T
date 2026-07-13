import { AlertTriangle, Inbox, Loader2, LockKeyhole } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const iconMap = {
  loading: Loader2,
  empty: Inbox,
  error: AlertTriangle,
  auth: LockKeyhole,
}

export function StateBlock({
  type,
  title,
  description,
  action,
}: {
  type: keyof typeof iconMap
  title: string
  description: string
  action?: ReactNode
}) {
  const Icon = iconMap[type]
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="paper-panel flex min-h-44 flex-col items-center justify-center p-6 text-center"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="mb-3 text-field-green"
        animate={type === 'loading' || reduceMotion ? undefined : { rotate: [-1, 1, -1], y: [0, -2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon className={type === 'loading' ? 'animate-spin' : undefined} aria-hidden="true" />
      </motion.div>
      <h3 className="font-serif text-xl font-semibold text-field-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-field-soft">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  )
}

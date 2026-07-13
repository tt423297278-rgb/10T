import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Dices, MapPin, Sparkles, UtensilsCrossed, WalletCards, X } from 'lucide-react'
import type { CanteenPlace } from '../../types/domain'

interface CanteenPickDialogProps {
  open: boolean
  place?: CanteenPlace
  onClose: () => void
  onPickAgain: () => void
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function CanteenPickDialog({ open, place, onClose, onPickAgain }: CanteenPickDialogProps) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open || !place) return

    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector)
      if (!focusableElements?.length) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose, open, place])

  return createPortal(
    <AnimatePresence>
      {open && place ? (
        <motion.div
          className="canteen-pick-backdrop fixed inset-0 z-[70] grid place-items-center p-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            key={place.id}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="canteen-pick-title"
            aria-describedby="canteen-pick-description"
            className="canteen-pick-dialog relative w-full max-w-lg overflow-hidden rounded-[24px] border p-5 text-center sm:p-7"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.72, y: 44, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 16 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 310, damping: 22 }}
          >
            <div className="canteen-pick-rays" aria-hidden="true" />
            <div className="canteen-pick-confetti" aria-hidden="true">
              {Array.from({ length: 10 }, (_, index) => <span key={index} />)}
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="关闭开饭签"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full text-soil-brown/70 transition hover:bg-soil-brown/8 hover:text-soil-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soil-brown motion-reduce:transition-none"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="relative z-10">
              <motion.div
                className="canteen-pick-seal mx-auto grid size-[76px] place-items-center rounded-full"
                initial={shouldReduceMotion ? false : { scale: 0, rotate: -24 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.18, type: 'spring', stiffness: 360, damping: 18 }}
                aria-hidden="true"
              >
                <UtensilsCrossed size={30} />
              </motion.div>
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold tracking-[0.18em] text-soil-brown">
                <Sparkles size={15} aria-hidden="true" />
                开饭签抽中了
                <Sparkles size={15} aria-hidden="true" />
              </p>
              <h2 id="canteen-pick-title" className="mt-3 font-serif text-3xl font-semibold leading-tight text-field-ink sm:text-4xl">
                {place.name}
              </h2>
              <p id="canteen-pick-description" className="canteen-pick-accent mt-2 text-sm font-semibold">
                {place.city} · {place.district} · {place.category}
              </p>

              <div className="canteen-pick-ticket mt-6 grid gap-3 rounded-[16px] p-4 text-left text-sm sm:grid-cols-2">
                <p className="flex items-start gap-2 sm:col-span-2">
                  <MapPin className="canteen-pick-accent mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{place.address}</span>
                </p>
                <p className="flex items-start gap-2">
                  <UtensilsCrossed className="canteen-pick-accent mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{place.categoryDetail || place.category}</span>
                </p>
                <p className="flex items-start gap-2">
                  <WalletCards className="canteen-pick-accent mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{place.price || '原表未注明人均'}</span>
                </p>
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={onPickAgain} className="canteen-pick-again inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] px-4 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soil-brown focus-visible:ring-offset-2 motion-reduce:transition-none">
                  <Dices size={18} aria-hidden="true" />
                  再抽一家
                </button>
                <button type="button" onClick={onClose} className="canteen-pick-accept min-h-12 rounded-[12px] px-4 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soil-brown focus-visible:ring-offset-2 motion-reduce:transition-none">
                  收下这张签
                </button>
              </div>
              <a href={place.sourceUrl} target="_blank" rel="noreferrer" className="canteen-pick-source mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline underline-offset-4">
                核对原表 · {place.sourceSheet}第 {place.sourceRow} 行
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

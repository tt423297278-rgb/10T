import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, CloudSun, NotebookPen, Stamp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { fallbackImage, heroCarouselImages } from '../../data/imageSources'
import { Button } from '../common/Button'

export function FieldJournalHero() {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImageIds, setFailedImageIds] = useState<string[]>([])
  const activeImage = heroCarouselImages[activeIndex] ?? heroCarouselImages[0]
  const imageFailed = activeImage ? failedImageIds.includes(activeImage.sourceId) : true
  const visibleImage = imageFailed || !activeImage ? fallbackImage : activeImage

  useEffect(() => {
    if (reduceMotion || heroCarouselImages.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroCarouselImages.length)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [reduceMotion])

  const goToSlide = (index: number) => {
    setActiveIndex((index + heroCarouselImages.length) % heroCarouselImages.length)
  }

  const markImageFailed = (sourceId: string) => {
    setFailedImageIds((current) => (current.includes(sourceId) ? current : [...current, sourceId]))
  }

  return (
    <section className="poster-hero">
      <div className="poster-forest" aria-hidden="true" />
      <div className="poster-field" aria-hidden="true" />
      <div className="absolute left-[7%] top-[16%] hidden h-28 w-16 border-l-2 border-field-green/36 md:block" aria-hidden="true">
        <span className="absolute left-3 top-2 h-24 w-px rotate-[-16deg] bg-field-green/30" />
        <span className="absolute left-6 top-5 h-20 w-px rotate-[12deg] bg-field-green/28" />
        <span className="absolute left-9 top-1 h-24 w-px rotate-[2deg] bg-field-green/24" />
      </div>

      <div className="field-container relative z-10 grid min-h-[calc(100dvh-4rem)] items-end gap-8 pb-12 pt-12 md:grid-cols-[.82fr_1.18fr] md:items-center md:pb-16">
        <motion.div
          className="max-w-xl self-start pt-12 text-field-ink md:self-center md:pt-0"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-7 flex flex-wrap gap-2">
            <span className="field-tag border-field-green/24 bg-field-green/10 text-field-green"><NotebookPen size={14} aria-hidden="true" />田野成长档案</span>
            <span className="field-tag border-wheat/30 bg-wheat/[0.14] text-soil-brown"><CloudSun size={14} aria-hidden="true" />自然光 · 微风</span>
            <span className="field-tag border-paper-line bg-paper-light/72"><CalendarDays size={14} aria-hidden="true" />2026 / 夏季记录</span>
          </div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.45em] text-field-green/72">Believe in the Land</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-field-ink sm:text-6xl md:text-7xl">
            十个勤天
          </h1>
          <p className="mt-5 max-w-xl font-serif text-2xl font-semibold leading-snug text-field-green md:text-3xl">
            十个人，一片土地，一段正在生长的故事。
          </p>
          <div className="mt-5 rounded-[16px] border border-paper-line bg-paper-light/90 p-4 shadow-field-sm backdrop-blur-[2px]">
            <p className="max-w-xl text-base font-medium leading-7 text-field-ink">
              相信土地的力量，今日也在认真生长。这里像一本持续更新的田野纪实手册，整理成员动态、活动行程与陪伴记录。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="!bg-field-green !text-paper-light [&_*]:!text-paper-light">
                <Link to="/members">翻开十人田野档案 <ArrowRight size={16} aria-hidden="true" /></Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/events"><CalendarDays size={16} aria-hidden="true" />查看田野日程</Link>
              </Button>
              <Button asChild variant="ghost" className="bg-field-green/[0.08] text-field-green hover:bg-field-green/[0.14]">
                <Link to="/check-in"><Stamp size={16} aria-hidden="true" />今日签到</Link>
              </Button>
            </div>
            <p className="mt-4 max-w-lg text-xs leading-5 text-field-soft">
              首屏轮播图来自用户本地提供素材，已复制到项目目录并用于首页展示。
            </p>
          </div>
        </motion.div>

        <motion.figure
          className="poster-frame hero-carousel relative justify-self-end"
          initial={reduceMotion ? false : { opacity: 0, y: 20, rotate: -0.6 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.62, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-full overflow-hidden bg-field-muted">
            <AnimatePresence initial={false} mode="wait">
              <motion.picture
                key={visibleImage.sourceId}
                className="absolute inset-0 block"
                initial={reduceMotion ? false : { opacity: 0.2, scale: 1.012 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
              >
                {!imageFailed && activeImage ? <source media="(max-width: 640px)" srcSet={activeImage.mobileSrc} /> : null}
                <img
                  src={imageFailed || !activeImage ? fallbackImage.src : activeImage.desktopSrc}
                  alt={visibleImage.alt}
                  fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className="h-full w-full bg-field-green/10 object-cover"
                  style={{ objectPosition: imageFailed ? 'center center' : activeImage.mobileObjectPosition ?? activeImage.objectPosition }}
                  onError={() => activeImage ? markImageFailed(activeImage.sourceId) : undefined}
                />
              </motion.picture>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(36,77,56,0.02),rgba(18,33,25,0.18))]" aria-hidden="true" />

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
              <button
                type="button"
                className="interactive-press inline-flex size-10 items-center justify-center rounded-full border border-paper-light/55 bg-field-ink/46 text-paper-light backdrop-blur-sm transition hover:bg-field-green"
                aria-label="上一张群像图"
                onClick={() => goToSlide(activeIndex - 1)}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2 rounded-full border border-paper-light/50 bg-field-ink/46 px-3 py-2 backdrop-blur-sm" aria-label="群像轮播分页">
                {heroCarouselImages.map((image, index) => (
                  <button
                    key={image.sourceId}
                    type="button"
                    className={`size-2.5 rounded-full transition ${index === activeIndex ? 'bg-paper-light' : 'bg-paper-light/42 hover:bg-paper-light/70'}`}
                    aria-label={`切换到第 ${index + 1} 张群像图`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="interactive-press inline-flex size-10 items-center justify-center rounded-full border border-paper-light/55 bg-field-ink/46 text-paper-light backdrop-blur-sm transition hover:bg-field-green"
                aria-label="下一张群像图"
                onClick={() => goToSlide(activeIndex + 1)}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <figcaption className="absolute inset-x-4 bottom-16 flex flex-wrap items-center justify-between gap-2 text-xs text-paper-light/82">
            <span>{imageFailed ? fallbackImage.alt : activeImage?.caption}</span>
            <span className="font-mono tracking-[0.18em]">FIELD NOTE 2026</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

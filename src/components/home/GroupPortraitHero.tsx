import { Helmet } from 'react-helmet-async'
import { ArrowRight, CalendarDays, Stamp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { heroGroupPortrait } from '../../data/heroMedia'
import { Button } from '../common/Button'

export function GroupPortraitHero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-paper-line/80">
      <Helmet>
        <link rel="preload" as="image" href={heroGroupPortrait.desktopSrc} />
      </Helmet>
      <div className="absolute inset-0 bg-[#9d8654]" aria-hidden="true" />
      <motion.picture
        className="absolute inset-x-0 top-0 mx-auto block h-[58dvh] max-h-[42rem] min-h-[24rem] w-full md:inset-0 md:h-full"
        initial={reduceMotion ? false : { filter: 'blur(10px)', opacity: 0.88 }}
        animate={reduceMotion ? undefined : { filter: 'blur(0px)', opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <source media="(max-width: 640px)" srcSet={heroGroupPortrait.mobileSrc} />
        <source media="(max-width: 1024px)" srcSet={heroGroupPortrait.tabletSrc} />
        <img
          src={heroGroupPortrait.desktopSrc}
          alt={heroGroupPortrait.alt}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
          style={{ objectPosition: heroGroupPortrait.focalPoint }}
        />
      </motion.picture>
      <div className="absolute inset-0 bg-gradient-to-b from-field-ink/10 via-transparent to-field-bg md:bg-gradient-to-r md:from-field-ink/74 md:via-field-ink/22 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-field-bg to-transparent" aria-hidden="true" />

      <div className="field-container relative grid min-h-[calc(100dvh-4rem)] content-end pb-10 pt-[52dvh] md:content-center md:pt-14">
        <motion.div
          className="max-w-xl rounded-field bg-field-bg/86 p-4 shadow-field-md backdrop-blur-sm md:bg-transparent md:p-0 md:text-white md:shadow-none"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex rounded-full border border-paper-line/70 bg-field-surface/80 px-3 py-1 text-sm font-semibold text-wheat-strong md:border-white/30 md:bg-white/12 md:text-white">
            粉丝交流与内容整理平台
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-none text-field-ink md:text-7xl md:text-white">
            十个勤天
          </h1>
          <p className="mt-4 font-serif text-xl font-semibold text-field-ink md:text-2xl md:text-white">
            把日子种下去，把陪伴留下来
          </p>
          <p className="mt-3 max-w-lg text-sm leading-6 text-field-soft md:text-base md:text-white/86">
            记录成员动态、活动行程与成长故事，也为每一位陪伴他们的朋友留下一块温暖的田地。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/members">认识十位成员 <ArrowRight size={16} aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/events"><CalendarDays size={16} aria-hidden="true" />查看最近活动</Link>
            </Button>
            <Button asChild variant="ghost" className="bg-field-surface/70 md:bg-white/12 md:text-white md:hover:bg-white/20">
              <Link to="/check-in"><Stamp size={16} aria-hidden="true" />今日签到</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-field-soft md:text-white/68">
            {heroGroupPortrait.source}。{heroGroupPortrait.copyrightNote}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

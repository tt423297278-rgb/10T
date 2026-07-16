import { ArrowUpRight, CheckCircle2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { EventCard } from '../../components/event/EventCard'
import { FieldJournalHero } from '../../components/home/FieldJournalHero'
import { MemberCard } from '../../components/member/MemberCard'
import { FadeIn } from '../../components/motion/FadeIn'
import { PostCard } from '../../components/community/PostCard'
import { communityPosts } from '../../data/community'
import { homeAidHighlights } from '../../data/homeAidHighlights'
import { useEventsQuery, useMembersQuery, useOfficialUpdatesQuery } from '../../hooks/usePublicData'

export default function HomePage() {
  const membersQuery = useMembersQuery()
  const eventsQuery = useEventsQuery()
  const updatesQuery = useOfficialUpdatesQuery()
  const members = membersQuery.data ?? []
  const events = eventsQuery.data ?? []
  const officialUpdates = updatesQuery.data ?? []

  return (
    <div className="atmosphere-page home-atmosphere">
      <PageMeta title="首页" description="以麦田、土地、青年成长和田野日志为核心的十个勤天粉丝陪伴社区。" />
      <FieldJournalHero />

      <FadeIn>
        <section className="field-section field-section-soft py-10">
          <div className="field-container">
            <SectionHeader
              eyebrow="十人田野档案"
              title="十位成员的成长记录入口"
              description="每一张档案都保留编号、标签和资料状态；未核验内容只做占位，不虚构经历。"
              compact
              action={
                <Button asChild variant="secondary">
                  <Link to="/members">全部成员</Link>
                </Button>
              }
            />
            {membersQuery.isLoading ? (
              <StateBlock type="loading" title="正在读取成员资料" description="成员入口正在加载。" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {members.slice(0, 10).map((member, index) => (
                  <FadeIn key={member.id} delay={index * 0.035} className="h-full">
                    <MemberCard member={member} compact />
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="field-section py-10">
          <div className="field-container">
            <SectionHeader
              eyebrow="助农行动档案"
              title="从一次帮忙，到长期回访"
              description="首页保留近期三条记录，完整时间线与来源说明集中在助农页面。"
              action={
                <Button asChild variant="secondary">
                  <Link to="/agri-aid">查看完整档案 <ArrowUpRight size={16} aria-hidden="true" /></Link>
                </Button>
              }
            />
            <div className="paper-panel divide-y divide-paper-line overflow-hidden">
              {homeAidHighlights.map((event) => (
                <Link
                  key={event.sourceEventId}
                  to="/agri-aid"
                  className="grid min-h-20 gap-2 px-4 py-3 transition hover:bg-sprout-green/8 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
                >
                  <span className="font-mono text-xs font-semibold text-wheat-strong">{event.date}</span>
                  <span>
                    <strong className="block font-serif text-lg text-field-ink">{event.title}</strong>
                    <span className="mt-1 flex items-center gap-1 text-xs text-field-soft">
                      <MapPin size={13} aria-hidden="true" />{event.location}
                    </span>
                  </span>
                  <ArrowUpRight className="hidden text-field-green sm:block" size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="field-section field-section-green py-10">
          <div className="field-container">
            <SectionHeader eyebrow="田野日程" title="最近活动" description="像田野月历一样整理公开行程，状态颜色保持克制。" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {events.slice(0, 3).map((event, index) => (
                <FadeIn key={event.id} delay={index * 0.05} className="h-full">
                  <EventCard event={event} members={members} compact />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="field-section py-10">
          <div className="field-container">
            <SectionHeader eyebrow="今日记录" title="每日签到" description="用盖章和成长刻度记录陪伴，不做游戏化积分面板。" />
            <div className="paper-panel growth-panel grid gap-6 p-6 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <div className="stamp-motion inline-flex size-12 items-center justify-center rounded-[12px] border border-wheat/35 bg-wheat/12 text-soil-brown shadow-field-sm">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-serif text-2xl font-semibold">慢慢生长，也会长出答案</h3>
                <p className="mt-2 text-field-soft">连续签到 3 天 · 累计签到 18 天 · 麦粒值 125</p>
                <Button asChild className="mt-6 border-wheat bg-wheat text-field-ink shadow-none hover:bg-[#c69a3f]">
                  <Link to="/check-in">进入签到页</Link>
                </Button>
              </div>
              <div className="grid grid-cols-5 gap-2" aria-label="签到成长阶段">
                {['种子', '发芽', '幼苗', '抽穗', '麦田'].map((stage, index) => (
                  <div key={stage} className={`rounded-[8px] border p-2 text-center text-xs ${index < 3 ? 'growth-step-active border-wheat/35 bg-wheat/12 text-soil-brown' : 'border-paper-line bg-paper-white/45 text-field-soft'}`}>
                    {stage}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="field-section field-section-mist py-12">
          <div className="field-container">
            <SectionHeader eyebrow="后陡门通讯" title="十个勤天动态" description="后台录入的公开信息，与粉丝社区分开，保留来源和时间线。" />
            <div className="grid gap-4 md:grid-cols-2">
              {officialUpdates.slice(0, 4).map((update, index) => (
                <FadeIn key={update.id} delay={index * 0.05}>
                  <article className="paper-panel letter-card record-card p-5">
                    <p className="field-tag">{update.type}</p>
                    <h3 className="mt-2 font-serif text-xl font-semibold">{update.title}</h3>
                    <p className="mt-2 text-sm text-field-soft">{update.body}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="field-section field-section-soft py-12">
          <div className="field-container">
            <SectionHeader eyebrow="麦田回声" title="粉丝互动精选" description="留言卡保持米白纸张和深绿色文字，互动温暖但平静。" />
            <div className="grid gap-4 md:grid-cols-2">
              {communityPosts.length ? (
                communityPosts.slice(0, 4).map((post, index) => (
                  <FadeIn key={post.id} delay={index * 0.05}>
                    <PostCard post={post} members={members} />
                  </FadeIn>
                ))
              ) : (
                <StateBlock type="empty" title="还没有精选内容" description="第一条认真记录会出现在这里。" />
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="field-container pb-14">
          <SectionHeader eyebrow="成长数字" title="一起走过的时间" description="数字只作为陪伴记录，不做游戏积分面板。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['累计签到', '12,840 次'],
              ['今日同行', '326 人'],
              ['社区内容', '1,206 篇'],
              ['即将活动', `${events.filter((event) => event.status === '即将开始').length} 场`],
            ].map(([label, value], index) => (
              <FadeIn key={label} delay={index * 0.04}>
                <div className="paper-panel record-card date-spine p-5">
                  <p className="text-sm text-field-soft">{label}</p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-field-green">{value}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  )
}

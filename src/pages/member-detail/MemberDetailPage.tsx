import { Link, useParams } from 'react-router-dom'
import { Share2 } from 'lucide-react'
import { communityPosts } from '../../data/community'
import { Button } from '../../components/common/Button'
import { MediaFrame } from '../../components/common/MediaFrame'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { EventCard } from '../../components/event/EventCard'
import { PostCard } from '../../components/community/PostCard'
import { useEventsQuery, useMembersQuery } from '../../hooks/usePublicData'

export default function MemberDetailPage() {
  const { memberId } = useParams()
  const membersQuery = useMembersQuery()
  const eventsQuery = useEventsQuery()
  const members = membersQuery.data ?? []
  const events = eventsQuery.data ?? []
  const member = members.find((item) => item.id === memberId)

  if (membersQuery.isLoading) {
    return <StateBlock type="loading" title="正在读取成员资料" description="请稍候。" />
  }

  if (!member) {
    return <StateBlock type="error" title="没有找到成员" description="请从成员列表重新进入。" />
  }

  const relatedEvents = events.filter((event) => event.memberIds.includes(member.id))
  const relatedPosts = communityPosts.filter((post) => post.memberIds.includes(member.id))

  return (
    <section className="field-container py-12">
      <PageMeta title={member.name} description={`${member.name} 的成员详情页。`} path={`/members/${member.id}`} />
      <div className="member-detail-hero-grid grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
        <MediaFrame
          title={member.name}
          alt={member.image?.alt ?? `${member.name} 成员头图占位`}
          src={member.image?.status === 'approved' || member.image?.status === 'placeholder' ? member.image.src : undefined}
          tone={member.avatarTone}
          objectPosition={member.image?.objectPosition ?? 'center center'}
          className="member-detail-hero-photo [&>div]:aspect-[4/3] [&>div]:min-h-0"
        />
        <div className="member-detail-hero-copy">
          <p className="field-tag">{member.shortTag}</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-field-ink">{member.name}</h1>
          <p className="mt-4 text-field-soft">{member.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>关注成员</Button>
            <Button variant="secondary">
              <Share2 size={16} aria-hidden="true" />
              分享
            </Button>
          </div>
          <div className="paper-panel mt-8 p-5">
            <SectionHeader eyebrow="人物档案" title="基础资料" description="未确认信息不虚构，等待管理员补充来源。" />
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-field-soft">生日</dt><dd>{member.birthday ?? '待核验'}</dd></div>
              <div><dt className="text-field-soft">出生地</dt><dd>{member.birthplace ?? '待核验'}</dd></div>
              <div><dt className="text-field-soft">兴趣方向</dt><dd>{member.interests.join('、')}</dd></div>
              <div><dt className="text-field-soft">资料状态</dt><dd>{member.profileStatus === 'verified' ? '已核验' : '占位内容'}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <div className="member-detail-archive-grid mt-12 grid gap-8 lg:grid-cols-2">
        <div className="member-detail-archive-column">
          <SectionHeader eyebrow="成长节点" title="成长时间线" />
          <div className="grid gap-4">
            {member.timeline.length ? (
              member.timeline.map((item) => (
                <article key={item.id} className="paper-panel date-spine member-detail-note p-5">
                  <p className="field-tag">{item.date}</p>
                  <h3 className="mt-1 font-serif text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-field-soft">{item.description}</p>
                </article>
              ))
            ) : (
              <StateBlock type="empty" title="时间线待补充" description="公开成长节点会由后台录入。" />
            )}
          </div>
        </div>
        <div className="member-detail-archive-column">
          <SectionHeader eyebrow="公开内容" title="代表内容" />
          <div className="grid gap-4">
            {member.works.length ? (
              member.works.map((work) => (
                <article key={work.id} className="paper-panel member-detail-note p-5">
                  <p className="field-tag">{work.type}</p>
                  <h3 className="mt-2 font-serif text-xl font-semibold">{work.title}</h3>
                  <p className="mt-2 text-sm text-field-soft">{work.description}</p>
                </article>
              ))
            ) : (
              <StateBlock type="empty" title="代表内容待补充" description="后续录入公开作品、舞台、采访等内容。" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <SectionHeader
          eyebrow="田野日程"
          title="最近活动"
          action={
            <Button asChild variant="secondary">
              <Link to="/events">全部活动</Link>
            </Button>
          }
        />
        <div className={`grid gap-4 ${relatedEvents.length > 1 ? 'lg:grid-cols-2' : ''}`}>
          {eventsQuery.isLoading ? (
            <StateBlock type="loading" title="正在读取活动" description="关联活动正在加载。" />
          ) : relatedEvents.length ? (
            relatedEvents.map((event) => <EventCard key={event.id} event={event} members={members} />)
          ) : (
            <StateBlock type="empty" title="暂无确认活动" description="待后台录入与该成员相关的公开活动。" />
          )}
        </div>
      </div>

      <div className="mt-12">
        <SectionHeader eyebrow="麦田回声" title="粉丝讨论" />
        <div className={`grid gap-4 ${relatedPosts.length > 1 ? 'lg:grid-cols-2' : ''}`}>
          {relatedPosts.length ? (
            relatedPosts.map((post) => <PostCard key={post.id} post={post} members={members} />)
          ) : (
            <StateBlock type="empty" title="还没有相关讨论" description="登录后可以发布与该成员相关的记录。" />
          )}
        </div>
      </div>
    </section>
  )
}

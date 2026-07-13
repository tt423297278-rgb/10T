import { Link } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { MediaFrame } from '../../components/common/MediaFrame'
import { useMembersQuery, useOfficialUpdatesQuery } from '../../hooks/usePublicData'

export default function OfficialUpdatesPage() {
  const membersQuery = useMembersQuery()
  const updatesQuery = useOfficialUpdatesQuery()
  const members = membersQuery.data ?? []
  const officialUpdates = updatesQuery.data ?? []

  return (
    <section className="atmosphere-page updates-atmosphere py-12">
      <div className="field-container">
      <PageMeta title="成员动态" description="成员动态与粉丝社区分离，展示后台录入的公开信息。" path="/updates" />
      <SectionHeader level={1} eyebrow="后陡门通讯" title="今日田野记录" description="不自动抓取第三方平台，优先读取 Supabase 后台录入数据。" />
      {updatesQuery.isLoading ? (
        <StateBlock type="loading" title="正在读取成员动态" description="公开动态正在加载。" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {officialUpdates.map((update) => {
            const relatedMembers = members.filter((member) => update.memberIds.includes(member.id))
            return (
              <Link key={update.id} to={`/updates/${update.id}`} className="paper-panel record-card block p-5 transition duration-300 ease-field hover:-translate-y-0.5 hover:shadow-field-md">
                {update.coverImage ? (
                  <MediaFrame
                    title={update.title}
                    alt={update.coverImage.alt}
                    src={update.coverImage.status === 'approved' || update.coverImage.status === 'placeholder' ? update.coverImage.src : undefined}
                    className="mb-4 [&>div]:aspect-[16/9] [&>div]:min-h-0"
                  />
                ) : null}
                <p className="field-tag">{update.type}</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold">{update.title}</h2>
                <p className="mt-2 text-sm text-field-soft">{update.body}</p>
                <p className="mt-3 text-xs text-field-soft">
                  {relatedMembers.map((member) => member.name).join('、') || '未关联成员'} · {update.sourceLabel}
                </p>
              </Link>
            )
          })}
        </div>
      )}
      </div>
    </section>
  )
}

import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import { StateBlock } from '../../components/common/StateBlock'
import { MediaFrame } from '../../components/common/MediaFrame'
import { useMembersQuery, useOfficialUpdatesQuery } from '../../hooks/usePublicData'

export default function OfficialUpdateDetailPage() {
  const { updateId } = useParams()
  const updatesQuery = useOfficialUpdatesQuery()
  const membersQuery = useMembersQuery()
  const update = updatesQuery.data?.find((item) => item.id === updateId)
  const members = membersQuery.data ?? []

  if (updatesQuery.isLoading) {
    return <StateBlock type="loading" title="正在读取动态" description="请稍候。" />
  }

  if (!update) return <StateBlock type="error" title="动态不存在" description="请回到动态列表重新查看。" />

  const relatedMembers = members.filter((member) => update.memberIds.includes(member.id))

  return (
    <article className="field-container max-w-3xl py-12">
      <PageMeta title={update.title} description={update.body} path={`/updates/${update.id}`} />
      <p className="field-tag">{update.type}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-field-ink">{update.title}</h1>
      <p className="mt-3 text-sm text-field-soft">{new Date(update.publishedAt).toLocaleString('zh-CN')} · {update.sourceLabel}</p>
      {update.coverImage ? (
        <MediaFrame
          title={update.title}
          alt={update.coverImage.alt}
          src={update.coverImage.status === 'approved' || update.coverImage.status === 'placeholder' ? update.coverImage.src : undefined}
          className="mt-8 [&>div]:aspect-[16/9]"
        />
      ) : null}
      <p className="mt-8 text-lg leading-8 text-field-ink">{update.body}</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {relatedMembers.map((member) => (
          <Link key={member.id} to={`/members/${member.id}`} className="field-tag">
            {member.name}
          </Link>
        ))}
      </div>
    </article>
  )
}

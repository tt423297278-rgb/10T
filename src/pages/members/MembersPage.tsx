import { MemberCard } from '../../components/member/MemberCard'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { useMembersQuery } from '../../hooks/usePublicData'

export default function MembersPage() {
  const membersQuery = useMembersQuery()
  const members = membersQuery.data ?? []

  return (
    <section className="atmosphere-page members-atmosphere py-10">
      <div className="field-container">
      <PageMeta title="成员" description="十位成员入口、资料占位、成长时间线和最近活动。" path="/members" />
      <SectionHeader
        level={1}
        eyebrow="十人田野档案"
        title="十位成员"
        description="像人物观察档案一样整理入口；未获得准确资料前不虚构生日、经历、作品或账号。"
        compact
      />
      {membersQuery.isLoading ? (
        <StateBlock type="loading" title="正在读取成员资料" description="请稍候，成员资料正在加载。" />
      ) : membersQuery.isError ? (
        <StateBlock type="error" title="成员资料读取失败" description="请检查 Supabase 配置或稍后重试。" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} compact />
          ))}
        </div>
      )}
      </div>
    </section>
  )
}

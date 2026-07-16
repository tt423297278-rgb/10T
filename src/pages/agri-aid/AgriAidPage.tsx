import { AgriAidTimelineSection } from '../../components/agri-aid/AgriAidTimelineSection'
import { PageMeta } from '../../components/common/PageMeta'

export default function AgriAidPage() {
  return (
    <div className="atmosphere-page updates-atmosphere">
      <PageMeta
        title="助农"
        description="十个勤天助农行动的发展史、大事件、重点成果和资料卡。"
        path="/agri-aid"
      />
      <h1 className="sr-only">十个勤天助农行动档案</h1>
      <AgriAidTimelineSection />
    </div>
  )
}

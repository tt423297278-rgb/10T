import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'
import { StateBlock } from '../../components/common/StateBlock'

export default function NotFoundPage() {
  return (
    <section className="field-container py-16">
      <PageMeta title="页面不存在" description="没有找到对应页面。" path="/404" />
      <StateBlock type="error" title="这页还没有种下" description="链接可能已经移动，或者页面仍在规划中。" action={<Button asChild><Link to="/">回到首页</Link></Button>} />
    </section>
  )
}

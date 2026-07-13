import { PageMeta } from '../../components/common/PageMeta'

export default function RulesPage() {
  return (
    <article className="field-container max-w-3xl py-12">
      <PageMeta title="社区规则" description="粉丝社区互动和内容发布规则。" path="/rules" />
      <h1 className="font-serif text-4xl font-semibold">社区规则</h1>
      <ul className="mt-6 grid gap-3 text-field-soft">
        <li>只发布已授权或可公开引用的内容，保留来源。</li>
        <li>不搬运受版权保护的完整图片、视频或第三方内容。</li>
        <li>尊重成员和其他用户，不引战、不造谣、不泄露隐私。</li>
        <li>违规内容会进入审核、隐藏、删除或举报处理流程。</li>
      </ul>
    </article>
  )
}

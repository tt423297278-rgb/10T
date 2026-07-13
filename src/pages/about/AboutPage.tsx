import { PageMeta } from '../../components/common/PageMeta'

export default function AboutPage() {
  return (
    <article className="field-container max-w-3xl py-12">
      <PageMeta title="网站说明" description="十个勤天陪伴社区的网站说明和内容来源原则。" path="/about" />
      <h1 className="font-serif text-4xl font-semibold">网站说明</h1>
      <p className="mt-5 text-field-soft">这是一个非官方粉丝社区前端原型，目标是整理公开信息、记录成长和支持温暖克制的互动。所有成员资料、图片、视频、活动和动态上线前都需要来源核验或授权。</p>
    </article>
  )
}

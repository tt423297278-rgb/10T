import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-paper-line/80 bg-field-surface/70 pb-24 pt-10 md:pb-10">
      <div className="field-container grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="field-tag mb-3">田野日志持续更新</p>
          <p className="font-serif text-xl font-semibold text-field-ink">十个勤天陪伴社区</p>
          <p className="mt-3 max-w-md text-sm text-field-soft">
            非官方粉丝社区原型，聚焦公开信息整理、陪伴记录和克制友好的互动。
          </p>
        </div>
        <nav aria-label="页脚链接" className="grid gap-1 text-sm text-field-soft">
          <Link className="flex min-h-11 items-center" to="/about">网站说明</Link>
          <Link className="flex min-h-11 items-center" to="/rules">社区规则</Link>
          <Link className="flex min-h-11 items-center" to="/updates">成员动态</Link>
        </nav>
        <div className="text-sm text-field-soft">
          <p>内容来源需保留来源字段；未经授权不搬运图片、视频或第三方完整内容。</p>
          <p className="mt-2">联系与版权说明：待运营方补充。</p>
        </div>
      </div>
    </footer>
  )
}

import { BookMarked, Quote, Search, Star } from 'lucide-react'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { momentRecords } from '../../data/collections'

const toneClass = {
  green: 'border-field-green/20 bg-field-green/8 text-field-green',
  gold: 'border-wheat-gold/35 bg-wheat-gold/14 text-soil-brown',
  mist: 'border-mist-blue/60 bg-mist-blue/28 text-field-green',
}

export default function MomentsPage() {
  return (
    <section className="atmosphere-page updates-atmosphere py-12">
      <div className="field-container">
        <PageMeta
          title="名场面"
          description="收藏十个勤天经典语录、名场面和温暖瞬间，像一本线上手卡册。"
          path="/moments"
        />

        <div className="paper-panel mb-8 overflow-hidden p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_.72fr] lg:items-end">
            <SectionHeader
              level={1}
              eyebrow="语录手卡"
              title="名场面 / 语录收藏"
              description="一些经典语录、名场面、温暖瞬间做成卡片，像一本线上木伙人手册。"
              compact
            />
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ['语录', '记录短句和出处', Quote],
                ['名场面', '保存瞬间说明', Star],
                ['检索', '预留成员筛选', Search],
              ].map(([title, text, Icon]) => (
                <div key={title as string} className="rounded-field border border-paper-line bg-paper-light/70 p-3">
                  <Icon className="mb-2 text-field-green" size={18} aria-hidden="true" />
                  <p className="text-sm font-semibold text-field-ink">{title as string}</p>
                  <p className="text-xs text-field-soft">{text as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {momentRecords.map((item) => (
            <article key={item.id} className="paper-panel record-card flex min-h-72 flex-col p-5 hover:shadow-field-md">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className={`rounded-[9px] border px-2.5 py-1 text-xs font-semibold ${toneClass[item.tone]}`}>
                  {item.season}
                </span>
                <BookMarked size={18} className="text-field-soft" aria-hidden="true" />
              </div>
              <blockquote className="font-serif text-2xl font-semibold leading-snug text-field-ink">
                “{item.quote}”
              </blockquote>
              <h2 className="mt-5 text-base font-semibold text-field-ink">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-field-soft">{item.context}</p>
              <div className="mt-5 border-t border-paper-line pt-4 text-xs text-field-soft">
                <p>{item.members.join('、')}</p>
                <p className="mt-1">{item.sourceLabel}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

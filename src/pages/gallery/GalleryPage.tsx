import { Camera, Film, Image as ImageIcon, Play } from 'lucide-react'
import { MediaFrame } from '../../components/common/MediaFrame'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { galleryRecords } from '../../data/collections'

export default function GalleryPage() {
  const photoCount = galleryRecords.filter((item) => item.type === '照片').length
  const videoCount = galleryRecords.filter((item) => item.type === '视频').length

  return (
    <section className="atmosphere-page community-atmosphere py-12">
      <div className="field-container">
        <PageMeta
          title="影像馆"
          description="整理十个勤天群像、成员照片、节目氛围图和视频封面。"
          path="/gallery"
        />

        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_.58fr] lg:items-stretch">
          <div className="paper-panel p-6 md:p-8">
            <SectionHeader
              level={1}
              eyebrow="照片 / 视频展示区"
              title="照片与视频展示区"
              description="放一些群像、成员照片、节目氛围图、麦田自然感的视觉内容；每张素材都保留来源和用途说明。"
              compact
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {['全部素材', '群像', '成员照片', '节目氛围', '视频封面'].map((item) => (
                <span key={item} className="field-tag">{item}</span>
              ))}
            </div>
          </div>
          <div className="paper-panel grid content-center gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-[12px] border border-field-green/18 bg-field-green/10 text-field-green">
                <Camera size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="font-serif text-2xl font-semibold text-field-ink">{galleryRecords.length} 份素材</p>
                <p className="text-sm text-field-soft">本地素材先行展示，后续可接入后台上传。</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-field border border-paper-line bg-paper-light/72 p-3">
                <ImageIcon size={17} className="mb-2 text-field-green" aria-hidden="true" />
                <p className="font-semibold">{photoCount} 张照片</p>
              </div>
              <div className="rounded-field border border-paper-line bg-paper-light/72 p-3">
                <Film size={17} className="mb-2 text-field-green" aria-hidden="true" />
                <p className="font-semibold">{videoCount} 个视频位</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryRecords.map((item) => (
            <article key={item.id} className="paper-panel record-card overflow-hidden hover:shadow-field-md">
              <MediaFrame
                title={item.title}
                alt={item.alt}
                src={item.src}
                video={item.type === '视频'}
                className="archive-photo rounded-b-none border-x-0 border-t-0 [&>div]:aspect-[16/10] [&>div]:min-h-0"
              />
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="field-tag">{item.type}</span>
                  {item.type === '视频' ? <Play size={17} className="text-field-green" aria-hidden="true" /> : null}
                </div>
                <h2 className="font-serif text-xl font-semibold text-field-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-field-soft">{item.description}</p>
                <p className="mt-4 border-t border-paper-line pt-3 text-xs text-field-soft">
                  {item.members.join('、')} · {item.sourceLabel}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

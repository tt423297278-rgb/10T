import { useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Archive, BookOpen, FileText, Maximize2, X } from 'lucide-react'
import type { AidArchiveImage } from '../../data/agriAidTimeline'

type AgriAidResourceGalleryProps = {
  images: AidArchiveImage[]
}

export function AgriAidResourceGallery({ images }: AgriAidResourceGalleryProps) {
  const [expanded, setExpanded] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const visibleImages = expanded ? images : images.slice(0, 3)
  const preview = images.find((item) => item.id === previewId)

  return (
    <section className="agri-board-archive paper-panel" aria-labelledby="agri-aid-archive-title">
      <div className="agri-board-archive-head">
        <div>
          <p className="field-tag">资料存档</p>
          <h3 id="agri-aid-archive-title">助农行动档案柜</h3>
        </div>
        <p>页面主体使用原创纸艺 UI。完整长图仅作为资料存档，点击档案封套后查看。</p>
      </div>
      <div className="agri-board-archive-grid">
        {visibleImages.map((item, index) => (
          <article key={item.id} className="agri-board-archive-card" style={{ '--archive-index': index } as CSSProperties}>
            <button type="button" className="agri-board-archive-file" onClick={() => setPreviewId(item.id)}>
              <span className="agri-board-archive-file-icon" aria-hidden="true">
                {index % 2 === 0 ? <Archive size={28} /> : <FileText size={28} />}
              </span>
              <span className="agri-board-archive-file-type">{item.type}</span>
              <strong>{item.title}</strong>
              <small>{item.yearRange ?? '专题资料'}</small>
              <span className="agri-board-archive-file-action">
                <Maximize2 size={15} aria-hidden="true" />
                打开档案
              </span>
            </button>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      {images.length > 3 ? (
        <button type="button" className="agri-board-gallery-toggle interactive-press" onClick={() => setExpanded((value) => !value)}>
          <BookOpen size={17} aria-hidden="true" />
          {expanded ? '收起档案柜' : `展开全部 ${images.length} 份资料`}
        </button>
      ) : null}
      {preview
        ? createPortal(
            <div className="agri-board-preview" role="dialog" aria-modal="true" aria-label={`${preview.title}预览`}>
              <button type="button" className="agri-board-preview-backdrop" aria-label="关闭预览" onClick={() => setPreviewId(null)} />
              <div className="agri-board-preview-paper">
                <button type="button" className="agri-board-preview-close" aria-label="关闭预览" onClick={() => setPreviewId(null)}>
                  <X size={18} aria-hidden="true" />
                </button>
                <img src={preview.image} alt={preview.title} />
                <div>
                  <span>{preview.type}{preview.yearRange ? ` / ${preview.yearRange}` : ''}</span>
                  <strong>{preview.title}</strong>
                  <p>{preview.description}</p>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}

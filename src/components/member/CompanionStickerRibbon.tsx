import { Heart, Sparkles, Sprout } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  companionStickers,
  getCompanionStickerFromPathname,
} from '../../data/companionStickers'
import { getFanHomeDecor } from '../../data/fanHomeDecor'

export function CompanionStickerRibbon() {
  const location = useLocation()
  const decor = getFanHomeDecor(location.pathname)
  const memberSticker = getCompanionStickerFromPathname(location.pathname)
  const featuredStickers = memberSticker
    ? [memberSticker]
    : decor.stickerIndexes.map((index) => companionStickers[index])
  const rosterStickers = memberSticker ? [memberSticker] : companionStickers

  return (
    <aside
      className={`companion-ribbon${memberSticker ? ' companion-ribbon-member-detail' : ''}`}
      aria-label={memberSticker ? `${memberSticker.name}的卡通形象导航` : '十位成员卡通贴纸导航'}
    >
      <div className="field-container companion-ribbon-inner">
        <div className="companion-ribbon-copy">
          <span className="companion-ribbon-seal" aria-hidden="true">
            <Sprout size={17} />
          </span>
          <span>
            <strong>{memberSticker ? `${memberSticker.name}的这一页` : '田边伙伴已到齐'}</strong>
            <small>{memberSticker ? '本页装饰只使用他的卡通形象' : '十个人，陪你继续翻这本田野手账'}</small>
          </span>
          <Sparkles className="companion-ribbon-sparkle" size={18} aria-hidden="true" />
        </div>

        <div className="companion-ribbon-note">
          <span className="companion-ribbon-tape" aria-hidden="true" />
          <div className="companion-ribbon-note-copy">
            <span>{memberSticker ? '人物专属手账' : decor.eyebrow}</span>
            <strong>{memberSticker ? `${memberSticker.name} · 成长档案` : decor.title}</strong>
            <small>{memberSticker ? '照片、节点与公开记录，都收进属于他的这一页。' : decor.note}</small>
          </div>
          <div className="companion-ribbon-featured" aria-hidden="true">
            {featuredStickers.map((sticker) => (
              <img key={sticker.memberId} src={sticker.src} alt="" width="360" height="592" />
            ))}
          </div>
          <Heart className="companion-ribbon-heart" size={17} fill="currentColor" aria-hidden="true" />
        </div>

        <nav className="companion-ribbon-roster" aria-label="成员贴纸快捷入口">
          <span className="companion-ribbon-roster-label">{memberSticker ? '本页主角' : '十人都在'}</span>
          {memberSticker ? (
            <Link className="companion-ribbon-back" to="/members">返回十人档案</Link>
          ) : null}
          {rosterStickers.map((sticker, index) => (
            <Link
              key={sticker.memberId}
              to={`/members/${sticker.memberId}`}
              className="companion-ribbon-sticker interactive-press"
              aria-label={`查看${sticker.name}的成员档案`}
              title={sticker.name}
              aria-current={memberSticker ? 'page' : undefined}
            >
              <img
                src={sticker.src}
                alt=""
                width="360"
                height="592"
                loading={index < 5 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

import { Heart, MessageCircleHeart, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  companionStickers,
  getCompanionStickerFromPathname,
} from '../../data/companionStickers'

export function SiteFooter() {
  const location = useLocation()
  const memberSticker = getCompanionStickerFromPathname(location.pathname)
  const footerStickers = memberSticker ? [memberSticker] : companionStickers.slice(0, 3)

  return (
    <footer className="fan-home-footer mt-16 pb-24 pt-10 md:pb-10">
      <div className="field-container fan-home-footer-grid">
        <div className="fan-home-footer-postcard">
          <span className="fan-home-footer-tape" aria-hidden="true" />
          <div className={`fan-home-footer-stickers${memberSticker ? ' fan-home-footer-stickers-current' : ''}`}>
            {footerStickers.map((sticker) => (
              <Link
                key={sticker.memberId}
                to={`/members/${sticker.memberId}`}
                aria-label={`查看${sticker.name}的成员档案`}
                title={sticker.name}
              >
                <img src={sticker.src} alt="" width="360" height="592" loading="lazy" decoding="async" />
              </Link>
            ))}
          </div>
          <div className="fan-home-footer-message">
            <span><MessageCircleHeart size={15} /> 家禾留言角</span>
            <strong>今天也一起长大</strong>
            <p>下次见面前，也要认真生活、好好吃饭。</p>
          </div>
          <Heart className="fan-home-footer-heart" size={18} fill="currentColor" aria-hidden="true" />
        </div>

        <div className="fan-home-footer-brand">
          <p className="field-tag mb-3">田野日志持续更新</p>
          <p className="font-serif text-xl font-semibold text-field-ink">十个勤天陪伴社区</p>
          <p className="mt-3 max-w-md text-sm text-field-soft">
            非官方粉丝社区原型，聚焦公开信息整理、陪伴记录和克制友好的互动。
          </p>
        </div>

        <nav aria-label="页脚链接" className="fan-home-footer-nav text-sm text-field-soft">
          <Link className="flex min-h-11 items-center" to="/about">网站说明</Link>
          <Link className="flex min-h-11 items-center" to="/rules">社区规则</Link>
          <Link className="flex min-h-11 items-center" to="/updates">成员动态</Link>
        </nav>

        <div className="fan-home-footer-legal text-sm text-field-soft">
          <p>内容来源需保留来源字段；未经授权不搬运图片、视频或第三方完整内容。</p>
          <p className="mt-2">联系与版权说明：待运营方补充。</p>
        </div>
      </div>

      <div className="field-container fan-home-footer-signoff" aria-hidden="true">
        <span><Sparkles size={14} /> 本页未完，陪伴继续</span>
        <i>TO BE CONTINUED · 10T FIELD NOTES</i>
      </div>
    </footer>
  )
}

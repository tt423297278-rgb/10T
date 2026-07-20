import { Heart, Sparkles, Sprout } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { getFanHomeDecor, type FanVisualTheme } from '../../data/fanHomeDecor'

const visualThemeAssets: Record<FanVisualTheme, string> = {
  'home-field': '/images/decor/field-horizon-home.webp',
  'people-wheat': '/images/decor/field-journal-wheat-overlay.webp',
  'event-wildflower': '/images/decor/wildflower-meadow-overlay.webp',
  'aid-seedling': '/images/decor/seedling-soil-overlay.webp',
  'canteen-harvest': '/images/decor/harvest-table-overlay.webp',
  'memory-film': '/images/decor/film-field-overlay.webp',
}

export function FanPageDoodles() {
  const location = useLocation()
  const decor = getFanHomeDecor(location.pathname)
  const visualThemeAsset = visualThemeAssets[decor.visualTheme]

  return (
    <div className="fan-page-doodles" aria-hidden="true">
      <img
        className={`fan-route-decoration fan-route-decoration-${decor.visualTheme}`}
        src={visualThemeAsset}
        alt=""
        decoding="async"
      />
      <span className="fan-doodle-tape fan-doodle-tape-left" />
      <span className="fan-doodle-tape fan-doodle-tape-right" />
      <span className="fan-doodle-note">
        <Sparkles size={14} />
        <small>{decor.eyebrow}</small>
        <strong>{decor.title}</strong>
        <i>一起长大</i>
      </span>
      <Heart className="fan-doodle-heart" size={31} />
      <Sprout className="fan-doodle-sprout" size={34} />
      <span className="fan-doodle-stitch" />
    </div>
  )
}

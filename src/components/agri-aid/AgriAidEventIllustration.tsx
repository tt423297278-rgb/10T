import type { AidBoardEvent } from '../../data/agriAidTimeline'

type Scene =
  | 'building'
  | 'beans'
  | 'tropical'
  | 'mooncake'
  | 'corn'
  | 'desert-tree'
  | 'ginseng'
  | 'pepper'
  | 'strawberry'
  | 'crayfish'
  | 'heart-harvest'
  | 'donation-box'
  | 'pig'
  | 'soap'
  | 'clothes'
  | 'greenhouse'
  | 'turnip'
  | 'salt'
  | 'school'
  | 'water-truck'
  | 'books'
  | 'rose'
  | 'tractor'
  | 'water-box'
  | 'dates'

const sceneByEvent: Record<string, Scene> = {
  '2023-company-founded': 'building',
  '2023-jinyun-live': 'beans',
  '2023-xishuangbanna-live': 'tropical',
  '2023-mid-autumn-live': 'mooncake',
  '2023-northeast-live': 'corn',
  '2024-tengger-trees': 'desert-tree',
  '2024-minqin-ginseng-fruit': 'ginseng',
  '2024-tongnan-pepper': 'pepper',
  '2024-jiande-strawberry': 'strawberry',
  '2024-xuyi-crayfish': 'crayfish',
  '2024-ainong-day': 'heart-harvest',
  '2024-food-donation': 'donation-box',
  '2024-autumn-live': 'corn',
  '2024-ningxiang-pig': 'pig',
  '2025-linkou-soap': 'soap',
  '2025-rikaze-clothes': 'clothes',
  '2025-youth-foundation': 'donation-box',
  '2025-niangla-greenhouse': 'greenhouse',
  '2025-nangqian-live': 'turnip',
  '2025-jiande-strawberry-again': 'strawberry',
  '2025-nangqian-salt': 'salt',
  '2025-ainong-day': 'heart-harvest',
  '2025-jiang-minqin-donation': 'donation-box',
  '2025-zxt-school-field': 'school',
  '2025-zxt-water-truck': 'water-truck',
  '2025-autumn-nangqian-result': 'turnip',
  '2025-lihao-aide-donation': 'donation-box',
  '2026-zxt-linyi-donation': 'donation-box',
  '2026-lihao-yangfan': 'donation-box',
  '2026-hhn-books': 'books',
  '2026-motuo-live': 'tropical',
  '2026-taklamakan-rose': 'rose',
  '2026-zyb-farm-machine': 'tractor',
  '2026-minqin-water': 'water-box',
  '2026-qiele-jujube-live': 'dates',
  '2026-qiele-fans': 'dates',
}

function Basket({ produce }: { produce: 'beans' | 'tropical' | 'pepper' | 'strawberry' | 'ginseng' | 'turnip' | 'dates' | 'corn' }) {
  return (
    <g>
      <ellipse className="scene-shadow" cx="60" cy="84" rx="39" ry="7" />
      <path className="scene-basket" d="M26 56h68l-9 28H35L26 56Z" />
      <path className="scene-basket-line" d="M32 64h56M36 72h48M43 56c4-18 30-18 34 0" />
      {produce === 'beans' ? (
        <g className="scene-produce-green" fill="none">
          <path d="M35 53c7-18 12-11 9 1M45 53c8-20 14-11 9 1M57 53c8-19 14-10 9 1M69 53c8-17 13-8 8 1M80 53c7-13 11-6 7 1" />
        </g>
      ) : null}
      {produce === 'tropical' ? (
        <g>
          <circle className="scene-fruit-gold" cx="42" cy="50" r="10" />
          <circle className="scene-fruit-red" cx="60" cy="47" r="11" />
          <circle className="scene-fruit-green" cx="78" cy="51" r="9" />
          <path className="scene-leaf" d="M57 35c-9-10-17-4-15 5 8 1 12-1 15-5ZM64 35c8-11 17-5 15 4-8 2-12 0-15-4Z" />
        </g>
      ) : null}
      {produce === 'pepper' ? (
        <g fill="none" className="scene-pepper">
          <path d="M35 49c10-16 19-7 12 4M48 48c12-18 23-7 13 6M62 48c12-17 22-6 13 6M76 48c10-13 18-4 10 6" />
          <path className="scene-leaf-stroke" d="M42 40c2-7 7-8 12-5M66 39c1-6 7-8 12-4" />
        </g>
      ) : null}
      {produce === 'strawberry' ? (
        <g>
          {[38, 52, 66, 80].map((x, index) => (
            <g key={x} transform={`translate(${x} ${index % 2 ? 47 : 51})`}>
              <path className="scene-fruit-red" d="M0-8c8 0 11 6 8 13C5 12 0 17 0 17S-5 12-8 5C-11-2-8-8 0-8Z" />
              <path className="scene-leaf" d="m-6-7 6-7 6 7-6-2-6 2Z" />
            </g>
          ))}
        </g>
      ) : null}
      {produce === 'ginseng' ? (
        <g>
          <circle className="scene-fruit-gold" cx="43" cy="49" r="12" />
          <circle className="scene-fruit-gold" cx="63" cy="47" r="13" />
          <circle className="scene-fruit-gold" cx="81" cy="51" r="10" />
          <path className="scene-detail" d="M38 46h2M48 52h2M59 43h2M67 51h2M78 48h2" />
          <path className="scene-leaf" d="M58 32c-8-9-15-3-13 5 7 1 10-1 13-5ZM65 33c8-9 15-3 13 5-7 1-11-1-13-5Z" />
        </g>
      ) : null}
      {produce === 'turnip' ? (
        <g>
          <circle className="scene-turnip" cx="43" cy="52" r="12" />
          <circle className="scene-turnip" cx="62" cy="48" r="14" />
          <circle className="scene-turnip" cx="81" cy="53" r="11" />
          <path className="scene-leaf" d="M55 35c-10-13-19-4-15 6 8 2 13-1 15-6ZM64 34c9-13 19-4 15 6-8 2-13-1-15-6Z" />
        </g>
      ) : null}
      {produce === 'dates' ? (
        <g>
          {[38, 49, 60, 71, 82].map((x, index) => (
            <ellipse key={x} className="scene-date-fruit" cx={x} cy={index % 2 ? 48 : 53} rx="7" ry="9" />
          ))}
          <path className="scene-leaf" d="M58 34c-8-10-16-3-13 5 7 1 11-1 13-5ZM65 34c8-10 16-3 13 5-7 1-11-1-13-5Z" />
        </g>
      ) : null}
      {produce === 'corn' ? (
        <g>
          {[41, 60, 79].map((x, index) => (
            <g key={x} transform={`translate(${x} ${index === 1 ? 45 : 51}) rotate(${index * 12 - 12})`}>
              <ellipse className="scene-fruit-gold" cx="0" cy="0" rx="7" ry="17" />
              <path className="scene-detail" d="M-4-10h8M-5-3h10M-5 4h10M-4 11h8M0-15v30" />
              <path className="scene-leaf" d="M-6 8c-8 1-10 7-8 13 8-2 11-6 8-13ZM6 8c8 1 10 7 8 13-8-2-11-6-8-13Z" />
            </g>
          ))}
        </g>
      ) : null}
    </g>
  )
}

function SceneArtwork({ scene }: { scene: Scene }) {
  if (['beans', 'tropical', 'pepper', 'strawberry', 'ginseng', 'turnip', 'dates', 'corn'].includes(scene)) {
    return <Basket produce={scene as Parameters<typeof Basket>[0]['produce']} />
  }

  if (scene === 'building') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="85" rx="42" ry="6" />
        <path className="scene-building" d="M23 79V35l37-17 37 17v44H23Z" />
        <path className="scene-window" d="M33 42h12v11H33zM53 42h14v11H53zM75 42h12v11H75zM33 60h12v11H33zM75 60h12v11H75z" />
        <path className="scene-door" d="M53 58h14v21H53z" />
        <path className="scene-gold" d="M60 18V8h24l-7 7 7 7H60" />
        <path className="scene-plant-stroke" d="M18 80c0-15 6-26 16-34M102 80c0-13-5-23-13-31" />
      </g>
    )
  }

  if (scene === 'mooncake') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="61" cy="83" rx="38" ry="7" />
        <ellipse className="scene-mooncake" cx="45" cy="58" rx="22" ry="18" />
        <ellipse className="scene-mooncake-top" cx="45" cy="53" rx="22" ry="15" />
        <circle className="scene-detail" cx="45" cy="53" r="7" fill="none" />
        <path className="scene-detail" d="m45 43 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-7Z" />
        <path className="scene-mooncake-cut" d="M67 68c4-20 24-23 32-7-3 16-20 24-32 7Z" />
        <path className="scene-detail" d="m79 53 5 19M73 58l17 10" />
      </g>
    )
  }

  if (scene === 'desert-tree') {
    return (
      <g>
        <path className="scene-sand" d="M7 77c22-21 42-5 58-18 19-15 34-6 48 8v19H7Z" />
        {[28, 55, 84].map((x, index) => (
          <g key={x} transform={`translate(${x} ${index === 1 ? 45 : 56})`}>
            <path className="scene-trunk" d="M0 27V0" />
            <path className="scene-leaf" d="M0 4c-14-5-17-17-8-25 11 4 15 13 8 25ZM1 4c14-5 17-17 8-25-11 4-15 13-8 25Z" />
          </g>
        ))}
        <circle className="scene-sun" cx="97" cy="22" r="9" />
      </g>
    )
  }

  if (scene === 'crayfish') {
    return (
      <g transform="translate(3 2)">
        <ellipse className="scene-shadow" cx="58" cy="82" rx="40" ry="7" />
        <path className="scene-crayfish" d="M48 72c-8-14-1-35 13-38 15 2 22 23 14 38-7 13-20 13-27 0Z" />
        <path className="scene-detail-light" d="M50 47h23M48 55h28M49 63h25" />
        <path className="scene-crayfish" d="M49 42 31 30l-13 7 14 13M74 42l18-12 13 7-14 13" />
        <path className="scene-detail" d="M51 34 42 18M71 34l9-16M55 31h2M67 31h2" />
      </g>
    )
  }

  if (scene === 'pig') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="83" rx="40" ry="7" />
        <ellipse className="scene-pig" cx="61" cy="56" rx="38" ry="25" />
        <circle className="scene-pig-light" cx="82" cy="52" r="20" />
        <path className="scene-pig" d="m72 37 2-15 12 12M91 38l12-9-2 17" />
        <ellipse className="scene-pig-snout" cx="91" cy="57" rx="12" ry="8" />
        <circle className="scene-detail" cx="87" cy="57" r="1.5" />
        <circle className="scene-detail" cx="95" cy="57" r="1.5" />
        <circle className="scene-detail" cx="85" cy="48" r="2" />
        <path className="scene-detail" d="M28 49c-12-9-12 8-3 9M39 74v10M72 76v8" />
      </g>
    )
  }

  if (scene === 'heart-harvest') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="37" ry="6" />
        <path className="scene-heart" d="M60 75 30 47c-18-19 10-39 30-17 20-22 48-2 30 17L60 75Z" />
        <path className="scene-detail-light" d="M45 48c8 6 22 6 30 0" />
        <path className="scene-plant-stroke" d="M44 78c0-16-4-28-12-39M77 79c0-17 4-30 13-42" />
      </g>
    )
  }

  if (scene === 'donation-box' || scene === 'water-box') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="40" ry="7" />
        <path className="scene-box" d="M24 45h72v38H24z" />
        <path className="scene-box-top" d="m24 45 14-16h44l14 16M60 29v54" />
        {scene === 'donation-box' ? (
          <path className="scene-heart" d="M60 67 47 55c-8-9 5-18 13-8 8-10 21-1 13 8L60 67Z" />
        ) : (
          <g>
            {[43, 60, 77].map((x) => (
              <g key={x} transform={`translate(${x} 19)`}>
                <path className="scene-water" d="M-6 7h12l2 22H-8L-6 7Z" />
                <path className="scene-detail" d="M-4 3h8v5h-8z" />
              </g>
            ))}
          </g>
        )}
      </g>
    )
  }

  if (scene === 'soap') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="38" ry="7" />
        <rect className="scene-soap" x="28" y="43" width="50" height="31" rx="9" />
        <rect className="scene-soap-light" x="52" y="29" width="42" height="29" rx="8" transform="rotate(8 52 29)" />
        <circle className="scene-berry" cx="34" cy="34" r="6" />
        <circle className="scene-berry" cx="45" cy="29" r="7" />
        <circle className="scene-berry" cx="54" cy="36" r="6" />
        <path className="scene-leaf" d="M42 20c-8-8-15-2-13 5 7 1 10-1 13-5Z" />
        <path className="scene-detail-light" d="M39 56h26M63 44h20" />
      </g>
    )
  }

  if (scene === 'clothes') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="40" ry="7" />
        <path className="scene-clothes" d="M27 35 44 23h32l17 12-10 16-8-6v35H45V45l-8 6-10-16Z" />
        <path className="scene-clothes-light" d="m48 24 12 15 12-15M46 54h29M60 39v41" />
        <path className="scene-scarf" d="M51 23c2 12 6 18 9 22 4-4 8-10 10-22" />
      </g>
    )
  }

  if (scene === 'greenhouse') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="45" ry="6" />
        <path className="scene-greenhouse" d="M14 79c2-39 26-62 46-62s44 23 46 62H14Z" />
        <path className="scene-detail-light" d="M60 17v62M27 46h66M31 79c2-26 13-46 29-62M89 79c-2-26-13-46-29-62" />
        <path className="scene-plant-stroke" d="M39 76c0-14-5-23-13-30M58 77c0-17 5-29 14-39M78 77c0-12 4-20 11-27" />
      </g>
    )
  }

  if (scene === 'salt') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="42" ry="6" />
        <path className="scene-salt" d="M18 78c12-34 31-45 42-45s30 11 42 45H18Z" />
        <path className="scene-detail-light" d="M31 67c12-6 39-6 58 0M42 53c10-5 24-5 36 0" />
        <circle className="scene-sun" cx="94" cy="24" r="9" />
        <path className="scene-detail" d="M94 8v7M94 33v7M78 24h7M103 24h7" />
      </g>
    )
  }

  if (scene === 'school') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="44" ry="6" />
        <path className="scene-school" d="M22 77V41l38-22 38 22v36H22Z" />
        <path className="scene-roof" d="m15 43 45-28 45 28-7 8-38-23-38 23-7-8Z" />
        <path className="scene-window" d="M33 48h14v12H33zM73 48h14v12H73z" />
        <path className="scene-door" d="M51 49h18v28H51z" />
        <path className="scene-field" d="M15 82c24-8 66-8 90 0M34 77c10-5 42-5 52 0" />
      </g>
    )
  }

  if (scene === 'water-truck') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="61" cy="84" rx="44" ry="6" />
        <path className="scene-truck" d="M16 48h58v27H16zM74 57h17l13 18H74z" />
        <rect className="scene-water" x="25" y="35" width="43" height="27" rx="13" />
        <circle className="scene-wheel" cx="36" cy="77" r="10" />
        <circle className="scene-wheel" cx="87" cy="77" r="10" />
        <path className="scene-detail-light" d="M30 48h33M84 62h9" />
      </g>
    )
  }

  if (scene === 'books') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="40" ry="6" />
        <path className="scene-book-green" d="M24 62h70v16H24z" />
        <path className="scene-book-gold" d="M31 44h63v17H31z" />
        <path className="scene-book-red" d="M22 27h60v16H22z" />
        <path className="scene-detail-light" d="M31 70h48M40 53h45M31 35h39" />
        <path className="scene-leaf" d="M86 23c7-11 16-4 13 5-7 2-11 0-13-5Z" />
      </g>
    )
  }

  if (scene === 'rose') {
    return (
      <g>
        <path className="scene-sand" d="M8 79c25-15 72-15 104 0v9H8Z" />
        {[31, 58, 86].map((x, index) => (
          <g key={x} transform={`translate(${x} ${index === 1 ? 38 : 48})`}>
            <path className="scene-trunk" d="M0 35V8" />
            <path className="scene-rose" d="M0 11c-13-1-12-16-3-17 4-10 17-5 15 4 10 5 3 17-7 13-2 6-8 7-11 2" />
            <path className="scene-leaf" d="M0 22c-10-7-16 1-11 8 6-1 9-4 11-8ZM1 27c9-7 15 0 11 7-6 0-9-2-11-7Z" />
          </g>
        ))}
      </g>
    )
  }

  if (scene === 'tractor') {
    return (
      <g>
        <ellipse className="scene-shadow" cx="60" cy="84" rx="45" ry="6" />
        <circle className="scene-wheel" cx="37" cy="70" r="19" />
        <circle className="scene-wheel" cx="91" cy="72" r="12" />
        <path className="scene-tractor" d="M35 64h29l10-27h20l10 27H74l-8 12H53" />
        <path className="scene-tractor-light" d="M58 37V20h25l8 17M61 28h25M20 53h21" />
        <path className="scene-detail-light" d="M37 61v18M91 65v14" />
      </g>
    )
  }

  return <Basket produce="tropical" />
}

export function AgriAidEventIllustration({ event }: { event: AidBoardEvent }) {
  const scene = sceneByEvent[event.id] ?? 'tropical'

  return (
    <svg className="agri-event-scene" viewBox="0 0 120 96" aria-hidden="true">
      <SceneArtwork scene={scene} />
    </svg>
  )
}

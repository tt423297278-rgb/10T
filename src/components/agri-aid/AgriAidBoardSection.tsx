import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { BookOpen, CalendarDays, HandHeart, Route, Sprout } from 'lucide-react'
import './agri-aid-collage.css'
import {
  aidArchiveImages,
  aidBoardCategories,
  aidBoardEvents,
  aidBoardYearLabels,
  aidBoardYears,
  aidDonationRecords,
  aidModeCards,
  aidRecognitionCards,
  aidRecognitionSummary,
  aidRegionResults,
  type AidBoardYear,
} from '../../data/agriAidTimeline'
import { StateBlock } from '../common/StateBlock'
import { AgriAidBoardNode } from './AgriAidBoardNode'
import { AgriAidEventDetail } from './AgriAidEventDetail'
import { AgriAidIcon } from './AgriAidIcon'
import { AgriAidResourceGallery } from './AgriAidResourceGallery'

type FilterYear = (typeof aidBoardYears)[number]
type FilterCategory = (typeof aidBoardCategories)[number]

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`agri-board-filter-button interactive-press ${active ? 'agri-board-filter-button-active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function isBoardYear(value: FilterYear): value is AidBoardYear {
  return value !== '全部'
}

export function AgriAidBoardSection() {
  const [year, setYear] = useState<FilterYear>('全部')
  const [category, setCategory] = useState<FilterCategory>('全部')
  const [activeId, setActiveId] = useState(aidBoardEvents[0]?.id ?? '')
  const [selectedId, setSelectedId] = useState('')

  const filteredEvents = useMemo(
    () =>
      aidBoardEvents.filter((event) => {
        const yearMatched = year === '全部' || event.year === year
        const categoryMatched = category === '全部' || event.category === category
        return yearMatched && categoryMatched
      }),
    [category, year],
  )

  useEffect(() => {
    const firstEvent = filteredEvents[0]?.id ?? ''
    setActiveId(firstEvent)
    setSelectedId('')
  }, [filteredEvents])

  const activeEvent =
    filteredEvents.find((event) => event.id === (selectedId || activeId)) ?? filteredEvents[0]

  const yearGroups = useMemo(() => {
    const years = aidBoardYears.filter(isBoardYear).filter((item) => year === '全部' || item === year)

    return years
      .map((item) => ({
        year: item,
        events: filteredEvents
          .filter((event) => event.year === item)
          .sort((first, second) => first.date.localeCompare(second.date)),
      }))
      .filter((group) => group.events.length > 0)
  }, [filteredEvents, year])

  const majorCount = filteredEvents.filter((event) => event.importance === 'major' || event.importance === 'milestone').length
  const categoryCount = new Set(filteredEvents.map((event) => event.category)).size

  return (
    <section className="field-section field-section-mist agri-board-section py-12">
      <div className="field-container">
        <div className="agri-board-header paper-panel">
          <div>
            <p className="field-tag">助农</p>
            <p className="agri-board-kicker">FIELD AID TIMELINE / 2023 - 2026</p>
            <h2>助农行动时间线</h2>
            <p className="agri-board-intro">
              从成立到多地助农，把每一次真实抵达整理成一条正在继续生长的路线。每一个节点，都是一次真实抵达；每一次行动，都让助农从直播走向长期陪伴。
            </p>
          </div>
          <div className="agri-board-stamp" aria-label="助农行动档案 2023 到 2026">
            <Route size={22} aria-hidden="true" />
            <strong>2023 - 2026</strong>
            <span>时间线海报</span>
          </div>
        </div>

        <div className="agri-board-filter-panel paper-panel">
          <div>
            <p>
              <CalendarDays size={17} aria-hidden="true" />
              年份
            </p>
            <div className="agri-board-filter-scroll">
              {aidBoardYears.map((item) => (
                <FilterButton key={item} active={year === item} onClick={() => setYear(item)}>
                  {item}
                </FilterButton>
              ))}
            </div>
          </div>
          <div>
            <p>
              <Sprout size={17} aria-hidden="true" />
              类型
            </p>
            <div className="agri-board-filter-scroll">
              {aidBoardCategories.map((item) => (
                <FilterButton key={item} active={category === item} onClick={() => setCategory(item)}>
                  {item}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>

        {filteredEvents.length ? (
          <div className="agri-board-layout">
            <div className="agri-board-map paper-panel" aria-label="助农行动路线棋盘">
              <div className="agri-board-map-head">
                <div>
                  <p className="field-tag">路线棋盘</p>
                  <h3>手绘蛇形路线</h3>
                </div>
                <div className="agri-board-map-stats" aria-label="当前筛选结果">
                  <span>{filteredEvents.length} 个节点</span>
                  <span>{majorCount} 个重点</span>
                  <span>{categoryCount} 类行动</span>
                </div>
              </div>

              <div className="agri-board-map-paper">
                {yearGroups.map((group) => {
                  const events = group.events
                  return (
                    <section
                      key={group.year}
                      className="agri-board-year-row"
                      aria-label={`${group.year} ${aidBoardYearLabels[group.year]}`}
                    >
                      <header className="agri-board-year-heading">
                        <span>{group.year}</span>
                        <strong>{aidBoardYearLabels[group.year]}</strong>
                        <small>{group.events.length} 个事件</small>
                      </header>
                      <div className="agri-board-route-grid" role="list">
                        {events.map((event, eventIndex) => (
                          <AgriAidBoardNode
                            key={event.id}
                            event={event}
                            index={eventIndex}
                            active={activeEvent?.id === event.id}
                            selected={selectedId === event.id}
                            onActivate={setActiveId}
                            onSelect={(id) => setSelectedId((current) => (current === id ? '' : id))}
                          />
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            </div>

            <aside className="agri-board-side">
              {activeEvent ? <AgriAidEventDetail event={activeEvent} /> : null}
              <div className="agri-board-hint paper-panel">
                <BookOpen size={20} aria-hidden="true" />
                <p>移到格子上看右侧摘要，点击后固定事件档案。完整长图已经移到底部图册，不再重复塞进节点。</p>
              </div>
            </aside>
          </div>
        ) : (
          <StateBlock type="empty" title="这一年的田野记录还在整理中" description="可以切换年份或类型，查看其他助农行动节点。" />
        )}

        <section className="agri-board-insight-section paper-panel">
          <div className="agri-board-section-head">
            <p className="field-tag">重点地区成果</p>
            <h3>既卖得出去，也帮产业走得更远</h3>
          </div>
          <div className="agri-board-region-grid">
            {aidRegionResults.map((item, index) => (
              <article key={item.id} className="agri-board-region-card" style={{ '--node-index': index } as CSSProperties}>
                <AgriAidIcon type={item.icon} aria-hidden="true" />
                <span>{item.type}</span>
                <h4>{item.region}</h4>
                <p>{item.result}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="agri-board-insight-section paper-panel">
          <div className="agri-board-section-head">
            <p className="field-tag">助农模式总结</p>
            <h3>把一次直播，变成长期陪伴</h3>
          </div>
          <div className="agri-board-mode-grid">
            {aidModeCards.map((item, index) => (
              <article key={item.id} className="agri-board-mode-card">
                <span className="agri-board-mode-index">{String(index + 1).padStart(2, '0')}</span>
                <AgriAidIcon type={item.icon} aria-hidden="true" />
                <h4>{item.mode}</h4>
                <p>{item.description}</p>
                <small>{item.example}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="agri-board-insight-section agri-board-donation-section paper-panel">
          <div className="agri-board-section-head">
            <p className="field-tag">公益捐赠汇总</p>
            <h3>每一份善意都在发光</h3>
            <p>善意落到实处，帮助持续发生。</p>
          </div>
          <ol className="agri-board-donation-list">
            {aidDonationRecords.map((item) => (
              <li key={item.id}>
                <span>{item.date}</span>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="agri-board-insight-section paper-panel">
          <div className="agri-board-section-head">
            <p className="field-tag">社会认可与传播影响</p>
            <h3>流量不只停留在屏幕，更落到乡村中</h3>
          </div>
          <div className="agri-board-recognition-grid">
            {aidRecognitionCards.map((item) => (
              <article key={item.id} className="agri-board-recognition-card">
                <AgriAidIcon type={item.icon} aria-hidden="true" />
                <h4>{item.title}</h4>
                <p>{item.content}</p>
              </article>
            ))}
          </div>
          <div className="agri-board-recognition-summary">
            {aidRecognitionSummary.map((item) => (
              <div key={item.title}>
                <HandHeart size={18} aria-hidden="true" />
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <AgriAidResourceGallery images={aidArchiveImages} />

        <div className="agri-board-final-banner">
          <span>把一次直播，变成长期陪伴。</span>
        </div>
      </div>
    </section>
  )
}

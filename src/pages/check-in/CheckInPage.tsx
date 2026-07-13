import { useMemo } from 'react'
import { Stamp, Wheat } from 'lucide-react'
import { calculateCheckInStats } from '../../features/check-in/checkInLogic'
import { useAppStore } from '../../app/store/useAppStore'
import { Button } from '../../components/common/Button'
import { PageMeta } from '../../components/common/PageMeta'
import { SectionHeader } from '../../components/common/SectionHeader'
import { StateBlock } from '../../components/common/StateBlock'
import { authService } from '../../features/auth/authService'
import { toAuthMessage } from '../../features/auth/authErrors'
import { useCheckInsQuery, usePerformCheckInMutation, usePointLedgerQuery } from '../../hooks/useCheckInData'

const today = new Date().toISOString().slice(0, 10)
const currentMonth = today.slice(0, 7)
const emptyRecords: string[] = []

export default function CheckInPage() {
  const user = useAppStore((state) => state.user)
  const setToast = useAppStore((state) => state.setToast)
  const checkInsQuery = useCheckInsQuery()
  const pointLedgerQuery = usePointLedgerQuery()
  const performCheckIn = usePerformCheckInMutation()
  const records = checkInsQuery.data ?? emptyRecords
  const pointLedger = pointLedgerQuery.data ?? []
  const stats = useMemo(() => calculateCheckInStats(records, today), [records])
  const balance = pointLedger[0]?.balanceAfter ?? 0
  const monthDayCount = new Date(Number(currentMonth.slice(0, 4)), Number(currentMonth.slice(5, 7)), 0).getDate()
  const monthDays = Array.from({ length: monthDayCount }, (_, index) => `${currentMonth}-${String(index + 1).padStart(2, '0')}`)

  const checkIn = async () => {
    if (!user) {
      setToast('请先登录后再签到')
      return
    }

    if (!authService.isConfigured) {
      setToast('当前未配置 Supabase，签到会以本地演示数据展示。')
      return
    }

    try {
      const result = await performCheckIn.mutateAsync()
      setToast(result.alreadyChecked ? '今天已经签到过了' : `签到成功，麦粒值 +${result.amount}`)
    } catch (error) {
      setToast(toAuthMessage(error))
    }
  }

  return (
    <section className="atmosphere-page checkin-atmosphere py-12">
      <div className="field-container">
      <PageMeta title="每日签到" description="每日签到、连续天数、累计天数和麦粒值明细。" path="/check-in" />
      <SectionHeader
        level={1}
        eyebrow="每日签到"
        title="把今天盖进陪伴手册"
        description="正式签到通过 Supabase RPC 服务端校验，防止重复签到和前端伪造麦粒值。"
      />
      {!user ? (
        <StateBlock type="auth" title="登录后签到" description="签到、连续天数和麦粒值会记录到你的陪伴手册中。" />
      ) : null}
      <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="paper-panel growth-panel p-6">
          <div className="stamp-motion flex size-16 items-center justify-center rounded-[14px] border border-field-green/18 bg-sprout-green/12 text-field-green">
            <Stamp size={30} aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-serif text-3xl font-semibold text-field-ink">慢慢生长，也会长出答案</h2>
          <p className="mt-3 text-field-soft">今日一句由后台维护，视觉保持手册盖章感，不做游戏积分面板。</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="record-card rounded-[10px] border border-paper-line bg-field-surface/70 p-3"><p className="font-mono text-2xl font-semibold text-field-green">{stats.currentStreak}</p><p className="text-xs text-field-soft">连续天数</p></div>
            <div className="record-card rounded-[10px] border border-paper-line bg-field-surface/70 p-3"><p className="font-mono text-2xl font-semibold text-field-green">{stats.totalDays}</p><p className="text-xs text-field-soft">累计天数</p></div>
            <div className="record-card rounded-[10px] border border-paper-line bg-field-surface/70 p-3"><p className="font-mono text-2xl font-semibold text-wheat-strong">{balance}</p><p className="text-xs text-field-soft">麦粒值</p></div>
          </div>
          <div className="mt-5 grid grid-cols-5 gap-2" aria-label="签到成长阶段">
            {['种子', '发芽', '幼苗', '抽穗', '麦田'].map((stage, index) => (
              <div key={stage} className={`rounded-[8px] border p-2 text-center text-xs ${index <= Math.min(stats.currentStreak, 4) ? 'growth-step-active border-field-green/25 bg-sprout-green/12 text-field-green' : 'border-paper-line bg-field-surface text-field-soft'}`}>
                {stage}
              </div>
            ))}
          </div>
          <Button disabled={!user || stats.checkedInToday || performCheckIn.isPending} onClick={checkIn} isLoading={performCheckIn.isPending} className="mt-6 w-full">
            <Wheat size={16} aria-hidden="true" />
            {stats.checkedInToday ? '今日已签到' : '盖下今日印章'}
          </Button>
          {stats.checkedInToday ? <p className="mt-3 text-sm text-field-green">今天已经记录在手册里。</p> : null}
        </div>

        <div className="paper-panel calendar-shell p-5">
          <h2 className="font-serif text-2xl font-semibold">本月签到日历</h2>
          {checkInsQuery.isLoading ? (
            <StateBlock type="loading" title="正在读取签到记录" description="签到日历正在加载。" />
          ) : (
            <div className="mt-4 grid grid-cols-7 gap-2">
              {monthDays.map((date) => {
                const checked = records.includes(date)
                return (
                  <div key={date} className={`flex aspect-square items-center justify-center rounded-[10px] border text-sm transition duration-300 ease-field ${checked ? 'growth-step-active border-field-green/35 bg-sprout-green/12 text-field-green' : 'border-paper-line bg-field-surface text-field-soft hover:border-field-green/20 hover:bg-sprout-green/10'}`}>
                    {Number(date.slice(8, 10))}
                  </div>
                )
              })}
            </div>
          )}
          <h3 className="mt-6 font-serif text-xl font-semibold">麦粒值明细</h3>
          <div className="mt-3 grid gap-3">
            {pointLedger.map((entry) => (
              <div key={entry.id} className="record-card flex items-center justify-between rounded-[10px] border border-paper-line bg-field-surface p-3 text-sm">
                <div>
                  <p>{entry.reason}</p>
                  <p className="text-xs text-field-soft">{new Date(entry.createdAt).toLocaleString('zh-CN')}</p>
                </div>
                <span className="font-mono text-field-green">{entry.amount > 0 ? '+' : ''}{entry.amount}</span>
              </div>
            ))}
            {!pointLedger.length ? <StateBlock type="empty" title="还没有麦粒值记录" description="完成签到后会出现第一条明细。" /> : null}
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

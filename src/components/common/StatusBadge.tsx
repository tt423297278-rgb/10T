import { cn } from '../../lib/utils/cn'

const toneMap: Record<string, string> = {
  即将开始: 'border-sprout-green/35 bg-sprout-green/12 text-field-green',
  正在进行: 'border-wheat/40 bg-wheat/15 text-soil-brown',
  已结束: 'border-paper-line bg-field-muted text-field-soft',
  待确认: 'border-sky-blue/60 bg-sky-blue/28 text-[#526f78]',
  已取消: 'border-brick/30 bg-brick/10 text-brick',
  已延期: 'border-brick/30 bg-brick/10 text-brick',
  审核中: 'border-sky-blue/60 bg-sky-blue/28 text-[#526f78]',
  已发布: 'border-sprout-green/35 bg-sprout-green/12 text-field-green',
}

export function StatusBadge({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-semibold',
        toneMap[children] ?? 'border-paper-line bg-field-surface text-field-soft',
        className,
      )}
    >
      {children}
    </span>
  )
}

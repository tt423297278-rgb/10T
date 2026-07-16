import type { FanEvent } from '../types/domain'

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

export function formatIcsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function formatIcsAllDayDate(value: string, addDays = 0) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + addDays))
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}

export function buildEventIcs(event: FanEvent, memberNames: string[]) {
  const endsAt = event.endsAt ?? event.startsAt
  const description = [
    event.description,
    `参与成员：${memberNames.join('、') || '待确认'}`,
    `信息来源：${event.sourceLabel}`,
  ].join('\n')

  const dateLines = event.timeTbd
    ? [
        `DTSTART;VALUE=DATE:${formatIcsAllDayDate(event.startsAt)}`,
        `DTEND;VALUE=DATE:${formatIcsAllDayDate(endsAt, 1)}`,
      ]
    : [
        `DTSTART:${formatIcsDate(event.startsAt)}`,
        `DTEND:${formatIcsDate(endsAt)}`,
      ]

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//10T WEB//Fan Event Calendar//ZH-CN',
    'BEGIN:VEVENT',
    `UID:${event.id}@10t-web.local`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    ...dateLines,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(`${event.platform} ${event.location}`.trim())}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

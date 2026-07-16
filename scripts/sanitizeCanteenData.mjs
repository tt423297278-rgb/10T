import fs from 'node:fs/promises'
import path from 'node:path'

const dataDirectory = path.resolve(process.cwd(), 'public/data/canteen/regions')

const directContactPatterns = [
  /(?<!\d)1[3-9]\d{9}(?!\d)/gu,
  /(?:微信|微\s*信|VX|vx|V信|v信|WX|wx|QQ|qq|Q群|q群)\s*(?:号|[:：])?\s*[A-Za-z0-9_-]{4,}/gu,
]

const contactRequestPattern = /(?:加我|联系我|私聊我|找我)(?:的)?(?:微信|微\s*信|VX|vx|V信|v信|WX|wx|QQ|qq|Q群|q群)?[^。；;！!？?\n]{0,48}/gu
const closedPattern = /(?:已经|已经)?关门了|已关门|倒闭了?|已倒闭|闭店|歇业|停业|店没了|已经搬走|搬走了|已搬迁/u
const redactionLabel = '联系信息已隐藏'

export function sanitizeCanteenFreeText(value) {
  if (typeof value !== 'string' || !value.trim()) return value

  let sanitized = value
  directContactPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, redactionLabel)
  })
  sanitized = sanitized.replace(contactRequestPattern, redactionLabel)

  return sanitized
    .replace(/(?:联系信息已隐藏[，,、；;。\s]*){2,}/gu, '联系信息已隐藏；')
    .replace(/\s{2,}/gu, ' ')
    .trim()
}

export function inferCanteenOperatingStatus(record) {
  const text = `${record.note ?? ''} ${record.tips ?? ''}`
  return closedPattern.test(text) ? 'closed' : undefined
}

async function main() {
  const files = (await fs.readdir(dataDirectory))
    .filter((file) => file.endsWith('.json'))
    .sort()

  let recordCount = 0
  let redactedRecordCount = 0
  let closedRecordCount = 0

  for (const file of files) {
    const filePath = path.join(dataDirectory, file)
    const records = JSON.parse(await fs.readFile(filePath, 'utf8'))

    const sanitizedRecords = records.map((record) => {
      recordCount += 1
      const nextNote = sanitizeCanteenFreeText(record.note)
      const nextTips = sanitizeCanteenFreeText(record.tips)
      const wasRedacted = nextNote !== record.note
        || nextTips !== record.tips
        || nextNote?.includes(redactionLabel)
        || nextTips?.includes(redactionLabel)
      const status = record.status ?? inferCanteenOperatingStatus(record)

      if (wasRedacted) redactedRecordCount += 1
      if (status === 'closed') closedRecordCount += 1

      const nextRecord = { ...record }
      if (nextNote) nextRecord.note = nextNote
      else delete nextRecord.note
      if (nextTips) nextRecord.tips = nextTips
      else delete nextRecord.tips
      if (status) nextRecord.status = status
      return nextRecord
    })

    await fs.writeFile(filePath, `${JSON.stringify(sanitizedRecords)}\n`, 'utf8')
  }

  console.log(JSON.stringify({
    fileCount: files.length,
    recordCount,
    redactedRecordCount,
    closedRecordCount,
  }, null, 2))
}

await main()

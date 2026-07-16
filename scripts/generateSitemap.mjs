import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const publicRoutes = [
  '/',
  '/members',
  '/events',
  '/agri-aid',
  '/canteen',
  '/check-in',
  '/community',
  '/moments',
  '/gallery',
  '/updates',
  '/about',
  '/rules',
]

async function readLocalAppUrl() {
  for (const filename of ['.env.local', '.env']) {
    try {
      const content = await readFile(resolve(filename), 'utf8')
      const match = content.match(/^VITE_APP_URL\s*=\s*(.+)$/m)
      if (match?.[1]) return match[1].trim().replace(/^['"]|['"]$/g, '')
    } catch {
      // An environment file is optional; continue to the next source.
    }
  }
  return undefined
}

const argumentBaseUrl = process.argv.find((argument) => argument.startsWith('--base='))?.slice('--base='.length)
const baseUrl = (argumentBaseUrl || process.env.VITE_APP_URL || await readLocalAppUrl() || 'http://localhost:5173').replace(/\/$/, '')
const sitemapPath = resolve('public/sitemap.xml')
const robotsPath = resolve('public/robots.txt')
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...publicRoutes.map((route) => `  <url><loc>${new URL(route, `${baseUrl}/`).toString()}</loc></url>`),
  '</urlset>',
  '',
].join('\n')

await writeFile(sitemapPath, sitemap, 'utf8')
await writeFile(robotsPath, `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`, 'utf8')

if (/localhost|127\.0\.0\.1/.test(baseUrl)) {
  console.warn('已生成本地 sitemap；正式部署前请用 --base=https://你的域名 重新生成。')
} else {
  console.log(`已生成生产 sitemap：${baseUrl}`)
}

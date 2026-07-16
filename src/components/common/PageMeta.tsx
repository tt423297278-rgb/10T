import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description: string
  path?: string
}

const configuredAppUrl = import.meta.env.VITE_APP_URL?.replace(/\/$/, '')

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)
  if (!element) {
    element = selector.startsWith('link')
      ? document.createElement('link')
      : document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value))
}

export function PageMeta({ title, description, path = '/' }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = `${title} | 十个勤天陪伴社区`
    const appUrl = configuredAppUrl || window.location.origin
    const canonical = new URL(path, `${appUrl}/`).toString()

    document.title = fullTitle
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: canonical })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'zh_CN' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' })
  }, [description, path, title])

  return null
}

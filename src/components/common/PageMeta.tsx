import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description: string
  path?: string
}

const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'

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
    const canonical = `${appUrl}${path}`

    document.title = fullTitle
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: canonical })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  }, [description, path, title])

  return null
}

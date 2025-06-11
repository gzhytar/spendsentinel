import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo/meta-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain
  const supportedLocales = SITE_CONFIG.supportedLocales
  
  // Define all pages that should be included in sitemap
  const pages = [
    '/',
    '/self-assessment',
    '/daily-checkin',
    '/parts-journal',
    '/expense-highlighter',
    '/privacy-policy',
    '/terms-of-service',
    '/feedback',
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Generate entries for each page in each language
  pages.forEach(page => {
    supportedLocales.forEach(locale => {
      const url = locale === 'en' 
        ? `${baseUrl}${page}`
        : `${baseUrl}/${locale}${page}`
      
      // Generate alternate language URLs for this page
      const alternates: Record<string, string> = {}
      supportedLocales.forEach(altLocale => {
        const altUrl = altLocale === 'en'
          ? `${baseUrl}${page}`
          : `${baseUrl}/${altLocale}${page}`
        alternates[altLocale] = altUrl
      })

      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '/' ? 'daily' : 'weekly',
        priority: getPriority(page),
        alternates: {
          languages: alternates,
        },
      })
    })
  })

  return sitemap
}

function getPriority(page: string): number {
  switch (page) {
    case '/':
      return 1.0
    case '/self-assessment':
    case '/daily-checkin':
      return 0.9
    case '/parts-journal':
    case '/expense-highlighter':
      return 0.8
    case '/feedback':
      return 0.7
    case '/privacy-policy':
    case '/terms-of-service':
      return 0.5
    default:
      return 0.6
  }
} 
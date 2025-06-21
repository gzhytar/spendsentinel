import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo/meta-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain
  const supportedLocales = SITE_CONFIG.supportedLocales
  const defaultLocale = 'en'
  
  // Define all pages that should be included in sitemap
  const pages = [
    '/',
    '/self-assessment',
    '/daily-checkin',
    '/parts-journal',
    '/expense-highlighter',
    '/blog',
    '/privacy-policy',
    '/terms-of-service',
    '/feedback',
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Generate entries for each page in each language
  pages.forEach(page => {
    supportedLocales.forEach(locale => {
      const url = `${baseUrl}/${locale}${page}`
      
      // Generate alternate language URLs for this page
      const alternates: Record<string, string> = {}
      supportedLocales.forEach(altLocale => {
        const altUrl = `${baseUrl}/${altLocale}${page}`
        alternates[altLocale] = altUrl
      })
      
      // Add x-default pointing to the default locale (English)
      alternates['x-default'] = `${baseUrl}/${defaultLocale}${page}`

      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: getChangeFrequency(page),
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
      return 0.5
    case '/blog':
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

function getChangeFrequency(page: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  switch (page) {
    case '/':
      return 'daily'
    case '/blog':
      return 'daily'
    case '/self-assessment':
    case '/daily-checkin':
    case '/parts-journal':
    case '/expense-highlighter':
      return 'weekly'
    case '/feedback':
      return 'monthly'
    case '/privacy-policy':
    case '/terms-of-service':
      return 'yearly'
    default:
      return 'monthly'
  }
} 
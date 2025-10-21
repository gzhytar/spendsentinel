import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo/meta-config'
import { getBlogPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  for (const page of pages) {
    for (const locale of supportedLocales) {
      const url = `${baseUrl}/${locale}${page}`
      
      // Generate alternate language URLs for this page
      const alternates: Record<string, string> = {}
      for (const altLocale of supportedLocales) {
        const altUrl = `${baseUrl}/${altLocale}${page}`
        alternates[altLocale] = altUrl
      }
      
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
    }
  }

  // Add blog posts dynamically (only for languages where they exist)
  for (const locale of supportedLocales) {
    try {
      const posts = await getBlogPosts(locale as 'en' | 'cs' | 'uk' | 'ru')
      
      for (const post of posts) {
        const url = `${baseUrl}/${locale}/blog/${post.slug}`
        
        // Generate alternate language URLs for blog post
        const alternates: Record<string, string> = {}
        for (const altLocale of supportedLocales) {
          const altUrl = `${baseUrl}/${altLocale}/blog/${post.slug}`
          alternates[altLocale] = altUrl
        }
        
        // Add x-default pointing to English
        alternates['x-default'] = `${baseUrl}/${defaultLocale}/blog/${post.slug}`

        sitemap.push({
          url,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: alternates,
          },
        })
      }
    } catch (error) {
      // If blog posts can't be loaded for a locale, skip them
      console.warn(`Could not load blog posts for locale ${locale}:`, error)
    }
  }

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
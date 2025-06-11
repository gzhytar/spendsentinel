import type { Metadata } from 'next';
import { generateSEOConfig, SITE_CONFIG } from './meta-config';

/**
 * Generate Next.js Metadata object from our SEO configuration
 */
export function generateMetadata(
  pathname: string,
  locale: string = 'en',
  customData?: any
): Metadata {
  const seoConfig = generateSEOConfig(pathname, locale, customData);

  const metadata: Metadata = {
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    robots: seoConfig.robots,
    
    // Canonical URL
    alternates: {
      canonical: seoConfig.alternates?.canonical,
      languages: seoConfig.alternates?.languages,
    },

    // Open Graph
    openGraph: {
      title: seoConfig.openGraph?.title,
      description: seoConfig.openGraph?.description,
      images: seoConfig.openGraph?.image ? [seoConfig.openGraph.image] : undefined,
      type: seoConfig.openGraph?.type || 'website',
      siteName: seoConfig.openGraph?.siteName,
      locale: locale,
      alternateLocale: SITE_CONFIG.supportedLocales.filter(lang => lang !== locale),
    },

    // Twitter
    twitter: {
      card: seoConfig.twitter?.card || 'summary_large_image',
      title: seoConfig.twitter?.title,
      description: seoConfig.twitter?.description,
      images: seoConfig.twitter?.image ? [seoConfig.twitter.image] : undefined,
      site: seoConfig.twitter?.site,
      creator: seoConfig.twitter?.creator,
    },

    // Additional meta tags for better SEO
    other: {
      'theme-color': '#1a1b23',
      'color-scheme': 'light dark',
      'format-detection': 'telephone=no',
    },
  };

  return metadata;
}

/**
 * Generate page-specific metadata for dynamic routes
 */
export function generatePageMetadata(params: {
  pathname: string;
  locale?: string;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const { pathname, locale = 'en', ...customData } = params;
  return generateMetadata(pathname, locale, customData);
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(pathname: string, locale: string = 'en') {
  const seoConfig = generateSEOConfig(pathname, locale);
  
  // Base organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}${SITE_CONFIG.logo}`,
    sameAs: [
      `https://twitter.com/${SITE_CONFIG.twitter.replace('@', '')}`,
    ],
  };

  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
    url: SITE_CONFIG.domain,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.domain}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Page-specific schemas
  const pageSchemas: Record<string, any> = {
    '/': {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.canonical,
      mainEntity: {
        '@type': 'WebApplication',
        name: SITE_CONFIG.name,
        description: seoConfig.description,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    },
    '/self-assessment': {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.canonical,
      mainEntity: {
        '@type': 'Quiz',
        name: 'Financial Self-Assessment',
        description: seoConfig.description,
        about: {
          '@type': 'Thing',
          name: 'Financial Psychology',
        },
      },
    },
  };

  // Return combined structured data
  const schemas = [organizationSchema, websiteSchema];
  
  if (pageSchemas[pathname]) {
    schemas.push(pageSchemas[pathname]);
  }

  return schemas;
} 
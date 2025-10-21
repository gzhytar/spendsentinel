import type { Metadata } from 'next';
import { generatePageMetadata } from './metadata-generator';
import { SITE_CONFIG } from './meta-config';

/**
 * Legacy function - use generatePageMetadata from metadata-generator.ts instead
 * @deprecated Use generatePageMetadata from metadata-generator.ts
 */
export function generateMetadata(
  pathname: string,
  locale: string = 'en',
  customData?: Record<string, unknown>
): Metadata {
  return generatePageMetadata({
    pathname,
    locale,
    customData: customData as Partial<import('./meta-config').PageSEOData>,
  });
}

// Re-export the new functions for backward compatibility
export { generatePageMetadata as generatePageMetadataNew, generateBlogPostMetadata } from './metadata-generator';

/**
 * Generate JSON-LD structured data with proper language support
 */
export function generateStructuredData(pathname: string, locale: string = 'en') {
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
    inLanguage: locale,
  };

  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
    url: SITE_CONFIG.domain,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.domain}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Page-specific schemas
  const pageSchemas: Record<string, Record<string, unknown>> = {
    '/': {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.tagline,
      url: `${SITE_CONFIG.domain}/${locale}`,
      inLanguage: locale,
      mainEntity: {
        '@type': 'WebApplication',
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.tagline,
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
      name: 'Financial Self-Assessment',
      description: 'Take our evidence-based financial self-assessment to identify your internal money parts',
      url: `${SITE_CONFIG.domain}/${locale}/self-assessment`,
      inLanguage: locale,
      mainEntity: {
        '@type': 'Quiz',
        name: 'Financial Self-Assessment',
        description: 'Evidence-based financial self-assessment using IFS therapy principles',
        about: {
          '@type': 'Thing',
          name: 'Financial Psychology',
        },
      },
    },
    '/blog': {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${SITE_CONFIG.name} Blog`,
      description: 'Financial wellness insights and tips',
      url: `${SITE_CONFIG.domain}/${locale}/blog`,
      inLanguage: locale,
      author: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.domain,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.domain,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_CONFIG.domain}${SITE_CONFIG.logo}`,
        },
      },
    },
  };

  // Return combined structured data
  const schemas: Record<string, unknown>[] = [organizationSchema, websiteSchema];
  
  if (pageSchemas[pathname]) {
    schemas.push(pageSchemas[pathname]);
  }

  return schemas;
}

/**
 * Generate Article structured data for blog posts with proper language support
 */
export function generateBlogPostStructuredData(params: {
  title: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
  tags?: string[];
  locale: string;
}) {
  const {
    title,
    description,
    author = SITE_CONFIG.name,
    datePublished,
    dateModified,
    url,
    image,
    tags = [],
    locale
  } = params;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': author === SITE_CONFIG.name ? 'Organization' : 'Person',
      name: author,
      url: author === SITE_CONFIG.name ? SITE_CONFIG.domain : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}${SITE_CONFIG.logo}`,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    url: url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: image ? {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    } : undefined,
    keywords: tags.join(', '),
    inLanguage: locale,
    about: [
      {
        '@type': 'Thing',
        name: 'Financial Wellness',
      },
      {
        '@type': 'Thing',
        name: 'Financial Psychology',
      },
      {
        '@type': 'Thing',
        name: 'Money Mindset',
      },
    ],
    articleSection: 'Financial Wellness',
    isPartOf: {
      '@type': 'Blog',
      name: `${SITE_CONFIG.name} Blog`,
      url: `${SITE_CONFIG.domain}/${locale}/blog`,
    },
  };

  return articleSchema;
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(params: {
  items: Array<{
    name: string;
    url: string;
  }>;
}) {
  const { items } = params;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return breadcrumbSchema;
}

// Legacy function - use generateBlogPostMetadata from metadata-generator.ts instead
// This is kept for backward compatibility
export { generateBlogPostMetadata as generateBlogPostMetadataLegacy } from './metadata-generator'; 
import type { Metadata } from 'next';
import { generateSEOConfig, SITE_CONFIG } from './meta-config';

/**
 * Generate Next.js Metadata object from our SEO configuration
 */
export function generateMetadata(
  pathname: string,
  locale: string = 'en',
  customData?: Record<string, unknown>
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
  const pageSchemas: Record<string, Record<string, unknown>> = {
    '/': {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.canonical || SITE_CONFIG.domain,
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
      url: seoConfig.canonical || SITE_CONFIG.domain,
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
    '/blog': {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.canonical || SITE_CONFIG.domain,
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
 * Generate Article structured data for blog posts
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

/**
 * Generate metadata for blog posts
 */
export function generateBlogPostMetadata(params: {
  title: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  locale: string;
  image?: string;
  tags?: string[];
}): Metadata {
  const {
    title,
    description,
    author,
    datePublished,
    dateModified,
    slug,
    locale,
    image,
    tags = []
  } = params;

  const baseUrl = SITE_CONFIG.domain;
  const blogUrl = `${baseUrl}/${locale}/blog/${slug}`;
  const ogImage = image || `${baseUrl}/og-image.jpg`;

  // Generate alternate language URLs
  const alternateLanguages: Record<string, string> = {};
  SITE_CONFIG.supportedLocales.forEach(lang => {
    alternateLanguages[lang] = `${baseUrl}/${lang}/blog/${slug}`;
  });

  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    description: description,
    keywords: tags,
    authors: author ? [{ name: author }] : undefined,
    
    alternates: {
      canonical: blogUrl,
      languages: alternateLanguages,
    },

    openGraph: {
      title: title,
      description: description,
      type: 'article',
      url: blogUrl,
      siteName: SITE_CONFIG.name,
      locale: locale,
      alternateLocale: SITE_CONFIG.supportedLocales.filter(lang => lang !== locale),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: datePublished,
      modifiedTime: dateModified || datePublished,
      authors: author ? [author] : undefined,
      tags: tags,
    },

    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImage],
      site: SITE_CONFIG.twitter,
      creator: SITE_CONFIG.twitter,
    },

    other: {
      'article:published_time': datePublished,
      'article:modified_time': dateModified || datePublished,
      'article:author': author || SITE_CONFIG.name,
      'article:section': 'Financial Wellness',
      'article:tag': tags.join(','),
    },
  };
} 
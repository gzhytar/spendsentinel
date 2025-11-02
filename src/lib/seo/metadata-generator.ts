import type { Metadata } from 'next';
import { SITE_CONFIG, PAGE_SEO_CONFIG, type PageSEOData } from './meta-config';
import { generateHreflangLinks, generateBlogPostHreflangLinks } from './hreflang-generator';

export interface MetadataOptions {
  pathname: string;
  locale: string;
  customData?: Partial<PageSEOData>;
  isBlogPost?: boolean;
  blogSlug?: string;
}

/**
 * Format URL with correct trailing slash based on locale and pathname
 * According to requirements:
 * - English: /en/ (with trailing slash)
 * - Ukrainian: /uk/ (with trailing slash)
 * - Russian: /ru (without trailing slash)
 * - Czech: /cs (without trailing slash)
 */
function formatCanonicalUrl(locale: string, pathname: string): string {
  // Locales that should have trailing slash for homepage
  const localesWithTrailingSlash = ['en', 'uk'];
  
  // Normalize pathname
  const normalizedPath = pathname === '/' ? '' : pathname;
  
  // For homepage (pathname === '/'), add trailing slash for specific locales
  if (pathname === '/' && localesWithTrailingSlash.includes(locale)) {
    return `${SITE_CONFIG.domain}/${locale}/${normalizedPath}`;
  }
  
  // For homepage, don't add trailing slash for ru and cs
  if (pathname === '/') {
    return `${SITE_CONFIG.domain}/${locale}${normalizedPath}`;
  }
  
  // For non-homepage paths, preserve the original pathname format
  return `${SITE_CONFIG.domain}/${locale}${normalizedPath}`;
}

/**
 * Generate comprehensive metadata for multilingual pages
 * Following Google's international SEO best practices
 */
export function generatePageMetadata(options: MetadataOptions): Metadata {
  const { pathname, locale, customData, isBlogPost, blogSlug } = options;
  
  // Get base page data
  const pageData = PAGE_SEO_CONFIG[pathname]?.[locale] || PAGE_SEO_CONFIG['/'][locale];
  
  // Merge with custom data
  const finalData = { ...pageData, ...customData };
  
  // Generate canonical URL with proper trailing slash handling
  const canonicalUrl = formatCanonicalUrl(locale, pathname);
  
  // Generate hreflang links
  const hreflangLinks = isBlogPost && blogSlug
    ? generateBlogPostHreflangLinks(blogSlug, locale)
    : generateHreflangLinks(pathname, locale);
  
  // Convert to Next.js alternates format
  const alternates: Record<string, string> = {};
  hreflangLinks.forEach(link => {
    alternates[link.hrefLang] = link.href;
  });
  
  // Build Open Graph image URL
  const ogImage = finalData.image 
    ? `${SITE_CONFIG.domain}${finalData.image}`
    : `${SITE_CONFIG.domain}${SITE_CONFIG.defaultImage}`;

  // Generate alternate locales for Open Graph
  const alternateLocales = SITE_CONFIG.supportedLocales
    .filter(lang => lang !== locale)
    .map(lang => `${lang}-${getRegionCode(lang)}`);

  const metadata: Metadata = {
    title: finalData.title,
    description: finalData.description,
    keywords: finalData.keywords,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    
    // Canonical URL and language alternates
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },

    // Open Graph with proper locale handling
    openGraph: {
      title: finalData.title,
      description: finalData.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: finalData.title,
        },
      ],
      type: finalData.type || 'website',
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: `${locale}-${getRegionCode(locale)}`,
      alternateLocale: alternateLocales,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: finalData.title,
      description: finalData.description,
      images: [ogImage],
      site: SITE_CONFIG.twitter,
      creator: SITE_CONFIG.twitter,
    },

    // Additional meta tags
    other: {
      'theme-color': '#1a1b23',
      'color-scheme': 'light dark',
      'format-detection': 'telephone=no',
    },
  };

  return metadata;
}

/**
 * Generate metadata for blog posts with Article schema
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

  // Generate hreflang links for blog post
  const hreflangLinks = generateBlogPostHreflangLinks(slug, locale);
  const alternates: Record<string, string> = {};
  hreflangLinks.forEach(link => {
    alternates[link.hrefLang] = link.href;
  });

  // Generate alternate locales for Open Graph
  const alternateLocales = SITE_CONFIG.supportedLocales
    .filter(lang => lang !== locale)
    .map(lang => `${lang}-${getRegionCode(lang)}`);

  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    description: description,
    keywords: tags,
    authors: author ? [{ name: author }] : undefined,
    
    alternates: {
      canonical: blogUrl,
      languages: alternates,
    },

    openGraph: {
      title: title,
      description: description,
      type: 'article',
      url: blogUrl,
      siteName: SITE_CONFIG.name,
      locale: `${locale}-${getRegionCode(locale)}`,
      alternateLocale: alternateLocales,
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

/**
 * Get region code for locale
 */
function getRegionCode(locale: string): string {
  const regionMap: Record<string, string> = {
    'en': 'US',
    'cs': 'CZ',
    'uk': 'UA',
    'ru': 'RU',
  };
  
  return regionMap[locale] || 'US';
}

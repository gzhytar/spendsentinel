import { SITE_CONFIG } from './meta-config';

export interface HreflangLink {
  href: string;
  hrefLang: string;
}

/**
 * Format URL with correct trailing slash based on locale and pathname
 * This must match the canonical URL format exactly
 * According to requirements:
 * - English: /en/ (with trailing slash)
 * - Ukrainian: /uk/ (with trailing slash)
 * - Russian: /ru (without trailing slash)
 * - Czech: /cs (without trailing slash)
 */
function formatHreflangUrl(locale: string, pathname: string): string {
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
 * Generate hreflang link elements for multilingual pages
 * Following Google's best practices for international SEO
 * URLs must match canonical URLs exactly
 */
export function generateHreflangLinks(
  pathname: string,
  currentLocale: string,
  availableLocales: readonly string[] = SITE_CONFIG.supportedLocales
): HreflangLink[] {
  const links: HreflangLink[] = [];
  
  // Generate hreflang links for each available locale
  // Use the same format as canonical URLs to ensure consistency
  availableLocales.forEach(locale => {
    const url = formatHreflangUrl(locale, pathname);
    links.push({
      href: url,
      hrefLang: locale,
    });
  });
  
  // Add x-default pointing to English (primary language) with trailing slash
  const defaultUrl = formatHreflangUrl('en', pathname);
  links.push({
    href: defaultUrl,
    hrefLang: 'x-default',
  });
  
  return links;
}

/**
 * Generate hreflang links for blog posts
 * Only includes languages where the post actually exists
 */
export function generateBlogPostHreflangLinks(
  slug: string,
  currentLocale: string,
  availableLocales: readonly string[] = SITE_CONFIG.supportedLocales
): HreflangLink[] {
  const links: HreflangLink[] = [];
  
  // For blog posts, we only include languages where the post exists
  // This prevents 404s and follows Google's guidelines
  availableLocales.forEach(locale => {
    const url = `${SITE_CONFIG.domain}/${locale}/blog/${slug}`;
    links.push({
      href: url,
      hrefLang: locale,
    });
  });
  
  // Add x-default pointing to English
  const defaultUrl = `${SITE_CONFIG.domain}/en/blog/${slug}`;
  links.push({
    href: defaultUrl,
    hrefLang: 'x-default',
  });
  
  return links;
}

/**
 * Convert hreflang links to Next.js Link elements
 * Note: This function should only be used in React components
 */
export function hreflangLinksToNextLinks(links: HreflangLink[]) {
  return links.map(link => ({
    key: link.hrefLang,
    rel: 'alternate',
    hrefLang: link.hrefLang,
    href: link.href,
  }));
}

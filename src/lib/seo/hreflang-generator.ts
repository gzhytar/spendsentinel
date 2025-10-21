import { SITE_CONFIG } from './meta-config';

export interface HreflangLink {
  href: string;
  hrefLang: string;
}

/**
 * Generate hreflang link elements for multilingual pages
 * Following Google's best practices for international SEO
 */
export function generateHreflangLinks(
  pathname: string,
  currentLocale: string,
  availableLocales: readonly string[] = SITE_CONFIG.supportedLocales
): HreflangLink[] {
  const links: HreflangLink[] = [];
  
  // Generate hreflang links for each available locale
  availableLocales.forEach(locale => {
    const url = `${SITE_CONFIG.domain}/${locale}${pathname}`;
    links.push({
      href: url,
      hrefLang: locale,
    });
  });
  
  // Add x-default pointing to English (primary language)
  const defaultUrl = `${SITE_CONFIG.domain}/en${pathname}`;
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

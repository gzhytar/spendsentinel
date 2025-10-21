import { generateHreflangLinks, generateBlogPostHreflangLinks } from '@/lib/seo/hreflang-generator';

interface HreflangProps {
  pathname: string;
  locale: string;
  isBlogPost?: boolean;
  blogSlug?: string;
}

/**
 * Component to render hreflang link elements for multilingual SEO
 * Following Google's best practices for international SEO
 */
export function Hreflang({ pathname, locale, isBlogPost, blogSlug }: HreflangProps) {
  const links = isBlogPost && blogSlug
    ? generateBlogPostHreflangLinks(blogSlug, locale)
    : generateHreflangLinks(pathname, locale);

  return (
    <>
      {links.map(link => (
        <link
          key={link.hrefLang}
          rel="alternate"
          hrefLang={link.hrefLang}
          href={link.href}
        />
      ))}
    </>
  );
}

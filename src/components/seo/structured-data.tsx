import Script from 'next/script';
import { generateStructuredData, generateBlogPostStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo/metadata';

interface StructuredDataProps {
  pathname: string;
  locale?: string;
}

/**
 * Component to inject JSON-LD structured data into the page
 */
export function StructuredData({ pathname, locale = 'en' }: StructuredDataProps) {
  const structuredData = generateStructuredData(pathname, locale);

  return (
    <>
      {structuredData.map((schema, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

/**
 * Enhanced structured data component for FAQ pages
 */
export function FAQStructuredData({ 
  faqs, 
  locale = 'en' 
}: { 
  faqs: Array<{ question: string; answer: string }>; 
  locale?: string; 
}) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}

/**
 * Blog post structured data component with Article schema
 */
export function BlogPostStructuredData({ 
  title,
  description,
  author,
  datePublished,
  dateModified,
  url,
  image,
  tags = [],
  locale = 'en' 
}: { 
  title: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
  tags?: string[];
  locale?: string;
}) {
  const articleSchema = generateBlogPostStructuredData({
    title,
    description,
    author,
    datePublished,
    dateModified,
    url,
    image,
    tags,
    locale
  });

  return (
    <Script
      id="blog-post-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema),
      }}
    />
  );
}

/**
 * Breadcrumb structured data component
 */
export function BreadcrumbStructuredData({ 
  items 
}: { 
  items: Array<{
    name: string;
    url: string;
  }>;
}) {
  const breadcrumbSchema = generateBreadcrumbStructuredData({ items });

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
    />
  );
} 
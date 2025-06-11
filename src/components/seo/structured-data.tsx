import Script from 'next/script';
import { generateStructuredData } from '@/lib/seo/metadata';

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
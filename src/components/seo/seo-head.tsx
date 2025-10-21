import Script from 'next/script';

interface SEOHeadProps {
  locale?: string;
  additionalSchemas?: object[];
}

/**
 * Additional SEO enhancements for specific pages
 * Note: Most SEO is now handled by Next.js metadata API
 */
export function SEOHead({ locale = 'en', additionalSchemas = [] }: SEOHeadProps) {
  return (
    <>
      {/* Additional structured data schemas */}
      {additionalSchemas.map((schema, index) => (
        <Script
          key={index}
          id={`additional-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      
      {/* Additional SEO meta tags not handled by Next.js metadata */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Language and regional targeting */}
      <meta name="language" content={locale} />
      <meta httpEquiv="content-language" content={locale} />
    </>
  );
} 
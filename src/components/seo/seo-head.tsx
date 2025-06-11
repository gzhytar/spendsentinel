import Script from 'next/script';

interface SEOHeadProps {
  locale?: string;
  additionalSchemas?: object[];
}

/**
 * Additional SEO enhancements for specific pages
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
      
      {/* Performance optimization hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Language and regional targeting */}
      <meta name="language" content={locale} />
      <meta httpEquiv="content-language" content={locale} />
      
      {/* Mobile optimization */}
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </>
  );
} 
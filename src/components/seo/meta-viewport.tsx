/**
 * Essential meta tags for viewport, mobile optimization, and performance
 */
export function MetaViewport() {
  return (
    <>
      {/* Viewport meta tag for responsive design */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      
      {/* Theme and color scheme */}
      <meta name="theme-color" content="#1a1b23" />
      <meta name="color-scheme" content="light dark" />
      
      {/* Mobile app configuration */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SpendSentinel" />
      
      {/* Prevent auto-detection of phone numbers */}
      <meta name="format-detection" content="telephone=no" />
      
      {/* Security headers */}
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Favicon and app icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
    </>
  );
} 
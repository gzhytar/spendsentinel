/**
 * Essential meta tags for viewport and mobile optimization
 * Note: Next.js 14+ handles viewport automatically, but we keep this for any custom needs
 */
export function MetaViewport() {
  return (
    <>
      {/* Additional mobile optimization */}
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      
      {/* Prevent auto-detection of phone numbers */}
      <meta name="format-detection" content="telephone=no" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Referrer policy */}
      <meta name="referrer" content="origin-when-cross-origin" />
    </>
  );
} 
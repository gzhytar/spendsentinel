import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: true
  },
  // Optimize proxy handling for our locale-based routing
  skipTrailingSlashRedirect: true,
  skipProxyUrlNormalize: true,
  devIndicators: false,

  
  
  // Redirect root path to ensure consistent URL structure
  async redirects() {
    return [
       // Redirect non-www to www (MUST be first to catch all non-www URLs)
       {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'spendsentinel.com',
          },
        ],
        destination: 'https://www.spendsentinel.com/:path*',
        permanent: true, // 301 redirect
      },
      // Redirect root path on www to /en/
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.spendsentinel.com',
          },
        ],
        destination: '/en/',
        permanent: true,
      },
      // Redirect other non-locale paths to English, excluding SEO-critical files and images
      {
        source: '/:path((?!en|cs|uk|ru|api|_next|favicon\\.ico|favicon\\.svg|manifest\\.json|robots\\.txt|sitemap\\.xml|apple-touch-icon\\.png|icon-192\\.png|icon-512\\.png|logo\\.svg|.*\\.jpg|images|blog).*)',
        has: [
          {
            type: 'host',
            value: 'www.spendsentinel.com',
          },
        ],
        destination: '/en/:path',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

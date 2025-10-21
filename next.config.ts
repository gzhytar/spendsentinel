import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
  // Optimize middleware handling for our locale-based routing
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  devIndicators: false,

  
  
  // Redirect root path to ensure consistent URL structure
  async redirects() {
    return [
      // Redirect root path specifically
      {
        source: '/',
        destination: '/en/',
        permanent: true,
      },
      // Redirect other non-locale paths to English, excluding SEO-critical files and images
      {
        source: '/:path((?!en|cs|uk|ru|api|_next|favicon\\.ico|favicon\\.svg|manifest\\.json|robots\\.txt|sitemap\\.xml|apple-touch-icon\\.png|icon-192\\.png|icon-512\\.png|logo\\.svg|.*\\.jpg|images|blog).*)',
        destination: '/en/:path',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

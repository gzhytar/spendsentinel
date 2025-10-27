import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'cs', 'ru', 'uk']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const locales = ['en', 'cs', 'ru', 'uk']
  
  try {
    return matchLocale(languages, locales, defaultLocale)
  } catch {
    return defaultLocale
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const hostname = request.headers.get('host') || ''
  
  // First, handle non-www to www redirect (301 permanent)
  if (hostname === 'spendsentinel.com') {
    const newUrl = new URL(pathname, `https://www.spendsentinel.com`)
    newUrl.search = request.nextUrl.search // Preserve query parameters
    return NextResponse.redirect(newUrl, 301)
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    const newUrl = `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`

    // Use 301 (permanent) redirect for root path, 302 (temporary) for others
    // This signals to search engines that the root should always redirect to locale
    if (pathname === '/') {
      return NextResponse.redirect(new URL(newUrl, request.url), 301)
    }

    // For other paths, use 302 (temporary) redirect since the redirect depends on user's language preference
    return NextResponse.redirect(new URL(newUrl, request.url))
  }
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, static assets, and image files
  matcher: ['/((?!api|_next/static|_next/image|favicon.*|manifest.json|sitemap.xml|robots.txt|images|.*\\.(?:jpg|jpeg|png|html)$).*)'],
} 
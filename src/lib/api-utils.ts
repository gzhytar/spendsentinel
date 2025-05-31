import { NextRequest } from 'next/server';
import { Locale, defaultLocale, locales, localeNames } from '@/lib/i18n/config';

/**
 * Extracts the appropriate locale from a NextRequest by checking:
 * 1. Query parameter ('lang')
 * 2. URL path pattern (e.g., /en/some-path)
 * 3. Request body (if provided)
 * 
 * @param req The Next.js request object
 * @param data Optional request body data that might contain a locale
 * @returns The determined locale
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractLocale = (req: NextRequest, data: any = {}): Locale => {
  // Default locale as fallback
  let locale = defaultLocale as Locale;
  
  // Parse the URL
  const url = new URL(req.url);
  
  // 1. Check for lang query parameter
  const langParam = url.searchParams.get('lang');
  if (langParam && locales.includes(langParam as Locale)) {
    locale = langParam as Locale;
  } 
  // 2. If no query parameter, fallback to URL path extraction
  else {
    // Extract locale from route pattern /[locale]/...
    const pathMatch = url.pathname.match(/^\/([^\/]+)/);
    if (pathMatch && pathMatch[1]) {
      const extractedLocale = pathMatch[1] as Locale;
      if (locales.includes(extractedLocale)) {
        locale = extractedLocale;
      }
    }
  }
  
  // 3. If client explicitly provided a locale in the body, prioritize that
  if (data.locale && locales.includes(data.locale as Locale)) {
    locale = data.locale as Locale;
  }
  
  return locale;
};

/**
 * Prepares input data with locale information for AI processing
 * 
 * @param req The Next.js request object
 * @returns Data enhanced with the appropriate locale
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prepareLocalizedInput = async (req: NextRequest): Promise<any> => {
  // Parse request body
  const data = await req.json();
  
  // Extract the appropriate locale
  const locale = extractLocale(req, data);
  
  // Format locale to include language name and code: "English (en)"
  const formattedLocale = `${localeNames[locale]} (${locale})`;
  
  // Return data with formatted locale added/overridden
  return { ...data, locale: formattedLocale };
}; 
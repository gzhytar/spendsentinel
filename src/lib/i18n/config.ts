export const defaultLocale = 'en';
export const locales = ['en', 'cs', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  cs: 'Čeština',
  ru: 'Русский',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  cs: '🇨🇿',
  ru: '🇷🇺',
}; 
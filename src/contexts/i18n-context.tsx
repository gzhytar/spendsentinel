'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { en } from '@/lib/i18n/translations/en';
import { cs } from '@/lib/i18n/translations/cs';
import { ru } from '@/lib/i18n/translations/ru';
import { Locale, defaultLocale, locales } from '@/lib/i18n/config';

type Translations = typeof en;

const translations = {
  en,
  cs,
  ru,
} as const;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // On mount, load locale from localStorage if available
  useEffect(() => {
    const storedLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
    if (storedLocale && locales.includes(storedLocale as Locale)) {
      setLocaleState(storedLocale as Locale);
    }
  }, []);

  // Persist locale to localStorage when changed
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      const keys = key.split('.');
      let value: any = translations[locale];

      for (const k of keys) {
        if (value === undefined) return key;
        value = value[k];
      }

      return value || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
} 
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const localeParam = params?.lang as Locale;
    if (localeParam && locales.includes(localeParam)) {
      setLocaleState(localeParam);
    }
  }, [params?.lang]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/[^/]+/, `/${newLocale}`);
    router.push(newPath);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value?.[k] === undefined) {
        console.warn(`Translation key not found: ${key} for language: ${locale}`);
        return key;
      }
      value = value[k];
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key} for language: ${locale}`);
      return key;
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, key) => String(params[key] || `{${key}}`));
    }

    return value;
  };

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
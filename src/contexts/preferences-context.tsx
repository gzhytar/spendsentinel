'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale } from '@/lib/i18n/config';
import { useI18n } from './i18n-context';

export type Currency = 'USD' | 'CZK' | 'UAH' | 'EUR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
}

export const currencyConfigs: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  UAH: { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
};

// Default currency mapping based on language
const defaultCurrencyMap: Record<Locale, Currency> = {
  en: 'USD',
  cs: 'CZK',
  uk: 'UAH',
  ru: 'EUR',
};

interface PreferencesContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  getCurrencySymbol: () => string;
  getCurrencyConfig: () => CurrencyConfig;
  isManuallySet: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const PREFERENCES_STORAGE_KEY = 'user_preferences';

interface StoredPreferences {
  currency?: Currency;
  manuallySetCurrency?: boolean;
  manuallySetLanguage?: boolean;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [isManuallySet, setIsManuallySet] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
        const preferences: StoredPreferences = stored ? JSON.parse(stored) : {};
        
        if (preferences.currency && preferences.manuallySetCurrency) {
          // User has manually set currency, use it
          setCurrencyState(preferences.currency);
          setIsManuallySet(true);
        } else {
          // No manual currency set, use default based on language
          const defaultCurrency = defaultCurrencyMap[locale] || 'USD';
          setCurrencyState(defaultCurrency);
          setIsManuallySet(false);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        // Fallback to default
        const defaultCurrency = defaultCurrencyMap[locale] || 'USD';
        setCurrencyState(defaultCurrency);
        setIsManuallySet(false);
      }
    };

    loadPreferences();
  }, [locale]);

  // Update currency based on language change (only if not manually set)
  useEffect(() => {
    if (!isManuallySet) {
      const defaultCurrency = defaultCurrencyMap[locale] || 'USD';
      setCurrencyState(defaultCurrency);
    }
  }, [locale, isManuallySet]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    setIsManuallySet(true);
    
    // Save to localStorage
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      const preferences: StoredPreferences = stored ? JSON.parse(stored) : {};
      
      preferences.currency = newCurrency;
      preferences.manuallySetCurrency = true;
      
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const getCurrencySymbol = () => {
    return currencyConfigs[currency]?.symbol || '$';
  };

  const getCurrencyConfig = () => {
    return currencyConfigs[currency] || currencyConfigs.USD;
  };

  return (
    <PreferencesContext.Provider
      value={{
        currency,
        setCurrency,
        getCurrencySymbol,
        getCurrencyConfig,
        isManuallySet,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
} 
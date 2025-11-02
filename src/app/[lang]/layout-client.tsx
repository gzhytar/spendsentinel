"use client"

import type { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayoutClient } from '@/components/layout/app-layout-client';
import { I18nProvider } from '@/contexts/i18n-context';
import { PreferencesProvider } from '@/contexts/preferences-context';
import { AnalyticsProvider } from '@/contexts/analytics-context';
import { ConsentProvider } from '@/contexts/consent-context';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useStorageCleanup } from '@/hooks/use-storage-cleanup';
import { CookieConsentBanner } from '@/components/ui/cookie-consent-banner';
import { CookieConsentSettings } from '@/components/ui/cookie-consent-settings';
import { StructuredData } from '@/components/seo/structured-data';

// Update this version number when releasing new versions
const CURRENT_VERSION = '0.12.0';

interface LayoutClientProps {
  children: ReactNode;
  lang: string;
}

export function LayoutClient({ children, lang }: LayoutClientProps) {
  // Initialize version-based cleanup
  useStorageCleanup({
    strategy: 'version',
    currentVersion: CURRENT_VERSION,
    autoRepair: true,
    onCleanup: (info) => {
      console.log(`✨ Storage cleanup completed: ${info.clearedItems} items removed using ${info.strategy} strategy`);
    }
  });

  return (
    <I18nProvider>
      <PreferencesProvider>
        <AnalyticsProvider>
          <ConsentProvider>
            {/* SEO Structured Data for the current language */}
            <StructuredData pathname="/" locale={lang} />
            
            <div className="fixed top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            <SidebarProvider defaultOpen={false}>
              <AppLayoutClient>
                {children}
              </AppLayoutClient>
            </SidebarProvider>
            
            {/* Cookie Consent Components */}
            <CookieConsentBanner />
            <CookieConsentSettings />
          </ConsentProvider>
        </AnalyticsProvider>
      </PreferencesProvider>
    </I18nProvider>
  );
}


"use client"

import type { ReactNode } from 'react';
import { use } from 'react';
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

// Update this version number when releasing new versions
const CURRENT_VERSION = '0.9.0';

export default function MainAppLayout({ 
  children,
  params,
}: { 
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  use(params);

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
            <div className="fixed top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            <SidebarProvider defaultOpen>
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

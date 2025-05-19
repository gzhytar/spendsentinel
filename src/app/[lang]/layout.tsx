"use client"

import type { ReactNode } from 'react';
import { use } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayoutClient } from '@/components/layout/app-layout-client';
import { I18nProvider } from '@/contexts/i18n-context';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export default function MainAppLayout({ 
  children,
  params,
}: { 
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);

  return (
    <I18nProvider>
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <SidebarProvider defaultOpen>
        <AppLayoutClient>
          {children}
        </AppLayoutClient>
      </SidebarProvider>
    </I18nProvider>
  );
}

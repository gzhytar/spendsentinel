"use client"

import type { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayoutClient } from '@/components/layout/app-layout-client';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppLayoutClient>
        {children}
      </AppLayoutClient>
    </SidebarProvider>
  );
}

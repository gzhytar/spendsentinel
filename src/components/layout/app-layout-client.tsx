"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { usePanicMode } from '@/contexts/panic-mode-context';
import { PanicButton } from '@/components/common/panic-button';
import { GroundingExercise } from '@/components/common/grounding-exercise';
import { Leaf } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

export function AppLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isPanicActive } = usePanicMode();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { t, locale } = useI18n();
  
  // Extract the current locale from the pathname
  const localePrefix = `/${locale}`;

  // Handle navigation click to close the sidebar on mobile
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <Link href={`${localePrefix}/`} className="flex items-center gap-2" onClick={handleNavClick}>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-primary/20 hover:bg-primary/30">
               <Leaf className="h-6 w-6 text-primary" />
            </Button>
            {!open && <span className="sr-only">{t(APP_NAME)}</span>}
            {open && <h1 className="text-xl font-semibold text-primary">{t(APP_NAME)}</h1>}
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarMenu className="p-2">
              {NAV_ITEMS.map((item) => {
                // Prefix each href with the locale
                const localizedHref = item.href === '/' 
                  ? localePrefix 
                  : `${localePrefix}${item.href}`;
                
                // Check if current path matches or starts with this item's path
                // For the home route, we need an exact match
                const isActive = item.href === '/' 
                  ? pathname === localePrefix || pathname === `${localePrefix}/`
                  : pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={t(item.tooltip)}
                      className="justify-start"
                    >
                      <Link href={localizedHref} onClick={handleNavClick}>
                        <item.icon className="h-5 w-5" />
                        <span>{t(item.label)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          {/* TODO: Add page title or breadcrumbs here if needed */}
          <div className="flex-1">
            {/* Page specific header content could go here, e.g. using a portal or context */}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-2 md:p-4">
          {children}
        </main>
      </SidebarInset>
      
      <PanicButton />
      {isPanicActive && <GroundingExercise />}
    </>
  );
}

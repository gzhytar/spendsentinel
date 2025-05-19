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

export function AppLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isPanicActive } = usePanicMode();
  const { open } = useSidebar();

  return (
    <>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-primary/20 hover:bg-primary/30">
               <Leaf className="h-6 w-6 text-primary" />
            </Button>
            {!open && <span className="sr-only">{APP_NAME}</span>}
            {open && <h1 className="text-xl font-semibold text-primary">{APP_NAME}</h1>}
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarMenu className="p-2">
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.tooltip}
                    className="justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
      
      <PanicButton />
      {isPanicActive && <GroundingExercise />}
    </>
  );
}

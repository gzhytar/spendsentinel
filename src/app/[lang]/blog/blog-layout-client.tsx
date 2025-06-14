'use client';

import { AppFooter } from '@/components/layout/app-footer';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { PanicButton } from '@/components/common/panic-button';
import { GroundingExercise } from '@/components/common/grounding-exercise';
import { usePanicMode } from '@/contexts/panic-mode-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface BlogLayoutClientProps {
  children: React.ReactNode;
  lang: string;
}

export function BlogLayoutClient({ children, lang }: BlogLayoutClientProps) {
  const { isPanicActive } = usePanicMode();
  
  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
            {/* Left side - Back to app and logo */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${lang}`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to App</span>
                </Link>
              </Button>
              
              <div className="h-6 w-px bg-border" />
              
              <Link href={`/${lang}/blog`} className="flex items-center gap-2">
                <Image 
                  src="/favicon.svg" 
                  alt="SpendSentinel" 
                  width={24} 
                  height={24}
                  className="h-6 w-6"
                />
                <span className="font-semibold text-primary hidden sm:inline">SpendSentinel Blog</span>
              </Link>
            </div>
            
            {/* Right side - Language switcher */}
            <LanguageSwitcher />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <AppFooter />
      </div>
      
      {/* Panic button and grounding exercise */}
      <PanicButton />
      {isPanicActive && <GroundingExercise />}
    </>
  );
} 
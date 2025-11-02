import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata-generator';
import { LayoutClient } from './layout-client';

interface MainAppLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

// Generate metadata for all pages under [lang] route
// This will be used for the homepage and can be overridden by child layouts
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  // Generate metadata for homepage by default
  return generatePageMetadata({
    pathname: '/',
    locale: lang,
  });
}

export default async function MainAppLayout({ 
  children,
  params,
}: MainAppLayoutProps) {
  const { lang } = await params;
  
  return <LayoutClient lang={lang}>{children}</LayoutClient>;
}

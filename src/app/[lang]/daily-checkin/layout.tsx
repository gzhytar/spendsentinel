import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/structured-data';

interface DailyCheckinLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// Generate metadata for the daily-checkin page
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return generateSEOMetadata('/daily-checkin', lang);
}

export default async function DailyCheckinLayout({ 
  children, 
  params 
}: DailyCheckinLayoutProps) {
  const { lang } = await params;
  
  return (
    <>
      <StructuredData pathname="/daily-checkin" locale={lang} />
      {children}
    </>
  );
} 
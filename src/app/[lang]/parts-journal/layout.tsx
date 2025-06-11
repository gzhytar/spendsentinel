import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/structured-data';

interface PartsJournalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// Generate metadata for the parts-journal page
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return generateSEOMetadata('/parts-journal', lang);
}

export default async function PartsJournalLayout({ 
  children, 
  params 
}: PartsJournalLayoutProps) {
  const { lang } = await params;
  
  return (
    <>
      <StructuredData pathname="/parts-journal" locale={lang} />
      {children}
    </>
  );
} 
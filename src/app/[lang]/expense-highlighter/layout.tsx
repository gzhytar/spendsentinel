import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/structured-data';

interface ExpenseHighlighterLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// Generate metadata for the expense-highlighter page
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return generateSEOMetadata('/expense-highlighter', lang);
}

export default async function ExpenseHighlighterLayout({ 
  children, 
  params 
}: ExpenseHighlighterLayoutProps) {
  const { lang } = await params;
  
  return (
    <>
      <StructuredData pathname="/expense-highlighter" locale={lang} />
      {children}
    </>
  );
} 
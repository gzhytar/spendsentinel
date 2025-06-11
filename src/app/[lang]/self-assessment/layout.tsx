import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/structured-data';

interface SelfAssessmentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// Generate metadata for the self-assessment page
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return generateSEOMetadata('/self-assessment', lang);
}

export default async function SelfAssessmentLayout({ 
  children, 
  params 
}: SelfAssessmentLayoutProps) {
  const { lang } = await params;
  
  return (
    <>
      <StructuredData pathname="/self-assessment" locale={lang} />
      {children}
    </>
  );
} 
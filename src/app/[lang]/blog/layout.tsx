import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/structured-data';
import { BlogLayoutClient } from './blog-layout-client';

interface BlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// Generate metadata for the blog page
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return generateSEOMetadata('/blog', lang);
}

export default async function BlogLayout({ 
  children, 
  params 
}: BlogLayoutProps) {
  const { lang } = await params;
  
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      <StructuredData pathname="/blog" locale={lang} />
      <BlogLayoutClient lang={lang}>
        {children}
      </BlogLayoutClient>
    </div>
  );
} 
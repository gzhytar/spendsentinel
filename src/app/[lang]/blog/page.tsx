import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Tag } from 'lucide-react';
import { getBlogPosts } from '@/lib/blog';
import { translations } from '@/lib/i18n/translations';
import { generatePageMetadata } from '@/lib/seo/metadata-generator';
import type { Metadata } from 'next';

interface BlogPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  return generatePageMetadata({
    pathname: '/blog',
    locale: lang,
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const locale = lang as keyof typeof translations;
  const t = (key: string): string => {
    const keys = key.split('.');
    let current: unknown = translations[locale];
    for (const k of keys) {
      current = (current as Record<string, unknown>)?.[k];
    }
    return (current as string) || key;
  };

  // Load blog posts on the server
  const posts = await getBlogPosts(locale);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      {/* Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('blog.title')}</h1>
          <p className="text-muted-foreground">{t('blog.subtitle')}</p>
        </div>
      </div>

      {/* Blog Posts */}
      {posts.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('blog.noPosts.title')}</h3>
            <p className="text-muted-foreground">{t('blog.noPosts.description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:gap-8">
          {posts.map((post) => (
            <Card key={post.slug} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      <Link 
                        href={`/${lang}/blog/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.summary}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{t('blog.readingTime').replace('{{minutes}}', post.readingTime.toString())}</span>
                  </div>
                  {post.author && (
                    <div className="flex items-center gap-1">
                      <span>{t('blog.byAuthor').replace('{{author}}', post.author)}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button asChild>
                    <Link href={`/${lang}/blog/${post.slug}`}>
                      {t('blog.readMore')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 
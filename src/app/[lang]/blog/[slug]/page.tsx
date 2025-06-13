import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { getBlogPost, getRelatedPosts } from '@/lib/blog';
import { translations } from '@/lib/i18n/translations';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { SocialShareButtons } from '@/components/common/social-share-buttons';

interface BlogPostPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

// Custom components for MDX
const mdxComponents = {
  SocialShareButtons,
  // Allow custom div elements with className to be rendered properly
  div: (props: any) => <div {...props} />,
  span: (props: any) => <span {...props} />,
  h1: (props: any) => <h1 className="text-3xl font-bold mb-6 mt-8" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mb-4 mt-8" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mb-3 mt-6" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-semibold mb-2 mt-4" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="mb-4 space-y-2 list-decimal list-inside" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6" {...props} />
  ),
  strong: (props: any) => <strong className="font-semibold" {...props} />,
  a: (props: any) => (
    <a className="text-primary hover:text-primary/80 underline transition-colors" {...props} />
  ),
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  const locale = lang as keyof typeof translations;
  const t = (key: string) => {
    const keys = key.split('.');
    let current: any = translations[locale];
    for (const k of keys) {
      current = current?.[k];
    }
    return current || key;
  };

  // Load blog post and related posts on the server
  const post = await getBlogPost(slug, locale);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, locale, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      {/* Back to Blog */}
      <div>
        <Button variant="ghost" asChild className="hover:bg-muted">
          <Link href={`/${lang}/blog`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('blog.backToBlog')}
          </Link>
        </Button>
      </div>

      {/* Post Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-muted-foreground text-lg">{post.summary}</p>
        </div>

        {/* Post Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Post Content */}
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="prose-custom max-w-none">
            <MDXRemote 
              source={post.content} 
              components={mdxComponents}
            />
          </div>
        </CardContent>
      </Card>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t('blog.relatedPosts')}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.slug} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link 
                      href={`/${lang}/blog/${relatedPost.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {relatedPost.summary}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={relatedPost.date}>{formatDate(relatedPost.date)}</time>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{relatedPost.readingTime} min</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Back to Blog Footer */}
      <div className="text-center">
        <Button asChild>
          <Link href={`/${lang}/blog`}>
            {t('blog.backToBlog')}
          </Link>
        </Button>
      </div>
    </div>
  );
} 
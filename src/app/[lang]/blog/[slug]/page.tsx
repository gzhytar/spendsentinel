import { notFound } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { getBlogPost, getRelatedPosts } from '@/lib/blog';
import { translations } from '@/lib/i18n/translations';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { SocialShareButtons } from '@/components/common/social-share-buttons';
import { NewsletterBox } from '@/components/common/newsletter-box';
import { CTABox } from '@/components/common/cta-box';
import { BlogPostStructuredData, BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { generateBlogPostMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/lib/seo/meta-config';

interface BlogPostPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

// Generate metadata for blog posts
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as keyof typeof translations;
  
  const post = await getBlogPost(slug, locale);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return generateBlogPostMetadata({
    title: post.title,
    description: post.summary,
    author: post.author,
    datePublished: post.date,
    slug: post.slug,
    locale: lang,
    tags: post.tags,
  });
}

// Custom callout components to prevent nested p tags
const KeyInsightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
    <div className="flex items-start">
      <span className="text-3xl mr-4">🧠</span>
      <div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Insight</h3>
        <div className="text-blue-700">{children}</div>
      </div>
    </div>
  </div>
);

const ImportantNoteBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
    <div className="flex">
      <div className="ml-3">
        <div className="text-sm text-amber-700">{children}</div>
      </div>
    </div>
  </div>
);

const TryThisBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-green-50 border-l-4 border-green-400 p-6 my-8">
    <div className="flex items-center mb-4">
      <span className="text-2xl mr-3">🔍</span>
      <h3 className="text-xl font-semibold text-green-800">{title}</h3>
    </div>
    <div className="text-green-700">{children}</div>
  </div>
);

const BuiltInSupportBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-green-50 border-l-4 border-green-400 p-6 my-8">
    <div className="flex items-center mb-4">
      <span className="text-2xl mr-3">📱</span>
      <h3 className="text-xl font-semibold text-green-800">Built-in Support</h3>
    </div>
    <div className="text-green-700">{children}</div>
  </div>
);

const ImagePlaceholder = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 text-center">
    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
      <div className="text-gray-500 italic">{children}</div>
    </div>
  </div>
);

// Custom components for MDX - simplified to prevent nesting issues
const mdxComponents = {
  SocialShareButtons,
  KeyInsightBox,
  ImportantNoteBox,
  TryThisBox,
  BuiltInSupportBox,
  ImagePlaceholder,
  CTABox,
  NewsletterBox,
  // Core HTML elements with proper styling
  h1: (props: any) => <h1 className="text-3xl font-bold mb-6 mt-8 text-foreground" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mb-4 mt-8 text-foreground" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed text-foreground" {...props} />,
  div: (props: any) => <div {...props} />,
  span: (props: any) => <span {...props} />,
  ul: (props: any) => <ul className="mb-4 space-y-2 pl-6" {...props} />,
  ol: (props: any) => <ol className="mb-4 space-y-2 list-decimal list-inside pl-6" {...props} />,
  li: (props: any) => <li className="leading-relaxed text-foreground" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6" {...props} />
  ),
  strong: (props: any) => <strong className="font-semibold text-foreground" {...props} />,
  a: (props: any) => (
    <a className="text-primary hover:text-primary/80 underline transition-colors" {...props} />
  ),
  img: (props: any) => (
    <NextImage 
      {...props} 
      width={props.width || 800} 
      height={props.height || 400} 
      className={`rounded-lg my-6 ${props.className || ''}`}
      alt={props.alt || ''}
      src={props.src?.startsWith('/') ? props.src : `/${props.src}`}
    />
  ),
  Image: (props: any) => (
    <NextImage 
      {...props} 
      width={props.width || 800} 
      height={props.height || 400} 
      className={`rounded-lg my-6 ${props.className || ''}`}
      alt={props.alt || ''}
      src={props.src?.startsWith('/') ? props.src : `/${props.src}`}
    />
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

  // Generate URLs for structured data
  const baseUrl = SITE_CONFIG.domain;
  const blogUrl = `${baseUrl}${locale !== 'en' ? `/${locale}` : ''}/blog/${post.slug}`;
  const blogListUrl = `${baseUrl}${locale !== 'en' ? `/${locale}` : ''}/blog`;
  const homeUrl = `${baseUrl}${locale !== 'en' ? `/${locale}` : ''}`;

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Home', url: homeUrl },
    { name: t('blog.title'), url: blogListUrl },
    { name: post.title, url: blogUrl },
  ];

  return (
    <>
      {/* Structured Data */}
      <BlogPostStructuredData
        title={post.title}
        description={post.summary}
        author={post.author}
        datePublished={post.date}
        url={blogUrl}
        tags={post.tags}
        locale={locale}
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="container mx-auto py-8 space-y-8 px-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href={`/${lang}`} className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${lang}/blog`} className="hover:text-foreground transition-colors">
                {t('blog.title')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{post.title}</li>
          </ol>
        </nav>

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
            <article className="prose-custom max-w-none">
              <MDXRemote 
                source={post.content} 
                components={mdxComponents}
              />
            </article>
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
    </>
  );
} 
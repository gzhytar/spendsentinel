import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Locale } from '@/lib/i18n/config';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  readingTime: number;
  author?: string;
  tags?: string[];
  locale: Locale;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  summary: string;
  readingTime: number;
  author?: string;
  tags?: string[];
  locale: Locale;
}

const BLOG_DIRECTORY = path.join(process.cwd(), 'content', 'blog');

/**
 * Get all blog posts for a specific locale
 */
export async function getBlogPosts(locale: Locale = 'en'): Promise<BlogPostMetadata[]> {
  const localeDirectory = path.join(BLOG_DIRECTORY, locale);
  
  // Check if locale directory exists
  if (!fs.existsSync(localeDirectory)) {
    return [];
  }

  const files = fs.readdirSync(localeDirectory).filter(file => file.endsWith('.mdx'));
  
  const posts = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(localeDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary,
      readingTime: data.readingTime || 5,
      author: data.author,
      tags: data.tags || [],
      locale,
    } as BlogPostMetadata;
  });

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a specific blog post by slug and locale
 */
export async function getBlogPost(slug: string, locale: Locale = 'en'): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIRECTORY, locale, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary,
      content,
      readingTime: data.readingTime || 5,
      author: data.author,
      tags: data.tags || [],
      locale,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all unique slugs across all locales (for static generation)
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const allSlugs = new Set<string>();
  
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return [];
  }

  const locales = fs.readdirSync(BLOG_DIRECTORY);
  
  for (const locale of locales) {
    const localeDirectory = path.join(BLOG_DIRECTORY, locale);
    
    if (fs.statSync(localeDirectory).isDirectory()) {
      const files = fs.readdirSync(localeDirectory).filter(file => file.endsWith('.mdx'));
      files.forEach(file => {
        const slug = file.replace(/\.mdx$/, '');
        allSlugs.add(slug);
      });
    }
  }
  
  return Array.from(allSlugs);
}

/**
 * Check if a blog post exists for a given slug and locale
 */
export async function blogPostExists(slug: string, locale: Locale = 'en'): Promise<boolean> {
  const filePath = path.join(BLOG_DIRECTORY, locale, `${slug}.mdx`);
  return fs.existsSync(filePath);
}

/**
 * Get related posts based on tags
 */
export async function getRelatedPosts(
  currentSlug: string, 
  locale: Locale = 'en', 
  limit: number = 3
): Promise<BlogPostMetadata[]> {
  const currentPost = await getBlogPost(currentSlug, locale);
  if (!currentPost || !currentPost.tags || currentPost.tags.length === 0) {
    return [];
  }

  const allPosts = await getBlogPosts(locale);
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.tags && post.tags.some(tag => currentPost.tags!.includes(tag))
    )
    .slice(0, limit);

  return relatedPosts;
} 
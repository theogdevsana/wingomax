import { BLOG_POSTS, type BlogPost } from '@/lib/blogs';
import { normalizeContentHtml, resolveBlogImage } from '@/lib/cdn';

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return BLOG_POSTS.map(post => ({
    ...post,
    content: normalizeContentHtml(post.content),
    image: resolveBlogImage(post.image),
  }));
}

export async function getAllBlogPostsAdmin() {
  return BLOG_POSTS.map((post, idx) => ({
    id: String(idx + 1),
    title: post.title,
    slug: post.slug,
    description: post.description,
    date: post.date,
    author: post.author,
    content: normalizeContentHtml(post.content),
    image: resolveBlogImage(post.image),
    imageAlt: post.imageAlt,
    faqs: post.faqs ?? [],
    published: true,
    metaTitle: post.metaTitle ?? '',
    metaDescription: post.metaDescription ?? '',
    metaKeywords: post.metaKeywords ?? '',
    articleSection: post.articleSection ?? '',
    tags: post.tags ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return null;
  return {
    ...post,
    content: normalizeContentHtml(post.content),
    image: resolveBlogImage(post.image),
  };
}

export async function getBlogPostById(id: string) {
  const idx = parseInt(id) - 1;
  const post = BLOG_POSTS[idx];
  if (!post) return null;
  return {
    id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    date: post.date,
    author: post.author,
    content: normalizeContentHtml(post.content),
    image: resolveBlogImage(post.image),
    imageAlt: post.imageAlt,
    faqs: post.faqs ?? [],
    published: true,
    metaTitle: post.metaTitle ?? '',
    metaDescription: post.metaDescription ?? '',
    metaKeywords: post.metaKeywords ?? '',
    articleSection: post.articleSection ?? '',
    tags: post.tags ?? [],
  };
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

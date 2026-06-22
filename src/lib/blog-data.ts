import { BLOG_POSTS, type BlogPost } from '@/lib/blogs';
import { normalizeContentHtml, resolveBlogImage } from '@/lib/cdn';
import { query } from '@/lib/db';

function dbRowToPost(row: any): BlogPost {
  return {
    title: row.title,
    slug: row.slug,
    description: row.description,
    date: row.date,
    author: row.author,
    content: normalizeContentHtml(row.content),
    image: resolveBlogImage(row.image),
    imageAlt: row.image_alt || '',
    faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : (row.faqs || []),
    metaTitle: row.meta_title || '',
    metaDescription: row.meta_description || '',
    metaKeywords: row.meta_keywords || '',
    articleSection: row.article_section || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  let dbPosts: BlogPost[] = [];
  try {
    const result = await query('SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC', []);
    dbPosts = result.rows.map(dbRowToPost);
  } catch {}

  const staticPosts = BLOG_POSTS.map(post => ({
    ...post,
    content: normalizeContentHtml(post.content),
    image: resolveBlogImage(post.image),
  }));

  const seen = new Set<string>();
  const merged = [...dbPosts, ...staticPosts];
  return merged.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
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
  try {
    const result = await query('SELECT * FROM blog_posts WHERE slug = $1 AND published = true', [slug]);
    if (result.rows.length > 0) return dbRowToPost(result.rows[0]);
  } catch {}

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

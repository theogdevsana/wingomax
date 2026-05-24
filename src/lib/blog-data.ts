import connectToDatabase from '@/lib/mongodb';
import BlogPostModel from '@/lib/models/BlogPost';
import { BLOG_POSTS, type BlogPost, type FAQ } from '@/lib/blogs';
import { normalizeContentHtml, resolveBlogImage } from '@/lib/cdn';

function mapDoc(doc: {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  content: string;
  image: string;
  imageAlt: string;
  faqs?: FAQ[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}): BlogPost {
  return {
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    date: doc.date,
    author: doc.author,
    content: normalizeContentHtml(doc.content),
    image: resolveBlogImage(doc.image),
    imageAlt: doc.imageAlt || doc.title,
    faqs: doc.faqs?.length ? doc.faqs : undefined,
    metaTitle: doc.metaTitle || undefined,
    metaDescription: doc.metaDescription || undefined,
    metaKeywords: doc.metaKeywords || undefined,
  };
}

async function seedFromStaticIfEmpty() {
  const count = await BlogPostModel.countDocuments();
  if (count > 0) return;

  await BlogPostModel.insertMany(
    BLOG_POSTS.map((post) => ({
      title: post.title,
      slug: post.slug,
      description: post.description,
      date: post.date,
      author: post.author,
      content: post.content,
      image: resolveBlogImage(post.image),
      imageAlt: post.imageAlt,
      faqs: post.faqs ?? [],
      published: true,
      metaTitle: post.title,
      metaDescription: post.description,
      metaKeywords: '',
    }))
  );
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  await connectToDatabase();
  await seedFromStaticIfEmpty();

  const docs = await BlogPostModel.find({ published: true })
    .sort({ createdAt: -1 })
    .lean();

  return docs.map((doc) => mapDoc(doc as Parameters<typeof mapDoc>[0]));
}

export async function getAllBlogPostsAdmin() {
  await connectToDatabase();
  await seedFromStaticIfEmpty();

  const docs = await BlogPostModel.find().sort({ createdAt: -1 }).lean();
  return docs.map((doc) => ({
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    date: doc.date,
    author: doc.author,
    content: doc.content,
    image: resolveBlogImage(doc.image),
    imageAlt: doc.imageAlt,
    faqs: doc.faqs ?? [],
    published: doc.published ?? true,
    metaTitle: doc.metaTitle ?? '',
    metaDescription: doc.metaDescription ?? '',
    metaKeywords: doc.metaKeywords ?? '',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  await connectToDatabase();
  await seedFromStaticIfEmpty();

  const doc = await BlogPostModel.findOne({ slug, published: true }).lean();
  if (!doc) return null;
  return mapDoc(doc as Parameters<typeof mapDoc>[0]);
}

export async function getBlogPostById(id: string) {
  await connectToDatabase();
  const doc = await BlogPostModel.findById(id).lean();
  if (!doc) return null;
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    date: doc.date,
    author: doc.author,
    content: doc.content,
    image: resolveBlogImage(doc.image),
    imageAlt: doc.imageAlt,
    faqs: doc.faqs ?? [],
    published: doc.published ?? true,
    metaTitle: doc.metaTitle ?? '',
    metaDescription: doc.metaDescription ?? '',
    metaKeywords: doc.metaKeywords ?? '',
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

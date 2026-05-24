import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import BlogPostModel from '@/lib/models/BlogPost';
import { verifyAdminToken } from '@/lib/jwt';
import { getAllBlogPostsAdmin, slugifyTitle } from '@/lib/blog-data';
import { normalizeContentHtml, resolveBlogImage } from '@/lib/cdn';

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function GET() {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  try {
    const posts = await getAllBlogPostsAdmin();
    return NextResponse.json({ status: 'success', data: posts });
  } catch {
    return NextResponse.json({ status: 'error', msg: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      date,
      author,
      content,
      image,
      imageAlt,
      faqs,
      published,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = body;

    if (!title?.trim() || !description?.trim() || !content?.trim() || !image?.trim()) {
      return NextResponse.json(
        { status: 'error', msg: 'Title, description, content, and image are required' },
        { status: 400 }
      );
    }

    const finalSlug = (slug?.trim() || slugifyTitle(title)).toLowerCase();
    const trimmedTitle = title.trim();

    await connectToDatabase();

    const existing = await BlogPostModel.findOne({ slug: finalSlug });
    if (existing) {
      return NextResponse.json(
        { status: 'error', msg: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }

    const post = await BlogPostModel.create({
      title: trimmedTitle,
      slug: finalSlug,
      description: description.trim(),
      date:
        date?.trim() ||
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      author: author?.trim() || 'Enzo',
      content: normalizeContentHtml(content),
      image: resolveBlogImage(image.trim()),
      imageAlt: imageAlt?.trim() || trimmedTitle,
      faqs: Array.isArray(faqs) ? faqs : [],
      published: published !== false,
      metaTitle: metaTitle?.trim() || trimmedTitle,
      metaDescription: metaDescription?.trim() || description.trim(),
      metaKeywords: metaKeywords?.trim() || '',
    });

    return NextResponse.json({
      status: 'success',
      data: { id: String(post._id), slug: post.slug },
    });
  } catch {
    return NextResponse.json({ status: 'error', msg: 'Failed to create blog' }, { status: 500 });
  }
}

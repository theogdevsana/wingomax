import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import BlogPostModel from '@/lib/models/BlogPost';
import { verifyAdminToken } from '@/lib/jwt';
import { getBlogPostById, slugifyTitle } from '@/lib/blog-data';
import { normalizeContentHtml, resolveBlogImage } from '@/lib/cdn';

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) {
    return NextResponse.json({ status: 'error', msg: 'Blog not found' }, { status: 404 });
  }

  return NextResponse.json({ status: 'success', data: post });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    await connectToDatabase();

    const post = await BlogPostModel.findById(id);
    if (!post) {
      return NextResponse.json({ status: 'error', msg: 'Blog not found' }, { status: 404 });
    }

    if (body.title !== undefined) post.title = body.title.trim();
    if (body.description !== undefined) post.description = body.description.trim();
    if (body.content !== undefined) post.content = normalizeContentHtml(body.content);
    if (body.date !== undefined) post.date = body.date.trim();
    if (body.author !== undefined) post.author = body.author.trim();
    if (body.image !== undefined) post.image = resolveBlogImage(body.image.trim());
    if (body.imageAlt !== undefined) post.imageAlt = body.imageAlt.trim();
    if (body.faqs !== undefined) post.faqs = Array.isArray(body.faqs) ? body.faqs : [];
    if (body.published !== undefined) post.published = Boolean(body.published);
    if (body.metaTitle !== undefined) post.metaTitle = body.metaTitle.trim();
    if (body.metaDescription !== undefined) post.metaDescription = body.metaDescription.trim();
    if (body.metaKeywords !== undefined) post.metaKeywords = body.metaKeywords.trim();

    if (body.slug !== undefined) {
      const newSlug = (body.slug.trim() || slugifyTitle(post.title)).toLowerCase();
      const clash = await BlogPostModel.findOne({ slug: newSlug, _id: { $ne: id } });
      if (clash) {
        return NextResponse.json(
          { status: 'error', msg: 'Slug already in use' },
          { status: 400 }
        );
      }
      post.slug = newSlug;
    }

    await post.save();

    return NextResponse.json({ status: 'success', data: { id: String(post._id), slug: post.slug } });
  } catch {
    return NextResponse.json({ status: 'error', msg: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectToDatabase();
    const deleted = await BlogPostModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ status: 'error', msg: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success' });
  } catch {
    return NextResponse.json({ status: 'error', msg: 'Failed to delete blog' }, { status: 500 });
  }
}

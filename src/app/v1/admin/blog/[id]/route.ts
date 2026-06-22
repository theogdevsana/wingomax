import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyAdminToken } from '@/lib/jwt';
import { slugifyTitle } from '@/lib/blog-data';
import { normalizeContentHtml, resolveBlogImage } from '@/lib/cdn';

function mapRow(row: any) {
  return {
    id: String(row.id),
    title: row.title,
    slug: row.slug,
    description: row.description,
    date: row.date,
    author: row.author,
    content: row.content,
    image: row.image,
    imageAlt: row.image_alt || '',
    faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : (row.faqs || []),
    published: row.published,
    metaTitle: row.meta_title || '',
    metaDescription: row.meta_description || '',
    metaKeywords: row.meta_keywords || '',
    articleSection: row.article_section || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  const { id } = await params;
  const result = await query('SELECT * FROM blog_posts WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return NextResponse.json({ status: 'error', msg: 'Blog not found' }, { status: 404 });
  }

  return NextResponse.json({ status: 'success', data: mapRow(result.rows[0]) });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const postResult = await query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    if (postResult.rows.length === 0) {
      return NextResponse.json({ status: 'error', msg: 'Blog not found' }, { status: 404 });
    }

    const post = postResult.rows[0];
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (body.title !== undefined) { updates.push(`title = $${idx++}`); values.push(body.title.trim()); }
    if (body.description !== undefined) { updates.push(`description = $${idx++}`); values.push(body.description.trim()); }
    if (body.content !== undefined) { updates.push(`content = $${idx++}`); values.push(normalizeContentHtml(body.content)); }
    if (body.date !== undefined) { updates.push(`date = $${idx++}`); values.push(body.date.trim()); }
    if (body.author !== undefined) { updates.push(`author = $${idx++}`); values.push(body.author.trim()); }
    if (body.image !== undefined) { updates.push(`image = $${idx++}`); values.push(resolveBlogImage(body.image.trim())); }
    if (body.imageAlt !== undefined) { updates.push(`image_alt = $${idx++}`); values.push(body.imageAlt.trim()); }
    if (body.faqs !== undefined) { updates.push(`faqs = $${idx++}`); values.push(JSON.stringify(Array.isArray(body.faqs) ? body.faqs : [])); }
    if (body.published !== undefined) { updates.push(`published = $${idx++}`); values.push(Boolean(body.published)); }
    if (body.metaTitle !== undefined) { updates.push(`meta_title = $${idx++}`); values.push(body.metaTitle.trim()); }
    if (body.metaDescription !== undefined) { updates.push(`meta_description = $${idx++}`); values.push(body.metaDescription.trim()); }
    if (body.metaKeywords !== undefined) { updates.push(`meta_keywords = $${idx++}`); values.push(body.metaKeywords.trim()); }
    if (body.articleSection !== undefined) { updates.push(`article_section = $${idx++}`); values.push(body.articleSection.trim()); }
    if (body.tags !== undefined) { updates.push(`tags = $${idx++}`); values.push(`{${Array.isArray(body.tags) ? body.tags.filter((t: any) => t && typeof t === 'string').join(',') : ''}}`); }

    if (body.slug !== undefined) {
      const newSlug = (body.slug.trim() || slugifyTitle(body.title || post.title)).toLowerCase();
      const clash = await query('SELECT id FROM blog_posts WHERE slug = $1 AND id != $2', [newSlug, id]);
      if (clash.rows.length > 0) {
        return NextResponse.json({ status: 'error', msg: 'Slug already in use' }, { status: 400 });
      }
      updates.push(`slug = $${idx++}`);
      values.push(newSlug);
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      await query(`UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${idx}`, [...values, id]);
    }

    return NextResponse.json({ status: 'success', data: { id, slug: body.slug || post.slug } });
  } catch {
    return NextResponse.json({ status: 'error', msg: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);
    if (deleted.rows.length === 0) {
      return NextResponse.json({ status: 'error', msg: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success' });
  } catch {
    return NextResponse.json({ status: 'error', msg: 'Failed to delete blog' }, { status: 500 });
  }
}

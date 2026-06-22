import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyAdminToken } from '@/lib/jwt';
import { slugifyTitle } from '@/lib/blog-data';
import { normalizeContentHtml, resolveBlogImage } from '@/lib/cdn';

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyAdminToken(token) : null;
}

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

export async function GET() {
  const admin = await getAuthToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  try {
    const result = await query('SELECT * FROM blog_posts ORDER BY created_at DESC', []);
    const posts = result.rows.map(mapRow);
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
    const { title, slug, description, date, author, content, image, imageAlt, faqs, published, metaTitle, metaDescription, metaKeywords, articleSection, tags } = body;

    if (!title?.trim() || !content?.trim() || !image?.trim()) {
      return NextResponse.json({ status: 'error', msg: 'Title, content, and image are required' }, { status: 400 });
    }

    const finalSlug = (slug?.trim() || slugifyTitle(title)).toLowerCase();
    const trimmedTitle = title.trim();

    const existing = await query('SELECT id FROM blog_posts WHERE slug = $1', [finalSlug]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ status: 'error', msg: 'A blog with this slug already exists' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO blog_posts (title, slug, description, date, author, content, image, image_alt, faqs, published, meta_title, meta_description, meta_keywords, article_section, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id, slug`,
      [
        trimmedTitle, finalSlug, description.trim(),
        date?.trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author?.trim() || 'Enzo', normalizeContentHtml(content), resolveBlogImage(image.trim()),
        imageAlt?.trim() || trimmedTitle, JSON.stringify(Array.isArray(faqs) ? faqs : []),
        published !== false, metaTitle?.trim() || trimmedTitle, metaDescription?.trim() || description.trim(),
        metaKeywords?.trim() || '', articleSection?.trim() || '',
        Array.isArray(tags) ? `{${tags.filter((t: any) => t && typeof t === 'string').join(',')}}` : '{}'
      ]
    );

    return NextResponse.json({ status: 'success', data: { id: String(result.rows[0].id), slug: result.rows[0].slug } });
  } catch {
    return NextResponse.json({ status: 'error', msg: 'Failed to create blog' }, { status: 500 });
  }
}

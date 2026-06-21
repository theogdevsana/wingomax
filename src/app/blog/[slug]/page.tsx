import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog-data";
import Link from "next/link";
import { query } from '@/lib/db';
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  User,
  ArrowLeft,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle2,
  Cpu,
  MessageSquare,
  Server,
  ArrowUpRight
} from "lucide-react";
import { TableOfContents, FAQItem, SocialShare, ContentRenderer } from "./BlogClient";
import JsonLd from "@/components/JsonLd";
import { toAbsoluteBlogImage } from "@/lib/cdn";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || post.description;
  const keywords = post.metaKeywords
    ? post.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title: `${metaTitle} | Wingo Signal`,
    description: metaDescription,
    keywords,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: `https://wingosignals.com/blog/${slug}`,
      images: [
        {
          url: toAbsoluteBlogImage(post.image),
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
    },
  };
}

function calculateReadingTime(content: string) {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

  const contentWithDynamicLinks = post.content.replace(/https:\/\/t\.me\/enzosrs/g, telegramLink);

  const readingTime = calculateReadingTime(post.content);
  const fullUrl = `https://wingosignals.com/blog/${slug}`;
  const allPosts = await getAllBlogPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": toAbsoluteBlogImage(post.image),
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": new Date(post.date).toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "Wingo Signal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wingosignals.com/logo/official-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    }
  };

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: post.title, item: `/blog/${slug}` }
  ];

  const detailCss = `
.blog-detail-main { min-height:100vh; background:#f8fafc; padding-bottom:80px; overflow:hidden; }
.blog-detail-header { max-width:1152px; margin:0 auto; padding:32px 16px 0; }
.blog-detail-body { max-width:1152px; margin:32px auto 0; padding:0 16px; }

.blog-detail-nav { display:flex; align-items:center; gap:8px; font-size:10px; font-weight:800; color:#475569; letter-spacing:0.05em; margin-bottom:24px; white-space:nowrap; overflow:hidden; width:100%; }
.blog-detail-nav a { color:#475569; text-decoration:none; display:flex; align-items:center; gap:4px; transition:color 0.2s; flex-shrink:0; font-size:10px; font-weight:800; letter-spacing:0.05em; }
.blog-detail-nav a:hover { color:#4f46e5; }
.blog-detail-nav-sep { flex-shrink:0; color:#94a3b8; }
.blog-detail-nav-current { color:#1e293b; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:10px; font-weight:800; letter-spacing:0.05em; }

.blog-detail-meta { display:flex; align-items:center; gap:8px; }
.blog-detail-badge { padding:4px 8px; background:#eef2ff; color:#4f46e5; border-radius:8px; font-size:10px; font-weight:900; letter-spacing:0.05em; }
.blog-detail-date { font-size:12px; font-weight:800; color:#475569; }
.blog-detail-title { font-size:20px; font-weight:700; color:#1e293b; letter-spacing:-0.025em; line-height:1.2; margin-bottom:32px; text-transform:capitalize; }
.blog-detail-author-bar { display:flex; align-items:center; gap:24px; padding-top:16px; border-top:1px solid #f8fafc; margin-top:24px; flex-wrap:wrap; }
.blog-detail-author-info { display:flex; align-items:center; gap:8px; }
.blog-detail-avatar { width:32px; height:32px; border-radius:50%; background:#4f46e5; display:flex; align-items:center; justify-content:center; color:#fff; font-size:10px; font-weight:900; flex-shrink:0; }
.blog-detail-author-detail { display:flex; flex-direction:column; }
.blog-detail-author-name { font-size:12px; font-weight:900; color:#1e293b; }
.blog-detail-author-label { font-size:10px; font-weight:700; color:#94a3b8; }
.blog-detail-reading-info { display:flex; align-items:center; gap:8px; }
.blog-detail-reading-icon { width:32px; height:32px; border-radius:50%; background:#f8fafc; display:flex; align-items:center; justify-content:center; color:#94a3b8; flex-shrink:0; }
.blog-detail-reading-text { display:flex; flex-direction:column; }
.blog-detail-reading-time { font-size:12px; font-weight:900; color:#1e293b; }
.blog-detail-reading-label { font-size:10px; font-weight:700; color:#94a3b8; }

.blog-detail-image-wrap { border-radius:24px; overflow:hidden; box-shadow:0 25px 50px -12px rgba(199,210,254,0.5); margin-bottom:40px; border:1px solid #fff; }
.blog-detail-image { width:100%; height:auto; object-fit:cover; display:block; }

.blog-detail-grid { display:grid; grid-template-columns:1fr; gap:48px; }

.blog-detail-sidebar { display:none; }

.blog-detail-next-section { margin-top:64px; padding-top:48px; border-top:1px solid #f1f5f9; }
.blog-detail-next-label { font-size:12px; font-weight:700; color:#94a3b8; text-transform:capitalize; letter-spacing:0.1em; margin-bottom:32px; }
.blog-detail-next-grid { display:grid; grid-template-columns:1fr; gap:24px; }
.blog-detail-next-card { overflow:hidden; background:#fff; border-radius:24px; border:1px solid #f1f5f9; transition:all 0.3s; display:flex; flex-direction:column; text-decoration:none; }
.blog-detail-next-card:hover { border-color:#4f46e5; box-shadow:0 20px 25px -5px rgba(238,242,255,0.5); }
.blog-detail-next-img-wrap { aspect-ratio:16/9; overflow:hidden; position:relative; }
.blog-detail-next-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; display:block; }
.blog-detail-next-card:hover .blog-detail-next-img { transform:scale(1.1); }
.blog-detail-next-img-badge { position:absolute; top:16px; left:16px; padding:4px 8px; background:rgba(255,255,255,0.9); backdrop-filter:blur(4px); color:#4f46e5; border-radius:8px; font-size:10px; font-weight:900; letter-spacing:0.05em; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
.blog-detail-next-body { padding:20px; }
.blog-detail-next-title { font-size:14px; font-weight:700; color:#1e293b; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; transition:color 0.2s; line-height:1.625; }
.blog-detail-next-card:hover .blog-detail-next-title { color:#4f46e5; }

.blog-detail-sidebar-sticky { position:sticky; top:96px; display:flex; flex-direction:column; gap:24px; }

.blog-detail-premium-card { background:linear-gradient(135deg,#0f172a,#1e1b4b); color:#fff; border:1px solid #1e293b; border-radius:24px; padding:24px; box-shadow:0 20px 25px -5px rgba(79,70,229,0.1); overflow:hidden; position:relative; }
.blog-detail-premium-blur-1 { position:absolute; top:0; right:0; width:160px; height:160px; background:rgba(99,102,241,0.1); border-radius:50%; margin-right:-40px; margin-top:-40px; filter:blur(64px); pointer-events:none; }
.blog-detail-premium-blur-2 { position:absolute; left:-40px; bottom:-40px; width:128px; height:128px; background:rgba(6,182,212,0.1); border-radius:50%; filter:blur(64px); pointer-events:none; }
.blog-detail-premium-inner { position:relative; z-index:10; }
.blog-detail-premium-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.blog-detail-premium-title-group { display:flex; align-items:center; gap:10px; }
.blog-detail-premium-icon { width:36px; height:36px; background:rgba(79,70,229,0.3); border:1px solid rgba(99,102,241,0.3); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#818cf8; flex-shrink:0; }
.blog-detail-premium-label { font-size:9px; font-weight:900; color:#818cf8; text-transform:uppercase; letter-spacing:0.1em; }
.blog-detail-premium-name { font-size:14px; font-weight:900; color:#fff; line-height:1.25; }
.blog-detail-premium-live { display:flex; align-items:center; gap:6px; padding:4px 8px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.125); color:#34d399; border-radius:8px; font-size:9px; font-weight:900; letter-spacing:0.1em; }
.blog-detail-premium-dot { width:6px; height:6px; border-radius:50%; background:#34d399; flex-shrink:0; }
.blog-detail-premium-desc { font-size:12px; color:#94a3b8; line-height:1.625; margin-bottom:20px; }
.blog-detail-premium-stats { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:20px; }
.blog-detail-premium-stat { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:12px; text-align:center; }
.blog-detail-premium-stat-value { font-size:16px; font-weight:900; color:#a5b4fc; }
.blog-detail-premium-stat-label { font-size:9px; font-weight:700; color:#64748b; margin-top:2px; }
.blog-detail-premium-features { display:flex; flex-direction:column; gap:10px; }
.blog-detail-premium-feature { display:flex; align-items:center; gap:10px; }
.blog-detail-premium-feature-icon { flex-shrink:0; color:#818cf8; }
.blog-detail-premium-feature-text { font-size:11px; font-weight:700; color:#cbd5e1; }

.blog-detail-models-card { background:#fff; border:1px solid #f1f5f9; border-radius:24px; padding:24px; box-shadow:0 1px 2px rgba(0,0,0,0.05); overflow:hidden; position:relative; }
.blog-detail-models-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #f8fafc; flex-wrap:wrap; gap:8px; }
.blog-detail-models-title { font-size:12px; font-weight:900; color:#1e293b; letter-spacing:0.1em; display:flex; align-items:center; gap:8px; }
.blog-detail-models-title-icon { color:#4f46e5; flex-shrink:0; }
.blog-detail-models-status { display:flex; align-items:center; gap:6px; padding:2px 8px; background:#eef2ff; border-radius:8px; font-size:9px; font-weight:700; color:#6366f1; }
.blog-detail-models-status-dot { width:6px; height:6px; border-radius:50%; background:#6366f1; }
.blog-detail-model-row { display:flex; align-items:center; justify-content:space-between; padding:12px; border-radius:16px; background:#f8fafc; border:1px solid rgba(241,245,249,0.5); gap:8px; flex-wrap:wrap; }
.blog-detail-model-row-highlight { background:#eef2ff; border-color:rgba(199,210,254,0.375); }
.blog-detail-model-info { display:flex; flex-direction:column; gap:2px; }
.blog-detail-model-name { font-size:10px; font-weight:900; color:#334155; }
.blog-detail-model-stream { font-size:9px; font-weight:700; color:#94a3b8; }
.blog-detail-model-highlight-name { font-size:10px; font-weight:900; color:#4338ca; }
.blog-detail-model-highlight-stream { font-size:9px; font-weight:700; color:#818cf8; }
.blog-detail-model-accuracy { display:flex; align-items:center; gap:8px; }
.blog-detail-model-accuracy-value { font-size:12px; font-weight:900; color:#059669; }
.blog-detail-model-accuracy-dot { width:6px; height:6px; border-radius:50%; background:#10b981; flex-shrink:0; }
.blog-detail-model-accuracy-dot-pulse { width:6px; height:6px; border-radius:50%; background:#6366f1; flex-shrink:0; }

.blog-detail-support-card { background:#fff; border:1px solid #f1f5f9; border-radius:24px; padding:24px; box-shadow:0 1px 2px rgba(0,0,0,0.05); overflow:hidden; position:relative; }
.blog-detail-support-blur { position:absolute; top:0; right:0; width:80px; height:80px; background:#f0f9ff; border-radius:50%; margin-right:-24px; margin-top:-24px; transition:transform 0.5s; pointer-events:none; }
.blog-detail-support-card:hover .blog-detail-support-blur { transform:scale(1.1); }
.blog-detail-support-inner { position:relative; z-index:10; }
.blog-detail-support-icon { width:40px; height:40px; background:#f0f9ff; border:1px solid #e0f2fe; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#0ea5e9; margin-bottom:16px; }
.blog-detail-support-title { font-size:12px; font-weight:900; color:#1e293b; letter-spacing:0.1em; margin-bottom:4px; }
.blog-detail-support-desc { font-size:12px; color:#64748b; line-height:1.625; margin-bottom:20px; }
.blog-detail-support-agent { display:flex; align-items:center; gap:12px; padding:12px; background:#f8fafc; border:1px solid #f1f5f9; border-radius:16px; margin-bottom:16px; }
.blog-detail-support-agent-avatar { width:36px; height:36px; border-radius:50%; background:#0ea5e9; display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; font-weight:900; box-shadow:0 1px 3px rgba(0,0,0,0.1); flex-shrink:0; position:relative; }
.blog-detail-support-agent-status { position:absolute; bottom:0; right:0; width:10px; height:10px; border-radius:50%; background:#10b981; border:2px solid #fff; }
.blog-detail-support-agent-info { display:flex; flex-direction:column; }
.blog-detail-support-agent-name { font-size:11px; font-weight:900; color:#1e293b; }
.blog-detail-support-agent-role { font-size:9px; font-weight:700; color:#94a3b8; }
.blog-detail-support-btn { display:flex; width:100%; background:#229ED9; color:#fff; padding:14px 0; border-radius:16px; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; text-decoration:none; align-items:center; justify-content:center; gap:8px; box-shadow:0 10px 15px -3px rgba(14,165,233,0.2); transition:all 0.3s; border:none; cursor:pointer; }
.blog-detail-support-btn:hover { background:#1a8bbf; transform:scale(1.02); }
.blog-detail-support-btn:active { transform:scale(0.98); }

.blog-detail-trending-card { background:#fff; border:1px solid #f1f5f9; border-radius:24px; padding:24px; box-shadow:0 1px 2px rgba(0,0,0,0.05); }
.blog-detail-trending-title { font-size:12px; font-weight:900; color:#1e293b; text-transform:capitalize; letter-spacing:0.1em; margin-bottom:24px; display:flex; align-items:center; gap:8px; }
.blog-detail-trending-title-icon { color:#4f46e5; flex-shrink:0; }
.blog-detail-trending-list { display:flex; flex-direction:column; gap:16px; }
.blog-detail-trending-item { display:flex; gap:16px; padding:8px; border-radius:16px; border:1px solid transparent; transition:all 0.3s; text-decoration:none; }
.blog-detail-trending-item:hover { background:#f8fafc; border-color:rgba(241,245,249,0.5); }
.blog-detail-trending-num { background:#f8fafc; color:#94a3b8; font-size:10px; font-weight:900; width:32px; height:32px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.2s,color 0.2s; }
.blog-detail-trending-item:hover .blog-detail-trending-num { background:#eef2ff; color:#4f46e5; }
.blog-detail-trending-content { display:flex; flex-direction:column; gap:4px; min-width:0; }
.blog-detail-trending-tag { font-size:9px; font-weight:900; color:#4f46e5; text-transform:uppercase; letter-spacing:0.1em; }
.blog-detail-trending-post-title { font-size:12px; font-weight:700; color:#334155; transition:color 0.2s; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.625; }
.blog-detail-trending-item:hover .blog-detail-trending-post-title { color:#4f46e5; }

@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
@media (min-width:768px) {
  .blog-detail-header { padding-top:48px; }
  .blog-detail-body { margin-top:48px; }
  .blog-detail-title { font-size:30px; }
}
@media (min-width:1024px) {
  .blog-detail-grid { grid-template-columns:8fr 4fr; }
  .blog-detail-sidebar { display:block; }
  .blog-detail-next-grid { grid-template-columns:1fr 1fr; }
}
`;

  return (
    <>
      <style>{detailCss}</style>
      <main className="blog-detail-main">
        <JsonLd breadcrumbs={breadcrumbs} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        <div className="blog-detail-header">
          <nav className="blog-detail-nav" aria-label="Breadcrumb">
            <Link href="/blog">
              <ArrowLeft size={12} /> Blog
            </Link>
            <span className="blog-detail-nav-sep">/</span>
            <span className="blog-detail-nav-current">{post.title}</span>
          </nav>

          <div className="blog-detail-meta">
            <span className="blog-detail-badge">Article</span>
            <span className="blog-detail-date">Last Updated: {post.date}</span>
          </div>

          <h1 className="blog-detail-title">{post.title}</h1>

          <div className="blog-detail-author-bar">
            <div className="blog-detail-author-info">
              <div className="blog-detail-avatar">{post.author.charAt(0)}</div>
              <div className="blog-detail-author-detail">
                <span className="blog-detail-author-name">{post.author}</span>
                <span className="blog-detail-author-label">Author</span>
              </div>
            </div>
            <div className="blog-detail-reading-info">
              <div className="blog-detail-reading-icon">
                <Clock size={14} />
              </div>
              <div className="blog-detail-reading-text">
                <span className="blog-detail-reading-time">{readingTime} Min</span>
                <span className="blog-detail-reading-label">Read Time</span>
              </div>
            </div>
          </div>
        </div>

        <div className="blog-detail-body">
          <div className="blog-detail-grid">
            <article>
              <div className="blog-detail-image-wrap">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="blog-detail-image"
                  width={800}
                  height={450}
                  quality={95}
                  priority
                  style={{ height: 'auto' }}
                />
              </div>

              <TableOfContents content={contentWithDynamicLinks} />

              <ContentRenderer html={contentWithDynamicLinks} />

              <SocialShare title={post.title} url={fullUrl} />

              {post.faqs && post.faqs.length > 0 && (
                <section className="blog-detail-next-section" style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid #f1f5f9' }}>
                  <h2 className="blog-detail-next-label" style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', flexShrink: 0 }}>
                      <Shield size={18} />
                    </span>
                    Frequently Asked Questions
                  </h2>
                  <div>
                    {post.faqs.map((faq, index) => (
                      <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </section>
              )}

              <div className="blog-detail-next-section">
                <h3 className="blog-detail-next-label">Continue Reading</h3>
                <div className="blog-detail-next-grid">
                  {otherPosts.slice(0, 2).map((other) => (
                    <Link href={`/blog/${other.slug}`} key={other.slug} className="blog-detail-next-card">
                      <div className="blog-detail-next-img-wrap">
                        <Image
                          src={other.image}
                          alt={other.title}
                          width={400}
                          height={225}
                          className="blog-detail-next-img"
                        />
                        <span className="blog-detail-next-img-badge">Next Article</span>
                      </div>
                      <div className="blog-detail-next-body">
                        <h4 className="blog-detail-next-title">{other.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            <aside className="blog-detail-sidebar">
              <div className="blog-detail-sidebar-sticky">
                <div className="blog-detail-premium-card">
                  <div className="blog-detail-premium-blur-1" />
                  <div className="blog-detail-premium-blur-2" />
                  <div className="blog-detail-premium-inner">
                    <div className="blog-detail-premium-header">
                      <div className="blog-detail-premium-title-group">
                        <div className="blog-detail-premium-icon">
                          <Cpu size={18} />
                        </div>
                        <div>
                          <p className="blog-detail-premium-label">About This Tool</p>
                          <h3 className="blog-detail-premium-name">Wingo Signal AI</h3>
                        </div>
                      </div>
                      <span className="blog-detail-premium-live">
                        <span className="blog-detail-premium-dot" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                        LIVE
                      </span>
                    </div>

                    <p className="blog-detail-premium-desc">
                      Wingo Signal organizes recent result history into colour, number, and size views. Its signals are statistical estimates based on available data and do not guarantee a future outcome.
                    </p>

                    <div className="blog-detail-premium-stats">
                      <div className="blog-detail-premium-stat">
                        <p className="blog-detail-premium-stat-value">4</p>
                        <p className="blog-detail-premium-stat-label">Intervals</p>
                      </div>
                      <div className="blog-detail-premium-stat">
                        <p className="blog-detail-premium-stat-value" style={{ color: '#34d399' }}>10</p>
                        <p className="blog-detail-premium-stat-label">History Rows</p>
                      </div>
                      <div className="blog-detail-premium-stat">
                        <p className="blog-detail-premium-stat-value" style={{ color: '#22d3ee' }}>Web</p>
                        <p className="blog-detail-premium-stat-label">No APK</p>
                      </div>
                    </div>

                    <div className="blog-detail-premium-features">
                      <div className="blog-detail-premium-feature">
                        <CheckCircle2 size={13} className="blog-detail-premium-feature-icon" />
                        <span className="blog-detail-premium-feature-text">Multi-timeframe pattern scanner</span>
                      </div>
                      <div className="blog-detail-premium-feature">
                        <CheckCircle2 size={13} className="blog-detail-premium-feature-icon" />
                        <span className="blog-detail-premium-feature-text">Real-time Telegram webhook delivery</span>
                      </div>
                      <div className="blog-detail-premium-feature">
                        <CheckCircle2 size={13} className="blog-detail-premium-feature-icon" />
                        <span className="blog-detail-premium-feature-text">24/7 neural depth scanning</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="blog-detail-models-card">
                  <div className="blog-detail-models-header">
                    <h3 className="blog-detail-models-title">
                      <Zap size={15} className="blog-detail-models-title-icon" />
                      AI Prediction Models
                    </h3>
                    <div className="blog-detail-models-status">
                      <span className="blog-detail-models-status-dot" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                      Running
                    </div>
                  </div>

                  <div>
                    <div className="blog-detail-model-row" style={{ marginBottom: '12px' }}>
                      <div className="blog-detail-model-info">
                        <span className="blog-detail-model-name">Color Pattern Model</span>
                        <span className="blog-detail-model-stream">Wingo 1-Min Stream</span>
                      </div>
                      <div className="blog-detail-model-accuracy">
                        <span className="blog-detail-model-accuracy-value">History</span>
                        <span className="blog-detail-model-accuracy-dot" />
                      </div>
                    </div>

                    <div className="blog-detail-model-row" style={{ marginBottom: '12px' }}>
                      <div className="blog-detail-model-info">
                        <span className="blog-detail-model-name">Number Sequence Model</span>
                        <span className="blog-detail-model-stream">Wingo 3-Min Stream</span>
                      </div>
                      <div className="blog-detail-model-accuracy">
                        <span className="blog-detail-model-accuracy-value">Sequence</span>
                        <span className="blog-detail-model-accuracy-dot" />
                      </div>
                    </div>

                    <div className="blog-detail-model-row" style={{ marginBottom: '12px' }}>
                      <div className="blog-detail-model-info">
                        <span className="blog-detail-model-name">Trend Reversal Model</span>
                        <span className="blog-detail-model-stream">Wingo 5-Min Stream</span>
                      </div>
                      <div className="blog-detail-model-accuracy">
                        <span className="blog-detail-model-accuracy-value">Trend</span>
                        <span className="blog-detail-model-accuracy-dot" />
                      </div>
                    </div>

                    <div className="blog-detail-model-row blog-detail-model-row-highlight">
                      <div className="blog-detail-model-info">
                        <span className="blog-detail-model-highlight-name">Deep Seed Analyzer</span>
                        <span className="blog-detail-model-highlight-stream">All Timeframes</span>
                      </div>
                      <div className="blog-detail-model-accuracy">
                        <span className="blog-detail-model-accuracy-value" style={{ color: '#4f46e5' }}>Combined</span>
                        <span className="blog-detail-model-accuracy-dot-pulse" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="blog-detail-support-card" style={{ cursor: 'default' }}>
                  <div className="blog-detail-support-blur" />
                  <div className="blog-detail-support-inner">
                    <div className="blog-detail-support-icon">
                      <MessageSquare size={18} />
                    </div>
                    <h3 className="blog-detail-support-title">VIP Support Desk</h3>
                    <p className="blog-detail-support-desc">
                      Key issues, activation help, or direct access? Our support team is live on Telegram 24/7.
                    </p>

                    <div className="blog-detail-support-agent">
                      <div className="blog-detail-support-agent-avatar">
                        W
                        <span className="blog-detail-support-agent-status" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                      </div>
                      <div className="blog-detail-support-agent-info">
                        <span className="blog-detail-support-agent-name">ᨒ Wingo Signals 📍</span>
                        <span className="blog-detail-support-agent-role">Official channel</span>
                      </div>
                    </div>

                    <Link
                      href={telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-detail-support-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      Open Telegram
                    </Link>
                  </div>
                </div>

                <div className="blog-detail-trending-card">
                  <h3 className="blog-detail-trending-title">
                    <TrendingUp size={16} className="blog-detail-trending-title-icon" />
                    Trending Reads
                  </h3>
                  <div className="blog-detail-trending-list">
                    {otherPosts.map((trending, index) => {
                      let tag = "Guide";
                      if (trending.slug.includes("free-vs-paid")) tag = "Comparison";
                      else if (trending.slug.includes("activation") || trending.slug.includes("license")) tag = "Setup";
                      else if (trending.slug.includes("strategy") || trending.slug.includes("tips")) tag = "Advanced";
                      else if (trending.slug.includes("how-to-use")) tag = "Tutorial";

                      return (
                        <Link
                          href={`/blog/${trending.slug}`}
                          key={trending.slug}
                          className="blog-detail-trending-item"
                        >
                          <div className="blog-detail-trending-num">0{index + 1}</div>
                          <div className="blog-detail-trending-content">
                            <span className="blog-detail-trending-tag">{tag}</span>
                            <h4 className="blog-detail-trending-post-title">{trending.title}</h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export const dynamic = 'force-dynamic';

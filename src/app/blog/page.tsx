import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/lib/blog-data";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Wingo Signal Guides | History, Patterns and Responsible Use",
  description: "Read practical guides about Wingo result history, pattern interpretation, account access, product updates, and responsible use of statistical signals.",
  keywords: ["wingo guides", "wingo history", "big small patterns", "statistical signals"],
  alternates: {
    canonical: '/blog',
  },
};

import JsonLd from "@/components/JsonLd";

export default async function BlogListing() {
  const BLOG_POSTS = await getAllBlogPosts();

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Wingo Blog", item: "/blog" }
  ];

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://wingosignals.com/blog",
    "name": "Wingo Signal Blog",
    "description": "Guides about Wingo history, pattern interpretation, product use, and statistical-signal limitations.",
    "url": "https://wingosignals.com/blog",
    "blogPost": BLOG_POSTS.map((post, i) => ({
      "@type": "BlogPosting",
      "position": i + 1,
      "headline": post.title,
      "url": `https://wingosignals.com/blog/${post.slug}`,
      "datePublished": new Date(post.date).toISOString(),
    }))
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wingo Signal",
    "url": "https://wingosignals.com",
    "logo": "https://wingosignals.com/logo/official-logo.png",
    "description": "Browser-based Wingo period tracking, result history, and statistical signal context."
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Wingo Signal",
    "url": "https://wingosignals.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wingosignals.com/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const listingCss = `
.blog-listing-main { min-height:100vh; background:#f8fafc; padding:48px 16px; overflow:hidden; }
.blog-listing-container { max-width:896px; margin:0 auto; }
.blog-listing-header { text-align:center; margin-bottom:48px; }
.blog-listing-title { font-size:24px; font-weight:700; color:#1e293b; letter-spacing:-0.025em; margin-bottom:8px; }
.blog-listing-subtitle { font-size:12px; color:#64748b; font-weight:500; letter-spacing:0.025em; }
.blog-listing-grid { display:grid; grid-template-columns:1fr; gap:32px; }
.blog-card { display:flex; flex-direction:column; background:#fff; border-radius:16px; overflow:hidden; transition:all 0.3s; box-shadow:0 12px 24px rgba(0,0,0,0.15); text-decoration:none; color:#1e293b; }
.blog-card:hover { transform:translateY(-4px); box-shadow:0 20px 32px rgba(74,110,242,0.2); }
.blog-card-img-wrap { position:relative; height:176px; overflow:hidden; flex-shrink:0; }
.blog-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
.blog-card:hover .blog-card-img { transform:scale(1.1); }
.blog-card-badge-wrap { position:absolute; top:12px; left:12px; display:flex; gap:8px; }
.blog-card-badge { padding:2px 8px; background:rgba(16,185,129,0.95); backdrop-filter:blur(12px); color:#fff; border-radius:9999px; font-size:10px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700; }
.blog-card-body { padding:12px; display:flex; flex-direction:column; flex:1; }
.blog-card-meta { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.blog-card-date { padding:2px 8px; background:rgba(16,185,129,0.1); color:#10b981; border-radius:9999px; font-size:10px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700; }
.blog-card-heading { font-size:16px; font-weight:700; margin-bottom:8px; color:#4a6ef2; line-height:1.25; transition:color 0.2s; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-clamp:2; }
.blog-card-desc { margin:0; font-size:12px; color:#64748b; line-height:1.625; flex:1; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-clamp:2; }
@media (min-width:768px) { .blog-listing-title { font-size:30px; } .blog-listing-subtitle { font-size:14px; } .blog-listing-grid { grid-template-columns:1fr 1fr; } }
`;

  return (
    <>
      <style>{listingCss}</style>
      <main className="blog-listing-main">
        <JsonLd breadcrumbs={breadcrumbs} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <div className="blog-listing-container">
          <div className="blog-listing-header">
            <h1 className="blog-listing-title">Wingo Signal Blog</h1>
            <p className="blog-listing-subtitle">History interpretation, product help, and responsible-use guides</p>
          </div>

          <div className="blog-listing-grid">
            {BLOG_POSTS.map((post) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.slug} 
                className="blog-card"
              >
                <div className="blog-card-img-wrap">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    width={600}
                    height={338}
                    quality={95}
                    priority
                    className="blog-card-img"
                  />
                  <div className="blog-card-badge-wrap">
                    <span className="blog-card-badge">How To</span>
                  </div>
                </div>

                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className="blog-card-date">Last Updated: {post.date}</span>
                  </div>
                  <h3 className="blog-card-heading">{post.title}</h3>
                  <p className="blog-card-desc">{post.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

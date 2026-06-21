import { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog-data";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Sitemap | Wingo Signal",
  description: "Complete sitemap of Wingo Signal website. Browse all pages including prediction tools, blog posts, and policy pages.",
  keywords: ["wingo signal sitemap", "wingo site map", "wingo signal pages", "wingo prediction sitemap"],
  alternates: { canonical: "/sitemap" },
};

const detailCss = `
.sitemap-main { min-height:100vh; background:#f8fafc; }
.sitemap-wrap { max-width:768px; margin:0 auto; padding:0 16px; padding-top:48px; padding-bottom:48px; }
.sitemap-header { text-align:center; margin-bottom:40px; }
.sitemap-title { font-size:24px; font-weight:700; color:#1e293b; letter-spacing:-0.025em; margin-bottom:8px; }
.sitemap-subtitle { font-size:12px; color:#475569; font-weight:500; }
.sitemap-section-wrap { display:flex; flex-direction:column; gap:32px; }
.sitemap-section-title { font-size:14px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px; }
.sitemap-card { background:#fff; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.1); border:1px solid #e2e8f0; }
.sitemap-card-inner { }
.sitemap-link { display:block; padding:12px 16px; font-size:14px; font-weight:500; color:#4f46e5; text-decoration:none; transition:all 0.2s; }
.sitemap-link:hover { color:#3730a3; background:#f8fafc; }
.sitemap-link + .sitemap-link { border-top:1px solid #f1f5f9; }
@media (min-width:768px) { .sitemap-title { font-size:30px; } .sitemap-subtitle { font-size:14px; } }
`;

export default async function SitemapPage() {
  const blogPosts = await getAllBlogPosts();

  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "Wingo Blog", href: "/blog" },
        { name: "About", href: "/about" },
        { name: "FAQ", href: "/faq" },
        { name: "Subscribe", href: "/subscribe" },
      ],
    },
    {
      title: "Prediction Tools",
      links: [
        { name: "30 Seconds Prediction", href: "/wingo-30-seconds-prediction" },
        { name: "1 Minute Prediction", href: "/wingo-1-minute-prediction" },
        { name: "3 Minute Prediction", href: "/wingo-3-minute-prediction" },
        { name: "5 Minute Prediction", href: "/wingo-5-minute-prediction" },
      ],
    },
    {
      title: "Blog Posts",
      links: blogPosts.map((p) => ({ name: p.title, href: `/blog/${p.slug}` })),
    },
    {
      title: "Policies",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Refund Policy", href: "/refund" },
      ],
    },
    {
      title: "XML Sitemaps",
      links: [
        { name: "Main Sitemap (XML)", href: "/sitemap-static.xml" },
        { name: "Blog Sitemap (XML)", href: "/blog-sitemap.xml" },
        { name: "Wingo Sitemap (XML)", href: "/wingo-sitemap.xml" },
        { name: "Image Sitemap (XML)", href: "/img-sitemap.xml" },
      ],
    },
  ];

  return (
    <main className="sitemap-main">
      <style>{detailCss}</style>
      <div className="sitemap-wrap">
        <div className="sitemap-header">
          <h1 className="sitemap-title">Sitemap</h1>
          <p className="sitemap-subtitle">Browse all pages on Wingo Signal</p>
        </div>

        <div className="sitemap-section-wrap">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="sitemap-section-title">{section.title}</h2>
              <div className="sitemap-card">
                <div className="sitemap-card-inner">
                  {section.links.map((link) => (
                    <Link key={link.href} href={link.href} className="sitemap-link">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

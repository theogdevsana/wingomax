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

export default async function SitemapPage() {
  const blogPosts = await getAllBlogPosts();

  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "Login", href: "/login" },
        { name: "Wingo Blog", href: "/blog" },
        { name: "FAQ", href: "/faq" },
        { name: "Subscribe", href: "/subscribe" },
        { name: "Free Fire Rewards", href: "/free-fire-rewards" },
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
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-2">Sitemap</h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium">Browse all pages on Wingo Signal</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{section.title}</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-slate-50 transition-colors no-underline"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

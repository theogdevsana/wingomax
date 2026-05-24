import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/lib/blog-data";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Wingo Signal Blog - Prediction Tips, Guides & More",
  description: "Explore the latest guides, strategies, and updates about Wingo Signal. Learn how to use and purchase our premium prediction tools.",
  keywords: "Wingo Signal, Wingo Prediction, Game Strategy, Purchase License, AI Prediction Tool",
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

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <JsonLd breadcrumbs={breadcrumbs} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-2 ">Wingo Signal Blog</h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium tracking-wide">Expert insights, strategies, and tutorials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.slug} 
              className="flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:shadow-[0_20px_32px_rgba(74,110,242,0.2)] group no-underline text-[#172032]"
            >
              {/* Card Image */}
              <div className="relative h-44 overflow-hidden shrink-0">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  width={600}
                  height={338}
                  quality={95}
                  priority
                  className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 bg-emerald-500/95 backdrop-blur-md text-white rounded-full text-[10px] uppercase tracking-wider font-bold">
                    How To
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-3 flex flex-col grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] uppercase tracking-wider font-bold">
                    {post.date}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-2 text-[#4a6ef2] leading-tight transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mb-0 text-xs text-slate-500 leading-relaxed grow line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

import { BLOG_POSTS } from "@/lib/blogs";
import Link from "next/link";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, User, ArrowLeft, TrendingUp, Zap, Shield } from "lucide-react";
import { TableOfContents, FAQItem, SocialShare, ContentRenderer } from "./BlogClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | Wingo Signal`,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://wingosignal.com/blog/${slug}`,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
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
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  const contentWithDynamicLinks = post.content.replace(/https:\/\/t\.me\/enzosrs/g, telegramLink);

  const readingTime = calculateReadingTime(post.content);
  const fullUrl = `https://wingosignal.com/blog/${slug}`;
  const otherPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Article Header & Image - Blended with Background */}
      <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Breadcrumbs - Fixed to Single Line with Truncation */}
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 tracking-widest mb-6 whitespace-nowrap overflow-hidden w-full" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-indigo-600 flex items-center gap-1 transition-colors shrink-0">
            <ArrowLeft size={12} /> Blog
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-slate-800 truncate">{post.title}</span>
        </nav>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black tracking-wider">
              Article
            </span>
            <span className="text-xs font-bold text-slate-400">{post.date}</span>
          </div>
          
          <h1 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight leading-[1.2] mb-8 capitalize">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 pt-4 border-t border-slate-50 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                {post.author.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800">{post.author}</span>
                <span className="text-[10px] font-bold text-slate-400">Author</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Clock size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800">{readingTime} Min</span>
                <span className="text-[10px] font-bold text-slate-400">Read Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100 mb-10 border border-white">
              <Image 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto object-cover"
                width={800}
                height={450}
                quality={95}
                priority
              />
            </div>

            <TableOfContents content={contentWithDynamicLinks} />

            <div className="mt-8">
              <ContentRenderer html={contentWithDynamicLinks} />
            </div>

            <SocialShare title={post.title} url={fullUrl} />

            {post.faqs && post.faqs.length > 0 && (
              <section className="mt-16 pt-12 border-t border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-8 capitalize tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Shield size={18} />
                  </span>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </section>
            )}

            {/* Next Post Navigation */}
            <div className="mt-16 pt-12 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 capitalize tracking-widest mb-8">Continue Reading</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherPosts.slice(0, 2).map((other) => (
                  <Link href={`/blog/${other.slug}`} key={other.slug} className="group overflow-hidden bg-white rounded-3xl border border-slate-100 hover:border-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-50/50 flex flex-col">
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <Image 
                        src={other.image} 
                        alt={other.title} 
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 rounded-lg text-[10px] font-black tracking-wider shadow-sm">
                          Next Article
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-relaxed">
                        {other.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Premium CTA */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 capitalize tracking-widest mb-2">Neural AI Analyst</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Join 50,000+ winners using our real-time neural patterns analysis.
                  </p>
                  <Link href="/" className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
                    Get Access Now
                  </Link>
                </div>
              </div>

              {/* Trending Sidebar */}
              <div className="p-2">
                <h3 className="text-sm font-bold text-slate-800 capitalize tracking-widest mb-6 flex items-center gap-2 px-4">
                  <TrendingUp size={16} className="text-indigo-600" />
                  Trending
                </h3>
                <div className="space-y-2">
                  {otherPosts.map((trending) => (
                    <Link href={`/blog/${trending.slug}`} key={trending.slug} className="block p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-50 group">
                      <h4 className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed">
                        {trending.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog-data";
import Link from "next/link";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
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
      url: `https://wingosignals.xyz/blog/${slug}`,
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

  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  const contentWithDynamicLinks = post.content.replace(/https:\/\/t\.me\/enzosrs/g, telegramLink);

  const readingTime = calculateReadingTime(post.content);
  const fullUrl = `https://wingosignals.xyz/blog/${slug}`;
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
        "url": "https://wingosignals.xyz/logo/official-logo.png"
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

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
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
      {/* Article Header & Image - Blended with Background */}
      <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
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

      <div className="max-w-6xl mx-auto px-4 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100 mb-10 border border-white">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                className="w-full h-auto object-cover"
                width={800}
                height={450}
                quality={95}
                priority
                style={{ height: 'auto' }}
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
              {/* About Neural AI — Premium Info Card */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 rounded-3xl p-6 shadow-xl shadow-indigo-950/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-indigo-600/30 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400">
                        <Cpu size={18} className="animate-pulse" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">About This Tool</p>
                        <h3 className="text-sm font-black text-white leading-tight">Wingo Signal AI</h3>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      LIVE
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-5">
                    Wingo Signal tracks live game patterns using advanced data analysis and years of historical results. Instead of random guesses, the system studies color and number trends in real time and sends fast Telegram alerts based on calculated probability and pattern behavior.
                  </p>

                  {/* Key stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                      <p className="text-base font-black text-indigo-300">95.4%</p>
                      <p className="text-[9px] font-bold text-slate-500 mt-0.5">Accuracy</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                      <p className="text-base font-black text-emerald-400">50K+</p>
                      <p className="text-[9px] font-bold text-slate-500 mt-0.5">Users</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                      <p className="text-base font-black text-cyan-400">1.2s</p>
                      <p className="text-[9px] font-bold text-slate-500 mt-0.5">Alert Speed</p>
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-300">Multi-timeframe pattern scanner</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-300">Real-time Telegram webhook delivery</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-300">24/7 neural depth scanning</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Prediction Models — Accuracy Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-50">
                  <h3 className="text-xs font-black text-slate-800 tracking-widest flex items-center gap-2">
                    <Zap size={15} className="text-indigo-600" fill="currentColor" />
                    AI Prediction Models
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 rounded-lg text-[9px] font-bold text-indigo-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Running
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Model row */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-slate-700">Color Pattern Model</span>
                      <span className="text-[9px] font-bold text-slate-400">Wingo 1-Min Stream</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-600">96.1%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  {/* Model row */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-slate-700">Number Sequence Model</span>
                      <span className="text-[9px] font-bold text-slate-400">Wingo 3-Min Stream</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-600">94.7%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  {/* Model row */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-slate-700">Trend Reversal Model</span>
                      <span className="text-[9px] font-bold text-slate-400">Wingo 5-Min Stream</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-600">95.4%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  {/* Model row */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 border border-indigo-100/60">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-indigo-700">Deep Seed Analyzer</span>
                      <span className="text-[9px] font-bold text-indigo-400">All Timeframes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-indigo-600">93.8%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Support / Telegram Desk */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-sky-50 rounded-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />

                <div className="relative z-10">
                  <div className="w-10 h-10 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center text-sky-500 mb-4">
                    <MessageSquare size={18} fill="currentColor" />
                  </div>

                  <h3 className="text-xs font-black text-slate-800 tracking-widest mb-1">VIP Support Desk</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    Key issues, activation help, or direct access? Our support team is live on Telegram 24/7.
                  </p>

                  {/* Agent card */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl mb-4">
                    <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white text-[11px] font-black shadow-sm shrink-0 relative">
                      W
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-800">ᨒ Wingo Signals 📍</span>
                      <span className="text-[9px] font-bold text-slate-400">Official channel</span>
                    </div>
                  </div>



                  {/* Telegram button */}
                  <Link
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#229ED9] hover:bg-[#1a8bbf] text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-sky-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    Open Telegram
                  </Link>
                </div>
              </div>

              {/* Trending Sidebar */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 capitalize tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-600" />
                  Trending Reads
                </h3>
                <div className="space-y-4">
                  {otherPosts.map((trending, index) => {
                    // Match category tag
                    let tag = "Guide";
                    if (trending.slug.includes("free-vs-paid")) tag = "Comparison";
                    else if (trending.slug.includes("activation")) tag = "Setup";
                    else if (trending.slug.includes("strategy") || trending.slug.includes("tips")) tag = "Advanced";
                    else if (trending.slug.includes("how-to-use")) tag = "Tutorial";

                    return (
                      <Link
                        href={`/blog/${trending.slug}`}
                        key={trending.slug}
                        className="flex gap-4 p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100/50 group transition-all duration-300"
                      >
                        <div className="bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-[10px] font-black w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                          0{index + 1}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                            {tag}
                          </span>
                          <h4 className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed">
                            {trending.title}
                          </h4>
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
  );
}

export const dynamic = 'force-dynamic';

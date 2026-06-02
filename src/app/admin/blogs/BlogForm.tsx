"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import styles from "./blogs-admin.module.css";
import { getApiUrl } from "@/lib/api-utils";
import { cdnPathHint, DEFAULT_BLOG_IMAGE, resolveBlogImage } from "@/lib/cdn";

const SummernoteEditor = dynamic(
  () => import("@/components/admin/SummernoteEditor"),
  { ssr: false, loading: () => <div className="h-64 bg-slate-50 rounded-lg animate-pulse" /> }
);

export type BlogFormData = {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  content: string;
  image: string;
  imageAlt: string;
  faqs: { question: string; answer: string }[];
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  tags: string[];
};

export function emptyBlogForm(): BlogFormData {
  return {
    title: "",
    slug: "",
    description: "",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    author: "Enzo",
    content: "",
    image: DEFAULT_BLOG_IMAGE,
    imageAlt: "",
    faqs: [],
    published: true,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    tags: [],
  };
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type BlogFormProps = {
  initial?: BlogFormData;
  postId?: string;
};

export default function BlogForm({ initial, postId }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial ?? emptyBlogForm());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const isEdit = Boolean(postId);

  const slugify2 = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    const firstH2 = form.content.match(/<h2[^>]*>(.*?)<\/h2>/i);
    const articleSection = firstH2 ? firstH2[1].replace(/<[^>]*>/g, '').trim() : 'Guide';

    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      image: resolveBlogImage(form.image),
      metaTitle: form.metaTitle.trim() || form.title.trim(),
      metaDescription: form.metaDescription.trim() || form.description.trim(),
      metaKeywords: form.metaKeywords.trim() || form.tags.filter(t => t.trim()).join(', '),
      articleSection,
      faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      tags: form.tags.filter(t => t.trim()),
    };

    try {
      const url = isEdit ? `/v1/admin/blog/${postId}` : "/v1/admin/blog";
      const res = await fetch(getApiUrl(url), { credentials: 'include', 
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        router.push("/admin/blogs");
        router.refresh();
      } else {
        setMessage({ text: data.msg || "Save failed", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const addFaq = () => {
    setForm((f) => ({ ...f, faqs: [...f.faqs, { question: "", answer: "" }] }));
  };

  return (
    <div className={`${styles.root} pb-20`}>
      <form onSubmit={handleSave}>
        <div className="pb-4 border-b border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{isEdit ? "Edit Post" : "New Post"}</h1>
            <p className="text-slate-500 text-xs mt-1">Default: {DEFAULT_BLOG_IMAGE} — or paste any full image URL</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/blogs" className={`${styles.btnGhost} bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 inline-flex items-center gap-1.5 transition-all shadow-sm rounded-lg`}>
              <ArrowLeft size={14} /> Back
            </Link>
            <button type="submit" disabled={saving} className={`${styles.btnGreen} bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 shadow-md hover:shadow-lg transition-all rounded-lg`}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isEdit ? "Update" : "Publish"}
            </button>
          </div>
        </div>

      {message.text && (
        <div className={`mb-6 p-3 rounded-xl text-xs font-medium border ${message.type === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Main Details Card */}
        <div className={`${styles.card} p-5 space-y-5 shadow-sm`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <h2 className="text-sm font-bold text-slate-800">Basic Info</h2>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              Published
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="font-bold text-slate-700">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  slug: isEdit ? f.slug : slugify(title),
                  metaTitle: f.metaTitle || title,
                }));
              }}
              className="w-full mt-1 rounded-lg border border-slate-200"
              required
            />
          </div>
          <div>
            <label className="font-bold text-slate-700">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-slate-200 font-mono"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-bold text-slate-700">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value,
                  metaDescription: f.metaDescription || e.target.value,
                }))
              }
              rows={2}
              className="w-full mt-1 rounded-lg border border-slate-200 resize-none"
              required
            />
          </div>
          <div>
            <label className="font-bold text-slate-700">Date</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700">Author</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-slate-200"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700">Featured image *</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              onBlur={(e) => setForm((f) => ({ ...f, image: resolveBlogImage(e.target.value) }))}
              className="w-full mt-1 rounded-lg border border-slate-200 font-mono"
              required
            />
            <p className={styles.cdnHint}>{cdnPathHint()}</p>
          </div>
          <div>
            <label className="font-bold text-slate-700">Image alt</label>
            <input
              type="text"
              value={form.imageAlt}
              onChange={(e) => setForm((f) => ({ ...f, imageAlt: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-slate-200"
            />
          </div>
        </div>

        </div>

        {/* Content Editor Card */}
        <div className={`${styles.card} p-5 shadow-sm`}>
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Article Content *</h2>
          <div className="mt-1">
            <SummernoteEditor
              value={form.content}
              onChange={(content) => setForm((f) => ({ ...f, content }))}
              height={400}
            />
          </div>
        </div>

        {/* SEO Card */}
        <div className={`${styles.card} p-5 shadow-sm`}>
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">SEO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 text-xs">Meta title</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                placeholder={form.title || "Auto from title"}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 text-xs">Meta keywords</label>
              <input
                type="text"
                value={form.metaKeywords}
                onChange={(e) => setForm((f) => ({ ...f, metaKeywords: e.target.value }))}
                placeholder="wingo, prediction, signals"
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 text-xs">Meta description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                rows={2}
                placeholder={form.description || "Auto from description"}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 text-xs">Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags.join(", ")}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
                placeholder="wingo signal, color prediction, 91club, tiranga"
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                      {tag}
                      <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))} className="hover:text-red-500 leading-none">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQs Card */}
        <div className={`${styles.card} p-5 shadow-sm`}>
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-sm font-bold text-slate-800">Frequently Asked Questions</h2>
            <button type="button" onClick={addFaq} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
              <Plus size={14} /> Add FAQ
            </button>
          </div>
          
          {form.faqs.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs border-2 border-dashed border-slate-100 rounded-xl">
              No FAQs added yet. Click &quot;Add FAQ&quot; to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {form.faqs.map((faq, i) => (
                <div key={i} className="relative p-3 bg-white rounded-lg border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, faqs: f.faqs.filter((_, j) => j !== i) }))}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"
                    title="Remove FAQ"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="pr-8 space-y-2">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">Question {i + 1}</label>
                      <input
                        placeholder="e.g. How does Wingo Signal work?"
                        value={faq.question}
                        onChange={(e) => {
                          const faqs = [...form.faqs];
                          faqs[i] = { ...faqs[i], question: e.target.value };
                          setForm((f) => ({ ...f, faqs }));
                        }}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800"
                      />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 mb-0.5 block">Answer</label>
                      <textarea
                        placeholder="Provide a clear, helpful answer..."
                        value={faq.answer}
                        rows={2}
                        onChange={(e) => {
                          const faqs = [...form.faqs];
                          faqs[i] = { ...faqs[i], answer: e.target.value };
                          setForm((f) => ({ ...f, faqs }));
                        }}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </form>
    </div>
  );
}

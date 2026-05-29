"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Plus, List } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

type BlogItem = { id: string; title: string; slug: string };

export default function AdminBlogNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const isBlogSection = pathname.startsWith("/admin/blogs");

  useEffect(() => {
    if (!isBlogSection) return;
    fetch(getApiUrl("/api/admin/blog"))
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "success") {
          setPosts(
            data.data.map((p: BlogItem) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
            }))
          );
        }
      })
      .catch(() => {});
  }, [isBlogSection, pathname]);

  if (!isBlogSection) {
    return (
      <Link
        href="/admin/blogs"
        onClick={onNavigate}
        className="flex items-center gap-3 p-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all no-underline"
      >
        <FileText size={20} color="#5856D6" />
        <span className="text-sm">Blogs</span>
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-violet-50 text-violet-700">
        <FileText size={18} color="#5856D6" />
        <span className="text-sm font-bold">Blogs</span>
      </div>

      <Link
        href="/admin/blogs"
        onClick={onNavigate}
        className={`blog-sub-link flex items-center gap-2 pl-9 pr-3 py-2 rounded-lg text-xs font-semibold transition-colors no-underline ${
          pathname === "/admin/blogs"
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <List size={14} /> All Blogs
      </Link>

      <Link
        href="/admin/blogs/new"
        onClick={onNavigate}
        className={`blog-sub-link flex items-center gap-2 pl-9 pr-3 py-2 rounded-lg text-xs font-semibold transition-colors no-underline ${
          pathname === "/admin/blogs/new"
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <Plus size={14} /> New Post
      </Link>

      {posts.length > 0 && (
        <div className="mt-2 pl-7 pr-2 max-h-48 overflow-y-auto space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
            Posts
          </p>
          {posts.map((post) => {
            const editPath = `/admin/blogs/edit/${post.id}`;
            const active = pathname === editPath;
            return (
              <Link
                key={post.id}
                href={editPath}
                onClick={onNavigate}
                title={post.title}
                className={`blog-sub-link block px-2 py-1.5 rounded-md text-[11px] font-medium truncate no-underline ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {post.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

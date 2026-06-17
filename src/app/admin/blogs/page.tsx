"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api-utils";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import styles from "./blogs-admin.module.css";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
};

export default function AdminBlogsListPage() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/v1/admin/blog"), { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setPosts(data.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(getApiUrl(`/v1/admin/blog/${id}`), { credentials: 'include',  method: "DELETE" });
    loadPosts();
  };

  return (
    <div className={`${styles.root} admin-page`}>
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Content</p>
          <h1>All Blogs</h1>
          <p className="admin-subtitle">Manage every blog post</p>
        </div>
        <Link href="/admin/blogs/new" className={styles.btnPrimary}>
          <Plus size={14} /> New Post
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="animate-spin" size={22} style={{ color: 'var(--admin-primary)' }} />
          </div>
        ) : posts.length === 0 ? (
          <p className="p-8 text-center" style={{ color: 'var(--admin-muted)' }}>No posts yet.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--admin-border)' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                className={`${styles.listRow} flex items-center justify-between gap-3`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={styles.listTitle}>{post.title}</span>
                    {post.published ? (
                      <span className={styles.badgeLive}>
                        <Eye size={9} className="inline mr-0.5" />
                        Live
                      </span>
                    ) : (
                      <span className={styles.badgeDraft}>
                        <EyeOff size={9} className="inline mr-0.5" />
                        Draft
                      </span>
                    )}
                  </div>
                  <p className={styles.listSlug}>/blog/{post.slug}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`https://wingosignals.xyz/blog/${post.slug}`}
                    target="_blank"
                    className={styles.btnGhost}
                    title="View"
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <Link
                    href={`/admin/blogs/edit/${post.id}`}
                    className={`${styles.btnGhost}`}
                    style={{ color: 'var(--admin-blue)' }}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id, post.title)}
                    className={styles.btnGhost}
                    style={{ color: 'var(--admin-red)' }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

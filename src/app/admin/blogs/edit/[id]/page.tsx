"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import BlogForm, { emptyBlogForm, type BlogFormData } from "../../BlogForm";
import styles from "../../blogs-admin.module.css";
import { getApiUrl } from "@/lib/api-utils";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<BlogFormData | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(getApiUrl(`/v1/admin/blog/${id}`), { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        const p = data.data;
        setInitial({
          title: p.title,
          slug: p.slug,
          description: p.description,
          date: p.date,
          author: p.author,
          content: p.content,
          image: p.image,
          imageAlt: p.imageAlt,
          faqs: p.faqs ?? [],
          published: p.published,
          metaTitle: p.metaTitle ?? "",
          metaDescription: p.metaDescription ?? "",
          metaKeywords: p.metaKeywords ?? "",
        });
      }
    }
    if (id) load();
  }, [id]);

  if (!initial) {
    return (
      <div className={`${styles.root} p-8 flex justify-center`}>
        <Loader2 className="animate-spin text-blue-500" size={24} />
      </div>
    );
  }

  return <BlogForm initial={initial} postId={id} />;
}

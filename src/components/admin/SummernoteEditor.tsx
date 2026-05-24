"use client";

import { useEffect, useRef } from "react";
import { DEFAULT_BLOG_IMAGE, resolveBlogImage } from "@/lib/cdn";

type SummernoteEditorProps = {
  value: string;
  onChange: (html: string) => void;
  height?: number;
};

function loadCSS(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadJS(src: string, callback?: () => void) {
  const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
  if (existing) {
    if (existing.getAttribute("data-loaded") === "true") {
      callback?.();
    } else {
      existing.addEventListener("load", () => callback?.(), { once: true });
    }
    return;
  }
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.onload = () => {
    script.setAttribute("data-loaded", "true");
    callback?.();
  };
  document.body.appendChild(script);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JQuerySummernote = (el: HTMLElement) => { summernote: (...args: any[]) => unknown };

function getJQuery(): JQuerySummernote | null {
  return (window as Window & { jQuery?: JQuerySummernote }).jQuery ?? null;
}

function promptImageUrl(): string | null {
  const input = window.prompt(
    `Image path (e.g. ${DEFAULT_BLOG_IMAGE}) or full https URL`,
    DEFAULT_BLOG_IMAGE
  );
  if (!input?.trim()) return null;
  return resolveBlogImage(input.trim());
}

export default function SummernoteEditor({
  value,
  onChange,
  height = 280,
}: SummernoteEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const readyRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    loadCSS("https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css");
    loadCSS("https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css");

    const initEditor = () => {
      const el = editorRef.current;
      const $ = getJQuery();
      if (!el || !$ || readyRef.current) return;

      readyRef.current = true;
      $(el).summernote({
        height,
        placeholder: "Write blog content here...",
        fontNames: ["Arial", "Arial Black", "Comic Sans MS", "Courier New", "Helvetica", "Impact", "Tahoma", "Times New Roman", "Verdana", "Nunito"],
        toolbar: [
          ["style", ["style"]],
          ["font", ["bold", "italic", "underline", "strikethrough", "clear"]],
          ["fontname", ["fontname"]],
          ["fontsize", ["fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["height", ["height"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "video", "hr"]],
          ["view", ["fullscreen", "codeview", "help"]],
        ],
        callbacks: {
          onChange: (contents: string) => {
            onChangeRef.current(contents);
          },
          onImageUpload: (files: File[]) => {
            const $jq = getJQuery();
            if (!$jq || !files?.length) return;
            const url = promptImageUrl();
            if (!url) return;
            $jq(el).summernote("insertImage", url);
          },
        },
        popover: {
          image: [
            ["image", ["resizeFull", "resizeHalf", "resizeQuarter", "resizeNone"]],
            ["float", ["floatLeft", "floatRight", "floatNone"]],
            ["remove", ["removeMedia"]],
          ],
        },
      });

      if (value) {
        $(el).summernote("code", value);
      }
    };

    loadJS("https://code.jquery.com/jquery-3.7.1.min.js", () => {
      loadJS("https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js", () => {
        loadJS("https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js", initEditor);
      });
    });

    return () => {
      const el = editorRef.current;
      const $ = getJQuery();
      if (el && $ && readyRef.current) {
        try {
          $(el).summernote("destroy");
        } catch {
          /* ignore */
        }
        readyRef.current = false;
      }
    };
  }, [height]);

  useEffect(() => {
    const el = editorRef.current;
    const $ = getJQuery();
    if (!el || !$ || !readyRef.current) return;

    const current = $(el).summernote("code") as string;
    if (value !== current) {
      $(el).summernote("code", value || "");
    }
  }, [value]);

  return (
    <div id="blog-editor-scope" className="summernote-wrapper rounded-lg overflow-hidden border border-slate-200 bg-white">
      <textarea ref={editorRef} defaultValue={value} className="w-full" />
    </div>
  );
}

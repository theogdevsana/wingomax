"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, Share2, Link2, Send, MessageCircle } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/g;
    const items: TocItem[] = [];
    let match;
    
    const slugify = (text: string) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    while ((match = h2Regex.exec(content)) !== null) {
      items.push({
        id: slugify(match[1]),
        text: match[1].replace(/<[^>]*>/g, ''),
        level: 2
      });
    }

    setToc(items);
  }, [content]);

  if (toc.length === 0) return null;

  return (
    <>
      <style>{blogClientCss}</style>
      <nav className="blog-toc">
        <div className="blog-toc-header" onClick={() => setIsOpen(!isOpen)}>
          <span className="blog-toc-label">Table of Contents</span>
          <span className="blog-toc-chevron" data-open={isOpen}>
            <ChevronDown size={20} />
          </span>
        </div>
        {isOpen && (
          <ul className="blog-toc-list">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="blog-toc-link">
                  <span className="blog-toc-dot" />
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </>
  );
}

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{blogClientCss}</style>
      <div className="blog-faq-item">
        <button className="blog-faq-btn" onClick={() => setIsOpen(!isOpen)}>
          <span className="blog-faq-question">{question}</span>
          <span className="blog-faq-chevron" data-open={isOpen}>
            <ChevronDown size={18} />
          </span>
        </button>
        {isOpen && (
          <div className="blog-faq-answer">{answer}</div>
        )}
      </div>
    </>
  );
}

export function SocialShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <>
      <style>{blogClientCss}</style>
      <div className="blog-share">
        <span className="blog-share-label">
          <Share2 size={16} /> Share Article
        </span>
        <div className="blog-share-buttons">
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="blog-share-btn blog-share-btn-copy"
            aria-label={copied ? 'Copied!' : 'Copy Link'}
          >
            <Link2 size={18} style={{ color: copied ? '#10b981' : undefined }} />
          </button>
          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-share-btn blog-share-btn-wa"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-share-btn blog-share-btn-tg"
            aria-label="Share on Telegram"
          >
            <Send size={18} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-share-btn blog-share-btn-x"
            aria-label="Share on X"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-share-btn blog-share-btn-fb"
            aria-label="Share on Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" /></svg>
          </a>
          <a
            href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-share-btn blog-share-btn-reddit"
            aria-label="Share on Reddit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.867 5.572a2.58 2.58 0 0 0-1.226-2.185l1.092-3.153 3.32.732a1.737 1.737 0 1 0 .285-1.042l-3.69-.814a.798.798 0 0 0-.96.537L10.428 3.23a6.113 6.113 0 0 0-4.856-.566 2.58 2.58 0 0 0-4.634 1.13c-2.348 1.127-3.935 3.195-3.935 5.54 0 3.376 3.63 6.116 8.097 6.116s8.097-2.74 8.097-6.116c0-2.28-1.503-4.298-3.73-5.412h-.002l.402-1.353Zm-7.79 3.013a1.442 1.442 0 1 1-2.884 0 1.442 1.442 0 0 1 2.884 0Zm5.44.896c0 .8-.567 1.445-1.264 1.445-.698 0-1.265-.645-1.265-1.445 0-.8.567-1.445 1.265-1.445.697 0 1.264.645 1.264 1.445Zm-3.192 3.626c-1.84 0-3.32-.82-3.32-1.83 0-.258.26-.467.58-.467.319 0 .58.21.58.468 0 .5.968.905 2.16.905 1.192 0 2.16-.406 2.16-.906 0-.257.26-.467.58-.467.32 0 .58.21.58.468 0 1.01-1.48 1.83-3.32 1.83Z" /></svg>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-share-btn blog-share-btn-li"
            aria-label="Share on LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
          </a>
        </div>
      </div>
    </>
  );
}

export function ContentRenderer({ html }: { html: string }) {
  const [mounted, setMounted] = useState(false);
  const [processedHtml, setProcessedHtml] = useState(html);

  useEffect(() => {
    setMounted(true);
    const div = document.createElement('div');
    div.innerHTML = html;
    const h2s = div.querySelectorAll('h2');
    h2s.forEach(h2 => {
      if (h2.textContent) {
        h2.id = h2.textContent.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      }
    });
    setProcessedHtml(div.innerHTML);
  }, [html]);

  const safeHtml = mounted ? processedHtml : html;

  return (
    <>
      <style>{blogClientCss}</style>
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: safeHtml }} />
    </>
  );
}

const blogClientCss = `
/* === Table of Contents === */
.blog-toc { background:#fff; border:1px solid #f1f5f9; border-radius:16px; padding:16px; margin:32px 0; box-shadow:0 1px 2px rgba(0,0,0,0.05); }
.blog-toc-header { font-weight:700; color:#1e293b; display:flex; align-items:center; justify-content:space-between; cursor:pointer; user-select:none; }
.blog-toc-label { font-size:14px; letter-spacing:0.1em; color:#64748b; }
.blog-toc-chevron { display:inline-flex; transition:transform 0.3s; color:#94a3b8; }
.blog-toc-chevron[data-open="true"] { transform:rotate(180deg); }
.blog-toc-list { margin-top:16px; display:flex; flex-direction:column; gap:8px; list-style:none; padding:0; }
.blog-toc-link { font-size:14px; font-weight:500; color:#64748b; text-decoration:none; display:flex; align-items:center; gap:8px; transition:color 0.2s; }
.blog-toc-link:hover { color:#4f46e5; }
.blog-toc-dot { width:4px; height:4px; background:#cbd5e1; border-radius:50%; flex-shrink:0; }

/* === FAQ Item === */
.blog-faq-item { border:1px solid #f1f5f9; border-radius:16px; overflow:hidden; margin-bottom:12px; background:#fff; box-shadow:0 1px 2px rgba(0,0,0,0.05); }
.blog-faq-btn { width:100%; padding:16px; text-align:left; font-weight:700; color:#1e293b; display:flex; justify-content:space-between; align-items:center; background:none; border:none; cursor:pointer; transition:background 0.2s; }
.blog-faq-btn:hover { background:#f8fafc; }
.blog-faq-question { font-size:14px; }
@media (min-width:768px) { .blog-faq-question { font-size:16px; } }
.blog-faq-chevron { display:inline-flex; color:#94a3b8; transition:transform 0.3s; flex-shrink:0; }
.blog-faq-chevron[data-open="true"] { transform:rotate(180deg); }
.blog-faq-answer { padding:0 16px 16px; font-size:14px; color:#64748b; line-height:1.625; border-top:1px solid #f8fafc; padding-top:12px; }

/* === Social Share === */
.blog-share { display:flex; flex-direction:column; gap:16px; padding:32px 0; border-top:1px solid #f1f5f9; margin-top:48px; }
.blog-share-label { font-size:14px; font-weight:700; color:#64748b; letter-spacing:0.1em; display:flex; align-items:center; gap:8px; }
.blog-share-buttons { display:flex; flex-wrap:wrap; gap:12px; }
.blog-share-btn { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all 0.3s; box-shadow:0 1px 3px rgba(0,0,0,0.1); border:none; cursor:pointer; }
.blog-share-btn:hover { transform:scale(1.1); }
.blog-share-btn-copy { background:#f8fafc; color:#64748b; }
.blog-share-btn-copy:hover { background:#e2e8f0; color:#1e293b; }
.blog-share-btn-wa { background:#f0fdf4; color:#10b981; }
.blog-share-btn-wa:hover { background:#10b981; color:#fff; }
.blog-share-btn-tg { background:#f0f9ff; color:#0ea5e9; }
.blog-share-btn-tg:hover { background:#0ea5e9; color:#fff; }
.blog-share-btn-x { background:#f1f5f9; color:#475569; }
.blog-share-btn-x:hover { background:#1e293b; color:#fff; }
.blog-share-btn-fb { background:#eff6ff; color:#2563eb; }
.blog-share-btn-fb:hover { background:#2563eb; color:#fff; }
.blog-share-btn-reddit { background:#fff7ed; color:#ea580c; }
.blog-share-btn-reddit:hover { background:#ea580c; color:#fff; }
.blog-share-btn-li { background:#eff6ff; color:#1d4ed8; }
.blog-share-btn-li:hover { background:#1d4ed8; color:#fff; }

/* === Content Renderer === */
.blog-content { max-width:none; color:#64748b; line-height:1.625; word-break:break-word; }
.blog-content h2 { font-size:20px; font-weight:700; text-transform:capitalize; color:#1e293b; margin:48px 0 24px; padding-bottom:16px; border-bottom:1px solid #f1f5f9; }
@media (min-width:768px) { .blog-content h2 { font-size:24px; } }
.blog-content h3 { font-size:18px; font-weight:600; text-transform:capitalize; color:#1e293b; margin:32px 0 16px; }
.blog-content p { margin-bottom:24px; font-size:16px; line-height:1.625; word-break:break-word; }
@media (min-width:768px) { .blog-content p { font-size:18px; } }
.blog-content ul { list-style:disc; padding-left:24px; margin-bottom:32px; display:flex; flex-direction:column; gap:8px; word-break:break-word; }
.blog-content ol { list-style:decimal; padding-left:24px; margin-bottom:32px; display:flex; flex-direction:column; gap:8px; word-break:break-word; }
.blog-content li { padding-left:8px; }
.blog-content li strong { color:#1e293b; font-weight:700; }
.blog-content strong { color:#1e293b; font-weight:700; }
.blog-content a { color:#4f46e5; font-weight:700; text-decoration:none; word-break:break-word; }
.blog-content a:hover { text-decoration:underline; }
.blog-content img { border-radius:24px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); margin:40px 0; max-width:100%; height:auto; }
.blog-content iframe { max-width:100%; width:100%; }
.blog-content video { max-width:100%; width:100%; }
.blog-content table { overflow-x:auto; display:block; width:100%; }
.blog-content pre { overflow-x:auto; word-break:break-word; }
.blog-content code { word-break:break-word; }
.blog-content .warningBox { background:#fffbeb; border-left:4px solid #fbbf24; padding:24px; border-radius:16px; margin:32px 0; }
.blog-content .warningBox h2 { color:#78350f; border:none; }
.blog-content .warningBox p { color:#92400e; margin-bottom:0; }
`;

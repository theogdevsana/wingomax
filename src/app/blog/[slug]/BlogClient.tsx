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
    <nav className="bg-white border border-slate-100 rounded-2xl p-4 my-8 shadow-sm">
      <div 
        className="font-bold text-slate-800 flex items-center justify-between cursor-pointer select-none" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold tracking-widest text-slate-500">Table of Contents</span>
        <ChevronDown 
          size={20} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>
      {isOpen && (
        <ul className="mt-4 flex flex-col gap-2">
          {toc.map((item) => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
              >
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden mb-3 bg-white shadow-sm">
      <button 
        className="w-full p-4 text-left font-bold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm md:text-base">{question}</span>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export function SocialShare({ title, url }: { title: string; url: string }) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex flex-col gap-4 py-8 border-t border-slate-100 mt-12">
      <span className="text-sm font-bold text-slate-500 tracking-widest flex items-center gap-2">
         <Share2 size={16} /> Share Article
      </span>
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => {
            navigator.clipboard.writeText(url);
            const btn = document.getElementById('blog-copy-btn');
            if(btn) {
              btn.style.color = '#10b981';
              setTimeout(() => btn.style.color = '', 2000);
            }
          }}
          className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 transition-all hover:scale-110 shadow-sm"
          aria-label="Copy Link"
        >
          <Link2 id="blog-copy-btn" size={18} className="transition-colors" />
        </button>
        <a 
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all hover:scale-110 shadow-sm"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={18} />
        </a>
        <a 
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all hover:scale-110 shadow-sm"
          aria-label="Share on Telegram"
        >
          <Send size={18} />
        </a>
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all hover:scale-110 shadow-sm"
          aria-label="Share on X (Twitter)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>
        </a>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:scale-110 shadow-sm"
          aria-label="Share on Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" /></svg>
        </a>
        <a 
          href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all hover:scale-110 shadow-sm"
          aria-label="Share on Reddit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.867 5.572a2.58 2.58 0 0 0-1.226-2.185l1.092-3.153 3.32.732a1.737 1.737 0 1 0 .285-1.042l-3.69-.814a.798.798 0 0 0-.96.537L10.428 3.23a6.113 6.113 0 0 0-4.856-.566 2.58 2.58 0 0 0-4.634 1.13c-2.348 1.127-3.935 3.195-3.935 5.54 0 3.376 3.63 6.116 8.097 6.116s8.097-2.74 8.097-6.116c0-2.28-1.503-4.298-3.73-5.412h-.002l.402-1.353Zm-7.79 3.013a1.442 1.442 0 1 1-2.884 0 1.442 1.442 0 0 1 2.884 0Zm5.44.896c0 .8-.567 1.445-1.264 1.445-.698 0-1.265-.645-1.265-1.445 0-.8.567-1.445 1.265-1.445.697 0 1.264.645 1.264 1.445Zm-3.192 3.626c-1.84 0-3.32-.82-3.32-1.83 0-.258.26-.467.58-.467.319 0 .58.21.58.468 0 .5.968.905 2.16.905 1.192 0 2.16-.406 2.16-.906 0-.257.26-.467.58-.467.32 0 .58.21.58.468 0 1.01-1.48 1.83-3.32 1.83Z" /></svg>
        </a>
        <a 
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all hover:scale-110 shadow-sm"
          aria-label="Share on LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
        </a>
      </div>
    </div>
  );
}

export function ContentRenderer({ html }: { html: string }) {
  const [processedHtml, setProcessedHtml] = useState(html);

  useEffect(() => {
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

  return (
    <div 
      className="max-w-none text-slate-600 leading-relaxed
        [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:capitalize [&_h2]:text-slate-800 [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:pb-4 [&_h2]:border-b [&_h2]:border-slate-100
        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:capitalize [&_h3]:text-slate-800 [&_h3]:mt-8 [&_h3]:mb-4
        [&_p]:mb-6 [&_p]:text-base [&_p]:md:text-lg [&_p]:leading-relaxed
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol]:space-y-2
        [&_li]:pl-2 [&_li_strong]:text-slate-800 [&_li_strong]:font-bold
        [&_strong]:text-slate-800 [&_strong]:font-bold
        [&_a]:text-indigo-600 [&_a]:font-bold [&_a]:no-underline hover:[&_a]:underline
        [&_img]:rounded-3xl [&_img]:shadow-lg [&_img]:my-10
        [&_.warningBox]:bg-amber-50 [&_.warningBox]:border-l-4 [&_.warningBox]:border-amber-400 [&_.warningBox]:p-6 [&_.warningBox]:rounded-2xl [&_.warningBox]:my-8 [&_.warningBox_h2]:text-amber-900 [&_.warningBox_h2]:border-none [&_.warningBox_p]:text-amber-800 [&_.warningBox_p]:mb-0" 
      dangerouslySetInnerHTML={{ __html: processedHtml }} 
    />
  );
}

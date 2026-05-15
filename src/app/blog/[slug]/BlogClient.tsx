"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, Share2, X, Send, PhoneIcon as WhatsApp } from 'lucide-react';

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
    <div className="flex items-center gap-4 py-8 border-t border-slate-100 mt-12">
      <span className="text-sm font-bold text-slate-500 tracking-widest">Share Article</span>
      <div className="flex gap-2">
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-black hover:text-white transition-all hover:scale-110"
          aria-label="Share on X (formerly Twitter)"
        >
          <X size={18} />
        </a>
        <a 
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#229ED9] hover:text-white transition-all hover:scale-110"
          aria-label="Share on Telegram"
        >
          <Send size={18} />
        </a>
        <a 
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#25D366] hover:text-white transition-all hover:scale-110"
          aria-label="Share on WhatsApp"
        >
          <WhatsApp size={18} />
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

import React from 'react';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function OrganizationSchema({ telegramLink = "https://t.me/enzosrs" }: { telegramLink?: string }) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wingo Signal",
    "alternateName": ["Wingo Signals", "Wingo AI Prediction"],
    "url": "https://wingosignals.com",
    "logo": "https://wingosignals.com/logo/official-logo.png",
    "sameAs": [telegramLink],
    "description": "Official browser-based Wingo prediction website for period tracking, result history, colour prediction context, and AI-assisted statistical signals.",
    "knowsAbout": [
      "wingo prediction",
      "wingo 1 minute prediction",
      "wingo signals",
      "wingo colour prediction",
      "wingo ai prediction",
      "wingo big small history"
    ],
    "areaServed": ["IN", "BD"],
    "foundingDate": "2026"
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Wingo Signal",
    "alternateName": "Wingo Signals",
    "url": "https://wingosignals.com",
    "inLanguage": "en-IN",
    "description": "Official Wingo Signal website covering Wingo prediction, Wingo 1 minute prediction, colour prediction, AI signal context, and result history.",
    "publisher": {
      "@type": "Organization",
      "name": "Wingo Signal",
      "url": "https://wingosignals.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wingosignals.com/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script key="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script key="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}

export default function JsonLd({ 
  breadcrumbs, 
  faq 
}: { 
  breadcrumbs?: BreadcrumbItem[]; 
  faq?: FAQItem[];
}) {
  const breadcrumbData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item.startsWith('http') ? crumb.item : `https://wingosignals.com${crumb.item}`
    }))
  } : null;

  const faqData = faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <>
      {breadcrumbData && (
        <script key="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
      )}
      {faqData && (
        <script key="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
      )}
    </>
  );
}

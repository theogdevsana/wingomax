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
    "url": "https://wingosignals.xyz",
    "logo": "https://wingosignals.xyz/logo/main_logo.png",
    "sameAs": [telegramLink],
    "description": "Professional Wingo prediction tools and AI-driven signals for gaming platforms."
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Wingo Signal",
    "url": "https://wingosignals.xyz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wingosignals.xyz/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
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
      "item": crumb.item.startsWith('http') ? crumb.item : `https://wingosignals.xyz${crumb.item}`
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
      )}
      {faqData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
      )}
    </>
  );
}

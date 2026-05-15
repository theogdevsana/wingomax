import React from 'react';

export default function JsonLd({ telegramLink = "https://t.me/enzosrs" }: { telegramLink?: string }) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wingo Signal",
    "url": "https://wingosignals.xyz",
    "logo": "https://wingosignals.xyz/logo/main_logo.png",
    "sameAs": [
      telegramLink
    ],
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

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://wingosignals.xyz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Wingo Blog",
        "item": "https://wingosignals.xyz/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Wingo Predictions",
        "item": "https://wingosignals.xyz/wingo-1-minute-prediction"
      }
    ]
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}

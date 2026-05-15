import React from 'react';

export default function JsonLd({ telegramLink = "https://t.me/enzosrs" }: { telegramLink?: string }) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wingo Signal",
    "url": "https://wingosignal.com",
    "logo": "https://wingosignal.com/logo/main_logo.png",
    "sameAs": [
      telegramLink
    ],
    "description": "Professional Wingo prediction tools and AI-driven signals for gaming platforms."
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Wingo Signal",
    "url": "https://wingosignal.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wingosignal.com/blog?q={search_term_string}",
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

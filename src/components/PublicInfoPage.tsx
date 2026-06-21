"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteSidebar from "@/components/SiteSidebar";
import SiteFooter from "@/components/SiteFooter";
import styles from "./PublicInfoPage.module.css";

export type InfoSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
};

export type InfoFaq = { question: string; answer: string };

export default function PublicInfoPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
  faqs = [],
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated?: string;
  sections: InfoSection[];
  faqs?: InfoFaq[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.page}>
      <SiteHeader onMenuClick={() => setMenuOpen(true)} />
      <SiteSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.intro}>{intro}</p>
          {updated && <span className={styles.updated}>Last updated: {updated}</span>}
        </header>
        <div className={styles.content}>
          <nav className={styles.nav} aria-label="On this page">
            {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
            {faqs.length > 0 && <a href="#common-questions">Common questions</a>}
          </nav>
          <div className={styles.sections}>
            {sections.map((section) => (
              <section key={section.id} id={section.id} className={styles.section}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {section.note && <div className={styles.note}>{section.note}</div>}
              </section>
            ))}
            {faqs.length > 0 && (
              <section id="common-questions" className={styles.section}>
                <h2>Common questions</h2>
                {faqs.map((faq) => <details key={faq.question} className={styles.faq}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
              </section>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

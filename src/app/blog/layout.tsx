import React from 'react';
import BlogLayoutClient from './BlogLayoutClient';
import { query } from '@/lib/db';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

  return (
    <>
      <BlogLayoutClient telegramLink={telegramLink}>
        {children}
      </BlogLayoutClient>
    </>
  );
}


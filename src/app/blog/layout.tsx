import React from 'react';
import BlogLayoutClient from './BlogLayoutClient';
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return (
    <>
      <BlogLayoutClient telegramLink={telegramLink}>
        {children}
      </BlogLayoutClient>
    </>
  );
}


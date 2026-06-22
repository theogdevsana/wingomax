export const BLOG_CDN_BASE = 'https://cdn.nexapk.in';
export const DEFAULT_BLOG_IMAGE = '/svg/png/wingo-signals-banner.png';
export const SITE_ORIGIN = 'https://wingosignals.com';

/** Featured image: return as-is for full https URLs, resolve local to absolute path. */
export function resolveBlogImage(path: string): string {
  if (!path?.trim()) return DEFAULT_BLOG_IMAGE;

  const p = path.trim();

  if (p.startsWith('http://') || p.startsWith('https://')) {
    return p;
  }

  return p.startsWith('/') ? p : `/${p}`;
}

export function toAbsoluteBlogImage(path: string): string {
  if (!path) return `${SITE_ORIGIN}${DEFAULT_BLOG_IMAGE}`;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

/** @deprecated Prefer resolveBlogImage for blog featured images. */
export function toCdnUrl(path: string): string {
  return resolveBlogImage(path);
}

export function normalizeContentHtml(html: string): string {
  if (!html) return html;

  return html.replace(/src=(["'])([^"']+)\1/gi, (_match, quote, src) => {
    if (src.startsWith('data:')) return `src=${quote}${src}${quote}`;
    return `src=${quote}${resolveBlogImage(src)}${quote}`;
  });
}

export function cdnPathHint(): string {
  return DEFAULT_BLOG_IMAGE;
}

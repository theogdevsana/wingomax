export const BLOG_CDN_BASE = 'https://cdn.nexapk.in';
export const DEFAULT_BLOG_IMAGE = '/svg/png/wingo-signals-banner.png';
export const SITE_ORIGIN = 'https://wingosignals.xyz';

/** Featured image: local path by default; admin can set any full https URL. */
export function resolveBlogImage(path: string): string {
  if (!path?.trim()) return DEFAULT_BLOG_IMAGE;

  const p = path.trim();

  if (p.startsWith(BLOG_CDN_BASE)) {
    try {
      return new URL(p).pathname;
    } catch {
      return DEFAULT_BLOG_IMAGE;
    }
  }

  if (p.startsWith('http://') || p.startsWith('https://')) {
    try {
      const url = new URL(p);
      if (url.hostname === 'cdn.nexapk.in') return url.pathname;
      if (url.hostname === 'wingosignals.xyz' || url.hostname === 'www.wingosignals.xyz') {
        return url.pathname;
      }
      return p;
    } catch {
      return DEFAULT_BLOG_IMAGE;
    }
  }

  return p.startsWith('/') ? p : `/${p}`;
}

export function toAbsoluteBlogImage(path: string): string {
  const resolved = resolveBlogImage(path);
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) return resolved;
  return `${SITE_ORIGIN}${resolved}`;
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

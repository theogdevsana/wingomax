export function getApiUrl(path: string): string {
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
  return `https://api.wingosignals.com${path}`;
}

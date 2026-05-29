export function getApiUrl(path: string): string {
  if (typeof window === 'undefined') {
    return path; // Server-side or SSR environment
  }
  
  const hostname = window.location.hostname.toLowerCase();
  
  // Local development check
  const isDev =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local') ||
    hostname.includes('gitpod') ||
    hostname.includes('github.dev');
    
  if (isDev) {
    return path;
  }
  
  // Standardize leading slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If it's an admin API, it must go to the admin subdomain
  if (cleanPath.startsWith('/api/admin')) {
    return `https://admin.wingosignals.xyz${cleanPath}`;
  }
  
  // All other API paths go to the api subdomain
  return `https://api.wingosignals.xyz${cleanPath}`;
}

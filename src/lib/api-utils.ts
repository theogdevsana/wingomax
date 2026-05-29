export function getApiUrl(path: string): string {
  // Use relative paths for all API calls so it works identically
  // on localhost, staging, and production domains.
  return path;
}

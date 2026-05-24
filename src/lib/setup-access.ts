import crypto from 'crypto';

export const SETUP_PAGE_PASSWORD =
  process.env.SETUP_PAGE_PASSWORD ?? 'enzosir@99#';

export function verifySetupPassword(password: string): boolean {
  return password === SETUP_PAGE_PASSWORD;
}

export function getSetupAccessToken(): string {
  return crypto
    .createHash('sha256')
    .update(`${SETUP_PAGE_PASSWORD}:admin-setup`)
    .digest('hex');
}

export function isSetupAccessCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return cookieValue === getSetupAccessToken();
}

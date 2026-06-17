import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { edgeVerifyToken } from './lib/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = (request.headers.get('x-forwarded-host') || request.nextUrl.hostname).toLowerCase().split(':')[0];

  // Allow all local development hosts or test runners to bypass domain checks if required
  const isDev =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local') ||
    hostname.includes('gitpod') ||
    hostname.includes('github.dev');

  const mainDomain = 'wingosignals.com';
  const adminDomain = 'admin.wingosignals.com';
  const apiDomain = 'api.wingosignals.com';

  // Determine current domain context based on hostname
  const isMainDomain = isDev ? (!hostname.startsWith('admin.') && !hostname.startsWith('api.')) : (hostname === mainDomain || hostname === `www.${mainDomain}`);
  const isAdminDomain = isDev ? hostname.startsWith('admin.') : (hostname === adminDomain);
  const isApiDomain = isDev ? hostname.startsWith('api.') : (hostname === apiDomain);

  console.log(`[PROXY] Request - Host: ${hostname}, Path: ${pathname}, isDev: ${isDev}, isMain: ${isMainDomain}, isAdmin: ${isAdminDomain}, isApi: ${isApiDomain}`);

  // --- CORS Setup ---
  const origin = request.headers.get('origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  };

  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
  }

  // 1. Route Blocking Rule: Prevent main domain from accessing admin, api-panel, or v1 routes directly
  if (isMainDomain) {
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api-panel') ||
      (!isDev && pathname.startsWith('/v1/'))
    ) {
      console.log(`[PROXY] Blocking direct route ${pathname} on main domain`);
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  // 2. Admin Domain Subrouting: admin.wingosignals.com/* -> rewrites to /admin/*
  if (isAdminDomain) {
    const adminToken = request.cookies.get('admin_token')?.value;
    const isAdminValid = adminToken ? !!(await edgeVerifyToken(adminToken)) : false;

    if (!pathname.startsWith('/v1/')) {
      // Normalize the target path: strip /admin prefix if already there to avoid double prefix
      const targetPath = pathname.startsWith('/admin') ? pathname : `/admin${pathname === '/' ? '' : pathname}`;
      const isTargetLogin = targetPath === '/admin/login';
      const isTargetSetup = targetPath === '/admin/setup';

      // Unauthenticated → redirect to /login (proxy will rewrite to /admin/login)
      if (!isTargetLogin && !isTargetSetup && !isAdminValid) {
        const res = NextResponse.redirect(new URL('/login', request.url));
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
      }
      // Authenticated on login page → redirect to / (proxy rewrites to /admin dashboard)
      if (isTargetLogin && isAdminValid) {
        const res = NextResponse.redirect(new URL('/', request.url));
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
      }
      // If pathname doesn't start with /admin yet, rewrite it
      if (!pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = targetPath;
        const res = NextResponse.rewrite(url);
        Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
        return res;
      }
      // If already /admin/*, just continue (Next.js will serve it directly)
    }
    // /v1/* on admin subdomain: pass through (admin API calls work normally)
  }

  // 3. API Domain Subrouting: api.wingosignals.com/* -> rewrites to /v1/*
  // Clients call api.wingosignals.com/login (NOT /v1/login)
  if (isApiDomain) {
    if (!pathname.startsWith('/v1/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/v1${pathname === '/' ? '' : pathname}`;
      const res = NextResponse.rewrite(url);
      Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }
  }

  // --- Auth Checks & Route Protection for non-subdomain paths ---

  const resolvedPath = pathname;
  const isAdminPath = resolvedPath.startsWith('/admin');
  const isAdminApi = resolvedPath.startsWith('/v1/admin');

  const isLoginPage = resolvedPath === '/admin/login';
  const isSetupPage = resolvedPath === '/admin/setup';
  const isLoginApi = resolvedPath === '/v1/admin/login';
  const isSetupApi =
    resolvedPath === '/v1/admin/register' ||
    resolvedPath.startsWith('/v1/admin/setup/');

  // Verify token
  const token = request.cookies.get('admin_token')?.value;
  const isValid = token ? !!(await edgeVerifyToken(token)) : false;

  // Protect Admin Pages (accessed directly on main domain path /admin/*)
  if (isAdminPath && !isLoginPage && !isSetupPage && !isValid) {
    const res = NextResponse.redirect(new URL('/admin/login', request.url));
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // Protect Admin APIs
  if (isAdminApi && !isLoginApi && !isSetupApi && !isValid) {
    const res = NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // Redirect to Dashboard if already logged in on login page
  if (isLoginPage && isValid) {
    const res = NextResponse.redirect(new URL('/admin', request.url));
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // Protect Dashboard
  if (resolvedPath.startsWith('/dashboard')) {
    const userToken = request.cookies.get('auth_token')?.value;

    if (!userToken) {
      const homeUrl = new URL('/', request.url);
      const res = NextResponse.redirect(homeUrl);
      Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    const userPayload = await edgeVerifyToken(userToken);
    if (!userPayload) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml / sitemaps (sitemap files)
     * - public assets matching extensions: svg, png, jpg, jpeg, gif, webp, ico, json, txt, js, css
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*sitemap.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|js|css)).*)',
  ],
};

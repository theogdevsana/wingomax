import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { edgeVerifyToken } from './lib/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname.toLowerCase();

  // Allow all local development hosts or test runners to bypass domain checks if required
  const isDev =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local') ||
    hostname.includes('gitpod') ||
    hostname.includes('github.dev');

  const mainDomain = 'wingosignals.xyz';
  const adminDomain = 'admin.wingosignals.xyz';
  const apiDomain = 'api.wingosignals.xyz';

  // Determine current domain context based on hostname
  const isMainDomain = isDev ? (!hostname.startsWith('admin.') && !hostname.startsWith('api.')) : (hostname === mainDomain || hostname === `www.${mainDomain}`);
  const isAdminDomain = isDev ? hostname.startsWith('admin.') : (hostname === adminDomain);
  const isApiDomain = isDev ? hostname.startsWith('api.') : (hostname === apiDomain);

  // 1. Route Blocking Rule: Prevent main domain from accessing admin or api-panel routes directly
  if (isMainDomain) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/api-panel')) {
      console.log(`[PROXY] Blocking direct route ${pathname} on main domain`);
      return new NextResponse(null, { status: 404 });
    }
  }

  // 2. Admin Domain Subrouting: admin.wingosignals.xyz/* -> rewrites to /admin/*
  if (isAdminDomain) {
    if (!pathname.startsWith('/api/')) {
      if (!pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // 3. API Domain Subrouting: api.wingosignals.xyz/* -> rewrites to /api-panel/*
  if (isApiDomain) {
    if (!pathname.startsWith('/api/')) {
      if (!pathname.startsWith('/api-panel')) {
        const url = request.nextUrl.clone();
        url.pathname = `/api-panel${pathname === '/' ? '' : pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // --- Auth Checks & Route Protection (From original src/proxy.ts) ---

  // Detect resolved path for authorization
  // Note: Rewritten paths will have pathname updated to /admin/... or /api-panel/... internally
  const resolvedPath = request.nextUrl.pathname;
  const isAdminPath = resolvedPath.startsWith('/admin');
  const isAdminApi = resolvedPath.startsWith('/api/admin');
  
  const isLoginPage = resolvedPath === '/admin/login';
  const isSetupPage = resolvedPath === '/admin/setup';
  const isLoginApi = resolvedPath === '/api/admin/login';
  const isSetupApi =
    resolvedPath === '/api/admin/register' ||
    resolvedPath.startsWith('/api/admin/setup/');
  
  // Verify token
  const token = request.cookies.get('admin_token')?.value;
  const isValid = token ? !!(await edgeVerifyToken(token)) : false;

  // Protect Admin Pages
  if (isAdminPath && !isLoginPage && !isSetupPage && !isValid) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect Admin APIs
  if (isAdminApi && !isLoginApi && !isSetupApi && !isValid) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  // Redirect to Dashboard if already logged in on login page
  if (isLoginPage && isValid) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Protect Dashboard
  if (resolvedPath.startsWith('/dashboard')) {
    const userToken = request.cookies.get('auth_token')?.value;

    if (!userToken) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    const userPayload = await edgeVerifyToken(userToken);
    if (!userPayload) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
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

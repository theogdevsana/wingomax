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
    const adminToken = request.cookies.get('admin_token')?.value;
    const isAdminValid = adminToken ? !!(await edgeVerifyToken(adminToken)) : false;

    if (!pathname.startsWith('/api/')) {
      // Normalize the target path: strip /admin prefix if already there to avoid double prefix
      const targetPath = pathname.startsWith('/admin') ? pathname : `/admin${pathname === '/' ? '' : pathname}`;
      const isTargetLogin = targetPath === '/admin/login';
      const isTargetSetup = targetPath === '/admin/setup';

      // Unauthenticated → redirect to /login (proxy will rewrite to /admin/login)
      if (!isTargetLogin && !isTargetSetup && !isAdminValid) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      // Authenticated on login page → redirect to / (proxy rewrites to /admin dashboard)
      if (isTargetLogin && isAdminValid) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      // If pathname doesn't start with /admin yet, rewrite it
      if (!pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = targetPath;
        return NextResponse.rewrite(url);
      }
      // If already /admin/*, just continue (Next.js will serve it directly)
    }
    // /api/* on admin subdomain: pass through (admin API calls work normally)
  }

  // 3. API Domain Subrouting: api.wingosignals.xyz/* -> rewrites to /api/*
  // Clients call api.wingosignals.xyz/login (NOT /api/login)
  if (isApiDomain) {
    if (!pathname.startsWith('/api/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/api${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // --- Auth Checks & Route Protection for non-subdomain paths ---

  const resolvedPath = pathname;
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

  // Protect Admin Pages (accessed directly on main domain path /admin/*)
  if (isAdminPath && !isLoginPage && !isSetupPage && !isValid) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Protect Admin APIs
  if (isAdminApi && !isLoginApi && !isSetupApi && !isValid) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  // Redirect to Dashboard if already logged in on login page
  if (isLoginPage && isValid) {
    return NextResponse.redirect(new URL('/admin', request.url));
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

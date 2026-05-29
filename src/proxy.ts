import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { edgeVerifyToken } from './lib/jwt';

// Proxy must run in Edge Runtime and cannot use Node.js modules like 'stream' (Mongoose)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname.toLowerCase();

  // Allow all local development hosts or test runners to bypass domain checks
  const isDev =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local') ||
    hostname.includes('gitpod') ||
    hostname.includes('github.dev');

  if (!isDev) {
    const isMainDomain = hostname === 'wingosignals.xyz' || hostname === 'www.wingosignals.xyz';
    const isAdminDomain = hostname === 'admin.wingosignals.xyz';
    const isApiDomain = hostname === 'api.wingosignals.xyz';

    // --- RULE 1: Main Domain (wingosignals.xyz) ---
    if (isMainDomain) {
      // Admin access is strictly forbidden on the main domain -> Return 404
      if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        console.log(`[PROXY] Blocking admin access on main domain: ${pathname}`);
        
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Not Found' },
            { status: 404 }
          );
        }
        
        // Rewrite to /404 to trigger Next.js built-in 404 page while keeping URL intact
        const url = request.nextUrl.clone();
        url.pathname = '/404';
        return NextResponse.rewrite(url);
      }
    }

    // --- RULE 2: Admin Domain (admin.wingosignals.xyz) ---
    else if (isAdminDomain) {
      // If hitting the root of the admin subdomain, redirect to /admin
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      const isAllowedAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
      
      if (!isAllowedAdminPath) {
        console.log(`[PROXY] Redirecting non-admin path ${pathname} from admin domain to main domain`);
        return NextResponse.redirect(new URL(pathname, 'https://wingosignals.xyz'));
      }
    }

    // --- RULE 3: API Domain (api.wingosignals.xyz) ---
    else if (isApiDomain) {
      // Only allow API routes on the API domain. Non-API routes redirect to main domain.
      if (!pathname.startsWith('/api')) {
        console.log(`[PROXY] Redirecting non-api path ${pathname} from api domain to main domain`);
        return NextResponse.redirect(new URL(pathname, 'https://wingosignals.xyz'));
      }
      
      // Admin APIs are strictly forbidden on the general API domain; they must go through admin.wingosignals.xyz
      if (pathname.startsWith('/api/admin')) {
        console.log(`[PROXY] Blocking admin api on api domain: ${pathname}`);
        return NextResponse.json(
          { error: 'Not Found' },
          { status: 404 }
        );
      }
    }

    // --- RULE 4: Fallback for any unknown host ---
    else {
      console.log(`[PROXY] Unknown hostname: ${hostname}. Redirecting to main domain.`);
      return NextResponse.redirect(new URL(pathname, 'https://wingosignals.xyz'));
    }
  }

  // --- EXISTING ROUTING & PROTECTION LOGIC ---

  // Paths that require admin authentication
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  
  // Paths that are exempt from authentication
  const isLoginPage = pathname === '/admin/login';
  const isSetupPage = pathname === '/admin/setup';
  const isLoginApi = pathname === '/api/admin/login';
  const isSetupApi =
    pathname === '/api/admin/register' ||
    pathname.startsWith('/api/admin/setup/');
  
  // Get admin token
  const token = request.cookies.get('admin_token')?.value;
  const isValid = token ? !!(await edgeVerifyToken(token)) : false;

  console.log('[PROXY] Auth Check:', { pathname, hasToken: !!token, isValid });

  // If trying to access admin pages without valid token
  if (isAdminPath && !isLoginPage && !isSetupPage && !isValid) {
    console.log('Redirecting to login: Unauthorized');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If trying to access admin APIs without valid token
  if (isAdminApi && !isLoginApi && !isSetupApi && !isValid) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
  }

  // If trying to access login page while already authenticated
  if (isLoginPage && isValid) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // --- Dashboard Protection ---
  if (pathname.startsWith('/dashboard')) {
    const userToken = request.cookies.get('auth_token')?.value;

    if (!userToken) {
      return NextResponse.redirect(new URL('/', request.url));
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
     * - public folder assets (e.g. images, manifest, service worker)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|js|css)).*)',
  ],
};

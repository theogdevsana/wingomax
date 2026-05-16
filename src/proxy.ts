import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { edgeVerifyToken } from './lib/jwt';

// Proxy must run in Edge Runtime and cannot use Node.js modules like 'stream' (Mongoose)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // PERFORMANCE FIX: Only run proxy for admin and dashboard paths
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin') && !pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  console.log(`[PROXY] Handling: ${pathname}`);

  // Paths that require admin authentication
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  
  // Paths that are exempt from authentication
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';
  
  // Get admin token
  const token = request.cookies.get('admin_token')?.value;
  const isValid = token ? !!(await edgeVerifyToken(token)) : false;

  console.log('Middleware Check:', { pathname, hasToken: !!token, isValid });

  // If trying to access admin pages without valid token
  if (isAdminPath && !isLoginPage && !isValid) {
    console.log('Redirecting to login: Unauthorized');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If trying to access admin APIs without valid token
  if (isAdminApi && !isLoginApi && !isValid) {
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
  matcher: ['/admin/:path*', '/api/admin/:path*', '/dashboard/:path*'],
};

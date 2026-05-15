import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { edgeVerifyToken } from './lib/jwt';

// Proxy must run in Edge Runtime and cannot use Node.js modules like 'stream' (Mongoose)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // PERFORMANCE FIX: Only run proxy for admin paths
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const adminAuth = request.cookies.get('admin_auth');

  // Protect all /admin routes except /admin/quiz/login
  if (path.startsWith('/admin') && path !== '/admin/quiz/login') {
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/quiz/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

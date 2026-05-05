import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const adminAuth = request.cookies.get('admin_auth');

  // Protect all /quiz/admin routes except /quiz/admin/login
  if (path.startsWith('/quiz/admin') && path !== '/quiz/admin/login') {
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.redirect(new URL('/quiz/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/quiz/admin/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Hanya berlaku untuk rute yang di mulai dengan /admin/.. 
  // kecuali halaman /admin/login itu sendiri
  
  const url = request.nextUrl.pathname;
  
  if (url.startsWith('/admin') && url !== '/admin/login') {
    // Cek keberadaan cookie keamanan
    const adminCookie = request.cookies.get('admin_auth');
    
    // Jika tidak ada cookie "admin_auth", lempar kembali ke halaman login
    if (!adminCookie || adminCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Jika aman, lanjutkan seperti biasa
  return NextResponse.next();
}

// Menentukan rute mana saja yang harus melewati middleware ini
export const config = {
  matcher: ['/admin/:path*'],
};

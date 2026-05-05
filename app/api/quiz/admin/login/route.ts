import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Untuk demo, kita pakai password statis 'guru123'. Idealnya diset via process.env.ADMIN_PASSWORD
    const CORRECT_PASSWORD = 'guru';

    if (password === CORRECT_PASSWORD) {
      // Set cookie that expires in 1 day
      const cookieStore = await cookies();
      cookieStore.set('admin_auth', 'true', {
        path: '/',
        httpOnly: true, // Secure, can't be read by client JS
        maxAge: 60 * 60 * 24 // 1 day
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Password salah' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

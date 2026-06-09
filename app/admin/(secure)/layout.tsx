import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin_auth');
  
  if (!adminCookie || adminCookie.value !== 'true') {
    // Arahkan ke halaman login jika tidak punya token
    redirect('/admin/quiz/login');
  }

  return <>{children}</>;
}

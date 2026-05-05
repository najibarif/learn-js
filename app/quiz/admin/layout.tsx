// This layout file intentionally left simple.
// Auth protection is handled by (secure)/layout.tsx
// The login page is at quiz/admin/login/ and must NOT be protected here.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

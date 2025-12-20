import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/ui/protected-route';

export const metadata: Metadata = {
  title: 'Dashboard - CMS',
  description: 'CMS Dashboard overview',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
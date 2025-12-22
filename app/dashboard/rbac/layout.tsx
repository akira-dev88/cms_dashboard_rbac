import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RBAC Management',
  description: 'Role-Based Access Control Management',
};

export default function RbacLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
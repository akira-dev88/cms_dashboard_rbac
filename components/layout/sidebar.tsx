'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart,
  Bell,
  HelpCircle,
  Shield,
  Key,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'RBAC',
    icon: Shield,
    children: [
      {
        title: 'Roles',
        href: '/dashboard/rbac/roles',
        icon: Shield,
      },
      {
        title: 'Permissions',
        href: '/dashboard/rbac/permissions',
        icon: Key,
      },
      {
        title: 'Assign Roles',
        href: '/dashboard/rbac/assign',
        icon: UserPlus,
      },
    ],
  },
  {
    title: 'Content',
    href: '/dashboard/content',
    icon: FileText,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  const isParentActive = (children: any[]) => 
    children.some(child => isActive(child.href));

  return (
    <div className="hidden border-r bg-gray-50 md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="h-6 w-6 rounded-lg bg-blue-600" />
            <span>CMS Dashboard</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              if (item.children) {
                const parentActive = isParentActive(item.children);
                
                return (
                  <div key={item.title} className="space-y-1">
                    <div className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500",
                      parentActive && "text-blue-600"
                    )}>
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </div>
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                              isActive(child.href) && "bg-blue-50 text-blue-600 hover:text-blue-600"
                            )}
                          >
                            <ChildIcon className="h-4 w-4" />
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                    isActive(item.href) && "bg-blue-50 text-blue-600 hover:text-blue-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="space-y-2">
            <Link
              href="/dashboard/notifications"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Link>
            <Link
              href="/dashboard/help"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
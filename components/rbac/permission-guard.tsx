'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: string[];
  fallback?: ReactNode;
}

export function PermissionGuard({ 
  children, 
  requiredPermissions, 
  fallback = null 
}: PermissionGuardProps) {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!user?.roles) {
      setHasPermission(false);
      return;
    }
    
    // Check if user has any of the required permissions
    const userHasPermission = user.roles.some((role: string) => 
      requiredPermissions.some(perm => 
        role.toLowerCase().includes(perm.toLowerCase())
      )
    );
    
    setHasPermission(userHasPermission);
  }, [user, requiredPermissions]);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
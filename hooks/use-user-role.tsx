'use client';

import { useEffect, useState } from 'react';
import { getUserRoleAction } from '@/app/admin/profile/actions';
import type { UserRole } from '@/lib/auth';

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const result = await getUserRoleAction();
        if (result?.data) {
          setRole(result.data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRole();
  }, []);

  const isViewer = role === 'viewer';
  const isEditor = role === 'editor';
  const isAdmin = role === 'admin' || role === 'super_admin';
  const isSuperAdmin = role === 'super_admin';
  const canWrite = isEditor || isAdmin || isSuperAdmin;
  const canDelete = isAdmin || isSuperAdmin;

  return {
    role,
    isLoading,
    isViewer,
    isEditor,
    isAdmin,
    isSuperAdmin,
    canWrite,
    canDelete,
  };
}

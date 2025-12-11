"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import {
    hasMinimumRole,
    canAccessRoute,
    isSpecializedRole,
    type UserRole
} from "@/lib/permissions";

interface RoleContextValue {
    role: UserRole | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isViewer: boolean;
    isEditor: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isRevue: boolean;
    isProspection: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canPublish: boolean;
    /** Can manage blog content (standard editor+ OR revue role) */
    canManageBlog: boolean;
    /** Can manage CRM and Jobs (standard editor+ OR prospection role) */
    canManageCrmJobs: boolean;
    hasRole: (minRole: UserRole) => boolean;
    canAccess: (pathname: string) => boolean;
    user: any | null;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();

    const value = useMemo<RoleContextValue>(() => {
        const user = session?.user as any;
        const role = (user?.role || null) as UserRole | null;

        const isRevue = role === "revue";
        const isProspection = role === "prospection";
        const isEditor = role === "editor";
        const isAdmin = role === "admin" || role === "super_admin";
        const isSuperAdmin = role === "super_admin";

        // Standard hierarchical permissions
        const canWrite = hasMinimumRole(role, "editor") || isRevue || isProspection;
        const canDelete = hasMinimumRole(role, "admin");
        const canPublish = hasMinimumRole(role, "admin");

        // Section-specific permissions for specialized roles
        const canManageBlog = hasMinimumRole(role, "editor") || isRevue;
        const canManageCrmJobs = hasMinimumRole(role, "editor") || isProspection;

        return {
            role,
            isLoading: isPending,
            isAuthenticated: !!session,
            isViewer: role === "viewer",
            isEditor,
            isAdmin,
            isSuperAdmin,
            isRevue,
            isProspection,
            canWrite,
            canDelete,
            canPublish,
            canManageBlog,
            canManageCrmJobs,
            hasRole: (minRole: UserRole) => hasMinimumRole(role, minRole),
            canAccess: (pathname: string) => canAccessRoute(role, pathname).allowed,
            user,
        };
    }, [session, isPending]);

    return (
        <RoleContext.Provider value={value}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole(): RoleContextValue {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
}

/**
 * Hook to check if current user has a minimum role level
 */
export function useHasRole(minRole: UserRole): boolean {
    const { hasRole, isLoading } = useRole();
    if (isLoading) return false;
    return hasRole(minRole);
}

/**
 * Hook to check if current user can access a specific route
 */
export function useCanAccess(pathname: string): boolean {
    const { canAccess, isLoading } = useRole();
    if (isLoading) return false;
    return canAccess(pathname);
}

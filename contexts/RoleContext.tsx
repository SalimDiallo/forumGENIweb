"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import {
    hasMinimumRole,
    canAccessRoute,
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
    canWrite: boolean;
    canDelete: boolean;
    canPublish: boolean;
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

        return {
            role,
            isLoading: isPending,
            isAuthenticated: !!session,
            isViewer: role === "viewer",
            isEditor: role === "editor",
            isAdmin: role === "admin" || role === "super_admin",
            isSuperAdmin: role === "super_admin",
            canWrite: hasMinimumRole(role, "editor"),
            canDelete: hasMinimumRole(role, "admin"),
            canPublish: hasMinimumRole(role, "admin"),
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

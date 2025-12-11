"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";
import { canAccessRoute, getRoleDisplayName, type UserRole } from "@/lib/permissions";
import { ShieldX, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Get the default redirect URL for a specialized role
 */
function getSpecializedRoleRedirect(role: UserRole | null): string {
    switch (role) {
        case "revue":
            return "/admin/blog";
        case "prospection":
            return "/admin/crm";
        default:
            return "/admin";
    }
}

/**
 * Get the display name for a specialized role's section
 */
function getSpecializedRoleSectionName(role: UserRole | null): string {
    switch (role) {
        case "revue":
            return "Blog";
        case "prospection":
            return "CRM";
        default:
            return "Dashboard";
    }
}

interface SpecializedRouteGuardProps {
    children: React.ReactNode;
    /** Custom fallback when access is denied */
    fallback?: React.ReactNode;
    /** Auto-redirect to allowed section (default: true) */
    autoRedirect?: boolean;
    /** Delay before redirect in ms (default: 2000) */
    redirectDelay?: number;
}

/**
 * Route guard for specialized roles (revue, prospection)
 * Automatically redirects to their allowed section if they try to access restricted pages
 */
export function SpecializedRouteGuard({
    children,
    fallback,
    autoRedirect = true,
    redirectDelay = 2000,
}: SpecializedRouteGuardProps) {
    const { role, isLoading, isRevue, isProspection, canAccess, isAuthenticated } = useRole();
    const router = useRouter();
    const pathname = usePathname();

    // Skip guard for login page - always accessible
    const isLoginPage = pathname === "/admin/login";

    // Check if current path is accessible
    const hasAccess = pathname ? canAccess(pathname) : true;
    const isSpecializedRole = isRevue || isProspection;

    // Auto-redirect for specialized roles (not on login page)
    useEffect(() => {
        if (!isLoading && isSpecializedRole && !hasAccess && autoRedirect && !isLoginPage) {
            const redirectUrl = getSpecializedRoleRedirect(role);
            const timer = setTimeout(() => {
                router.replace(redirectUrl);
            }, redirectDelay);
            return () => clearTimeout(timer);
        }
    }, [isLoading, isSpecializedRole, hasAccess, autoRedirect, role, router, redirectDelay, isLoginPage]);

    // Always allow login page
    if (isLoginPage) {
        return <>{children}</>;
    }

    // If not authenticated, let middleware handle it (redirect to login)
    if (!isLoading && !isAuthenticated) {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // If access is allowed, render children
    if (hasAccess) {
        return <>{children}</>;
    }

    // Custom fallback
    if (fallback) {
        return <>{fallback}</>;
    }

    // Default access denied with redirect info for specialized roles
    if (isSpecializedRole) {
        const redirectUrl = getSpecializedRoleRedirect(role);
        const sectionName = getSpecializedRoleSectionName(role);

        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <ShieldX className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Accès restreint</h2>
                <p className="text-gray-600 mb-4">
                    Votre rôle <span className="font-semibold">{getRoleDisplayName(role!)}</span>{" "}
                    vous donne uniquement accès à la section <span className="font-semibold">{sectionName}</span>.
                </p>
                {autoRedirect && (
                    <p className="text-sm text-gray-500 mb-4">
                        Redirection automatique dans quelques secondes...
                    </p>
                )}
                <Link
                    href={redirectUrl}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                    Aller à {sectionName}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    // Default access denied for non-specialized roles
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <ShieldX className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600 mb-4">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <Link
                href="/admin"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
                Retour au dashboard
            </Link>
        </div>
    );
}

/**
 * Hook to use in pages that need to check access and redirect
 */
export function useSpecializedRoleRedirect() {
    const { role, isLoading, isRevue, isProspection, canAccess } = useRole();
    const router = useRouter();
    const pathname = usePathname();

    const hasAccess = pathname ? canAccess(pathname) : true;
    const isSpecializedRole = isRevue || isProspection;
    const redirectUrl = getSpecializedRoleRedirect(role);

    useEffect(() => {
        if (!isLoading && isSpecializedRole && !hasAccess) {
            router.replace(redirectUrl);
        }
    }, [isLoading, isSpecializedRole, hasAccess, router, redirectUrl]);

    return {
        isLoading,
        hasAccess,
        isSpecializedRole,
        redirectUrl,
        shouldRedirect: isSpecializedRole && !hasAccess,
    };
}

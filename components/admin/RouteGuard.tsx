"use client";

import React from "react";
import { useRole } from "@/contexts/RoleContext";
import { getRoleDisplayName, type UserRole } from "@/lib/permissions";
import { ShieldX, Loader2 } from "lucide-react";
import Link from "next/link";

interface RouteGuardProps {
    children: React.ReactNode;
    /** Minimum role required to view this content */
    minRole: UserRole;
    /** Custom fallback when access is denied */
    fallback?: React.ReactNode;
    /** Show loading skeleton while checking role */
    showLoadingSkeleton?: boolean;
}

/**
 * Client-side route guard component
 * Renders children only if user has required role
 */
export function RouteGuard({
    children,
    minRole,
    fallback,
    showLoadingSkeleton = true,
}: RouteGuardProps) {
    const { hasRole, isLoading } = useRole();

    if (isLoading) {
        if (showLoadingSkeleton) {
            return (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            );
        }
        return null;
    }

    if (!hasRole(minRole)) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return <DefaultAccessDenied requiredRole={minRole} />;
    }

    return <>{children}</>;
}

/**
 * Default access denied message
 */
function DefaultAccessDenied({ requiredRole }: { requiredRole: UserRole }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <ShieldX className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600 mb-4">
                Vous devez avoir le rôle{" "}
                <span className="font-semibold">{getRoleDisplayName(requiredRole)}</span>{" "}
                pour accéder à cette page.
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

interface CanAccessProps {
    children: React.ReactNode;
    /** Action type that determines permission level */
    action: "read" | "write" | "delete" | "publish";
    /** Alternative content to show when access is denied */
    fallback?: React.ReactNode;
}

/**
 * Conditional render based on action permissions
 */
export function CanAccess({ children, action, fallback = null }: CanAccessProps) {
    const { canWrite, canDelete, canPublish, isLoading } = useRole();

    if (isLoading) {
        return null;
    }

    let hasPermission = true;
    switch (action) {
        case "write":
            hasPermission = canWrite;
            break;
        case "delete":
            hasPermission = canDelete;
            break;
        case "publish":
            hasPermission = canPublish;
            break;
        case "read":
            hasPermission = true;
            break;
    }

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

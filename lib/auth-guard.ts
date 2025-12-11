import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { canAccessRoute, getRoleDisplayName, type UserRole } from "@/lib/permissions";

interface AuthGuardResult {
    session: any;
    user: any;
    role: UserRole;
}

/**
 * Server-side auth guard for admin routes
 * Must be called in server components (page.tsx or layout.tsx)
 * 
 * @param pathname - The current route pathname
 * @returns Session, user, and role if authorized
 * @throws Redirects to login or shows access denied
 */
export async function requireAdminAuth(pathname?: string): Promise<AuthGuardResult> {
    const session = await getSession();

    // No session - redirect to login
    if (!session) {
        const currentPath = pathname || "/admin";
        redirect(`/admin/login?from=${encodeURIComponent(currentPath)}&reason=session_expired`);
    }

    const user = session.user as any;
    const role = (user.role || "viewer") as UserRole;

    // Check if account is active
    if (user.isActive === false) {
        redirect("/admin/login?reason=account_disabled");
    }

    // Check route permissions if pathname provided
    if (pathname) {
        const access = canAccessRoute(role, pathname);
        if (!access.allowed) {
            redirect(`/admin?error=access_denied&required=${access.requiredRole}`);
        }
    }

    return { session, user, role };
}

/**
 * Get current user session without requiring auth
 * Returns null if not authenticated
 */
export async function getAdminSession(): Promise<AuthGuardResult | null> {
    const session = await getSession();

    if (!session) {
        return null;
    }

    const user = session.user as any;
    const role = (user.role || "viewer") as UserRole;

    return { session, user, role };
}

/**
 * Check if current user has at least the specified role
 * For use in server components
 */
export async function hasRole(minRole: UserRole): Promise<boolean> {
    const session = await getAdminSession();
    if (!session) return false;

    const roleHierarchy: UserRole[] = ["viewer", "editor", "admin", "super_admin"];
    const userLevel = roleHierarchy.indexOf(session.role);
    const minLevel = roleHierarchy.indexOf(minRole);

    return userLevel >= minLevel;
}

/**
 * Check if current user is super admin
 */
export async function isSuperAdminAuth(): Promise<boolean> {
    return hasRole("super_admin");
}

/**
 * Check if current user can write (editor+)
 */
export async function canWriteAuth(): Promise<boolean> {
    return hasRole("editor");
}

/**
 * Check if current user can delete (admin+)
 */
export async function canDeleteAuth(): Promise<boolean> {
    return hasRole("admin");
}

/**
 * Route permissions configuration for the admin panel
 * Defines which roles can access which routes
 */

export type UserRole = "viewer" | "editor" | "admin" | "super_admin";

export interface RoutePermission {
    path: string;
    /** Minimum role required to access this route */
    minRole: UserRole;
    /** Optional: exact roles allowed (overrides minRole) */
    allowedRoles?: UserRole[];
    /** Description for documentation */
    description?: string;
}

/**
 * Role hierarchy - higher index = more permissions
 */
export const ROLE_HIERARCHY: UserRole[] = ["viewer", "editor", "admin", "super_admin"];

/**
 * Check if a role has at least the minimum required level
 */
export function hasMinimumRole(userRole: UserRole | null, minRole: UserRole): boolean {
    if (!userRole) return false;
    const userLevel = ROLE_HIERARCHY.indexOf(userRole);
    const minLevel = ROLE_HIERARCHY.indexOf(minRole);
    return userLevel >= minLevel;
}

/**
 * Check if a role is in the allowed roles list
 */
export function isRoleAllowed(userRole: UserRole | null, allowedRoles: UserRole[]): boolean {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
}

/**
 * Route permissions configuration
 * Routes are checked in order - first match wins
 * More specific routes should be listed before general ones
 */
export const ROUTE_PERMISSIONS: RoutePermission[] = [
    // Login page - always accessible
    { path: "/admin/login", minRole: "viewer", description: "Login page" },

    // Users management - Super Admin only
    { path: "/admin/users", minRole: "super_admin", description: "User management" },

    // Dashboard - All authenticated users
    { path: "/admin", minRole: "viewer", description: "Admin dashboard" },

    // Blog - All authenticated users can view, write requires editor+
    { path: "/admin/blog", minRole: "viewer", description: "Blog management" },

    // Events - All authenticated users can view
    { path: "/admin/events", minRole: "viewer", description: "Events management" },

    // Jobs - All authenticated users can view
    { path: "/admin/jobs", minRole: "viewer", description: "Jobs management" },

    // Gallery - All authenticated users can view
    { path: "/admin/gallery", minRole: "viewer", description: "Gallery management" },

    // Testimonials - All authenticated users can view
    { path: "/admin/testimonials", minRole: "viewer", description: "Testimonials management" },

    // CRM - All authenticated users can view
    { path: "/admin/crm", minRole: "viewer", description: "CRM" },

    // Profile - All authenticated users
    { path: "/admin/profile", minRole: "viewer", description: "User profile" },
];

/**
 * Get permission config for a path
 */
export function getRoutePermission(pathname: string): RoutePermission | null {
    // Find the most specific matching route
    for (const route of ROUTE_PERMISSIONS) {
        if (pathname === route.path || pathname.startsWith(route.path + "/")) {
            return route;
        }
    }
    // Default: require admin for unknown routes
    return { path: pathname, minRole: "admin", description: "Unknown route" };
}

/**
 * Check if a user can access a route
 */
export function canAccessRoute(userRole: UserRole | null, pathname: string): {
    allowed: boolean;
    requiredRole: UserRole;
    message?: string;
} {
    const permission = getRoutePermission(pathname);

    if (!permission) {
        return { allowed: false, requiredRole: "admin", message: "Route inconnue" };
    }

    if (permission.allowedRoles) {
        const allowed = isRoleAllowed(userRole, permission.allowedRoles);
        return {
            allowed,
            requiredRole: permission.allowedRoles[0],
            message: allowed ? undefined : `Accès réservé aux rôles: ${permission.allowedRoles.join(", ")}`,
        };
    }

    const allowed = hasMinimumRole(userRole, permission.minRole);
    return {
        allowed,
        requiredRole: permission.minRole,
        message: allowed ? undefined : `Accès réservé aux ${permission.minRole} et supérieurs`,
    };
}

/**
 * Get human-readable role name in French
 */
export function getRoleDisplayName(role: UserRole): string {
    const names: Record<UserRole, string> = {
        viewer: "Lecteur",
        editor: "Éditeur",
        admin: "Administrateur",
        super_admin: "Super Administrateur",
    };
    return names[role] || role;
}

/**
 * Get role badge color classes
 */
export function getRoleBadgeClasses(role: UserRole): string {
    const colors: Record<UserRole, string> = {
        viewer: "bg-gray-100 text-gray-700",
        editor: "bg-blue-100 text-blue-700",
        admin: "bg-emerald-100 text-emerald-700",
        super_admin: "bg-purple-100 text-purple-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
}

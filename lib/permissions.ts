/**
 * Route permissions configuration for the admin panel
 * Defines which roles can access which routes
 */

export type UserRole = "viewer" | "editor" | "admin" | "super_admin" | "revue" | "prospection";

/** Standard hierarchical roles (viewer < editor < admin < super_admin) */
export type HierarchicalRole = "viewer" | "editor" | "admin" | "super_admin";

/** Specialized roles with section-specific access */
export type SpecializedRole = "revue" | "prospection";

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
 * Note: revue and prospection are specialized roles outside this hierarchy
 */
export const ROLE_HIERARCHY: HierarchicalRole[] = ["viewer", "editor", "admin", "super_admin"];

/**
 * Check if a role is a specialized role (revue or prospection)
 */
export function isSpecializedRole(role: UserRole | null): role is SpecializedRole {
    return role === "revue" || role === "prospection";
}

/**
 * Check if a role has at least the minimum required level
 * Specialized roles (revue, prospection) are handled separately via allowedRoles
 */
export function hasMinimumRole(userRole: UserRole | null, minRole: UserRole): boolean {
    if (!userRole) return false;

    // Specialized roles don't participate in hierarchy
    // They should ONLY access routes that explicitly include them in allowedRoles
    // This function returning false means canAccessRoute will deny them for routes without allowedRoles
    if (isSpecializedRole(userRole)) {
        return false;
    }

    // For hierarchical roles, check level
    const userLevel = ROLE_HIERARCHY.indexOf(userRole as HierarchicalRole);
    const minLevel = ROLE_HIERARCHY.indexOf(minRole as HierarchicalRole);
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
    // IMPORTANT: Routes are checked in order - first match wins!
    // More specific routes MUST be listed BEFORE general ones

    // Login page - always accessible (including specialized roles for redirect after login)
    {
        path: "/admin/login",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin", "revue", "prospection"],
        description: "Login page"
    },

    // Users management - Super Admin only
    {
        path: "/admin/users",
        minRole: "super_admin",
        allowedRoles: ["super_admin"],
        description: "User management"
    },

    // Blog - Standard roles + revue (specialized for blog)
    {
        path: "/admin/blog",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin", "revue"],
        description: "Blog management"
    },

    // Events - Standard roles only (no specialized roles)
    {
        path: "/admin/events",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin"],
        description: "Events management"
    },

    // Jobs - Standard roles + prospection (specialized for jobs + CRM)
    {
        path: "/admin/jobs",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin", "prospection"],
        description: "Jobs management"
    },

    // Gallery - Standard roles only (no specialized roles)
    {
        path: "/admin/gallery",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin"],
        description: "Gallery management"
    },

    // Testimonials - Standard roles only (no specialized roles)
    {
        path: "/admin/testimonials",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin"],
        description: "Testimonials management"
    },

    // CRM - Standard roles + prospection (specialized for CRM + jobs)
    {
        path: "/admin/crm",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin", "prospection"],
        description: "CRM"
    },

    // Profile - All authenticated users (including specialized roles)
    {
        path: "/admin/profile",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin", "revue", "prospection"],
        description: "User profile"
    },

    // Dashboard - All authenticated users (including specialized roles)
    // MUST BE LAST because /admin matches all /admin/* routes with startsWith
    {
        path: "/admin",
        minRole: "viewer",
        allowedRoles: ["viewer", "editor", "admin", "super_admin", "revue", "prospection"],
        description: "Admin dashboard"
    },
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
        revue: "Revue (Blog)",
        prospection: "Prospection (CRM/Emplois)",
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
        revue: "bg-orange-100 text-orange-700",
        prospection: "bg-cyan-100 text-cyan-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
}

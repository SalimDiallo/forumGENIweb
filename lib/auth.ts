/**
 * AUTH.TS - Système d'authentification basique
 *
 * IMPORTANT: Ceci est une implémentation temporaire basée sur des variables d'environnement.
 * Pour la production, vous devriez implémenter:
 * - NextAuth.js ou Clerk pour une authentification robuste
 * - Sessions sécurisées avec JWT
 * - Middleware Next.js pour protéger les routes
 * - Gestion des rôles utilisateurs via base de données
 */

import { cookies, headers } from "next/headers";

export type UserRole = "user" | "admin" | "super_admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Vérifie si l'utilisateur est authentifié via un token basique
 * TEMPORAIRE: Basé sur une variable d'environnement
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Vérifier le cookie d'authentification
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      return null;
    }

    // TEMPORAIRE: Vérification basique avec variable d'environnement
    // En production, vous devriez vérifier contre une base de données ou JWT
    const validAdminToken = process.env.ADMIN_AUTH_TOKEN || "admin_secret_token";
    const validSuperAdminToken = process.env.SUPER_ADMIN_AUTH_TOKEN || "super_admin_secret_token";

    if (authToken === validSuperAdminToken) {
      return {
        id: "super_admin",
        email: "superadmin@forumgenie.com",
        role: "super_admin",
      };
    }

    if (authToken === validAdminToken) {
      return {
        id: "admin",
        email: "admin@forumgenie.com",
        role: "admin",
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur est un admin (admin ou super_admin)
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null && (user.role === "admin" || user.role === "super_admin");
}

/**
 * Vérifie si l'utilisateur est un super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null && user.role === "super_admin";
}

/**
 * Obtient l'IP du client pour le rate limiting
 */
export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();

  // Essayer d'obtenir l'IP réelle derrière les proxies
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback sur une IP générique si aucune n'est trouvée
  return "unknown";
}

/**
 * Classe d'erreur pour les problèmes d'authentification
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Lance une erreur si l'utilisateur n'est pas authentifié
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Authentification requise");
  }
  return user;
}

/**
 * Lance une erreur si l'utilisateur n'est pas admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "admin" && user.role !== "super_admin") {
    throw new AuthError("Accès admin requis");
  }
  return user;
}

/**
 * Lance une erreur si l'utilisateur n'est pas super admin
 */
export async function requireSuperAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "super_admin") {
    throw new AuthError("Accès super admin requis");
  }
  return user;
}

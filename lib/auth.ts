/**
 * AUTH.TS - Système d'authentification avec Better Auth
 *
 * Utilise Better Auth pour une authentification robuste avec:
 * - Sessions sécurisées
 * - Authentification par email/password
 * - Gestion des rôles utilisateurs
 * - Base de données Prisma
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "viewer",
      },
      fullName: {
        type: "string",
        required: true,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      lastLogin: {
        type: "date",
        required: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "admin-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  },
  basePath: "/api/auth",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;
export type UserRole = "viewer" | "editor" | "admin" | "super_admin" | "revue" | "prospection";

/**
 * Récupère la session de l'utilisateur connecté
 */
export async function getSession() {
  return await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });
}

/**
 * Vérifie si l'utilisateur est un admin (admin ou super_admin)
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const role = (session.user as any).role;
  return role === "admin" || role === "super_admin";
}

/**
 * Vérifie si l'utilisateur est un editor
 */
export async function isEditor(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const role = (session.user as any).role;
  return role === "editor";
}

/**
 * Vérifie si l'utilisateur est un super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const role = (session.user as any).role;
  return role === "super_admin";
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
 * Lance une erreur si l'utilisateur n'est pas authentifié ou si son compte est désactivé
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Authentification requise");
  }

  // Vérifier si l'utilisateur est actif
  const isActive = (session.user as any).isActive;
  if (isActive === false) {
    throw new AuthError("Votre compte a été désactivé. Veuillez contacter un administrateur.");
  }

  return session;
}

/**
 * Lance une erreur si l'utilisateur n'est pas admin
 * Les editors et rôles spécialisés (revue, prospection) ont aussi accès (avec restrictions)
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const role = (session.user as any).role;
  // Standard roles + specialized roles have base access
  if (role !== "admin" && role !== "super_admin" && role !== "editor" && role !== "revue" && role !== "prospection") {
    throw new AuthError("Accès admin requis");
  }
  return session;
}

/**
 * Lance une erreur si l'utilisateur n'est pas super admin
 */
export async function requireSuperAdmin() {
  const session = await requireAuth();
  const role = (session.user as any).role;
  if (role !== "super_admin") {
    throw new AuthError("Accès super admin requis");
  }
  return session;
}

/**
 * Lance une erreur si l'utilisateur n'a pas la permission d'écrire (créer/modifier)
 * Les viewers ne peuvent que lire, les editors/admins/super admins et rôles spécialisés peuvent modifier
 */
export async function requireWritePermission() {
  const session = await requireAuth();
  const role = (session.user as any).role;
  if (role === "viewer") {
    throw new AuthError("Vous n'avez pas la permission de modifier. Seuls les administrateurs peuvent effectuer cette action.");
  }
  // Standard roles + specialized roles can write
  if (role !== "editor" && role !== "admin" && role !== "super_admin" && role !== "revue" && role !== "prospection") {
    throw new AuthError("Permission d'écriture refusée");
  }
  return session;
}

/**
 * Lance une erreur si l'utilisateur n'a pas la permission de supprimer
 * Les viewers et editors ne peuvent pas supprimer, seuls les admins et super admins le peuvent
 */
export async function requireDeletePermission() {
  const session = await requireAuth();
  const role = (session.user as any).role;
  if (role === "viewer" || role === "editor") {
    throw new AuthError("Vous n'avez pas la permission de supprimer. Seuls les administrateurs peuvent effectuer cette action.");
  }
  if (role !== "admin" && role !== "super_admin") {
    throw new AuthError("Permission de suppression refusée");
  }
  return session;
}

/**
 * Vérifie si l'utilisateur est un viewer (lecture seule)
 */
export async function isViewer(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const role = (session.user as any).role;
  return role === "viewer";
}

/**
 * Récupère le rôle de l'utilisateur connecté
 */
export async function getUserRole(): Promise<UserRole | null> {
  const session = await getSession();
  if (!session) return null;
  return (session.user as any).role as UserRole;
}

/**
 * Récupère l'utilisateur connecté
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Met à jour la date de dernière connexion de l'utilisateur
 */
export async function updateLastLogin(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de lastLogin:", error);
  }
}

/**
 * Vérifie si l'utilisateur peut publier du contenu (non-draft)
 * Les editors ne peuvent créer que des brouillons
 */
export async function canPublish(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const role = (session.user as any).role;
  return role === "admin" || role === "super_admin";
}

/**
 * Force le statut à "draft" si l'utilisateur est un editor
 * Retourne le statut original pour les admins et super admins
 */
export async function enforceDraftStatusForEditor<T extends string>(status: T): Promise<T> {
  const session = await getSession();
  if (!session) return status;

  const role = (session.user as any).role;
  if (role === "editor") {
    // Pour les editors, toujours forcer le statut à draft
    return "draft" as T;
  }

  return status;
}

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
  database: prismaAdapter(prisma, {
    provider: "sqlite",
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
        defaultValue: "editor",
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
  },
  basePath: "/api/auth",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001",
});

export type Session = typeof auth.$Infer.Session;
export type UserRole = "editor" | "admin" | "super_admin";

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
 * Lance une erreur si l'utilisateur n'est pas authentifié
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Authentification requise");
  }
  return session;
}

/**
 * Lance une erreur si l'utilisateur n'est pas admin
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const role = (session.user as any).role;
  if (role !== "admin" && role !== "super_admin") {
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

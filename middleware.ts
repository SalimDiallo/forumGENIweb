import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware pour protéger les routes admin
 * Vérifie la présence d'un cookie de session avant d'autoriser l'accès
 *
 * Note: On ne peut pas utiliser Prisma/getSession ici car le middleware
 * tourne en Edge Runtime. On vérifie juste la présence du cookie de session.
 * La vérification complète (rôle, statut actif) est faite côté serveur dans le layout.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si l'utilisateur essaie d'accéder à une route admin (sauf /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Vérifier la présence du cookie de session Better Auth
    // En production, le cookie peut avoir le préfixe __Secure-
    const sessionToken = request.cookies.get("admin-auth.session_token") ||
      request.cookies.get("__Secure-admin-auth.session_token");

    // Si pas de cookie de session, rediriger vers la page de login
    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Le cookie existe, laisser passer
    // La vérification du rôle et du statut sera faite côté serveur
    return NextResponse.next();
  }

  // Si l'utilisateur est sur /admin/login et a un cookie de session
  if (pathname === "/admin/login") {
    const sessionToken = request.cookies.get("admin-auth.session_token") ||
      request.cookies.get("__Secure-admin-auth.session_token");

    if (sessionToken) {
      // Rediriger vers /admin si déjà une session
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Configuration du middleware
 * Matcher pour les routes qui doivent être protégées
 */
export const config = {
  matcher: [
    /*
     * Match toutes les routes admin sauf:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/admin/:path*",
  ],
};

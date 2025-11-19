import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Générer les handlers par défaut
const handlers = toNextJsHandler(auth);

// Wrapper personnalisé pour le POST qui vérifie si l'utilisateur est actif
export async function POST(req: NextRequest) {
  // Cloner la requête pour lire le body
  const clonedReq = req.clone();

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Vérifier si c'est une tentative de connexion
    if (pathname.includes("/sign-in/email")) {
      const body = await clonedReq.json();

      if (body.email) {
        // Vérifier si l'utilisateur existe et s'il est actif
        const user = await prisma.user.findUnique({
          where: { email: body.email },
        });

        if (user && user.isActive === false) {
          return NextResponse.json(
            {
              error: "Votre compte a été désactivé. Veuillez contacter un administrateur.",
            },
            { status: 403 }
          );
        }

        // Continuer avec le handler Better Auth normal
        const response = await handlers.POST(req);

        // Si la connexion a réussi (status 200), mettre à jour lastLogin
        if (response.status === 200 && user) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() },
            });
          } catch (error) {
            console.error("Erreur lors de la mise à jour de lastLogin:", error);
          }
        }

        return response;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du compte:", error);
  }

  // Continuer avec le handler Better Auth normal pour les autres routes
  return handlers.POST(req);
}

// GET reste inchangé
export const GET = handlers.GET;

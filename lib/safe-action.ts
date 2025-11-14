import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { getCurrentUser, requireAdmin, requireSuperAdmin, AuthError } from "./auth";


class ActionError extends Error {}


// ✅ Définition du client de base avec un schéma de métadonnées valide

export const action = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);

    if (e instanceof ActionError) {
      return e.message;
    }

    if (e instanceof AuthError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string(),
    }),
})

export const actionClient = action
// ✅ Middleware de logging
.use(async ({ next, clientInput, metadata }) => {
  // TODO: Replace with proper logging service (e.g., Winston, Pino)
  // Logging middleware for development - tracks action execution time and metadata

  const startTime = performance.now();
  const result = await next();
  const endTime = performance.now();

  // TODO: Log to proper logging service in production
  // Track: result, clientInput, metadata, execution time (endTime - startTime)

  return next({ ...result });
});

// ✅ Client d'authentification basé sur `actionClient`
export const authActionClient = actionClient
  .use(async ({ next, metadata }) => {
    // Vérifier que l'action a un nom
    if (!metadata?.actionName) {
      throw new ActionError("l'action n'a pas de nom");
    }

    // Vérifier l'authentification de l'utilisateur
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthError("Authentification requise");
    }

    return next({ ctx: { user } });
  });

// ✅ Client pour les super-admins
export const superAdminAction = authActionClient
  .use(async ({ next, ctx }) => {
    // Vérifier que l'utilisateur est un super admin
    const user = await requireSuperAdmin();
    return next({ ctx: { ...ctx, user } });
  });

// ✅ Client pour les admins avec validation de `metadata`
export const adminAction = authActionClient
  .use(async ({ next, ctx }) => {
    // Vérifier que l'utilisateur est au moins admin
    const user = await requireAdmin();
    return next({ ctx: { ...ctx, user } });
  });

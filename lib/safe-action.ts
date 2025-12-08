import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { requireAdmin, requireSuperAdmin, requireDeletePermission, requireWritePermission, AuthError } from "./auth";
import { revalidateTag } from "next/cache";

class ActionError extends Error {}

// ------ Anti-spam/middleware: max 1 action per 2 seconds (global process-wide) ------
const lastActionTime: Map<string, number> = new Map();
// You can scope by user if you want to make it per-user (with user id in context), 
// but for now, it's global per action name

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ✅ Définition du client de base avec un schéma de métadonnées valide

/**
 * Tags de cache disponibles:
 * - 'events': Événements
 * - 'blog': Articles, catégories, tags de blog
 * - 'testimonials': Témoignages vidéo
 * - 'media': Galerie média
 * - 'jobs': Offres d'emploi
 * - 'stats': Statistiques du dashboard
 * - 'crm': Messages de contact et CRM
 */
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
      // Tags de cache à invalider après l'action (optionnel)
      // Si non spécifié, le système détectera automatiquement basé sur actionName
      cacheTags: z.array(z.string()).optional(),
    }),
});

// ✅ Middleware anti-spam: limite à 1 action par 2 secondes (par actionName)
async function rateLimitMiddleware({ next, metadata }: { next: () => Promise<any>; metadata?: { actionName?: string } }) {
  const actionName = metadata?.actionName || "global";
  const now = Date.now();
  const last = lastActionTime.get(actionName) || 0;
  const MIN_DELAY = 500; // 0.5 second in ms

  const elapsed = now - last;
  if (elapsed < MIN_DELAY) {
    // Soit on bloque, soit on attend...
    // Ici, on bloque.
    throw new ActionError(
      `Veuillez patienter ${Math.ceil((MIN_DELAY - elapsed) / 1000)}s avant de réessayer cette action.`
    );
    // // Pour attendre au lieu de bloquer :
    // await sleep(MIN_DELAY - elapsed)
  }
  lastActionTime.set(actionName, now);

  return next();
}

// ✅ Middleware d'invalidation automatique des caches
/**
 * Détecte automatiquement les tags de cache à invalider basé sur le nom de l'action
 * Exemples:
 * - "create-blog-post" → invalide ['blog', 'stats']
 * - "update-event" → invalide ['events', 'stats']
 * - "delete-category" → invalide ['blog', 'stats']
 */
function detectCacheTagsFromActionName(actionName: string): string[] {
  const tags: Set<string> = new Set();

  // Détection basée sur des mots-clés dans le nom de l'action
  const lowerActionName = actionName.toLowerCase();

  // Blog (posts, categories, tags)
  if (lowerActionName.includes('blog') ||
      lowerActionName.includes('post') ||
      lowerActionName.includes('category') ||
      lowerActionName.includes('categories') ||
      lowerActionName.includes('tag')) {
    tags.add('blog');
  }

  // Events
  if (lowerActionName.includes('event') ||
      lowerActionName.includes('registration')) {
    tags.add('events');
  }

  // Jobs
  if (lowerActionName.includes('job')) {
    tags.add('jobs');
  }

  // Testimonials
  if (lowerActionName.includes('testimonial')) {
    tags.add('testimonials');
  }

  // Media
  if (lowerActionName.includes('media') ||
      lowerActionName.includes('gallery')) {
    tags.add('media');
  }

  // CRM / Contacts
  if (lowerActionName.includes('contact') ||
      lowerActionName.includes('message') ||
      lowerActionName.includes('crm')) {
    tags.add('crm');
  }

  // Toujours invalider les stats pour mettre à jour le dashboard admin
  // sauf pour les actions de lecture (list, get)
  if (!lowerActionName.startsWith('list') &&
      !lowerActionName.startsWith('get') &&
      tags.size > 0) {
    tags.add('stats');
  }

  return Array.from(tags);
}

async function cacheInvalidationMiddleware({
  next,
  metadata
}: {
  next: () => Promise<any>;
  metadata?: { actionName?: string; cacheTags?: string[] }
}) {
  // Exécuter l'action
  const result = await next();

  // Invalider les caches uniquement si l'action a réussi
  if (result && metadata?.actionName) {
    const lowerActionName = metadata.actionName.toLowerCase();

    // Skip cache invalidation for read operations (get, list, fetch, etc.)
    // These are data fetching operations that should not invalidate cache
    const isReadOperation = lowerActionName.startsWith('get') ||
                           lowerActionName.startsWith('list') ||
                           lowerActionName.startsWith('fetch') ||
                           lowerActionName.startsWith('find');

    if (isReadOperation) {
      return result;
    }

    try {
      // Utiliser les tags personnalisés ou détecter automatiquement
      const tagsToInvalidate = metadata.cacheTags || detectCacheTagsFromActionName(metadata.actionName);

      if (tagsToInvalidate.length > 0) {
        // Invalider chaque tag
        tagsToInvalidate.forEach((tag) => {
          revalidateTag(tag);
          console.log(`[Cache] Tag invalidé: ${tag} (action: ${metadata.actionName})`);
        });
      }
    } catch (error) {
      // Ne pas faire échouer l'action si l'invalidation du cache échoue
      console.error('[Cache] Erreur lors de l\'invalidation du cache:', error);
    }
  }

  return result;
}

export const actionClient = action
  // ✅ Middleware d'invalidation automatique des caches
  .use(cacheInvalidationMiddleware)
  // ✅ Middleware de logging
  .use(async ({ next }) => {
    // TODO: Replace with proper logging service (e.g., Winston, Pino)
    // Logging middleware for development - tracks action execution time and metadata
    // Uncomment and use clientInput, metadata, execution time when implementing logging service

    // const startTime = performance.now();
    const result = await next();
    // const endTime = performance.now();

    // TODO: Log to proper logging service in production
    // Track: result, clientInput, metadata, execution time (endTime - startTime)

    return result;
  });

// ✅ Client d'authentification basé sur `actionClient`
export const authActionClient = actionClient
  .use(async ({ next, metadata }) => {
    // Vérifier que l'action a un nom
    if (!metadata?.actionName) {
      throw new ActionError("l'action n'a pas de nom");
    }

    // Vérifier l'authentification de l'utilisateur
    const session = await import("./auth").then(mod => mod.requireAuth());

    return next({ ctx: { session } });
  });

// ✅ Client pour les super-admins
export const superAdminAction = authActionClient
.use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Vérifier que l'utilisateur est un super admin
    await requireSuperAdmin();
    return next({ ctx });
  });

// ✅ Client pour les admins avec validation de `metadata`
export const adminAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Vérifier que l'utilisateur est au moins admin
    await requireAdmin();
    return next({ ctx });
  });

// ✅ Client pour les actions d'écriture (création/modification - interdit aux éditeurs)
export const writeAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Vérifier que l'utilisateur a la permission d'écrire
    // Les éditeurs ne peuvent que lire, pas créer ni modifier
    await requireWritePermission();
    return next({ ctx });
  });

// ✅ Client pour les actions de suppression (interdit aux éditeurs)
export const deleteAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Vérifier que l'utilisateur a la permission de supprimer
    // Les éditeurs ne peuvent pas supprimer
    await requireDeletePermission();
    return next({ ctx });
  });

// ✅ Client pour les editors - peuvent créer mais uniquement en brouillon
export const editorAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Vérifier que l'utilisateur est au moins editor
    const session = await import("./auth").then(mod => mod.requireAuth());
    const role = (session.user as any).role;

    if (role !== "editor" && role !== "admin" && role !== "super_admin") {
      throw new ActionError("Accès refusé. Vous devez être au moins éditeur.");
    }

    return next({ ctx: { ...ctx, userRole: role } });
  });

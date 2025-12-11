import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { requireAdmin, requireSuperAdmin, requireDeletePermission, requireWritePermission, AuthError } from "./auth";
import { revalidateTag } from "next/cache";

/**
 * Custom error class for action-specific errors
 */
class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

/**
 * Rate limiting: Track last action execution time per action name
 * This is a simple in-memory rate limiter (process-wide)
 * For production with multiple instances, consider Redis-based rate limiting
 */
const lastActionTime: Map<string, number> = new Map();

/**
 * Cache tags available for revalidation:
 * - 'events': Events and registrations
 * - 'blog': Blog posts, categories, tags
 * - 'testimonials': Video testimonials
 * - 'media': Media gallery
 * - 'jobs': Job offers and applications
 * - 'stats': Dashboard statistics
 * - 'crm': Contact messages and CRM data
 */

/**
 * Base safe action client with error handling and metadata schema
 *
 * Features:
 * - Automatic error masking for security (only ActionError and AuthError are exposed)
 * - Metadata schema for action naming and cache tag management
 * - Server error logging for debugging
 */
export const action = createSafeActionClient({
  // Handle server-side errors and mask sensitive information
  handleServerError(e) {
    // Log the full error server-side for debugging
    console.error("[Action Error]", e);

    // Only expose safe error messages to the client
    if (e instanceof ActionError) {
      return e.message;
    }

    if (e instanceof AuthError) {
      return e.message;
    }

    // For all other errors, return a generic message to avoid leaking sensitive info
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },

  // Define metadata schema - required for all actions using this client
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string().min(1, "Action name is required"),
      // Optional: Explicit cache tags to invalidate after action execution
      // If not provided, tags are auto-detected from actionName
      cacheTags: z.array(z.string()).optional(),
    }),
});

/**
 * Rate limiting middleware: Prevents spam by limiting action execution frequency
 *
 * @param MIN_DELAY - Minimum delay between actions (in milliseconds)
 * @throws ActionError if action is called too frequently
 */
async function rateLimitMiddleware({
  next,
  metadata,
}: {
  next: (ctx?: any) => Promise<any>;
  metadata?: { actionName?: string };
}) {
  const actionName = metadata?.actionName || "global";
  const now = Date.now();
  const last = lastActionTime.get(actionName) || 0;
  const MIN_DELAY = 500; // 500ms (0.5 second)

  const elapsed = now - last;

  if (elapsed < MIN_DELAY) {
    const waitSeconds = Math.ceil((MIN_DELAY - elapsed) / 1000);
    throw new ActionError(
      `Veuillez patienter ${waitSeconds}s avant de réessayer cette action.`
    );
  }

  // Update last action time
  lastActionTime.set(actionName, now);

  // Continue to next middleware
  return next();
}

/**
 * Auto-detects cache tags to invalidate based on action name
 *
 * Examples:
 * - "create-blog-post" → ['blog', 'stats']
 * - "update-event" → ['events', 'stats']
 * - "delete-job" → ['jobs', 'stats']
 * - "list-events" → [] (read operations don't invalidate cache)
 *
 * @param actionName - The name of the action being executed
 * @returns Array of cache tags to invalidate
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

/**
 * Cache invalidation middleware: Automatically revalidates cache tags after successful actions
 *
 * Features:
 * - Runs AFTER action execution (only on success)
 * - Auto-detects cache tags from action name
 * - Skips read operations (get, list, fetch, find)
 * - Supports explicit cache tags via metadata
 * - Never throws errors (logs failures instead)
 */
async function cacheInvalidationMiddleware({
  next,
  metadata,
}: {
  next: (ctx?: any) => Promise<any>;
  metadata?: { actionName?: string; cacheTags?: string[] };
}) {
  // Execute the action first
  const result = await next();

  // Only invalidate cache if action succeeded and has metadata
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

/**
 * Main action client with cache invalidation and logging middleware
 *
 * Middleware chain order (instance-level):
 * 1. Cache invalidation (runs after action for successful operations)
 * 2. Logging (tracks performance and errors)
 *
 * Use this client for public actions that don't require authentication
 */
export const actionClient = action
  // Cache invalidation middleware - runs after action execution
  .use(cacheInvalidationMiddleware)
  // Logging middleware - tracks performance and errors
  .use(async ({ next }) => {
    // TODO: Replace with proper logging service (e.g., Winston, Pino, Sentry)
    // const startTime = performance.now();
    const result = await next();
    // const endTime = performance.now();
    // Log: result status, execution time, metadata
    return result;
  });

/**
 * Authenticated action client - requires user authentication
 *
 * Middleware chain order:
 * 1. Cache invalidation (from actionClient)
 * 2. Logging (from actionClient)
 * 3. Authentication check (requires valid session)
 *
 * Context provided:
 * - session: User session with user data
 *
 * @throws ActionError if metadata.actionName is missing
 * @throws AuthError if user is not authenticated or account is disabled
 */
export const authActionClient = actionClient.use(async ({ next, metadata }) => {
  // Validate metadata
  if (!metadata?.actionName) {
    throw new ActionError("Action name is required in metadata");
  }

  // Require valid authentication
  const session = await import("./auth").then((mod) => mod.requireAuth());

  // Pass session to next middleware/action via context
  return next({ ctx: { session } });
});

/**
 * Super admin action client - requires super admin role
 *
 * Middleware chain order:
 * 1. Cache invalidation (from actionClient)
 * 2. Logging (from actionClient)
 * 3. Authentication (from authActionClient)
 * 4. Rate limiting (500ms between actions)
 * 5. Super admin role check
 *
 * Use for critical admin operations (user management, system settings, etc.)
 *
 * @throws AuthError if user is not a super admin
 */
export const superAdminAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Require super admin role
    await requireSuperAdmin();
    return next({ ctx });
  });

/**
 * Admin action client - requires admin role (admin, super_admin, or editor)
 *
 * Middleware chain order:
 * 1. Cache invalidation (from actionClient)
 * 2. Logging (from actionClient)
 * 3. Authentication (from authActionClient)
 * 4. Rate limiting (500ms between actions)
 * 5. Admin role check
 *
 * Use for admin operations (content management, CRM, analytics, etc.)
 *
 * @throws AuthError if user is not admin/editor/super_admin
 */
export const adminAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Require admin, editor, or super_admin role
    await requireAdmin();
    return next({ ctx });
  });

/**
 * Write action client - requires write permission (editor, admin, super_admin)
 *
 * Middleware chain order:
 * 1. Cache invalidation (from actionClient)
 * 2. Logging (from actionClient)
 * 3. Authentication (from authActionClient)
 * 4. Rate limiting (500ms between actions)
 * 5. Write permission check
 *
 * Use for create/update operations
 * Note: Viewers cannot use this client
 *
 * @throws AuthError if user is a viewer (read-only)
 */
export const writeAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Require write permission (blocks viewers)
    await requireWritePermission();
    return next({ ctx });
  });

/**
 * Delete action client - requires delete permission (admin, super_admin only)
 *
 * Middleware chain order:
 * 1. Cache invalidation (from actionClient)
 * 2. Logging (from actionClient)
 * 3. Authentication (from authActionClient)
 * 4. Rate limiting (500ms between actions)
 * 5. Delete permission check
 *
 * Use for delete operations
 * Note: Viewers and editors cannot delete
 *
 * @throws AuthError if user is viewer or editor
 */
export const deleteAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Require delete permission (blocks viewers and editors)
    await requireDeletePermission();
    return next({ ctx });
  });

/**
 * Editor action client - requires editor role (editor, admin, super_admin)
 *
 * Middleware chain order:
 * 1. Cache invalidation (from actionClient)
 * 2. Logging (from actionClient)
 * 3. Authentication (from authActionClient)
 * 4. Rate limiting (500ms between actions)
 * 5. Editor role check
 *
 * Context provided:
 * - session (from authActionClient)
 * - userRole: The user's role (editor, admin, or super_admin)
 *
 * Use for operations that editors can perform (create drafts, etc.)
 *
 * @throws ActionError if user is a viewer
 */
export const editorAction = authActionClient
  .use(rateLimitMiddleware)
  .use(async ({ next, ctx }) => {
    // Require at least editor role
    const session = await import("./auth").then((mod) => mod.requireAuth());
    const role = (session.user as any).role;

    if (role !== "editor" && role !== "admin" && role !== "super_admin") {
      throw new ActionError(
        "Accès refusé. Vous devez être au moins éditeur."
      );
    }

    // Pass user role to action via context
    return next({ ctx: { ...ctx, userRole: role } });
  });

/**
 * TypeScript types for action contexts
 */

// Base context from authActionClient
export type AuthContext = {
  session: Awaited<ReturnType<typeof import("./auth").requireAuth>>;
};

// Editor context with user role
export type EditorContext = AuthContext & {
  userRole: "editor" | "admin" | "super_admin";
};

/**
 * Action client summary:
 *
 * - `action`: Base client with error handling
 * - `actionClient`: Adds cache invalidation and logging
 * - `authActionClient`: Requires authentication (session in context)
 * - `adminAction`: Requires admin/editor/super_admin role + rate limiting
 * - `superAdminAction`: Requires super_admin role + rate limiting
 * - `writeAction`: Requires write permission (blocks viewers) + rate limiting
 * - `deleteAction`: Requires delete permission (blocks viewers & editors) + rate limiting
 * - `editorAction`: Requires editor role + adds userRole to context + rate limiting
 *
 * Middleware execution order:
 * 1. Cache invalidation (after action, on success only)
 * 2. Logging (tracks performance)
 * 3. Authentication (checks session)
 * 4. Rate limiting (prevents spam - 500ms delay)
 * 5. Authorization (role/permission checks)
 */

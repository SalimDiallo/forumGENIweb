/**
 * EXAMPLE ACTION FILE - Best Practices for next-safe-action v8
 *
 * This file demonstrates the correct way to define actions using next-safe-action v8.
 * Use this as a reference when creating or updating actions.
 */

import { z } from "zod";
import {
  actionClient,
  authActionClient,
  adminAction,
  writeAction,
  deleteAction,
  superAdminAction,
  editorAction,
} from "@/lib/safe-action";

// ============================================================================
// EXAMPLE 1: Public Action (No Authentication Required)
// ============================================================================

const subscribeSchema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

export const subscribeToNewsletter = actionClient
  .metadata({
    actionName: "subscribe-newsletter",
    // Optional: Explicit cache tags to invalidate
    // cacheTags: ["newsletter", "stats"],
  })
  .inputSchema(subscribeSchema) // ✅ Use inputSchema (not .schema)
  .action(async ({ parsedInput }) => {
    const { email, name } = parsedInput;

    // Implement your logic here
    // await prisma.newsletterSubscription.create({ ... });

    return {
      success: true,
      message: "Inscription réussie !",
    };
  });

// ============================================================================
// EXAMPLE 2: Authenticated Action (Any Logged-in User)
// ============================================================================

const updateProfileSchema = z.object({
  fullName: z.string().min(2),
  bio: z.string().optional(),
});

export const updateUserProfile = authActionClient
  .metadata({
    actionName: "update-user-profile",
  })
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    // ctx.session is available from authActionClient
    const userId = ctx.session.user.id;
    const { fullName, bio } = parsedInput;

    // Update user profile
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { fullName, bio },
    // });

    return {
      success: true,
      message: "Profil mis à jour avec succès",
    };
  });

// ============================================================================
// EXAMPLE 3: Admin Action (Create/Update - Requires Editor/Admin Role)
// ============================================================================

const createBlogPostSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  content: z.string().min(20, "Le contenu doit contenir au moins 20 caractères"),
  categoryId: z.string().uuid("ID de catégorie invalide"),
  status: z.enum(["draft", "published"]),
  tags: z.array(z.string()).optional(),
});

export const createBlogPost = writeAction
  .metadata({
    actionName: "create-blog-post",
    // Auto-detected cache tags: ['blog', 'stats']
    // Override if needed:
    // cacheTags: ["blog", "blog-posts", "stats"],
  })
  .inputSchema(createBlogPostSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { title, content, categoryId, status, tags } = parsedInput;
    const authorId = ctx.session.user.id;

    // Check if user is editor - force draft status
    const userRole = (ctx.session.user as any).role;
    const finalStatus = userRole === "editor" ? "draft" : status;

    // Create blog post
    // const post = await prisma.blogPost.create({
    //   data: {
    //     title,
    //     content,
    //     categoryId,
    //     status: finalStatus,
    //     authorId,
    //   },
    // });

    // Cache tags 'blog' and 'stats' are automatically invalidated on success

    return {
      success: true,
      message: "Article créé avec succès",
      // postId: post.id,
    };
  });

// ============================================================================
// EXAMPLE 4: Delete Action (Requires Admin/Super Admin Role)
// ============================================================================

const deletePostSchema = z.object({
  postId: z.string().uuid("ID d'article invalide"),
});

export const deleteBlogPost = deleteAction
  .metadata({
    actionName: "delete-blog-post",
    // Auto-detected: ['blog', 'stats']
  })
  .inputSchema(deletePostSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { postId } = parsedInput;

    // Only admins and super admins can execute this
    // Viewers and editors are automatically blocked

    // Delete the post
    // await prisma.blogPost.delete({
    //   where: { id: postId },
    // });

    return {
      success: true,
      message: "Article supprimé avec succès",
    };
  });

// ============================================================================
// EXAMPLE 5: Super Admin Action (Critical Operations)
// ============================================================================

const updateSystemSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  allowRegistrations: z.boolean().optional(),
  maxUploadSize: z.number().positive().optional(),
});

export const updateSystemSettings = superAdminAction
  .metadata({
    actionName: "update-system-settings",
    cacheTags: ["system", "settings", "stats"],
  })
  .inputSchema(updateSystemSettingsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { maintenanceMode, allowRegistrations, maxUploadSize } = parsedInput;

    // Only super admins can access this action
    // Update system settings
    // await prisma.systemSettings.update({ ... });

    return {
      success: true,
      message: "Paramètres système mis à jour",
    };
  });

// ============================================================================
// EXAMPLE 6: Editor Action (with userRole in Context)
// ============================================================================

const createDraftSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export const createDraft = editorAction
  .metadata({
    actionName: "create-draft",
  })
  .inputSchema(createDraftSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { title, content } = parsedInput;

    // ctx.userRole is available: "editor" | "admin" | "super_admin"
    const authorId = ctx.session.user.id;
    const role = ctx.userRole;

    // Editors can only create drafts
    // const post = await prisma.blogPost.create({
    //   data: {
    //     title,
    //     content,
    //     status: "draft", // Always draft for editors
    //     authorId,
    //   },
    // });

    return {
      success: true,
      message: role === "editor"
        ? "Brouillon créé (soumis pour révision)"
        : "Brouillon créé",
    };
  });

// ============================================================================
// EXAMPLE 7: Action Without Input Schema (No Parameters)
// ============================================================================

export const refreshDashboardStats = adminAction
  .metadata({
    actionName: "refresh-dashboard-stats",
    cacheTags: ["stats"],
  })
  // No .inputSchema() needed when action takes no parameters
  .action(async ({ ctx }) => {
    // Refresh stats calculation
    // const stats = await calculateDashboardStats();

    return {
      success: true,
      message: "Statistiques actualisées",
      // stats,
    };
  });

// ============================================================================
// EXAMPLE 8: Action with Explicit Error Handling
// ============================================================================

const sendContactMessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
});

export const sendContactMessage = actionClient
  .metadata({
    actionName: "send-contact-message",
  })
  .inputSchema(sendContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const { name, email, subject, message } = parsedInput;

    try {
      // Save to database
      // await prisma.contactMessage.create({ ... });

      // Send email notification
      // await sendEmail({ ... });

      return {
        success: true,
        message: "Message envoyé avec succès. Nous vous répondrons bientôt.",
      };
    } catch (error) {
      // Errors are automatically handled by handleServerError in lib/safe-action.ts
      // Only ActionError and AuthError messages are exposed to client
      // All other errors return DEFAULT_SERVER_ERROR_MESSAGE
      throw new Error("Erreur lors de l'envoi du message");
    }
  });

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

/**
 * ✅ DO:
 * - Use .inputSchema() instead of .schema()
 * - Always include .metadata({ actionName: "..." })
 * - Choose the right action client for your use case
 * - Use descriptive action names (e.g., "create-blog-post", not "create")
 * - Let auto-detection handle cache tags when possible
 * - Trust middleware to handle authentication/authorization
 * - Return consistent response objects ({ success, message, data })
 *
 * ❌ DON'T:
 * - Don't use .schema() (deprecated in v8)
 * - Don't forget metadata
 * - Don't use authActionClient for operations that need role checks
 * - Don't manually check permissions (use the right client instead)
 * - Don't expose sensitive error details (they're masked automatically)
 * - Don't bypass rate limiting for write operations
 *
 * 📊 Cache Tags:
 * - Auto-detected from action names
 * - 'stats' is added automatically for write operations
 * - Read operations (get*, list*, fetch*, find*) skip cache invalidation
 * - Override with explicit cacheTags in metadata if needed
 *
 * 🔒 Security:
 * - actionClient: Public (no auth)
 * - authActionClient: Requires login
 * - writeAction: Blocks viewers
 * - deleteAction: Blocks viewers and editors
 * - adminAction: Requires admin/editor/super_admin
 * - superAdminAction: Requires super_admin only
 * - editorAction: Requires editor/admin/super_admin (adds userRole to context)
 */

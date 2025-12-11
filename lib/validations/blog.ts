import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  color: z.string().min(1, "La couleur est requise").default("#10B981"),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.and(
  z.object({
    id: z.number().int().positive("L'ID de la catégorie est requis"),
  })
);

// Schema pour les opérations nécessitant uniquement l'ID (suppression, etc.)
export const categoryIdSchema = z.object({
  id: z.number().int().positive("L'ID de la catégorie est requis"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const createTagSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  color: z.string().min(1, "La couleur est requise").default("#10B981"),
});

export const updateTagSchema = createTagSchema.and(
  z.object({
    id: z.number().int().positive("L'ID du tag est requis"),
  })
);

// Schema pour les opérations nécessitant uniquement l'ID du tag
export const tagIdSchema = z.object({
  id: z.number().int().positive("L'ID du tag est requis"),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;

// Blog Post Schemas
export const createBlogPostSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  featuredImage: z.string().optional().transform(val => val === "" || !val ? undefined : val).refine(
    (val) => !val || /^https?:\/\/.+/.test(val),
    { message: "URL d'image invalide" }
  ),
  authorName: z.string().min(2, "Le nom de l'auteur est requis"),
  authorPosition: z.string().optional(),
  categoryId: z.number().int().positive("Sélectionnez une catégorie"),
  tagIds: z.array(z.number().int().positive()).optional().default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isFeatured: z.boolean().default(false),
  readTimeMinutes: z.number().int().positive().default(5),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.and(
  z.object({
    id: z.number().int().positive("L'ID de l'article est requis"),
  })
);

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;



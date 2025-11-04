import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  color: z.string().default("#10B981"),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const createTagSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  color: z.string().default("#10B981"),
});

export const updateTagSchema = createTagSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;

// Blog Post Schemas
export const createBlogPostSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  featuredImage: z.string().url("URL d'image invalide").optional().or(z.literal("")),
  authorName: z.string().min(2, "Le nom de l'auteur est requis"),
  authorPosition: z.string().optional(),
  categoryId: z.number().int().positive("Sélectionnez une catégorie"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isFeatured: z.boolean().default(false),
  readTimeMinutes: z.number().int().positive().default(5),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;



import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  featuredImage: z.string().optional(),
  authorName: z.string().min(2),
  authorPosition: z.string().optional(),
  categoryId: z.number().int().positive(),
  status: z.string().default("draft"),
  isFeatured: z.boolean().default(false),
  readTimeMinutes: z.number().int().positive().default(5),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;



import { z } from "zod";

export const createMediaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  mediaType: z.string().min(1),
  fileUrl: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  fileSize: z.number().int().optional(),
  mimeType: z.string().optional(),
  altText: z.string().optional(),
  eventId: z.number().int().positive().optional(),
  album: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  uploadedByName: z.string().optional(),
});

export const updateMediaSchema = createMediaSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateMediaInput = z.infer<typeof createMediaSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;



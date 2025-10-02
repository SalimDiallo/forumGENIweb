import { z } from "zod";

export const createVideoTestimonialSchema = z.object({
  name: z.string().min(1),
  position: z.string().optional(),
  company: z.string().optional(),
  graduationYear: z.number().int().optional(),
  videoUrl: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  quote: z.string().optional(),
  fullTranscript: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateVideoTestimonialSchema = createVideoTestimonialSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateVideoTestimonialInput = z.infer<typeof createVideoTestimonialSchema>;
export type UpdateVideoTestimonialInput = z.infer<typeof updateVideoTestimonialSchema>;



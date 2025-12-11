import { z } from "zod";
import { isValidYouTubeUrl } from '@/lib/services/youtube';

/**
 * Validation schema for creating/editing video testimonials
 */
export const videoTestimonialSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  position: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  graduationYear: z.coerce
    .number()
    .int()
    .min(1900, 'Année invalide')
    .max(new Date().getFullYear() + 10, 'Année invalide')
    .optional()
    .nullable(),
  videoUrl: z
    .string()
    .min(1, 'Le lien YouTube est requis')
    .refine(
      (url) => isValidYouTubeUrl(url),
      'Le lien doit être une URL YouTube valide (youtube.com/watch?v=..., youtu.be/..., etc.)'
    ),
  thumbnailUrl: z.string().url('URL invalide').optional().nullable().or(z.literal('')),
  quote: z.string().optional().nullable(),
  fullTranscript: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type VideoTestimonialInput = z.infer<typeof videoTestimonialSchema>;

// Legacy export for backward compatibility
export const createVideoTestimonialSchema = videoTestimonialSchema;
export type CreateVideoTestimonialInput = VideoTestimonialInput;

/**
 * Schema for updating video testimonial (includes ID)
 */
export const updateVideoTestimonialSchema = videoTestimonialSchema.extend({
  id: z.number().int().positive(),
});

export type UpdateVideoTestimonialInput = z.infer<typeof updateVideoTestimonialSchema>;

/**
 * Schema for deleting video testimonial
 */
export const deleteVideoTestimonialSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteVideoTestimonialInput = z.infer<typeof deleteVideoTestimonialSchema>;

/**
 * Schema for bulk deleting video testimonials
 */
export const bulkDeleteTestimonialsSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, 'Sélectionnez au moins un témoignage'),
});

export type BulkDeleteTestimonialsInput = z.infer<typeof bulkDeleteTestimonialsSchema>;

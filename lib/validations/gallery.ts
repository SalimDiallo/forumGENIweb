import { z } from "zod";
import { isValidYouTubeUrl } from '@/lib/services/youtube';

// =====================================
// VIDEO GALLERY SCHEMAS
// =====================================

/**
 * Validation schema for YouTube video gallery items
 * No API needed - just paste unlisted video links
 */
export const videoGallerySchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional().nullable(),
  videoUrl: z
    .string()
    .min(1, 'Le lien YouTube est requis')
    .refine(
      (url) => isValidYouTubeUrl(url),
      'Le lien doit être une URL YouTube valide'
    ),
  thumbnailUrl: z.string().url('URL invalide').optional().nullable().or(z.literal('')),
  eventId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  eventName: z.string().optional().nullable(),
  eventYear: z.coerce
    .number()
    .int()
    .min(2000, 'Année invalide')
    .max(new Date().getFullYear() + 10, 'Année invalide')
    .optional()
    .nullable(),
  category: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export type VideoGalleryInput = z.infer<typeof videoGallerySchema>;

export const updateVideoGallerySchema = videoGallerySchema.extend({
  id: z.number().int().positive(),
});

export type UpdateVideoGalleryInput = z.infer<typeof updateVideoGallerySchema>;

export const deleteVideoGallerySchema = z.object({
  id: z.number().int().positive(),
});

// =====================================
// PHOTO GALLERY SCHEMAS
// =====================================

/**
 * Validation schema for Google Drive photo gallery items
 * No API needed - just paste direct Drive image links
 *
 * Format attendu: https://drive.google.com/uc?export=view&id=FILE_ID
 * ou https://drive.google.com/file/d/FILE_ID/view
 */
export const photoGallerySchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional().nullable(),
  imageUrl: z
    .string()
    .min(1, 'Le lien de l\'image est requis')
    .url('Le lien doit être une URL valide')
    .refine(
      (url) => url.includes('drive.google.com') || url.includes('googleusercontent.com'),
      'Le lien doit être une URL Google Drive valide'
    ),
  thumbnailUrl: z.string().url('URL invalide').optional().nullable().or(z.literal('')),
  eventId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  eventName: z.string().optional().nullable(),
  eventYear: z.coerce
    .number()
    .int()
    .min(2000, 'Année invalide')
    .max(new Date().getFullYear() + 10, 'Année invalide')
    .optional()
    .nullable(),
  category: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export type PhotoGalleryInput = z.infer<typeof photoGallerySchema>;

export const updatePhotoGallerySchema = photoGallerySchema.extend({
  id: z.number().int().positive(),
});

export type UpdatePhotoGalleryInput = z.infer<typeof updatePhotoGallerySchema>;

export const deletePhotoGallerySchema = z.object({
  id: z.number().int().positive(),
});

// =====================================
// BULK DELETE SCHEMAS
// =====================================

export const bulkDeleteVideosSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, 'Sélectionnez au moins une vidéo'),
});

export const bulkDeletePhotosSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, 'Sélectionnez au moins une photo'),
});

// =====================================
// HELPER FUNCTION
// =====================================

/**
 * Extract Google Drive file ID from various URL formats
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;

  // Format 1: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // Format 2: https://drive.google.com/uc?export=view&id=FILE_ID
  const ucMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) return ucMatch[1];

  // Format 3: Already just an ID
  if (/^[a-zA-Z0-9_-]{28,}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Get direct Google Drive image URL from file ID or URL
 */
export function getDriveImageUrl(fileIdOrUrl: string): string | null {
  const fileId = extractDriveFileId(fileIdOrUrl);
  if (!fileId) return null;

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Get Google Drive thumbnail URL
 */
export function getDriveThumbnailUrl(fileIdOrUrl: string, size: number = 800): string | null {
  const fileId = extractDriveFileId(fileIdOrUrl);
  if (!fileId) return null;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

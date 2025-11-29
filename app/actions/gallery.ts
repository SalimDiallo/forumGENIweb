"use server";

import { actionClient } from "@/lib/safe-action";
import { getGalleryStructure, getAllGalleryMedia, getFilteredGalleryMedia } from "@/lib/services/google-drive";
import { getYouTubeVideos, getFilteredYouTubeVideos } from "@/lib/services/youtube";
import { z } from "zod";
import type { GalleryMedia } from "@/lib/types/gallery";

/**
 * Get complete gallery structure (years > categories > events > media)
 */
export const getGalleryData = actionClient
  .metadata({ actionName: "get-gallery-data" })
  .action(async () => {
    const rootFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error("GOOGLE_DRIVE_GALLERY_FOLDER_ID is not configured");
    }

    const structure = await getGalleryStructure(rootFolderId);
    return { structure };
  });

/**
 * Get all gallery media flattened (for display)
 */
export const getAllMedia = actionClient
  .metadata({ actionName: "get-all-gallery-media" })
  .action(async () => {
    const rootFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error("GOOGLE_DRIVE_GALLERY_FOLDER_ID is not configured");
    }

    const media = await getAllGalleryMedia(rootFolderId);
    return { media };
  });

/**
 * Get filtered gallery media
 */
const filterSchema = z.object({
  year: z.string().optional(),
  category: z.string().optional(),
  event: z.string().optional(),
});

export const getFilteredMedia = actionClient
  .metadata({ actionName: "get-filtered-gallery-media" })
  .schema(filterSchema)
  .action(async ({ parsedInput }) => {
    const rootFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error("GOOGLE_DRIVE_GALLERY_FOLDER_ID is not configured");
    }

    const media = await getFilteredGalleryMedia(rootFolderId, parsedInput);
    return { media };
  });

/**
 * Get gallery categories (for filter dropdown)
 */
export const getGalleryCategories = actionClient
  .metadata({ actionName: "get-gallery-categories" })
  .action(async () => {
    const rootFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error("GOOGLE_DRIVE_GALLERY_FOLDER_ID is not configured");
    }

    const structure = await getGalleryStructure(rootFolderId);

    // Extract unique categories across all years
    const categoriesMap = new Map<string, number>();

    structure.years.forEach(year => {
      year.categories.forEach(category => {
        const current = categoriesMap.get(category.name) || 0;
        categoriesMap.set(category.name, current + category.totalMediaCount);
      });
    });

    const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    }));

    // Add "all" category
    categories.unshift({
      id: 'all',
      name: 'Tout',
      count: structure.totalMedia,
    });

    return { categories };
  });

/**
 * Combine media from Google Drive (images) and YouTube (videos)
 */
async function getCombinedMedia(rootFolderId: string) {
  // Get images from Drive in parallel with YouTube videos
  const [driveImages, youtubeVideos] = await Promise.all([
    getAllGalleryMedia(rootFolderId),
    getYouTubeVideos().catch(err => {
      console.error('Error fetching YouTube videos:', err);
      return []; // Fallback to empty array if YouTube fails
    })
  ]);

  // Mark source for each media
  const imagesWithSource = driveImages.map(img => ({ ...img, source: 'drive' as const }));
  const videosWithSource = youtubeVideos.map((vid: any) => ({ ...vid, source: 'youtube' as const }));

  // Combine both sources
  const allMedia = [...imagesWithSource, ...videosWithSource];

  return allMedia;
}

/**
 * Get complete gallery data (media + categories) in one optimized call
 * Combines Google Drive images and YouTube videos
 * This avoids duplicate API calls and reduces load time
 */
export const getCompleteGalleryData = actionClient
  .metadata({ actionName: "get-complete-gallery-data" })
  .action(async () => {
    const rootFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error("GOOGLE_DRIVE_GALLERY_FOLDER_ID is not configured");
    }

    // Get combined media from Drive (images) and YouTube (videos)
    const media = await getCombinedMedia(rootFolderId);

    // Get structure from Drive for categories (cache should be hit)
    const structure = await getGalleryStructure(rootFolderId);

    // Extract unique categories across all media (Drive structure + YouTube metadata)
    const categoriesMap = new Map<string, number>();

    // Add categories from Drive structure
    structure.years.forEach(year => {
      year.categories.forEach(category => {
        const current = categoriesMap.get(category.name) || 0;
        categoriesMap.set(category.name, current + category.totalMediaCount);
      });
    });

    // Add categories from YouTube videos
    media.forEach((item: any) => {
      if (item.source === 'youtube' && item.category) {
        const current = categoriesMap.get(item.category) || 0;
        categoriesMap.set(item.category, current + 1);
      }
    });

    const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    }));

    // Add "all" category
    categories.unshift({
      id: 'all',
      name: 'Tout',
      count: media.length,
    });

    return { media, categories };
  });

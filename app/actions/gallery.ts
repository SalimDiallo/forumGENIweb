"use server";

import { actionClient } from "@/lib/safe-action";
import { getGalleryStructure, getAllGalleryMedia, getFilteredGalleryMedia } from "@/lib/services/google-drive";
import { z } from "zod";

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
 * Get complete gallery data (media + categories) in one optimized call
 * This avoids duplicate API calls and reduces load time
 */
export const getCompleteGalleryData = actionClient
  .metadata({ actionName: "get-complete-gallery-data" })
  .action(async () => {
    const rootFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;

    if (!rootFolderId) {
      throw new Error("GOOGLE_DRIVE_GALLERY_FOLDER_ID is not configured");
    }

    // Get all media (this internally gets the structure and caches it)
    const media = await getAllGalleryMedia(rootFolderId);

    // Get structure from cache (should hit cache since getAllGalleryMedia called it)
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

    return { media, categories };
  });

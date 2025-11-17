/**
 * Google Drive Service
 * Handles all interactions with Google Drive API using Service Account
 */

import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';
import type { GalleryStructure, GalleryYear, GalleryCategory, GalleryEvent, GalleryMedia, MediaType } from '@/lib/types/gallery';

// Uniquement les images réellement affichables dans la galerie principale (exclus SVG)
const DISPLAYABLE_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  // PAS de SVG ici (pas "image/svg+xml")
];

const ALL_IMAGE_MIME_TYPES = [
  ...DISPLAYABLE_IMAGE_MIME_TYPES,
  'image/svg+xml', // SVG seulement si besoin d'afficher dans un contexte sécurisé (pas galerie)
];

const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/webm',
];

// Configuration pour limiter les requêtes parallèles (éviter rate limiting Google API)
const MAX_CONCURRENT_REQUESTS = 10;

/**
 * Batch processor pour limiter le nombre de requêtes parallèles
 */
async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number = MAX_CONCURRENT_REQUESTS
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}

/**
 * Initialize Google Drive API with Service Account credentials
 */
function getDriveClient() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Error initializing Google Drive client:', error);
    throw new Error('Failed to initialize Google Drive client');
  }
}

/**
 * Determine if a file is a displayable image or a video (pour la galerie)
 */
function getMediaType(mimeType: string): MediaType | null {
  if (DISPLAYABLE_IMAGE_MIME_TYPES.includes(mimeType)) return 'image';
  if (VIDEO_MIME_TYPES.includes(mimeType)) return 'video';
  return null;
}

/**
 * Retourne le vrai lien d'affichage direct de l'image sur Google Drive
 * Pour les images, utilise le format uc?export=view qui est plus standard
 * Pour les vidéos, utiliser le preview.
 *
 * IMPORTANT: Les fichiers doivent être partagés avec le compte de service ou être publics
 */
function getFileUrl(fileId: string, mimeType?: string): string {
  if (mimeType && VIDEO_MIME_TYPES.includes(mimeType)) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  // Format standard Google Drive pour affichage direct
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Get thumbnail URL for a file
 * Utilise l'API thumbnail de Google Drive pour générer des aperçus optimisés
 */
function getThumbnailUrl(fileId: string, size: number = 800): string {
  // Format API thumbnail Google Drive
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/**
 * List all folders in a given parent folder
 */
async function listFolders(parentId: string): Promise<any[]> {
  const drive = getDriveClient();

  try {
    const response = await drive.files.list({
      q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, createdTime, modifiedTime)',
      orderBy: 'name desc',
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error listing folders:', error);
    return [];
  }
}

/**
 * List all displayable media files in a folder (ignore SVG)
 * NB: SVG files ne seront PAS inclus ici.
 */
async function listMediaFiles(folderId: string): Promise<GalleryMedia[]> {
  const drive = getDriveClient();

  try {
    // Build MIME type filter (pour la galerie: images affichables seulement, PAS SVG)
    const displayableMimeTypes = [...DISPLAYABLE_IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES]
      .map(type => `mimeType='${type}'`)
      .join(' or ');

    const response = await drive.files.list({
      q: `'${folderId}' in parents and (${displayableMimeTypes}) and trashed=false`,
      fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink)',
      orderBy: 'createdTime desc',
      pageSize: 1000,
    });

    const files = response.data.files || [];

    return files
      .map(file => {
        const mediaType = getMediaType(file.mimeType || '');
        if (!mediaType) return null;

        // Lien thumbnail (pour aperçu rapide, petit format)
        const thumbnailUrl = getThumbnailUrl(file.id || '');

        // Pour l'affichage dans la galerie : on veut le vrai lien image (pour balise <img>)
        const url = getFileUrl(file.id || '', file.mimeType || '');

        const mediaItem: GalleryMedia = {
          id: file.id || '',
          name: file.name || '',
          type: mediaType,
          url: url,
          thumbnailUrl: thumbnailUrl,
          mimeType: file.mimeType || '',
          size: parseInt(file.size || '0'),
          createdTime: file.createdTime || '',
          modifiedTime: file.modifiedTime || '',
        };

        return mediaItem;
      })
      .filter((item): item is GalleryMedia => item !== null);
  } catch (error) {
    console.error('Error listing media files:', error);
    return [];
  }
}

/**
 * Get full gallery structure from Google Drive (internal, non-cached version)
 * Structure: Root Folder > Year Folders > Category Folders > Event Folders > Media Files
 * Seuls les médias "displayable" (images previewables, no SVG) sont inclus.
 */
async function getGalleryStructureInternal(rootFolderId: string): Promise<GalleryStructure> {
  try {
    // 1. Get year folders (e.g., 2024, 2025)
    const yearFolders = await listFolders(rootFolderId);

    // 2. OPTIMISATION: Utiliser batchProcess pour limiter les requêtes parallèles
    const years = await batchProcess(yearFolders, async (yearFolder) => {
      const categoryFolders = await listFolders(yearFolder.id);

      // 3. OPTIMISATION: Paralléliser les catégories avec limite
      const categories = await batchProcess(categoryFolders, async (categoryFolder) => {
        const eventFolders = await listFolders(categoryFolder.id);

        // 4. OPTIMISATION: Paralléliser les événements avec limite
        const events = await batchProcess(eventFolders, async (eventFolder) => {
          const mediaFiles = await listMediaFiles(eventFolder.id);

          return {
            id: eventFolder.id,
            name: eventFolder.name,
            media: mediaFiles,
            mediaCount: mediaFiles.length,
          };
        });

        const categoryMediaCount = events.reduce((sum, event) => sum + event.mediaCount, 0);

        return {
          id: categoryFolder.id,
          name: categoryFolder.name,
          events,
          eventCount: events.length,
          totalMediaCount: categoryMediaCount,
        };
      });

      const yearMediaCount = categories.reduce((sum, cat) => sum + cat.totalMediaCount, 0);

      return {
        id: yearFolder.id,
        year: yearFolder.name,
        categories,
        categoryCount: categories.length,
        totalMediaCount: yearMediaCount,
      };
    });

    // Calculer les totaux
    const totalCategories = years.reduce((sum, year) => sum + year.categoryCount, 0);
    const totalEvents = years.reduce((sum, year) =>
      sum + year.categories.reduce((catSum, cat) => catSum + cat.eventCount, 0), 0
    );
    const totalMedia = years.reduce((sum, year) => sum + year.totalMediaCount, 0);

    return {
      years,
      totalYears: years.length,
      totalCategories,
      totalEvents,
      totalMedia,
    };
  } catch (error) {
    console.error('Error getting gallery structure:', error);
    throw new Error('Failed to fetch gallery structure from Google Drive');
  }
}

/**
 * CACHED: Get full gallery structure from Google Drive
 * Cache de 1 heure (3600 secondes)
 */
export const getGalleryStructure = unstable_cache(
  async (rootFolderId: string) => getGalleryStructureInternal(rootFolderId),
  ['gallery-structure'],
  {
    revalidate: 3600, // Cache pendant 1 heure
    tags: ['gallery', 'gallery-structure'],
  }
);

/**
 * Get all displayable media files flattened (internal, for easier filtering/display)
 */
async function getAllGalleryMediaInternal(rootFolderId: string) {
  const structure = await getGalleryStructureInternal(rootFolderId);
  const allMedia: Array<GalleryMedia & { year: string; category: string; event: string }> = [];

  for (const year of structure.years) {
    for (const category of year.categories) {
      for (const event of category.events) {
        for (const media of event.media) {
          allMedia.push({
            ...media,
            year: year.year,
            category: category.name,
            event: event.name,
          });
        }
      }
    }
  }

  return allMedia;
}

/**
 * CACHED: Get all displayable media files flattened
 * Cache de 1 heure (3600 secondes)
 */
export const getAllGalleryMedia = unstable_cache(
  async (rootFolderId: string) => getAllGalleryMediaInternal(rootFolderId),
  ['gallery-all-media'],
  {
    revalidate: 3600,
    tags: ['gallery', 'gallery-media'],
  }
);

/**
 * Get displayable media files filtered by year, category, or event
 * Utilise le cache de getAllGalleryMedia pour éviter des appels API supplémentaires
 */
export async function getFilteredGalleryMedia(
  rootFolderId: string,
  filters?: {
    year?: string;
    category?: string;
    event?: string;
  }
) {
  // Utilise la version cachée pour bénéficier du cache
  const allMedia = await getAllGalleryMedia(rootFolderId);

  return allMedia.filter(item => {
    if (filters?.year && item.year !== filters.year) return false;
    if (filters?.category && item.category !== filters.category) return false;
    if (filters?.event && item.event !== filters.event) return false;
    return true;
  });
}

/**
 * Fonction utilitaire pour invalider le cache de la galerie
 * À utiliser quand de nouveaux médias sont ajoutés sur Drive
 */
export { revalidateTag } from 'next/cache';

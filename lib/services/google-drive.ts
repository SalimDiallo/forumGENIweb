/**
 * Google Drive Service
 * Handles all interactions with Google Drive API using Service Account
 */

import { google } from 'googleapis';
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
 * Retourne le vrai lien d'affichage direct de l'image sur Google Drive (non le thumbnail)
 * Pour les images, on crée l'URL public viewer/export qui retourne l'image full-size pour l'affichage.
 * Pour les vidéos, utiliser le preview.
 */
function getFileUrl(fileId: string, mimeType?: string): string {
  if (mimeType && VIDEO_MIME_TYPES.includes(mimeType)) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  // Utiliser l'URL de thumbnail haute résolution comme source principale
  // Plus fiable que uc?export=view pour les fichiers avec permissions
  return `https://lh3.googleusercontent.com/d/${fileId}=w2000`;
}

/**
 * Get thumbnail URL for a file
 * Utilise l'API googleusercontent qui fonctionne mieux avec les permissions Service Account
 */
function getThumbnailUrl(fileId: string, size: number = 1920): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${size}`;
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
 * Get full gallery structure from Google Drive
 * Structure: Root Folder > Year Folders > Category Folders > Event Folders > Media Files
 * Seuls les médias "displayable" (images previewables, no SVG) sont inclus.
 */
export async function getGalleryStructure(rootFolderId: string): Promise<GalleryStructure> {
  try {
    const years: GalleryYear[] = [];
    let totalCategories = 0;
    let totalEvents = 0;
    let totalMedia = 0;

    // 1. Get year folders (e.g., 2024, 2025)
    const yearFolders = await listFolders(rootFolderId);

    for (const yearFolder of yearFolders) {
      const categories: GalleryCategory[] = [];
      let yearMediaCount = 0;

      // 2. Get category folders (e.g., Forum, Workshop, Networking)
      const categoryFolders = await listFolders(yearFolder.id);

      for (const categoryFolder of categoryFolders) {
        const events: GalleryEvent[] = [];
        let categoryMediaCount = 0;

        // 3. Get event folders (e.g., Forum Spring 2025)
        const eventFolders = await listFolders(categoryFolder.id);

        for (const eventFolder of eventFolders) {
          // 4. Get displayable media files in event folder
          const mediaFiles = await listMediaFiles(eventFolder.id);

          events.push({
            id: eventFolder.id,
            name: eventFolder.name,
            media: mediaFiles,
            mediaCount: mediaFiles.length,
          });

          categoryMediaCount += mediaFiles.length;
          totalEvents++;
        }

        categories.push({
          id: categoryFolder.id,
          name: categoryFolder.name,
          events,
          eventCount: events.length,
          totalMediaCount: categoryMediaCount,
        });

        yearMediaCount += categoryMediaCount;
        totalCategories++;
      }

      years.push({
        id: yearFolder.id,
        year: yearFolder.name,
        categories,
        categoryCount: categories.length,
        totalMediaCount: yearMediaCount,
      });

      totalMedia += yearMediaCount;
    }

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
 * Get all displayable media files flattened (for easier filtering/display)
 */
export async function getAllGalleryMedia(rootFolderId: string) {
  const structure = await getGalleryStructure(rootFolderId);
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
 * Get displayable media files filtered by year, category, or event
 */
export async function getFilteredGalleryMedia(
  rootFolderId: string,
  filters?: {
    year?: string;
    category?: string;
    event?: string;
  }
) {
  const allMedia = await getAllGalleryMedia(rootFolderId);

  return allMedia.filter(item => {
    if (filters?.year && item.year !== filters.year) return false;
    if (filters?.category && item.category !== filters.category) return false;
    if (filters?.event && item.event !== filters.event) return false;
    return true;
  });
}

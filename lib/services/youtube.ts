/**
 * YouTube Service
 * Handles YouTube video utilities and API interactions
 */

import { unstable_cache } from 'next/cache';
import type { GalleryMedia } from '@/lib/types/gallery';

// =====================================
// UTILITY FUNCTIONS (NO API NEEDED)
// =====================================

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Remove whitespace
  url = url.trim();

  // Pattern 1: youtube.com/watch?v=VIDEO_ID
  const watchPattern = /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
  const watchMatch = url.match(watchPattern);
  if (watchMatch) return watchMatch[1];

  // Pattern 2: youtu.be/VIDEO_ID
  const shortPattern = /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const shortMatch = url.match(shortPattern);
  if (shortMatch) return shortMatch[1];

  // Pattern 3: youtube.com/embed/VIDEO_ID
  const embedPattern = /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const embedMatch = url.match(embedPattern);
  if (embedMatch) return embedMatch[1];

  // Pattern 4: youtube.com/v/VIDEO_ID
  const vPattern = /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/;
  const vMatch = url.match(vPattern);
  if (vMatch) return vMatch[1];

  // If the string is already just an ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Get YouTube embed URL from video ID or full URL
 */
export function getYouTubeEmbedUrl(videoUrlOrId: string): string | null {
  const videoId = extractYouTubeVideoId(videoUrlOrId);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Get YouTube thumbnail URL from video ID or full URL
 * Quality options: maxresdefault (1920x1080), sddefault (640x480), hqdefault (480x360), mqdefault (320x180), default (120x90)
 */
export function getYouTubeThumbnailUrl(
  videoUrlOrId: string,
  quality: 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default' = 'hqdefault'
): string | null {
  const videoId = extractYouTubeVideoId(videoUrlOrId);
  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Validate if a string is a valid YouTube URL or video ID
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Get YouTube watch URL from video ID
 */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// =====================================
// API FUNCTIONS (REQUIRES API KEY)
// =====================================

/**
 * YouTube API configuration
 */
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Get YouTube API key from environment
 */
function getYouTubeApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is not configured in environment variables');
  }
  return apiKey;
}

/**
 * Get YouTube channel ID from environment
 */
function getYouTubeChannelId(): string {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
    throw new Error('YOUTUBE_CHANNEL_ID is not configured in environment variables');
  }
  return channelId;
}

/**
 * Extract event name and metadata from video description
 * Format attendu dans la description: #EventName #Category #Year
 * Exemple: "Belle vidéo du forum #ForumSpring2025 #Forum #2025"
 */
function extractMetadataFromDescription(
  title: string,
  description: string,
  publishedAt: string
): {
  event: string;
  category: string;
  year: string;
} {
  // Extract hashtags from description
  const hashtags = description.match(/#[\w\u00C0-\u017F]+/g) || [];

  // Try to find year (4 digits or from hashtags)
  let year = '';
  const yearMatch = description.match(/#(\d{4})/);
  if (yearMatch) {
    year = yearMatch[1];
  } else {
    // Fallback to published year
    year = new Date(publishedAt).getFullYear().toString();
  }

  // Try to find category (common keywords)
  const categoryKeywords = ['forum', 'conference', 'workshop', 'atelier', 'séminaire', 'webinar'];
  let category = 'Événements'; // Default

  for (const keyword of categoryKeywords) {
    const found = hashtags.find(tag =>
      tag.toLowerCase().includes(keyword)
    );
    if (found) {
      category = found.replace('#', '').charAt(0).toUpperCase() + found.slice(2);
      break;
    }
  }

  // Extract event name (use title or first meaningful hashtag)
  let event = title;
  const meaningfulHashtags = hashtags.filter(tag =>
    !tag.match(/\d{4}/) && // Not a year
    !categoryKeywords.some(kw => tag.toLowerCase().includes(kw)) // Not a category
  );

  if (meaningfulHashtags.length > 0) {
    event = meaningfulHashtags[0].replace('#', '').replace(/([A-Z])/g, ' $1').trim();
  }

  return { event, category, year };
}

/**
 * Fetch all videos from a YouTube channel (internal, non-cached version)
 */
async function getYouTubeVideosInternal(): Promise<GalleryMedia[]> {
  const apiKey = getYouTubeApiKey();
  const channelId = getYouTubeChannelId();

  try {
    // Step 1: Get the "uploads" playlist ID for the channel
    const channelResponse = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    if (!channelResponse.ok) {
      throw new Error(`YouTube API error: ${channelResponse.status} ${channelResponse.statusText}`);
    }

    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      console.warn('No channel found with the provided ID');
      return [];
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Step 2: Get all videos from the uploads playlist
    let allVideos: any[] = [];
    let nextPageToken: string | undefined;

    do {
      const playlistUrl = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
      playlistUrl.searchParams.set('part', 'snippet,contentDetails');
      playlistUrl.searchParams.set('playlistId', uploadsPlaylistId);
      playlistUrl.searchParams.set('maxResults', '50'); // Max allowed per page
      playlistUrl.searchParams.set('key', apiKey);

      if (nextPageToken) {
        playlistUrl.searchParams.set('pageToken', nextPageToken);
      }

      const playlistResponse = await fetch(playlistUrl.toString());

      if (!playlistResponse.ok) {
        throw new Error(`YouTube API error: ${playlistResponse.status} ${playlistResponse.statusText}`);
      }

      const playlistData = await playlistResponse.json();
      allVideos = allVideos.concat(playlistData.items || []);
      nextPageToken = playlistData.nextPageToken;

    } while (nextPageToken);

    // Step 3: Transform to GalleryMedia format
    const galleryVideos: GalleryMedia[] = allVideos.map(item => {
      const snippet = item.snippet;
      const videoId = snippet.resourceId.videoId;

      const metadata = extractMetadataFromDescription(
        snippet.title,
        snippet.description || '',
        snippet.publishedAt
      );

      return {
        id: videoId,
        name: snippet.title,
        type: 'video' as const,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: snippet.thumbnails?.maxres?.url ||
                      snippet.thumbnails?.high?.url ||
                      snippet.thumbnails?.medium?.url ||
                      snippet.thumbnails?.default?.url,
        mimeType: 'video/youtube',
        size: 0, // YouTube doesn't provide file size via API
        createdTime: snippet.publishedAt,
        modifiedTime: snippet.publishedAt,
        // Add metadata for filtering
        ...metadata,
      } as GalleryMedia & { event: string; category: string; year: string };
    });

    return galleryVideos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw new Error('Failed to fetch videos from YouTube');
  }
}

/**
 * CACHED: Get all videos from YouTube channel
 * Cache de 1 heure (3600 secondes)
 */
export const getYouTubeVideos = unstable_cache(
  async () => getYouTubeVideosInternal(),
  ['youtube-videos'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['gallery', 'youtube-videos'],
  }
);

/**
 * Get videos filtered by event, category, or year
 */
export async function getFilteredYouTubeVideos(filters?: {
  event?: string;
  category?: string;
  year?: string;
}) {
  const allVideos = await getYouTubeVideos();

  return allVideos.filter((video: any) => {
    if (filters?.event && !video.event?.toLowerCase().includes(filters.event.toLowerCase())) {
      return false;
    }
    if (filters?.category && video.category !== filters.category) {
      return false;
    }
    if (filters?.year && video.year !== filters.year) {
      return false;
    }
    return true;
  });
}

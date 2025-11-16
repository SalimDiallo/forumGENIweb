/**
 * Types for Gallery with Google Drive integration
 */

export type MediaType = 'image' | 'video';

export interface GalleryMedia {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  size: number;
  createdTime: string;
  modifiedTime: string;
}

export interface GalleryEvent {
  id: string;
  name: string;
  media: GalleryMedia[];
  mediaCount: number;
}

export interface GalleryCategory {
  id: string;
  name: string;
  events: GalleryEvent[];
  eventCount: number;
  totalMediaCount: number;
}

export interface GalleryYear {
  id: string;
  year: string;
  categories: GalleryCategory[];
  categoryCount: number;
  totalMediaCount: number;
}

export interface GalleryStructure {
  years: GalleryYear[];
  totalYears: number;
  totalCategories: number;
  totalEvents: number;
  totalMedia: number;
}

/**
 * Flattened structure for easier display
 */
export interface GalleryItem {
  id: string;
  type: MediaType;
  src: string;
  thumbnail?: string;
  alt: string;
  title: string;
  year: string;
  category: string;
  event: string;
  mimeType: string;
  size: number;
  createdTime: string;
  tags: string[];
}

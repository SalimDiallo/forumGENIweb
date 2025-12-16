"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Video,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Play,
  Calendar,
  Tag,
  Search,
  ChevronDown,
  Compass,
  Grid,
} from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/services/youtube";
import { getDriveImageUrl, getDriveThumbnailUrl } from "@/lib/validations/gallery";

type VideoItem = {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  eventName: string | null;
  eventYear: number | null;
  category: string | null;
  isFeatured: boolean;
  viewCount: number;
};

type PhotoItem = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  eventName: string | null;
  eventYear: number | null;
  category: string | null;
  isFeatured: boolean;
  viewCount: number;
};

type GalleryClientProps = {
  videos: VideoItem[];
  photos: PhotoItem[];
  years: number[];
  categories: string[];
  selectedYear?: string;
  selectedCategory?: string;
  selectedType: string;
};

import { Marquee } from "@/components/ui/marquee";

// ... existing imports

export function GalleryClient({
  videos,
  photos,
  years,
  categories,
  selectedYear,
  selectedCategory,
  selectedType,
}: GalleryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/gallery?${params.toString()}`);
  };

  const openPhoto = (photo: PhotoItem, index: number) => {
    setSelectedPhoto(photo);
    setPhotoIndex(index);
  };

  const nextPhoto = () => {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
      setSelectedPhoto(photos[photoIndex + 1]);
    }
  };

  const prevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
      setSelectedPhoto(photos[photoIndex - 1]);
    }
  };

  const totalItems = videos.length + photos.length;

  // Prepare items for Marquee (mix of photos and videos, limited to 30 items for performance)
  const allMarqueeItems = [
    ...photos.map(p => ({ type: 'photo' as const, ...p, thumb: p.thumbnailUrl || getDriveThumbnailUrl(p.imageUrl, 400) })),
    ...videos.map(v => ({ type: 'video' as const, ...v, thumb: v.thumbnailUrl || getYouTubeThumbnailUrl(v.videoUrl, "hqdefault") }))
  ].sort(() => 0.5 - Math.random()).slice(0, 30);

  // Prepare all items for Explore Grid (randomized)
  const allExploreItems = [
    ...photos.map(p => ({ type: 'photo' as const, ...p, thumb: p.thumbnailUrl || getDriveThumbnailUrl(p.imageUrl, 400) })),
    ...videos.map(v => ({ type: 'video' as const, ...v, thumb: v.thumbnailUrl || getYouTubeThumbnailUrl(v.videoUrl, "hqdefault") }))
  ].sort(() => 0.5 - Math.random());

  const firstRow = allMarqueeItems.slice(0, allMarqueeItems.length / 2);
  const secondRow = allMarqueeItems.slice(allMarqueeItems.length / 2);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Simplified Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Galerie
            </h1>
            <p className="text-lg text-neutral-500">
              Revivez les moments forts de nos événements à travers {totalItems} photos et vidéos.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Filters */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-neutral-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Type Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {[
                { id: 'all', label: 'Tout', count: totalItems },
                { id: 'photos', label: 'Photos', icon: ImageIcon, count: photos.length },
                { id: 'videos', label: 'Vidéos', icon: Video, count: videos.length },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleFilterChange("type", type.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${selectedType === type.id
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}
                  `}
                >
                  {type.icon && <type.icon className="w-4 h-4" />}
                  {type.label}
                  <span className={`text-xs ${selectedType === type.id ? 'text-neutral-400' : 'text-neutral-400'}`}>
                    {type.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Year Filter */}
              {years.length > 0 && (
                <select
                  value={selectedYear || ""}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="appearance-none bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2 px-4 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all cursor-pointer"
                >
                  <option value="">Toutes les années</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}

              {/* Category Filter */}
              {categories.length > 0 && (
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="appearance-none bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2 px-4 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all cursor-pointer"
                >
                  <option value="">Toutes catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              )}

              {/* Clear Filters */}
              {(selectedYear || selectedCategory || selectedType !== "all") && (
                <button
                  onClick={() => router.push("/gallery")}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Effacer les filtres"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Gallery Grid */}
      <div className="container mx-auto px-6 py-8">
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
            <ImageIcon className="w-16 h-16 mb-4" />
            <p className="text-xl font-medium text-neutral-600 mb-2">Aucun média trouvé</p>
            <p className="text-neutral-500">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Photos Section */}
            {(selectedType === 'all' || selectedType === 'photos') && photos.length > 0 && (
              <div>
                {selectedType === 'all' && (
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                    <ImageIcon className="w-6 h-6 text-neutral-600" />
                    Photos
                    <span className="text-sm font-normal text-neutral-400">({photos.length})</span>
                  </h2>
                )}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={`photo-${photo.id}`}
                      className="break-inside-avoid mb-4 group cursor-pointer"
                      onClick={() => openPhoto(photo, index)}
                    >
                      <div className="relative rounded-2xl overflow-hidden bg-neutral-200 shadow-sm hover:shadow-xl transition-all duration-500">
                        <img
                          src={photo.thumbnailUrl ?? getDriveThumbnailUrl(photo.imageUrl, 600) ?? ""}
                          alt={photo.title}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Content */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                            {photo.title}
                          </h3>
                          {photo.eventName && (
                            <p className="text-white/70 text-xs">{photo.eventName}</p>
                          )}
                        </div>

                        {/* Photo Icon */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full">
                            <ImageIcon className="w-4 h-4 text-neutral-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section - Max 3 per row */}
            {(selectedType === 'all' || selectedType === 'videos') && videos.length > 0 && (
              <div>
                {selectedType === 'all' && (
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                    <Video className="w-6 h-6 text-red-500" />
                    Vidéos
                    <span className="text-sm font-normal text-neutral-400">({videos.length})</span>
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {videos.map((video) => (
                    <div
                      key={`video-${video.id}`}
                      className="group cursor-pointer"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="relative overflow-hidden bg-white hover:shadow-xl transition-all duration-500 aspect-video">
                        <img
                          src={video.thumbnailUrl || getYouTubeThumbnailUrl(video.videoUrl, "hqdefault") || ""}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 text-neutral-900 ml-1" fill="currentColor" />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                            {video.title}
                          </h3>
                          {video.eventName && (
                            <p className="text-white/70 text-xs">{video.eventName}</p>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10">
            <span className="text-white/60 text-sm font-medium">
              {photoIndex + 1} / {photos.length}
            </span>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10 disabled:opacity-30"
            disabled={photoIndex === 0}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10 disabled:opacity-30"
            disabled={photoIndex === photos.length - 1}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div
            className="w-full h-full max-w-7xl mx-auto p-4 md:p-16 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getDriveImageUrl(selectedPhoto.imageUrl) || selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== selectedPhoto.imageUrl) {
                  img.src = selectedPhoto.imageUrl;
                }
              }}
            />
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-white">{selectedPhoto.title}</h3>
              {selectedPhoto.eventName && (
                <p className="text-white/60 mt-1">{selectedPhoto.eventName} {selectedPhoto.eventYear && `• ${selectedPhoto.eventYear}`}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="w-full max-w-5xl">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Video Player */}
            <div
              className="relative aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {getYouTubeEmbedUrl(selectedVideo.videoUrl) && (
                <iframe
                  src={`${getYouTubeEmbedUrl(selectedVideo.videoUrl)}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Info */}
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-white">{selectedVideo.title}</h3>
              {selectedVideo.description && (
                <p className="text-white/60 mt-2 max-w-2xl mx-auto">{selectedVideo.description}</p>
              )}
              {selectedVideo.eventName && (
                <p className="text-white/40 mt-3 text-sm">{selectedVideo.eventName} {selectedVideo.eventYear && `• ${selectedVideo.eventYear}`}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

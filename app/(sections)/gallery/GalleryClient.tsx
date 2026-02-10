"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Video,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Search,
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

  const handleFilterChange = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/gallery?${params.toString()}`);
  }, [searchParams, router]);

  const openPhoto = useCallback((photo: PhotoItem, index: number) => {
    setSelectedPhoto(photo);
    setPhotoIndex(index);
  }, []);

  const nextPhoto = useCallback(() => {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
      setSelectedPhoto(photos[photoIndex + 1]);
    }
  }, [photoIndex, photos]);

  const prevPhoto = useCallback(() => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
      setSelectedPhoto(photos[photoIndex - 1]);
    }
  }, [photoIndex, photos]);

  const totalItems = videos.length + photos.length;

  // Precompute thumbnail URLs
  const photoThumbs = useMemo(() =>
    photos.map(p => p.thumbnailUrl ?? getDriveThumbnailUrl(p.imageUrl, 600) ?? ""),
    [photos]
  );

  const videoThumbs = useMemo(() =>
    videos.map(v => v.thumbnailUrl || getYouTubeThumbnailUrl(v.videoUrl, "hqdefault") || ""),
    [videos]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Type Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'all', label: 'Tout', count: totalItems, icon: null },
                { id: 'photos', label: 'Photos', icon: ImageIcon, count: photos.length },
                { id: 'videos', label: 'Vidéos', icon: Video, count: videos.length },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleFilterChange("type", type.id)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border
                    ${selectedType === type.id
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                  `}
                >
                  {type.icon && <type.icon className="w-3.5 h-3.5" />}
                  {type.label}
                  <span className={`text-xs ${selectedType === type.id ? 'text-gray-400' : 'text-gray-400'}`}>
                    {type.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {years.length > 0 && (
                <select
                  value={selectedYear || ""}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all cursor-pointer border border-gray-200"
                >
                  <option value="">Toutes les années</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}

              {categories.length > 0 && (
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all cursor-pointer border border-gray-200"
                >
                  <option value="">Toutes catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              )}

              {(selectedYear || selectedCategory || selectedType !== "all") && (
                <button
                  onClick={() => router.push("/gallery")}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Effacer les filtres"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8">
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-1">Aucun média trouvé</p>
            <p className="text-sm text-gray-500">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Photos Section */}
            {(selectedType === 'all' || selectedType === 'photos') && photos.length > 0 && (
              <div>
                {selectedType === 'all' && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Photos
                    </h2>
                    <span className="text-sm text-gray-400 font-normal">{photos.length}</span>
                  </div>
                )}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={`photo-${photo.id}`}
                      className="break-inside-avoid mb-4 group cursor-pointer"
                      onClick={() => openPhoto(photo, index)}
                    >
                      <div className="relative rounded-xl overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoThumbs[index]}
                          alt={photo.title}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Content */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-0.5">
                            {photo.title}
                          </h3>
                          {photo.eventName && (
                            <p className="text-white/70 text-xs">{photo.eventName}</p>
                          )}
                        </div>

                        {/* Featured badge */}
                        {photo.isFeatured && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-semibold rounded-full uppercase tracking-wide">
                              À la une
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {(selectedType === 'all' || selectedType === 'videos') && videos.length > 0 && (
              <div>
                {selectedType === 'all' && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <Video className="w-4 h-4 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Vidéos
                    </h2>
                    <span className="text-sm text-gray-400 font-normal">{videos.length}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {videos.map((video, index) => (
                    <div
                      key={`video-${video.id}`}
                      className="group cursor-pointer"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-lg transition-all duration-300 aspect-video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={videoThumbs[index]}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-0.5">
                            {video.title}
                          </h3>
                          {video.eventName && (
                            <p className="text-white/70 text-xs">{video.eventName}</p>
                          )}
                        </div>

                        {/* Featured badge */}
                        {video.isFeatured && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-semibold rounded-full uppercase tracking-wide">
                              À la une
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10">
            <span className="text-white/60 text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
              {photoIndex + 1} / {photos.length}
            </span>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <div className="mt-5 text-center">
              <h3 className="text-lg font-semibold text-white">{selectedPhoto.title}</h3>
              {selectedPhoto.eventName && (
                <p className="text-white/60 mt-1 text-sm">
                  {selectedPhoto.eventName} {selectedPhoto.eventYear && `• ${selectedPhoto.eventYear}`}
                </p>
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
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Video Player */}
            <div
              className="relative aspect-video bg-black rounded-xl overflow-hidden"
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
            <div className="mt-5 text-center">
              <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
              {selectedVideo.description && (
                <p className="text-white/60 mt-2 max-w-2xl mx-auto text-sm">{selectedVideo.description}</p>
              )}
              {selectedVideo.eventName && (
                <p className="text-white/40 mt-2 text-xs">
                  {selectedVideo.eventName} {selectedVideo.eventYear && `• ${selectedVideo.eventYear}`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

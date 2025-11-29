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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galerie</h1>
          <p className="text-xl text-gray-300 text-center">
            Découvrez les moments forts de nos événements à travers nos photos et vidéos
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-gray-700 mr-2" />
            <select
              value={selectedType}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Tout</option>
              <option value="videos">Vidéos</option>
              <option value="photos">Photos</option>
            </select>
            {years.length > 0 && (
              <select
                value={selectedYear || ""}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Années</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
            {categories.length > 0 && (
              <select
                value={selectedCategory || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}
            {(selectedYear || selectedCategory || selectedType !== "all") && (
              <button
                onClick={() => router.push("/gallery")}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="container mx-auto px-0 py-8">
        {totalItems === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-gray-400 mb-4">
              {selectedType === "videos" ? (
                <Video className="w-16 h-16 mx-auto" />
              ) : selectedType === "photos" ? (
                <ImageIcon className="w-16 h-16 mx-auto" />
              ) : (
                <ImageIcon className="w-16 h-16 mx-auto" />
              )}
            </div>
            <p className="text-gray-600 text-lg">
              Aucun élément trouvé avec ces filtres
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 px-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{totalItems}</span> {totalItems > 1 ? 'éléments trouvés' : 'élément trouvé'}
              </p>
            </div>
            {/* Gallery Grid - Style téléphone/Instagram sans gap */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
            {/* Videos */}
            {selectedType !== "photos" &&
              videos.map((video) => {
                const thumbnail =
                  video.thumbnailUrl || getYouTubeThumbnailUrl(video.videoUrl, "hqdefault");

                return (
                  <div
                    key={`video-${video.id}`}
                    className="group relative bg-gray-100 overflow-hidden cursor-pointer aspect-square"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-all duration-300">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-red-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Vidéo
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* Photos */}
            {selectedType !== "videos" &&
              photos.map((photo, index) => {
                const thumbnail =
                  photo.thumbnailUrl || getDriveThumbnailUrl(photo.imageUrl, 400);

                return (
                  <div
                    key={`photo-${photo.id}`}
                    className="group relative bg-gray-100 overflow-hidden cursor-pointer aspect-square"
                    onClick={() => openPhoto(photo, index)}
                  >
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Photo
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
          </>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X size={32} />
            </button>

            {/* Previous button */}
            {photoIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
              >
                <ChevronLeft size={48} />
              </button>
            )}

            {/* Next button */}
            {photoIndex < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
              >
                <ChevronRight size={48} />
              </button>
            )}

            {/* Image */}
            <div
              className="max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getDriveImageUrl(selectedPhoto.imageUrl) || selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onError={(e) => {
                  // Fallback to original URL if conversion fails
                  const img = e.currentTarget;
                  if (img.src !== selectedPhoto.imageUrl) {
                    img.src = selectedPhoto.imageUrl;
                  }
                }}
              />
              <div className="mt-4 text-white text-center">
                <h3 className="text-xl font-bold">{selectedPhoto.title}</h3>
                {selectedPhoto.description && (
                  <p className="text-gray-300 mt-2">{selectedPhoto.description}</p>
                )}
                <p className="text-gray-400 text-sm mt-2">
                  {photoIndex + 1} / {photos.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-5xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>

            {/* Video iframe */}
            <div
              className="relative aspect-video bg-black rounded-lg overflow-hidden"
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

            {/* Video info */}
            <div className="mt-4 text-white text-center">
              <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
              {selectedVideo.description && (
                <p className="text-gray-300 mt-2">{selectedVideo.description}</p>
              )}
              {selectedVideo.eventName && (
                <p className="text-gray-400 text-sm mt-2">
                  {selectedVideo.eventName}{" "}
                  {selectedVideo.eventYear && `• ${selectedVideo.eventYear}`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Image as ImageIcon, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/services/youtube";
import { getDriveImageUrl, getDriveThumbnailUrl } from "@/lib/validations/gallery";

type VideoItem = {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
};

type PhotoItem = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
};

type Props = {
  videos: VideoItem[];
  photos: PhotoItem[];
  eventTitle: string;
};

export default function EventGallerySection({ videos, photos, eventTitle }: Props) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const totalItems = videos.length + photos.length;

  if (totalItems === 0) {
    return null;
  }

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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg shadow-sm p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          Galerie de l'événement
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Videos */}
          {videos.map((video) => {
            const thumbnail = video.thumbnailUrl || getYouTubeThumbnailUrl(video.videoUrl, "hqdefault");

            return (
              <div
                key={`video-${video.id}`}
                className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedVideo(video)}
              >
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Vidéo
                  </span>
                </div>
              </div>
            );
          })}

          {/* Photos */}
          {photos.map((photo, index) => {
            const thumbnail = photo.thumbnailUrl || getDriveThumbnailUrl(photo.imageUrl, 400);

            return (
              <div
                key={`photo-${photo.id}`}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openPhoto(photo, index)}
              >
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Photo
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to full gallery */}
        <div className="mt-6 text-center">
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
          >
            Voir toute la galerie
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>

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

            <div className="mt-4 text-white text-center">
              <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
              {selectedVideo.description && (
                <p className="text-gray-300 mt-2">{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X size={32} />
            </button>

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

            <div className="max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
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
    </>
  );
}

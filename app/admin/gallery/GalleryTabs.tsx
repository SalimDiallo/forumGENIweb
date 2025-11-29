"use client";

import { useRouter } from "next/navigation";
import { Video, Image as ImageIcon, Edit2, Eye, EyeOff, Star } from "lucide-react";
import Link from "next/link";
import { getYouTubeThumbnailUrl } from "@/lib/services/youtube";
import { getDriveThumbnailUrl } from "@/lib/validations/gallery";
import { DeleteButton } from "./DeleteButton";

type Video = {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  eventName: string | null;
  eventYear: number | null;
  category: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  event?: {
    id: number;
    title: string;
    startDate: Date;
  } | null;
};

type Photo = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  eventName: string | null;
  eventYear: number | null;
  category: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  event?: {
    id: number;
    title: string;
    startDate: Date;
  } | null;
};

type GalleryTabsProps = {
  activeTab: "videos" | "photos";
  videos: Video[];
  photos: Photo[];
};

export function GalleryTabs({ activeTab, videos, photos }: GalleryTabsProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Tabs Header */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <Link
            href="/admin/gallery?tab=videos"
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "videos"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Video className="w-5 h-5" />
            Vidéos YouTube ({videos.length})
          </Link>
          <Link
            href="/admin/gallery?tab=photos"
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "photos"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Photos Drive ({photos.length})
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "videos" ? (
          videos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="mb-4">Aucune vidéo pour le moment</p>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Ajoutez des vidéos YouTube non répertoriées (unlisted). <br />
                Aucune API nécessaire, collez simplement le lien !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const thumbnail = video.thumbnailUrl || getYouTubeThumbnailUrl(video.videoUrl, "hqdefault");

                return (
                  <div
                    key={video.id}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-100">
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Video className="w-12 h-12 text-white" />
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        {video.isFeatured && (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            <Star className="w-3 h-3 inline" />
                          </span>
                        )}
                        {!video.isActive && (
                          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                            <EyeOff className="w-3 h-3 inline" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {video.title}
                      </h3>
                      {video.event ? (
                        <p className="text-sm text-gray-600 mb-2">
                          🔗 {video.event.title} • {new Date(video.event.startDate).getFullYear()}
                        </p>
                      ) : video.eventName ? (
                        <p className="text-sm text-gray-600 mb-2">
                          {video.eventName} {video.eventYear && `• ${video.eventYear}`}
                        </p>
                      ) : null}
                      {video.category && (
                        <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mb-3">
                          {video.category}
                        </span>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <Link
                          href={`/admin/gallery/video/${video.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Modifier
                        </Link>
                        <DeleteButton id={video.id} title={video.title} type="video" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          photos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="mb-4">Aucune photo pour le moment</p>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Ajoutez des photos depuis Google Drive. <br />
                Aucune API nécessaire, collez simplement le lien de partage !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => {
                const thumbnail = photo.thumbnailUrl || getDriveThumbnailUrl(photo.imageUrl, 400);

                return (
                  <div
                    key={photo.id}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square bg-gray-100">
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        {photo.isFeatured && (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            <Star className="w-3 h-3 inline" />
                          </span>
                        )}
                        {!photo.isActive && (
                          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                            <EyeOff className="w-3 h-3 inline" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                        {photo.title}
                      </h3>
                      {photo.event ? (
                        <p className="text-xs text-gray-600 mb-2">
                          🔗 {photo.event.title} • {new Date(photo.event.startDate).getFullYear()}
                        </p>
                      ) : photo.eventName ? (
                        <p className="text-xs text-gray-600 mb-2">
                          {photo.eventName} {photo.eventYear && `• ${photo.eventYear}`}
                        </p>
                      ) : null}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <Link
                          href={`/admin/gallery/photo/${photo.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Modifier
                        </Link>
                        <DeleteButton id={photo.id} title={photo.title} type="photo" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

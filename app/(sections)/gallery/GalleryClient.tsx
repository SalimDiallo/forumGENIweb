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
    <div className="bg-white">
      {/* Hero Header - Simplified */}
      <div className="py-8 bg-white overflow-hidden">
        <div className="container mx-auto px-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">Galerie</h1>
            <p className="text-xl text-gray-500 max-w-2xl font-light">
              Découvrez les moments forts de nos événements à travers nos archives.
            </p>
          </div>

          {/* Explore Button */}
          <button
            onClick={() => setIsExploreOpen(true)}
            className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            <span>Explorer tout</span>
          </button>
        </div>

        {/* Filters - Enhanced & Intuitive */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

              {/* Left: Type Selection (Segmented Control) */}
              <div className="flex p-1 bg-gray-100/80 rounded-full border border-gray-200 w-full lg:w-auto overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Tout voir', icon: null },
                  { id: 'videos', label: 'Vidéos', icon: Video },
                  { id: 'photos', label: 'Photos', icon: ImageIcon },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleFilterChange("type", type.id)}
                    className={`
                    flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-1 lg:flex-none justify-center
                    ${selectedType === type.id
                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}
                  `}
                  >
                    {type.icon && <type.icon className="w-4 h-4" />}
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Right: Search & Refinement */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">

                {/* Search Input */}
                <div className="relative w-full sm:w-64 group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm"
                    defaultValue={searchParams.get("search")?.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Debounce handled by next/navigation usually? No, manual debounce needed or just direct. 
                      // For simplicity in this step, direct. Ideally debounce.
                      const timeoutId = setTimeout(() => handleFilterChange("search", value), 300);
                      return () => clearTimeout(timeoutId);
                    }}
                  />
                </div>

                {/* Dropdowns Group */}
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                  {years.length > 0 && (
                    <div className="relative">
                      <select
                        value={selectedYear || ""}
                        onChange={(e) => handleFilterChange("year", e.target.value)}
                        className="appearance-none bg-white border border-gray-200 hover:border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer min-w-[140px]"
                      >
                        <option value="">Année</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {categories.length > 0 && (
                    <div className="relative">
                      <select
                        value={selectedCategory || ""}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        className="appearance-none bg-white border border-gray-200 hover:border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer min-w-[160px]"
                      >
                        <option value="">Catégorie</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {(selectedYear || selectedCategory || selectedType !== "all" || searchParams.get("search")) && (
                    <button
                      onClick={() => router.push("/gallery")}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Effacer les filtres"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Section - Immersive 3D Wall */}
        <div className="relative w-full h-[500px] overflow-hidden bg-gray-50/50 flex flex-col items-center justify-center mask-gradient-to-b">
          <div className="flex flex-col gap-6 [transform:rotate(-5deg)_scale(1.1)] origin-center opacity-90 hover:opacity-100 transition-opacity duration-500">
            {/* First Row */}
            <Marquee pauseOnHover className="[--duration:50s] [--gap:1.5rem]">
              {firstRow.map((item, idx) => (
                <div
                  key={`${item.type}-${item.id}-${idx}`}
                  className="mx-0 w-64 h-40 md:w-80 md:h-52 rounded-2xl overflow-hidden cursor-pointer relative group border border-gray-200/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 bg-white"
                  onClick={() => item.type === 'photo' ? openPhoto(item as PhotoItem, 0) : setSelectedVideo(item as VideoItem)}
                >
                  {item.thumb && (
                    <img
                      src={item.thumb}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  )}

                  {/* Subtle Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Content - Always visible but subtle, pops on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end z-10">
                    <span className="text-white text-sm font-bold line-clamp-1 drop-shadow-sm">{item.title}</span>
                    <div className="flex items-center gap-2 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.type === 'video' ? (
                        <span className="text-[10px] items-center flex gap-1 uppercase tracking-wider font-bold text-white bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                          <Play className="w-3 h-3 fill-current" /> Vidéo
                        </span>
                      ) : (
                        <span className="text-[10px] items-center flex gap-1 uppercase tracking-wider font-bold text-white bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                          <ImageIcon className="w-3 h-3" /> Photo
                        </span>
                      )}
                    </div>
                  </div>

                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm border border-white/40 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Marquee>

            {/* Second Row (Reverse) */}
            <Marquee pauseOnHover reverse className="[--duration:45s] [--gap:1.5rem]">
              {secondRow.map((item, idx) => (
                <div
                  key={`${item.type}-${item.id}-${idx}-rev`}
                  className="mx-0 w-64 h-40 md:w-80 md:h-52 rounded-2xl overflow-hidden cursor-pointer relative group border border-gray-200/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 bg-white"
                  onClick={() => item.type === 'photo' ? openPhoto(item as PhotoItem, 0) : setSelectedVideo(item as VideoItem)}
                >
                  {item.thumb && (
                    <img
                      src={item.thumb}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end z-10">
                    <span className="text-white text-sm font-bold line-clamp-1 drop-shadow-sm">{item.title}</span>
                    <div className="flex items-center gap-2 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.type === 'video' ? (
                        <span className="text-[10px] items-center flex gap-1 uppercase tracking-wider font-bold text-white bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                          <Play className="w-3 h-3 fill-current" /> Vidéo
                        </span>
                      ) : (
                        <span className="text-[10px] items-center flex gap-1 uppercase tracking-wider font-bold text-white bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                          <ImageIcon className="w-3 h-3" /> Photo
                        </span>
                      )}
                    </div>
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm border border-white/40 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Marquee>

            {/* Third Row (Original order, lighter speed) - Fills the 'wall' */}
            <Marquee pauseOnHover className="[--duration:55s] [--gap:1.5rem]">
              {firstRow.map((item, idx) => (
                <div
                  key={`${item.type}-${item.id}-${idx}-3`}
                  className="mx-0 w-64 h-40 md:w-80 md:h-52 rounded-2xl overflow-hidden cursor-pointer relative group border border-gray-200/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 bg-white"
                  onClick={() => item.type === 'photo' ? openPhoto(item as PhotoItem, 0) : setSelectedVideo(item as VideoItem)}
                >
                  {item.thumb && (
                    <img
                      src={item.thumb}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end z-10">
                    <span className="text-white text-sm font-bold line-clamp-1 drop-shadow-sm">{item.title}</span>
                    <div className="flex items-center gap-2 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.type === 'video' ? (
                        <span className="text-[10px] items-center flex gap-1 uppercase tracking-wider font-bold text-white bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                          <Play className="w-3 h-3 fill-current" /> Vidéo
                        </span>
                      ) : (
                        <span className="text-[10px] items-center flex gap-1 uppercase tracking-wider font-bold text-white bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                          <ImageIcon className="w-3 h-3" /> Photo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>

          {/* Fade overlay for better text readability and section blend */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent z-20"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20"></div>
        </div>
      </div>

      {/* Explore Grid Modal */}
      {isExploreOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[60] overflow-y-auto animate-in fade-in duration-300">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">Explorer la galerie</h2>
            </div>
            <button
              onClick={() => setIsExploreOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Masonry Grid Content */}
          <div className="container mx-auto px-6 py-8">
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {allExploreItems.map((item, idx) => (
                <div
                  key={`explore-${item.type}-${item.id}-${idx}`}
                  className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all border border-gray-100 bg-gray-50 mb-6"
                  onClick={() => {
                    setIsExploreOpen(false); // Close explore modal
                    item.type === 'photo' ? openPhoto(item as PhotoItem, 0) : setSelectedVideo(item as VideoItem)
                  }}
                >
                  {item.thumb && (
                    <img
                      src={item.thumb}
                      alt={item.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm font-bold line-clamp-2 drop-shadow-md">{item.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {item.type === 'video' ? (
                        <span className="text-[10px] uppercase font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          Vidéo
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          Photo
                        </span>
                      )}
                    </div>
                  </div>

                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/80 rounded-full p-2 shadow-sm backdrop-blur-sm">
                        <Play className="w-4 h-4 text-gray-900" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal - Clean */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[70] flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Controls Container */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
            <p className="text-gray-500 text-sm">
              {photoIndex + 1} / {photos.length}
            </p>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-4 p-3 hover:bg-gray-100 rounded-full transition-colors z-10 hidden md:block"
            disabled={photoIndex === 0}
          >
            <ChevronLeft className={`w-8 h-8 ${photoIndex === 0 ? 'text-gray-300' : 'text-gray-900'}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-4 p-3 hover:bg-gray-100 rounded-full transition-colors z-10 hidden md:block"
            disabled={photoIndex === photos.length - 1}
          >
            <ChevronRight className={`w-8 h-8 ${photoIndex === photos.length - 1 ? 'text-gray-300' : 'text-gray-900'}`} />
          </button>

          <div
            className="w-full h-full max-w-7xl mx-auto p-4 md:p-12 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[80vh]">
              <img
                src={getDriveImageUrl(selectedPhoto.imageUrl) || selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== selectedPhoto.imageUrl) {
                    img.src = selectedPhoto.imageUrl;
                  }
                }}
              />
            </div>
            <div className="mt-6 text-center max-w-2xl">
              <h3 className="text-xl font-bold text-gray-900">{selectedPhoto.title}</h3>
              {selectedPhoto.description && (
                <p className="text-gray-500 mt-2">{selectedPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal - Clean */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="w-full max-w-5xl">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            <div
              className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
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

            <div className="mt-6 text-white text-center">
              <h3 className="text-2xl font-bold">{selectedVideo.title}</h3>
              {selectedVideo.description && (
                <p className="text-white/70 mt-2 max-w-2xl mx-auto">{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

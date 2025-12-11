"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Image as ImageIcon,
  Edit2,
  Eye,
  EyeOff,
  Star,
  Trash2,
  CheckSquare,
  Square,
  X,
  Filter,
  Search,
  Loader2,
  LayoutGrid,
  List,
} from "lucide-react";
import Link from "next/link";
import { getYouTubeThumbnailUrl } from "@/lib/services/youtube";
import { getDriveThumbnailUrl } from "@/lib/validations/gallery";
import { bulkDeleteVideos, bulkDeletePhotos, deleteVideo, deletePhoto } from "./actions";
import { toast } from "sonner";

type VideoItem = {
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

type PhotoItem = {
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
  videos: VideoItem[];
  photos: PhotoItem[];
};

type ViewMode = "grid" | "list";
type FilterStatus = "all" | "active" | "inactive" | "featured";

export function GalleryTabs({ activeTab, videos, photos }: GalleryTabsProps) {
  const router = useRouter();

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Delete state
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [singleDeleteItem, setSingleDeleteItem] = useState<{ id: number; title: string } | null>(null);

  // Get current items based on tab
  const items = activeTab === "videos" ? videos : photos;

  // Filter and search items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesEvent = item.eventName?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesEvent && !matchesCategory) return false;
      }

      // Status filter
      switch (filterStatus) {
        case "active":
          return item.isActive;
        case "inactive":
          return !item.isActive;
        case "featured":
          return item.isFeatured;
        default:
          return true;
      }
    });
  }, [items, searchQuery, filterStatus]);

  // Selection handlers
  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);

    // Auto-enable selection mode when selecting
    if (!isSelectionMode && newSelected.size > 0) {
      setIsSelectionMode(true);
    }
  };

  const selectAll = () => {
    const allIds = new Set(filteredItems.map((item) => item.id));
    setSelectedIds(allIds);
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  // Delete handlers
  const handleSingleDelete = (id: number, title: string) => {
    setSingleDeleteItem({ id, title });
    setShowDeleteConfirm(true);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setSingleDeleteItem(null);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (singleDeleteItem) {
        // Single delete
        if (activeTab === "videos") {
          await deleteVideo({ id: singleDeleteItem.id });
        } else {
          await deletePhoto({ id: singleDeleteItem.id });
        }
        toast.success(`${activeTab === "videos" ? "Vidéo" : "Photo"} supprimée avec succès`);
      } else {
        // Bulk delete
        const ids = Array.from(selectedIds);
        if (activeTab === "videos") {
          const result = await bulkDeleteVideos({ ids });
          if (result?.data?.count) {
            toast.success(`${result.data.count} vidéo(s) supprimée(s) avec succès`);
          }
        } else {
          const result = await bulkDeletePhotos({ ids });
          if (result?.data?.count) {
            toast.success(`${result.data.count} photo(s) supprimée(s) avec succès`);
          }
        }
        setSelectedIds(new Set());
        setIsSelectionMode(false);
      }
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setSingleDeleteItem(null);
    }
  };

  // Card component for videos
  const VideoCard = ({ video, isSelected }: { video: VideoItem; isSelected: boolean }) => {
    const thumbnail = video.thumbnailUrl || getYouTubeThumbnailUrl(video.videoUrl, "hqdefault");

    return (
      <div
        className={`group relative bg-white border rounded-xl overflow-hidden transition-all duration-200 ${isSelected
          ? "border-blue-500 ring-2 ring-blue-200 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
      >
        {/* Selection checkbox */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSelection(video.id);
          }}
          className={`absolute top-3 left-3 z-10 p-1.5 rounded-lg transition-all ${isSelected
            ? "bg-blue-500 text-white"
            : "bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100"
            }`}
        >
          {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>

        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-3 bg-red-500/90 rounded-full">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {video.isFeatured && (
              <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                <Star className="w-3 h-3" fill="currentColor" />
              </span>
            )}
            {!video.isActive && (
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                <EyeOff className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
            {video.title}
          </h3>
          {video.event ? (
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <span className="text-blue-500">🔗</span>
              {video.event.title} • {new Date(video.event.startDate).getFullYear()}
            </p>
          ) : video.eventName ? (
            <p className="text-xs text-gray-500 mb-2">
              {video.eventName} {video.eventYear && `• ${video.eventYear}`}
            </p>
          ) : null}

          {video.category && (
            <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {video.category}
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <Link
              href={`/admin/gallery/video/${video.id}/edit`}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Modifier
            </Link>
            <button
              onClick={() => handleSingleDelete(video.id, video.title)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Card component for photos
  const PhotoCard = ({ photo, isSelected }: { photo: PhotoItem; isSelected: boolean }) => {
    const thumbnail = photo.thumbnailUrl || getDriveThumbnailUrl(photo.imageUrl, 400);

    return (
      <div
        className={`group relative bg-white border rounded-xl overflow-hidden transition-all duration-200 ${isSelected
          ? "border-pink-500 ring-2 ring-pink-200 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
      >
        {/* Selection checkbox */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSelection(photo.id);
          }}
          className={`absolute top-3 left-3 z-10 p-1.5 rounded-lg transition-all ${isSelected
            ? "bg-pink-500 text-white"
            : "bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100"
            }`}
        >
          {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>

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
          <div className="absolute top-3 right-3 flex gap-2">
            {photo.isFeatured && (
              <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                <Star className="w-3 h-3" fill="currentColor" />
              </span>
            )}
            {!photo.isActive && (
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                <EyeOff className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs">
            {photo.title}
          </h3>
          {photo.event ? (
            <p className="text-xs text-gray-500 truncate">
              🔗 {photo.event.title}
            </p>
          ) : photo.eventName ? (
            <p className="text-xs text-gray-500 truncate">
              {photo.eventName}
            </p>
          ) : null}

          {/* Actions - compact */}
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
            <Link
              href={`/admin/gallery/photo/${photo.id}/edit`}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              Modifier
            </Link>
            <button
              onClick={() => handleSingleDelete(photo.id, photo.title)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Tabs Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between px-4">
          <nav className="flex -mb-px">
            <Link
              href="/admin/gallery?tab=videos"
              className={`flex items-center gap-2 px-5 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === "videos"
                ? "border-red-500 text-red-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              <Video className="w-4 h-4" />
              Vidéos
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${activeTab === "videos" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"
                }`}>
                {videos.length}
              </span>
            </Link>
            <Link
              href="/admin/gallery?tab=photos"
              className={`flex items-center gap-2 px-5 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === "photos"
                ? "border-pink-500 text-pink-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              Photos
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${activeTab === "photos" ? "bg-pink-100 text-pink-600" : "bg-gray-200 text-gray-600"
                }`}>
                {photos.length}
              </span>
            </Link>
          </nav>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="featured">En vedette</option>
            </select>
          </div>

          {/* Selection actions */}
          {isSelectionMode && selectedIds.size > 0 && (
            <div className="flex items-center gap-2 ml-auto bg-white border border-gray-200 rounded-lg px-3 py-1.5">
              <span className="text-sm text-gray-600">
                <strong>{selectedIds.size}</strong> sélectionné(s)
              </span>
              <div className="w-px h-5 bg-gray-200" />
              <button
                onClick={selectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Tout
              </button>
              <button
                onClick={deselectAll}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Aucun
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            {activeTab === "videos" ? (
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            ) : (
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            )}
            <p className="text-gray-500 mb-2">
              {searchQuery || filterStatus !== "all"
                ? "Aucun résultat trouvé"
                : `Aucune ${activeTab === "videos" ? "vidéo" : "photo"} pour le moment`}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                {activeTab === "videos"
                  ? "Ajoutez des vidéos YouTube non répertoriées (unlisted). Aucune API nécessaire !"
                  : "Ajoutez des photos depuis Google Drive. Aucune API nécessaire !"}
              </p>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className={`grid gap-4 ${activeTab === "videos"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            }`}>
            {activeTab === "videos"
              ? (filteredItems as VideoItem[]).map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isSelected={selectedIds.has(video.id)}
                />
              ))
              : (filteredItems as PhotoItem[]).map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedIds.has(photo.id)}
                />
              ))}
          </div>
        ) : (
          // List view
          <div className="divide-y divide-gray-100">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 py-3 px-2 rounded-lg transition-colors ${selectedIds.has(item.id) ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelection(item.id)}
                  className={`p-1 rounded ${selectedIds.has(item.id) ? "text-blue-500" : "text-gray-400"
                    }`}
                >
                  {selectedIds.has(item.id) ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={
                      activeTab === "videos"
                        ? (item as VideoItem).thumbnailUrl ||
                        getYouTubeThumbnailUrl((item as VideoItem).videoUrl, "default") || ""
                        : (item as PhotoItem).thumbnailUrl ||
                        getDriveThumbnailUrl((item as PhotoItem).imageUrl, 100) || ""
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 truncate">
                    {item.event?.title || item.eventName || "Sans événement"}
                    {item.category && ` • ${item.category}`}
                  </p>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2">
                  {item.isFeatured && (
                    <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                  )}
                  {item.isActive ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/gallery/${activeTab === "videos" ? "video" : "photo"}/${item.id}/edit`}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleSingleDelete(item.id, item.title)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-gray-500">
                  Cette action est irréversible
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {singleDeleteItem ? (
                <>
                  Êtes-vous sûr de vouloir supprimer{" "}
                  <strong>"{singleDeleteItem.title}"</strong> ?
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir supprimer{" "}
                  <strong>{selectedIds.size} élément(s)</strong> ?
                </>
              )}
            </p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSingleDeleteItem(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

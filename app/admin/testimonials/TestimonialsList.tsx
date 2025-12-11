"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Video,
    Edit2,
    Trash2,
    Star,
    Eye,
    EyeOff,
    ExternalLink,
    Search,
    Filter,
    CheckSquare,
    Square,
    Loader2,
    LayoutGrid,
    List,
    Quote,
    GraduationCap,
    Building2,
} from "lucide-react";
import { getYouTubeThumbnailUrl, getYouTubeEmbedUrl } from "@/lib/services/youtube";
import { deleteTestimonial, bulkDeleteTestimonials } from "./actions";
import { toast } from "sonner";

type Testimonial = {
    id: number;
    name: string;
    position: string | null;
    company: string | null;
    graduationYear: number | null;
    videoUrl: string;
    thumbnailUrl: string | null;
    quote: string | null;
    isFeatured: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
};

type TestimonialsListProps = {
    testimonials: Testimonial[];
    total: number;
};

type ViewMode = "grid" | "table";
type FilterStatus = "all" | "active" | "inactive" | "featured";

export function TestimonialsList({ testimonials, total }: TestimonialsListProps) {
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
    const [singleDeleteItem, setSingleDeleteItem] = useState<{ id: number; name: string } | null>(null);

    // Filter and search items
    const filteredItems = useMemo(() => {
        return testimonials.filter((item) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = item.name.toLowerCase().includes(query);
                const matchesCompany = item.company?.toLowerCase().includes(query);
                const matchesPosition = item.position?.toLowerCase().includes(query);
                const matchesQuote = item.quote?.toLowerCase().includes(query);
                if (!matchesName && !matchesCompany && !matchesPosition && !matchesQuote) return false;
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
    }, [testimonials, searchQuery, filterStatus]);

    // Selection handlers
    const toggleSelection = (id: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);

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
    const handleSingleDelete = (id: number, name: string) => {
        setSingleDeleteItem({ id, name });
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
                await deleteTestimonial({ id: singleDeleteItem.id });
                toast.success("Témoignage supprimé avec succès");
            } else {
                const ids = Array.from(selectedIds);
                const result = await bulkDeleteTestimonials({ ids });
                if (result?.data?.count) {
                    toast.success(`${result.data.count} témoignage(s) supprimé(s) avec succès`);
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

    // Card component for testimonials
    const TestimonialCard = ({ item, isSelected }: { item: Testimonial; isSelected: boolean }) => {
        const thumbnail = item.thumbnailUrl || getYouTubeThumbnailUrl(item.videoUrl, "hqdefault");
        const embedUrl = getYouTubeEmbedUrl(item.videoUrl);

        return (
            <div
                className={`group relative bg-white border rounded-xl overflow-hidden transition-all duration-200 ${isSelected
                        ? "border-purple-500 ring-2 ring-purple-200 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
            >
                {/* Selection checkbox */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleSelection(item.id);
                    }}
                    className={`absolute top-3 left-3 z-10 p-1.5 rounded-lg transition-all ${isSelected
                            ? "bg-purple-500 text-white"
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
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {embedUrl && (
                            <a
                                href={embedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-red-500/90 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <Video className="w-6 h-6 text-white" />
                            </a>
                        )}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        {item.isFeatured && (
                            <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                                <Star className="w-3 h-3" fill="currentColor" />
                            </span>
                        )}
                        {!item.isActive && (
                            <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                                <EyeOff className="w-3 h-3" />
                            </span>
                        )}
                    </div>

                    {/* Sort order badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            #{item.sortOrder}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>

                    <div className="flex flex-col gap-1 text-sm text-gray-500 mb-2">
                        {item.position && (
                            <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {item.position}
                            </span>
                        )}
                        {item.company && (
                            <span className="truncate">{item.company}</span>
                        )}
                        {item.graduationYear && (
                            <span className="flex items-center gap-1 text-xs">
                                <GraduationCap className="w-3 h-3" />
                                Promo {item.graduationYear}
                            </span>
                        )}
                    </div>

                    {item.quote && (
                        <p className="text-xs text-gray-500 line-clamp-2 italic mb-3">
                            <Quote className="w-3 h-3 inline mr-1" />
                            "{item.quote}"
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Link
                            href={`/admin/testimonials/${item.id}/edit`}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Modifier
                        </Link>
                        <button
                            onClick={() => handleSingleDelete(item.id, item.name)}
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

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, entreprise, citation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">Tous ({total})</option>
                            <option value="active">Actifs</option>
                            <option value="inactive">Inactifs</option>
                            <option value="featured">En vedette</option>
                        </select>
                    </div>

                    {/* View mode toggle */}
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-1.5 rounded ${viewMode === "table" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
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
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
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
                        <Video className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                        <p className="text-gray-500 mb-2">
                            {searchQuery || filterStatus !== "all"
                                ? "Aucun résultat trouvé"
                                : "Aucun témoignage pour le moment"}
                        </p>
                        {!searchQuery && filterStatus === "all" && (
                            <p className="text-sm text-gray-400 max-w-md mx-auto">
                                Ajoutez des témoignages vidéo YouTube de vos anciens étudiants.
                            </p>
                        )}
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredItems.map((item) => (
                            <TestimonialCard
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.has(item.id)}
                            />
                        ))}
                    </div>
                ) : (
                    // Table view
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="w-10 px-3 py-3">
                                        <button
                                            onClick={selectedIds.size === filteredItems.length ? deselectAll : selectAll}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            {selectedIds.size === filteredItems.length && filteredItems.length > 0 ? (
                                                <CheckSquare className="w-5 h-5" />
                                            ) : (
                                                <Square className="w-5 h-5" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase">
                                        #
                                    </th>
                                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase">
                                        Aperçu
                                    </th>
                                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase">
                                        Nom & Info
                                    </th>
                                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase">
                                        Citation
                                    </th>
                                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase">
                                        Statut
                                    </th>
                                    <th className="text-right px-3 py-3 text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredItems.map((item) => {
                                    const thumbnail = item.thumbnailUrl || getYouTubeThumbnailUrl(item.videoUrl, "mqdefault");
                                    const embedUrl = getYouTubeEmbedUrl(item.videoUrl);
                                    const isSelected = selectedIds.has(item.id);

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors ${isSelected ? "bg-purple-50" : "hover:bg-gray-50"}`}
                                        >
                                            <td className="px-3 py-3">
                                                <button
                                                    onClick={() => toggleSelection(item.id)}
                                                    className={isSelected ? "text-purple-500" : "text-gray-400"}
                                                >
                                                    {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                                </button>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                                                    {item.sortOrder}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="relative w-20 h-12 rounded overflow-hidden bg-gray-100">
                                                    {thumbnail && (
                                                        <img
                                                            src={thumbnail}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{item.name}</span>
                                                    {item.position && (
                                                        <span className="text-sm text-gray-600">{item.position}</span>
                                                    )}
                                                    {item.company && (
                                                        <span className="text-sm text-gray-500">{item.company}</span>
                                                    )}
                                                    {item.graduationYear && (
                                                        <span className="text-xs text-gray-400">Promo {item.graduationYear}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <p className="text-sm text-gray-600 max-w-[200px] truncate">
                                                    {item.quote || "-"}
                                                </p>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex flex-col gap-1">
                                                    {item.isActive ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                            <Eye className="w-3 h-3" />
                                                            Actif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            <EyeOff className="w-3 h-3" />
                                                            Inactif
                                                        </span>
                                                    )}
                                                    {item.isFeatured && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                                            <Star className="w-3 h-3" />
                                                            Vedette
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {embedUrl && (
                                                        <a
                                                            href={embedUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                            title="Voir la vidéo"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={`/admin/testimonials/${item.id}/edit`}
                                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleSingleDelete(item.id, item.name)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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
                                    Êtes-vous sûr de vouloir supprimer le témoignage de{" "}
                                    <strong>"{singleDeleteItem.name}"</strong> ?
                                </>
                            ) : (
                                <>
                                    Êtes-vous sûr de vouloir supprimer{" "}
                                    <strong>{selectedIds.size} témoignage(s)</strong> ?
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

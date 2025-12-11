"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createVideo, createPhoto } from "./actions";
import { Video, Image as ImageIcon, Save, AlertCircle, Plus, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Event = {
    id: number;
    title: string;
    startDate: Date;
};

type BulkGalleryFormProps = {
    type: "video" | "photo";
    events?: Event[];
};

type MediaItem = {
    id: string;
    url: string;
    title: string;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
};

const categoryOptions = [
    { value: "", label: "Sélectionner..." },
    { value: "Forum", label: "🎯 Forum" },
    { value: "Conférence", label: "🎤 Conférence" },
    { value: "Atelier", label: "🔧 Atelier" },
    { value: "Networking", label: "🤝 Networking" },
    { value: "Autre", label: "📁 Autre" },
];

export function BulkGalleryForm({ type, events = [] }: BulkGalleryFormProps) {
    const router = useRouter();
    const [items, setItems] = useState<MediaItem[]>([
        { id: crypto.randomUUID(), url: "", title: "", status: "pending" },
    ]);
    const [isUploading, setIsUploading] = useState(false);

    // Shared metadata
    const [eventId, setEventId] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventYear, setEventYear] = useState(new Date().getFullYear().toString());
    const [category, setCategory] = useState("");

    const addItem = () => {
        setItems([
            ...items,
            { id: crypto.randomUUID(), url: "", title: "", status: "pending" },
        ]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const updateItem = (id: string, field: "url" | "title", value: string) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    // Auto-generate title from URL
    const autoGenerateTitle = (url: string, index: number) => {
        if (type === "video") {
            // Extract video ID from YouTube URL for generic title
            const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
            if (match) {
                return `Vidéo ${index + 1}`;
            }
        } else {
            // For photos, use generic title
            const match = url.match(/drive\.google\.com/);
            if (match) {
                return `Photo ${index + 1}`;
            }
        }
        return "";
    };

    const handleUrlChange = (id: string, url: string, index: number) => {
        const item = items.find((i) => i.id === id);
        if (item && !item.title && url) {
            const autoTitle = autoGenerateTitle(url, index);
            setItems(
                items.map((i) =>
                    i.id === id ? { ...i, url, title: autoTitle || i.title } : i
                )
            );
        } else {
            updateItem(id, "url", url);
        }
    };

    const handleBulkUpload = async () => {
        const validItems = items.filter((item) => item.url.trim() && item.title.trim());

        if (validItems.length === 0) {
            toast.error("Ajoutez au moins un élément avec URL et titre");
            return;
        }

        setIsUploading(true);

        // Mark all valid items as uploading
        setItems(
            items.map((item) =>
                validItems.find((v) => v.id === item.id)
                    ? { ...item, status: "uploading" }
                    : item
            )
        );

        let successCount = 0;
        let errorCount = 0;

        for (const item of validItems) {
            try {
                const data = {
                    title: item.title,
                    [type === "video" ? "videoUrl" : "imageUrl"]: item.url,
                    eventId: eventId ? Number(eventId) : undefined,
                    eventName: eventName || undefined,
                    eventYear: eventYear ? Number(eventYear) : undefined,
                    category: category || undefined,
                    isActive: true,
                    isFeatured: false,
                    sortOrder: 0,
                };

                const result = type === "video"
                    ? await createVideo(data as any)
                    : await createPhoto(data as any);

                if (result?.data) {
                    setItems((prev) =>
                        prev.map((i) =>
                            i.id === item.id ? { ...i, status: "success" } : i
                        )
                    );
                    successCount++;
                } else {
                    setItems((prev) =>
                        prev.map((i) =>
                            i.id === item.id
                                ? { ...i, status: "error", error: result?.serverError || "Erreur inconnue" }
                                : i
                        )
                    );
                    errorCount++;
                }
            } catch (error: any) {
                setItems((prev) =>
                    prev.map((i) =>
                        i.id === item.id
                            ? { ...i, status: "error", error: error?.message || "Erreur de connexion" }
                            : i
                    )
                );
                errorCount++;
            }
        }

        setIsUploading(false);

        if (successCount > 0 && errorCount === 0) {
            toast.success(`${successCount} ${type === "video" ? "vidéo(s)" : "photo(s)"} ajoutée(s) avec succès !`);
            setTimeout(() => {
                router.push("/admin/gallery");
                router.refresh();
            }, 1500);
        } else if (successCount > 0) {
            toast.warning(`${successCount} succès, ${errorCount} erreur(s)`);
        } else {
            toast.error("Toutes les publications ont échoué");
        }
    };

    const pendingCount = items.filter((i) => i.status === "pending" && i.url && i.title).length;
    const successCount = items.filter((i) => i.status === "success").length;
    const errorCount = items.filter((i) => i.status === "error").length;

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className={`p-6 ${type === "video" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-pink-500 to-purple-600"} text-white`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        {type === "video" ? <Video className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Publication multiple - {type === "video" ? "Vidéos" : "Photos"}
                        </h1>
                        <p className="text-white/80 text-sm mt-1">
                            Ajoutez plusieurs {type === "video" ? "vidéos YouTube" : "photos Google Drive"} en une seule fois
                        </p>
                    </div>
                </div>
            </div>

            {/* Shared Metadata */}
            <div className="p-6 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900 mb-4">Métadonnées communes</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Événement</label>
                        {events.length > 0 ? (
                            <Select value={eventId} onChange={(e) => setEventId(e.target.value)}>
                                <option value="">Aucun</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id.toString()}>
                                        {event.title}
                                    </option>
                                ))}
                            </Select>
                        ) : (
                            <Input
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder="Nom de l'événement"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Année</label>
                        <Input
                            value={eventYear}
                            onChange={(e) => setEventYear(e.target.value)}
                            type="number"
                            placeholder="2025"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Catégorie</label>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categoryOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                    </div>

                    {events.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom personnalisé</label>
                            <Input
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder="Optionnel"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Items List */}
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                        {type === "video" ? "Vidéos" : "Photos"} à ajouter ({items.length})
                    </h3>
                    <button
                        type="button"
                        onClick={addItem}
                        disabled={isUploading}
                        className="flex items-center gap-2 text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter une ligne
                    </button>
                </div>

                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${item.status === "success"
                                    ? "border-green-300 bg-green-50"
                                    : item.status === "error"
                                        ? "border-red-300 bg-red-50"
                                        : item.status === "uploading"
                                            ? "border-blue-300 bg-blue-50"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                        >
                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                                {item.status === "success" ? (
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : item.status === "error" ? (
                                    <XCircle className="w-6 h-6 text-red-500" />
                                ) : item.status === "uploading" ? (
                                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                ) : (
                                    <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-400">
                                        {index + 1}
                                    </span>
                                )}
                            </div>

                            {/* URL Input */}
                            <div className="flex-1">
                                <Input
                                    value={item.url}
                                    onChange={(e) => handleUrlChange(item.id, e.target.value, index)}
                                    placeholder={
                                        type === "video"
                                            ? "https://youtube.com/watch?v=..."
                                            : "https://drive.google.com/file/d/..."
                                    }
                                    disabled={isUploading || item.status === "success"}
                                    className="text-sm"
                                />
                            </div>

                            {/* Title Input */}
                            <div className="w-48">
                                <Input
                                    value={item.title}
                                    onChange={(e) => updateItem(item.id, "title", e.target.value)}
                                    placeholder="Titre"
                                    disabled={isUploading || item.status === "success"}
                                    className="text-sm"
                                />
                            </div>

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                disabled={isUploading || items.length === 1}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Quick Add Multiple */}
                <button
                    type="button"
                    onClick={() => {
                        for (let i = 0; i < 5; i++) {
                            addItem();
                        }
                    }}
                    disabled={isUploading}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                    + Ajouter 5 lignes
                </button>
            </div>

            {/* Stats */}
            {(successCount > 0 || errorCount > 0) && (
                <div className="px-6 pb-4">
                    <div className="flex items-center gap-4 text-sm">
                        {successCount > 0 && (
                            <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                {successCount} réussi(s)
                            </span>
                        )}
                        {errorCount > 0 && (
                            <span className="flex items-center gap-1 text-red-600">
                                <XCircle className="w-4 h-4" />
                                {errorCount} erreur(s)
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 p-6 bg-gray-50 border-t">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={isUploading}
                >
                    Annuler
                </button>
                <button
                    type="button"
                    onClick={handleBulkUpload}
                    disabled={isUploading || pendingCount === 0}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${type === "video"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-pink-500 text-white hover:bg-pink-600"
                        }`}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publication en cours...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Publier {pendingCount > 0 ? `(${pendingCount})` : ""}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  videoGallerySchema,
  photoGallerySchema,
  type VideoGalleryInput,
  type PhotoGalleryInput,
  getDriveImageUrl,
  getDriveThumbnailUrl,
} from "@/lib/validations/gallery";
import { createVideo, updateVideo, createPhoto, updatePhoto } from "./actions";
import { Video, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/services/youtube";

type Event = {
  id: number;
  title: string;
  startDate: Date;
};

type GalleryFormProps = {
  type: "video" | "photo";
  item?: (VideoGalleryInput | PhotoGalleryInput) & { id: number };
  events?: Event[];
};

export function GalleryForm({ type, item, events = [] }: GalleryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const schema = type === "video" ? videoGallerySchema : photoGallerySchema;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VideoGalleryInput | PhotoGalleryInput>({
    resolver: zodResolver(schema),
    defaultValues: item || {
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
    },
  });

  const mediaUrl = watch(type === "video" ? "videoUrl" : "imageUrl") as string;

  // Auto-generate preview when URL changes
  useEffect(() => {
    if (mediaUrl) {
      if (type === "video") {
        const thumbnail = getYouTubeThumbnailUrl(mediaUrl, "hqdefault");
        setPreviewUrl(thumbnail);
      } else {
        const driveUrl = getDriveImageUrl(mediaUrl);
        setPreviewUrl(driveUrl);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [mediaUrl, type]);

  const onSubmit = async (data: VideoGalleryInput | PhotoGalleryInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (type === "video") {
        result = item
          ? await updateVideo({ ...data, id: item.id } as any)
          : await createVideo(data as VideoGalleryInput);
      } else {
        result = item
          ? await updatePhoto({ ...data, id: item.id } as any)
          : await createPhoto(data as PhotoGalleryInput);
      }

      if (result?.data) {
        router.push("/admin/gallery");
        router.refresh();
      } else if (result?.serverError) {
        setError(result.serverError);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: Forum Spring 2025 - Jour 1"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Description du contenu..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Event Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lier à un événement <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            {events.length > 0 ? (
              <>
                <select
                  {...register("eventId")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Aucun événement</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} ({new Date(event.startDate).getFullYear()})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Liez cette {type === "video" ? "vidéo" : "photo"} à un événement existant. Sinon, utilisez les champs ci-dessous.
                </p>
              </>
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                Aucun événement disponible. Utilisez les champs "Nom de l'événement" et "Année" ci-dessous.
              </div>
            )}
            {errors.eventId && (
              <p className="mt-1 text-sm text-red-600">{errors.eventId.message}</p>
            )}
          </div>

          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'événement <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <input
              type="text"
              {...register("eventName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: Forum Spring 2025"
            />
            <p className="mt-1 text-xs text-gray-500">
              Utilisez ce champ si l'événement n'existe pas dans la liste ci-dessus
            </p>
            {errors.eventName && (
              <p className="mt-1 text-sm text-red-600">{errors.eventName.message}</p>
            )}
          </div>

          {/* Event Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <input
              type="number"
              {...register("eventYear")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="2025"
              min="2000"
              max={new Date().getFullYear() + 10}
            />
            {errors.eventYear && (
              <p className="mt-1 text-sm text-red-600">{errors.eventYear.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <select
              {...register("category")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="Forum">Forum</option>
              <option value="Conférence">Conférence</option>
              <option value="Atelier">Atelier</option>
              <option value="Networking">Networking</option>
              <option value="Autre">Autre</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordre d'affichage
            </label>
            <input
              type="number"
              {...register("sortOrder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              Plus le nombre est bas, plus l'élément apparaît en premier
            </p>
            {errors.sortOrder && (
              <p className="mt-1 text-sm text-red-600">{errors.sortOrder.message}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Media URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === "video" ? "Lien YouTube" : "Lien Google Drive"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register(type === "video" ? "videoUrl" : "imageUrl")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder={
                type === "video"
                  ? "https://www.youtube.com/watch?v=..."
                  : "https://drive.google.com/file/d/..."
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              {type === "video"
                ? "Vidéo non répertoriée uniquement - Tous les formats YouTube acceptés"
                : "Lien de partage Google Drive (Tout le monde avec le lien)"}
            </p>
            {(errors as any)[type === "video" ? "videoUrl" : "imageUrl"] && (
              <p className="mt-1 text-sm text-red-600">
                {(errors as any)[type === "video" ? "videoUrl" : "imageUrl"].message}
              </p>
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-600 mb-2">Aperçu :</p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    {type === "video" ? (
                      <Video className="w-12 h-12 text-white" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-white" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Thumbnail URL (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miniature personnalisée{" "}
              <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <input
              type="text"
              {...register("thumbnailUrl")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Laissez vide pour utiliser la miniature par défaut
            </p>
            {errors.thumbnailUrl && (
              <p className="mt-1 text-sm text-red-600">
                {errors.thumbnailUrl.message}
              </p>
            )}
          </div>

          {/* Status Checkboxes */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("isActive")}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label className="ml-2 text-sm text-gray-700">
                Actif (visible sur le site)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label className="ml-2 text-sm text-gray-700">
                Mise en avant (apparaît en premier)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {item ? "Mettre à jour" : "Créer"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

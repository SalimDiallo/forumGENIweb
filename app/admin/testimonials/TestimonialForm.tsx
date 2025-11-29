"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  videoTestimonialSchema,
  type VideoTestimonialInput,
} from "@/lib/validations/testimonials";
import { createTestimonial, updateTestimonial } from "./actions";
import { Video, Save, Loader2 } from "lucide-react";
import { getYouTubeThumbnailUrl } from "@/lib/services/youtube";

type TestimonialFormProps = {
  testimonial?: VideoTestimonialInput & { id: number };
};

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VideoTestimonialInput>({
    resolver: zodResolver(videoTestimonialSchema),
    defaultValues: testimonial || {
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
    },
  });

  const videoUrl = watch("videoUrl");

  // Auto-generate thumbnail preview when videoUrl changes
  const handleVideoUrlChange = (url: string) => {
    if (url) {
      const thumbnail = getYouTubeThumbnailUrl(url, "hqdefault");
      setPreviewThumbnail(thumbnail);
    } else {
      setPreviewThumbnail(null);
    }
  };

  const onSubmit = async (data: VideoTestimonialInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = testimonial
        ? await updateTestimonial({ ...data, id: testimonial.id })
        : await createTestimonial(data);

      if (result?.data) {
        router.push("/admin/testimonials");
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: Sarah El Mansouri"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poste / Rôle <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <input
              type="text"
              {...register("position")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: Data Scientist"
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entreprise <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <input
              type="text"
              {...register("company")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: Google"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
            )}
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année de promotion <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <input
              type="number"
              {...register("graduationYear")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Ex: 2020"
              min="1900"
              max={new Date().getFullYear() + 10}
            />
            {errors.graduationYear && (
              <p className="mt-1 text-sm text-red-600">
                {errors.graduationYear.message}
              </p>
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
              Plus le nombre est bas, plus le témoignage apparaît en premier
            </p>
            {errors.sortOrder && (
              <p className="mt-1 text-sm text-red-600">{errors.sortOrder.message}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien YouTube <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("videoUrl")}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepte tous les formats YouTube (watch?v=, youtu.be/, embed/, etc.)
            </p>
            {errors.videoUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>
            )}

            {/* Video Preview */}
            {previewThumbnail && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Aperçu de la miniature :
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewThumbnail}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Video className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Thumbnail URL (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miniature personnalisée (optionnel)
            </label>
            <input
              type="text"
              {...register("thumbnailUrl")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Laissez vide pour utiliser la miniature YouTube par défaut
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
                Témoignage vedette
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Fields */}
      <div className="space-y-4">
        {/* Quote */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Citation courte
          </label>
          <textarea
            {...register("quote")}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Une citation courte qui apparaîtra sur la carte du témoignage..."
          />
          {errors.quote && (
            <p className="mt-1 text-sm text-red-600">{errors.quote.message}</p>
          )}
        </div>

        {/* Full Transcript */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transcription complète (optionnel)
          </label>
          <textarea
            {...register("fullTranscript")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="La transcription complète du témoignage vidéo..."
          />
          {errors.fullTranscript && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullTranscript.message}
            </p>
          )}
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
              {testimonial ? "Mettre à jour" : "Créer"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

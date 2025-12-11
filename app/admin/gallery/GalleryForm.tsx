"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  videoGallerySchema,
  photoGallerySchema,
  type VideoGalleryInput,
  type PhotoGalleryInput,
  getDriveImageUrl,
} from "@/lib/validations/gallery";
import { createVideo, updateVideo, createPhoto, updatePhoto } from "./actions";
import { Video, Image as ImageIcon, Save, AlertCircle, Link2, Calendar, Tag, Eye, Star, ArrowRight, CheckCircle, Info, Youtube, HardDrive } from "lucide-react";
import { getYouTubeThumbnailUrl } from "@/lib/services/youtube";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "@/hooks/useForm";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatErrorsForToast } from "@/lib/form-utils";

type Event = {
  id: number;
  title: string;
  startDate: Date;
};

// Unified form values type that includes both videoUrl and imageUrl as optional
type GalleryFormValues = {
  title: string;
  description: string;
  eventId: string;
  eventName: string;
  eventYear: string;
  category: string;
  sortOrder: string;
  thumbnailUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  videoUrl?: string;
  imageUrl?: string;
};

type GalleryFormProps = {
  type: "video" | "photo";
  // Using a more flexible type to accept Prisma-returned objects (which use null instead of undefined)
  item?: { id: number } & Record<string, any>;
  events?: Event[];
};

const categoryOptions = [
  { value: "", label: "Sélectionner une catégorie..." },
  { value: "Forum", label: "🎯 Forum" },
  { value: "Conférence", label: "🎤 Conférence" },
  { value: "Atelier", label: "🔧 Atelier" },
  { value: "Networking", label: "🤝 Networking" },
  { value: "Autre", label: "📁 Autre" },
];

export function GalleryForm({ type, item, events = [] }: GalleryFormProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [step, setStep] = useState(1);
  const isEditing = !!item;

  const schema = type === "video" ? videoGallerySchema : photoGallerySchema;

  // Initial values
  const initialValues = item
    ? {
      title: item.title ?? "",
      description: item.description ?? "",
      eventId: (item as any).eventId?.toString() ?? "",
      eventName: item.eventName ?? "",
      eventYear: item.eventYear?.toString() ?? "",
      category: item.category ?? "",
      sortOrder: item.sortOrder?.toString() ?? "0",
      thumbnailUrl: item.thumbnailUrl ?? "",
      isActive: item.isActive ?? true,
      isFeatured: item.isFeatured ?? false,
      ...(type === "video"
        ? { videoUrl: item.videoUrl ?? "" }
        : { imageUrl: item.imageUrl ?? "" }),
    }
    : {
      title: "",
      description: "",
      eventId: "",
      eventName: "",
      eventYear: new Date().getFullYear().toString(),
      category: "",
      sortOrder: "0",
      thumbnailUrl: "",
      isActive: true,
      isFeatured: false,
      ...(type === "video" ? { videoUrl: "" } : { imageUrl: "" }),
    };

  const form = useForm<GalleryFormValues>({
    initialValues: initialValues as GalleryFormValues,
    validationSchema: schema as any,
    validateOnChange: true,
  });

  const mediaUrl = type === "video" ? form.values.videoUrl : form.values.imageUrl;

  // Auto-generate preview when URL changes
  useEffect(() => {
    setPreviewError(false);
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

  // Mutation for create/update
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const transformedData = {
        ...data,
        eventId: data.eventId ? Number(data.eventId) : undefined,
        eventYear: data.eventYear ? Number(data.eventYear) : undefined,
        sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
      };

      if (type === "video") {
        return item
          ? await updateVideo({ ...transformedData, id: item.id })
          : await createVideo(transformedData);
      } else {
        return item
          ? await updatePhoto({ ...transformedData, id: item.id })
          : await createPhoto(transformedData);
      }
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success(
          item
            ? `${type === "video" ? "Vidéo" : "Photo"} modifiée avec succès !`
            : `${type === "video" ? "Vidéo" : "Photo"} ajoutée avec succès !`
        );
        router.push("/admin/gallery");
        router.refresh();
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Une erreur est survenue");
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!form.isValid) {
      const errorMessages = formatErrorsForToast(form.errors, 4);
      toast.error(
        <div>
          <strong>Veuillez corriger les erreurs :</strong>
          <ul className="list-disc list-inside pl-2 text-xs mt-1 space-y-0.5">
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }
    mutation.mutate(values);
  });

  const errorCount = Object.keys(form.errors).length;
  const hasMediaUrl = mediaUrl && mediaUrl.length > 10;
  const hasTitle = form.values.title && form.values.title.length >= 2;

  // Step indicators
  const steps = [
    { num: 1, label: "Média", done: hasMediaUrl, icon: type === "video" ? Youtube : HardDrive },
    { num: 2, label: "Infos", done: hasTitle, icon: Info },
    { num: 3, label: "Options", done: true, icon: Tag },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header with gradient */}
      <div className={`p-6 ${type === "video" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-pink-500 to-purple-600"} text-white`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            {type === "video" ? (
              <Video className="w-8 h-8" />
            ) : (
              <ImageIcon className="w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Modifier" : "Ajouter"} {type === "video" ? "une vidéo" : "une photo"}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {type === "video" ? "YouTube • Non répertorié recommandé" : "Google Drive • Accès public requis"}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        {!isEditing && (
          <div className="flex items-center gap-2 mt-6">
            {steps.map((s, idx) => (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${step === s.num
                    ? "bg-white text-gray-900"
                    : s.done
                      ? "bg-white/30 text-white"
                      : "bg-white/10 text-white/60"
                    }`}
                >
                  {s.done && step !== s.num ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                  {s.label}
                </button>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-white/40" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-8">
        {/* STEP 1: Media URL */}
        {(step === 1 || isEditing) && (
          <div className={`space-y-4 ${!isEditing && step !== 1 ? "hidden" : ""}`}>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              {type === "video" ? <Youtube className="w-5 h-5 text-red-500" /> : <HardDrive className="w-5 h-5 text-blue-500" />}
              {type === "video" ? "Lien YouTube" : "Lien Google Drive"}
            </div>

            <div className={`p-4 rounded-xl border-2 border-dashed transition-colors ${hasMediaUrl && !previewError
              ? "border-green-300 bg-green-50"
              : form.hasError(type === "video" ? "videoUrl" : "imageUrl")
                ? "border-red-300 bg-red-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}>
              <Input
                value={mediaUrl}
                onChange={(e) =>
                  form.setFieldValue(type === "video" ? "videoUrl" : "imageUrl", e.target.value)
                }
                onBlur={() => form.setFieldTouched(type === "video" ? "videoUrl" : "imageUrl")}
                placeholder={
                  type === "video"
                    ? "Collez le lien YouTube ici... (ex: https://youtu.be/xxxxx)"
                    : "Collez le lien Google Drive ici... (ex: https://drive.google.com/file/d/xxxxx)"
                }
                className="text-center text-lg"
              />
              {form.hasError(type === "video" ? "videoUrl" : "imageUrl") && (
                <p className="text-red-600 text-sm text-center mt-2">
                  {form.getError(type === "video" ? "videoUrl" : "imageUrl")}
                </p>
              )}
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="relative">
                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Aperçu
                </p>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                  {!previewError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`p-4 rounded-full ${type === "video" ? "bg-red-500" : "bg-pink-500"} shadow-lg`}>
                        {type === "video" ? (
                          <Video className="w-8 h-8 text-white" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  {previewError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center text-white">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-yellow-400" />
                        <p>Aperçu non disponible</p>
                        <p className="text-sm text-gray-400">Le média sera quand même enregistré</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isEditing && hasMediaUrl && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* STEP 2: Basic Info */}
        {(step === 2 || isEditing) && (
          <div className={`space-y-4 ${!isEditing && step !== 2 ? "hidden" : ""}`}>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Info className="w-5 h-5 text-blue-500" />
              Informations
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">
                  Titre <span className="text-red-600">*</span>
                </label>
                <Input
                  value={form.values.title}
                  onChange={(e) => form.setFieldValue("title", e.target.value)}
                  onBlur={() => form.setFieldTouched("title")}
                  placeholder="Ex: Forum Spring 2025 - Conférence d'ouverture"
                  error={form.hasError("title")}
                  errorMessage={form.getError("title")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  value={form.values.description}
                  onChange={(e) => form.setFieldValue("description", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  placeholder="Décrivez brièvement le contenu..."
                />
              </div>

              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" /> Événement lié
                </label>
                {events.length > 0 ? (
                  <Select
                    value={form.values.eventId}
                    onChange={(e) => form.setFieldValue("eventId", e.target.value)}
                  >
                    <option value="">Aucun événement</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id.toString()}>
                        {event.title} ({new Date(event.startDate).getFullYear()})
                      </option>
                    ))}
                  </Select>
                ) : (
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                    Aucun événement disponible
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <Tag className="w-4 h-4 text-gray-400" /> Catégorie
                </label>
                <Select
                  value={form.values.category}
                  onChange={(e) => form.setFieldValue("category", e.target.value)}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block font-medium mb-1">Nom personnalisé</label>
                <Input
                  value={form.values.eventName}
                  onChange={(e) => form.setFieldValue("eventName", e.target.value)}
                  placeholder="Si hors événement..."
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Année</label>
                <Input
                  value={form.values.eventYear}
                  onChange={(e) => form.setFieldValue("eventYear", e.target.value)}
                  type="number"
                  placeholder={new Date().getFullYear().toString()}
                />
              </div>
            </div>

            {!isEditing && hasTitle && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* STEP 3: Options */}
        {(step === 3 || isEditing) && (
          <div className={`space-y-4 ${!isEditing && step !== 3 ? "hidden" : ""}`}>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Tag className="w-5 h-5 text-purple-500" />
              Options
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Ordre d'affichage</label>
                <Input
                  value={form.values.sortOrder}
                  onChange={(e) => form.setFieldValue("sortOrder", e.target.value)}
                  type="number"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Plus petit = affiché en premier</p>
              </div>

              <div>
                <label className="block font-medium mb-1">Miniature personnalisée</label>
                <Input
                  value={form.values.thumbnailUrl}
                  onChange={(e) => form.setFieldValue("thumbnailUrl", e.target.value)}
                  placeholder="https://... (optionnel)"
                />
              </div>
            </div>

            {/* Toggle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.values.isActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.values.isActive}
                    onChange={(e) => form.setFieldValue("isActive", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${form.values.isActive ? "bg-green-500" : "bg-gray-200"}`}>
                    <Eye className={`w-5 h-5 ${form.values.isActive ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <p className="font-medium">Visible sur le site</p>
                    <p className="text-sm text-gray-500">
                      {form.values.isActive ? "Activé" : "Désactivé"}
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.values.isFeatured
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.values.isFeatured}
                    onChange={(e) => form.setFieldValue("isFeatured", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${form.values.isFeatured ? "bg-amber-500" : "bg-gray-200"}`}>
                    <Star className={`w-5 h-5 ${form.values.isFeatured ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <p className="font-medium">Mise en avant</p>
                    <p className="text-sm text-gray-500">
                      {form.values.isFeatured ? "En vedette" : "Normal"}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Error Summary */}
      {errorCount > 0 && (
        <div className="mx-6 mb-4 flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-red-600 text-sm">
            <span className="font-bold block mb-1">
              {errorCount} erreur{errorCount > 1 ? "s" : ""} à corriger :
            </span>
            <ul className="list-disc ml-4 space-y-0.5">
              {formatErrorsForToast(form.errors, 5).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 p-6 bg-gray-50 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={mutation.isPending}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={mutation.isPending || !hasMediaUrl || !hasTitle}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${type === "video"
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
        >
          {mutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isEditing ? "Modification..." : "Création..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? "Enregistrer" : "Publier"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

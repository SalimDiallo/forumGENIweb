"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  videoTestimonialSchema,
  type VideoTestimonialInput,
} from "@/lib/validations/testimonials";
import { createTestimonial, updateTestimonial } from "./actions";
import {
  Video,
  Save,
  User,
  Building2,
  GraduationCap,
  Youtube,
  Quote,
  FileText,
  Eye,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Hash,
} from "lucide-react";
import { getYouTubeThumbnailUrl } from "@/lib/services/youtube";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "@/hooks/useForm";
import { Input } from "@/components/ui/input";
import { formatErrorsForToast } from "@/lib/form-utils";

type TestimonialFormProps = {
  testimonial?: { id: number } & Record<string, any>;
};

type FormValues = {
  name: string;
  position: string;
  company: string;
  graduationYear: string;
  videoUrl: string;
  thumbnailUrl: string;
  quote: string;
  fullTranscript: string;
  sortOrder: string;
  isActive: boolean;
  isFeatured: boolean;
};

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [step, setStep] = useState(1);
  const isEditing = !!testimonial;

  // Initial values
  const initialValues: FormValues = testimonial
    ? {
      name: testimonial.name ?? "",
      position: testimonial.position ?? "",
      company: testimonial.company ?? "",
      graduationYear: testimonial.graduationYear?.toString() ?? "",
      videoUrl: testimonial.videoUrl ?? "",
      thumbnailUrl: testimonial.thumbnailUrl ?? "",
      quote: testimonial.quote ?? "",
      fullTranscript: testimonial.fullTranscript ?? "",
      sortOrder: testimonial.sortOrder?.toString() ?? "0",
      isActive: testimonial.isActive ?? true,
      isFeatured: testimonial.isFeatured ?? false,
    }
    : {
      name: "",
      position: "",
      company: "",
      graduationYear: "",
      videoUrl: "",
      thumbnailUrl: "",
      quote: "",
      fullTranscript: "",
      sortOrder: "0",
      isActive: true,
      isFeatured: false,
    };

  const form = useForm<FormValues>({
    initialValues,
    validationSchema: videoTestimonialSchema as any,
    validateOnChange: true,
  });

  // Auto-generate preview when videoUrl changes
  useEffect(() => {
    setPreviewError(false);
    if (form.values.videoUrl) {
      const thumbnail = getYouTubeThumbnailUrl(form.values.videoUrl, "hqdefault");
      setPreviewUrl(thumbnail);
    } else {
      setPreviewUrl(null);
    }
  }, [form.values.videoUrl]);

  // Mutation for create/update
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const transformedData = {
        ...data,
        graduationYear: data.graduationYear ? Number(data.graduationYear) : null,
        sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
        position: data.position || null,
        company: data.company || null,
        thumbnailUrl: data.thumbnailUrl || null,
        quote: data.quote || null,
        fullTranscript: data.fullTranscript || null,
      };

      return testimonial
        ? await updateTestimonial({ ...transformedData, id: testimonial.id })
        : await createTestimonial(transformedData);
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success(
          testimonial
            ? "Témoignage modifié avec succès !"
            : "Témoignage ajouté avec succès !"
        );
        router.push("/admin/testimonials");
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
  const hasVideoUrl = form.values.videoUrl && form.values.videoUrl.length > 10;
  const hasName = form.values.name && form.values.name.length >= 2;

  // Step indicators
  const steps = [
    { num: 1, label: "Vidéo", done: hasVideoUrl, icon: Youtube },
    { num: 2, label: "Profil", done: hasName, icon: User },
    { num: 3, label: "Contenu", done: true, icon: Quote },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header with gradient */}
      <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Modifier" : "Ajouter"} un témoignage
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Témoignage vidéo YouTube d'un ancien étudiant
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
        {/* STEP 1: Video URL */}
        {(step === 1 || isEditing) && (
          <div className={`space-y-4 ${!isEditing && step !== 1 ? "hidden" : ""}`}>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Youtube className="w-5 h-5 text-red-500" />
              Lien YouTube
            </div>

            <div
              className={`p-4 rounded-xl border-2 border-dashed transition-colors ${hasVideoUrl && !previewError
                  ? "border-green-300 bg-green-50"
                  : form.hasError("videoUrl")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
            >
              <Input
                value={form.values.videoUrl}
                onChange={(e) => form.setFieldValue("videoUrl", e.target.value)}
                onBlur={() => form.setFieldTouched("videoUrl")}
                placeholder="Collez le lien YouTube ici... (ex: https://youtu.be/xxxxx)"
                className="text-center text-lg"
              />
              {form.hasError("videoUrl") && (
                <p className="text-red-600 text-sm text-center mt-2">
                  {form.getError("videoUrl")}
                </p>
              )}
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="relative">
                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Aperçu
                </p>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-lg max-w-md">
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                  {!previewError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 rounded-full bg-red-500 shadow-lg">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  {previewError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center text-white">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-yellow-400" />
                        <p>Aperçu non disponible</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isEditing && hasVideoUrl && (
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

        {/* STEP 2: Profile Info */}
        {(step === 2 || isEditing) && (
          <div className={`space-y-4 ${!isEditing && step !== 2 ? "hidden" : ""}`}>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="w-5 h-5 text-purple-500" />
              Informations du témoignant
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">
                  Nom complet <span className="text-red-600">*</span>
                </label>
                <Input
                  value={form.values.name}
                  onChange={(e) => form.setFieldValue("name", e.target.value)}
                  onBlur={() => form.setFieldTouched("name")}
                  placeholder="Ex: Sarah El Mansouri"
                  error={form.hasError("name")}
                  errorMessage={form.getError("name")}
                />
              </div>

              {/* Position */}
              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Poste / Rôle
                </label>
                <Input
                  value={form.values.position}
                  onChange={(e) => form.setFieldValue("position", e.target.value)}
                  placeholder="Ex: Data Scientist"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block font-medium mb-1">Entreprise</label>
                <Input
                  value={form.values.company}
                  onChange={(e) => form.setFieldValue("company", e.target.value)}
                  placeholder="Ex: Google"
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  Année de promotion
                </label>
                <Input
                  value={form.values.graduationYear}
                  onChange={(e) => form.setFieldValue("graduationYear", e.target.value)}
                  type="number"
                  placeholder="Ex: 2020"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <Hash className="w-4 h-4 text-gray-400" />
                  Ordre d'affichage
                </label>
                <Input
                  value={form.values.sortOrder}
                  onChange={(e) => form.setFieldValue("sortOrder", e.target.value)}
                  type="number"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Plus petit = affiché en premier</p>
              </div>
            </div>

            {!isEditing && hasName && (
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

        {/* STEP 3: Content & Options */}
        {(step === 3 || isEditing) && (
          <div className={`space-y-4 ${!isEditing && step !== 3 ? "hidden" : ""}`}>
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Quote className="w-5 h-5 text-pink-500" />
              Contenu
            </div>

            {/* Quote */}
            <div>
              <label className="block font-medium mb-1">Citation courte</label>
              <textarea
                value={form.values.quote}
                onChange={(e) => form.setFieldValue("quote", e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Une citation courte et impactante..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Apparaîtra sur la carte du témoignage
              </p>
            </div>

            {/* Full Transcript */}
            <div>
              <label className="block font-medium mb-1 flex items-center gap-1">
                <FileText className="w-4 h-4 text-gray-400" />
                Transcription complète
                <span className="text-gray-400 text-xs">(optionnel)</span>
              </label>
              <textarea
                value={form.values.fullTranscript}
                onChange={(e) => form.setFieldValue("fullTranscript", e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="La transcription complète pour le SEO..."
              />
            </div>

            {/* Custom Thumbnail */}
            <div>
              <label className="block font-medium mb-1">
                Miniature personnalisée
                <span className="text-gray-400 text-xs ml-1">(optionnel)</span>
              </label>
              <Input
                value={form.values.thumbnailUrl}
                onChange={(e) => form.setFieldValue("thumbnailUrl", e.target.value)}
                placeholder="https://... (laissez vide pour la miniature YouTube)"
              />
            </div>

            {/* Toggle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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
                    <p className="font-medium">Témoignage vedette</p>
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
          disabled={mutation.isPending || !hasVideoUrl || !hasName}
          className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200"
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

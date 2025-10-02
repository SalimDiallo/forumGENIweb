"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateEventSchema } from "@/lib/validations/events";
import { Save, AlertCircle, Calendar, MapPin, Users, Globe, DollarSign, Image, FileText, Settings, UserCheck } from "lucide-react";
import { useState } from "react";
import MarkdownEditor from "@/components/MardownEditor";

type FormTab = "basic" | "details" | "registration" | "seo";

interface EditEventFormProps {
  defaultValues: any;
  onSubmit: (values: z.infer<typeof updateEventSchema>) => void;
  onCancel: () => void;
  statusOptions: { value: string; label: string; color: string }[];
  eventTypeOptions: { value: string; label: string; icon: string }[];
  isSubmitting?: boolean;
  serverError?: string;
}

// Helper to convert nulls to undefined for string fields
function cleanDefaultValues<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = { ...obj };
  // List of fields that should be string | undefined
  const stringFields = [
    "title",
    "slug",
    "description",
    "shortDescription",
    "featuredImage",
    "location",
    "address",
    "city",
    "country",
    "registrationUrl",
    "registrationEmail",
    "registrationPhone",
    "registrationForm",
    "organizer",
    "organizerWebsite",
    "organizerEmail",
    "organizerPhone",
    "agenda",
    "speakers",
    "sponsors",
    "requirements",
    "whatToBring",
    "metaTitle",
    "metaDescription",
    "virtualLink",
  ];
  
  for (const key of stringFields) {
    if (key in cleaned && cleaned[key] === null) {
      cleaned[key] = undefined;
    }
  }
  // Dates: convert to ISO string for input[type=datetime-local]
  if (cleaned.startDate) cleaned.startDate = new Date(cleaned.startDate).toISOString().slice(0, 16);
  if (cleaned.endDate) cleaned.endDate = new Date(cleaned.endDate).toISOString().slice(0, 16);
  if (cleaned.registrationStart) cleaned.registrationStart = cleaned.registrationStart ? new Date(cleaned.registrationStart).toISOString().slice(0, 16) : undefined;
  if (cleaned.registrationEnd) cleaned.registrationEnd = cleaned.registrationEnd ? new Date(cleaned.registrationEnd).toISOString().slice(0, 16) : undefined;
  return cleaned as T;
}

export default function EditEventForm({
  defaultValues,
  onSubmit,
  onCancel,
  statusOptions,
  eventTypeOptions,
  isSubmitting,
  serverError,
}: EditEventFormProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");

  // Clean nulls to undefined for react-hook-form compatibility
  const cleanedDefaultValues = cleanDefaultValues(defaultValues);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<z.infer<typeof updateEventSchema>>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: cleanedDefaultValues,
  });

  const tabs = [
    { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
    { id: "details" as FormTab, label: "Détails", icon: Settings },
    { id: "registration" as FormTab, label: "Inscription", icon: UserCheck },
    { id: "seo" as FormTab, label: "SEO", icon: Globe },
  ];

  const descriptionValue = watch("description");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto px-1">
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de l'événement *
                  </label>
                  <input
                    id="title"
                    {...register("title")}
                    placeholder="Ex: Forum Entrepreneuriat 2025"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL) *
                  </label>
                  <input
                    id="slug"
                    {...register("slug")}
                    placeholder="forum-entrepreneuriat-2025"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.slug && (
                    <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'événement *
                  </label>
                  <select
                    id="eventType"
                    {...register("eventType")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {eventTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <p className="text-red-600 text-sm mt-1">{errors.eventType.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut *
                  </label>
                  <select
                    id="status"
                    {...register("status")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description courte
                  </label>
                  <textarea
                    id="shortDescription"
                    {...register("shortDescription")}
                    placeholder="Résumé en une phrase"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.shortDescription && (
                    <p className="text-red-600 text-sm mt-1">{errors.shortDescription.message}</p>
                  )}
                </div>

                {/* Markdown input for description */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description complète (Markdown supporté)
                  </label>
                  <MarkdownEditor
                    value={descriptionValue || ""}
                    onChange={val => setValue("description", val, { shouldValidate: true })}
                    placeholder="Description détaillée de l'événement (supporte Markdown)"
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Image principale (URL)
                  </label>
                  <input
                    id="featuredImage"
                    {...register("featuredImage")}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.featuredImage && (
                    <p className="text-red-600 text-sm mt-1">{errors.featuredImage.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début *
                  </label>
                  <input
                    id="startDate"
                    type="datetime-local"
                    {...register("startDate")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.startDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin *
                  </label>
                  <input
                    id="endDate"
                    type="datetime-local"
                    {...register("endDate")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.endDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu
                  </label>
                  <input
                    id="location"
                    {...register("location")}
                    placeholder="Ex: Université, Casablanca"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.location && (
                    <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="isVirtual" className="block text-sm font-medium text-gray-700 mb-1">
                    Virtuel ?
                  </label>
                  <select
                    id="isVirtual"
                    {...register("isVirtual")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                  {errors.isVirtual && (
                    <p className="text-red-600 text-sm mt-1">{errors.isVirtual.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="virtualLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Lien virtuel (si applicable)
                  </label>
                  <input
                    id="virtualLink"
                    {...register("virtualLink")}
                    placeholder="https://meet.example.com/..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.virtualLink && (
                    <p className="text-red-600 text-sm mt-1">{errors.virtualLink.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="isFeatured" className="block text-sm font-medium text-gray-700 mb-1">
                    À la une ?
                  </label>
                  <select
                    id="isFeatured"
                    {...register("isFeatured")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                  {errors.isFeatured && (
                    <p className="text-red-600 text-sm mt-1">{errors.isFeatured.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="organizerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Organisateur
                  </label>
                  <input
                    id="organizerName"
                    {...register("organizerName")}
                    placeholder="Nom de l'organisateur"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.organizerName && (
                    <p className="text-red-600 text-sm mt-1">{errors.organizerName.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-1">
                    Agenda (Markdown)
                  </label>
                  <textarea
                    id="agenda"
                    {...register("agenda")}
                    placeholder="Programme de l'événement"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                  {errors.agenda && (
                    <p className="text-red-600 text-sm mt-1">{errors.agenda.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="speakers" className="block text-sm font-medium text-gray-700 mb-1">
                    Intervenants (Markdown)
                  </label>
                  <textarea
                    id="speakers"
                    {...register("speakers")}
                    placeholder="Liste des intervenants"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                  {errors.speakers && (
                    <p className="text-red-600 text-sm mt-1">{errors.speakers.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="sponsors" className="block text-sm font-medium text-gray-700 mb-1">
                    Sponsors (Markdown)
                  </label>
                  <textarea
                    id="sponsors"
                    {...register("sponsors")}
                    placeholder="Sponsors de l'événement"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                  {errors.sponsors && (
                    <p className="text-red-600 text-sm mt-1">{errors.sponsors.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Prérequis (Markdown)
                  </label>
                  <textarea
                    id="requirements"
                    {...register("requirements")}
                    placeholder="Prérequis pour participer"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                  {errors.requirements && (
                    <p className="text-red-600 text-sm mt-1">{errors.requirements.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="whatToBring" className="block text-sm font-medium text-gray-700 mb-1">
                    À apporter (Markdown)
                  </label>
                  <textarea
                    id="whatToBring"
                    {...register("whatToBring")}
                    placeholder="Ce que les participants doivent apporter"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                  {errors.whatToBring && (
                    <p className="text-red-600 text-sm mt-1">{errors.whatToBring.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "registration" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="registrationStart" className="block text-sm font-medium text-gray-700 mb-1">
                    Début des inscriptions
                  </label>
                  <input
                    id="registrationStart"
                    type="datetime-local"
                    {...register("registrationStart")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.registrationStart && (
                    <p className="text-red-600 text-sm mt-1">{errors.registrationStart.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="registrationEnd" className="block text-sm font-medium text-gray-700 mb-1">
                    Fin des inscriptions
                  </label>
                  <input
                    id="registrationEnd"
                    type="datetime-local"
                    {...register("registrationEnd")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.registrationEnd && (
                    <p className="text-red-600 text-sm mt-1">{errors.registrationEnd.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre max. de participants
                  </label>
                  <input
                    id="maxParticipants"
                    type="number"
                    min={0}
                    {...register("maxParticipants", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.maxParticipants && (
                    <p className="text-red-600 text-sm mt-1">{errors.maxParticipants.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="isFree" className="block text-sm font-medium text-gray-700 mb-1">
                    Gratuit ?
                  </label>
                  <select
                    id="isFree"
                    {...register("isFree")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                  {errors.isFree && (
                    <p className="text-red-600 text-sm mt-1">{errors.isFree.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (si payant)
                  </label>
                  <input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.price && (
                    <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Devise
                  </label>
                  <input
                    id="currency"
                    {...register("currency")}
                    placeholder="MAD"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.currency && (
                    <p className="text-red-600 text-sm mt-1">{errors.currency.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    id="metaTitle"
                    {...register("metaTitle")}
                    placeholder="Titre SEO"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.metaTitle && (
                    <p className="text-red-600 text-sm mt-1">{errors.metaTitle.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    {...register("metaDescription")}
                    placeholder="Description SEO"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.metaDescription && (
                    <p className="text-red-600 text-sm mt-1">{errors.metaDescription.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-6 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Sauvegarde…" : "Enregistrer"}
          </button>
        </div>

        {/* Error Messages */}
        {serverError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}
      </div>
    </form>
  );
}
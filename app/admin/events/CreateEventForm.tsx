"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema } from "@/lib/validations/events";
import { useAction } from "next-safe-action/hooks";
import { createEvent } from "./events.actions";
import { useEffect, useState } from "react";
import { FileText, Settings, UserCheck, Save, AlertCircle } from "lucide-react";
import MarkdownEditor from "@/components/MardownEditor";

type FormTab = "basic" | "details" | "registration";

interface CreateEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "ongoing", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];

const eventTypeOptions = [
  { value: "forum", label: "Forum" },
  { value: "workshop", label: "Atelier" },
  { value: "conference", label: "Conférence" },
  { value: "networking", label: "Networking" },
  { value: "webinar", label: "Webinaire" },
  { value: "other", label: "Autre" },
];

export default function CreateEventForm({ onSuccess, onCancel }: CreateEventFormProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");

  const create = useAction(createEvent);

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      slug: "",
      eventType: "forum",
      organizerName: "FGE",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date().toISOString().slice(0, 16),
      isFree: true,
      price: 0,
      currency: "MAD",
      status: "draft",
      isFeatured: false,
      isVirtual: false,
      shortDescription: "",
      description: "",
      featuredImage: "",
      registrationStart: "",
      registrationEnd: "",
      maxParticipants: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof createEventSchema>) {
    create.execute(values);
  }

  useEffect(() => {
    if (create.status === "hasSucceeded") {
      if (onSuccess) onSuccess();
      form.reset();
      setActiveTab("basic");
    }
  }, [create.status, onSuccess, form]);

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
            { id: "details" as FormTab, label: "Détails", icon: Settings },
            { id: "registration" as FormTab, label: "Inscription", icon: UserCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex items-center gap-1 px-4 py-2 -mb-px border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-700 font-semibold"
                  : "border-transparent text-gray-500 hover:text-emerald-600"
              }`}
              onClick={() => setActiveTab(tab.id)}
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
                    {...form.register("title")}
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
                    {...form.register("slug")}
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
                    {...form.register("eventType")}
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
                    {...form.register("status")}
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

                <div>
                  <label htmlFor="organizerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Organisateur
                  </label>
                  <input
                    id="organizerName"
                    {...form.register("organizerName")}
                    placeholder="FGE"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.organizerName && (
                    <p className="text-red-600 text-sm mt-1">{errors.organizerName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Image à la une (URL)
                  </label>
                  <input
                    id="featuredImage"
                    {...form.register("featuredImage")}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.featuredImage && (
                    <p className="text-red-600 text-sm mt-1">{errors.featuredImage.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description courte
                  </label>
                  <textarea
                    id="shortDescription"
                    {...form.register("shortDescription")}
                    placeholder="Résumé en une phrase"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.shortDescription && (
                    <p className="text-red-600 text-sm mt-1">{errors.shortDescription.message}</p>
                  )}
                </div>
               

                <div className="col-span-2">
                  <MarkdownEditor
                    value={form.watch("description") ?? ''}
                    onChange={(value) => form.setValue("description", value)}
                    placeholder="Description détaillée de l'événement en Markdown..."
                    error={errors.description?.message}
                    label="Description complète"
                    rows={8}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ... reste du code identique pour les autres onglets ... */}
        </div>

        {/* Error message */}
        {create.status === "hasErrored" && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">
              {create.result?.serverError?.message || "Erreur lors de la création de l'événement."}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={create.status === "executing"}
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={create.status === "executing"}
            className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-6 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {create.status === "executing" ? "Enregistrement..." : "Créer l'événement"}
          </button>
        </div>
      </div>
    </form>
  );
}
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MarkdownEditor from "@/components/MarkdownEditor";
import { FileText, Settings, UserCheck, Save, AlertCircle, Pencil, Loader2 } from "lucide-react";
import {
  eventTypeOptions,
  slugify,
  statusOptions,
} from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createEventSchema } from "./event.create.schema";
import { doCreateEvent } from "./event.create.action";
import { useFormToast } from "@/hooks/use-form-toast";

type FormTab = "basic" | "details" | "registration";

interface CreateEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

import type { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type CreateEventFormInput = z.infer<typeof createEventSchema>;

export default function CreateEventForm({}: CreateEventFormProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const router = useRouter();

  // Gestion du mode édition/auto du slug
  const [slugMode, setSlugMode] = useState<"auto" | "custom">("auto");
  const slugInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<CreateEventFormInput>({
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
      location: "",
      registrationLink: "",
      virtualLink: "",
      agenda: "",
      speakers: "",
      sponsors: "",
      requirements: "",
      whatToBring: "",
      metaTitle: "",
      metaDescription: "",
    },
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");

  // Afficher les erreurs dans des toasts
  useFormToast(errors, {
    showIndividualErrors: false,
    errorTitle: "Veuillez corriger les erreurs suivantes :",
  });

  // Gère la génération automatique du slug sauf si l'utilisateur le personnalise
  useEffect(() => {
    if (slugMode === "auto") {
      setValue("slug", slugify(titleValue || ""), { shouldValidate: false });
      trigger("slug");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue, slugMode, setValue, trigger]);

  // Passe en mode custom si l'utilisateur clique sur l'icône d'édition
  function handleSlugEditClick() {
    setSlugMode("custom");
    setTimeout(() => {
      slugInputRef.current?.focus();
      slugInputRef.current?.select();
    }, 10);
  }

  // Revenir en mode auto si l'utilisateur efface le champ slug
  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue("slug", newValue, { shouldValidate: true });
    if (newValue === "" && titleValue) {
      setSlugMode("auto");
    }
  }

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventFormInput) => {
      const result = await doCreateEvent(data);
      if (result.serverError) {
        toast.error(result.serverError || "Erreur lors de la création de l'événement");
        throw new Error(result.serverError);
      } else if (result.data) {
        toast.success("Événement créé avec succès !");
        router.push("/admin/events");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de l'événement");
    }
  });

  const onSubmit = async (data: CreateEventFormInput) => {
    try {
      await createEventMutation.mutateAsync(data);
    } catch (error) {
      // Error is already handled in onError
    }
  };

  const tabs = [
    { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
    { id: "details" as FormTab, label: "Détails", icon: Settings },
    { id: "registration" as FormTab, label: "Inscription", icon: UserCheck },
  ];

  const descriptionValue = watch("description");

  // Check which tabs have errors
  const tabErrors = {
    basic: !!(errors.title || errors.eventType || errors.status || errors.organizerName || errors.featuredImage || errors.shortDescription || errors.description),
    details: !!(errors.startDate || errors.endDate || errors.location || errors.isVirtual || errors.isFeatured),
    registration: !!(errors.registrationStart || errors.registrationEnd || errors.maxParticipants || errors.isFree || errors.price || errors.currency || errors.registrationLink),
  };

  const hasErrors = Object.values(errors).length > 0;

  // Helper function to get input classes based on error state
  const getInputClasses = (fieldName: keyof CreateEventFormInput) => {
    const baseClasses = "w-full rounded-lg px-4 py-2.5 transition-colors";
    const hasError = errors[fieldName];

    if (hasError) {
      return `${baseClasses} border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50`;
    }

    return `${baseClasses} border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Error Summary */}
        {hasErrors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">
                  Veuillez corriger les erreurs suivantes :
                </h3>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  {Object.entries(errors).map(([key, error]) => (
                    <li key={key}>
                      <span className="font-medium capitalize">{key}</span>: {error?.message as string}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tabErrors[tab.id] && (
                <span className="w-2 h-2 bg-red-500 "></span>
              )}
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
                    className={getInputClasses("title")}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title.message as string}
                    </p>
                  )}
                </div>

                {/* Slug: gestion éditable/auto */}
                <div className="relative group">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                    <span className="ml-1 inline text-xs text-gray-400">
                      {slugMode === "auto"
                        ? "(généré automatiquement)"
                        : "(personnalisé)"}
                    </span>
                  </label>
                  <div className="flex items-center">
                    <input
                      id="slug"
                      {...register("slug")}
                      type="text"
                      value={slugValue || ""}
                      readOnly={slugMode === "auto"}
                      ref={slugMode === "custom" ? slugInputRef : undefined}
                      onChange={slugMode === "custom" ? handleSlugChange : undefined}
                      className={
                        slugMode === "auto"
                          ? "w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-500 focus:outline-none cursor-not-allowed"
                          : getInputClasses("slug")
                      }
                      style={
                        slugMode === "auto"
                          ? { pointerEvents: "none" }
                          : {}
                      }
                    />
                    {slugMode === "auto" && (
                      <button
                        type="button"
                        aria-label="Personnaliser le slug"
                        className="ml-2 p-2 rounded hover:bg-gray-100 text-gray-600"
                        onClick={handleSlugEditClick}
                        tabIndex={0}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {slugMode === "custom" && (
                      <button
                        type="button"
                        aria-label="Revenir au slug automatique"
                        className="ml-2 p-2 rounded hover:bg-gray-100 text-gray-600"
                        onClick={() => setSlugMode("auto")}
                        tabIndex={0}
                      >
                        <span className="text-xs">auto</span>
                      </button>
                    )}
                  </div>
                  {errors.slug && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.slug.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'événement *
                  </label>
                  <select
                    id="eventType"
                    {...register("eventType")}
                    className={getInputClasses("eventType")}
                  >
                    {eventTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.eventType.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut *
                  </label>
                  <select
                    id="status"
                    {...register("status")}
                    className={getInputClasses("status")}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.status.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="organizerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Organisateur
                  </label>
                  <input
                    id="organizerName"
                    {...register("organizerName")}
                    placeholder="FGE"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.organizerName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.organizerName.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Image à la une (URL)
                  </label>
                  <input
                    id="featuredImage"
                    {...register("featuredImage")}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.featuredImage && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.featuredImage.message as string}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.shortDescription.message as string}
                    </p>
                  )}
                </div>

                {/* Markdown input for description */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description complète (Markdown supporté)
                  </label>
                  <MarkdownEditor
                    value={descriptionValue || ""}
                    onChange={(value) => setValue("description", value)}
                    placeholder="Description détaillée de l'événement en Markdown..."
                    error={errors.description?.message as string}
                    label=""
                    rows={8}
                  />
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.startDate.message as string}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.endDate.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu
                  </label>
                  <input
                    id="location"
                    {...register("location")}
                    placeholder="Adresse ou lien"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.location && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.location.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="isVirtual" className="block text-sm font-medium text-gray-700 mb-1">
                    Virtuel ?
                  </label>
                  <select
                    id="isVirtual"
                    {...register("isVirtual", {
                      setValueAs: (value) => {
                        if (value === "true" || value === true) return true;
                        if (value === "false" || value === false) return false;
                        return false;
                      }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                  {errors.isVirtual && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.isVirtual.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="isFeatured" className="block text-sm font-medium text-gray-700 mb-1">
                    Mettre en avant ?
                  </label>
                  <select
                    id="isFeatured"
                    {...register("isFeatured", {
                      setValueAs: (value) => {
                        if (value === "true" || value === true) return true;
                        if (value === "false" || value === false) return false;
                        return false;
                      }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                  {errors.isFeatured && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.isFeatured.message as string}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.registrationStart.message as string}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.registrationEnd.message as string}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.maxParticipants.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="isFree" className="block text-sm font-medium text-gray-700 mb-1">
                    Gratuit ?
                  </label>
                  <select
                    id="isFree"
                    {...register("isFree", {
                      setValueAs: (value) => {
                        if (value === "true" || value === true) return true;
                        if (value === "false" || value === false) return false;
                        return false;
                      }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                  {errors.isFree && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.isFree.message as string}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.price.message as string}
                    </p>
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
                    <p className="text-red-600 text-sm mt-1">
                      {errors.currency.message as string}
                    </p>
                  )}
                </div>
                {/* Registration Link input START */}
                <div className="col-span-2">
                  <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Lien d'inscription (URL)
                  </label>
                  <input
                    id="registrationLink"
                    {...register("registrationLink")}
                    placeholder="https://inscription.exemple.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.registrationLink && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.registrationLink.message as string}
                    </p>
                  )}
                </div>
                {/* Registration Link input END */}
              </div>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {createEventMutation.error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">
              {"Erreur lors de la création de l'événement."}
            </p>
            {typeof createEventMutation.error === "object" &&
              (createEventMutation.error as Error).message &&
              <p className="text-red-700 text-xs italic">{(createEventMutation.error as Error).message}</p>
            }
          </div>
        )}

        {/* Action Buttons */}
      </div>
      <div className="flex items-center justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={createEventMutation.isPending}
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createEventMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Créer l'événement
            </>
          )}
        </button>
      </div>
    </form>
  );
}
"use client";

import React, { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { FileText, Settings, UserCheck, Save, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { doCreateEvent } from "./event.create.action";
import { useSession } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createEventSchema } from "./event.create.schema";
import { useForm } from "@/hooks/useForm";
import { useSlug } from "@/hooks/useSlug";
import SlugField from "@/components/forms/SlugField";
import { formatErrorsForToast, booleanToSelectValue, selectValueToBoolean } from "@/lib/form-utils";
import type { EventType, EventStatus } from "@/lib/validations/events";

type FormTab = "basic" | "details" | "registration";

/**
 * Event type options - synced with Prisma EventType enum
 */
const eventTypeOptions: { value: EventType; label: string }[] = [
  { value: "forum", label: "Forum" },
  { value: "workshop", label: "Atelier" },
  { value: "conference", label: "Conférence" },
  { value: "networking", label: "Networking" },
  { value: "webinar", label: "Webinaire" },
  { value: "other", label: "Autre" },
];

/**
 * Event status options - synced with Prisma EventStatus enum
 */
const statusOptions: { value: EventStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "ongoing", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];

export default function CreateEventForm() {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isEditor = userRole === "editor";

  // ========================================
  // FORM MANAGEMENT with useForm hook
  // ========================================
  const form = useForm({
    initialValues: {
      title: "",
      slug: "",
      eventType: "forum" as EventType,
      organizerName: "FGE",
      status: (isEditor ? "draft" : "draft") as EventStatus,
      featuredImage: "",
      shortDescription: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      isVirtual: false,
      isFeatured: false,
      agenda: "",
      speakers: "",
      sponsors: "",
      registrationStart: "",
      registrationEnd: "",
      isFree: true,
      price: 0,
      currency: "MAD",
      registrationLink: "",
      virtualLink: "",
      requirements: "",
      whatToBring: "",
      metaTitle: "",
      metaDescription: "",
    },
    validationSchema: createEventSchema,
    validateOnChange: true,
    // Custom validation for editor role
    customValidation: (values) => {
      const errors: any = {};

      if (isEditor && values.status !== "draft") {
        errors.status = {
          field: "status",
          message: "En tant qu'éditeur, vous ne pouvez créer que des brouillons",
        };
      }

      return errors;
    },
  });

  // ========================================
  // SLUG MANAGEMENT with useSlug hook
  // ========================================
  const slug = useSlug({
    sourceText: form.values.title,
    onSlugChange: (value) => form.setFieldValue("slug", value),
  });

  // ========================================
  // FORM SUBMISSION
  // ========================================
  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      return await doCreateEvent(data);
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success("Événement créé avec succès !");
        form.resetForm();
        slug.enableAutoMode();
        router.push("/admin/events");
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de la création");
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    // Show validation errors in toast if form is invalid
    if (!form.isValid) {
      const errorMessages = formatErrorsForToast(form.errors, 4);
      toast.error(
        <div>
          <strong>Veuillez corriger les erreurs dans le formulaire :</strong>
          <ul className="list-disc list-inside pl-2 text-xs mt-1 space-y-0.5">
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    createEventMutation.mutate(values);
  });

  // ========================================
  // TABS
  // ========================================
  const tabs = [
    { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
    { id: "details" as FormTab, label: "Détails", icon: Settings },
    { id: "registration" as FormTab, label: "Inscription", icon: UserCheck },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                "flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors " +
                (activeTab === tab.id
                  ? "border-b-2 border-emerald-500 text-emerald-700 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600")
              }
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto px-1">
          {/* BASIC TAB */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">
                    Titre de l'événement <span className="text-red-600">*</span>
                  </label>
                  <Input
                    value={form.values.title}
                    onChange={(e) => form.setFieldValue("title", e.target.value)}
                    onBlur={() => form.setFieldTouched("title")}
                    placeholder="Ex: Forum Entrepreneuriat 2025"
                    error={form.hasError("title")}
                    errorMessage={form.getError("title")}
                  />
                </div>

                {/* Slug - Using SlugField component */}
                <div className="col-span-2">
                  <SlugField
                    value={slug.slug}
                    mode={slug.mode}
                    inputRef={slug.slugInputRef}
                    onChange={slug.setSlug}
                    onEditClick={slug.enableCustomMode}
                    onAutoClick={slug.enableAutoMode}
                    error={form.getError("slug")}
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block font-medium mb-1">
                    Type d'événement <span className="text-red-600">*</span>
                  </label>
                  <Select
                    value={form.values.eventType}
                    onChange={(e) => form.setFieldValue("eventType", e.target.value as EventType)}
                    onBlur={() => form.setFieldTouched("eventType")}
                    error={form.hasError("eventType")}
                    errorMessage={form.getError("eventType")}
                  >
                    {eventTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-medium mb-1">
                    Statut <span className="text-red-600">*</span>
                    {isEditor && (
                      <span className="ml-2 text-xs text-amber-600 font-normal">
                        (Brouillon uniquement)
                      </span>
                    )}
                  </label>
                  <Select
                    value={form.values.status}
                    disabled={isEditor}
                    onChange={(e) => form.setFieldValue("status", e.target.value as EventStatus)}
                    onBlur={() => form.setFieldTouched("status")}
                    error={form.hasError("status")}
                    errorMessage={form.getError("status")}
                    className={isEditor ? "opacity-60" : ""}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                  {isEditor && (
                    <span className="text-amber-600 flex items-center gap-1 text-xs mt-0.5">
                      <AlertCircle className="w-3 h-3" />
                      En tant qu'éditeur, vous ne pouvez créer que des brouillons
                    </span>
                  )}
                </div>

                {/* Organizer Name */}
                <div>
                  <label className="block font-medium mb-1">Organisateur</label>
                  <Input
                    value={form.values.organizerName}
                    onChange={(e) => form.setFieldValue("organizerName", e.target.value)}
                    onBlur={() => form.setFieldTouched("organizerName")}
                    placeholder="FGE"
                    error={form.hasError("organizerName")}
                    errorMessage={form.getError("organizerName")}
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block font-medium mb-1">Image à la une (URL)</label>
                  <Input
                    value={form.values.featuredImage}
                    onChange={(e) => form.setFieldValue("featuredImage", e.target.value)}
                    onBlur={() => form.setFieldTouched("featuredImage")}
                    placeholder="https://..."
                    error={form.hasError("featuredImage")}
                    errorMessage={form.getError("featuredImage")}
                  />
                </div>

                {/* Short Description */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Description courte</label>
                  <textarea
                    value={form.values.shortDescription}
                    onChange={(e) => form.setFieldValue("shortDescription", e.target.value)}
                    onBlur={() => form.setFieldTouched("shortDescription")}
                    placeholder="Résumé en une phrase"
                    rows={2}
                    className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 ${
                      form.hasError("shortDescription") ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {form.getError("shortDescription") && (
                    <span className="text-red-600 text-xs">{form.getError("shortDescription")}</span>
                  )}
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Description complète (Markdown supporté)</label>
                  <MarkdownEditor
                    value={form.values.description || ""}
                    onChange={(val) => form.setFieldValue("description", val)}
                    placeholder="Description détaillée de l'événement"
                  />
                  {form.getError("description") && (
                    <span className="text-red-600 text-xs">{form.getError("description")}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DETAILS TAB */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block font-medium mb-1">
                    Date de début <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={String(form.values.startDate)}
                    onChange={(e) => form.setFieldValue("startDate", e.target.value)}
                    onBlur={() => form.setFieldTouched("startDate")}
                    error={form.hasError("startDate")}
                    errorMessage={form.getError("startDate")}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block font-medium mb-1">
                    Date de fin <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={String(form.values.endDate)}
                    onChange={(e) => form.setFieldValue("endDate", e.target.value)}
                    onBlur={() => form.setFieldTouched("endDate")}
                    error={form.hasError("endDate")}
                    errorMessage={form.getError("endDate")}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-medium mb-1">Lieu</label>
                  <Input
                    value={form.values.location}
                    onChange={(e) => form.setFieldValue("location", e.target.value)}
                    onBlur={() => form.setFieldTouched("location")}
                    placeholder="Adresse ou lien"
                    error={form.hasError("location")}
                    errorMessage={form.getError("location")}
                  />
                </div>

                {/* Is Virtual */}
                <div>
                  <label className="block font-medium mb-1">Virtuel ?</label>
                  <Select
                    value={booleanToSelectValue(form.values.isVirtual)}
                    onChange={(e) => form.setFieldValue("isVirtual", selectValueToBoolean(e.target.value))}
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </Select>
                </div>

                {/* Is Featured */}
                <div>
                  <label className="block font-medium mb-1">Mettre en avant ?</label>
                  <Select
                    value={booleanToSelectValue(form.values.isFeatured)}
                    onChange={(e) => form.setFieldValue("isFeatured", selectValueToBoolean(e.target.value))}
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </Select>
                </div>

                {/* Agenda - Markdown */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Agenda</label>
                  <MarkdownEditor
                    value={form.values.agenda || ""}
                    onChange={(val) => form.setFieldValue("agenda", val)}
                    placeholder="Décrivez l'agenda de l'événement (facultatif)"
                  />
                  {form.getError("agenda") && (
                    <span className="text-red-600 text-xs">{form.getError("agenda")}</span>
                  )}
                </div>

                {/* Speakers - Markdown */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Intervenants</label>
                  <MarkdownEditor
                    value={form.values.speakers || ""}
                    onChange={(val) => form.setFieldValue("speakers", val)}
                    placeholder="Liste des intervenants (Markdown accepté, facultatif)"
                  />
                  {form.getError("speakers") && (
                    <span className="text-red-600 text-xs">{form.getError("speakers")}</span>
                  )}
                </div>

                {/* Sponsors - Markdown */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Sponsors</label>
                  <MarkdownEditor
                    value={form.values.sponsors || ""}
                    onChange={(val) => form.setFieldValue("sponsors", val)}
                    placeholder="Liste des sponsors (Markdown accepté, facultatif)"
                  />
                  {form.getError("sponsors") && (
                    <span className="text-red-600 text-xs">{form.getError("sponsors")}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REGISTRATION TAB */}
          {activeTab === "registration" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Registration Start */}
                <div>
                  <label className="block font-medium mb-1">Début des inscriptions</label>
                  <Input
                    type="datetime-local"
                    value={form.values.registrationStart}
                    onChange={(e) => form.setFieldValue("registrationStart", e.target.value)}
                    onBlur={() => form.setFieldTouched("registrationStart")}
                    error={form.hasError("registrationStart")}
                    errorMessage={form.getError("registrationStart")}
                  />
                </div>

                {/* Registration End */}
                <div>
                  <label className="block font-medium mb-1">Fin des inscriptions</label>
                  <Input
                    type="datetime-local"
                    value={form.values.registrationEnd}
                    onChange={(e) => form.setFieldValue("registrationEnd", e.target.value)}
                    onBlur={() => form.setFieldTouched("registrationEnd")}
                    error={form.hasError("registrationEnd")}
                    errorMessage={form.getError("registrationEnd")}
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block font-medium mb-1">Nombre max. de participants</label>
                  <Input
                    type="number"
                    min={0}
                    value={form.values.maxParticipants ?? ""}
                    onChange={(e) =>
                      form.setFieldValue(
                        "maxParticipants",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    onBlur={() => form.setFieldTouched("maxParticipants")}
                    error={form.hasError("maxParticipants")}
                    errorMessage={form.getError("maxParticipants")}
                  />
                </div>

                {/* Is Free */}
                <div>
                  <label className="block font-medium mb-1">Gratuit ?</label>
                  <Select
                    value={booleanToSelectValue(form.values.isFree)}
                    onChange={(e) => form.setFieldValue("isFree", selectValueToBoolean(e.target.value))}
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </Select>
                </div>

                {/* Price */}
                <div>
                  <label className="block font-medium mb-1">Prix (si payant)</label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.values.price}
                    onChange={(e) => form.setFieldValue("price", e.target.value === "" ? 0 : Number(e.target.value))}
                    onBlur={() => form.setFieldTouched("price")}
                    error={form.hasError("price")}
                    errorMessage={form.getError("price")}
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block font-medium mb-1">Devise</label>
                  <Input
                    value={form.values.currency}
                    onChange={(e) => form.setFieldValue("currency", e.target.value)}
                    onBlur={() => form.setFieldTouched("currency")}
                    placeholder="MAD"
                    error={form.hasError("currency")}
                    errorMessage={form.getError("currency")}
                  />
                </div>

                {/* Registration Link */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Lien d'inscription (URL)</label>
                  <Input
                    value={form.values.registrationLink}
                    onChange={(e) => form.setFieldValue("registrationLink", e.target.value)}
                    onBlur={() => form.setFieldTouched("registrationLink")}
                    placeholder="https://inscription.exemple.com"
                    error={form.hasError("registrationLink")}
                    errorMessage={form.getError("registrationLink")}
                  />
                </div>

                {/* Virtual Link */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Lien de visioconférence (si virtuel)</label>
                  <Input
                    value={form.values.virtualLink}
                    onChange={(e) => form.setFieldValue("virtualLink", e.target.value)}
                    onBlur={() => form.setFieldTouched("virtualLink")}
                    placeholder="https://meet.exemple.com"
                    error={form.hasError("virtualLink")}
                    errorMessage={form.getError("virtualLink")}
                  />
                </div>

                {/* Requirements - Markdown */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Prérequis (participants)</label>
                  <MarkdownEditor
                    value={form.values.requirements || ""}
                    onChange={(val) => form.setFieldValue("requirements", val)}
                    placeholder="Pré-requis pour la participation (Markdown accepté, facultatif)"
                  />
                  {form.getError("requirements") && (
                    <span className="text-red-600 text-xs">{form.getError("requirements")}</span>
                  )}
                </div>

                {/* What to Bring - Markdown */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">À apporter</label>
                  <MarkdownEditor
                    value={form.values.whatToBring || ""}
                    onChange={(val) => form.setFieldValue("whatToBring", val)}
                    placeholder="Liste des choses à apporter (Markdown accepté, facultatif)"
                  />
                  {form.getError("whatToBring") && (
                    <span className="text-red-600 text-xs">{form.getError("whatToBring")}</span>
                  )}
                </div>

                {/* Meta Title */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Méta titre (SEO)</label>
                  <Input
                    value={form.values.metaTitle}
                    onChange={(e) => form.setFieldValue("metaTitle", e.target.value)}
                    onBlur={() => form.setFieldTouched("metaTitle")}
                    placeholder="Méta titre pour le référencement"
                    error={form.hasError("metaTitle")}
                    errorMessage={form.getError("metaTitle")}
                  />
                </div>

                {/* Meta Description */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Méta description (SEO)</label>
                  <Input
                    value={form.values.metaDescription}
                    onChange={(e) => form.setFieldValue("metaDescription", e.target.value)}
                    onBlur={() => form.setFieldTouched("metaDescription")}
                    placeholder="Méta description pour le référencement"
                    error={form.hasError("metaDescription")}
                    errorMessage={form.getError("metaDescription")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Summary - Using safe rendering */}
        {Object.keys(form.errors).length > 0 && (
          <div className="mt-4">
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-red-600 text-sm">
                <span className="font-bold block mb-1">Certains champs contiennent des erreurs :</span>
                <ul className="list-disc ml-4 space-y-0.5">
                  {formatErrorsForToast(form.errors, 5).map((msg, i) => (
                    <li key={i} className="pl-1">
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-4 border-t mt-4">
        <button
          type="submit"
          disabled={createEventMutation.isPending}
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createEventMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Création en cours...
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

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
import { useSession } from "@/lib/auth-client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import Input from "@/components/ui/InputField";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormTab = "basic" | "details" | "registration";
type CreateEventFormInput = z.infer<typeof createEventSchema>;

interface CreateEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateEventForm({}: CreateEventFormProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isEditor = userRole === "editor";

  // Gestion du mode édition/auto du slug
  const [slugMode, setSlugMode] = useState<"auto" | "custom">("auto");
  const slugInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreateEventFormInput>({
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

  const titleValue = form.watch("title");
  const slugValue = form.watch("slug");

  // Afficher les erreurs dans des toasts
  useFormToast(form.formState.errors, {
    showIndividualErrors: false,
    errorTitle: "Veuillez corriger les erreurs suivantes :",
  });

  // Gère la génération automatique du slug
  useEffect(() => {
    if (slugMode === "auto") {
      form.setValue("slug", slugify(titleValue || ""), { shouldValidate: false });
      form.trigger("slug");
    }
  }, [titleValue, slugMode, form]);

  function handleSlugEditClick() {
    setSlugMode("custom");
    setTimeout(() => {
      slugInputRef.current?.focus();
      slugInputRef.current?.select();
    }, 0);
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    form.setValue("slug", e.target.value, { shouldValidate: true });
  }

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventFormInput) => {
      return await doCreateEvent(data);
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success("Événement créé avec succès !");
        form.reset();
        router.push("/admin/events");
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de la création");
    },
  });

  function onSubmit(values: CreateEventFormInput) {
    createEventMutation.mutate(values);
  }

  const tabs = [
    { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
    { id: "details" as FormTab, label: "Détails", icon: Settings },
    { id: "registration" as FormTab, label: "Inscription", icon: UserCheck },
  ];

  const tabErrors = {
    basic: !!(form.formState.errors.title || form.formState.errors.eventType || form.formState.errors.status),
    details: !!(form.formState.errors.startDate || form.formState.errors.endDate),
    registration: !!(form.formState.errors.registrationStart || form.formState.errors.maxParticipants),
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
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
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de l'événement *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: Forum Entrepreneuriat 2025"
                              error={!!form.formState.errors.title}
                              errorMessage={form.formState.errors.title?.message}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Slug */}
                  <div className="col-span-2 relative group">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Slug
                            <span className="ml-1 inline text-xs text-gray-400">
                              {slugMode === "auto" ? "(généré automatiquement)" : "(personnalisé)"}
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="text"
                                value={slugValue || ""}
                                readOnly={slugMode === "auto"}
                                ref={slugMode === "custom" ? slugInputRef : undefined}
                                onChange={slugMode === "custom" ? handleSlugChange : undefined}
                                className={
                                  slugMode === "auto"
                                    ? "w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-500 focus:outline-none cursor-not-allowed"
                                    : "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
                                }
                                style={slugMode === "auto" ? { pointerEvents: "none" } : {}}
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
                                  className="ml-2 p-2 rounded hover:bg-gray-100 text-gray-600"
                                  onClick={() => setSlugMode("auto")}
                                  tabIndex={0}
                                >
                                  <span className="text-xs">auto</span>
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Event Type */}
                  <div>
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type d'événement *</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            >
                              {eventTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Statut *
                            {isEditor && (
                              <span className="ml-2 text-xs text-amber-600 font-normal">
                                (Brouillon uniquement)
                              </span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              disabled={isEditor}
                              className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 ${
                                isEditor ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
                              }`}
                            >
                              {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          {isEditor && (
                            <FormDescription className="text-amber-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              En tant qu'éditeur, vous ne pouvez créer que des brouillons
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Organizer Name */}
                  <div>
                    <FormField
                      control={form.control}
                      name="organizerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organisateur</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="FGE"
                              error={!!form.formState.errors.organizerName}
                              errorMessage={form.formState.errors.organizerName?.message}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Featured Image */}
                  <div>
                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image à la une (URL)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://..."
                              error={!!form.formState.errors.featuredImage}
                              errorMessage={form.formState.errors.featuredImage?.message}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Short Description */}
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description courte</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              placeholder="Résumé en une phrase"
                              rows={2}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description (Markdown) */}
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description complète (Markdown supporté)</FormLabel>
                          <FormControl>
                            <MarkdownEditor
                              value={field.value || ""}
                              onChange={(val) => field.onChange(val)}
                              placeholder="Description détaillée de l'événement"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Détails Tab - Simplified version */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de début *</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              value={typeof field.value === 'string' ? field.value : field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                              type="datetime-local"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de fin *</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              value={typeof field.value === 'string' ? field.value : field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                              type="datetime-local"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Adresse ou lien"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="isVirtual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Virtuel ?</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value ? "true" : "false"}
                              onChange={(e) => field.onChange(e.target.value === "true")}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="true">Oui</option>
                              <option value="false">Non</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mettre en avant ?</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value ? "true" : "false"}
                              onChange={(e) => field.onChange(e.target.value === "true")}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="true">Oui</option>
                              <option value="false">Non</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Registration Tab */}
            {activeTab === "registration" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="registrationStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Début des inscriptions</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="datetime-local"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="registrationEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fin des inscriptions</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="datetime-local"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre max. de participants</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gratuit ?</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value ? "true" : "false"}
                              onChange={(e) => field.onChange(e.target.value === "true")}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="true">Oui</option>
                              <option value="false">Non</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix (si payant)</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="number"
                              min={0}
                              step="0.01"
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Devise</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="MAD"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="registrationLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lien d'inscription (URL)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://inscription.exemple.com"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Global Error Display */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="mt-4">
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-red-600 text-sm">
                  Veuillez corriger les erreurs dans le formulaire
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end pt-4 border-t mt-4">
          <button
            type="submit"
            disabled={createEventMutation.isPending}
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createEventMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
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
    </Form>
  );
}

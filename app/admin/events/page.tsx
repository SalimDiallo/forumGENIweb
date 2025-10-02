"use client";
import { useAction } from "next-safe-action/hooks";
import { createEvent, deleteEvent, listEvents, updateEvent, listRegistrations, deleteRegistration } from "./actions";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/admin/Modal";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, updateEventSchema } from "@/lib/validations/events";
import { Calendar, MapPin, Users, Globe, DollarSign, Image, FileText, Settings, Trash2, Edit2, UserCheck, X, Plus, Save, AlertCircle } from "lucide-react";

// Tabs pour organiser le formulaire
type FormTab = "basic" | "details" | "registration" | "seo";

export default function AdminEventsPage() {
  const list = useAction(listEvents);
  const create = useAction(createEvent);
  const del = useAction(deleteEvent);
  const upd = useAction(updateEvent);
  const regs = useAction(listRegistrations);
  const delReg = useAction(deleteRegistration);

  useEffect(() => {
    list.execute();
  }, []);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRegs, setOpenRegs] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [regEventId, setRegEventId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const [markdownPreview, setMarkdownPreview] = useState(false);

  const createForm = useForm<z.infer<typeof createEventSchema>>({
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
    },
  });

  const editingItem = useMemo(
    () => list.result?.data?.events?.find((e: any) => e.id === editingId) ?? null,
    [editingId, list.result]
  );

  const editForm = useForm<z.infer<typeof updateEventSchema>>({
    resolver: zodResolver(updateEventSchema),
    values: editingItem
      ? {
          id: editingItem.id,
          title: editingItem.title,
          slug: editingItem.slug,
          description: editingItem.description ?? undefined,
          shortDescription: editingItem.shortDescription ?? undefined,
          featuredImage: editingItem.featuredImage ?? undefined,
          eventType: editingItem.eventType,
          location: editingItem.location ?? undefined,
          isVirtual: editingItem.isVirtual,
          virtualLink: editingItem.virtualLink ?? undefined,
          startDate: new Date(editingItem.startDate).toISOString(),
          endDate: new Date(editingItem.endDate).toISOString(),
          registrationStart: editingItem.registrationStart
            ? new Date(editingItem.registrationStart).toISOString()
            : undefined,
          registrationEnd: editingItem.registrationEnd
            ? new Date(editingItem.registrationEnd).toISOString()
            : undefined,
          maxParticipants: editingItem.maxParticipants ?? undefined,
          isFree: editingItem.isFree,
          price: editingItem.price,
          currency: editingItem.currency,
          status: editingItem.status,
          isFeatured: editingItem.isFeatured,
          organizerName: editingItem.organizerName,
          agenda: editingItem.agenda ?? undefined,
          speakers: editingItem.speakers ?? undefined,
          sponsors: editingItem.sponsors ?? undefined,
          requirements: editingItem.requirements ?? undefined,
          whatToBring: editingItem.whatToBring ?? undefined,
          metaTitle: editingItem.metaTitle ?? undefined,
          metaDescription: editingItem.metaDescription ?? undefined,
        }
      : undefined,
  });

  function onSubmitCreate(values: z.infer<typeof createEventSchema>) {
    create.execute(values);
  }

  function onSubmitEdit(values: z.infer<typeof updateEventSchema>) {
    upd.execute(values);
  }

  async function onDelete(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      del.execute({ id });
    }
  }

  useEffect(() => {
    if (create.status === "hasSucceeded") {
      list.execute();
      setOpenCreate(false);
      createForm.reset();
      setActiveTab("basic");
    }
  }, [create.status]);

  useEffect(() => {
    if (upd.status === "hasSucceeded") {
      list.execute();
      setOpenEdit(false);
      setEditingId(null);
      setActiveTab("basic");
    }
  }, [upd.status]);

  useEffect(() => {
    if (del.status === "hasSucceeded") {
      list.execute();
    }
  }, [del.status]);

  useEffect(() => {
    if (delReg.status === "hasSucceeded" && regEventId) {
      regs.execute({ id: regEventId });
    }
  }, [delReg.status]);

  const eventTypeOptions = [
    { value: "forum", label: "Forum", icon: "💼" },
    { value: "workshop", label: "Workshop", icon: "🛠️" },
    { value: "conference", label: "Conférence", icon: "🎤" },
    { value: "networking", label: "Networking", icon: "🤝" },
    { value: "webinar", label: "Webinaire", icon: "💻" },
    { value: "other", label: "Autre", icon: "📌" },
  ];

  const statusOptions = [
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "published", label: "Publié", color: "bg-emerald-100 text-emerald-800" },
    { value: "ongoing", label: "En cours", color: "bg-blue-100 text-blue-800" },
    { value: "completed", label: "Terminé", color: "bg-purple-100 text-purple-800" },
    { value: "cancelled", label: "Annulé", color: "bg-red-100 text-red-800" },
  ];

  const renderFormContent = (form: any, isEdit: boolean) => {
    const tabs = [
      { id: "basic", label: "Informations de base", icon: FileText },
      { id: "details", label: "Détails", icon: Settings },
      { id: "registration", label: "Inscription", icon: UserCheck },
      { id: "seo", label: "SEO", icon: Globe },
    ];

    return (
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as FormTab)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de l'événement *
                  </label>
                  <input
                    {...form.register("title")}
                    placeholder="Ex: Forum Entrepreneuriat 2025"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL) *
                  </label>
                  <input
                    {...form.register("slug")}
                    placeholder="forum-entrepreneuriat-2025"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'événement *
                  </label>
                  <select
                    {...form.register("eventType")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {eventTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.icon} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
                  <select
                    {...form.register("status")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description courte
                  </label>
                  <textarea
                    {...form.register("shortDescription")}
                    placeholder="Résumé en une phrase"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Description complète (Markdown supporté)
                    </label>
                    <button
                      type="button"
                      onClick={() => setMarkdownPreview(!markdownPreview)}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      {markdownPreview ? "Éditer" : "Prévisualiser"}
                    </button>
                  </div>
                  {markdownPreview ? (
                    <div className="w-full border border-gray-300 rounded-lg px-4 py-2.5 min-h-[200px] prose prose-sm max-w-none bg-gray-50">
                      {form.watch("description") || "Aucun contenu"}
                    </div>
                  ) : (
                    <textarea
                      {...form.register("description")}
                      placeholder="Description détaillée de l'événement (supporte Markdown)"
                      rows={8}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                    />
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image principale (URL)
                  </label>
                  <input
                    {...form.register("featuredImage")}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organisateur *
                  </label>
                  <input
                    {...form.register("organizerName")}
                    placeholder="FGE"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...form.register("isFeatured")}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Événement vedette</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...form.register("isVirtual")}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Événement virtuel</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début *
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("startDate")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin *
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("endDate")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {!form.watch("isVirtual") && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de l'événement
                    </label>
                    <input
                      {...form.register("location")}
                      placeholder="Ex: Salle des conférences, Rabat"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                )}

                {form.watch("isVirtual") && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lien virtuel
                    </label>
                    <input
                      {...form.register("virtualLink")}
                      placeholder="https://zoom.us/..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agenda (JSON)
                  </label>
                  <textarea
                    {...form.register("agenda")}
                    placeholder='[{"time": "09:00", "title": "Ouverture"}]'
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intervenants (JSON)
                  </label>
                  <textarea
                    {...form.register("speakers")}
                    placeholder='[{"name": "Jean Dupont", "title": "CEO"}]'
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sponsors (JSON)
                  </label>
                  <textarea
                    {...form.register("sponsors")}
                    placeholder='[{"name": "Entreprise X", "logo": "url"}]'
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prérequis</label>
                  <textarea
                    {...form.register("requirements")}
                    placeholder="Compétences ou matériel requis"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    À apporter
                  </label>
                  <textarea
                    {...form.register("whatToBring")}
                    placeholder="Ce que les participants doivent apporter"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "registration" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...form.register("isFree")}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Événement gratuit</span>
                  </label>
                </div>

                {!form.watch("isFree") && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                      <input
                        type="number"
                        {...form.register("price", { valueAsNumber: true })}
                        placeholder="0"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                      <select
                        {...form.register("currency")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="MAD">MAD (Dirham)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="USD">USD (Dollar)</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre maximum de participants
                  </label>
                  <input
                    type="number"
                    {...form.register("maxParticipants", { valueAsNumber: true })}
                    placeholder="Illimité si vide"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Début des inscriptions
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("registrationStart")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fin des inscriptions
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("registrationEnd")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Titre
                  </label>
                  <input
                    {...form.register("metaTitle")}
                    placeholder="Titre pour les moteurs de recherche"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">60 caractères max recommandé</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    {...form.register("metaDescription")}
                    placeholder="Description pour les moteurs de recherche"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">160 caractères max recommandé</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              isEdit ? setOpenEdit(false) : setOpenCreate(false);
              setActiveTab("basic");
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={
              isEdit
                ? upd.status === "executing"
                : create.status === "executing"
            }
            className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-6 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isEdit
              ? upd.status === "executing"
                ? "Sauvegarde…"
                : "Enregistrer"
              : create.status === "executing"
              ? "Création…"
              : "Créer l'événement"}
          </button>
        </div>

        {/* Error Messages */}
        {(create.result?.serverError || upd.result?.serverError) && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">
              {create.result?.serverError?.message || upd.result?.serverError?.message}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Événements</h1>
            <p className="text-emerald-100">
              {list.result?.data?.events?.length || 0} événement(s) au total
            </p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-white text-emerald-600 rounded-lg px-5 py-3 font-medium hover:bg-emerald-50 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Nouvel événement
          </button>
        </div>
      </section>

      {/* Create Modal */}
      <Modal open={openCreate} title="Créer un événement" onClose={() => setOpenCreate(false)}>
        <form onSubmit={createForm.handleSubmit(onSubmitCreate)}>
          {renderFormContent(createForm, false)}
        </form>
      </Modal>

      {/* Events List */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {list.status === "executing" && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {list.result?.data?.events?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucun événement</p>
            <p className="text-sm">Commencez par créer votre premier événement</p>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {list.result?.data?.events?.map((e: any) => {
            const statusOption = statusOptions.find((s) => s.value === e.status);
            return (
              <div
                key={e.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {e.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusOption?.color}`}
                      >
                        {statusOption?.label}
                      </span>
                      {e.isFeatured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Vedette
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(e.startDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        {e.isVirtual ? (
                          <>
                            <Globe className="w-4 h-4" />
                            Virtuel
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            {e.location || "Lieu non défini"}
                          </>
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {e.currentParticipants}
                        {e.maxParticipants && `/${e.maxParticipants}`} inscrits
                      </span>
                      {!e.isFree && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {e.price} {e.currency}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(e.id);
                        setOpenEdit(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Éditer
                    </button>
                    <button
                      onClick={() => {
                        setRegEventId(e.id);
                        regs.execute({ id: e.id });
                        setOpenRegs(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      Inscriptions
                    </button>
                    <button
                      onClick={() => onDelete(e.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Edit Modal */}
      <Modal
        open={openEdit && !!editingItem}
        title="Modifier l'événement"
        onClose={() => {
          setOpenEdit(false);
          setEditingId(null);
          setActiveTab("basic");
        }}
      >
        <form onSubmit={editForm.handleSubmit(onSubmitEdit)}>
          {renderFormContent(editForm, true)}
        </form>
      </Modal>

      {/* Registrations Modal */}
      <Modal
        open={openRegs && regEventId != null}
        title="Inscriptions à l'événement"
        onClose={() => {
          setOpenRegs(false);
          setRegEventId(null);
        }}
      >
        <div className="space-y-4">
          {regs.status === "executing" && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {regs.result?.data?.registrations?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Aucune inscription</p>
              <p className="text-sm">Les inscriptions apparaîtront ici</p>
            </div>
          )}

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {regs.result?.data?.registrations?.map((r: any) => {
                const statusColors: Record<string, string> = {
                  pending: "bg-yellow-100 text-yellow-800",
                  confirmed: "bg-emerald-100 text-emerald-800",
                  cancelled: "bg-red-100 text-red-800",
                  attended: "bg-blue-100 text-blue-800",
                };

                return (
                  <div
                    key={r.id}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900">
                          {r.firstName} {r.lastName}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[r.registrationStatus] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {r.registrationStatus}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Email:</span>
                          <a
                            href={`mailto:${r.email}`}
                            className="text-emerald-600 hover:underline"
                          >
                            {r.email}
                          </a>
                        </p>
                        {r.phone && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Tél:</span>
                            {r.phone}
                          </p>
                        )}
                        {r.organization && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Organisation:</span>
                            {r.organization}
                          </p>
                        )}
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Niveau:</span>
                          {r.experienceLevel}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Inscrit le:</span>
                          {new Date(r.registeredAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Êtes-vous sûr de vouloir supprimer cette inscription ?"
                          )
                        ) {
                          delReg.execute({ id: r.id });
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={delReg.status === "executing"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {regs.result?.data?.registrations && regs.result.data.registrations.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-600">
                Total: <span className="font-semibold">{regs.result.data.registrations.length}</span> inscription(s)
              </p>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter CSV
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
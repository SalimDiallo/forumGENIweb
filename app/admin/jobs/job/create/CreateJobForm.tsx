"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { z } from "zod";
import { doCreateJob } from "./job.create.action";
import { createJobOfferSchema } from "./job.create.schema";
import MarkdownEditor from "@/components/MardownEditor";
import {
  FileText,
  Settings,
  UserCheck,
  Save,
  AlertCircle,
} from "lucide-react";

// Options for select fields (should be kept in sync with page.tsx)
const jobTypeOptions = [
  { value: "stage", label: "Stage" },
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "freelance", label: "Freelance" },
  { value: "alternance", label: "Alternance" },
  { value: "autre", label: "Autre" },
];

const educationLevelOptions = [
  { value: "aucun", label: "Aucun" },
  { value: "bac", label: "Bac" },
  { value: "bac+2", label: "Bac+2" },
  { value: "bac+3", label: "Bac+3" },
  { value: "bac+5", label: "Bac+5" },
  { value: "doctorat", label: "Doctorat" },
];

const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "archived", label: "Archivé" },
];

type FormTab = "basic" | "details" | "application";

// Utility function to generate slug from title
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}

// TagInput component for comma-separated tags with visible chips
function TagInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");
  const tags = value
    ? value
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : [];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    // If user types a comma, add tag
    if (val.includes(",")) {
      const parts = val.split(",");
      const newTags = [...tags, ...parts.slice(0, -1).map((t) => t.trim()).filter(Boolean)];
      const uniqueTags = Array.from(new Set(newTags));
      onChange(uniqueTags.join(","));
      setInput(parts[parts.length - 1]);
    } else {
      setInput(val);
    }
  }

  function handleInputBlur() {
    if (input.trim()) {
      const newTags = [...tags, input.trim()];
      const uniqueTags = Array.from(new Set(newTags));
      onChange(uniqueTags.join(","));
      setInput("");
    }
  }

  function handleRemoveTag(idx: number) {
    const newTags = tags.filter((_, i) => i !== idx);
    onChange(newTags.join(","));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === "Tab") && input.trim()) {
      e.preventDefault();
      const newTags = [...tags, input.trim()];
      const uniqueTags = Array.from(new Set(newTags));
      onChange(uniqueTags.join(","));
      setInput("");
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      handleRemoveTag(tags.length - 1);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg px-2 py-2.5 bg-white focus-within:ring-2 focus-within:ring-emerald-500">
      {tags.map((tag, idx) => (
        <span
          key={tag + idx}
          className="flex items-center bg-emerald-100 text-emerald-800 rounded px-2 py-1 text-xs font-medium mr-1"
        >
          {tag}
          <button
            type="button"
            className="ml-1 text-emerald-600 hover:text-red-500 focus:outline-none"
            onClick={() => handleRemoveTag(idx)}
            tabIndex={-1}
            aria-label={`Supprimer ${tag}`}
            disabled={disabled}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm"
        disabled={disabled}
      />
    </div>
  );
}

// FormField component with design inspired by @CreateEventForm.tsx
function FormField({
  label,
  children,
  error,
  description,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      {description && <span className="text-xs text-gray-500 mb-1">{description}</span>}
      {children}
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}

export default function CreateJobModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const create = useAction(doCreateJob);

  const createForm = useForm<z.infer<typeof createJobOfferSchema>>({
    resolver: zodResolver(createJobOfferSchema),
    defaultValues: {
      title: "",
      slug: "",
      companyName: "",
      companyLogo: "",
      companyWebsite: "",
      industry: "",
      jobType: "",
      location: "",
      isRemote: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      salaryCurrency: "",
      salaryPeriod: "",
      description: "",
      requirements: "",
      benefits: "",
      applicationEmail: "",
      applicationUrl: "",
      applicationPhone: "",
      applicationDeadline: "",
      experienceRequired: "",
      educationLevel: "",
      contractDuration: "",
      startDate: "",
      skillsRequired: "",
      languagesRequired: "",
      status: "",
      isFeatured: undefined,
    },
  });

  // Auto-generate slug for create form
  const titleValue = createForm.watch("title");
  useEffect(() => {
    if (titleValue) {
      createForm.setValue("slug", slugify(titleValue));
    }
    // eslint-disable-next-line
  }, [titleValue]);

  function onSubmitCreate(values: z.infer<typeof createJobOfferSchema>) {
    create.execute(values);
  }

  useEffect(() => {
    if (create.status === "hasSucceeded") {
      if (onCreated) onCreated();
      onClose();
      createForm.reset();
      setActiveTab("basic");
    }
  }, [create.status, onClose, onCreated, createForm]);

  const tabs = [
    { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
    { id: "details" as FormTab, label: "Détails du poste", icon: Settings },
    { id: "application" as FormTab, label: "Candidature", icon: UserCheck },
  ];

  return (
    <Modal
      open={open}
      title="Créer une annonce"
      onClose={onClose}
    >
      <form onSubmit={createForm.handleSubmit(onSubmitCreate)}>
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
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
                    <FormField label="Titre du poste *" error={createForm.formState.errors.title?.message}>
                      <input
                        {...createForm.register("title")}
                        placeholder="Ex: Développeur React Senior"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        autoFocus
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Entreprise *" error={createForm.formState.errors.companyName?.message}>
                      <input
                        {...createForm.register("companyName")}
                        placeholder="Nom de l'entreprise"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Secteur d'activité (optionnel)" error={createForm.formState.errors.industry?.message}>
                      <input
                        {...createForm.register("industry")}
                        placeholder="ex: Informatique, Finance..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Type de contrat (optionnel)" error={createForm.formState.errors.jobType?.message}>
                      <select
                        {...createForm.register("jobType")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner (optionnel)</option>
                        {jobTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Lieu (optionnel)" error={createForm.formState.errors.location?.message}>
                      <input
                        {...createForm.register("location")}
                        placeholder="Ville, Pays"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Télétravail (optionnel)" error={createForm.formState.errors.isRemote?.message}>
                      <select
                        {...createForm.register("isRemote", { setValueAs: (value) => value === "" ? undefined : value === "true" })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Non spécifié</option>
                        <option value="false">Non</option>
                        <option value="true">Oui</option>
                      </select>
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Logo de l'entreprise (optionnel)" error={createForm.formState.errors.companyLogo?.message}>
                      <input
                        {...createForm.register("companyLogo")}
                        placeholder="URL du logo (optionnel)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="url"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Site web de l'entreprise (optionnel)" error={createForm.formState.errors.companyWebsite?.message}>
                      <input
                        {...createForm.register("companyWebsite")}
                        placeholder="https://entreprise.com (optionnel)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="url"
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FormField
                      label="Description (optionnel)"
                      error={createForm.formState.errors.description?.message}
                      description="Vous pouvez utiliser le markdown pour mettre en forme la description du poste."
                    >
                      <MarkdownEditor
                        value={createForm.watch("description") || ""}
                        onChange={value => createForm.setValue("description", value, { shouldValidate: true })}
                        placeholder="Description du poste (markdown supporté)"
                      />
                    </FormField>
                  </div>

                  <div className="col-span-2">
                    <FormField
                      label="Exigences (optionnel)"
                      error={createForm.formState.errors.requirements?.message}
                      description="Listez les exigences du poste, séparées par des virgules. Appuyez sur Entrée ou tapez une virgule pour ajouter."
                    >
                      <Controller
                        control={createForm.control}
                        name="requirements"
                        render={({ field }) => (
                          <TagInput
                            value={field.value || ""}
                            onChange={val => field.onChange(val)}
                            placeholder="ex: React, Node.js, SQL"
                            disabled={create.status === "executing"}
                          />
                        )}
                      />
                    </FormField>
                  </div>

                  <div className="col-span-2">
                    <FormField
                      label="Avantages (optionnel)"
                      error={createForm.formState.errors.benefits?.message}
                      description="Listez les avantages proposés, séparés par des virgules. Appuyez sur Entrée ou tapez une virgule pour ajouter."
                    >
                      <Controller
                        control={createForm.control}
                        name="benefits"
                        render={({ field }) => (
                          <TagInput
                            value={field.value || ""}
                            onChange={val => field.onChange(val)}
                            placeholder="ex: Tickets resto, Mutuelle, Télétravail"
                            disabled={create.status === "executing"}
                          />
                        )}
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Expérience requise (optionnel)" error={createForm.formState.errors.experienceRequired?.message}>
                      <input
                        {...createForm.register("experienceRequired")}
                        placeholder="ex: 2 ans"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Niveau d'études (optionnel)" error={createForm.formState.errors.educationLevel?.message}>
                      <select
                        {...createForm.register("educationLevel")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner (optionnel)</option>
                        {educationLevelOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Durée du contrat (optionnel)" error={createForm.formState.errors.contractDuration?.message}>
                      <input
                        {...createForm.register("contractDuration")}
                        placeholder="ex: 6 mois"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Date de début (optionnel)" error={createForm.formState.errors.startDate?.message}>
                      <input
                        {...createForm.register("startDate")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="date"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Compétences requises (optionnel)" error={createForm.formState.errors.skillsRequired?.message}>
                      <Controller
                        control={createForm.control}
                        name="skillsRequired"
                        render={({ field }) => (
                          <TagInput
                            value={field.value || ""}
                            onChange={val => field.onChange(val)}
                            placeholder="ex: React, Node.js, SQL"
                            disabled={create.status === "executing"}
                          />
                        )}
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label="Langues requises (optionnel)"
                      error={createForm.formState.errors.languagesRequired?.message}
                      description="Listez les langues requises, séparées par des virgules."
                    >
                      <Controller
                        control={createForm.control}
                        name="languagesRequired"
                        render={({ field }) => (
                          <TagInput
                            value={field.value || ""}
                            onChange={val => field.onChange(val)}
                            placeholder="ex: Français, Anglais"
                            disabled={create.status === "executing"}
                          />
                        )}
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Salaire min (optionnel)" error={createForm.formState.errors.salaryMin?.message}>
                      <input
                        {...createForm.register("salaryMin", { valueAsNumber: true })}
                        placeholder="Salaire min"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="number"
                        min={0}
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Salaire max (optionnel)" error={createForm.formState.errors.salaryMax?.message}>
                      <input
                        {...createForm.register("salaryMax", { valueAsNumber: true })}
                        placeholder="Salaire max"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="number"
                        min={0}
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Devise (optionnel)" error={createForm.formState.errors.salaryCurrency?.message}>
                      <input
                        {...createForm.register("salaryCurrency")}
                        placeholder="MAD, EUR, USD..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Période (optionnel)" error={createForm.formState.errors.salaryPeriod?.message}>
                      <input
                        {...createForm.register("salaryPeriod")}
                        placeholder="ex: month"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Statut (optionnel)" error={createForm.formState.errors.status?.message}>
                      <select
                        {...createForm.register("status")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner (optionnel)</option>
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <div>
                    <FormField label="Mettre en avant (optionnel)" error={createForm.formState.errors.isFeatured?.message}>
                      <select
                        {...createForm.register("isFeatured", { setValueAs: (value) => value === "" ? undefined : value === "true" })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Non spécifié</option>
                        <option value="false">Non</option>
                        <option value="true">Oui</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "application" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField
                      label="Email de candidature (optionnel)"
                      error={createForm.formState.errors.applicationEmail?.message}
                      description="Email pour postuler (optionnel)"
                    >
                      <input
                        {...createForm.register("applicationEmail")}
                        placeholder="ex: jobs@entreprise.com (optionnel)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="email"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label="URL de candidature (optionnel)"
                      error={createForm.formState.errors.applicationUrl?.message}
                      description="Lien vers le formulaire de candidature (optionnel)"
                    >
                      <input
                        {...createForm.register("applicationUrl")}
                        placeholder="Lien vers le formulaire de candidature (optionnel)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="url"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label="Téléphone de contact (optionnel)"
                      error={createForm.formState.errors.applicationPhone?.message}
                      description="Numéro de téléphone pour postuler (optionnel)"
                    >
                      <input
                        {...createForm.register("applicationPhone")}
                        placeholder="Numéro de téléphone (optionnel)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="tel"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label="Date limite de candidature (optionnel)"
                      error={createForm.formState.errors.applicationDeadline?.message}
                      description="Date limite pour postuler (optionnel)"
                    >
                      <input
                        {...createForm.register("applicationDeadline")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        type="date"
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Messages */}
          {create.status === "hasErrored" && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">
                {create.result?.serverError || "Erreur lors de la création de l'annonce."}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={create.status === "executing"}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={create.status === "executing"}
              className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-6 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {create.status === "executing" ? "Enregistrement..." : "Créer l'annonce"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

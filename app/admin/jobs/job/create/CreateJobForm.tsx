"use client";

import React, { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { FileText, Settings, UserCheck, Save, AlertCircle, Briefcase } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { doCreateJob } from "./job.create.action";
import { useSession } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createJobOfferSchema } from "./job.create.schema";
import { useForm } from "@/hooks/useForm";
import { useSlug } from "@/hooks/useSlug";
import SlugField from "@/components/forms/SlugField";
import { formatErrorsForToast } from "@/lib/form-utils";

type FormTab = "basic" | "details" | "application";

const jobTypeOptions = [
  { value: "", label: "Sélectionner..." },
  { value: "stage", label: "Stage" },
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "freelance", label: "Freelance" },
  { value: "alternance", label: "Alternance" },
  { value: "autre", label: "Autre" },
];

const statusOptions = [
  { value: "", label: "Sélectionner..." },
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "closed", label: "Fermé" },
];

const remoteOptions = [
  { value: "", label: "Non spécifié" },
  { value: "false", label: "Non" },
  { value: "true", label: "Oui" },
];

export default function CreateJobForm() {
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
      companyName: "",
      companyLogo: "",
      companyWebsite: "",
      industry: "",
      jobType: "",
      location: "",
      isRemote: "",
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "MAD",
      salaryPeriod: "month",
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
      status: isEditor ? "draft" : "",
      isFeatured: false,
    },
    validationSchema: createJobOfferSchema as any,
    validateOnChange: true,
  });

  // ========================================
  // SLUG MANAGEMENT with useSlug hook
  // ========================================
  const slug = useSlug({
    sourceText: form.values.title,
    onSlugChange: (value) => form.setFieldValue("slug", value),
  });

  // ========================================
  // CREATE MUTATION
  // ========================================
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Transform data before sending
      const transformedData = {
        ...data,
        isRemote: data.isRemote === "true" ? true : data.isRemote === "false" ? false : undefined,
        salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
        isFeatured: Boolean(data.isFeatured),
      };
      return await doCreateJob(transformedData);
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success("Offre d'emploi créée avec succès !");
        form.resetForm();
        slug.enableAutoMode();
        router.push("/admin/jobs");
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de la création");
    },
  });

  // ========================================
  // FORM SUBMISSION
  // ========================================
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
    createMutation.mutate(values);
  });

  // ========================================
  // TAB ERROR INDICATORS
  // ========================================
  const tabErrors = {
    basic: ["title", "slug", "companyName", "industry", "jobType", "location", "isRemote", "companyLogo", "companyWebsite"].some(
      (f) => form.hasError(f as any)
    ),
    details: ["description", "requirements", "benefits", "salaryMin", "salaryMax", "experienceRequired", "educationLevel", "skillsRequired", "languagesRequired", "status", "isFeatured"].some(
      (f) => form.hasError(f as any)
    ),
    application: ["applicationEmail", "applicationUrl", "applicationPhone", "applicationDeadline", "startDate", "contractDuration"].some(
      (f) => form.hasError(f as any)
    ),
  };

  const tabs = [
    { id: "basic" as FormTab, label: "Informations", icon: FileText, hasError: tabErrors.basic },
    { id: "details" as FormTab, label: "Détails", icon: Settings, hasError: tabErrors.details },
    { id: "application" as FormTab, label: "Candidature", icon: UserCheck, hasError: tabErrors.application },
  ];

  const errorCount = Object.keys(form.errors).length;

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Briefcase className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Nouvelle offre d'emploi</h1>
            <p className="text-sm text-gray-500">Créez une nouvelle annonce</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`flex items-center gap-2 px-4 py-3 -mb-px border-b-2 transition-colors ${activeTab === tab.id
              ? "border-gray-900 text-gray-900 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.hasError && <span className="w-2 h-2 bg-red-500 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {/* ========== BASIC TAB ========== */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block font-medium mb-1">
                Titre du poste <span className="text-red-600">*</span>
              </label>
              <Input
                value={form.values.title}
                onChange={(e) => form.setFieldValue("title", e.target.value)}
                onBlur={() => form.setFieldTouched("title")}
                placeholder="Ex: Développeur React Senior"
                error={form.hasError("title")}
                errorMessage={form.getError("title")}
              />
            </div>

            {/* Slug */}
            <SlugField
              value={slug.slug}
              mode={slug.mode}
              inputRef={slug.slugInputRef}
              onChange={slug.setSlug}
              onEditClick={slug.enableCustomMode}
              onAutoClick={slug.enableAutoMode}
              error={form.getError("slug")}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Entreprise */}
              <div>
                <label className="block font-medium mb-1">
                  Entreprise <span className="text-red-600">*</span>
                </label>
                <Input
                  value={form.values.companyName}
                  onChange={(e) => form.setFieldValue("companyName", e.target.value)}
                  onBlur={() => form.setFieldTouched("companyName")}
                  placeholder="Nom de l'entreprise"
                  error={form.hasError("companyName")}
                  errorMessage={form.getError("companyName")}
                />
              </div>

              {/* Secteur */}
              <div>
                <label className="block font-medium mb-1">Secteur d'activité</label>
                <Input
                  value={form.values.industry}
                  onChange={(e) => form.setFieldValue("industry", e.target.value)}
                  placeholder="Ex: Informatique, Finance..."
                />
              </div>

              {/* Type de contrat */}
              <div>
                <label className="block font-medium mb-1">Type de contrat</label>
                <Select
                  value={form.values.jobType}
                  onChange={(e) => form.setFieldValue("jobType", e.target.value)}
                >
                  {jobTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>

              {/* Lieu */}
              <div>
                <label className="block font-medium mb-1">Lieu</label>
                <Input
                  value={form.values.location}
                  onChange={(e) => form.setFieldValue("location", e.target.value)}
                  placeholder="Ville, Pays"
                />
              </div>

              {/* Télétravail */}
              <div>
                <label className="block font-medium mb-1">Télétravail</label>
                <Select
                  value={form.values.isRemote}
                  onChange={(e) => form.setFieldValue("isRemote", e.target.value)}
                >
                  {remoteOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>

              {/* Statut */}
              <div>
                <label className="block font-medium mb-1">Statut</label>
                <Select
                  value={form.values.status}
                  onChange={(e) => form.setFieldValue("status", e.target.value)}
                  disabled={isEditor}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
                {isEditor && (
                  <p className="text-xs text-gray-500 mt-1">
                    Les éditeurs ne peuvent créer que des brouillons
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Logo */}
              <div>
                <label className="block font-medium mb-1">Logo de l'entreprise (URL)</label>
                <Input
                  value={form.values.companyLogo}
                  onChange={(e) => form.setFieldValue("companyLogo", e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              {/* Site web */}
              <div>
                <label className="block font-medium mb-1">Site web de l'entreprise</label>
                <Input
                  value={form.values.companyWebsite}
                  onChange={(e) => form.setFieldValue("companyWebsite", e.target.value)}
                  placeholder="https://entreprise.com"
                  type="url"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========== DETAILS TAB ========== */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description du poste</label>
              <MarkdownEditor
                value={form.values.description}
                onChange={(val) => form.setFieldValue("description", val)}
                placeholder="Décrivez le poste en détail..."
              />
              {form.hasError("description") && (
                <p className="text-red-600 text-sm mt-1">{form.getError("description")}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block font-medium mb-1">Exigences</label>
              <MarkdownEditor
                value={form.values.requirements}
                onChange={(val) => form.setFieldValue("requirements", val)}
                placeholder="Compétences et qualifications requises..."
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block font-medium mb-1">Avantages</label>
              <MarkdownEditor
                value={form.values.benefits}
                onChange={(val) => form.setFieldValue("benefits", val)}
                placeholder="Avantages proposés..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Salaire min */}
              <div>
                <label className="block font-medium mb-1">Salaire minimum</label>
                <Input
                  value={form.values.salaryMin}
                  onChange={(e) => form.setFieldValue("salaryMin", e.target.value)}
                  placeholder="Ex: 5000"
                  type="number"
                />
              </div>

              {/* Salaire max */}
              <div>
                <label className="block font-medium mb-1">Salaire maximum</label>
                <Input
                  value={form.values.salaryMax}
                  onChange={(e) => form.setFieldValue("salaryMax", e.target.value)}
                  placeholder="Ex: 10000"
                  type="number"
                />
              </div>

              {/* Expérience */}
              <div>
                <label className="block font-medium mb-1">Expérience requise</label>
                <Input
                  value={form.values.experienceRequired}
                  onChange={(e) => form.setFieldValue("experienceRequired", e.target.value)}
                  placeholder="Ex: 3-5 ans"
                />
              </div>

              {/* Niveau d'études */}
              <div>
                <label className="block font-medium mb-1">Niveau d'études</label>
                <Input
                  value={form.values.educationLevel}
                  onChange={(e) => form.setFieldValue("educationLevel", e.target.value)}
                  placeholder="Ex: Bac+5"
                />
              </div>

              {/* Compétences */}
              <div>
                <label className="block font-medium mb-1">Compétences requises</label>
                <Input
                  value={form.values.skillsRequired}
                  onChange={(e) => form.setFieldValue("skillsRequired", e.target.value)}
                  placeholder="React, Node.js, TypeScript..."
                />
              </div>

              {/* Langues */}
              <div>
                <label className="block font-medium mb-1">Langues requises</label>
                <Input
                  value={form.values.languagesRequired}
                  onChange={(e) => form.setFieldValue("languagesRequired", e.target.value)}
                  placeholder="Français, Anglais..."
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.values.isFeatured}
                onChange={(e) => form.setFieldValue("isFeatured", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="isFeatured" className="font-medium">
                Mettre en avant cette offre
              </label>
            </div>
          </div>
        )}

        {/* ========== APPLICATION TAB ========== */}
        {activeTab === "application" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Email de candidature */}
              <div>
                <label className="block font-medium mb-1">Email de candidature</label>
                <Input
                  value={form.values.applicationEmail}
                  onChange={(e) => form.setFieldValue("applicationEmail", e.target.value)}
                  placeholder="recrutement@entreprise.com"
                  type="email"
                  error={form.hasError("applicationEmail")}
                  errorMessage={form.getError("applicationEmail")}
                />
              </div>

              {/* URL de candidature */}
              <div>
                <label className="block font-medium mb-1">URL de candidature</label>
                <Input
                  value={form.values.applicationUrl}
                  onChange={(e) => form.setFieldValue("applicationUrl", e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block font-medium mb-1">Téléphone de candidature</label>
                <Input
                  value={form.values.applicationPhone}
                  onChange={(e) => form.setFieldValue("applicationPhone", e.target.value)}
                  placeholder="+212 ..."
                  type="tel"
                />
              </div>

              {/* Date limite */}
              <div>
                <label className="block font-medium mb-1">Date limite de candidature</label>
                <Input
                  value={form.values.applicationDeadline}
                  onChange={(e) => form.setFieldValue("applicationDeadline", e.target.value)}
                  type="date"
                />
              </div>

              {/* Date de début */}
              <div>
                <label className="block font-medium mb-1">Date de début</label>
                <Input
                  value={form.values.startDate}
                  onChange={(e) => form.setFieldValue("startDate", e.target.value)}
                  type="date"
                />
              </div>

              {/* Durée du contrat */}
              <div>
                <label className="block font-medium mb-1">Durée du contrat</label>
                <Input
                  value={form.values.contractDuration}
                  onChange={(e) => form.setFieldValue("contractDuration", e.target.value)}
                  placeholder="Ex: 6 mois, 1 an..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Summary */}
      {errorCount > 0 && (
        <div className="mx-6 mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-red-600 text-sm">
            <span className="font-bold block mb-1">
              {errorCount} erreur{errorCount > 1 ? "s" : ""} :
            </span>
            <ul className="list-disc ml-4 space-y-0.5">
              {formatErrorsForToast(form.errors, 5).map((msg, i) => (
                <li key={i} className="pl-1">{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 p-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/jobs")}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={createMutation.isPending}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Création...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Créer l'offre
            </>
          )}
        </button>
      </div>
    </form>
  );
}

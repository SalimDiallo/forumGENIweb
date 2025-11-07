"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { createJob } from "@/app/admin/jobs/actions";
import { createJobOfferSchema } from "@/lib/validations/jobs";
import Modal from "@/components/Modal";
import { 
  Building, 
  MapPin, 
  Euro, 
  FileText, 
  Mail, 
  Phone,
  Calendar,
  Save,
  AlertCircle,
  X
} from "lucide-react";

const jobTypeOptions = [
  { value: "stage", label: "Stage" },
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "freelance", label: "Freelance" },
  { value: "alternance", label: "Alternance" },
  { value: "autre", label: "Autre" },
];

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

interface JobSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function JobSubmissionModal({ 
  open, 
  onClose, 
  onSuccess 
}: JobSubmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const create = useAction(createJob);

  const form = useForm<z.infer<typeof createJobOfferSchema>>({
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
      status: "draft",
      isFeatured: false,
    },
  });

  // Auto-generate slug from title
  const titleValue = form.watch("title");
  if (titleValue && !form.getValues("slug")) {
    form.setValue("slug", slugify(titleValue));
  }

  const onSubmit = async (values: z.infer<typeof createJobOfferSchema>) => {
    setIsSubmitting(true);
    try {
      await create.execute(values);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle success
  if (create.status === "hasSucceeded") {
    if (onSuccess) onSuccess();
    onClose();
    form.reset();
    return null;
  }

  return (
    <Modal open={open} title="Proposer une offre d'emploi" onClose={onClose}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            Informations de base
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du poste *
              </label>
              <input
                {...form.register("title")}
                placeholder="Ex: Développeur React Senior"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise *
              </label>
              <input
                {...form.register("companyName")}
                placeholder="Nom de l'entreprise"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              {form.formState.errors.companyName && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secteur d'activité
              </label>
              <input
                {...form.register("industry")}
                placeholder="ex: Informatique, Finance..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de contrat
              </label>
              <select
                {...form.register("jobType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {jobTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Lieu
              </label>
              <input
                {...form.register("location")}
                placeholder="Ville, Pays"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Télétravail
              </label>
              <select
                {...form.register("isRemote", { 
                  setValueAs: (value) => value === "" ? undefined : value === "true" 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Non spécifié</option>
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
            </div>
          </div>
        </div>

        {/* Détails du poste */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Détails du poste
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du poste
            </label>
            <textarea
              {...form.register("description")}
              placeholder="Décrivez les responsabilités et missions du poste..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expérience requise
              </label>
              <input
                {...form.register("experienceRequired")}
                placeholder="ex: 2 ans"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'études
              </label>
              <select
                {...form.register("educationLevel")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="aucun">Aucun</option>
                <option value="bac">Bac</option>
                <option value="bac+2">Bac+2</option>
                <option value="bac+3">Bac+3</option>
                <option value="bac+5">Bac+5</option>
                <option value="doctorat">Doctorat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Informations de candidature */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-600" />
            Informations de candidature
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email de contact
              </label>
              <input
                {...form.register("applicationEmail")}
                placeholder="jobs@entreprise.com"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Téléphone de contact
              </label>
              <input
                {...form.register("applicationPhone")}
                placeholder="+212 6 XX XX XX XX"
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de candidature
              </label>
              <input
                {...form.register("applicationUrl")}
                placeholder="https://entreprise.com/candidature"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date limite
              </label>
              <input
                {...form.register("applicationDeadline")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {create.status === "hasErrored" && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">
              {create.result?.serverError || "Erreur lors de la soumission de l'offre."}
            </p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting || create.status === "executing"}
            className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-6 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting || create.status === "executing" ? "Envoi..." : "Soumettre l'offre"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

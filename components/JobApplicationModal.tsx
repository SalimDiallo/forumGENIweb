"use client";
import { useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodError } from "zod";
import { useAction } from "next-safe-action/hooks";
import { submitJobApplication } from "@/app/(sections)/careers/application.actions";
import Modal from "@/components/Modal";
import {
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  GraduationCap,
  Link,
  Calendar,
  DollarSign,
  MessageSquare,
  Save,
  AlertCircle,
  Upload,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// --- SCHEMA ---

const personalDetailsSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+?\d{1,3}[- ]?)?\d{6,15}$/.test(val),
      "Numéro de téléphone invalide"
    ),
});

const documentsLinksSchema = z.object({
  resumeUrl: z
    .string()
    .url("URL de CV invalide")
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url("URL de portfolio invalide")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("URL LinkedIn invalide")
    .optional()
    .or(z.literal("")),
});

const experienceSchema = z.object({
  experience: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
});

const motivationSchema = z.object({
  coverLetter: z.string().optional(),
});

const additionalSchema = z.object({
  availability: z.string().optional(),
  expectedSalary: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(\d{1,3}(?:[.,]\d{3})*(?:\s*-\s*\d{1,3}(?:[.,]\d{3})*)?\s*(MAD|mad)?)?$/.test(
          val
        ),
      "Format de salaire attendu invalide"
    ),
  additionalInfo: z.string().optional(),
});

const applicationFormSchema = personalDetailsSchema
  .merge(documentsLinksSchema)
  .merge(experienceSchema)
  .merge(motivationSchema)
  .merge(additionalSchema);

type ApplicationFormType = z.infer<typeof applicationFormSchema>;

type FormTab = "personal" | "documents" | "experience" | "motivation" | "additional";

interface JobApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  jobOffer: {
    id: number;
    title: string;
    company: string;
  };
}

// --- SUBCOMPONENTS ---

// FormField component with design inspired by CreateJobs.tsx
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

function PersonalDetailsFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormType>();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Prénom *"
          error={errors.firstName?.message}
        >
          <input
            {...register("firstName")}
            placeholder="Votre prénom"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </FormField>

        <FormField
          label="Nom *"
          error={errors.lastName?.message}
        >
          <input
            {...register("lastName")}
            placeholder="Votre nom"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </FormField>

        <FormField
          label="Email *"
          error={errors.email?.message}
        >
          <input
            {...register("email")}
            placeholder="votre@email.com"
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </FormField>

        <FormField
          label="Téléphone"
          error={errors.phone?.message}
        >
          <input
            {...register("phone")}
            placeholder="+212 6 XX XX XX XX"
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </FormField>
      </div>
    </div>
  );
}

function DocumentsLinksFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormType>();
  return (
    <div className="space-y-4">
      <FormField
        label="CV (URL)"
        error={errors.resumeUrl?.message}
        description="Vous pouvez uploader votre CV sur Google Drive, Dropbox, etc."
      >
        <input
          {...register("resumeUrl")}
          placeholder="https://drive.google.com/..."
          type="url"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </FormField>

      <FormField
        label="Portfolio"
        error={errors.portfolioUrl?.message}
      >
        <input
          {...register("portfolioUrl")}
          placeholder="https://votre-portfolio.com"
          type="url"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </FormField>

      <FormField
        label="LinkedIn"
        error={errors.linkedinUrl?.message}
      >
        <input
          {...register("linkedinUrl")}
          placeholder="https://linkedin.com/in/votre-profil"
          type="url"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </FormField>
    </div>
  );
}

function ExperienceFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormType>();
  return (
    <div className="space-y-4">
      <FormField
        label="Expérience professionnelle"
        error={errors.experience?.message}
      >
        <textarea
          {...register("experience")}
          placeholder="Décrivez votre expérience professionnelle..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </FormField>

      <FormField
        label="Formation"
        error={errors.education?.message}
      >
        <textarea
          {...register("education")}
          placeholder="Vos diplômes et formations..."
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </FormField>

      <FormField
        label="Compétences"
        error={errors.skills?.message}
        description="Séparez vos compétences par des virgules"
      >
        <input
          {...register("skills")}
          placeholder="React, Node.js, Python, SQL, etc."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </FormField>
    </div>
  );
}

function MotivationFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormType>();
  return (
    <div className="space-y-4">
      <FormField
        label="Pourquoi souhaitez-vous ce poste ?"
        error={errors.coverLetter?.message}
        description="Expliquez votre motivation pour ce poste"
      >
        <textarea
          {...register("coverLetter")}
          placeholder="Expliquez votre motivation pour ce poste..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </FormField>
    </div>
  );
}

function AdditionalFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormType>();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Disponibilité"
          error={errors.availability?.message}
        >
          <input
            {...register("availability")}
            placeholder="Immédiate, 1 mois, etc."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </FormField>

        <FormField
          label="Salaire attendu"
          error={errors.expectedSalary?.message}
        >
          <input
            {...register("expectedSalary")}
            placeholder="15,000 - 20,000 MAD"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </FormField>
      </div>

      <FormField
        label="Informations complémentaires"
        error={errors.additionalInfo?.message}
      >
        <textarea
          {...register("additionalInfo")}
          placeholder="Toute autre information que vous souhaitez partager..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </FormField>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function JobApplicationModal({
  open,
  onClose,
  onSuccess,
  jobOffer,
}: JobApplicationModalProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const submitApplication = useAction(submitJobApplication);

  const methods = useForm<ApplicationFormType>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      resumeUrl: "",
      coverLetter: "",
      experience: "",
      education: "",
      skills: "",
      portfolioUrl: "",
      linkedinUrl: "",
      availability: "",
      expectedSalary: "",
      additionalInfo: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: ApplicationFormType) => {
    setIsSubmitting(true);
    setClientError(null);
    try {
      const parsed = applicationFormSchema.safeParse(values);
      if (!parsed.success) {
        setClientError("Veuillez corriger les erreurs du formulaire.");
        setIsSubmitting(false);
        return;
      }
      await submitApplication.execute({
        jobOfferId: jobOffer.id,
        ...parsed.data,
      });
    } catch (error: any) {
      setClientError(
        error instanceof ZodError
          ? error.issues.map((e: any) => e.message).join(", ")
          : "Erreur lors de la soumission."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle success
  if (submitApplication.status === "hasSucceeded") {
    if (onSuccess) onSuccess();
    onClose();
    methods.reset();
    setActiveTab("personal");
    return null;
  }

  const tabs = [
    { id: "personal" as FormTab, label: "Informations", icon: User },
    { id: "documents" as FormTab, label: "Documents", icon: FileText },
    { id: "experience" as FormTab, label: "Expérience", icon: Briefcase },
    { id: "motivation" as FormTab, label: "Motivation", icon: MessageSquare },
    { id: "additional" as FormTab, label: "Autres", icon: Calendar },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalDetailsFields />;
      case "documents":
        return <DocumentsLinksFields />;
      case "experience":
        return <ExperienceFields />;
      case "motivation":
        return <MotivationFields />;
      case "additional":
        return <AdditionalFields />;
      default:
        return <PersonalDetailsFields />;
    }
  };

  const canGoNext = () => {
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    return currentTabIndex < tabs.length - 1;
  };

  const canGoPrevious = () => {
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    return currentTabIndex > 0;
  };

  const goToNext = () => {
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (canGoNext()) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const goToPrevious = () => {
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (canGoPrevious()) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  return (
    <Modal
      open={open}
      title={`Candidature - ${jobOffer.title}`}
      onClose={onClose}
    >
      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-emerald-800 text-sm">
          <strong>Poste :</strong> {jobOffer.title} chez{" "}
          <strong>{jobOffer.company}</strong>
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* Mobile-friendly tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`flex items-center gap-1 px-3 py-2 -mb-px border-b-2 transition-colors whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? "border-emerald-600 text-emerald-700 font-semibold"
                      : "border-transparent text-gray-500 hover:text-emerald-600"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-h-[50vh] overflow-y-auto px-1">
              {getTabContent()}
            </div>

            {/* Error Messages */}
            {(clientError || submitApplication.status === "hasErrored") && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">
                  {clientError ||
                    submitApplication.result?.serverError?.message ||
                    "Erreur lors de l'envoi de votre candidature."}
                </p>
              </div>
            )}

            {/* Navigation and Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                {canGoPrevious() && (
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Précédent</span>
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>

                {canGoNext() ? (
                  <button
                    type="button"
                    onClick={goToNext}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || submitApplication.status === "executing"}
                    className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting || submitApplication.status === "executing"
                      ? "Envoi..."
                      : "Envoyer"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}

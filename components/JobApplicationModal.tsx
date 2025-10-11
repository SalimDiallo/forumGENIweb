"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodError } from "zod";
import { useAction } from "next-safe-action/hooks";
import { submitJobApplication } from "@/app/(sections)/careers/application.actions";
import Modal from "@/components/Modal";
import {
  User,
  FileText,
  Briefcase,
  Calendar,
  MessageSquare,
  Save,
  AlertCircle,
  XCircle,
} from "lucide-react";

// SCHEMA ZOD unique avec validation sur chaque élément
const applicationFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z
    .string()
    .email("Email invalide"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+?\d{1,3}[- ]?)?\d{6,15}$/.test(val),
      "Numéro de téléphone invalide"
    ),
  resumeUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val === "" || (() => {
        try { new URL(val); return true; } catch { return false; }
      })(),
      "URL de CV invalide"
    ),
  portfolioUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val === "" || (() => {
        try { new URL(val); return true; } catch { return false; }
      })(),
      "URL de portfolio invalide"
    ),
  linkedinUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val === "" || (() => {
        try { new URL(val); return true; } catch { return false; }
      })(),
      "URL LinkedIn invalide"
    ),
  experience: z
    .string()
    .optional(),
  education: z
    .string()
    .optional(),
  skills: z
    .string()
    .optional(),
  coverLetter: z
    .string()
    .optional(),
  availability: z
    .string()
    .optional(),
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
  additionalInfo: z
    .string()
    .optional(),
});

type ApplicationFormType = z.infer<typeof applicationFormSchema>;

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

// UTILITY pour messages d'erreur
function getErrorMessage(
  errors: Partial<Record<keyof ApplicationFormType, { message?: string }>>,
  key: keyof ApplicationFormType
): string | undefined {
  const err = errors[key];
  if (!err) return undefined;
  if (typeof err.message === "string") return err.message;
  return undefined;
}

// Champ de formulaire individuel avec gestion erreur
function FormField({
  label,
  children,
  error,
  description,
  required,
  inputName,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
  required?: boolean;
  inputName?: string;
}) {
  const errorId = inputName ? `${inputName}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputName} className="text-xs sm:text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {description && (
        <span className="text-[10px] sm:text-xs text-gray-500">{description}</span>
      )}
      {children}
      {error && (
        <div id={errorId} className="flex items-start gap-1 mt-0.5">
          <XCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-[10px] sm:text-xs text-red-600 leading-tight">{error}</span>
        </div>
      )}
    </div>
  );
}

// Composant principal
export default function JobApplicationModal({
  open,
  onClose,
  onSuccess,
  jobOffer,
}: JobApplicationModalProps) {
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

  const {
    register,
    formState: { errors, isLoading, touchedFields }
  } = methods;

  console.log(errors.email?.message);
  

  // gestion de la soumission avec validation zod via react-hook-form
  const onSubmit = async (values: ApplicationFormType) => {
    setClientError(null);
    try {
      await submitApplication.execute({
        jobOfferId: jobOffer.id,
        ...values,
      });
    } catch (error: any) {
      setClientError(
        error instanceof ZodError
          ? error.issues[0].message
          : "Erreur lors de la soumission."
      );
    }
  };

  // gestion succès submit, reset
  if (submitApplication.status === "hasSucceeded") {
    if (onSuccess) onSuccess();
    onClose();
    methods.reset();
    return null;
  }

  // Récupère tous les messages d'erreur uniques actuels
  const allErrorMessages = Object.values(errors)
    .map((err: any) => (typeof err?.message === "string" ? err.message : undefined))
    .filter(Boolean);

  const hasErrors =
    allErrorMessages.length > 0 ||
    clientError ||
    submitApplication.status === "hasErrored";

  return (
    <Modal open={open} title={`Candidature - ${jobOffer.title}`} onClose={onClose}>
      <div className="mb-3 p-2.5 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-emerald-800 text-xs sm:text-sm">
          <strong>Poste :</strong> {jobOffer.title}{" "}
          <span className="hidden sm:inline">
            chez <strong>{jobOffer.company}</strong>
          </span>
        </p>
      </div>

      {/* Affichage global des erreurs */}
      {hasErrors && (
        <div className="mb-3 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-semibold text-red-800">
              Veuillez corriger les erreurs suivantes :
            </p>
          </div>
          <ul className="space-y-1 ml-6">
            {Array.from(
              new Set([...allErrorMessages, clientError].filter(Boolean))
            ).map((msg, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-red-700 list-disc">
                {msg ||
                  (submitApplication.status === "hasErrored" &&
                    submitApplication.result?.serverError?.message)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <div className="max-h-[55vh] sm:max-h-[60vh] overflow-y-auto px-1">
            {/* ===== Début rendu direct des champs du formulaire ===== */}
            <div className="space-y-6 sm:space-y-8">
              {/* Informations personnelles */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-xs sm:text-sm text-emerald-700">
                    Informations personnelles
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    label="Prénom"
                    error={getErrorMessage(errors, "firstName")}
                    required
                    inputName="firstName"
                  >
                    <input
                      {...register("firstName")}
                      id="firstName"
                      placeholder="Votre prénom"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                      className={`w-full border ${
                        errors.firstName
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                      required
                    />
                  </FormField>
                  <FormField
                    label="Nom"
                    error={getErrorMessage(errors, "lastName")}
                    required
                    inputName="lastName"
                  >
                    <input
                      {...register("lastName")}
                      id="lastName"
                      placeholder="Votre nom"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                      className={`w-full border ${
                        errors.lastName
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                      required
                    />
                  </FormField>
                  <FormField
                    label="Email"
                    error={getErrorMessage(errors, "email")}
                    required
                    inputName="email"
                  >
                    <input
                      {...register("email")}
                      id="email"
                      placeholder="votre@email.com"
                      type="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full border ${
                        errors.email
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                      required
                    />
                  </FormField>
                  <FormField
                    label="Téléphone"
                    error={getErrorMessage(errors, "phone")}
                    inputName="phone"
                  >
                    <input
                      {...register("phone")}
                      id="phone"
                      placeholder="+212 6XX XX XX XX"
                      type="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={`w-full border ${
                        errors.phone
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                    />
                  </FormField>
                </div>
              </div>
              {/* Documents & liens */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-xs sm:text-sm text-emerald-700">
                    Documents &amp; liens
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    label="CV (URL)"
                    error={getErrorMessage(errors, "resumeUrl")}
                    description="Uploadez votre CV sur Google Drive, Dropbox, etc."
                    inputName="resumeUrl"
                  >
                    <input
                      {...register("resumeUrl")}
                      id="resumeUrl"
                      placeholder="https://drive.google.com/..."
                      type="url"
                      aria-invalid={!!errors.resumeUrl}
                      aria-describedby={errors.resumeUrl ? "resumeUrl-error" : undefined}
                      className={`w-full border ${
                        errors.resumeUrl
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                    />
                  </FormField>
                  <FormField
                    label="Portfolio"
                    error={getErrorMessage(errors, "portfolioUrl")}
                    inputName="portfolioUrl"
                  >
                    <input
                      {...register("portfolioUrl")}
                      id="portfolioUrl"
                      placeholder="https://votre-portfolio.com"
                      type="url"
                      aria-invalid={!!errors.portfolioUrl}
                      aria-describedby={
                        errors.portfolioUrl ? "portfolioUrl-error" : undefined
                      }
                      className={`w-full border ${
                        errors.portfolioUrl
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                    />
                  </FormField>
                  <FormField
                    label="LinkedIn"
                    error={getErrorMessage(errors, "linkedinUrl")}
                    inputName="linkedinUrl"
                  >
                    <input
                      {...register("linkedinUrl")}
                      id="linkedinUrl"
                      placeholder="https://linkedin.com/in/..."
                      type="url"
                      aria-invalid={!!errors.linkedinUrl}
                      aria-describedby={
                        errors.linkedinUrl ? "linkedinUrl-error" : undefined
                      }
                      className={`w-full border ${
                        errors.linkedinUrl
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                    />
                  </FormField>
                </div>
              </div>
              {/* Expérience et formation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-xs sm:text-sm text-emerald-700">
                    Expérience et formation
                  </span>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <FormField
                    label="Expérience professionnelle"
                    error={getErrorMessage(errors, "experience")}
                    inputName="experience"
                  >
                    <textarea
                      {...register("experience")}
                      id="experience"
                      placeholder="Décrivez votre expérience..."
                      rows={3}
                      aria-invalid={!!errors.experience}
                      aria-describedby={errors.experience ? "experience-error" : undefined}
                      className={`w-full border ${
                        errors.experience
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent resize-none`}
                    />
                  </FormField>
                  <FormField
                    label="Formation"
                    error={getErrorMessage(errors, "education")}
                    inputName="education"
                  >
                    <textarea
                      {...register("education")}
                      id="education"
                      placeholder="Vos diplômes et formations..."
                      rows={2}
                      aria-invalid={!!errors.education}
                      aria-describedby={errors.education ? "education-error" : undefined}
                      className={`w-full border ${
                        errors.education
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent resize-none`}
                    />
                  </FormField>
                  <FormField
                    label="Compétences"
                    error={getErrorMessage(errors, "skills")}
                    description="Séparez par des virgules"
                    inputName="skills"
                  >
                    <input
                      {...register("skills")}
                      id="skills"
                      placeholder="React, Node.js, Python..."
                      aria-invalid={!!errors.skills}
                      aria-describedby={errors.skills ? "skills-error" : undefined}
                      className={`w-full border ${
                        errors.skills
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                    />
                  </FormField>
                </div>
              </div>
              {/* Motivation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-xs sm:text-sm text-emerald-700">
                    Motivation
                  </span>
                </div>
                <FormField
                  label="Pourquoi ce poste ?"
                  error={getErrorMessage(errors, "coverLetter")}
                  description="Expliquez votre motivation"
                  inputName="coverLetter"
                >
                  <textarea
                    {...register("coverLetter")}
                    id="coverLetter"
                    placeholder="Expliquez votre motivation..."
                    rows={4}
                    aria-invalid={!!errors.coverLetter}
                    aria-describedby={
                      errors.coverLetter ? "coverLetter-error" : undefined
                    }
                    className={`w-full border ${
                      errors.coverLetter
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-emerald-500"
                    } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent resize-none`}
                  />
                </FormField>
              </div>
              {/* Informations additionnelles */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-xs sm:text-sm text-emerald-700">
                    Informations additionnelles
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    label="Disponibilité"
                    error={getErrorMessage(errors, "availability")}
                    inputName="availability"
                  >
                    <input
                      {...register("availability")}
                      id="availability"
                      placeholder="Immédiate, 1 mois..."
                      aria-invalid={!!errors.availability}
                      aria-describedby={
                        errors.availability ? "availability-error" : undefined
                      }
                      className={`w-full border ${
                        errors.availability
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                    />
                  </FormField>
                  <FormField
                    label="Salaire attendu"
                    error={getErrorMessage(errors, "expectedSalary")}
                    inputName="expectedSalary"
                  >
                    <input
                      {...register("expectedSalary")}
                      id="expectedSalary"
                      placeholder="15,000 - 20,000 MAD"
                      aria-invalid={!!errors.expectedSalary}
                      aria-describedby={
                        errors.expectedSalary ? "expectedSalary-error" : undefined
                      }
                      className={`w-full border ${
                        errors.expectedSalary
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent`}
                    />
                  </FormField>
                </div>
                <div className="mt-3">
                  <FormField
                    label="Informations complémentaires"
                    error={getErrorMessage(errors, "additionalInfo")}
                    inputName="additionalInfo"
                  >
                    <textarea
                      {...register("additionalInfo")}
                      id="additionalInfo"
                      placeholder="Toute autre information..."
                      rows={3}
                      aria-invalid={!!errors.additionalInfo}
                      aria-describedby={
                        errors.additionalInfo ? "additionalInfo-error" : undefined
                      }
                      className={`w-full border ${
                        errors.additionalInfo
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:border-transparent resize-none`}
                    />
                  </FormField>
                </div>
              </div>
            </div>
            {/* ===== Fin rendu direct des champs du formulaire ===== */}
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end pt-3 mt-3 border-t gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 bg-emerald-600 text-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {isLoading 
                ? "Envoi..."
                : "Envoyer"}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
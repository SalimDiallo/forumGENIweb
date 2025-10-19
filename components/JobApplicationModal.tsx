"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { useMutation } from "@tanstack/react-query";
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
} from "lucide-react";

import {
  Form,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

const applicationFormSchema = z.object({
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
  resumeUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        val === "" ||
        (() => {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        })(),
      "URL de CV invalide"
    ),
  portfolioUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        val === "" ||
        (() => {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        })(),
      "URL de portfolio invalide"
    ),
  linkedinUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        val === "" ||
        (() => {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        })(),
      "URL LinkedIn invalide"
    ),
  experience: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  coverLetter: z.string().optional(),
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

function ErrorsPanel({
  hasErrors,
  errorsMessages,
  mutation,
  clientError,
}: {
  hasErrors: boolean;
  errorsMessages: string[];
  mutation: any;
  clientError: string | null;
}) {
  if (!hasErrors) return null;
  return (
    <div className="mb-3 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-2 mb-2">
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm font-semibold text-red-800">
          Veuillez corriger les erreurs suivantes :
        </p>
      </div>
      <ul className="space-y-1 ml-6">
        {Array.from(new Set([...errorsMessages, clientError].filter(Boolean))).map(
          (msg, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-red-700 list-disc">
              {msg ||
                (mutation.isError &&
                  typeof mutation.error === "object" &&
                  (mutation.error as any)?.message)}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function JobApplicationModal({
  open,
  onClose,
  onSuccess,
  jobOffer,
}: JobApplicationModalProps) {
  const [clientError, setClientError] = useState<string | null>(null);

  const form = useForm<ApplicationFormType>({
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
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: async (values: ApplicationFormType) => {
      return await submitJobApplication({
        jobOfferId: jobOffer.id,
        ...values,
      });
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      setClientError(
        error instanceof ZodError
          ? error.issues[0].message
          : error?.message || "Erreur lors de la soumission."
      );
    },
  });

  const allErrorMessages: string[] = Object.values(form.formState.errors)
    .map((err: any) =>
      typeof err?.message === "string" ? err.message : undefined
    )
    .filter(Boolean);

  const hasErrors =
    allErrorMessages.length > 0 || clientError || mutation.isError;

  const onSubmit = async (values: ApplicationFormType) => {
    setClientError(null);
    mutation.mutate(values);
  };

  if (mutation.isSuccess) {
    return null;
  }

  return (
    <Modal
      open={open}
      title={`Candidature - ${jobOffer.title}`}
      onClose={onClose}
    >
      <div className="mb-3 p-2.5 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-emerald-800 text-xs sm:text-sm">
          <strong>Poste :</strong> {jobOffer.title}{" "}
          <span className="hidden sm:inline">
            chez <strong>{jobOffer.company}</strong>
          </span>
        </p>
      </div>
      <ErrorsPanel
        hasErrors={Boolean(hasErrors)}
        errorsMessages={allErrorMessages}
        mutation={mutation}
        clientError={clientError}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[55vh] sm:max-h-[60vh] overflow-y-auto px-1">
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
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="firstName"
                            placeholder="Votre prénom"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="lastName"
                            placeholder="Votre nom"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="votre@email.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="phone"
                            type="tel"
                            placeholder="+212 6XX XX XX XX"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    control={form.control}
                    name="resumeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CV (URL)</FormLabel>
                        <FormDescription>
                          Uploadez votre CV sur Google Drive, Dropbox, etc.
                        </FormDescription>
                        <FormControl>
                          <Input
                            {...field}
                            id="resumeUrl"
                            type="url"
                            placeholder="https://drive.google.com/..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="portfolioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="portfolioUrl"
                            type="url"
                            placeholder="https://votre-portfolio.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="linkedinUrl"
                            type="url"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expérience professionnelle</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="experience"
                            placeholder="Décrivez votre expérience..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formation</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="education"
                            placeholder="Vos diplômes et formations..."
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compétences</FormLabel>
                        <FormDescription>
                          Séparez par des virgules
                        </FormDescription>
                        <FormControl>
                          <Input
                            {...field}
                            id="skills"
                            placeholder="React, Node.js, Python..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pourquoi ce poste ?</FormLabel>
                      <FormDescription>
                        Expliquez votre motivation
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="coverLetter"
                          placeholder="Expliquez votre motivation..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilité</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="availability"
                            placeholder="Immédiate, 1 mois..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salaire attendu</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="expectedSalary"
                            placeholder="15,000 - 20,000 MAD"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informations complémentaires</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="additionalInfo"
                            placeholder="Toute autre information..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end pt-3 mt-3 border-t gap-2 sm:gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-1.5 bg-emerald-600 text-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              disabled={mutation.isPending}
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {mutation.isPending ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
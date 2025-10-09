"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Upload
} from "lucide-react";

// Schema for the form
const applicationFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  resumeUrl: z.string().url("URL de CV invalide").optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  portfolioUrl: z.string().url("URL de portfolio invalide").optional().or(z.literal("")),
  linkedinUrl: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
  availability: z.string().optional(),
  expectedSalary: z.string().optional(),
  additionalInfo: z.string().optional(),
});

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

export default function JobApplicationModal({ 
  open, 
  onClose, 
  onSuccess,
  jobOffer 
}: JobApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitApplication = useAction(submitJobApplication);

  const form = useForm<z.infer<typeof applicationFormSchema>>({
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
  });

  const onSubmit = async (values: z.infer<typeof applicationFormSchema>) => {
    setIsSubmitting(true);
    try {
      await submitApplication.execute({
        jobOfferId: jobOffer.id,
        ...values,
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle success
  if (submitApplication.status === "hasSucceeded") {
    if (onSuccess) onSuccess();
    onClose();
    form.reset();
    return null;
  }

  return (
    <Modal open={open} title={`Candidature - ${jobOffer.title}`} onClose={onClose}>
      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-emerald-800 text-sm">
          <strong>Poste :</strong> {jobOffer.title} chez <strong>{jobOffer.company}</strong>
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations personnelles */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            Informations personnelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                {...form.register("firstName")}
                placeholder="Votre prénom"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                {...form.register("lastName")}
                placeholder="Votre nom"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input
                {...form.register("email")}
                placeholder="votre@email.com"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Téléphone
              </label>
              <input
                {...form.register("phone")}
                placeholder="+212 6 XX XX XX XX"
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Documents et liens */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Documents et liens
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-1" />
                CV (URL)
              </label>
              <input
                {...form.register("resumeUrl")}
                placeholder="https://drive.google.com/..."
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Vous pouvez uploader votre CV sur Google Drive, Dropbox, etc.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Link className="w-4 h-4 inline mr-1" />
                Portfolio
              </label>
              <input
                {...form.register("portfolioUrl")}
                placeholder="https://votre-portfolio.com"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Link className="w-4 h-4 inline mr-1" />
                LinkedIn
              </label>
              <input
                {...form.register("linkedinUrl")}
                placeholder="https://linkedin.com/in/votre-profil"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Expérience et compétences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            Expérience et compétences
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expérience professionnelle
            </label>
            <textarea
              {...form.register("experience")}
              placeholder="Décrivez votre expérience professionnelle..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="w-4 h-4 inline mr-1" />
              Formation
            </label>
            <textarea
              {...form.register("education")}
              placeholder="Vos diplômes et formations..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compétences
            </label>
            <input
              {...form.register("skills")}
              placeholder="React, Node.js, Python, SQL, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Séparez vos compétences par des virgules
            </p>
          </div>
        </div>

        {/* Lettre de motivation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Lettre de motivation
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pourquoi souhaitez-vous ce poste ?
            </label>
            <textarea
              {...form.register("coverLetter")}
              placeholder="Expliquez votre motivation pour ce poste..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Informations supplémentaires
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilité
              </label>
              <input
                {...form.register("availability")}
                placeholder="Immédiate, 1 mois, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Salaire attendu
              </label>
              <input
                {...form.register("expectedSalary")}
                placeholder="15,000 - 20,000 MAD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informations complémentaires
            </label>
            <textarea
              {...form.register("additionalInfo")}
              placeholder="Toute autre information que vous souhaitez partager..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Messages d'erreur */}
        {submitApplication.status === "hasErrored" && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">
              {submitApplication.result?.serverError?.message || "Erreur lors de l'envoi de votre candidature."}
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
            disabled={isSubmitting || submitApplication.status === "executing"}
            className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-6 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting || submitApplication.status === "executing" ? "Envoi..." : "Envoyer ma candidature"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

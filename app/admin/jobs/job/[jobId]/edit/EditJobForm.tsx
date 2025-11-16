"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateJobOfferSchema } from "./job.edit.schema";
import { useEffect, useState } from "react";
import {
  FileText,
  Settings,
  UserCheck,
  Save,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { doEditJob } from "./job.edit.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { JobOffer } from "@/lib/generated/prisma";
import JobDetailsSection from "../../create/components/JobDetailsSection";
import JobRequirementsSection from "../../create/components/JobRequirementsSection";
import JobApplicationSection from "../../create/components/JobApplicationSection";

type FormTab = "basic" | "details" | "application";

type EditJobFormProps = {
  job: JobOffer;
};

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

function cleanDefaultValues(job: JobOffer) {
  return {
    id: job.id,
    title: job.title ?? "",
    slug: job.slug ?? "",
    companyName: job.companyName ?? "",
    companyLogo: job.companyLogo ?? "",
    companyWebsite: job.companyWebsite ?? "",
    industry: job.industry ?? "",
    jobType: job.jobType ?? "",
    location: job.location ?? "",
    isRemote: job.isRemote ?? undefined,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency ?? "",
    salaryPeriod: job.salaryPeriod ?? "",
    description: job.description ?? "",
    requirements: job.requirements ?? "",
    benefits: job.benefits ?? "",
    applicationEmail: job.applicationEmail ?? "",
    applicationUrl: job.applicationUrl ?? "",
    applicationPhone: job.applicationPhone ?? "",
    applicationDeadline: job.applicationDeadline
      ? new Date(job.applicationDeadline).toISOString().slice(0, 10)
      : "",
    experienceRequired: job.experienceRequired ?? "",
    educationLevel: job.educationLevel ?? "",
    contractDuration: job.contractDuration ?? "",
    startDate: job.startDate ? new Date(job.startDate).toISOString().slice(0, 10) : "",
    skillsRequired: job.skillsRequired ?? "",
    languagesRequired: job.languagesRequired ?? "",
    status: job.status ?? "",
    isFeatured: job.isFeatured ?? undefined,
  };
}

export default function EditJobForm({ job }: EditJobFormProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const router = useRouter();
  const cleanedDefaults = cleanDefaultValues(job);

  const editForm = useForm<z.infer<typeof updateJobOfferSchema>>({
    resolver: zodResolver(updateJobOfferSchema),
    defaultValues: cleanedDefaults,
  });

  // Auto-generate slug when title changes (optional feature)
  const titleValue = editForm.watch("title");
  useEffect(() => {
    // Only auto-generate if slug is empty or matches the old slugified title
    const currentSlug = editForm.getValues("slug");
    if (!currentSlug || currentSlug === slugify(cleanedDefaults.title)) {
      editForm.setValue("slug", slugify(titleValue));
    }
    // eslint-disable-next-line
  }, [titleValue]);

  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateJobOfferSchema>) => {
      return await doEditJob(data);
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success("Annonce modifiée avec succès");
        router.push("/admin/jobs");
      } else if (result?.serverError) {
        toast.error(result.serverError);
        console.error("Échec de la modification:", result.serverError);
      } else if (result?.validationErrors) {
        toast.error("Veuillez corriger les erreurs dans le formulaire");
        console.error("Erreurs de validation:", result.validationErrors);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Erreur lors de la modification de l'annonce";
      toast.error(errorMessage);
      console.error("Erreur lors de la modification:", error);
    },
  });

  function onSubmitEdit(values: z.infer<typeof updateJobOfferSchema>) {
    updateMutation.mutate(values);
  }

  const tabs = [
    { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
    { id: "details" as FormTab, label: "Détails du poste", icon: Settings },
    { id: "application" as FormTab, label: "Candidature", icon: UserCheck },
  ];

  return (
    <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="p-6">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
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
            <JobDetailsSection
              register={editForm.register}
              errors={editForm.formState.errors}
            />
          )}

          {activeTab === "details" && (
            <JobRequirementsSection
              register={editForm.register}
              errors={editForm.formState.errors}
              control={editForm.control}
              watch={editForm.watch}
              setValue={editForm.setValue}
              isExecuting={updateMutation.isPending}
            />
          )}

          {activeTab === "application" && (
            <JobApplicationSection
              register={editForm.register}
              errors={editForm.formState.errors}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              router.push("/admin/jobs");
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={updateMutation.isPending}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent  animate-spin" />
                Modification en cours...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Modifier l'annonce
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { doCreateJob } from "./job.create.action";
import { createJobOfferSchema } from "./job.create.schema";
import {
  FileText,
  Settings,
  UserCheck,
  Save,
} from "lucide-react";
import JobDetailsSection from "./components/JobDetailsSection";
import JobRequirementsSection from "./components/JobRequirementsSection";
import JobApplicationSection from "./components/JobApplicationSection";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export default function CreateJobForm() {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const router = useRouter();

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

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createJobOfferSchema>) => {
      return await doCreateJob(data);
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success("Annonce créée avec succès");
        createForm.reset();
        router.push("/admin/jobs");
      } else if (result?.serverError) {
        toast.error(result.serverError);
        console.error("Échec de la création:", result.serverError);
      } else if (result?.validationErrors) {
        toast.error("Veuillez corriger les erreurs dans le formulaire");
        console.error("Erreurs de validation:", result.validationErrors);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Erreur lors de la création de l'annonce";
      toast.error(errorMessage);
      console.error("Erreur lors de la création:", error);
    },
  });

  function onSubmitCreate(values: z.infer<typeof createJobOfferSchema>) {
    createMutation.mutate(values);
  }

  const tabs = [
    { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
    { id: "details" as FormTab, label: "Détails du poste", icon: Settings },
    { id: "application" as FormTab, label: "Candidature", icon: UserCheck },
  ];

  return (
    <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="p-6">
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
                register={createForm.register}
                errors={createForm.formState.errors}
              />
            )}

          {activeTab === "details" && (
            <JobRequirementsSection
              register={createForm.register}
              errors={createForm.formState.errors}
              control={createForm.control}
              watch={createForm.watch}
              setValue={createForm.setValue}
              isExecuting={createMutation.isPending}
            />
          )}

          {activeTab === "application" && (
            <JobApplicationSection
              register={createForm.register}
              errors={createForm.formState.errors}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              createForm.reset();
              router.push("/admin/jobs");
            }}
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
                <div className="w-4 h-4 border-2 border-white border-t-transparent  animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Créer l'annonce
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

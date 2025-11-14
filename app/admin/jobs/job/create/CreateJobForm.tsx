"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { z } from "zod";
import { doCreateJob } from "./job.create.action";
import { createJobOfferSchema } from "./job.create.schema";
import {
  FileText,
  Settings,
  UserCheck,
  Save,
  AlertCircle,
} from "lucide-react";
import JobDetailsSection from "./components/JobDetailsSection";
import JobRequirementsSection from "./components/JobRequirementsSection";
import JobApplicationSection from "./components/JobApplicationSection";

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
                isExecuting={create.status === "executing"}
              />
            )}

            {activeTab === "application" && (
              <JobApplicationSection
                register={createForm.register}
                errors={createForm.formState.errors}
              />
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

"use client";
import BackButton from "@/components/BackButton";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import EditJobForm from "./EditJobForm";
import { useAction } from "next-safe-action/hooks";
import { doEditJob } from "./job.edit.action";
import { z } from "zod";
import { updateJobOfferSchema } from "./job.edit.schema";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.jobId as string, 10);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);

  const updateAction = useAction(doEditJob);

  // Options for select fields
  const jobTypeOptions = [
    { value: "stage", label: "Stage" },
    { value: "cdi", label: "CDI" },
    { value: "cdd", label: "CDD" },
    { value: "freelance", label: "Freelance" },
    { value: "alternance", label: "Alternance" },
    { value: "autre", label: "Autre" },
  ];

  const statusOptions = [
    { value: "draft", label: "Brouillon" },
    { value: "published", label: "Publié" },
    { value: "archived", label: "Archivé" },
  ];

  const educationLevelOptions = [
    { value: "aucun", label: "Aucun" },
    { value: "bac", label: "Bac" },
    { value: "bac+2", label: "Bac+2" },
    { value: "bac+3", label: "Bac+3" },
    { value: "bac+5", label: "Bac+5" },
    { value: "doctorat", label: "Doctorat" },
  ];

  useEffect(() => {
    // Fetch job data
    fetch(`/api/jobs/${jobId}`)
      .then(res => res.json())
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [jobId]);

  const handleSubmit = (values: z.infer<typeof updateJobOfferSchema>) => {
    updateAction.execute(values);
  };

  useEffect(() => {
    if (updateAction.status === "hasSucceeded") {
      setOpen(false);
      router.push("/admin/jobs");
    }
  }, [updateAction.status, router]);

  const handleClose = () => {
    setOpen(false);
    router.push("/admin/jobs");
  };

  if (loading) {
    return (
      <div className="container p-6">
        <BackButton />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container p-6">
        <BackButton />
        <p className="text-center text-gray-600 py-12">Offre d'emploi introuvable</p>
      </div>
    );
  }

  return (
    <div>
      <BackButton />
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Modifier l'offre d'emploi</h1>
        <EditJobForm
          open={open}
          onClose={handleClose}
          editingId={jobId}
          jobs={job ? [job] : []}
          onSubmitEdit={handleSubmit}
          upd={updateAction}
          jobTypeOptions={jobTypeOptions}
          statusOptions={statusOptions}
          educationLevelOptions={educationLevelOptions}
          setEditingId={() => {}}
          setOpenEdit={setOpen}
        />
      </div>
    </div>
  );
}

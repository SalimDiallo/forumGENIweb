"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/Modal";
import { updateJobOfferSchema } from "@/lib/validations/jobs";
import { useEffect, useMemo } from "react";

type EditJobsProps = {
  open: boolean;
  onClose: () => void;
  editingId: number | null;
  jobs: any[];
  onSubmitEdit: (values: z.infer<typeof updateJobOfferSchema>) => void;
  upd: any;
  jobTypeOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  educationLevelOptions: { value: string; label: string }[];
  setEditingId: (id: number | null) => void;
  setOpenEdit: (open: boolean) => void;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}

function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

export default function EditJobs({
  open,
  onClose,
  editingId,
  jobs,
  onSubmitEdit,
  upd,
  jobTypeOptions,
  statusOptions,
  educationLevelOptions,
  setEditingId,
  setOpenEdit,
}: EditJobsProps) {
  const editingItem = useMemo(
    () => jobs?.find((j: any) => j.id === editingId) ?? null,
    [editingId, jobs]
  );

  const editForm = useForm<z.infer<typeof updateJobOfferSchema>>({
    resolver: zodResolver(updateJobOfferSchema),
    values: editingItem
      ? {
          id: editingItem.id,
          title: editingItem.title ?? "",
          slug: editingItem.slug ?? "",
          companyName: editingItem.companyName ?? "",
          companyLogo: editingItem.companyLogo ?? "",
          companyWebsite: editingItem.companyWebsite ?? "",
          industry: editingItem.industry ?? "",
          jobType: editingItem.jobType ?? "stage",
          location: editingItem.location ?? "",
          isRemote: editingItem.isRemote ?? false,
          salaryMin: editingItem.salaryMin ?? undefined,
          salaryMax: editingItem.salaryMax ?? undefined,
          salaryCurrency: editingItem.salaryCurrency ?? "MAD",
          salaryPeriod: editingItem.salaryPeriod ?? "month",
          description: editingItem.description ?? "",
          requirements: editingItem.requirements ?? "",
          benefits: editingItem.benefits ?? "",
          applicationEmail: editingItem.applicationEmail ?? "",
          applicationUrl: editingItem.applicationUrl ?? "",
          applicationPhone: editingItem.applicationPhone ?? "",
          applicationDeadline: editingItem.applicationDeadline
            ? new Date(editingItem.applicationDeadline).toISOString().slice(0, 10)
            : "",
          experienceRequired: editingItem.experienceRequired ?? "",
          educationLevel: editingItem.educationLevel ?? "",
          contractDuration: editingItem.contractDuration ?? "",
          startDate: editingItem.startDate
            ? new Date(editingItem.startDate).toISOString().slice(0, 10)
            : "",
          skillsRequired: editingItem.skillsRequired ?? "",
          languagesRequired: editingItem.languagesRequired ?? "",
          status: editingItem.status ?? "draft",
          isFeatured: editingItem.isFeatured ?? false,
        }
      : undefined,
  });

  // Auto-generate slug for edit form
  const editTitleValue = editForm.watch("title");
  const editSlugValue = editForm.watch("slug");
  useEffect(() => {
    if (
      editTitleValue &&
      (!editSlugValue ||
        editSlugValue === slugify(editForm.formState.defaultValues?.title || ""))
    ) {
      editForm.setValue("slug", slugify(editTitleValue));
    }
    // eslint-disable-next-line
  }, [editTitleValue]);

  return (
    <Modal
      open={open && !!editingItem}
      title="Modifier l'annonce"
      onClose={() => {
        setOpenEdit(false);
        setEditingId(null);
        onClose();
      }}
    >
      {editingItem && (
        <form
          onSubmit={editForm.handleSubmit(onSubmitEdit)}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Titre" error={editForm.formState.errors.title?.message}>
              <input
                {...editForm.register("title")}
                placeholder="Titre du poste"
                className="input input-bordered w-full"
                autoFocus
              />
            </FormField>
            <FormField label="Slug" error={editForm.formState.errors.slug?.message}>
              <input
                {...editForm.register("slug")}
                placeholder="ex: developpeur-react"
                className="input input-bordered w-full"
              />
            </FormField>
            <FormField label="Entreprise" error={editForm.formState.errors.companyName?.message}>
              <input
                {...editForm.register("companyName")}
                placeholder="Nom de l'entreprise"
                className="input input-bordered w-full"
              />
            </FormField>
            <FormField label="Logo de l'entreprise" error={editForm.formState.errors.companyLogo?.message}>
              <input
                {...editForm.register("companyLogo")}
                placeholder="URL du logo"
                className="input input-bordered w-full"
                type="url"
              />
            </FormField>
            <FormField label="Site web de l'entreprise" error={editForm.formState.errors.companyWebsite?.message}>
              <input
                {...editForm.register("companyWebsite")}
                placeholder="https://entreprise.com"
                className="input input-bordered w-full"
                type="url"
              />
            </FormField>
            <FormField label="Secteur d'activité" error={editForm.formState.errors.industry?.message}>
              <input
                {...editForm.register("industry")}
                placeholder="ex: Informatique, Finance..."
                className="input input-bordered w-full"
              />
            </FormField>
            <FormField label="Type de contrat" error={editForm.formState.errors.jobType?.message}>
              <select
                {...editForm.register("jobType")}
                className="select select-bordered w-full"
              >
                {jobTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Lieu" error={editForm.formState.errors.location?.message}>
              <input
                {...editForm.register("location")}
                placeholder="Ville, Pays"
                className="input input-bordered w-full"
              />
            </FormField>
            <FormField label="Télétravail" error={editForm.formState.errors.isRemote?.message}>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  {...editForm.register("isRemote")}
                  className="checkbox checkbox-primary"
                />
                Poste en télétravail
              </label>
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Salaire min" error={editForm.formState.errors.salaryMin?.message}>
              <input
                {...editForm.register("salaryMin", { valueAsNumber: true })}
                placeholder="Salaire min"
                className="input input-bordered w-full"
                type="number"
                min={0}
              />
            </FormField>
            <FormField label="Salaire max" error={editForm.formState.errors.salaryMax?.message}>
              <input
                {...editForm.register("salaryMax", { valueAsNumber: true })}
                placeholder="Salaire max"
                className="input input-bordered w-full"
                type="number"
                min={0}
              />
            </FormField>
            <FormField label="Devise" error={editForm.formState.errors.salaryCurrency?.message}>
              <input
                {...editForm.register("salaryCurrency")}
                placeholder="MAD, EUR, USD..."
                className="input input-bordered w-full"
              />
            </FormField>
            <FormField label="Période" error={editForm.formState.errors.salaryPeriod?.message}>
              <input
                {...editForm.register("salaryPeriod")}
                placeholder="ex: month"
                className="input input-bordered w-full"
              />
            </FormField>
          </div>
          <FormField label="Description" error={editForm.formState.errors.description?.message}>
            <textarea
              {...editForm.register("description")}
              placeholder="Description du poste"
              className="textarea textarea-bordered w-full min-h-[100px]"
            />
          </FormField>
          <FormField label="Exigences" error={editForm.formState.errors.requirements?.message}>
            <textarea
              {...editForm.register("requirements")}
              placeholder="Exigences du poste"
              className="textarea textarea-bordered w-full min-h-[60px]"
            />
          </FormField>
          <FormField label="Avantages" error={editForm.formState.errors.benefits?.message}>
            <textarea
              {...editForm.register("benefits")}
              placeholder="Avantages proposés"
              className="textarea textarea-bordered w-full min-h-[60px]"
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email de candidature" error={editForm.formState.errors.applicationEmail?.message}>
              <input
                {...editForm.register("applicationEmail")}
                placeholder="ex: jobs@entreprise.com"
                className="input input-bordered w-full"
                type="email"
              />
            </FormField>
            <FormField label="URL de candidature" error={editForm.formState.errors.applicationUrl?.message}>
              <input
                {...editForm.register("applicationUrl")}
                placeholder="Lien vers le formulaire de candidature"
                className="input input-bordered w-full"
                type="url"
              />
            </FormField>
            <FormField label="Téléphone de contact" error={editForm.formState.errors.applicationPhone?.message}>
              <input
                {...editForm.register("applicationPhone")}
                placeholder="Numéro de téléphone"
                className="input input-bordered w-full"
                type="tel"
              />
            </FormField>
            <FormField label="Date limite de candidature" error={editForm.formState.errors.applicationDeadline?.message}>
              <input
                {...editForm.register("applicationDeadline")}
                className="input input-bordered w-full"
                type="date"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Expérience requise" error={editForm.formState.errors.experienceRequired?.message}>
              <input
                {...editForm.register("experienceRequired")}
                placeholder="ex: 2 ans"
                className="input input-bordered w-full"
              />
            </FormField>
            <FormField label="Niveau d'études" error={editForm.formState.errors.educationLevel?.message}>
              <select
                {...editForm.register("educationLevel")}
                className="select select-bordered w-full"
              >
                <option value="">Sélectionner</option>
                {educationLevelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Durée du contrat" error={editForm.formState.errors.contractDuration?.message}>
              <input
                {...editForm.register("contractDuration")}
                placeholder="ex: 6 mois"
                className="input input-bordered w-full"
              />
            </FormField>
            <FormField label="Date de début" error={editForm.formState.errors.startDate?.message}>
              <input
                {...editForm.register("startDate")}
                className="input input-bordered w-full"
                type="date"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Compétences requises" error={editForm.formState.errors.skillsRequired?.message}>
              <input
                {...editForm.register("skillsRequired")}
                placeholder="ex: React, Node.js, SQL"
                className="input input-bordered w-full"
              />
            </FormField>
            <FormField label="Langues requises" error={editForm.formState.errors.languagesRequired?.message}>
              <input
                {...editForm.register("languagesRequired")}
                placeholder="ex: Français, Anglais"
                className="input input-bordered w-full"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Statut" error={editForm.formState.errors.status?.message}>
              <select
                {...editForm.register("status")}
                className="select select-bordered w-full"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Mettre en avant" error={editForm.formState.errors.isFeatured?.message}>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  {...editForm.register("isFeatured")}
                  className="checkbox checkbox-primary"
                />
                Mettre en avant
              </label>
            </FormField>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setOpenEdit(false);
                setEditingId(null);
                onClose();
              }}
              className="btn btn-ghost"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={upd.status === "executing"}
            >
              {upd.status === "executing" ? "Sauvegarde…" : "Enregistrer"}
            </button>
          </div>
          {upd.result?.serverError && (
            <p className="text-red-600">{upd.result.serverError.message}</p>
          )}
        </form>
      )}
    </Modal>
  );
}

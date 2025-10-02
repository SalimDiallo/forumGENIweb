"use client";
import { useAction } from "next-safe-action/hooks";
import { createJob, deleteJob, listJobs, updateJob } from "./actions";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/admin/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobOfferSchema, updateJobOfferSchema } from "@/lib/validations/jobs";

export default function AdminJobsPage() {
  const list = useAction(listJobs);
  const create = useAction(createJob);
  const del = useAction(deleteJob);
  const upd = useAction(updateJob);

  useEffect(() => {
    list.execute();
  }, []);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const createForm = useForm<z.infer<typeof createJobOfferSchema>>({
    resolver: zodResolver(createJobOfferSchema),
    defaultValues: {
      title: "", slug: "", companyName: "", jobType: "stage", description: "",
      salaryCurrency: "MAD", salaryPeriod: "month", status: "draft", isFeatured: false,
    },
  });

  const editingItem = useMemo(() => list.result?.data?.jobs?.find((j: any) => j.id === editingId) ?? null, [editingId, list.result]);
  const editForm = useForm<z.infer<typeof updateJobOfferSchema>>({
    resolver: zodResolver(updateJobOfferSchema),
    values: editingItem ? {
      id: editingItem.id,
      title: editingItem.title,
      slug: editingItem.slug,
      companyName: editingItem.companyName,
      companyLogo: editingItem.companyLogo ?? undefined,
      companyWebsite: editingItem.companyWebsite ?? undefined,
      industry: editingItem.industry ?? undefined,
      jobType: editingItem.jobType,
      location: editingItem.location ?? undefined,
      isRemote: editingItem.isRemote,
      salaryMin: editingItem.salaryMin ?? undefined,
      salaryMax: editingItem.salaryMax ?? undefined,
      salaryCurrency: editingItem.salaryCurrency,
      salaryPeriod: editingItem.salaryPeriod,
      description: editingItem.description,
      requirements: editingItem.requirements ?? undefined,
      benefits: editingItem.benefits ?? undefined,
      applicationEmail: editingItem.applicationEmail ?? undefined,
      applicationUrl: editingItem.applicationUrl ?? undefined,
      applicationPhone: editingItem.applicationPhone ?? undefined,
      applicationDeadline: editingItem.applicationDeadline ? new Date(editingItem.applicationDeadline).toISOString() : undefined,
      experienceRequired: editingItem.experienceRequired,
      educationLevel: editingItem.educationLevel,
      contractDuration: editingItem.contractDuration ?? undefined,
      startDate: editingItem.startDate ? new Date(editingItem.startDate).toISOString() : undefined,
      skillsRequired: editingItem.skillsRequired ?? undefined,
      languagesRequired: editingItem.languagesRequired ?? undefined,
      status: editingItem.status,
      isFeatured: editingItem.isFeatured,
    } : undefined,
  });

  function onSubmitCreate(values: z.infer<typeof createJobOfferSchema>) {
    create.execute(values);
  }

  const onSubmitEdit = (values: z.infer<typeof updateJobOfferSchema>) => {
    upd.execute(values);
  };

  async function onDelete(id: number) {
    del.execute({ id });
  }

  useEffect(() => {
    if (create.status === "hasSucceeded") {
      list.execute();
      setOpenCreate(false);
      createForm.reset();
    }
  }, [create.status]);

  useEffect(() => {
    if (upd.status === "hasSucceeded") {
      list.execute();
      setOpenEdit(false);
      setEditingId(null);
    }
  }, [upd.status]);

  useEffect(() => {
    if (del.status === "hasSucceeded") {
      list.execute();
    }
  }, [del.status]);

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white rounded-md border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Annonces</h2>
          <button onClick={() => setOpenCreate(true)} className="bg-gray-900 text-white rounded px-3 py-2">Nouvelle annonce</button>
        </div>
      </section>

      <Modal open={openCreate} title="Créer une annonce" onClose={() => setOpenCreate(false)}>
        <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="grid grid-cols-1 gap-3">
          <input {...createForm.register("title")} placeholder="Titre" className="border rounded px-3 py-2" />
          <input {...createForm.register("slug")} placeholder="Slug" className="border rounded px-3 py-2" />
          <input {...createForm.register("companyName")} placeholder="Entreprise" className="border rounded px-3 py-2" />
          <input {...createForm.register("jobType")} placeholder="Type (stage, cdi, ...)" className="border rounded px-3 py-2" />
          <textarea {...createForm.register("description")} placeholder="Description" className="border rounded px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <input {...createForm.register("salaryCurrency")} placeholder="Devise" className="border rounded px-3 py-2" />
            <input {...createForm.register("salaryPeriod")} placeholder="Période (month)" className="border rounded px-3 py-2" />
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <button type="button" onClick={() => setOpenCreate(false)} className="px-3 py-2">Annuler</button>
            <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2" disabled={create.status === "executing"}>
              {create.status === "executing" ? "Création…" : "Créer"}
            </button>
          </div>
          {create.result?.serverError && (
            <p className="text-red-600">{create.result.serverError.message}</p>
          )}
        </form>
      </Modal>

      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Annonces</h2>
        {list.status === "executing" && <p>Chargement…</p>}
        <ul className="divide-y">
          {list.result?.data?.jobs?.map((j: any) => (
            <li key={j.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{j.title}</p>
                <p className="text-sm text-gray-600">{j.companyName} — {j.jobType}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setEditingId(j.id); setOpenEdit(true); }} className="text-emerald-600 hover:underline">Éditer</button>
                <button onClick={() => onDelete(j.id)} className="text-red-600 hover:underline">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Modal open={openEdit && !!editingItem} title="Modifier l'annonce" onClose={() => { setOpenEdit(false); setEditingId(null); }}>
        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="grid grid-cols-1 gap-3">
          <input {...editForm.register("title")} placeholder="Titre" className="border rounded px-3 py-2" />
          <input {...editForm.register("slug")} placeholder="Slug" className="border rounded px-3 py-2" />
          <input {...editForm.register("companyName")} placeholder="Entreprise" className="border rounded px-3 py-2" />
          <input {...editForm.register("jobType")} placeholder="Type" className="border rounded px-3 py-2" />
          <textarea {...editForm.register("description")} placeholder="Description" className="border rounded px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <input {...editForm.register("salaryMin", { valueAsNumber: true })} placeholder="Salaire min" className="border rounded px-3 py-2" />
            <input {...editForm.register("salaryMax", { valueAsNumber: true })} placeholder="Salaire max" className="border rounded px-3 py-2" />
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <button type="button" onClick={() => { setOpenEdit(false); setEditingId(null); }} className="px-3 py-2">Annuler</button>
            <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2" disabled={upd.status === "executing"}>
              {upd.status === "executing" ? "Sauvegarde…" : "Enregistrer"}
            </button>
          </div>
          {upd.result?.serverError && (
            <p className="text-red-600">{upd.result.serverError.message}</p>
          )}
        </form>
      </Modal>
    </div>
  );
}



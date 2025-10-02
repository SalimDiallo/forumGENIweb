"use client";
import { useAction } from "next-safe-action/hooks";
import { createCategory, deleteCategory, listCategories } from "../actions";
import { useEffect, useState } from "react";
import Modal from "@/components/admin/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema } from "@/lib/validations/blog";

export default function AdminBlogCategoriesPage() {
  const list = useAction(listCategories);
  const create = useAction(createCategory);
  const del = useAction(deleteCategory);

  useEffect(() => {
    list.execute();
  }, []);

  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "", slug: "", description: undefined, color: "#10B981", isActive: true },
  });

  function onSubmit(values: z.infer<typeof createCategorySchema>) {
    create.execute(values);
  }

  useEffect(() => {
    if (create.status === "hasSucceeded" || del.status === "hasSucceeded") {
      list.execute();
      if (create.status === "hasSucceeded") {
        setOpen(false);
        form.reset();
      }
    }
  }, [create.status, del.status]);

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white rounded-md border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Catégories</h2>
          <button onClick={() => setOpen(true)} className="bg-gray-900 text-white rounded px-3 py-2">Nouvelle catégorie</button>
        </div>
      </section>

      <Modal open={open} title="Créer une catégorie" onClose={() => setOpen(false)}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
          <input {...form.register("name")} placeholder="Nom" className="border rounded px-3 py-2" />
          {form.formState.errors.name && <p className="text-red-600 text-sm">{form.formState.errors.name.message as string}</p>}
          <input {...form.register("slug")} placeholder="Slug" className="border rounded px-3 py-2" />
          {form.formState.errors.slug && <p className="text-red-600 text-sm">{form.formState.errors.slug.message as string}</p>}
          <input {...form.register("description")} placeholder="Description (optionnel)" className="border rounded px-3 py-2" />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-2">Annuler</button>
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
        <h2 className="text-lg font-semibold mb-3">Liste des catégories</h2>
        {list.status === "executing" && <p>Chargement…</p>}
        <ul className="divide-y">
          {list.result?.data?.categories?.map((c: any) => (
            <li key={c.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-600">/{c.slug}</p>
              </div>
              <button onClick={() => del.execute({ id: c.id })} className="text-red-600 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}



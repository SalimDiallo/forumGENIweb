"use client";
import { useAction } from "next-safe-action/hooks";
import { createTag, listTags } from "../tags-actions";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTagSchema } from "@/lib/validations/blog";
import { toast } from "sonner";
import { DeleteTagButton } from "./DeleteTagButton";

export default function AdminTagsPage() {
  const list = useAction(listTags);
  const create = useAction(createTag);

  useEffect(() => {
    list.execute();
  }, []);

  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createTagSchema>>({
    resolver: zodResolver(createTagSchema),
    defaultValues: { name: "", slug: "", color: "#10B981" },
  });

  function onSubmit(values: z.infer<typeof createTagSchema>) {
    create.execute(values);
  }

  const handleRefresh = () => {
    list.execute();
  };

  // Auto-generate slug from name
  const nameValue = form.watch("name");
  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug);
    }
  }, [nameValue, form]);

  useEffect(() => {
    if (create.status === "hasSucceeded") {
      list.execute();
      setOpen(false);
      form.reset();
      toast.success("Tag créé avec succès");
    }
    if (create.status === "hasErrored") {
      toast.error(create.result?.serverError || "Erreur lors de la création");
    }
  }, [create.status, create.result]);

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white rounded-md border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tags</h2>
          <button onClick={() => setOpen(true)} className="bg-gray-900 text-white rounded px-3 py-2">Nouveau tag</button>
        </div>
      </section>

      <Modal open={open} title="Créer un tag" onClose={() => setOpen(false)}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
          <input {...form.register("name")} placeholder="Nom" className="border rounded px-3 py-2" />
          {form.formState.errors.name && <p className="text-red-600 text-sm">{form.formState.errors.name.message as string}</p>}
          <input {...form.register("slug")} placeholder="Slug" className="border rounded px-3 py-2" />
          {form.formState.errors.slug && <p className="text-red-600 text-sm">{form.formState.errors.slug.message as string}</p>}
          <div className="flex items-center justify-end gap-2 mt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-2">Annuler</button>
            <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2" disabled={create.status === "executing"}>
              {create.status === "executing" ? "Création…" : "Créer"}
            </button>
          </div>
          {create.result?.serverError && (
            <p className="text-red-600">{create.result.serverError}</p>
          )}
        </form>
      </Modal>

      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Liste des tags</h2>
        {list.status === "executing" && <p>Chargement…</p>}
        <ul className="divide-y">
          {list.result?.data?.tags?.map((t: any) => (
            <li key={t.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-gray-600">
                  /{t.slug}
                  {t._count?.posts > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({t._count.posts} article{t._count.posts > 1 ? 's' : ''})
                    </span>
                  )}
                </p>
              </div>
              <DeleteTagButton
                tagId={t.id}
                tagName={t.name}
                postCount={t._count?.posts || 0}
                onSuccess={handleRefresh}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}



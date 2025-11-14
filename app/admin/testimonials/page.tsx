"use client";
import { useAction } from "next-safe-action/hooks";
import { createTestimonial, deleteTestimonial, listTestimonials } from "./actions";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/admin/Pagination";

export default function AdminTestimonialsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const list = useAction(listTestimonials);
  const create = useAction(createTestimonial);
  const del = useAction(deleteTestimonial);

  useEffect(() => {
    list.execute({ page: currentPage, limit: itemsPerPage });
  }, [currentPage]);

  async function onCreate(formData: FormData) {
    create.execute({
      name: String(formData.get("name") || ""),
      videoUrl: String(formData.get("videoUrl") || ""),
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
    });
  }

  useEffect(() => {
    if (create.status === "hasSucceeded" || del.status === "hasSucceeded") {
      list.execute({ page: currentPage, limit: itemsPerPage });
    }
  }, [create.status, del.status]);

  const totalPages = list.result?.data?.totalPages || 0;
  const total = list.result?.data?.total || 0;

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Ajouter un témoignage vidéo</h2>
        <form action={onCreate} className="grid grid-cols-1 gap-3 max-w-lg">
          <input name="name" placeholder="Nom" className="border rounded px-3 py-2" />
          <input name="videoUrl" placeholder="URL de la vidéo" className="border rounded px-3 py-2" />
          <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2">Ajouter</button>
        </form>
      </section>

      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">
          Témoignages {total > 0 && `(${total} au total)`}
        </h2>
        <ul className="divide-y">
          {list.result?.data?.testimonials?.map((t: any) => (
            <li key={t.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{t.name}</p>
                <a href={t.videoUrl} className="text-emerald-600 hover:underline" target="_blank" rel="noreferrer">Voir la vidéo</a>
              </div>
              <button onClick={() => del.execute({ id: t.id })} className="text-red-600 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={total}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}



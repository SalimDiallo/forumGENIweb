"use client";
import { useAction } from "next-safe-action/hooks";
import { createMedia, deleteMedia, listMedia } from "./actions";
import { useEffect } from "react";

export default function AdminMediaPage() {
  const list = useAction(listMedia);
  const create = useAction(createMedia);
  const del = useAction(deleteMedia);

  useEffect(() => {
    list.execute();
  }, []);

  async function onCreate(formData: FormData) {
    create.execute({
      title: String(formData.get("title") || ""),
      mediaType: String(formData.get("mediaType") || "image"),
      fileUrl: String(formData.get("fileUrl") || ""),
      isPublic: true,
      isFeatured: false,
      sortOrder: 0,
    });
  }

  useEffect(() => {
    if (create.status === "hasSucceeded" || del.status === "hasSucceeded") {
      list.execute();
    }
  }, [create.status, del.status]);

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Uploader un média (URL)</h2>
        <form action={onCreate} className="grid grid-cols-1 gap-3 max-w-lg">
          <input name="title" placeholder="Titre" className="border rounded px-3 py-2" />
          <input name="mediaType" placeholder="Type (image, video)" className="border rounded px-3 py-2" />
          <input name="fileUrl" placeholder="URL du fichier" className="border rounded px-3 py-2" />
          <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2">Ajouter</button>
        </form>
      </section>

      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Médias</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.result?.data?.media?.map((m: any) => (
            <li key={m.id} className="border rounded p-3">
              <p className="font-medium">{m.title}</p>
              <p className="text-sm text-gray-600">{m.mediaType}</p>
              <a href={m.fileUrl} className="text-emerald-600 hover:underline" target="_blank" rel="noreferrer">Voir</a>
              <div className="mt-2">
                <button onClick={() => del.execute({ id: m.id })} className="text-red-600 hover:underline">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}



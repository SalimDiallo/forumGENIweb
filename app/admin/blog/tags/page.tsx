"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listTags } from "../tags-actions";
import { DeleteTagButton } from "./DeleteTagButton";
import CreateTagModal from "./CreateTagModal";
import { Plus, Tag } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

export default function AdminTagsPage() {
  const [open, setOpen] = useState(false);
  const { canWrite, canDelete } = useRole();

  // ========================================
  // FETCH TAGS
  // ========================================
  const { data: tagsData, isLoading, refetch } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: async () => {
      const result = await listTags();
      return result?.data?.tags || [];
    },
  });

  const tags = tagsData || [];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <section className="p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
              <p className="text-sm text-gray-500">Gérez les tags de votre blog</p>
            </div>
          </div>
          {canWrite && (
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau tag
            </button>
          )}
        </div>
      </section>

      {/* Modal de création */}
      <CreateTagModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Liste des tags */}
      <section className="p-4 bg-white rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Liste des tags</h2>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">Chargement...</span>
          </div>
        )}

        {!isLoading && tags.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun tag créé</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
            >
              Créer votre premier tag
            </button>
          </div>
        )}

        {!isLoading && tags.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {tags.map((t: any) => (
              <li key={t.id} className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: t.color || "#10B981" }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">
                      /{t.slug}
                      {t._count?.posts > 0 && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {t._count.posts} article{t._count.posts > 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {canDelete && (
                  <DeleteTagButton
                    tagId={t.id}
                    tagName={t.name}
                    postCount={t._count?.posts || 0}
                    onSuccess={() => refetch()}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

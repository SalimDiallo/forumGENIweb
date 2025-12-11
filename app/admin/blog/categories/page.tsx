"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCategories } from "../actions";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import CreateCategoryModal from "./CreateCategoryModal";
import { Plus, Folder } from "lucide-react";

export default function AdminBlogCategoriesPage() {
  const [open, setOpen] = useState(false);

  // ========================================
  // FETCH CATEGORIES
  // ========================================
  const { data: categoriesData, isLoading, refetch } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const result = await listCategories();
      return result?.data?.categories || [];
    },
  });

  const categories = categoriesData || [];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <section className="p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Folder className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Catégories</h2>
              <p className="text-sm text-gray-500">Gérez les catégories de votre blog</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle catégorie
          </button>
        </div>
      </section>

      {/* Modal de création */}
      <CreateCategoryModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Liste des catégories */}
      <section className="p-4 bg-white rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Liste des catégories</h2>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">Chargement...</span>
          </div>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Folder className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune catégorie créée</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Créer votre première catégorie
            </button>
          </div>
        )}

        {!isLoading && categories.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {categories.map((c: any) => (
              <li key={c.id} className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: c.color || "#10B981" }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-500">
                      /{c.slug}
                      {c._count?.posts > 0 && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {c._count.posts} article{c._count.posts > 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <DeleteCategoryButton
                  categoryId={c.id}
                  categoryName={c.name}
                  postCount={c._count?.posts || 0}
                  onSuccess={() => refetch()}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

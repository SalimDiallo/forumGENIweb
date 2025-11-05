"use client";
import { useAction } from "next-safe-action/hooks";
import { listCategories } from "./actions";
import { listTags } from "./tags-actions";
import { useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Tag,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function AdminBlogDashboard() {
  const categories = useAction(listCategories);
  const tags = useAction(listTags);

  useEffect(() => {
    categories.execute();
    tags.execute();
  }, []);

  const isLoading = categories.status === "executing" || tags.status === "executing";

  const stats = {
    categories: {
      total: categories.result?.data?.categories?.length || 0,
      active: categories.result?.data?.categories?.filter((c: any) => c.isActive).length || 0,
    },
    tags: {
      total: tags.result?.data?.tags?.length || 0,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-7 h-7 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Blog Dashboard</h1>
        </div>
        <p className="text-gray-600">Gérez les catégories, tags et articles de votre blog</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <span className="ml-4 text-gray-600">Chargement des statistiques...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.categories.total}</div>
              <div className="text-sm text-gray-600 mb-2">Catégories</div>
              <div className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-2 py-1 inline-block border border-gray-200">
                {stats.categories.active} actives
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Tag className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.tags.total}</div>
              <div className="text-sm text-gray-600">Tags</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Layers className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <Link href="/admin/blog/posts" className="text-2xl font-bold text-gray-900 mb-1 hover:underline">
                Articles
              </Link>
              <div className="text-sm text-gray-600 mt-2">
                Gérer les articles de blog
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-900" />
              Gestion du Blog
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/blog/categories"
                className="group p-5 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="inline-flex p-2 bg-gray-100 rounded-lg mb-3 group-hover:bg-gray-200 transition-colors">
                  <FolderOpen className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1 flex items-center justify-between">
                  Catégories
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Gérer les catégories d'articles
                </p>
                <span className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-2 py-1 border border-gray-200">
                  {stats.categories.total} catégories
                </span>
              </Link>

              <Link
                href="/admin/blog/tags"
                className="group p-5 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="inline-flex p-2 bg-gray-100 rounded-lg mb-3 group-hover:bg-gray-200 transition-colors">
                  <Tag className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1 flex items-center justify-between">
                  Tags
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Gérer les tags d'articles
                </p>
                <span className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-2 py-1 border border-gray-200">
                  {stats.tags.total} tags
                </span>
              </Link>

              <Link
                href="/admin/blog/posts"
                className="group p-5 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="inline-flex p-2 bg-gray-100 rounded-lg mb-3 group-hover:bg-gray-200 transition-colors">
                  <Layers className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1 flex items-center justify-between">
                  Articles
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Gérer tous les articles
                </p>
                <span className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-2 py-1 border border-gray-200">
                  Articles de blog
                </span>
              </Link>
            </div>
          </div>

          {/* Preview Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories Preview */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-gray-700" />
                  Dernières Catégories
                </h3>
              </div>
              <div className="p-6">
                {categories.result?.data?.categories?.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Aucune catégorie</p>
                ) : (
                  <div className="space-y-2">
                    {categories.result?.data?.categories?.slice(0, 5).map((cat: any) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <div>
                            <div className="font-medium text-gray-900">{cat.name}</div>
                            <div className="text-xs text-gray-500">/{cat.slug}</div>
                          </div>
                        </div>
                        {cat.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            Active
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  href="/admin/blog/categories"
                  className="block mt-4 text-center text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  Voir toutes les catégories →
                </Link>
              </div>
            </div>

            {/* Tags Preview */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-700" />
                  Derniers Tags
                </h3>
              </div>
              <div className="p-6">
                {tags.result?.data?.tags?.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Aucun tag</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags.result?.data?.tags?.slice(0, 10).map((tag: any) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href="/admin/blog/tags"
                  className="block mt-4 text-center text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  Voir tous les tags →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

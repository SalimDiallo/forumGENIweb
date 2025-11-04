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
  TrendingUp,
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
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Blog Dashboard</h1>
        </div>
        <p className="text-orange-100">Gérez les catégories, tags et articles de votre blog</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="bg-white rounded-xl border shadow-sm p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-4 text-gray-600">Chargement des statistiques...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.categories.total}</div>
              <div className="text-orange-100">Catégories</div>
              <div className="mt-2 text-sm font-medium bg-white/20 rounded-full px-3 py-1 inline-block">
                {stats.categories.active} actives
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Tag className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.tags.total}</div>
              <div className="text-red-100">Tags</div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">À venir</div>
              <div className="text-pink-100">Articles</div>
              <div className="mt-2 text-sm text-pink-200">
                Fonctionnalité en développement
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-600" />
              Gestion du Blog
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/blog/categories"
                className="group p-6 border-2 border-orange-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all"
              >
                <div className="inline-flex p-3 bg-orange-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                  <FolderOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center justify-between">
                  Catégories
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Gérer les catégories d'articles
                </p>
                <span className="text-xs font-medium bg-orange-100 text-orange-600 rounded-full px-2 py-1">
                  {stats.categories.total} catégories
                </span>
              </Link>

              <Link
                href="/admin/blog/tags"
                className="group p-6 border-2 border-red-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all"
              >
                <div className="inline-flex p-3 bg-red-100 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                  <Tag className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center justify-between">
                  Tags
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Gérer les tags d'articles
                </p>
                <span className="text-xs font-medium bg-red-100 text-red-600 rounded-full px-2 py-1">
                  {stats.tags.total} tags
                </span>
              </Link>
            </div>
          </div>

          {/* Preview Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories Preview */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-orange-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-orange-600" />
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
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color || "#10B981" }}
                          ></div>
                          <div>
                            <div className="font-medium text-gray-900">{cat.name}</div>
                            <div className="text-xs text-gray-500">/{cat.slug}</div>
                          </div>
                        </div>
                        {cat.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  href="/admin/blog/categories"
                  className="block mt-4 text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Voir toutes les catégories →
                </Link>
              </div>
            </div>

            {/* Tags Preview */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-red-50 to-red-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-red-600" />
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
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: tag.color ? `${tag.color}20` : "#EF444420",
                          color: tag.color || "#EF4444",
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href="/admin/blog/tags"
                  className="block mt-4 text-center text-sm text-red-600 hover:text-red-700 font-medium"
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

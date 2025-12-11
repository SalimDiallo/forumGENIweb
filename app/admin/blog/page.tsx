"use client";

import { useQuery } from "@tanstack/react-query";
import { listCategories } from "./actions";
import { listTags } from "./tags-actions";
import Link from "next/link";
import { FileText, Folder, Tag, PenLine, Plus, ArrowRight } from "lucide-react";

export default function AdminBlogDashboard() {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const result = await listCategories();
      return result?.data?.categories || [];
    },
  });

  const { data: tagsData, isLoading: tagsLoading } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: async () => {
      const result = await listTags();
      return result?.data?.tags || [];
    },
  });

  const isLoading = categoriesLoading || tagsLoading;
  const categories = categoriesData || [];
  const tags = tagsData || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500 text-sm">Gérez votre contenu</p>
        </div>
        <Link
          href="/admin/blog/posts/create"
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/blog/posts"
          className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <PenLine className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Articles</p>
                <p className="text-sm text-gray-500">Gérer les articles</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/blog/categories"
          className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Folder className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Catégories</p>
                <p className="text-sm text-gray-500">
                  {isLoading ? "..." : `${categories.length} catégories`}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/blog/tags"
          className="group bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Tags</p>
                <p className="text-sm text-gray-500">
                  {isLoading ? "..." : `${tags.length} tags`}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Categories */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Catégories récentes</h3>
            <Link href="/admin/blog/categories" className="text-sm text-emerald-600 hover:text-emerald-700">
              Voir tout →
            </Link>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Aucune catégorie</p>
            ) : (
              <div className="space-y-2">
                {categories.slice(0, 4).map((cat: any) => (
                  <div key={cat.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color || "#10B981" }}
                    />
                    <span className="text-gray-900">{cat.name}</span>
                    <span className="text-xs text-gray-400">/{cat.slug}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Tags récents</h3>
            <Link href="/admin/blog/tags" className="text-sm text-purple-600 hover:text-purple-700">
              Voir tout →
            </Link>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
              </div>
            ) : tags.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Aucun tag</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 8).map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{
                      backgroundColor: `${tag.color}15` || "#10B98115",
                      color: tag.color || "#10B981"
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

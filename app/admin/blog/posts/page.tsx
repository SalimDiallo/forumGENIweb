"use client";
import { useAction } from "next-safe-action/hooks";
import { listBlogPosts, deleteBlogPost, toggleFeatured } from "../posts-actions";
import { useEffect, useState, useCallback } from "react";
import type { BlogPost, BlogCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  Tag,
  FolderOpen,
} from "lucide-react";

type BlogPostWithRelations = BlogPost & {
  category: BlogCategory;
  tags: Array<{
    tag: {
      id: number;
      name: string;
      color: string;
    };
  }>;
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
};

export default function AdminBlogPostsPage() {
  const list = useAction(listBlogPosts);
  const deleteAction = useAction(deleteBlogPost);
  const toggleFeaturedAction = useAction(toggleFeatured);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    list.execute({ page: currentPage, limit: itemsPerPage });
  }, [currentPage]);

  useEffect(() => {
    if (deleteAction.status === "hasSucceeded") {
      list.execute({ page: currentPage, limit: itemsPerPage });
      toast.success("Article supprimé avec succès");
    }
    if (deleteAction.status === "hasErrored") {
      toast.error(deleteAction.result?.serverError || "Erreur lors de la suppression");
    }
  }, [deleteAction.status, deleteAction.result]);

  useEffect(() => {
    if (toggleFeaturedAction.status === "hasSucceeded") {
      list.execute({ page: currentPage, limit: itemsPerPage });
      toast.success("Article mis à jour");
    }
    if (toggleFeaturedAction.status === "hasErrored") {
      toast.error(toggleFeaturedAction.result?.serverError || "Erreur lors de la mise à jour");
    }
  }, [toggleFeaturedAction.status, toggleFeaturedAction.result]);

  const handleDelete = useCallback(
    (id: number, title: string) => {
      if (
        confirm(
          `Êtes-vous sûr de vouloir supprimer l'article "${title}" ? Cette action est irréversible.`
        )
      ) {
        deleteAction.execute({ id });
      }
    },
    [deleteAction]
  );

  const handleToggleFeatured = useCallback(
    (id: number, currentValue: boolean) => {
      toggleFeaturedAction.execute({ id, isFeatured: !currentValue });
    },
    [toggleFeaturedAction]
  );

  const allPosts = (list.result?.data?.posts || []) as BlogPostWithRelations[];
  const total = list.result?.data?.total || 0;
  const totalPages = list.result?.data?.totalPages || 0;

  const stats = {
    total: total,
    published: allPosts.filter((p) => p.status === "published").length,
    draft: allPosts.filter((p) => p.status === "draft").length,
    featured: allPosts.filter((p) => p.isFeatured).length,
  };

  const isLoading = list.status === "executing";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-7 h-7 text-gray-900" />
              <h1 className="text-3xl font-bold text-gray-900">Articles de Blog</h1>
            </div>
            <p className="text-gray-600">Gérez tous vos articles de blog</p>
          </div>
          <Link
            href="/admin/blog/posts/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvel Article
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Publiés</div>
          <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Brouillons</div>
          <div className="text-2xl font-bold text-gray-900">{stats.draft}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">En vedette</div>
          <div className="text-2xl font-bold text-gray-900">{stats.featured}</div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin  h-12 w-12 border-b-2 border-gray-900"></div>
              <span className="ml-4 text-gray-600">Chargement des articles...</span>
            </div>
          </div>
        ) : allPosts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre premier article de blog</p>
            <Link
              href="/admin/blog/posts/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Créer un article
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {allPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title and Featured */}
                      <div className="flex items-start gap-3 mb-2">
                        <button
                          onClick={() => handleToggleFeatured(post.id, post.isFeatured)}
                          className={`mt-1 ${
                            post.isFeatured
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-gray-300 hover:text-gray-400"
                          } transition-colors`}
                          title={post.isFeatured ? "Retirer de la vedette" : "Mettre en vedette"}
                        >
                          <Star className={`w-5 h-5 ${post.isFeatured ? "fill-current" : ""}`} />
                        </button>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <FolderOpen className="w-4 h-4" />
                          <span>{post.category.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewsCount} vues</span>
                        </div>
                        <div className="text-gray-500">•</div>
                        <div>{post.readTimeMinutes} min de lecture</div>
                      </div>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <Tag className="w-4 h-4 text-gray-400" />
                          {post.tags.map(({ tag }) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 text-xs font-medium  border border-gray-300 text-gray-700"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Author & Status */}
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-600">
                          Par <span className="font-medium">{post.authorName}</span>
                          {post.authorPosition && (
                            <span className="text-gray-500"> • {post.authorPosition}</span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium  ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : post.status === "draft"
                              ? "bg-gray-100 text-gray-800 border border-gray-200"
                              : "bg-orange-100 text-orange-800 border border-orange-200"
                          }`}
                        >
                          {STATUS_LABELS[post.status]}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/posts/${post.id}/edit`}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="border-t border-gray-200 p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={total}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

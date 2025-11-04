"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MarkdownEditor from "@/components/MardownEditor";
import { FileText, Settings, Eye, Save, AlertCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { getBlogPost, updateBlogPost } from "../../../posts-actions";
import { listCategories } from "../../../actions";
import { updateBlogPostSchema } from "@/lib/validations/blog";
import type { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormTab = "basic" | "content" | "meta";
type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;

interface EditBlogPostFormProps {
  postId: number;
}

export default function EditBlogPostForm({ postId }: EditBlogPostFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FormTab>("basic");

  const getPostAction = useAction(getBlogPost);
  const updateAction = useAction(updateBlogPost);
  const categoriesAction = useAction(listCategories);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UpdateBlogPostInput>({
    resolver: zodResolver(updateBlogPostSchema),
    defaultValues: {
      id: postId,
    },
  });

  useEffect(() => {
    getPostAction.execute({ id: postId });
    categoriesAction.execute();
  }, [postId]);

  // Populate form when post data is loaded
  useEffect(() => {
    if (getPostAction.result?.data?.post) {
      const post = getPostAction.result.data.post;
      reset({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        featuredImage: post.featuredImage || "",
        authorName: post.authorName,
        authorPosition: post.authorPosition || "",
        categoryId: post.categoryId,
        status: post.status,
        isFeatured: post.isFeatured,
        readTimeMinutes: post.readTimeMinutes,
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
      });
    }
  }, [getPostAction.result, reset]);

  useEffect(() => {
    if (updateAction.status === "hasSucceeded") {
      toast.success("Article modifié avec succès");
      router.push("/admin/blog/posts");
    }
    if (updateAction.status === "hasErrored") {
      toast.error(updateAction.result?.serverError || "Erreur lors de la modification");
    }
  }, [updateAction.status, updateAction.result, router]);

  const onSubmit = (data: UpdateBlogPostInput) => {
    updateAction.execute(data);
  };

  const contentValue = watch("content");

  const tabs = [
    { id: "basic" as FormTab, label: "Informations", icon: FileText },
    { id: "content" as FormTab, label: "Contenu", icon: Settings },
    { id: "meta" as FormTab, label: "SEO", icon: Eye },
  ];

  const categories = categoriesAction.result?.data?.categories || [];
  const isLoading = getPostAction.status === "executing";

  if (isLoading) {
    return (
      <div className="p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <span className="ml-4 text-gray-600">Chargement de l'article...</span>
        </div>
      </div>
    );
  }

  if (!getPostAction.result?.data?.post) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Article introuvable</h3>
        <p className="text-gray-600 mb-6">L'article que vous recherchez n'existe pas.</p>
        <button
          onClick={() => router.push("/admin/blog/posts")}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto px-1">
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de l'article *
                  </label>
                  <input
                    id="title"
                    {...register("title")}
                    placeholder="Ex: Les 10 meilleures pratiques entrepreneuriales"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL) *
                  </label>
                  <input
                    id="slug"
                    {...register("slug")}
                    placeholder="les-10-meilleures-pratiques-entrepreneuriales"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.slug && (
                    <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    id="categoryId"
                    {...register("categoryId", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value={0}>Sélectionnez une catégorie</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut *
                  </label>
                  <select
                    id="status"
                    {...register("status")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Auteur *
                  </label>
                  <input
                    id="authorName"
                    {...register("authorName")}
                    placeholder="Nom de l'auteur"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.authorName && (
                    <p className="text-red-600 text-sm mt-1">{errors.authorName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="authorPosition" className="block text-sm font-medium text-gray-700 mb-1">
                    Poste de l'auteur
                  </label>
                  <input
                    id="authorPosition"
                    {...register("authorPosition")}
                    placeholder="Ex: CEO, Consultant, etc."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.authorPosition && (
                    <p className="text-red-600 text-sm mt-1">{errors.authorPosition.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="readTimeMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                    Temps de lecture (minutes)
                  </label>
                  <input
                    id="readTimeMinutes"
                    type="number"
                    min={1}
                    {...register("readTimeMinutes", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.readTimeMinutes && (
                    <p className="text-red-600 text-sm mt-1">{errors.readTimeMinutes.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="isFeatured" className="block text-sm font-medium text-gray-700 mb-1">
                    Mettre en vedette ?
                  </label>
                  <select
                    id="isFeatured"
                    {...register("isFeatured", {
                      setValueAs: (value) => {
                        if (value === "true" || value === true) return true;
                        if (value === "false" || value === false) return false;
                        return false;
                      },
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                  {errors.isFeatured && (
                    <p className="text-red-600 text-sm mt-1">{errors.isFeatured.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Image à la une (URL)
                  </label>
                  <input
                    id="featuredImage"
                    {...register("featuredImage")}
                    placeholder="https://exemple.com/image.jpg"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.featuredImage && (
                    <p className="text-red-600 text-sm mt-1">{errors.featuredImage.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                    Extrait
                  </label>
                  <textarea
                    id="excerpt"
                    {...register("excerpt")}
                    placeholder="Un court résumé de l'article (2-3 phrases)"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.excerpt && (
                    <p className="text-red-600 text-sm mt-1">{errors.excerpt.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-4">
              <MarkdownEditor
                value={contentValue || ""}
                onChange={(value) => setValue("content", value)}
                placeholder="Écrivez le contenu complet de votre article en Markdown..."
                error={errors.content?.message}
                label="Contenu de l'article"
                rows={12}
                required
              />
            </div>
          )}

          {activeTab === "meta" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre SEO
                  </label>
                  <input
                    id="metaTitle"
                    {...register("metaTitle")}
                    placeholder="Titre optimisé pour les moteurs de recherche"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.metaTitle && (
                    <p className="text-red-600 text-sm mt-1">{errors.metaTitle.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour utiliser le titre de l'article par défaut
                  </p>
                </div>

                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description SEO
                  </label>
                  <textarea
                    id="metaDescription"
                    {...register("metaDescription")}
                    placeholder="Description optimisée pour les moteurs de recherche (150-160 caractères recommandés)"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.metaDescription && (
                    <p className="text-red-600 text-sm mt-1">{errors.metaDescription.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour utiliser l'extrait par défaut
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {updateAction.status === "hasErrored" && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">
              {updateAction.result?.serverError || "Erreur lors de la modification de l'article"}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push("/admin/blog/posts")}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={updateAction.status === "executing"}
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {updateAction.status === "executing" ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
}

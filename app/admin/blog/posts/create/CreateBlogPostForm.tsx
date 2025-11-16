"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MarkdownEditor from "@/components/MarkdownEditor";
import { FileText, Settings, Eye, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createBlogPost } from "../../posts-actions";
import { listCategories } from "../../actions";
import { listTags } from "../../tags-actions";
import { createBlogPostSchema } from "@/lib/validations/blog";
import type { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { renderErrors } from "@/lib/utils";
import Input from "@/components/ui/InputField";

type FormTab = "basic" | "content" | "meta";
type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

export default function CreateBlogPostForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FormTab>("basic");

  // To prevent hydration issues, track if we're mounted/rendered on client
  const [isMounted, setIsMounted] = useState(false);

  // State for categories and tags
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [tagsData, setTagsData] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  // Fetch categories and tags on mount
  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      // Fetch categories
      setCategoriesLoading(true);
      try {
        const categoriesResult = await listCategories();
        if (categoriesResult?.data) {
          setCategoriesData(categoriesResult.data.categories);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Impossible de charger les catégories");
      } finally {
        setCategoriesLoading(false);
      }

      // Fetch tags
      setTagsLoading(true);
      try {
        const tagsResult = await listTags();
        if (tagsResult?.data) {
          setTagsData(tagsResult.data.tags);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tags:", error);
        toast.error("Impossible de charger les tags");
      } finally {
        setTagsLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateBlogPostInput>({
    resolver: zodResolver(createBlogPostSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      authorName: "",
      authorPosition: "",
      categoryId: 0,
      tagIds: [],
      status: "draft",
      isFeatured: false,
      readTimeMinutes: 5,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateBlogPostInput) => {
      return await createBlogPost(data);
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success("Article créé avec succès");
        reset();
        router.push("/admin/blog/posts");
      } else if (result?.serverError) {
        toast.error(result.serverError);
        console.error("Échec de la création:", result.serverError);
      } else if (result?.validationErrors) {
        toast.error("Veuillez corriger les erreurs dans le formulaire");
        console.error("Erreurs de validation:", result.validationErrors);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Erreur lors de la création de l'article";
      toast.error(errorMessage);
      console.error("Erreur lors de la création:", error);
    },
  });

  const onSubmit = (data: CreateBlogPostInput) => {
    createMutation.mutate(data);
  };

  const titleValue = watch("title");
  const contentValue = watch("content");

  // Auto-generate slug from title
  useEffect(() => {
    if (!isMounted) return;
    if (titleValue) {
      const slug = titleValue
        .toLocaleLowerCase("fr-FR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, setValue, isMounted]);

  const tabs = [
    { id: "basic" as FormTab, label: "Informations", icon: FileText },
    { id: "content" as FormTab, label: "Contenu", icon: Settings },
    { id: "meta" as FormTab, label: "SEO", icon: Eye },
  ];

  const categories = categoriesData || [];
  const tags = tagsData || [];
  const selectedTagIds = watch("tagIds") || [];

  const tabErrors = {
    basic: !!(
      errors.title ||
      errors.slug ||
      errors.categoryId ||
      errors.status ||
      errors.authorName ||
      errors.featuredImage ||
      errors.excerpt ||
      errors.readTimeMinutes ||
      errors.isFeatured ||
      errors.authorPosition
    ),
    content: !!errors.content,
    meta: !!(errors.metaTitle || errors.metaDescription),
  };

  return (
    <form
      onSubmit={handleSubmit((e)=>onSubmit(e))}
      className="p-6"
    >
      <div className="space-y-4">
        {/* Server validation errors */}

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tabErrors[tab.id] && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto px-1">
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    id="title"
                    label="Titre de l'article *"
                    placeholder="Ex: Les 10 meilleures pratiques entrepreneuriales"
                    error={!!errors.title?.message}
                    {...register("title")}
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    id="slug"
                    label="Slug (URL) *"
                    placeholder="les-10-meilleures-pratiques-entrepreneuriales"
                    error={!!errors.slug?.message}
                    className="bg-gray-50"
                    {...register("slug")}
                    hint="Le slug est généré automatiquement à partir du titre"
                  />
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    id="categoryId"
                    {...register("categoryId", { valueAsNumber: true })}
                    className={`w-full rounded-lg px-4 py-2.5 border ${errors.categoryId ? "border-red-300 bg-red-50" : "border-gray-300"} transition-colors`}
                    disabled={categoriesLoading}
                  >
                    <option value={0}>{categoriesLoading ? "Chargement..." : "Sélectionnez une catégorie"}</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {renderErrors("categoryId", errors.categoryId)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {tagsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        Chargement des tags...
                      </div>
                    ) : tags.length === 0 ? (
                      <p className="text-sm text-gray-500">Aucun tag disponible</p>
                    ) : (
                      <div className="space-y-2">
                        {tags.map((tag: any) => (
                          <label
                            key={tag.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                          >
                            <input
                              type="checkbox"
                              value={tag.id}
                              checked={selectedTagIds.includes(tag.id)}
                              onChange={(e) => {
                                const currentTags = selectedTagIds;
                                if (e.target.checked) {
                                  setValue("tagIds", [...currentTags, tag.id]);
                                } else {
                                  setValue("tagIds", currentTags.filter((id: number) => id !== tag.id));
                                }
                              }}
                              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
                            />
                            <span className="text-sm text-gray-900">{tag.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut *
                  </label>
                  <select id="status" {...register("status")} className={`w-full rounded-lg px-4 py-2.5 border ${errors.status ? "border-red-300 bg-red-50" : "border-gray-300"} transition-colors`}>
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                  {renderErrors("status", errors.status)}
                </div>

                <div>
                  <Input
                    id="authorName"
                    label="Auteur *"
                    placeholder="Nom de l'auteur"
                    error={!!errors.authorName?.message}
                    {...register("authorName")}
                  />
                </div>

                <div>
                  <Input
                    id="authorPosition"
                    label="Poste de l'auteur"
                    placeholder="Ex: CEO, Consultant, etc."
                    error={!!errors.authorPosition?.message}
                    {...register("authorPosition")}
                  />
                  {renderErrors("authorPosition", errors.authorPosition)}
                </div>

                <div>
                  <Input
                    id="readTimeMinutes"
                    label="Temps de lecture (minutes)"
                    type="number"
                    min={1}
                    error={!!errors.readTimeMinutes?.message}
                    {...register("readTimeMinutes", { valueAsNumber: true })}
                  />
                  {renderErrors("readTimeMinutes", errors.readTimeMinutes)}
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
                    className={`w-full rounded-lg px-4 py-2.5 border ${errors.isFeatured ? "border-red-300 bg-red-50" : "border-gray-300"} transition-colors`}
                  >
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                  {renderErrors("isFeatured", errors.isFeatured)}
                </div>

                <div className="col-span-2">
                  <Input
                    id="featuredImage"
                    label="Image à la une (URL)"
                    placeholder="https://exemple.com/image.jpg"
                    error={!!errors.featuredImage?.message}
                    {...register("featuredImage")}
                  />
                  {renderErrors("featuredImage", errors.featuredImage)}
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
                    className={`w-full rounded-lg px-4 py-2.5 border ${errors.excerpt ? "border-red-300 bg-red-50" : "border-gray-300"} transition-colors`}
                  ></textarea>
                  {renderErrors("excerpt", errors.excerpt)}
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
              {renderErrors("content", errors.content)}
            </div>
          )}

          {activeTab === "meta" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Input
                    id="metaTitle"
                    label="Titre SEO"
                    placeholder="Titre optimisé pour les moteurs de recherche"
                    error={!!errors.metaTitle?.message}
                    {...register("metaTitle")}
                    hint="Laissez vide pour utiliser le titre de l'article par défaut"
                  />
                  {renderErrors("metaTitle", errors.metaTitle)}
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
                    className={`w-full rounded-lg px-4 py-2.5 border ${errors.metaDescription ? "border-red-300 bg-red-50" : "border-gray-300"} transition-colors`}
                  ></textarea>
                  {renderErrors("metaDescription", errors.metaDescription)}
                  <p className="text-xs text-gray-500 mt-1">Laissez vide pour utiliser l'extrait par défaut</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              reset();
              router.push("/admin/blog/posts");
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Créer l'article
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { FileText, Settings, Eye, Save, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { getBlogPost, updateBlogPost } from "../../../posts-actions";
import { listCategories } from "../../../actions";
import { listTags } from "../../../tags-actions";
import { useSession } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBlogPostSchema } from "@/lib/validations/blog";
import { useForm } from "@/hooks/useForm";
import { useSlug } from "@/hooks/useSlug";
import SlugField from "@/components/forms/SlugField";
import { formatErrorsForToast, booleanToSelectValue, selectValueToBoolean } from "@/lib/form-utils";

type FormTab = "basic" | "content" | "meta";

interface EditBlogPostFormProps {
  postId: number;
}

/**
 * Status options for blog posts
 */
const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "archived", label: "Archivé" },
];

export default function EditBlogPostForm({ postId }: EditBlogPostFormProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isEditor = userRole === "editor";

  // State for categories and tags
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [tagsData, setTagsData] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  // ========================================
  // FORM MANAGEMENT with useForm hook
  // ========================================
  const form = useForm({
    initialValues: {
      id: postId,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      authorName: "",
      authorPosition: "",
      categoryId: 0,
      tagIds: [] as number[],
      status: "draft",
      isFeatured: false,
      readTimeMinutes: 5,
      metaTitle: "",
      metaDescription: "",
    },
    validationSchema: updateBlogPostSchema as any,
    validateOnChange: true,
    customValidation: (values) => {
      const errors: any = {};
      if (isEditor && values.status !== "draft") {
        errors.status = {
          field: "status",
          message: "En tant qu'éditeur, vous ne pouvez sauvegarder qu'en brouillon",
        };
      }
      return errors;
    },
  });

  // ========================================
  // SLUG MANAGEMENT with useSlug hook
  // ========================================
  const slug = useSlug({
    sourceText: form.values.title,
    initialSlug: form.values.slug,
    onSlugChange: (value) => form.setFieldValue("slug", value),
  });

  // ========================================
  // FETCH DATA ON MOUNT
  // ========================================
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch post data
      try {
        const postResult = await getBlogPost({ id: postId });
        if (postResult?.data?.post) {
          const post = postResult.data.post;
          const postTagIds = post.tags?.map((t: any) => t.tag.id) || [];

          form.setValues({
            id: post.id,
            title: post.title || "",
            slug: post.slug || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            featuredImage: post.featuredImage || "",
            authorName: post.authorName || "",
            authorPosition: post.authorPosition || "",
            categoryId: post.categoryId || 0,
            tagIds: postTagIds,
            status: post.status || "draft",
            isFeatured: post.isFeatured || false,
            readTimeMinutes: post.readTimeMinutes || 5,
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'article:", error);
        toast.error("Impossible de charger l'article");
      } finally {
        setIsLoading(false);
      }

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
  }, [postId]);

  // ========================================
  // FORM SUBMISSION
  // ========================================
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await updateBlogPost(data);
    },
    onSuccess: (result) => {
      if (result?.data) {
        toast.success("Article mis à jour avec succès !");
        router.push("/admin/blog/posts");
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de la mise à jour");
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    // Show validation errors in toast if form is invalid
    if (!form.isValid) {
      const errorMessages = formatErrorsForToast(form.errors, 4);
      toast.error(
        <div>
          <strong>Veuillez corriger les erreurs dans le formulaire :</strong>
          <ul className="list-disc list-inside pl-2 text-xs mt-1 space-y-0.5">
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    updateMutation.mutate(values);
  });

  // ========================================
  // TABS
  // ========================================
  const tabs = [
    { id: "basic" as FormTab, label: "Informations", icon: FileText },
    { id: "content" as FormTab, label: "Contenu", icon: Settings },
    { id: "meta" as FormTab, label: "SEO", icon: Eye },
  ];

  const categories = categoriesData || [];
  const tags = tagsData || [];

  // ========================================
  // LOADING STATE
  // ========================================
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

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                "flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors " +
                (activeTab === tab.id
                  ? "border-b-2 border-emerald-500 text-emerald-700 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600")
              }
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto px-1">
          {/* BASIC TAB */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">
                    Titre de l'article <span className="text-red-600">*</span>
                  </label>
                  <Input
                    value={form.values.title}
                    onChange={(e) => form.setFieldValue("title", e.target.value)}
                    onBlur={() => form.setFieldTouched("title")}
                    placeholder="Ex: Les 10 meilleures pratiques entrepreneuriales"
                    error={form.hasError("title")}
                    errorMessage={form.getError("title")}
                  />
                </div>

                {/* Slug - Using SlugField component */}
                <div className="col-span-2">
                  <SlugField
                    value={slug.slug}
                    mode={slug.mode}
                    inputRef={slug.slugInputRef}
                    onChange={slug.setSlug}
                    onEditClick={slug.enableCustomMode}
                    onAutoClick={slug.enableAutoMode}
                    error={form.getError("slug")}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-medium mb-1">
                    Catégorie <span className="text-red-600">*</span>
                  </label>
                  <Select
                    value={String(form.values.categoryId)}
                    onChange={(e) => form.setFieldValue("categoryId", Number(e.target.value))}
                    onBlur={() => form.setFieldTouched("categoryId")}
                    error={form.hasError("categoryId")}
                    errorMessage={form.getError("categoryId")}
                    disabled={categoriesLoading}
                  >
                    <option value="0">{categoriesLoading ? "Chargement..." : "Sélectionnez une catégorie"}</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-medium mb-1">Tags</label>
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
                              checked={form.values.tagIds.includes(tag.id)}
                              onChange={(e) => {
                                const currentTags = form.values.tagIds;
                                if (e.target.checked) {
                                  form.setFieldValue("tagIds", [...currentTags, tag.id]);
                                } else {
                                  form.setFieldValue("tagIds", currentTags.filter((id: number) => id !== tag.id));
                                }
                              }}
                              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-gray-900">{tag.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-medium mb-1">
                    Statut <span className="text-red-600">*</span>
                    {isEditor && (
                      <span className="ml-2 text-xs text-amber-600 font-normal">
                        (Brouillon uniquement)
                      </span>
                    )}
                  </label>
                  <Select
                    value={form.values.status}
                    disabled={isEditor}
                    onChange={(e) => form.setFieldValue("status", e.target.value)}
                    onBlur={() => form.setFieldTouched("status")}
                    error={form.hasError("status")}
                    errorMessage={form.getError("status")}
                    className={isEditor ? "opacity-60" : ""}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                  {isEditor && (
                    <span className="text-amber-600 flex items-center gap-1 text-xs mt-0.5">
                      <AlertCircle className="w-3 h-3" />
                      En tant qu'éditeur, vous ne pouvez sauvegarder qu'en brouillon
                    </span>
                  )}
                </div>

                {/* Author Name */}
                <div>
                  <label className="block font-medium mb-1">
                    Auteur <span className="text-red-600">*</span>
                  </label>
                  <Input
                    value={form.values.authorName}
                    onChange={(e) => form.setFieldValue("authorName", e.target.value)}
                    onBlur={() => form.setFieldTouched("authorName")}
                    placeholder="Nom de l'auteur"
                    error={form.hasError("authorName")}
                    errorMessage={form.getError("authorName")}
                  />
                </div>

                {/* Author Position */}
                <div>
                  <label className="block font-medium mb-1">Poste de l'auteur</label>
                  <Input
                    value={form.values.authorPosition}
                    onChange={(e) => form.setFieldValue("authorPosition", e.target.value)}
                    onBlur={() => form.setFieldTouched("authorPosition")}
                    placeholder="Ex: CEO, Consultant, etc."
                    error={form.hasError("authorPosition")}
                    errorMessage={form.getError("authorPosition")}
                  />
                </div>

                {/* Read Time */}
                <div>
                  <label className="block font-medium mb-1">Temps de lecture (minutes)</label>
                  <Input
                    type="number"
                    min={1}
                    value={form.values.readTimeMinutes}
                    onChange={(e) => form.setFieldValue("readTimeMinutes", Number(e.target.value))}
                    onBlur={() => form.setFieldTouched("readTimeMinutes")}
                    error={form.hasError("readTimeMinutes")}
                    errorMessage={form.getError("readTimeMinutes")}
                  />
                </div>

                {/* Is Featured */}
                <div>
                  <label className="block font-medium mb-1">Mettre en vedette ?</label>
                  <Select
                    value={booleanToSelectValue(form.values.isFeatured)}
                    onChange={(e) => form.setFieldValue("isFeatured", selectValueToBoolean(e.target.value))}
                  >
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </Select>
                </div>

                {/* Featured Image */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Image à la une (URL)</label>
                  <Input
                    value={form.values.featuredImage}
                    onChange={(e) => form.setFieldValue("featuredImage", e.target.value)}
                    onBlur={() => form.setFieldTouched("featuredImage")}
                    placeholder="https://exemple.com/image.jpg"
                    error={form.hasError("featuredImage")}
                    errorMessage={form.getError("featuredImage")}
                  />
                </div>

                {/* Excerpt */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Extrait</label>
                  <textarea
                    value={form.values.excerpt}
                    onChange={(e) => form.setFieldValue("excerpt", e.target.value)}
                    onBlur={() => form.setFieldTouched("excerpt")}
                    placeholder="Un court résumé de l'article (2-3 phrases)"
                    rows={3}
                    className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 ${form.hasError("excerpt") ? "border-red-300" : "border-gray-300"
                      }`}
                  />
                  {form.getError("excerpt") && (
                    <span className="text-red-600 text-xs">{form.getError("excerpt")}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === "content" && (
            <div className="space-y-4">
              <label className="block font-medium mb-1">
                Contenu de l'article <span className="text-red-600">*</span>
              </label>
              <MarkdownEditor
                value={form.values.content || ""}
                onChange={(val) => form.setFieldValue("content", val)}
                placeholder="Écrivez le contenu complet de votre article en Markdown..."
              />
              {form.getError("content") && (
                <span className="text-red-600 text-xs">{form.getError("content")}</span>
              )}
            </div>
          )}

          {/* META TAB */}
          {activeTab === "meta" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Meta Title */}
                <div>
                  <label className="block font-medium mb-1">Titre SEO</label>
                  <Input
                    value={form.values.metaTitle}
                    onChange={(e) => form.setFieldValue("metaTitle", e.target.value)}
                    onBlur={() => form.setFieldTouched("metaTitle")}
                    placeholder="Titre optimisé pour les moteurs de recherche"
                    error={form.hasError("metaTitle")}
                    errorMessage={form.getError("metaTitle")}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour utiliser le titre de l'article par défaut
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block font-medium mb-1">Description SEO</label>
                  <textarea
                    value={form.values.metaDescription}
                    onChange={(e) => form.setFieldValue("metaDescription", e.target.value)}
                    onBlur={() => form.setFieldTouched("metaDescription")}
                    placeholder="Description optimisée pour les moteurs de recherche (150-160 caractères recommandés)"
                    rows={3}
                    className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 ${form.hasError("metaDescription") ? "border-red-300" : "border-gray-300"
                      }`}
                  />
                  {form.getError("metaDescription") && (
                    <span className="text-red-600 text-xs">{form.getError("metaDescription")}</span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour utiliser l'extrait par défaut
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Summary - Using safe rendering */}
        {Object.keys(form.errors).length > 0 && (
          <div className="mt-4">
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-red-600 text-sm">
                <span className="font-bold block mb-1">Certains champs contiennent des erreurs :</span>
                <ul className="list-disc ml-4 space-y-0.5">
                  {formatErrorsForToast(form.errors, 5).map((msg, i) => (
                    <li key={i} className="pl-1">
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-4 border-t mt-4">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </form>
  );
}

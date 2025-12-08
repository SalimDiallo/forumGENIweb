"use server";
import { actionClient, writeAction, deleteAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createBlogPostSchema, updateBlogPostSchema } from "@/lib/validations/blog";
import { z } from "zod";
import { getCachedBlogPostsPaginated } from "@/lib/cache";
import { enforceDraftStatusForEditor } from "@/lib/auth";

export const listBlogPosts = actionClient
  .metadata({ actionName: "list-blog-posts" })
  .schema(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20)
  }).optional().default({ page: 1, limit: 20 }))
  .action(async ({ parsedInput }) => {
    const { page, limit } = parsedInput || { page: 1, limit: 20 };

    // Utiliser la fonction cachée
    const result = await getCachedBlogPostsPaginated(page, limit);

    return result;
  });

export const getBlogPost = actionClient
  .metadata({ actionName: "get-blog-post" })
  .schema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    const post = await prisma.blogPost.findUnique({
      where: { id: parsedInput.id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return { post };
  });

export const createBlogPost = writeAction
  .metadata({ actionName: "create-blog-post" })
  .schema(createBlogPostSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Vérifier si le slug existe déjà
      const existingPost = await prisma.blogPost.findFirst({
        where: { slug: parsedInput.slug },
      });

      if (existingPost) {
        throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
      }

      const { tagIds, ...postData } = parsedInput;

      // Force le statut à "draft" si l'utilisateur est un editor
      const finalStatus = await enforceDraftStatusForEditor(parsedInput.status);

      const created = await prisma.blogPost.create({
        data: {
          ...postData,
          status: finalStatus,
          publishedAt: finalStatus === "published" ? new Date() : null,
          // Créer les relations avec les tags
          tags: tagIds && tagIds.length > 0 ? {
            create: tagIds.map((tagId) => ({
              tag: {
                connect: { id: tagId },
              },
            })),
          } : undefined,
        },
      });

      return { id: created.id };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
      }
      if (error.code === "P2003") {
        throw new Error("Catégorie ou tag invalide. Veuillez vérifier vos sélections.");
      }
      throw error;
    }
  });

export const updateBlogPost = writeAction
  .metadata({ actionName: "update-blog-post" })
  .schema(updateBlogPostSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, tagIds, ...data } = parsedInput;

      // Vérifier si le slug existe déjà pour un autre article
      if (data.slug) {
        const existingPost = await prisma.blogPost.findFirst({
          where: {
            slug: data.slug,
            id: { not: id }
          },
        });

        if (existingPost) {
          throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
        }
      }

      // If status is being changed to published and wasn't published before, set publishedAt
      const existing = await prisma.blogPost.findUnique({ where: { id } });

      if (!existing) {
        throw new Error("Article introuvable");
      }

      const updateData: any = { ...data };

      // Force le statut à "draft" si l'utilisateur est un editor
      if (data.status) {
        updateData.status = await enforceDraftStatusForEditor(data.status);
      }

      if (updateData.status === "published" && existing?.status !== "published" && !existing?.publishedAt) {
        updateData.publishedAt = new Date();
      }

      // Mettre à jour l'article dans une transaction
      const updated = await prisma.$transaction(async (tx) => {
        // Si des tags sont fournis, mettre à jour les relations
        if (tagIds !== undefined) {
          // Supprimer toutes les relations existantes
          await tx.blogPostTag.deleteMany({
            where: { postId: id },
          });

          // Créer les nouvelles relations
          if (tagIds.length > 0) {
            await tx.blogPostTag.createMany({
              data: tagIds.map((tagId) => ({
                postId: id,
                tagId: tagId,
              })),
            });
          }
        }

        // Mettre à jour l'article
        return await tx.blogPost.update({
          where: { id },
          data: updateData,
        });
      });

      return { id: updated.id };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
      }
      if (error.code === "P2003") {
        throw new Error("Catégorie ou tag invalide. Veuillez vérifier vos sélections.");
      }
      throw error;
    }
  });

export const deleteBlogPost = deleteAction
  .metadata({ actionName: "delete-blog-post" })
  .schema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    await prisma.blogPost.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });

export const toggleFeatured = writeAction
  .metadata({ actionName: "toggle-featured-blog-post" })
  .schema(z.object({ id: z.number().int().positive(), isFeatured: z.boolean() }))
  .action(async ({ parsedInput }) => {
    const updated = await prisma.blogPost.update({
      where: { id: parsedInput.id },
      data: { isFeatured: parsedInput.isFeatured },
    });

    return { id: updated.id };
  });

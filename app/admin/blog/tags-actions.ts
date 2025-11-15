"use server";
import { actionClient, adminAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createTagSchema, updateTagSchema } from "@/lib/validations/blog";

export const listTags = actionClient
  .metadata({ actionName: "list-tags" })
  .action(async () => {
    const tags = await prisma.blogTag.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    return { tags };
  });

export const createTag = adminAction
  .metadata({ actionName: "create-tag" })
  .schema(createTagSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Vérifier si le slug existe déjà
      const existingTag = await prisma.blogTag.findFirst({
        where: { slug: parsedInput.slug },
      });

      if (existingTag) {
        throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
      }

      const created = await prisma.blogTag.create({ data: parsedInput });
      return { id: created.id };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Ce tag existe déjà (nom ou slug en double).");
      }
      throw error;
    }
  });

export const updateTag = adminAction
  .metadata({ actionName: "update-tag" })
  .schema(updateTagSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...data } = parsedInput;

      // Vérifier si le slug existe déjà pour un autre tag
      if (data.slug) {
        const existingTag = await prisma.blogTag.findFirst({
          where: {
            slug: data.slug,
            id: { not: id }
          },
        });

        if (existingTag) {
          throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
        }
      }

      const updated = await prisma.blogTag.update({ where: { id }, data });
      return { id: updated.id };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Ce tag existe déjà (nom ou slug en double).");
      }
      if (error.code === "P2025") {
        throw new Error("Tag introuvable.");
      }
      throw error;
    }
  });

export const deleteTag = adminAction
  .metadata({ actionName: "delete-tag" })
  .schema(updateTagSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    try {
      // Vérifier si le tag existe
      const tag = await prisma.blogTag.findUnique({
        where: { id: parsedInput.id },
        include: {
          _count: {
            select: { posts: true }
          }
        }
      });

      if (!tag) {
        throw new Error("Tag introuvable.");
      }

      // Informer l'utilisateur si le tag est utilisé
      // Note: Les relations BlogPostTag seront supprimées automatiquement (onDelete: Cascade)
      if (tag._count.posts > 0) {
        // On peut quand même supprimer, Prisma gère la cascade
        console.log(`Suppression du tag "${tag.name}" utilisé par ${tag._count.posts} article(s)`);
      }

      // Supprimer le tag (les relations BlogPostTag seront supprimées automatiquement)
      await prisma.blogTag.delete({ where: { id: parsedInput.id } });
      return { ok: true };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("Tag introuvable.");
      }
      throw error;
    }
  });



"use server";
import { actionClient, adminAction, deleteAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createCategorySchema, updateCategorySchema } from "@/lib/validations/blog";

export const listCategories = actionClient
  .metadata({ actionName: "list-categories" })
  .action(async () => {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    return { categories };
  });

export const createCategory = adminAction
  .metadata({ actionName: "create-category" })
  .schema(createCategorySchema)
  .action(async ({ parsedInput }) => {
    try {
      // Vérifier si le slug existe déjà
      const existingCategory = await prisma.blogCategory.findFirst({
        where: { slug: parsedInput.slug },
      });

      if (existingCategory) {
        throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
      }

      const created = await prisma.blogCategory.create({ data: parsedInput });
      return { id: created.id };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Cette catégorie existe déjà (nom ou slug en double).");
      }
      throw error;
    }
  });

export const updateCategory = adminAction
  .metadata({ actionName: "update-category" })
  .schema(updateCategorySchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...data } = parsedInput;

      // Vérifier si le slug existe déjà pour une autre catégorie
      if (data.slug) {
        const existingCategory = await prisma.blogCategory.findFirst({
          where: {
            slug: data.slug,
            id: { not: id }
          },
        });

        if (existingCategory) {
          throw new Error("Ce slug existe déjà. Veuillez en choisir un autre.");
        }
      }

      const updated = await prisma.blogCategory.update({ where: { id }, data });
      return { id: updated.id };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Cette catégorie existe déjà (nom ou slug en double).");
      }
      if (error.code === "P2025") {
        throw new Error("Catégorie introuvable.");
      }
      throw error;
    }
  });

export const deleteCategory = deleteAction
  .metadata({ actionName: "delete-category" })
  .schema(updateCategorySchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    try {
      // Vérifier si la catégorie est utilisée par des articles
      const categoryWithPosts = await prisma.blogCategory.findUnique({
        where: { id: parsedInput.id },
        include: {
          _count: {
            select: { posts: true }
          }
        }
      });

      if (!categoryWithPosts) {
        throw new Error("Catégorie introuvable.");
      }

      if (categoryWithPosts._count.posts > 0) {
        throw new Error(
          `Cette catégorie est utilisée par ${categoryWithPosts._count.posts} article(s). Veuillez d'abord réassigner ces articles à une autre catégorie.`
        );
      }

      await prisma.blogCategory.delete({ where: { id: parsedInput.id } });
      return { ok: true };
    } catch (error: any) {
      if (error.code === "P2003") {
        throw new Error("Cette catégorie est utilisée par des articles. Veuillez d'abord réassigner ces articles.");
      }
      if (error.code === "P2025") {
        throw new Error("Catégorie introuvable.");
      }
      throw error;
    }
  });



"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createCategorySchema, updateCategorySchema } from "@/lib/validations/blog";

export const listCategories = actionClient
  .metadata({ actionName: "list-categories" })
  .action(async () => {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { categories };
  });

export const createCategory = actionClient
  .metadata({ actionName: "create-category" })
  .schema(createCategorySchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.blogCategory.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateCategory = actionClient
  .metadata({ actionName: "update-category" })
  .schema(updateCategorySchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.blogCategory.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteCategory = actionClient
  .metadata({ actionName: "delete-category" })
  .schema(updateCategorySchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.blogCategory.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createTagSchema, updateTagSchema } from "@/lib/validations/blog";

export const listTags = actionClient.action(async () => {
  const tags = await prisma.blogTag.findMany({ orderBy: { createdAt: "desc" } });
  return { tags };
});

export const createTag = actionClient
  .schema(createTagSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.blogTag.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateTag = actionClient
  .schema(updateTagSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.blogTag.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteTag = actionClient
  .schema(updateTagSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.blogTag.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



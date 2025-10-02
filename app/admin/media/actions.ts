"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createMediaSchema, updateMediaSchema } from "@/lib/validations/media";

export const listMedia = actionClient.action(async () => {
  const media = await prisma.mediaGallery.findMany({ orderBy: { uploadedAt: "desc" } });
  return { media };
});

export const createMedia = actionClient
  .schema(createMediaSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.mediaGallery.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateMedia = actionClient
  .schema(updateMediaSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.mediaGallery.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteMedia = actionClient
  .schema(updateMediaSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.mediaGallery.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



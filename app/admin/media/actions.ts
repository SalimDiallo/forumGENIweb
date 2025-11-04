"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createMediaSchema, updateMediaSchema } from "@/lib/validations/media";

export const listMedia = actionClient
  .metadata({ actionName: "list-media" })
  .action(async () => {
    const media = await prisma.mediaGallery.findMany({
      orderBy: { uploadedAt: "desc" }
    });
    return { media };
  });

export const createMedia = actionClient
  .metadata({ actionName: "create-media" })
  .schema(createMediaSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.mediaGallery.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateMedia = actionClient
  .metadata({ actionName: "update-media" })
  .schema(updateMediaSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.mediaGallery.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteMedia = actionClient
  .metadata({ actionName: "delete-media" })
  .schema(updateMediaSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.mediaGallery.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



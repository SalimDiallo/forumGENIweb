"use server";
import { actionClient, adminAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createMediaSchema, updateMediaSchema } from "@/lib/validations/media";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const listMedia = actionClient
  .metadata({ actionName: "list-media" })
  .schema(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(15)
  }).optional().default({ page: 1, limit: 15 }))
  .action(async ({ parsedInput }) => {
    const { page, limit } = parsedInput || { page: 1, limit: 15 };
    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      prisma.mediaGallery.findMany({
        skip,
        take: limit,
        orderBy: { uploadedAt: "desc" }
      }),
      prisma.mediaGallery.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return { media, total, totalPages, currentPage: page };
  });

export const createMedia = adminAction
  .metadata({ actionName: "create-media" })
  .schema(createMediaSchema)
  .action(async ({ parsedInput }) => {
    const data: any = { ...parsedInput };
    if (!data.eventId) {
      delete data.eventId;
    }
    const created = await prisma.mediaGallery.create({ data });

    // Revalidate cache tag for media
    revalidateTag('media');

    return { id: created.id };
  });

export const updateMedia = adminAction
  .metadata({ actionName: "update-media" })
  .schema(updateMediaSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...rest } = parsedInput;
    const data: any = { ...rest };
    if (!data.eventId) {
      delete data.eventId;
    }
    const updated = await prisma.mediaGallery.update({ where: { id }, data });

    // Revalidate cache tag for media
    revalidateTag('media');

    return { id: updated.id };
  });

export const deleteMedia = adminAction
  .metadata({ actionName: "delete-media" })
  .schema(updateMediaSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.mediaGallery.delete({ where: { id: parsedInput.id } });

    // Revalidate cache tag for media
    revalidateTag('media');

    return { ok: true };
  });



"use server";

import { adminAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import {
  videoGallerySchema,
  updateVideoGallerySchema,
  deleteVideoGallerySchema,
  photoGallerySchema,
  updatePhotoGallerySchema,
  deletePhotoGallerySchema,
  bulkDeleteVideosSchema,
  bulkDeletePhotosSchema,
} from "@/lib/validations/gallery";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

// =====================================
// VIDEO GALLERY ACTIONS
// =====================================

export const listVideos = adminAction
  .metadata({ actionName: "list-gallery-videos" })
  .schema(
    z
      .object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
      .optional()
      .default({ page: 1, limit: 20 })
  )
  .action(async ({ parsedInput }) => {
    const { page, limit } = parsedInput || { page: 1, limit: 20 };
    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
      prisma.videoGallery.findMany({
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.videoGallery.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { videos, total, totalPages, currentPage: page };
  });

export const createVideo = adminAction
  .metadata({ actionName: "create-gallery-video" })
  .schema(videoGallerySchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.videoGallery.create({
      data: parsedInput,
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidateTag("media");
    revalidateTag("events");

    return { id: created.id };
  });

export const updateVideo = adminAction
  .metadata({ actionName: "update-gallery-video" })
  .schema(updateVideoGallerySchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const updated = await prisma.videoGallery.update({
      where: { id },
      data,
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidateTag("media");
    revalidateTag("events");

    return { id: updated.id };
  });

export const deleteVideo = adminAction
  .metadata({ actionName: "delete-gallery-video" })
  .schema(deleteVideoGallerySchema)
  .action(async ({ parsedInput }) => {
    await prisma.videoGallery.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidateTag("media");
    revalidateTag("events");

    return { ok: true };
  });

// =====================================
// PHOTO GALLERY ACTIONS
// =====================================

export const listPhotos = adminAction
  .metadata({ actionName: "list-gallery-photos" })
  .schema(
    z
      .object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
      .optional()
      .default({ page: 1, limit: 20 })
  )
  .action(async ({ parsedInput }) => {
    const { page, limit } = parsedInput || { page: 1, limit: 20 };
    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      prisma.photoGallery.findMany({
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.photoGallery.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { photos, total, totalPages, currentPage: page };
  });

export const createPhoto = adminAction
  .metadata({ actionName: "create-gallery-photo" })
  .schema(photoGallerySchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.photoGallery.create({
      data: parsedInput,
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidateTag("media");
    revalidateTag("events");

    return { id: created.id };
  });

export const updatePhoto = adminAction
  .metadata({ actionName: "update-gallery-photo" })
  .schema(updatePhotoGallerySchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const updated = await prisma.photoGallery.update({
      where: { id },
      data,
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidateTag("media");
    revalidateTag("events");

    return { id: updated.id };
  });

export const deletePhoto = adminAction
  .metadata({ actionName: "delete-gallery-photo" })
  .schema(deletePhotoGallerySchema)
  .action(async ({ parsedInput }) => {
    await prisma.photoGallery.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidateTag("media");
    revalidateTag("events");

    return { ok: true };
  });

// =====================================
// BULK DELETE ACTIONS
// =====================================

export const bulkDeleteVideos = adminAction
  .metadata({ actionName: "bulk-delete-gallery-videos" })
  .schema(bulkDeleteVideosSchema)
  .action(async ({ parsedInput }) => {
    const { ids } = parsedInput;

    const deleted = await prisma.videoGallery.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidateTag("media");
    revalidateTag("events");

    return { ok: true, count: deleted.count };
  });

export const bulkDeletePhotos = adminAction
  .metadata({ actionName: "bulk-delete-gallery-photos" })
  .schema(bulkDeletePhotosSchema)
  .action(async ({ parsedInput }) => {
    const { ids } = parsedInput;

    const deleted = await prisma.photoGallery.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidateTag("media");
    revalidateTag("events");

    return { ok: true, count: deleted.count };
  });

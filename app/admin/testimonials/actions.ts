"use server";

import { adminAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import {
  videoTestimonialSchema,
  updateVideoTestimonialSchema,
  deleteVideoTestimonialSchema,
  bulkDeleteTestimonialsSchema,
} from "@/lib/validations/testimonials";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * List all video testimonials (for admin)
 */
export const listTestimonials = adminAction
  .metadata({ actionName: "list-testimonials" })
  .inputSchema(
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

    const [testimonials, total] = await Promise.all([
      prisma.videoTestimonial.findMany({
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.videoTestimonial.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { testimonials, total, totalPages, currentPage: page };
  });

/**
 * Get single testimonial by ID
 */
export const getTestimonial = adminAction
  .metadata({ actionName: "get-testimonial" })
  .inputSchema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    const testimonial = await prisma.videoTestimonial.findUnique({
      where: { id: parsedInput.id },
    });

    if (!testimonial) {
      throw new Error("Témoignage introuvable");
    }

    return { testimonial };
  });

/**
 * Create a new video testimonial
 */
export const createTestimonial = adminAction
  .metadata({ actionName: "create-testimonial" })
  .inputSchema(videoTestimonialSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.videoTestimonial.create({
      data: parsedInput,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { id: created.id };
  });

/**
 * Update an existing video testimonial
 */
export const updateTestimonial = adminAction
  .metadata({ actionName: "update-testimonial" })
  .inputSchema(updateVideoTestimonialSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;

    const updated = await prisma.videoTestimonial.update({
      where: { id },
      data,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { id: updated.id };
  });

/**
 * Delete a video testimonial
 */
export const deleteTestimonial = adminAction
  .metadata({ actionName: "delete-testimonial" })
  .inputSchema(deleteVideoTestimonialSchema)
  .action(async ({ parsedInput }) => {
    await prisma.videoTestimonial.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { ok: true };
  });

/**
 * Bulk delete video testimonials
 */
export const bulkDeleteTestimonials = adminAction
  .metadata({ actionName: "bulk-delete-testimonials" })
  .inputSchema(bulkDeleteTestimonialsSchema)
  .action(async ({ parsedInput }) => {
    const { ids } = parsedInput;

    const deleted = await prisma.videoTestimonial.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { ok: true, count: deleted.count };
  });

/**
 * Toggle testimonial active status
 */
export const toggleTestimonialActive = adminAction
  .metadata({ actionName: "toggle-testimonial-active" })
  .inputSchema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    const testimonial = await prisma.videoTestimonial.findUnique({
      where: { id: parsedInput.id },
    });

    if (!testimonial) {
      throw new Error("Témoignage introuvable");
    }

    const updated = await prisma.videoTestimonial.update({
      where: { id: parsedInput.id },
      data: { isActive: !testimonial.isActive },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { isActive: updated.isActive };
  });

/**
 * Toggle testimonial featured status
 */
export const toggleTestimonialFeatured = adminAction
  .metadata({ actionName: "toggle-testimonial-featured" })
  .inputSchema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    const testimonial = await prisma.videoTestimonial.findUnique({
      where: { id: parsedInput.id },
    });

    if (!testimonial) {
      throw new Error("Témoignage introuvable");
    }

    const updated = await prisma.videoTestimonial.update({
      where: { id: parsedInput.id },
      data: { isFeatured: !testimonial.isFeatured },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { isFeatured: updated.isFeatured };
  });

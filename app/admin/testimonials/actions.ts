"use server";
import { actionClient, adminAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createVideoTestimonialSchema, updateVideoTestimonialSchema } from "@/lib/validations/testimonials";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const listTestimonials = actionClient
  .metadata({ actionName: "list-testimonials" })
  .schema(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10)
  }).optional().default({ page: 1, limit: 10 }))
  .action(async ({ parsedInput }) => {
    const { page, limit } = parsedInput || { page: 1, limit: 10 };
    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      prisma.videoTestimonial.findMany({
        skip,
        take: limit,
        orderBy: { sortOrder: "asc" }
      }),
      prisma.videoTestimonial.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return { testimonials, total, totalPages, currentPage: page };
  });

export const createTestimonial = adminAction
  .metadata({ actionName: "create-testimonial" })
  .schema(createVideoTestimonialSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.videoTestimonial.create({ data: parsedInput });

    // Revalidate cache tag for testimonials
    revalidateTag('testimonials');

    return { id: created.id };
  });

export const updateTestimonial = adminAction
  .metadata({ actionName: "update-testimonial" })
  .schema(updateVideoTestimonialSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.videoTestimonial.update({ where: { id }, data });

    // Revalidate cache tag for testimonials
    revalidateTag('testimonials');

    return { id: updated.id };
  });

export const deleteTestimonial = adminAction
  .metadata({ actionName: "delete-testimonial" })
  .schema(updateVideoTestimonialSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.videoTestimonial.delete({ where: { id: parsedInput.id } });

    // Revalidate cache tag for testimonials
    revalidateTag('testimonials');

    return { ok: true };
  });



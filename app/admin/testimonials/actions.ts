"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createVideoTestimonialSchema, updateVideoTestimonialSchema } from "@/lib/validations/testimonials";

export const listTestimonials = actionClient
  .metadata({ actionName: "list-testimonials" })
  .action(async () => {
    const testimonials = await prisma.videoTestimonial.findMany({
      orderBy: { sortOrder: "asc" }
    });
    return { testimonials };
  });

export const createTestimonial = actionClient
  .metadata({ actionName: "create-testimonial" })
  .schema(createVideoTestimonialSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.videoTestimonial.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateTestimonial = actionClient
  .metadata({ actionName: "update-testimonial" })
  .schema(updateVideoTestimonialSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.videoTestimonial.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteTestimonial = actionClient
  .metadata({ actionName: "delete-testimonial" })
  .schema(updateVideoTestimonialSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.videoTestimonial.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



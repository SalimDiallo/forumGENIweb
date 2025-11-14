"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createJobOfferSchema, updateJobOfferSchema } from "@/lib/validations/jobs";
import { z } from "zod";

export const listJobs = actionClient
  .metadata({ actionName: "list-jobs" })
  .action(async () => {
    const jobs = await prisma.jobOffer.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { jobs };
  });

export const createJob = actionClient
  .metadata({ actionName: "create-job" })
  .schema(createJobOfferSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.jobOffer.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateJob = actionClient
  .metadata({ actionName: "update-job" })
  .schema(updateJobOfferSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.jobOffer.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteJob = actionClient
  .metadata({ actionName: "delete-job" })
  .schema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    await prisma.jobOffer.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });

export const getJobsWithApplicationCount = actionClient
  .metadata({ actionName: "get-jobs-with-application-count" })
  .schema(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20)
  }).optional().default({ page: 1, limit: 20 }))
  .action(async ({ parsedInput }) => {
    const { page, limit } = parsedInput || { page: 1, limit: 20 };
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.jobOffer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobOffer.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return { jobs, total, totalPages, currentPage: page };
  });



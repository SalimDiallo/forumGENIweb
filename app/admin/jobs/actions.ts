"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createJobOfferSchema, updateJobOfferSchema } from "@/lib/validations/jobs";
import { z } from "zod";

export const listJobs = actionClient.action(async () => {
  const jobs = await prisma.jobOffer.findMany({ orderBy: { createdAt: "desc" } });
  return { jobs };
});

export const createJob = actionClient
  .schema(createJobOfferSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.jobOffer.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateJob = actionClient
  .schema(updateJobOfferSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.jobOffer.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteJob = actionClient
  .schema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    await prisma.jobOffer.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



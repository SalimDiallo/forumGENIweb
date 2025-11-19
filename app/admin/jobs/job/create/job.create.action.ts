"use server"

import { prisma } from "@/lib/db";
import { writeAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { createJobOfferSchema } from "./job.create.schema";

export const doCreateJob = writeAction
    .metadata({ actionName: "create-job-admin" })
    .schema(createJobOfferSchema)
    .action(async ({ parsedInput }) => {
        const createdJob = await prisma.jobOffer.create({ data: parsedInput });

        revalidatePath("/admin/jobs");

        return { success: true, createdJob };
    });

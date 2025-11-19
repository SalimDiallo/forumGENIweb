"use server"

import { prisma } from "@/lib/db";
import { writeAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { updateJobOfferSchema } from "./job.edit.schema";

export const doEditJob = writeAction
    .metadata({ actionName: "edit-job-admin" })
    .inputSchema(updateJobOfferSchema)
    .action(async ({ parsedInput }) => {
        const { id, ...job } = parsedInput;

        const editedJob = await prisma.jobOffer.update({
            where: { id },
            data:{
                ...job,
                applicationDeadline : job.applicationDeadline ? new Date(job.applicationDeadline) : null,
                startDate: job.startDate ? new Date(job.startDate) : null,
            }
        });

        revalidatePath("/admin/jobs");
        revalidatePath(`/admin/jobs/job/${id}`);

        return { success: true, editedJob };
    });

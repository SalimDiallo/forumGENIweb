"use server"

import { prisma } from "@/lib/db";
import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { updateJobOfferSchema } from "./job.edit.schema";

export const doEditJob = adminAction
    .metadata({ actionName: "edit-job-admin" })
    .schema(updateJobOfferSchema)
    .action(async ({ parsedInput }) => {
        console.log("editing job:", parsedInput);

        const { id, ...data } = parsedInput;

        const editedJob = await prisma.jobOffer.update({
            where: { id },
            data
        });

        revalidatePath("/admin/jobs");
        revalidatePath(`/admin/jobs/job/${id}`);

        return { success: true, editedJob };
    });

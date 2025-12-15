"use server"

import { prisma } from "@/lib/db";
import { writeAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { createJobOfferSchema } from "./job.create.schema";

export const doCreateJob = writeAction
    .metadata({ actionName: "create-job-admin" })
    .schema(createJobOfferSchema)
    .action(async ({ parsedInput }) => {
        // Extract images and prepare nested create
        const { images, ...jobData } = parsedInput;

        // Build the data object
        const createData: any = {
            ...jobData,
        };

        // Add images as nested create if provided
        if (images && images.length > 0) {
            createData.images = {
                create: images.map((img: any, index: number) => ({
                    url: img.url,
                    caption: img.caption,
                    sortOrder: index,
                })),
            };
        }

        const createdJob = await prisma.jobOffer.create({ data: createData });

        revalidatePath("/admin/jobs");
        revalidatePath("/careers");

        return { success: true, createdJob };
    });

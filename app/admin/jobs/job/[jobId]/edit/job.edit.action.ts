"use server"

import { prisma } from "@/lib/db";
import { writeAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { updateJobOfferSchema } from "./job.edit.schema";
import { imageService } from "@/lib/services/image.service";

export const doEditJob = writeAction
    .metadata({ actionName: "edit-job-admin" })
    .inputSchema(updateJobOfferSchema)
    .action(async ({ parsedInput }) => {
        const { id, images, ...job } = parsedInput;

        // Build update data
        const updateData: any = {
            ...job,
            applicationDeadline : job.applicationDeadline ? new Date(job.applicationDeadline) : null,
            startDate: job.startDate ? new Date(job.startDate) : null,
        };

        // Handle images: delete old physical files and update database
        if (images !== undefined) {
            // Récupérer les anciennes images pour les supprimer du système de fichiers
            const existingJob = await prisma.jobOffer.findUnique({
                where: { id },
                include: { images: true },
            });

            if (existingJob && existingJob.images.length > 0) {
                // Supprimer les fichiers physiques des anciennes images
                const oldImageUrls = existingJob.images.map((img) => img.url);
                await imageService.deleteImages(oldImageUrls);
            }

            // Mettre à jour les images dans la base de données
            updateData.images = {
                deleteMany: {}, // Delete all existing image records
                create: images.map((img: any, index: number) => ({
                    url: img.url,
                    caption: img.caption,
                    sortOrder: index,
                })),
            };
        }

        const editedJob = await prisma.jobOffer.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/jobs");
        revalidatePath(`/admin/jobs/job/${id}`);
        revalidatePath("/careers");

        return { success: true, editedJob };
    });

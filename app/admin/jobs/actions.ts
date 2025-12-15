"use server";
import { actionClient, writeAction, deleteAction, adminAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createJobOfferSchema, updateJobOfferSchema } from "@/lib/validations/jobs";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { enforceDraftStatusForEditor } from "@/lib/auth";
import { imageService } from "@/lib/services/image.service";
import { revalidatePath } from "next/cache";

export const listJobs = actionClient
  .metadata({ actionName: "list-jobs" })
  .action(async () => {
    const jobs = await prisma.jobOffer.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { jobs };
  });

export const createJob = writeAction
  .metadata({ actionName: "create-job" })
  .schema(createJobOfferSchema)
  .action(async ({ parsedInput }) => {
    // Extraire les images du reste des données
    const { images, ...jobData } = parsedInput;

    // Force le statut à "draft" si l'utilisateur est un editor
    const finalStatus = jobData.status ? await enforceDraftStatusForEditor(jobData.status) : undefined;

    const created = await prisma.jobOffer.create({
      data: {
        ...jobData,
        status: finalStatus,
        // Créer les images avec la syntaxe Prisma nested create
        ...(images && images.length > 0 && {
          images: {
            create: images.map((img, index) => ({
              url: img.url,
              caption: img.caption || null,
              sortOrder: index,
            })),
          },
        }),
      },
    });
    revalidateTag('jobs');
    return { id: created.id };
  });

export const updateJob = writeAction
  .metadata({ actionName: "update-job" })
  .schema(updateJobOfferSchema)
  .action(async ({ parsedInput }) => {
    const { id, images, ...data } = parsedInput;

    // Force le statut à "draft" si l'utilisateur est un editor
    const finalData = { ...data };
    if (data.status) {
      finalData.status = await enforceDraftStatusForEditor(data.status);
    }

    // Si des images sont fournies, supprimer les anciennes et créer les nouvelles
    if (images !== undefined) {
      await prisma.jobOfferImage.deleteMany({ where: { jobId: id } });
    }

    const updated = await prisma.jobOffer.update({
      where: { id },
      data: {
        ...finalData,
        // Créer les nouvelles images si fournies
        ...(images && images.length > 0 && {
          images: {
            create: images.map((img, index) => ({
              url: img.url,
              caption: img.caption || null,
              sortOrder: index,
            })),
          },
        }),
      },
    });
    revalidateTag('jobs');
    return { id: updated.id };
  });

export const deleteJob = deleteAction
  .metadata({ actionName: "delete-job" })
  .schema(z.object({ id: z.number().int().positive() }))
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;

      // Récupérer l'offre d'emploi avec ses images
      const job = await prisma.jobOffer.findUnique({
        where: { id },
        include: {
          images: true,
        },
      });

      if (!job) {
        throw new Error("Offre d'emploi introuvable.");
      }

      // Supprimer les fichiers d'images du système de fichiers
      const imageUrls = job.images.map((img) => img.url);
      if (imageUrls.length > 0) {
        await imageService.deleteImages(imageUrls);
      }

      // Supprimer l'offre d'emploi (les relations en cascade seront supprimées automatiquement)
      await prisma.jobOffer.delete({ where: { id } });

      // Revalider les pages concernées
      revalidateTag('jobs');
      revalidatePath("/admin/jobs");
      revalidatePath("/careers");

      return { ok: true, message: "Offre d'emploi et images supprimées avec succès." };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("Offre d'emploi introuvable.");
      }
      throw error;
    }
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



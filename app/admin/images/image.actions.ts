"use server";

import { adminAction } from "@/lib/safe-action";
import { imageService } from "@/lib/services/image.service";
import { prisma } from "@/lib/db";
import {
  uploadImageSchema,
  uploadImagesSchema,
  deleteImageSchema,
  deleteImagesSchema,
  deleteEntityImagesSchema,
} from "@/lib/validations/image.schema";
import { revalidatePath } from "next/cache";

/**
 * Upload une seule image
 */
export const uploadImage = adminAction
  .metadata({ actionName: "upload-image" })
  .schema(uploadImageSchema)
  .action(async ({ parsedInput }) => {
    const { file, subdir } = parsedInput;

    try {
      const result = await imageService.uploadImage(file, subdir);
      return {
        ok: true,
        data: result,
        message: "Image uploadée avec succès",
      };
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'upload de l'image");
    }
  });

/**
 * Upload plusieurs images
 */
export const uploadImages = adminAction
  .metadata({ actionName: "upload-images" })
  .schema(uploadImagesSchema)
  .action(async ({ parsedInput }) => {
    const { files, subdir } = parsedInput;

    try {
      const results = await imageService.uploadImages(files, subdir);
      return {
        ok: true,
        data: results,
        message: `${results.length} image(s) uploadée(s) avec succès`,
      };
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'upload des images");
    }
  });

/**
 * Supprime une image
 */
export const deleteImage = adminAction
  .metadata({ actionName: "delete-image" })
  .schema(deleteImageSchema)
  .action(async ({ parsedInput }) => {
    const { url } = parsedInput;

    try {
      await imageService.deleteImage(url);
      return {
        ok: true,
        message: "Image supprimée avec succès",
      };
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la suppression de l'image");
    }
  });

/**
 * Supprime plusieurs images
 */
export const deleteImages = adminAction
  .metadata({ actionName: "delete-images" })
  .schema(deleteImagesSchema)
  .action(async ({ parsedInput }) => {
    const { urls } = parsedInput;

    try {
      await imageService.deleteImages(urls);
      return {
        ok: true,
        message: `${urls.length} image(s) supprimée(s) avec succès`,
      };
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la suppression des images");
    }
  });

/**
 * Supprime toutes les images d'une entité (event, blogPost, jobOffer)
 */
export const deleteEntityImages = adminAction
  .metadata({ actionName: "delete-entity-images" })
  .schema(deleteEntityImagesSchema)
  .action(async ({ parsedInput }) => {
    const { entityType, entityId } = parsedInput;

    try {
      let images: { url: string }[] = [];

      // Récupérer les images selon le type d'entité
      switch (entityType) {
        case "event":
          images = await prisma.eventImage.findMany({
            where: { eventId: entityId },
            select: { url: true },
          });
          break;
        case "blogPost":
          images = await prisma.blogPostImage.findMany({
            where: { postId: entityId },
            select: { url: true },
          });
          break;
        case "jobOffer":
          images = await prisma.jobOfferImage.findMany({
            where: { jobId: entityId },
            select: { url: true },
          });
          break;
      }

      // Supprimer les fichiers physiques
      const urls = images.map((img) => img.url);
      if (urls.length > 0) {
        await imageService.deleteImages(urls);
      }

      // Supprimer les enregistrements en base de données
      switch (entityType) {
        case "event":
          await prisma.eventImage.deleteMany({
            where: { eventId: entityId },
          });
          revalidatePath("/admin/events");
          revalidatePath("/events");
          break;
        case "blogPost":
          await prisma.blogPostImage.deleteMany({
            where: { postId: entityId },
          });
          revalidatePath("/admin/blog");
          revalidatePath("/blog");
          break;
        case "jobOffer":
          await prisma.jobOfferImage.deleteMany({
            where: { jobId: entityId },
          });
          revalidatePath("/admin/jobs");
          revalidatePath("/careers");
          break;
      }

      return {
        ok: true,
        message: `${urls.length} image(s) supprimée(s) avec succès`,
      };
    } catch (error: any) {
      throw new Error(
        error.message || "Erreur lors de la suppression des images de l'entité"
      );
    }
  });

"use server";

import { deleteAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { imageService } from "@/lib/services/image.service";

const deleteEventSchema = z.object({
  id: z.number().int().positive(),
});

export const deleteEvent = deleteAction
  .metadata({ actionName: "delete-event" })
  .inputSchema(deleteEventSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;

      // Vérifier si l'événement existe et récupérer ses images
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          images: true,
        },
      });

      if (!event) {
        throw new Error("Événement introuvable.");
      }

      // Supprimer les fichiers d'images du système de fichiers
      const imageUrls = event.images.map((img) => img.url);
      if (imageUrls.length > 0) {
        await imageService.deleteImages(imageUrls);
      }

      // Supprimer l'événement (les relations en cascade seront supprimées automatiquement)
      await prisma.event.delete({
        where: { id },
      });

      // Revalider les pages concernées
      revalidatePath("/admin/events");
      revalidatePath("/events");

      return { ok: true, message: "Événement et images supprimés avec succès." };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("Événement introuvable.");
      }
      if (error.code === "P2003") {
        throw new Error(
          "Impossible de supprimer cet événement car il est lié à d'autres données."
        );
      }
      throw error;
    }
  });

export const deleteEventForce = deleteAction
  .metadata({ actionName: "delete-event-force" })
  .schema(deleteEventSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;

      // Récupérer l'événement avec ses images
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          images: true,
        },
      });

      if (!event) {
        throw new Error("Événement introuvable.");
      }

      // Supprimer les fichiers d'images du système de fichiers
      const imageUrls = event.images.map((img) => img.url);
      if (imageUrls.length > 0) {
        await imageService.deleteImages(imageUrls);
      }

      // Supprimer l'événement avec toutes ses relations
      await prisma.$transaction(async (tx) => {
        // Supprimer les inscriptions

        // Supprimer l'événement
        await tx.event.delete({
          where: { id },
        });
      });

      // Revalider les pages concernées
      revalidatePath("/admin/events");
      revalidatePath("/events");

      return { ok: true, message: "Événement, images et toutes ses données supprimés avec succès." };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("Événement introuvable.");
      }
      throw error;
    }
  });

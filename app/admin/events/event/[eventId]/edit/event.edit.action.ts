"use server"

import { prisma } from "@/lib/db";
import { writeAction } from "@/lib/safe-action"
import { revalidatePath, revalidateTag } from "next/cache";
import { updateEventSchema } from "./event.edit.schema";
import { enforceDraftStatusForEditor } from "@/lib/auth";
import { imageService } from "@/lib/services/image.service";

export const doEditEvent = writeAction
  .metadata({ actionName: "edit-event-admin" })
  .inputSchema(updateEventSchema)
  .action(async ({ parsedInput }) => {
    const { id, images, ...eventData } = parsedInput;

    // Force le statut à "draft" si l'utilisateur est un editor
    const finalStatus = eventData.status ? await enforceDraftStatusForEditor(eventData.status) : undefined;

    // Build update data
    const updateData: any = {
      ...eventData,
      status: finalStatus,
      maxParticipants: eventData.maxParticipants && !isNaN(Number(eventData.maxParticipants))
        ? Number(eventData.maxParticipants)
        : null,
    };

    // Handle images: delete old physical files and update database
    if (images !== undefined) {
      // Récupérer les anciennes images pour les supprimer du système de fichiers
      const existingEvent = await prisma.event.findUnique({
        where: { id },
        include: { images: true },
      });

      if (existingEvent && existingEvent.images.length > 0) {
        // Supprimer les fichiers physiques des anciennes images
        const oldImageUrls = existingEvent.images.map((img) => img.url);
        await imageService.deleteImages(oldImageUrls);
      }

      // Mettre à jour les images dans la base de données
      updateData.images = {
        deleteMany: {}, // Delete all existing image records
        create: images.map((img, index) => ({
          url: img.url,
          isCover: img.isCover,
          sortOrder: index,
        })),
      };
    }

    const editedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    // Revalidate paths
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/event/${id}`);
    revalidatePath("/events");
    revalidatePath("/");

    // Revalidate cache tags
    revalidateTag('events');

    return { success: true, editedEvent };
  });

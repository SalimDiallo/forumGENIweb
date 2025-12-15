"use server"

import { prisma } from "@/lib/db";
import { writeAction } from "@/lib/safe-action"
import { revalidatePath, revalidateTag } from "next/cache";
import { updateEventSchema } from "./event.edit.schema";
import { enforceDraftStatusForEditor } from "@/lib/auth";

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

    // Handle images: delete all existing and create new ones
    if (images !== undefined) {
      updateData.images = {
        deleteMany: {}, // Delete all existing images
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

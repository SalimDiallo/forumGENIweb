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
        const { id, ...event } = parsedInput;
        console.log(event);

        // Force le statut à "draft" si l'utilisateur est un editor
        const finalStatus = event.status ? await enforceDraftStatusForEditor(event.status) : undefined;

        const editedEvent = await prisma.event.update({
            where: { id },
         data:{
        ...event,
        status: finalStatus,
        maxParticipants: event.maxParticipants ? Number(event.maxParticipants) : 0

      }
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

"use server"

import { prisma } from "@/lib/db";
import { writeAction } from "@/lib/safe-action"
import { revalidatePath, revalidateTag } from "next/cache";
import { updateEventSchema } from "./event.edit.schema";

export const doEditEvent = writeAction
    .metadata({ actionName: "edit-event-admin" })
    .inputSchema(updateEventSchema)
    .action(async ({ parsedInput }) => {
        const { id, ...event } = parsedInput;
        console.log(event);
        
        const editedEvent = await prisma.event.update({
            where: { id },
         data:{
        ...event,
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

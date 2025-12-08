"use server"

import { prisma } from "@/lib/db";
import { writeAction } from "@/lib/safe-action"
import { revalidatePath, revalidateTag } from "next/cache";
import { createEventSchema } from "./event.create.schema";
import { enforceDraftStatusForEditor } from "@/lib/auth";

export const doCreateEvent = writeAction
    .metadata({ actionName: "create-event-admin" })
    .inputSchema(createEventSchema)
    .action(async ({ parsedInput }) => {

        // Force le statut à "draft" si l'utilisateur est un editor
        const finalStatus = await enforceDraftStatusForEditor(parsedInput.status);

        const createdEvent = await prisma.event.create({ data: {
            ...parsedInput,
            status: finalStatus,
            maxParticipants: Number(parsedInput.maxParticipants) ?? 0
        } });

        // Revalidate paths
        revalidatePath("/admin/events");
        revalidatePath("/events");
        revalidatePath("/");

        // Revalidate cache tags
        revalidateTag('events');

        return { success: true, createdEvent };
    });

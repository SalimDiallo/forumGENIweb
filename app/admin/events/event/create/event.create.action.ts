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

        // Extract images and prepare nested create
        const { images, ...eventData } = parsedInput;

        // Build the data object
        const createData: any = {
            ...eventData,
            status: finalStatus,
            maxParticipants: parsedInput.maxParticipants && !isNaN(Number(parsedInput.maxParticipants))
                ? Number(parsedInput.maxParticipants)
                : null,
        };

        // Add images as nested create if provided
        if (images && images.length > 0) {
            createData.images = {
                create: images.map((img, index) => ({
                    url: img.url,
                    isCover: img.isCover,
                    sortOrder: index,
                })),
            };
        }

        const createdEvent = await prisma.event.create({ data: createData });

        // Revalidate paths
        revalidatePath("/admin/events");
        revalidatePath("/events");
        revalidatePath("/");

        // Revalidate cache tags
        revalidateTag('events');

        return { success: true, createdEvent };
    });

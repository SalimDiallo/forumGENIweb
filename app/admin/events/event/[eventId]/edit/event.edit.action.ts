"use server"

import { prisma } from "@/lib/db";
import { adminAction } from "@/lib/safe-action"
import { revalidatePath, revalidateTag } from "next/cache";
import { updateEventSchema } from "./event.edit.schema";

export const doEditEvent = adminAction
    .metadata({ actionName: "edit-event-admin" })
    .schema(updateEventSchema)
    .action(async ({ parsedInput }) => {
        const { id, ...data } = parsedInput;

        const editedEvent = await prisma.event.update({
            where: { id },
            data
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

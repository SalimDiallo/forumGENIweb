"use server"

import { prisma } from "@/lib/db";
import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { updateEventSchema } from "./event.edit.sheme";

export const doEditEvent = adminAction
    .metadata({ actionName: "edit-event-admin" })
    .schema(updateEventSchema)
    .action(async ({ parsedInput }) => {
        console.log("editing event:", parsedInput);

        const { id, ...data } = parsedInput;

        const editedEvent = await prisma.event.update({
            where: { id },
            data
        });

        revalidatePath("/admin/events");
        revalidatePath(`/admin/events/event/${id}`);

        return { success: true, editedEvent };
    });

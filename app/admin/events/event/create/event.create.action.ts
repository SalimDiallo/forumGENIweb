"use server"

import { prisma } from "@/lib/db";
import { adminAction } from "@/lib/safe-action"
import { revalidatePath, revalidateTag } from "next/cache";
import { createEventSchema } from "./event.create.schema";

export const doCreateEvent = adminAction
    .metadata({ actionName: "create-event-admin" })
    .schema(createEventSchema)
    .action(async ({ parsedInput }) => {
        const createdEvent = await prisma.event.create({ data: parsedInput });

        // Revalidate paths
        revalidatePath("/admin/events");
        revalidatePath("/events");
        revalidatePath("/");

        // Revalidate cache tags
        revalidateTag('events');

        return { success: true, createdEvent };
    });

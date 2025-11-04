"use server"

import { prisma } from "@/lib/db";
import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { createEventSchema } from "./event.create.sheme";

export const doCreateEvent = adminAction
    .metadata({ actionName: "create-event-admin" })
    .schema(createEventSchema)
    .action(async ({ parsedInput }) => {
        console.log("creating event:", parsedInput);

        const createdEvent = await prisma.event.create({ data: parsedInput });

        revalidatePath("/admin/events");

        return { success: true, createdEvent };
    });

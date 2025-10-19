"use server"

import { prisma } from "@/lib/db";
import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { createEventSchema } from "./event.create.sheme";

export const doCreateEvent = adminAction
    .metadata({actionName:"create event in admin"})
    .inputSchema(createEventSchema)
    .action(async ({ clientInput, ctx }) => {
            console.log("creating event:", clientInput);
    
            const createdEvent = await prisma.event.create({ data: clientInput });

            revalidatePath("/admin/events");
            
            return { success: true, createdEvent };
        
    });

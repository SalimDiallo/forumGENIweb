"use server"

import { prisma } from "@/lib/db";
import { adminAction } from "@/lib/safe-action"
import { revalidatePath } from "next/cache";
import { updateEventSchema } from "./event.edit.sheme";

export const doEditEvent = adminAction
    .metadata({actionName:"edit event in admin"})
    .inputSchema(updateEventSchema)
    .action(async ({ clientInput, ctx }) => {
            console.log("creating event:", clientInput);
            const {id, ...data} = clientInput; 
            if (!data) {
                
            }
    
            const editdEvent = await prisma.event.update({ 
                where:{
                    id:clientInput.id,
                   
                },
                data
             });

            revalidatePath("/admin/events");
            
            return { success: true, editdEvent };
        
    });

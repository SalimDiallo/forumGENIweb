import z from "zod";
import { createEventSchema } from "../../create/event.create.sheme";



export const updateEventSchema = createEventSchema.partial().extend({
    id: z.number().int().positive(),
  });


export type updateEventSchema = z.infer<typeof updateEventSchema>
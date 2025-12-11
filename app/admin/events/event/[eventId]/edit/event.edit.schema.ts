import z from "zod";
import { createEventSchema } from "../../create/event.create.schema";

/**
 * Schema de mise à jour d'événement
 * On étend le schema de création en ajoutant l'id requis
 * Les champs requis restent obligatoires (title, slug, eventType, startDate, endDate, organizerName)
 */
export const updateEventSchema = createEventSchema.and(
  z.object({
    id: z.number().int().positive("L'ID de l'événement est requis"),
  })
);

export type updateEventSchema = z.infer<typeof updateEventSchema>
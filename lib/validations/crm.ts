import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  category: z.enum(["general", "technical", "press", "event", "career"]).default("general"),
  status: z.enum(["new", "in_progress", "resolved", "closed"]).default("new"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
});

export const updateContactMessageSchema = createContactMessageSchema.and(
  z.object({
    id: z.number().int().positive("L'ID du message est requis"),
  })
);

// Schema pour mise à jour partielle (statut uniquement)
export const updateContactStatusSchema = z.object({
  id: z.number().int().positive("L'ID du message est requis"),
  status: z.enum(["new", "in_progress", "resolved", "closed"]),
});

// Schema pour les opérations nécessitant uniquement l'ID
export const contactMessageIdSchema = z.object({
  id: z.number().int().positive("L'ID du message est requis"),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;
export type UpdateContactStatusInput = z.infer<typeof updateContactStatusSchema>;


import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  category: z.enum(["general", "partnership", "technical", "press", "event", "career"]).default("general"),
  status: z.enum(["new", "in_progress", "resolved", "closed"]).default("new"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
});

export const updateContactMessageSchema = createContactMessageSchema.partial().extend({
  id: z.number().int().positive(),
});

export const createPartnershipRequestSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().optional(),
  companySize: z.enum(["startup", "pme", "eti", "grande_entreprise"]),
  website: z.string().optional(),
  contactName: z.string().min(1),
  contactPosition: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  partnershipType: z.enum(["sponsor", "recruiter", "speaker", "mentor", "other"]),
  budgetRange: z.string().optional(),
  objectives: z.string().optional(),
  previousPartnerships: z.string().optional(),
  additionalInfo: z.string().optional(),
  status: z.enum(["pending", "reviewing", "approved", "rejected", "on_hold"]).default("pending"),
});

export const updatePartnershipRequestSchema = createPartnershipRequestSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;
export type CreatePartnershipRequestInput = z.infer<typeof createPartnershipRequestSchema>;
export type UpdatePartnershipRequestInput = z.infer<typeof updatePartnershipRequestSchema>;



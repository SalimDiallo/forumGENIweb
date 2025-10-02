import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  category: z.string().default("general"),
  status: z.string().default("new"),
  priority: z.string().default("normal"),
});

export const updateContactMessageSchema = createContactMessageSchema.partial().extend({
  id: z.number().int().positive(),
});

export const createPartnershipRequestSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().optional(),
  companySize: z.string().min(1),
  website: z.string().optional(),
  contactName: z.string().min(1),
  contactPosition: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  partnershipType: z.string().min(1),
  budgetRange: z.string().optional(),
  objectives: z.string().optional(),
  previousPartnerships: z.string().optional(),
  additionalInfo: z.string().optional(),
  status: z.string().default("pending"),
});

export const updatePartnershipRequestSchema = createPartnershipRequestSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;
export type CreatePartnershipRequestInput = z.infer<typeof createPartnershipRequestSchema>;
export type UpdatePartnershipRequestInput = z.infer<typeof updatePartnershipRequestSchema>;



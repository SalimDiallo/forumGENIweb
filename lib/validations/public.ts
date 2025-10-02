import { z } from "zod";

export const publicEventRegistrationSchema = z.object({
  eventSlug: z.string().min(1, "eventSlug requis"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  organization: z.string().optional(),
  position: z.string().optional(),
  experienceLevel: z
    .enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  expectations: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  specialNeeds: z.string().optional(),
  newsletterConsent: z.boolean().default(false),
});

export type PublicEventRegistrationInput = z.infer<
  typeof publicEventRegistrationSchema
>;



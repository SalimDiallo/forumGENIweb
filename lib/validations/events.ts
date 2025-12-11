import { z } from "zod";

// =====================================
// ENUMS
// =====================================

export const EventTypeEnum = z.enum(["forum", "workshop", "conference", "networking", "webinar", "other"]);
export const EventStatusEnum = z.enum(["draft", "published", "ongoing", "completed", "cancelled"]);

/**
 * Schema de validation de date avec transformation vers ISO
 * Accepte les formats datetime-local et les convertit en ISO
 */
export const dateSchema = z.string().transform((str, ctx) => {
  // Si la chaîne est vide ou undefined, ne pas essayer de transformer
  if (!str || str.trim() === '') {
    ctx.addIssue({
      code: "custom",
      message: "La date est requise",
    });
    return z.NEVER;
  }

  // Si c'est déjà une date ISO, on la garde
  if (str.includes('T') && str.includes(':')) {
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  // Si c'est un format datetime-local (sans timezone), on ajoute le timezone
  if (!str.endsWith('Z')) {
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  // Si invalide
  ctx.addIssue({
    code: "custom",
    message: "Format de date invalide",
  });
  return z.NEVER;
});

// =====================================
// EVENT SCHEMAS
// =====================================




// =====================================
// EVENT REGISTRATION SCHEMAS
// =====================================

export const ExperienceLevelEnum = z.enum(["none", "beginner", "intermediate", "advanced", "junior", "senior", "expert"]);
export const RegistrationStatusEnum = z.enum(["pending", "confirmed", "cancelled", "attended"]);
export const PaymentStatusEnum = z.enum(["pending", "paid", "refunded", "exempted"]);

export const createEventRegistrationSchema = z.object({
  eventId: z.number().int().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
  organization: z.string().optional(),
  position: z.string().optional(),
  experienceLevel: ExperienceLevelEnum.default("beginner"),
  expectations: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  specialNeeds: z.string().optional(),
  newsletterConsent: z.boolean().default(false),
  registrationStatus: RegistrationStatusEnum.default("pending"),
  paymentStatus: PaymentStatusEnum.default("pending"),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  qrCode: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export const updateEventRegistrationSchema = createEventRegistrationSchema.partial().extend({
  id: z.number().int().positive(),
  confirmedAt: dateSchema.optional().nullable(),
  attendedAt: dateSchema.optional().nullable(),
});

// =====================================
// TYPES INFERENCE
// =====================================

export type CreateEventRegistrationInput = z.infer<typeof createEventRegistrationSchema>;
export type UpdateEventRegistrationInput = z.infer<typeof updateEventRegistrationSchema>;

// Enum types
export type EventType = z.infer<typeof EventTypeEnum>;
export type EventStatus = z.infer<typeof EventStatusEnum>;
export type ExperienceLevel = z.infer<typeof ExperienceLevelEnum>;
export type RegistrationStatus = z.infer<typeof RegistrationStatusEnum>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
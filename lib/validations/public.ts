import { z } from "zod";

// Schéma adapté au formulaire RegistrationEventForm.tsx (étudiant)
export const publicEventRegistrationSchema = z.object({
  eventSlug: z.string().min(1, "eventSlug requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  school: z.string().min(1, "L'établissement est requis"),
  cne: z.string().min(1, "Le CNE est requis"),
  cycle: z.string().min(1, "Le cycle est requis"),
  level: z.string().min(1, "Le niveau est requis"),
  schoolYear: z.string().min(1, "L'année scolaire est requise"),
  newsletter: z.boolean().default(true),
});

export type PublicEventRegistrationInput = z.infer<typeof publicEventRegistrationSchema>;

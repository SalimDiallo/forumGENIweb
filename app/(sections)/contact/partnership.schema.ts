import { z } from "zod";

export const partnershipFormSchema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  industry: z.string().min(1, "Veuillez sélectionner un secteur d'activité"),
  companySize: z.enum(["startup", "pme", "eti", "grande_entreprise"], {
    errorMap: () => ({ message: "Veuillez sélectionner une taille d'entreprise" }),
  }),
  website: z.string().url("Veuillez entrer une URL valide").optional().or(z.literal("")),
  contactName: z.string().min(2, "Le nom du contact doit contenir au moins 2 caractères"),
  contactPosition: z.string().optional(),
  contactEmail: z.string().email("Veuillez entrer une adresse email valide"),
  contactPhone: z.string().optional(),
  partnershipType: z.enum(["sponsor", "recruiter", "speaker", "mentor", "other"], {
    errorMap: () => ({ message: "Veuillez sélectionner un type de partenariat" }),
  }),
  budgetRange: z.string().optional(),
  objectives: z.string().min(10, "Les objectifs doivent contenir au moins 10 caractères"),
  additionalInfo: z.string().optional(),
});

export type PartnershipFormInput = z.infer<typeof partnershipFormSchema>;

import { dateSchema, EventStatusEnum, EventTypeEnum } from "@/lib/validations/events";
import z from "zod";

/**
 * Schema de création d'événement avec messages d'erreur en français
 */
export const createEventSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  shortDescription: z.string().max(280, "La description courte ne peut pas dépasser 280 caractères").optional(),
  featuredImage: z.string().url({ message: "URL d'image invalide" }).optional().or(z.literal("")),
  eventType: EventTypeEnum,
  location: z.string().optional(),
  isVirtual: z.boolean().default(false),
  virtualLink: z.string().url({ message: "URL de visioconférence invalide" }).optional().or(z.literal("")),
  startDate: z.string().min(1, "La date de début est requise").transform((str) => {
    const date = new Date(str);
    if (isNaN(date.getTime())) {
      throw new Error("Format de date de début invalide");
    }
    return date.toISOString();
  }),
  endDate: z.string().min(1, "La date de fin est requise").transform((str) => {
    const date = new Date(str);
    if (isNaN(date.getTime())) {
      throw new Error("Format de date de fin invalide");
    }
    return date.toISOString();
  }),
  registrationStart: z.string().optional().transform((val) => {
    if (!val || val.trim() === '') return undefined;
    return new Date(val).toISOString();
  }),
  registrationEnd: z.string().optional().transform((val) => {
    if (!val || val.trim() === '') return undefined;
    return new Date(val).toISOString();
  }),
  maxParticipants: z
    .union([
      z.number().int("Le nombre de participants doit être un entier"),
      z.string(),
      z.null(),
    ])
    .optional()
    .nullable(),
  isFree: z.boolean().default(true),
  price: z.number().min(0, "Le prix ne peut pas être négatif").max(100000, "Le prix est trop élevé").default(0),
  currency: z.string().max(10, "Code devise invalide").default("MAD"),
  status: EventStatusEnum.default("draft"),
  registrationLink: z.string().url({ message: "URL d'inscription invalide" }).optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  organizerName: z.string().min(2, "Le nom de l'organisateur doit contenir au moins 2 caractères"),
  agenda: z.string().max(5000, "L'agenda est trop long (5000 caractères max)").optional(),
  speakers: z.string().max(5000, "La liste des intervenants est trop longue (5000 caractères max)").optional(),
  sponsors: z.string().max(5000, "La liste des sponsors est trop longue (5000 caractères max)").optional(),
  requirements: z.string().max(2000, "Les prérequis sont trop longs (2000 caractères max)").optional(),
  whatToBring: z.string().max(2000, "La liste est trop longue (2000 caractères max)").optional(),
  metaTitle: z.string().max(90, "Le méta titre est trop long (90 caractères max)").optional(),
  metaDescription: z.string().max(255, "La méta description est trop longue (255 caractères max)").optional(),
})
  .refine(
    (data) => {
      // Validation inter-champs : la date de fin doit être après la date de début
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Si l'événement n'est pas gratuit, le prix doit être supérieur à 0
      if (!data.isFree && data.price <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "Le prix doit être supérieur à 0 pour un événement payant",
      path: ["price"],
    }
  );

export type createEventSchema = z.infer<typeof createEventSchema>
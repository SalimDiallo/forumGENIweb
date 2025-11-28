import { dateSchema, EventStatusEnum, EventTypeEnum } from "@/lib/validations/events";
import z from "zod";

export const createEventSchema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    featuredImage: z.string().optional(),
    eventType: EventTypeEnum,
    location: z.string().optional(),
    isVirtual: z.boolean().default(false),
    virtualLink: z.string().optional(),
    startDate: z.union([dateSchema, z.date()]),
    endDate: z.union([dateSchema, z.date()]),
    registrationStart: z.string().optional().transform((val) => {
      if (!val || val.trim() === '') return undefined;
      return new Date(val).toISOString();
    }),
    registrationEnd: z.string().optional().transform((val) => {
      if (!val || val.trim() === '') return undefined;
      return new Date(val).toISOString();
    }),
    maxParticipants: z.union([z.number().int().positive(), z.string()]).optional(),
    isFree: z.boolean().default(true),
    price: z.number().default(0),
    currency: z.string().default("MAD"),
    status: EventStatusEnum.default("draft"),
    registrationLink:z.string().optional(),
    isFeatured: z.boolean().default(false),
    organizerName: z.string().min(2),
    agenda: z.string().optional(),
    speakers: z.string().optional(),
    sponsors: z.string().optional(),
    requirements: z.string().optional(),
    whatToBring: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  });

  export type createEventSchema = z.infer<typeof createEventSchema>
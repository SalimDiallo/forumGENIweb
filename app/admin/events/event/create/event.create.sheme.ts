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
    startDate: dateSchema,
    endDate: dateSchema,
    registrationStart: dateSchema.optional(),
    registrationEnd: dateSchema.optional(),
    maxParticipants: z.number().int().positive().optional(),
    isFree: z.boolean().default(true),
    price: z.number().default(0),
    currency: z.string().default("MAD"),
    status: EventStatusEnum.default("draft"),
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
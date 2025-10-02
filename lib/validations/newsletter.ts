import { z } from "zod";

export const createNewsletterSubscriptionSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  categories: z.string().optional(),
  frequency: z.string().default("weekly"),
  isActive: z.boolean().default(true),
  source: z.string().optional(),
});

export const updateNewsletterSubscriptionSchema = createNewsletterSubscriptionSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateNewsletterSubscriptionInput = z.infer<typeof createNewsletterSubscriptionSchema>;
export type UpdateNewsletterSubscriptionInput = z.infer<typeof updateNewsletterSubscriptionSchema>;



import { z } from "zod";

export const upsertSiteAnalyticsSchema = z.object({
  date: z.string().datetime(),
  pageViews: z.number().int().default(0),
  uniqueVisitors: z.number().int().default(0),
  newsletterSignups: z.number().int().default(0),
  eventRegistrations: z.number().int().default(0),
  contactMessages: z.number().int().default(0),
  partnershipRequests: z.number().int().default(0),
  jobViews: z.number().int().default(0),
  blogViews: z.number().int().default(0),
});

export type UpsertSiteAnalyticsInput = z.infer<typeof upsertSiteAnalyticsSchema>;



"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { upsertSiteAnalyticsSchema } from "@/lib/validations/analytics";

export const getAnalyticsByDate = actionClient
  .metadata({ actionName: "get-analytics-by-date" })
  .schema(upsertSiteAnalyticsSchema.pick({ date: true }))
  .action(async ({ parsedInput }) => {
    const entry = await prisma.siteAnalytics.findUnique({
      where: { date: new Date(parsedInput.date) }
    });
    return { entry };
  });

export const upsertAnalytics = actionClient
  .metadata({ actionName: "upsert-analytics" })
  .schema(upsertSiteAnalyticsSchema)
  .action(async ({ parsedInput }) => {
    const { date, ...rest } = parsedInput;
    const upserted = await prisma.siteAnalytics.upsert({
      where: { date: new Date(date) },
      create: { date: new Date(date), ...rest },
      update: rest,
    });
    return { id: upserted.id };
  });



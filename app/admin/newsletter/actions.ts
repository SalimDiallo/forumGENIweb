"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createNewsletterSubscriptionSchema, updateNewsletterSubscriptionSchema } from "@/lib/validations/newsletter";

export const listSubscriptions = actionClient.action(async () => {
  const subscriptions = await prisma.newsletterSubscription.findMany({ orderBy: { subscribedAt: "desc" } });
  return { subscriptions };
});

export const createSubscription = actionClient
  .schema(createNewsletterSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.newsletterSubscription.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateSubscription = actionClient
  .schema(updateNewsletterSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.newsletterSubscription.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteSubscription = actionClient
  .schema(updateNewsletterSubscriptionSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.newsletterSubscription.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



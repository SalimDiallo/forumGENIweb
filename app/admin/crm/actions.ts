"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createContactMessageSchema, updateContactMessageSchema, createPartnershipRequestSchema, updatePartnershipRequestSchema } from "@/lib/validations/crm";

export const listContacts = actionClient.action(async () => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return { messages };
});

export const createContact = actionClient
  .schema(createContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.contactMessage.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateContact = actionClient
  .schema(updateContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.contactMessage.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteContact = actionClient
  .schema(updateContactMessageSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.contactMessage.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });

export const listPartnerships = actionClient.action(async () => {
  const requests = await prisma.partnershipRequest.findMany({ orderBy: { submittedAt: "desc" } });
  return { requests };
});

export const createPartnership = actionClient
  .schema(createPartnershipRequestSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.partnershipRequest.create({ data: parsedInput });
    return { id: created.id };
  });

export const updatePartnership = actionClient
  .schema(updatePartnershipRequestSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.partnershipRequest.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deletePartnership = actionClient
  .schema(updatePartnershipRequestSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.partnershipRequest.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



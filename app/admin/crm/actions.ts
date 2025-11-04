"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createContactMessageSchema, updateContactMessageSchema, createPartnershipRequestSchema, updatePartnershipRequestSchema } from "@/lib/validations/crm";

export const listContacts = actionClient
  .metadata({ actionName: "list-contacts" })
  .action(async () => {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { messages };
  });

export const createContact = actionClient
  .metadata({ actionName: "create-contact" })
  .schema(createContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.contactMessage.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateContact = actionClient
  .metadata({ actionName: "update-contact" })
  .schema(updateContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.contactMessage.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteContact = actionClient
  .metadata({ actionName: "delete-contact" })
  .schema(updateContactMessageSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.contactMessage.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });

export const listPartnerships = actionClient
  .metadata({ actionName: "list-partnerships" })
  .action(async () => {
    const requests = await prisma.partnershipRequest.findMany({
      orderBy: { submittedAt: "desc" }
    });
    return { requests };
  });

export const createPartnership = actionClient
  .metadata({ actionName: "create-partnership" })
  .schema(createPartnershipRequestSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.partnershipRequest.create({ data: parsedInput });
    return { id: created.id };
  });

export const updatePartnership = actionClient
  .metadata({ actionName: "update-partnership" })
  .schema(updatePartnershipRequestSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.partnershipRequest.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deletePartnership = actionClient
  .metadata({ actionName: "delete-partnership" })
  .schema(updatePartnershipRequestSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.partnershipRequest.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



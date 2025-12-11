"use server";
import { actionClient, writeAction, deleteAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createContactMessageSchema, updateContactMessageSchema, updateContactStatusSchema, contactMessageIdSchema } from "@/lib/validations/crm";

export const listContacts = actionClient
  .metadata({ actionName: "list-contacts" })
  .action(async () => {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { messages };
  });

export const createContact = writeAction
  .metadata({ actionName: "create-contact" })
  .schema(createContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.contactMessage.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateContact = writeAction
  .metadata({ actionName: "update-contact" })
  .schema(updateContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.contactMessage.update({ where: { id }, data });
    return { id: updated.id };
  });

// Mise à jour du statut uniquement
export const updateContactStatus = writeAction
  .metadata({ actionName: "update-contact-status" })
  .schema(updateContactStatusSchema)
  .action(async ({ parsedInput }) => {
    const { id, status } = parsedInput;
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });
    return { id: updated.id, status: updated.status };
  });

export const deleteContact = deleteAction
  .metadata({ actionName: "delete-contact" })
  .schema(contactMessageIdSchema)
  .action(async ({ parsedInput }) => {
    await prisma.contactMessage.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });

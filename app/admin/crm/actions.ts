"use server";
import { actionClient, adminAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createContactMessageSchema, updateContactMessageSchema } from "@/lib/validations/crm";

export const listContacts = actionClient
  .metadata({ actionName: "list-contacts" })
  .action(async () => {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { messages };
  });

export const createContact = adminAction
  .metadata({ actionName: "create-contact" })
  .schema(createContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.contactMessage.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateContact = adminAction
  .metadata({ actionName: "update-contact" })
  .schema(updateContactMessageSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.contactMessage.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteContact = adminAction
  .metadata({ actionName: "delete-contact" })
  .schema(updateContactMessageSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.contactMessage.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



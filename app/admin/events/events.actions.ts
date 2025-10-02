"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { createEventSchema, updateEventSchema, createEventRegistrationSchema, updateEventRegistrationSchema } from "@/lib/validations/events";

export const listEvents = actionClient.action(async () => {
  const events = await prisma.event.findMany({ orderBy: { startDate: "desc" } });
  return { events };
});

export const createEvent = actionClient
  .inputSchema(createEventSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.event.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateEvent = actionClient
  .inputSchema(updateEventSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.event.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteEvent = actionClient
  .inputSchema(updateEventSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.event.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });

export const listRegistrations = actionClient
  .inputSchema(updateEventSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: parsedInput.id },
      orderBy: { registeredAt: "desc" },
    });
    return { registrations };
  });

export const createRegistration = actionClient
  .inputSchema(createEventRegistrationSchema)
  .action(async ({ parsedInput }) => {
    const created = await prisma.eventRegistration.create({ data: parsedInput });
    return { id: created.id };
  });

export const updateRegistration = actionClient
  .inputSchema(updateEventRegistrationSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const updated = await prisma.eventRegistration.update({ where: { id }, data });
    return { id: updated.id };
  });

export const deleteRegistration = actionClient
  .inputSchema(updateEventRegistrationSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    await prisma.eventRegistration.delete({ where: { id: parsedInput.id } });
    return { ok: true };
  });



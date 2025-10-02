"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { publicEventRegistrationSchema } from "@/lib/validations/public";

export const registerForEvent = actionClient
  .schema(publicEventRegistrationSchema)
  .action(async ({ parsedInput }) => {
    const event = await prisma.event.findUnique({ where: { slug: parsedInput.eventSlug } });
    if (!event) {
      throw new Error("Événement introuvable");
    }

    // If capacity defined, check currentParticipants
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      throw new Error("Capacité atteinte");
    }

    const created = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        firstName: parsedInput.firstName,
        lastName: parsedInput.lastName,
        email: parsedInput.email,
        phone: parsedInput.phone,
        organization: parsedInput.organization,
        position: parsedInput.position,
        experienceLevel: parsedInput.experienceLevel,
        expectations: parsedInput.expectations,
        dietaryRestrictions: parsedInput.dietaryRestrictions,
        specialNeeds: parsedInput.specialNeeds,
        newsletterConsent: parsedInput.newsletterConsent,
        registrationStatus: "pending",
        paymentStatus: event.isFree ? "exempted" : "pending",
      },
    });

    // increment currentParticipants
    await prisma.event.update({
      where: { id: event.id },
      data: { currentParticipants: { increment: 1 } },
    });

    return { id: created.id };
  });



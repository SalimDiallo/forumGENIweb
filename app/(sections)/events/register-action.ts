"use server";
import { authActionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { publicEventRegistrationSchema } from "@/lib/validations/public";

export const registerForEvent = authActionClient
  .metadata({ actionName: "register-for-event" })
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

    // Newsletter: si newsletter true, enregistrer l'email dans la table newsletter_subscriptions si pas déjà existant
    // TODO: Ajouter le modèle NewsletterSubscription au schéma Prisma
    // if (parsedInput.newsletter) {
    //   const existingSubscription = await prisma.newsletterSubscription.findUnique({
    //     where: { email: parsedInput.email }
    //   });
    //   if (!existingSubscription) {
    //     await prisma.newsletterSubscription.create({
    //       data: {
    //         email: parsedInput.email,
    //         name: `${parsedInput.firstName} ${parsedInput.lastName}`.trim(),
    //         source: `event_registration:${parsedInput.eventSlug}`,
    //         isActive: true,
    //       }
    //     });
    //   }
    // }

    const created = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        firstName: parsedInput.firstName,
        lastName: parsedInput.lastName,
        email: parsedInput.email,
        phone: parsedInput.phone,
        // Champs étudiant
        school: parsedInput.school,
        cne: parsedInput.cne,
        schoolYear: parsedInput.schoolYear,
        level: parsedInput.level,
        cycle: parsedInput.cycle,
        // Champs communs
        registrationStatus: "pending",
        paymentStatus: event.isFree ? "exempted" : "pending",
        newsletterConsent: !!parsedInput.newsletter,
      },
    });

    // increment currentParticipants
    await prisma.event.update({
      where: { id: event.id },
      data: { currentParticipants: { increment: 1 } },
    });

    return { id: created.id };
  });

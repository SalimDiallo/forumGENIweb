"use server";

import { actionClient } from "@/lib/safe-action";
import { partnershipFormSchema } from "./partnership.schema";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const submitPartnershipForm = actionClient
  .metadata({ actionName: "submit-partnership-form" })
  .schema(partnershipFormSchema)
  .action(async ({ parsedInput }) => {
    // Créer la demande de partenariat dans la base de données
    const partnershipRequest = await prisma.partnershipRequest.create({
      data: {
        companyName: parsedInput.companyName,
        industry: parsedInput.industry || null,
        companySize: parsedInput.companySize,
        website: parsedInput.website || null,
        contactName: parsedInput.contactName,
        contactPosition: parsedInput.contactPosition || null,
        contactEmail: parsedInput.contactEmail,
        contactPhone: parsedInput.contactPhone || null,
        partnershipType: parsedInput.partnershipType,
        budgetRange: parsedInput.budgetRange || null,
        objectives: parsedInput.objectives || null,
        additionalInfo: parsedInput.additionalInfo || null,
        status: "pending",
      },
    });

    // Revalider la page admin des demandes de partenariat si elle existe
    revalidatePath("/admin/partnership-requests");

    return {
      success: true,
      message: "Votre demande de partenariat a été envoyée avec succès. Nous vous recontacterons sous 48h.",
      data: partnershipRequest,
    };
  });

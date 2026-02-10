"use server";

import { contactFormSchema } from "./contact.schema";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
// import { Resend } from "resend";
// import  { renderContactAdminEmail } from "@/components/EmailTemplate";

export const submitContactForm = actionClient
  .metadata({ actionName: "submit-contact-form" })
  .schema(contactFormSchema)
  .action(async ({ parsedInput }) => {
    // Créer le message de contact dans la base de données
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: parsedInput.name,
        email: parsedInput.email,
        phone: parsedInput.phone || null,
        subject: parsedInput.subject,
        message: parsedInput.message,
        category: parsedInput.category,
        status: "new",
        priority: "normal",
      },
    });

    // const resend = new Resend("re_jYAeT3Mj_7kAkEcumeh6FD2H9kiLpdNUz");

    // const { data, error } = await resend.emails.send({
    //   from: 'forum@gmail.com',
    //   to: ['sidymamadousalim@gmail.com'],
    //   subject: 'Nouveau message de contact',
    //   react: renderContactAdminEmail({nom: parsedInput.name, email: parsedInput.email}),
    // });

    // console.log(data, error);
    



    // Revalider la page admin des messages de contact si elle existe
    revalidatePath("/admin/contact-messages");

    return {
      success: true,
      message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      data: contactMessage,
    };
  });

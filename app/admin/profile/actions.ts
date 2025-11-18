"use server";

import { prisma } from "@/lib/db";
import { authActionClient } from "@/lib/safe-action";
import { changeOwnPasswordSchema } from "./schemas";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Permet à un utilisateur de changer son propre mot de passe
 */
export const changeOwnPassword = authActionClient
  .metadata({ actionName: "change-own-password" })
  .schema(changeOwnPasswordSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { currentPassword, newPassword } = parsedInput;
    const userId = ctx.session.user.id;

    // Trouver le compte associé à l'utilisateur
    const account = await prisma.account.findFirst({
      where: {
        userId: userId,
        providerId: "credential",
      },
    });

    if (!account || !account.password) {
      throw new Error("Compte introuvable ou méthode d'authentification non supportée");
    }

    // Vérifier le mot de passe actuel
    const isValidPassword = await bcrypt.compare(currentPassword, account.password);

    if (!isValidPassword) {
      throw new Error("Le mot de passe actuel est incorrect");
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: hashedPassword,
      },
    });

    // Supprimer toutes les autres sessions (garder la session actuelle)
    await prisma.session.deleteMany({
      where: {
        userId: userId,
        token: {
          not: ctx.session.session.token,
        },
      },
    });

    revalidatePath("/admin");

    return {
      message: "Mot de passe modifié avec succès",
    };
  });

"use server";

import { prisma } from "@/lib/db";
import { actionClient, superAdminAction } from "@/lib/safe-action";
import {
  createUserSchema,
  updateUserSchema,
  toggleUserStatusSchema,
  deleteUserSchema,
  resetPasswordSchema,
} from "./schemas";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Liste tous les utilisateurs (super admin uniquement)
 */
export const listUsers = actionClient
  .metadata({ actionName: "list-users" })
  .action(async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { users };
  });

/**
 * Crée un nouvel utilisateur (super admin uniquement)
 */
export const createUser = superAdminAction
  .metadata({ actionName: "create-user" })
  .schema(createUserSchema)
  .action(async ({ parsedInput }) => {
    const { email, name, fullName, password, role, isActive } = parsedInput;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Créer l'utilisateur via Better Auth
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
          fullName, // Passer fullName directement
        },
      });

      if (!result) {
        throw new Error("Erreur lors de la création de l'utilisateur");
      }

      // Mettre à jour les autres champs additionnels
      const user = await prisma.user.update({
        where: { email },
        data: {
          role,
          isActive,
          emailVerified: true, // Auto-vérifier pour les admins
        },
        select: {
          id: true,
          email: true,
          name: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      // Revalider le cache de la page des utilisateurs
      revalidatePath("/admin/users");
      revalidatePath("/admin/users/new");

      return {
        user,
        message: `Utilisateur ${fullName} créé avec succès`,
      };
    } catch (error: any) {
      console.error("Erreur création utilisateur:", error);
      throw new Error(
        error?.message || "Erreur lors de la création de l'utilisateur"
      );
    }
  });

/**
 * Met à jour un utilisateur (super admin uniquement)
 */
export const updateUser = superAdminAction
  .metadata({ actionName: "update-user" })
  .schema(updateUserSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...updateData } = parsedInput;

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("Utilisateur introuvable");
    }

    // Si on change l'email, vérifier qu'il n'est pas déjà utilisé
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (emailTaken) {
        throw new Error("Cet email est déjà utilisé");
      }
    }

    // Mettre à jour l'utilisateur
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    revalidatePath("/admin/users");

    return {
      user,
      message: "Utilisateur mis à jour avec succès",
    };
  });

/**
 * Active ou désactive un utilisateur (super admin uniquement)
 */
export const toggleUserStatus = superAdminAction
  .metadata({ actionName: "toggle-user-status" })
  .schema(toggleUserStatusSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, isActive } = parsedInput;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Empêcher de se désactiver soi-même
    if (id === ctx.session.user.id) {
      throw new Error("Vous ne pouvez pas modifier votre propre statut");
    }

    // Mettre à jour le statut
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        isActive: true,
      },
    });

    // Si on désactive l'utilisateur, supprimer ses sessions
    if (!isActive) {
      await prisma.session.deleteMany({
        where: { userId: id },
      });
    }

    revalidatePath("/admin/users");

    return {
      user: updatedUser,
      message: isActive
        ? "Utilisateur activé avec succès"
        : "Utilisateur désactivé avec succès",
    };
  });

/**
 * Supprime un utilisateur (super admin uniquement)
 */
export const deleteUser = superAdminAction
  .metadata({ actionName: "delete-user" })
  .schema(deleteUserSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Empêcher de se supprimer soi-même
    if (id === ctx.session.user.id) {
      throw new Error("Vous ne pouvez pas supprimer votre propre compte");
    }

    // Supprimer l'utilisateur (cascade sur sessions et accounts)
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");

    return {
      message: "Utilisateur supprimé avec succès",
    };
  });

/**
 * Réinitialise le mot de passe d'un utilisateur (super admin uniquement)
 */
export const resetUserPassword = superAdminAction
  .metadata({ actionName: "reset-user-password" })
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    const { id, newPassword } = parsedInput;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Trouver le compte associé à l'utilisateur
    const account = await prisma.account.findFirst({
      where: {
        userId: id,
        providerId: "credential",
      },
    });

    if (!account) {
      throw new Error("Compte introuvable pour cet utilisateur");
    }

    // Hasher le nouveau mot de passe avec bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: hashedPassword,
      },
    });

    // Supprimer toutes les sessions de l'utilisateur pour forcer une nouvelle connexion
    await prisma.session.deleteMany({
      where: { userId: id },
    });

    revalidatePath("/admin/users");

    return {
      message: `Mot de passe réinitialisé pour ${user.fullName}`,
    };
  });

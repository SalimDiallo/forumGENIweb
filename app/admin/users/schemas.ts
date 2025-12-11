import { z } from "zod";

/**
 * Schéma pour la création d'un utilisateur
 */
export const createUserSchema = z.object({
  email: z
    .email("Email invalide")
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .trim(),
  fullName: z
    .string()
    .min(1, "Le nom complet est requis")
    .min(2, "Le nom complet doit contenir au moins 2 caractères")
    .trim(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  role: z.enum(["viewer", "editor", "admin", "super_admin"]),
  isActive: z.boolean().default(true),
});

/**
 * Schéma pour la mise à jour d'un utilisateur
 */
export const updateUserSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  email: z
    .email("Email invalide")
    .toLowerCase()
    .trim()
    .optional(),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .trim()
    .optional(),
  fullName: z
    .string()
    .min(2, "Le nom complet doit contenir au moins 2 caractères")
    .trim()
    .optional(),
  role: z.enum(["viewer", "editor", "admin", "super_admin"]).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Schéma pour changer le statut actif d'un utilisateur
 */
export const toggleUserStatusSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  isActive: z.boolean(),
});

/**
 * Schéma pour supprimer un utilisateur
 */
export const deleteUserSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
});

/**
 * Schéma pour réinitialiser le mot de passe d'un utilisateur
 */
export const resetPasswordSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  newPassword: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

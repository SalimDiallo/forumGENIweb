/**
 * Configuration Zod avec messages d'erreur en français
 * Utilisé pour améliorer l'expérience utilisateur dans les formulaires
 */

import { z } from "zod";

// Type pour les erreurs Zod personnalisées
type ZodErrorMap = z.ZodErrorMap;

/**
 * Map d'erreurs personnalisée en français pour Zod
 */
export const zodErrorMap: ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined" || issue.received === "null") {
        return { message: "Ce champ est requis" };
      }
      if (issue.expected === "string") {
        return { message: "Ce champ doit être du texte" };
      }
      if (issue.expected === "number") {
        return { message: "Ce champ doit être un nombre" };
      }
      if (issue.expected === "boolean") {
        return { message: "Ce champ doit être vrai ou faux" };
      }
      if (issue.expected === "date") {
        return { message: "Ce champ doit être une date valide" };
      }
      return { message: `Type invalide: ${issue.expected} attendu, ${issue.received} reçu` };

    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        return { message: "L'adresse email est invalide" };
      }
      if (issue.validation === "url") {
        return { message: "L'URL est invalide" };
      }
      if (issue.validation === "uuid") {
        return { message: "L'identifiant UUID est invalide" };
      }
      if (issue.validation === "regex") {
        return { message: "Le format est invalide" };
      }
      if (issue.validation === "datetime") {
        return { message: "La date et l'heure sont invalides" };
      }
      return { message: "Format de texte invalide" };

    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        if (issue.minimum === 1) {
          return { message: "Ce champ ne peut pas être vide" };
        }
        return { message: `Ce champ doit contenir au moins ${issue.minimum} caractères` };
      }
      if (issue.type === "number") {
        return { message: `La valeur doit être supérieure ou égale à ${issue.minimum}` };
      }
      if (issue.type === "array") {
        if (issue.minimum === 1) {
          return { message: "Vous devez sélectionner au moins un élément" };
        }
        return { message: `Vous devez sélectionner au moins ${issue.minimum} éléments` };
      }
      if (issue.type === "date") {
        return { message: `La date doit être après le ${new Date(issue.minimum as number).toLocaleDateString("fr-FR")}` };
      }
      return { message: `Valeur trop petite` };

    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        return { message: `Ce champ ne peut pas dépasser ${issue.maximum} caractères` };
      }
      if (issue.type === "number") {
        return { message: `La valeur doit être inférieure ou égale à ${issue.maximum}` };
      }
      if (issue.type === "array") {
        return { message: `Vous ne pouvez pas sélectionner plus de ${issue.maximum} éléments` };
      }
      if (issue.type === "date") {
        return { message: `La date doit être avant le ${new Date(issue.maximum as number).toLocaleDateString("fr-FR")}` };
      }
      return { message: `Valeur trop grande` };

    case z.ZodIssueCode.invalid_enum_value:
      return { message: `Valeur invalide. Options valides: ${issue.options.join(", ")}` };

    case z.ZodIssueCode.unrecognized_keys:
      return { message: `Clés non reconnues: ${issue.keys.join(", ")}` };

    case z.ZodIssueCode.invalid_arguments:
      return { message: "Arguments de fonction invalides" };

    case z.ZodIssueCode.invalid_return_type:
      return { message: "Type de retour de fonction invalide" };

    case z.ZodIssueCode.invalid_date:
      return { message: "Date invalide" };

    case z.ZodIssueCode.invalid_union:
      return { message: "Format de données invalide" };

    case z.ZodIssueCode.invalid_union_discriminator:
      return { message: "Discriminant d'union invalide" };

    case z.ZodIssueCode.invalid_literal:
      return { message: `Valeur invalide. Valeur attendue: ${JSON.stringify(issue.expected)}` };

    case z.ZodIssueCode.custom:
      return { message: ctx.defaultError };

    case z.ZodIssueCode.invalid_intersection_types:
      return { message: "Impossible de fusionner ces types" };

    case z.ZodIssueCode.not_multiple_of:
      return { message: `La valeur doit être un multiple de ${issue.multipleOf}` };

    case z.ZodIssueCode.not_finite:
      return { message: "La valeur doit être un nombre fini" };

    default:
      return { message: ctx.defaultError };
  }
};

/**
 * Active les messages d'erreur en français pour Zod globalement
 */
export function setupZodFrench() {
  z.setErrorMap(zodErrorMap);
}

/**
 * Messages d'erreur personnalisés pour les validations courantes
 */
export const zodMessages = {
  required: "Ce champ est requis",
  email: "L'adresse email est invalide",
  url: "L'URL est invalide",
  min: (min: number) => `Minimum ${min} caractères requis`,
  max: (max: number) => `Maximum ${max} caractères autorisés`,
  minValue: (min: number) => `La valeur minimale est ${min}`,
  maxValue: (max: number) => `La valeur maximale est ${max}`,
  positive: "La valeur doit être positive",
  nonNegative: "La valeur ne peut pas être négative",
  integer: "La valeur doit être un nombre entier",
  slug: "Format invalide. Utilisez uniquement des lettres minuscules, chiffres et tirets",
  phone: "Le numéro de téléphone est invalide",
  strongPassword: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
  passwordMatch: "Les mots de passe ne correspondent pas",
  futureDate: "La date doit être dans le futur",
  pastDate: "La date doit être dans le passé",
  invalidFormat: "Le format est invalide",
  tooShort: (min: number) => `Trop court. Minimum ${min} caractères`,
  tooLong: (max: number) => `Trop long. Maximum ${max} caractères`,
  invalidSelection: "Sélection invalide",
  atLeastOne: "Veuillez sélectionner au moins un élément",
} as const;

/**
 * Helpers pour créer des validations courantes en français
 */
export const zodHelpers = {
  /**
   * Validation d'email avec message en français
   */
  email: () => z.string().email(zodMessages.email),

  /**
   * Validation d'URL avec message en français
   */
  url: () => z.string().url(zodMessages.url),

  /**
   * Validation de slug (format: texte-en-minuscule-avec-tirets)
   */
  slug: () =>
    z
      .string()
      .min(1, zodMessages.required)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, zodMessages.slug),

  /**
   * Validation de mot de passe fort
   */
  strongPassword: () =>
    z
      .string()
      .min(8, zodMessages.min(8))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        zodMessages.strongPassword
      ),

  /**
   * Validation de numéro de téléphone français
   */
  phone: () =>
    z
      .string()
      .regex(
        /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
        zodMessages.phone
      ),

  /**
   * Validation de date future
   */
  futureDate: () =>
    z
      .string()
      .or(z.date())
      .refine(
        (val) => {
          const date = typeof val === "string" ? new Date(val) : val;
          return date > new Date();
        },
        { message: zodMessages.futureDate }
      ),

  /**
   * Validation de date passée
   */
  pastDate: () =>
    z
      .string()
      .or(z.date())
      .refine(
        (val) => {
          const date = typeof val === "string" ? new Date(val) : val;
          return date < new Date();
        },
        { message: zodMessages.pastDate }
      ),
} as const;

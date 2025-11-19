/**
 * Hook personnalisé pour afficher les erreurs de formulaire dans des toasts
 * Améliore l'expérience utilisateur en affichant des notifications claires
 */

import { useEffect } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { toast } from "sonner";

interface UseFormToastOptions {
  /**
   * Afficher un toast pour chaque erreur (default: false)
   * Si false, affiche un seul toast avec le résumé des erreurs
   */
  showIndividualErrors?: boolean;

  /**
   * Message personnalisé pour le titre du toast d'erreur
   */
  errorTitle?: string;

  /**
   * Délai avant d'afficher les erreurs (ms)
   */
  debounce?: number;
}

/**
 * Formate les erreurs de formulaire en messages lisibles
 */
function formatFieldError(field: string, error: any): string {
  // Enlever les underscores et mettre en majuscule la première lettre
  const fieldName = field
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .trim();

  const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

  if (error.message) {
    // Si le message contient déjà le nom du champ, on le retourne tel quel
    if (error.message.toLowerCase().includes(fieldName.toLowerCase())) {
      return error.message;
    }
    // Sinon on préfixe avec le nom du champ
    return `${capitalizedField}: ${error.message}`;
  }

  return `${capitalizedField}: erreur de validation`;
}

/**
 * Hook pour afficher automatiquement les erreurs de formulaire dans des toasts
 *
 * @example
 * ```tsx
 * const { errors } = useForm();
 * useFormToast(errors, { showIndividualErrors: false });
 * ```
 */
export function useFormToast<T extends FieldValues>(
  errors: FieldErrors<T>,
  options: UseFormToastOptions = {}
) {
  const {
    showIndividualErrors = false,
    errorTitle = "Erreurs dans le formulaire",
    debounce = 300,
  } = options;

  useEffect(() => {
    // Débounce pour éviter trop de toasts lors de la saisie
    const timer = setTimeout(() => {
      const errorKeys = Object.keys(errors);

      if (errorKeys.length === 0) return;

      if (showIndividualErrors) {
        // Afficher un toast pour chaque erreur
        errorKeys.forEach((key) => {
          const error = errors[key as keyof typeof errors];
          if (error) {
            const message = formatFieldError(key, error);
            toast.error(message, {
              id: `form-error-${key}`, // Éviter les doublons
              duration: 4000,
            });
          }
        });
      } else {
        // Afficher un seul toast avec toutes les erreurs
        const errorMessages = errorKeys.map((key) => {
          const error = errors[key as keyof typeof errors];
          return error ? formatFieldError(key, error) : null;
        }).filter(Boolean);

        if (errorMessages.length > 0) {
          // Limiter à 5 erreurs affichées dans le toast
          const displayMessages = errorMessages.slice(0, 5);
          const hasMore = errorMessages.length > 5;

          const message = (
            <div className="space-y-1">
              <p className="font-semibold">{errorTitle}</p>
              <ul className="list-disc list-inside space-y-0.5 text-sm">
                {displayMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
                {hasMore && (
                  <li className="text-muted-foreground">
                    ... et {errorMessages.length - 5} autre(s) erreur(s)
                  </li>
                )}
              </ul>
            </div>
          );

          toast.error(message, {
            id: "form-errors-summary",
            duration: 6000,
          });
        }
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [errors, showIndividualErrors, errorTitle, debounce]);
}

/**
 * Hook pour afficher les erreurs de serveur (server actions)
 */
export function useServerErrorToast(
  serverError: string | null | undefined,
  options: { duration?: number } = {}
) {
  const { duration = 5000 } = options;

  useEffect(() => {
    if (serverError) {
      toast.error(serverError, {
        id: "server-error",
        duration,
      });
    }
  }, [serverError, duration]);
}

/**
 * Utilitaire pour afficher un toast de succès avec un message personnalisé
 */
export function showSuccessToast(message: string, options: { duration?: number } = {}) {
  const { duration = 4000 } = options;
  toast.success(message, { duration });
}

/**
 * Utilitaire pour afficher un toast d'erreur avec un message personnalisé
 */
export function showErrorToast(message: string, options: { duration?: number } = {}) {
  const { duration = 5000 } = options;
  toast.error(message, { duration });
}

/**
 * Utilitaire pour afficher un toast de chargement
 * Retourne une fonction pour mettre à jour ou fermer le toast
 */
export function showLoadingToast(message: string = "Chargement...") {
  const id = toast.loading(message);

  return {
    success: (successMessage: string) => toast.success(successMessage, { id }),
    error: (errorMessage: string) => toast.error(errorMessage, { id }),
    dismiss: () => toast.dismiss(id),
  };
}

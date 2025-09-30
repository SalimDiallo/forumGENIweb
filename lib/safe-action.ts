import { createSafeActionClient } from "next-safe-action";

// Gestion des erreurs personnalisée
function handleError(error: unknown) {
  // Vous pouvez personnaliser la gestion ici (log, monitoring, etc.)
  console.error("Erreur dans l'action :", error);
  // Retourner un message d'erreur générique ou spécifique
  return { message: "Une erreur est survenue. Veuillez réessayer plus tard." };
}

// Créez le client avec la gestion des erreurs
export const actionClient = createSafeActionClient({
  handleServerError: handleError,
});
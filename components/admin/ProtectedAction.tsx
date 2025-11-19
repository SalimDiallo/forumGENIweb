'use client';

import React from 'react';
import { useUserRole } from '@/hooks/use-user-role';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedActionProps {
  children: React.ReactNode;
  /** Type d'action protégée */
  action: 'write' | 'delete';
  /** Message tooltip ou alternative pour les viewers */
  fallback?: React.ReactNode;
  /** Afficher un skeleton pendant le chargement */
  showLoadingSkeleton?: boolean;
}

/**
 * Composant qui masque les actions (boutons, formulaires, etc.) pour les utilisateurs
 * avec le rôle "viewer". Les viewers peuvent seulement voir les données, pas les modifier.
 *
 * @example
 * // Bouton de création
 * <ProtectedAction action="write">
 *   <Button>Créer un article</Button>
 * </ProtectedAction>
 *
 * @example
 * // Bouton de suppression
 * <ProtectedAction action="delete">
 *   <Button variant="destructive">Supprimer</Button>
 * </ProtectedAction>
 */
export function ProtectedAction({
  children,
  action,
  fallback = null,
  showLoadingSkeleton = false,
}: ProtectedActionProps) {
  const { isLoading, canWrite, canDelete } = useUserRole();

  // Pendant le chargement, afficher un skeleton ou rien
  if (isLoading) {
    if (showLoadingSkeleton) {
      return <Skeleton className="h-10 w-24" />;
    }
    return null;
  }

  // Vérifier les permissions selon le type d'action
  const hasPermission = action === 'write' ? canWrite : canDelete;

  // Si l'utilisateur n'a pas la permission, afficher le fallback ou rien
  if (!hasPermission) {
    return <>{fallback}</>;
  }

  // Sinon, afficher les children
  return <>{children}</>;
}

/**
 * Alternative: Composant qui affiche un message pour les viewers
 */
export function ViewerMessage({ message }: { message: string }) {
  const { isViewer, isLoading } = useUserRole();

  if (isLoading || !isViewer) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
      <p className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {message}
      </p>
    </div>
  );
}

/** @deprecated Use ViewerMessage instead */
export const EditorMessage = ViewerMessage;

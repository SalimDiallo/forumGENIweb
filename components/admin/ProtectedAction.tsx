'use client';

import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, AlertCircle } from 'lucide-react';

interface ProtectedActionProps {
  children: React.ReactNode;
  /** Type d'action protégée */
  action: 'write' | 'delete' | 'publish';
  /** Message tooltip ou alternative pour les viewers */
  fallback?: React.ReactNode;
  /** Afficher un skeleton pendant le chargement */
  showLoadingSkeleton?: boolean;
}

/**
 * Composant qui masque les actions (boutons, formulaires, etc.) pour les utilisateurs
 * sans les permissions appropriées.
 *
 * @example
 * // Bouton de création (nécessite editor+)
 * <ProtectedAction action="write">
 *   <Button>Créer un article</Button>
 * </ProtectedAction>
 *
 * @example
 * // Bouton de suppression (nécessite admin+)
 * <ProtectedAction action="delete">
 *   <Button variant="destructive">Supprimer</Button>
 * </ProtectedAction>
 *
 * @example
 * // Bouton de publication (nécessite admin+)
 * <ProtectedAction action="publish">
 *   <Button>Publier</Button>
 * </ProtectedAction>
 */
export function ProtectedAction({
  children,
  action,
  fallback = null,
  showLoadingSkeleton = false,
}: ProtectedActionProps) {
  const { isLoading, canWrite, canDelete, canPublish } = useRole();

  // Pendant le chargement, afficher un skeleton ou rien
  if (isLoading) {
    if (showLoadingSkeleton) {
      return <Skeleton className="h-10 w-24" />;
    }
    return null;
  }

  // Vérifier les permissions selon le type d'action
  let hasPermission = false;
  switch (action) {
    case 'write':
      hasPermission = canWrite;
      break;
    case 'delete':
      hasPermission = canDelete;
      break;
    case 'publish':
      hasPermission = canPublish;
      break;
  }

  // Si l'utilisateur n'a pas la permission, afficher le fallback ou rien
  if (!hasPermission) {
    return <>{fallback}</>;
  }

  // Sinon, afficher les children
  return <>{children}</>;
}

interface RoleMessageProps {
  message: string;
  variant?: 'info' | 'warning';
}

/**
 * Message affiché pour les utilisateurs avec permissions limitées
 */
export function ViewerMessage({ message, variant = 'info' }: RoleMessageProps) {
  const { isViewer, isLoading } = useRole();

  if (isLoading || !isViewer) {
    return null;
  }

  const colors = variant === 'warning'
    ? 'bg-amber-50 border-amber-200 text-amber-800'
    : 'bg-blue-50 border-blue-200 text-blue-800';

  return (
    <div className={`rounded-xl border p-4 text-sm ${colors}`}>
      <p className="flex items-center gap-2">
        <Lock className="w-4 h-4 flex-shrink-0" />
        {message}
      </p>
    </div>
  );
}

/**
 * Message affiché pour les utilisateurs ne pouvant pas modifier
 */
export function ReadOnlyMessage({ message }: { message?: string }) {
  const { canWrite, isLoading } = useRole();

  if (isLoading || canWrite) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
      <p className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        {message || "Vous êtes en mode lecture seule. Vous ne pouvez pas modifier le contenu."}
      </p>
    </div>
  );
}

/** @deprecated Use ViewerMessage instead */
export const EditorMessage = ViewerMessage;

/**
 * Composants skeleton pour les états de chargement côté admin
 * Améliore l'expérience utilisateur pendant le chargement des données
 */

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton pour les cartes de statistiques du dashboard
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

/**
 * Skeleton pour les lignes de tableau
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-800">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton pour un tableau complet
 */
export function TableSkeleton({
  rows = 5,
  columns = 5,
  showHeader = true
}: {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <table className="w-full">
        {showHeader && (
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Skeleton pour les formulaires
 */
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

/**
 * Skeleton pour les cartes de contenu
 */
export function ContentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour une page complète avec header et contenu
 */
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Content */}
      <div className="grid gap-6">
        <TableSkeleton rows={8} />
      </div>
    </div>
  );
}

/**
 * Skeleton pour un formulaire d'édition avec onglets
 */
export function TabbedFormSkeleton({ tabs = 3 }: { tabs?: number }) {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        {Array.from({ length: tabs }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      {/* Form content */}
      <FormSkeleton fields={8} />
    </div>
  );
}

/**
 * Skeleton pour la grille de cartes
 */
export function CardGridSkeleton({
  items = 6,
  columns = 3
}: {
  items?: number;
  columns?: 2 | 3 | 4;
}) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: items }).map((_, i) => (
        <ContentCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour les statistiques du dashboard
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour un composant de liste avec pagination
 */
export function PaginatedListSkeleton() {
  return (
    <div className="space-y-6">
      <TableSkeleton rows={10} />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour un spinner de chargement centré
 */
export function CenteredLoadingSkeleton({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-400 animate-spin" />
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}

/**
 * Skeleton pour un bouton en état de chargement
 */
export function ButtonSkeleton({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-10 w-32 ${className}`} />;
}

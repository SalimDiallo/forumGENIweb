/**
 * Skeleton de chargement pour la page de gestion des articles de blog
 */

import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/admin/LoadingSkeletons";

export default function BlogPostsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-11 w-44" />
        </div>
      </section>

      {/* Blog Posts Grid Skeleton */}
      <CardGridSkeleton items={6} columns={3} />

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}

import { Suspense } from 'react';
import JobOffers from '@/components/JobOffers';
import CareerAdvice from '@/components/CareerAdvice';
import PageHero from '@/components/PageHero';

// Skeleton de chargement pour JobOffers
function JobOffersSkeleton() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header Skeleton */}
        <div className="text-center mb-10">
          <div className="h-8 bg-gray-200/60 rounded-lg w-56 mx-auto mb-3 animate-pulse" />
          <div className="h-4 bg-gray-200/60 rounded-lg w-80 mx-auto animate-pulse" />
        </div>

        {/* Search Skeleton */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="h-12 bg-white rounded-xl border border-gray-100 animate-pulse" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex gap-2 flex-wrap items-center justify-center mb-8">
          {[120, 80, 60, 60, 90].map((w, i) => (
            <div key={i} className="h-9 bg-white rounded-full border border-gray-100 animate-pulse" style={{ width: w }} />
          ))}
        </div>

        {/* Job Cards Skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 animate-pulse">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-100 rounded-lg w-3/5" />
                  <div className="h-4 bg-gray-100 rounded-lg w-2/5" />
                  <div className="flex gap-3">
                    <div className="h-4 bg-gray-100 rounded-lg w-24" />
                    <div className="h-4 bg-gray-100 rounded-lg w-20" />
                    <div className="h-4 bg-gray-100 rounded-lg w-16" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 bg-gray-100 rounded-full w-16" />
                    <div className="h-7 bg-gray-100 rounded-full w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CareersPage() {
  return (
    <main>
      <PageHero
        title="Carrières"
        subtitle="Découvrez les meilleures opportunités de stages et d'emplois"
        image="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=1920&q=80"
        badge="Emplois & Stages"
      />
      <Suspense fallback={<JobOffersSkeleton />}>
        <JobOffers />
      </Suspense>
      <CareerAdvice />
    </main>
  );
}

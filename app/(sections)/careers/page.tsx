import { Suspense } from 'react';
import Careers from '@/components/Careers';
import JobOffers from '@/components/JobOffers';
import CareerAdvice from '@/components/CareerAdvice';

// Composant de chargement pour JobOffers
function JobOffersSkeleton() {
  return (
    <section className="relative py-8 sm:py-12 bg-white text-gray-900 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="text-center mb-5 sm:mb-10">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-96 mx-auto"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border-2 border-gray-200  p-5">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-200 "></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded-lg w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
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
      <Careers />
      <Suspense fallback={<JobOffersSkeleton />}>
        <JobOffers />
      </Suspense>
      <CareerAdvice />
    </main>
  );
}

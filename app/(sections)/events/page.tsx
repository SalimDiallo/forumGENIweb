// app/events/page.tsx
import { Suspense } from 'react';
import { getEvents } from './events.query';
import EventsList from '@/components/EventsList';
import PageHero from '@/components/PageHero';

// Skeleton for events loading
function EventsListSkeleton() {
  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-16">
        {/* Search + View Toggle Skeleton */}
        <div className="mb-6 sm:mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md mx-auto lg:mx-0">
              <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
            </div>
            <div className="flex bg-white rounded-md border border-gray-200 p-1 mx-auto lg:mx-0">
              <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-100 rounded animate-pulse ml-1" />
            </div>
          </div>

          {/* Category Filter Skeleton */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[70, 80, 100, 90, 80].map((w, i) => (
              <div key={i} className="h-7 bg-gray-100 rounded animate-pulse" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Event Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-neutral-200 animate-pulse">
              <div className="h-56 md:h-64 bg-gray-100" />
              <div className="px-4 py-4 space-y-3">
                <div className="h-5 bg-gray-100 rounded w-4/5" />
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-100 rounded w-24" />
                  <div className="h-4 bg-gray-100 rounded w-20" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/5" />
                <div className="flex justify-between pt-2">
                  <div className="h-5 bg-gray-100 rounded w-16" />
                  <div className="h-5 bg-gray-100 rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Async component that fetches data — renders as soon as data is ready
async function EventsListLoader() {
  const events = await getEvents();
  return <EventsList events={events} />;
}

export default function EventsPage() {
  return (
    <main className=''>
      <PageHero
        title="Événements"
        subtitle="Découvrez nos forums, conférences et événements de networking"
        image="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1920&q=80"
        badge="Forum & Événements"
      />
      <Suspense fallback={<EventsListSkeleton />}>
        <EventsListLoader />
      </Suspense>
    </main>
  );
}
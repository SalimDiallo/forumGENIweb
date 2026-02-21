import { Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Link from 'next/link';
import UpcomingEventsWrapper from '@/components/home/UpcomingEventsWrapper';
import VideoTestimonialsWrapper from '@/components/home/VideoTestimonialsWrapper';
import PartnersSimple from '@/components/home/PartnersSimple';

// Lazy loading des composants non critiques
const Partners = lazy(() => import('@/components/home/Partners'));
const TeamsMembres = lazy(() => import('@/components/TeamsMembres'));

// Composant de loading simple
const SimpleLoader = () => (
  <div className="min-h-[30vh] flex items-center justify-center px-6">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Modern spinner animation */}
        <span className="block w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 opacity-20 absolute top-0 left-0 blur-lg"></span>
        <svg
          className="w-16 h-16 animate-spin text-emerald-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 48 48"
        >
          <circle
            className="opacity-20"
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="6"
          />
          <path
            d="M44 24c0-11.046-8.954-20-20-20"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="opacity-90"
          />
        </svg>
      </div>
      <div className="text-xl font-semibold text-emerald-800 mt-2">
        Chargement...
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <main className=''>
      <Hero />

      <Suspense fallback={<SimpleLoader />}>
        <UpcomingEventsWrapper />
      </Suspense>


      <Stats />

      
      <Suspense fallback={<SimpleLoader />}>
        <PartnersSimple />
      </Suspense>

      <Suspense fallback={<SimpleLoader />}>
        <VideoTestimonialsWrapper />
      </Suspense>
      
     
      {/* Blog CTA Section - Ultra Minimal & Professional */}
      <section className="py-12 md:py-16 bg-neutral-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Content */}
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
              Explorez notre blog
            </h2>

            <p className="text-sm md:text-base text-neutral-600 mb-5">
              Conseils carrière, actualités et témoignages.
            </p>

            {/* CTA Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors"
            >
              Découvrir
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

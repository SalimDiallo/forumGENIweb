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
      
     
      {/* Blog CTA Section - Très sobre */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl border border-neutral-200 bg-white p-8 md:p-10 flex flex-col md:flex-row items-center gap-5 shadow-sm">
              {/* Simple Neutral Icon */}
              <div className="flex-shrink-0 hidden md:flex">
                <div className="w-12 h-12 flex items-center justify-center bg-neutral-100 rounded-lg">
                  <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-1">
                  Restez informé
                </h2>
                <p className="text-neutral-700 mb-4 text-base">
                  Conseils carrière, actualités et histoires du Forum GENI.
                </p>
                <Link 
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded hover:bg-neutral-800 transition"
                >
                  Explorer le Blog
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

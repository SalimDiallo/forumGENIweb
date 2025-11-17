import { Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Link from 'next/link';
import UpcomingEventsWrapper from '@/components/home/UpcomingEventsWrapper';
import VideoTestimonialsWrapper from '@/components/home/VideoTestimonialsWrapper';

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

      <Suspense fallback={<SimpleLoader />}>
        <TeamsMembres />
      </Suspense>

      <Stats />

      
      <Suspense fallback={<SimpleLoader />}>
        <Partners />
      </Suspense>

      <Suspense fallback={<SimpleLoader />}>
        <VideoTestimonialsWrapper />
      </Suspense>
      
     
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            Dernières Actualités
          </h2>
          <p className="text-lg text-emerald-900/80 mb-8">
            Restez informé des dernières tendances et actualités
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors"
          >
            Consulter le Blog
          </Link>
        </div>
      </section>
    </main>
  );
}

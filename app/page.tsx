import { Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Link from 'next/link';
import HeaderHome from '@/components/home/HeaderHome';
import UpcomingEventsWrapper from '@/components/home/UpcomingEventsWrapper';
import VideoTestimonialsWrapper from '@/components/home/VideoTestimonialsWrapper';

// Lazy loading des composants non critiques
const Partners = lazy(() => import('@/components/home/Partners'));
const TeamsMembres = lazy(() => import('@/components/TeamsMembres'));

// Composant de loading simple
const SimpleLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800"></div>
  </div>
);

export default function Home() {
  return (
    <main>
      <HeaderHome />
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

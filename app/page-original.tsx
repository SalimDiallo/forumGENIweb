import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Loading from '@/components/Loading';
import Link from 'next/link';

// Lazy loading des composants non critiques
const Stats = dynamic(() => import('@/components/Stats'), {
  loading: () => <Loading size="sm" text="Chargement des statistiques..." />
});

const UpcomingEvents = dynamic(() => import('@/components/UpcomingEvents'), {
  loading: () => <Loading size="sm" text="Chargement des événements..." />
});

const Partners = dynamic(() => import('@/components/Partners'), {
  loading: () => <Loading size="sm" text="Chargement des partenaires..." />
});

const VideoTestimonials = dynamic(() => import('@/components/VideoTestimonials'), {
  loading: () => <Loading size="sm" text="Chargement des témoignages..." />
});

const TeamsMembres = dynamic(() => import('@/components/TeamsMembres'), {
  loading: () => <Loading size="sm" text="Chargement de l'équipe..." />
});

export default function Home() {
  return (
    <main>
      <Hero />
      
      <Suspense fallback={<Loading size="sm" text="Chargement..." />}>
        <Stats />
      </Suspense>
      
      <Suspense fallback={<Loading size="sm" text="Chargement..." />}>
        <UpcomingEvents />
      </Suspense>
      
      <Suspense fallback={<Loading size="sm" text="Chargement..." />}>
        <Partners />
      </Suspense>
      
      <Suspense fallback={<Loading size="sm" text="Chargement..." />}>
        <VideoTestimonials />
      </Suspense>
      
      <Suspense fallback={<Loading size="sm" text="Chargement..." />}>
        <TeamsMembres />
      </Suspense>
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Dernières Actualités
          </h2>
          <p className="text-lg text-green-700/80 mb-8">
            Restez informé des dernières tendances et actualités
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-800 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Voir tous les articles
          </Link>
        </div>
      </section>
    </main>
  );
}

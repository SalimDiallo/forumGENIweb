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
      
     
      {/* Blog CTA Section */}
      <section className="py-24 md:py-32 bg-neutral-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Card with gradient border */}
            <div className="relative p-px rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-600">
              <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                      Restez informé
                    </h2>
                    <p className="text-lg text-neutral-600 mb-6 max-w-xl">
                      Conseils carrière, tendances du marché, success stories et actualités du Forum GENI.
                    </p>
                    <Link 
                      href="/blog"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all hover:shadow-xl hover:-translate-y-0.5 group"
                    >
                      Explorer le Blog
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

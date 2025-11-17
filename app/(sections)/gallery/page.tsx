import GalleryWrapper from '@/components/GalleryWrapper';
import VideoTestimonialsWrapper from '@/components/home/VideoTestimonialsWrapper';
import { Suspense } from 'react';

// Configuration ISR : revalide toutes les heures
export const revalidate = 3600;

// Configuration du runtime
export const runtime = 'nodejs';

// Métadonnées de la page
export const metadata = {
  title: 'Galerie Photo & Vidéo - Forum Génie Entreprise',
  description: 'Revivez les moments marquants de nos événements à travers notre galerie photo et vidéo',
};

const SimpleLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin h-8 w-8 border-b-2 border-emerald-800"></div>
  </div>
);

export default function GalleryPage() {
  return (
    <main>
      <Suspense fallback={<SimpleLoader />}>
        <GalleryWrapper />
      </Suspense>
      <Suspense fallback={<SimpleLoader />}>
        <VideoTestimonialsWrapper />
      </Suspense>
    </main>
  );
}

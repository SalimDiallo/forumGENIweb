import Gallery from '@/components/Gallery';
import VideoTestimonialsWrapper from '@/components/home/VideoTestimonialsWrapper';
import { Suspense } from 'react';

const SimpleLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800"></div>
  </div>
);

export default function GalleryPage() {
  return (
    <main>
      <Gallery />
      <Suspense fallback={<SimpleLoader />}>
        <VideoTestimonialsWrapper />
      </Suspense>
    </main>
  );
}

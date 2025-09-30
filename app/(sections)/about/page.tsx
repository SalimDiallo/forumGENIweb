import { Suspense, lazy } from 'react';

const About = lazy(() => import('@/components/About'));
const Stats = lazy(() => import('@/components/Stats'));
const Mission = lazy(() => import('@/components/Mission'));

const PageLoader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

export default function AboutPage() {
  return (
    <main>
      <Suspense fallback={<PageLoader />}>
        <About />
      </Suspense>
      <Suspense fallback={<PageLoader />}>
        <Mission />
      </Suspense>
      <Suspense fallback={<PageLoader />}>
        <Stats />
      </Suspense>
    </main>
  );
}

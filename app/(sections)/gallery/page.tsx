import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { GalleryClient } from "./GalleryClient";
import VideoTestimonialsWrapper from "@/components/home/VideoTestimonialsWrapper";
import PageHero from "@/components/PageHero";

// Configuration ISR : revalide toutes les heures
export const revalidate = 3600;

// Métadonnées de la page
export const metadata = {
  title: 'Galerie Photo & Vidéo - Forum GENIEntreprise',
  description: 'Revivez les moments marquants de nos événements à travers notre galerie photo et vidéo',
};

interface PageProps {
  searchParams: Promise<{
    year?: string;
    category?: string;
    type?: string;
    search?: string;
  }>;
}

// Skeleton for gallery loading
function GallerySkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Filters Skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-2">
              {[90, 80, 80].map((w, i) => (
                <div key={i} className="h-9 bg-gray-100 rounded-full animate-pulse" style={{ width: w }} />
              ))}
            </div>
            <div className="flex gap-3">
              <div className="h-9 w-36 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-9 w-36 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="container mx-auto px-6 py-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {[240, 180, 220, 160, 200, 260, 190, 210, 170, 230, 200, 180].map((h, i) => (
            <div key={i} className="break-inside-avoid mb-4">
              <div className="bg-gray-100 rounded-xl animate-pulse" style={{ height: h }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Async component for gallery data fetching
async function GalleryLoader({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  const params = await searchParams;
  const selectedYear = params.year;
  const selectedCategory = params.category;
  const selectedType = params.type || "all";

  // Build filters
  const videoFilters: any = { isActive: true };
  const photoFilters: any = { isActive: true };

  if (selectedYear) {
    const year = parseInt(selectedYear);
    videoFilters.eventYear = year;
    photoFilters.eventYear = year;
  }

  if (selectedCategory) {
    videoFilters.category = selectedCategory;
    photoFilters.category = selectedCategory;
  }

  const searchQuery = params.search;
  if (searchQuery) {
    const searchFilter = {
      OR: [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ],
    };
    videoFilters.AND = searchFilter;
    photoFilters.AND = searchFilter;
  }

  // Only select fields needed for gallery display
  const videoSelect = {
    id: true,
    title: true,
    description: true,
    videoUrl: true,
    thumbnailUrl: true,
    eventName: true,
    eventYear: true,
    category: true,
    isFeatured: true,
    viewCount: true,
  } as const;

  const photoSelect = {
    id: true,
    title: true,
    description: true,
    imageUrl: true,
    thumbnailUrl: true,
    eventName: true,
    eventYear: true,
    category: true,
    isFeatured: true,
    viewCount: true,
  } as const;

  // Fetch data — all queries in parallel
  const [videos, photos, videoYears, photoYears, videoCategories, photoCategories] = await Promise.all([
    selectedType === "photos" ? Promise.resolve([]) : prisma.videoGallery.findMany({
      where: videoFilters,
      select: videoSelect,
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    selectedType === "videos" ? Promise.resolve([]) : prisma.photoGallery.findMany({
      where: photoFilters,
      select: photoSelect,
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.videoGallery.findMany({
      where: { isActive: true, eventYear: { not: null } },
      select: { eventYear: true },
      distinct: ['eventYear'],
      orderBy: { eventYear: 'desc' },
    }),
    prisma.photoGallery.findMany({
      where: { isActive: true, eventYear: { not: null } },
      select: { eventYear: true },
      distinct: ['eventYear'],
      orderBy: { eventYear: 'desc' },
    }),
    prisma.videoGallery.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    }),
    prisma.photoGallery.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    }),
  ]);

  // Merge and deduplicate years
  const allYears = Array.from(
    new Set([
      ...videoYears.map(v => v.eventYear).filter(Boolean),
      ...photoYears.map(p => p.eventYear).filter(Boolean),
    ])
  ).sort((a, b) => (b as number) - (a as number));

  // Merge and deduplicate categories
  const allCategories = Array.from(
    new Set([
      ...videoCategories.map(v => v.category).filter(Boolean),
      ...photoCategories.map(p => p.category).filter(Boolean),
    ])
  ).sort();

  return (
    <GalleryClient
      videos={videos}
      photos={photos}
      years={allYears as number[]}
      categories={allCategories as string[]}
      selectedYear={selectedYear}
      selectedCategory={selectedCategory}
      selectedType={selectedType}
    />
  );
}

export default async function GalleryPage({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen">
      <PageHero
        title="Galerie"
        subtitle="Revivez les moments marquants de nos événements à travers photos et vidéos"
        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
        badge="Photos & Vidéos"
      />
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryLoader searchParams={searchParams} />
      </Suspense>
      <Suspense>
        <VideoTestimonialsWrapper />
      </Suspense>
    </main>
  );
}

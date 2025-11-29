import { prisma } from "@/lib/db";
import { GalleryClient } from "./GalleryClient";
import VideoTestimonialsWrapper from "@/components/home/VideoTestimonialsWrapper";

// Configuration ISR : revalide toutes les heures
export const revalidate = 3600;

// Métadonnées de la page
export const metadata = {
  title: 'Galerie Photo & Vidéo - Forum Génie Entreprise',
  description: 'Revivez les moments marquants de nos événements à travers notre galerie photo et vidéo',
};

interface PageProps {
  searchParams: Promise<{
    year?: string;
    category?: string;
    type?: string;
  }>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedYear = params.year;
  const selectedCategory = params.category;
  const selectedType = params.type || "all"; // "all", "videos", "photos"

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

  // Fetch data based on type
  const [videos, photos, videoYears, photoYears, videoCategories, photoCategories] = await Promise.all([
    selectedType === "photos" ? [] : prisma.videoGallery.findMany({
      where: videoFilters,
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    selectedType === "videos" ? [] : prisma.photoGallery.findMany({
      where: photoFilters,
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    // Get unique years from videos
    prisma.videoGallery.findMany({
      where: { isActive: true, eventYear: { not: null } },
      select: { eventYear: true },
      distinct: ['eventYear'],
      orderBy: { eventYear: 'desc' },
    }),
    // Get unique years from photos
    prisma.photoGallery.findMany({
      where: { isActive: true, eventYear: { not: null } },
      select: { eventYear: true },
      distinct: ['eventYear'],
      orderBy: { eventYear: 'desc' },
    }),
    // Get unique categories from videos
    prisma.videoGallery.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    }),
    // Get unique categories from photos
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
    <>
    <GalleryClient
      videos={videos}
      photos={photos}
      years={allYears as number[]}
      categories={allCategories as string[]}
      selectedYear={selectedYear}
      selectedCategory={selectedCategory}
      selectedType={selectedType}
    />
    <VideoTestimonialsWrapper />
    </>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryForm } from "../../../GalleryForm";
import { prisma } from "@/lib/db";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVideoPage({ params }: PageProps) {
  const { id } = await params;
  const videoId = parseInt(id);

  if (isNaN(videoId)) {
    notFound();
  }

  const video = await prisma.videoGallery.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    notFound();
  }

  // Fetch events for the dropdown
  const events = await prisma.event.findMany({
    where: {
      status: { in: ["published", "ongoing", "completed"] },
    },
    select: {
      id: true,
      title: true,
      startDate: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/gallery"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Modifier la vidéo
            </h1>
            <p className="text-gray-600">
              Modifiez les informations de la vidéo YouTube
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <GalleryForm type="video" item={video} events={events} />
      </section>
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GalleryForm } from "../GalleryForm";
import { prisma } from "@/lib/db";

interface PageProps {
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function CreateGalleryItemPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const type = params.type === "photos" ? "photo" : "video";

  // Fetch active events for the dropdown
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
              {type === "video" ? "Nouvelle Vidéo YouTube" : "Nouvelle Photo Google Drive"}
            </h1>
            <p className="text-gray-600">
              {type === "video"
                ? "Ajoutez une vidéo YouTube non répertoriée (unlisted)"
                : "Ajoutez une photo depuis Google Drive"}
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <GalleryForm type={type} events={events} />
      </section>
    </div>
  );
}

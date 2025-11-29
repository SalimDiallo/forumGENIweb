import { Plus, Video, Image as ImageIcon, Edit2, Trash2, Eye, EyeOff, Star } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getYouTubeThumbnailUrl } from "@/lib/services/youtube";
import { getDriveThumbnailUrl } from "@/lib/validations/gallery";
import { GalleryTabs } from "./GalleryTabs";

interface PageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function AdminGalleryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeTab = params.tab === "photos" ? "photos" : "videos";

  // Fetch data based on active tab
  const [videos, photos] = await Promise.all([
    prisma.videoGallery.findMany({
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 50,
    }),
    prisma.photoGallery.findMany({
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 50,
    }),
  ]);

  const totalVideos = await prisma.videoGallery.count();
  const totalPhotos = await prisma.photoGallery.count();

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Gestion de la Galerie
            </h1>
            <p className="text-gray-600">
              {totalVideos} vidéo(s) • {totalPhotos} photo(s)
            </p>
          </div>
          <Link
            href={`/admin/gallery/create?type=${activeTab}`}
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-5 py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Ajouter {activeTab === "videos" ? "une vidéo" : "une photo"}
          </Link>
        </div>
      </section>

      {/* Client Component for Tabs */}
      <GalleryTabs
        activeTab={activeTab}
        videos={videos}
        photos={photos}
      />

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 Comment ça marche ?
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div>
            <strong>Pour les vidéos YouTube :</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Téléchargez votre vidéo sur YouTube en mode "Non répertorié"</li>
              <li>Copiez le lien de la vidéo</li>
              <li>Collez-le ici - c'est tout !</li>
            </ul>
          </div>
          <div>
            <strong>Pour les photos Google Drive :</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Téléchargez vos photos sur Google Drive</li>
              <li>Faites clic droit {'>'} "Obtenir le lien" {'>'} "Tout le monde avec le lien"</li>
              <li>Copiez et collez le lien ici</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

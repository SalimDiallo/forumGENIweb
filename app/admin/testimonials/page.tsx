import { Plus, Video } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { TestimonialsList } from "./TestimonialsList";

interface PageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function AdminTestimonialsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;
  const itemsPerPage = 50;
  const skip = (page - 1) * itemsPerPage;

  const [testimonials, total] = await Promise.all([
    prisma.videoTestimonial.findMany({
      skip,
      take: itemsPerPage,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.videoTestimonial.count(),
  ]);

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Témoignages Vidéo
              </h1>
              <p className="text-gray-600">
                {total} témoignage{total !== 1 ? "s" : ""} • Vidéos YouTube de vos anciens étudiants
              </p>
            </div>
          </div>
          <Link
            href="/admin/testimonials/create"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg px-5 py-2.5 font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-200"
          >
            <Plus className="w-5 h-5" />
            Nouveau témoignage
          </Link>
        </div>
      </section>

      {/* Testimonials List */}
      <TestimonialsList testimonials={testimonials} total={total} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-700">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/testimonials?page=${page - 1}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Précédent
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/testimonials?page=${page + 1}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Suivant
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Tips section */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
          💡 Conseils pour de bons témoignages
        </h3>
        <ul className="space-y-2 text-sm text-purple-800">
          <li>• Utilisez des vidéos YouTube non répertoriées (unlisted) pour plus de contrôle</li>
          <li>• Ajoutez une citation courte et impactante pour chaque témoignage</li>
          <li>• Mettez en vedette les témoignages les plus représentatifs</li>
          <li>• L'ordre d'affichage (0, 1, 2...) détermine la position sur le site</li>
        </ul>
      </div>
    </div>
  );
}

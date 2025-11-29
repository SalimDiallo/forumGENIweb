import {
  Plus,
  Edit2,
  Video,
  Star,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getYouTubeThumbnailUrl, getYouTubeEmbedUrl } from "@/lib/services/youtube";
import { DeleteButton } from "./DeleteButton";

interface PageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function AdminTestimonialsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;
  const itemsPerPage = 20;
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
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Gestion des Témoignages Vidéo
            </h1>
            <p className="text-gray-600">{total} témoignage(s) au total</p>
          </div>
          <Link
            href="/admin/testimonials/create"
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-5 py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouveau témoignage
          </Link>
        </div>
      </section>

      {/* Testimonials List */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {testimonials?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucun témoignage vidéo pour le moment</p>
          </div>
        )}

        {testimonials?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordre
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aperçu
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom & Informations
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Citation
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => {
                  const thumbnail =
                    testimonial.thumbnailUrl ||
                    getYouTubeThumbnailUrl(testimonial.videoUrl, "hqdefault");
                  const embedUrl = getYouTubeEmbedUrl(testimonial.videoUrl);

                  return (
                    <tr key={testimonial.id} className="hover:bg-gray-50">
                      {/* Sort Order */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                          {testimonial.sortOrder}
                        </span>
                      </td>

                      {/* Video Thumbnail */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative w-24 h-16 rounded overflow-hidden bg-gray-100">
                          {thumbnail && (
                            <img
                              src={thumbnail}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </td>

                      {/* Name & Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {testimonial.name}
                          </span>
                          {testimonial.position && (
                            <span className="text-sm text-gray-600">
                              {testimonial.position}
                            </span>
                          )}
                          {testimonial.company && (
                            <span className="text-sm text-gray-500">
                              {testimonial.company}
                            </span>
                          )}
                          {testimonial.graduationYear && (
                            <span className="text-xs text-gray-400">
                              Promo {testimonial.graduationYear}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quote */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {testimonial.quote || "-"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {testimonial.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              <Eye className="w-3 h-3" />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <EyeOff className="w-3 h-3" />
                              Inactif
                            </span>
                          )}
                          {testimonial.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3" />
                              Vedette
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {embedUrl && (
                            <a
                              href={embedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Voir la vidéo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <Link
                            href={`/admin/testimonials/${testimonial.id}/edit`}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <DeleteButton id={testimonial.id} name={testimonial.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
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
          </div>
        )}
      </section>
    </div>
  );
}

import { Calendar, MapPin, Users, Globe, DollarSign, Trash2, Edit2, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { statusOptions } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { ServerPaginationClient } from "./ServerPaginationClient";

interface PageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      skip,
      take: limit,
      orderBy: { startDate: "desc" }
    }),
    prisma.event.count()
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Événements</h1>
            <p className="text-gray-600">
              {total} événement(s) au total
            </p>
          </div>
          <Link
            href={"/admin/events/event/create"}
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-5 py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvel événement
          </Link>
        </div>
      </section>

      {/* Events List */}
      <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {events?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucun événement</p>
            <p className="text-sm">Commencez par créer votre premier événement</p>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {events?.map((e: any) => {
            const statusOption = statusOptions.find((s) => s.value === e.status);
            return (
              <div
                key={e.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {e.title}
                      </h3>
                      <span className="px-2 py-1  text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {statusOption?.label}
                      </span>
                      {e.isFeatured && (
                        <span className="px-2 py-1  text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          ⭐ Vedette
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(e.startDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        {e.isVirtual ? (
                          <>
                            <Globe className="w-4 h-4" />
                            Virtuel
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            {e.location || "Lieu non défini"}
                          </>
                        )}
                      </span>
                      {/* Suppression de la notion d'inscriptions */}
                      {/* On ne montre plus currentParticipants/maxParticipants ou "X inscrits" */}
                      {!e.isFree && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {e.price} {e.currency}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/events/event/${e.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </Link>
                    <Link
                      href={`/admin/events/event/${e.id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Éditer
                    </Link>

                    <button
                      // onClick={() => onDelete(e.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <ServerPaginationClient
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={limit}
          />
        )}
      </section>
    </div>
  );
}


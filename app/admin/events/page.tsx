
import { Calendar, MapPin, Users, Globe, DollarSign, Trash2, Edit2, UserCheck, Plus } from "lucide-react";
import Link from "next/link";
import { statusOptions } from "@/lib/utils";
import { prisma } from "@/lib/db";

export default async function AdminEventsPage() {

  const events = await prisma.event.findMany({
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Événements</h1>
            <p className="text-emerald-100">
              {events?.length || 0} événement(s) au total
            </p>
          </div>
          <Link
          href={"/admin/events/event/create"}
            className="flex items-center gap-2 bg-white text-emerald-600 rounded-lg px-5 py-3 font-medium hover:bg-emerald-50 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Nouvel événement
          </Link>
        </div>
      </section>

    

      {/* Events List */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* {events === "executing" && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )} */}

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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusOption?.color}`}
                      >
                        {statusOption?.label}
                      </span>
                      {e.isFeatured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {e.currentParticipants}
                        {e.maxParticipants && `/${e.maxParticipants}`} inscrits
                      </span>
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
                      href={`/admin/events/event/${e.id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Éditer
                    </Link>
                   
                    <button
                      // onClick={() => onDelete(e.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </section>
    </div>
  );
}
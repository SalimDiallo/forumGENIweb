"use client";
import { useAction } from "next-safe-action/hooks";
import { createEvent, deleteEvent, listEvents, updateEvent, listRegistrations, deleteRegistration } from "./events.actions";
import { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, Users, Globe, DollarSign, Trash2, Edit2, UserCheck, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminEventsPage() {
  const list = useAction(listEvents);
  const create = useAction(createEvent);
  const del = useAction(deleteEvent);
  const upd = useAction(updateEvent);
  const regs = useAction(listRegistrations);
  const delReg = useAction(deleteRegistration);

  useEffect(() => {
    list.execute();
  }, []);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRegs, setOpenRegs] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [regEventId, setRegEventId] = useState<number | null>(null);

  // const editingItem = useMemo(
  //   () => list.result?.data?.events?.find((e: any) => e.id === editingId) ?? null,
  //   [editingId, list.result]
  // );

  async function onDelete(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      del.execute({ id });
    }
  }

  // useEffect(() => {
  //   if (create.status === "hasSucceeded") {
  //     list.execute();
  //     setOpenCreate(false);
  //   }
  // }, [create.status]);

  // useEffect(() => {
  //   if (upd.status === "hasSucceeded") {
  //     list.execute();
  //     setOpenEdit(false);
  //     setEditingId(null);
  //   }
  // }, [upd.status]);

  // useEffect(() => {
  //   if (del.status === "hasSucceeded") {
  //     list.execute();
  //   }
  // }, [del.status]);

  // useEffect(() => {
  //   if (delReg.status === "hasSucceeded" && regEventId) {
  //     regs.execute({ id: regEventId });
  //   }
  // }, [delReg.status]);


  const statusOptions = [
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "published", label: "Publié", color: "bg-emerald-100 text-emerald-800" },
    { value: "ongoing", label: "En cours", color: "bg-blue-100 text-blue-800" },
    { value: "completed", label: "Terminé", color: "bg-purple-100 text-purple-800" },
    { value: "cancelled", label: "Annulé", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Événements</h1>
            <p className="text-emerald-100">
              {list.result?.data?.events?.length || 0} événement(s) au total
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
        {list.status === "executing" && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {list.result?.data?.events?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucun événement</p>
            <p className="text-sm">Commencez par créer votre premier événement</p>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {list.result?.data?.events?.map((e: any) => {
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
                    <button
                      onClick={() => {
                        setEditingId(e.id);
                        setOpenEdit(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Éditer
                    </button>
                    <button
                      onClick={() => {
                        setRegEventId(e.id);
                        regs.execute({ id: e.id });
                        setOpenRegs(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      Inscriptions
                    </button>
                    <button
                      onClick={() => onDelete(e.id)}
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

      {/* Edit Modal */}
      

      {/* Registrations Modal */}
      {/* <Modal
        open={openRegs && regEventId != null}
        title="Inscriptions à l'événement"
        onClose={() => {
          setOpenRegs(false);
          setRegEventId(null);
        }}
      >
        <div className="space-y-4">
          {regs.status === "executing" && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {regs.result?.data?.registrations?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Aucune inscription</p>
              <p className="text-sm">Les inscriptions apparaîtront ici</p>
            </div>
          )}

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {regs.result?.data?.registrations?.map((r: any) => {
                const statusColors: Record<string, string> = {
                  pending: "bg-yellow-100 text-yellow-800",
                  confirmed: "bg-emerald-100 text-emerald-800",
                  cancelled: "bg-red-100 text-red-800",
                  attended: "bg-blue-100 text-blue-800",
                };

                return (
                  <div
                    key={r.id}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900">
                          {r.firstName} {r.lastName}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[r.registrationStatus] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {r.registrationStatus}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Email:</span>
                          <a
                            href={`mailto:${r.email}`}
                            className="text-emerald-600 hover:underline"
                          >
                            {r.email}
                          </a>
                        </p>
                        {r.phone && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Tél:</span>
                            {r.phone}
                          </p>
                        )}
                        {r.organization && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Organisation:</span>
                            {r.organization}
                          </p>
                        )}
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Niveau:</span>
                          {r.experienceLevel}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Inscrit le:</span>
                          {new Date(r.registeredAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Êtes-vous sûr de vouloir supprimer cette inscription ?"
                          )
                        ) {
                          delReg.execute({ id: r.id });
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={delReg.status === "executing"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {regs.result?.data?.registrations && regs.result.data.registrations.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-600">
                Total: <span className="font-semibold">{regs.result.data.registrations.length}</span> inscription(s)
              </p>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter CSV
              </button>
            </div>
          )}
        </div>
      </Modal> */}
    </div>
  );
}
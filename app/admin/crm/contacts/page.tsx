"use client";
import { useAction } from "next-safe-action/hooks";
import { deleteContact, listContacts, updateContact } from "../actions";
import { useEffect, useCallback, useState, useMemo } from "react";
import type { ContactMessage } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";
import { Mail, User2, Phone, Trash2 } from "lucide-react";

// NOTE: No reference to createC in this file. Error resolved.

export default function AdminContactsPage() {
  const contacts = useAction(listContacts);
  const delC = useAction(deleteContact);
  const updateC = useAction(updateContact);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Charger les données au montage
  useEffect(() => {
    contacts.execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recharger après suppression
  useEffect(() => {
    if (delC.status === "hasSucceeded") {
      contacts.execute();
      toast.success("Message supprimé avec succès");
    } else if (delC.status === "hasErrored") {
      toast.error(delC.result?.serverError ?? "Erreur lors de la suppression");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delC.status]);

  // Recharger après modification
  useEffect(() => {
    if (updateC.status === "hasSucceeded") {
      contacts.execute();
      toast.success("Statut mis à jour avec succès");
    } else if (updateC.status === "hasErrored") {
      toast.error(updateC.result?.serverError ?? "Erreur lors de la mise à jour");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateC.status]);

  const handleDelete = useCallback(
    (id: number) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
        delC.execute({ id });
      }
    },
    [delC]
  );

  const handleStatusChange = useCallback(
    (id: number, newStatus: "new" | "in_progress" | "resolved" | "closed") => {
      updateC.execute({ id, status: newStatus });
    },
    [updateC]
  );

  const isLoading = contacts.status === "executing";
  const allMessages: ContactMessage[] = contacts.result?.data?.messages ?? [];

  // Calcul stats statuts
  const statusStats = useMemo(() => {
    let stats = {
      new: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      total: allMessages.length
    };
    for (const msg of allMessages) {
      if (msg.status in stats) {
        stats[msg.status as "new" | "in_progress" | "resolved" | "closed"]++;
      }
    }
    return stats;
  }, [allMessages]);

  // Pagination
  const totalPages = Math.ceil(allMessages.length / itemsPerPage) || 1;
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allMessages.slice(startIndex, startIndex + itemsPerPage);
  }, [allMessages, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Statistiques compactes */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatBox color="white" label="Total" value={statusStats.total} />
        <StatBox color="blue" label="Nouveaux" value={statusStats.new} />
        <StatBox color="yellow" label="En cours" value={statusStats.in_progress} />
        <StatBox color="green" label="Résolus" value={statusStats.resolved} />
        <StatBox color="gray" label="Fermés" value={statusStats.closed} />
      </section>

      {/* Liste des messages */}
      <section className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Messages ({allMessages.length})
          </h2>
        </div>

        <div className="p-2 sm:p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin  h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!isLoading && allMessages.length === 0 && (
            <div className="flex flex-col items-center py-24 text-gray-400">
              <Mail className="h-10 w-10 mb-2" />
              <p className="text-base">Aucun message reçu</p>
              <p className="text-xs mt-1">
                Les messages de contact s&apos;afficheront ici
              </p>
            </div>
          )}

          {!isLoading && paginatedMessages.length > 0 && (
            <div className="flex flex-col gap-2">
              {paginatedMessages.map((m) => {
                const statusColors: Record<typeof m.status, string> = {
                  new: "bg-blue-100 text-blue-800",
                  in_progress: "bg-yellow-100 text-yellow-800",
                  resolved: "bg-green-100 text-green-800",
                  closed: "bg-gray-100 text-gray-800"
                };

                const priorityColors: Record<typeof m.priority, string> = {
                  low: "bg-gray-100 text-gray-600",
                  normal: "bg-blue-100 text-blue-600",
                  high: "bg-orange-100 text-orange-600",
                  urgent: "bg-red-100 text-red-600"
                };

                const categoryLabels: Record<typeof m.category, string> = {
                  general: "Général",
                  technical: "Technique",
                  press: "Presse",
                  event: "Événement",
                  career: "Carrière"
                };

                const statusLabels: Record<typeof m.status, string> = {
                  new: "Nouveau",
                  in_progress: "En cours",
                  resolved: "Résolu",
                  closed: "Fermé"
                };

                return (
                  <article
                    key={m.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gray-50 hover:bg-blue-50/10 rounded-md px-3 py-3 transition-all shadow-sm border border-gray-100"
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${statusColors[m.status]}`}
                        >
                          {statusLabels[m.status]}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-medium capitalize ${priorityColors[m.priority]}`}
                        >
                          {m.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-800">
                          {categoryLabels[m.category]}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto sm:ml-0">
                          {new Date(m.createdAt).toLocaleDateString("fr-FR")} à{" "}
                          {new Date(m.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 mb-1">
                        <User2 className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-sm text-blue-800 ml-2 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {m.email}
                        </span>
                        {m.phone && (
                          <span className="text-sm text-gray-700 ml-2 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {m.phone}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-gray-900 text-sm mb-0.5">
                        {m.subject}
                      </div>
                      <div className="text-sm text-gray-700 mb-1 line-clamp-2">
                        {m.message}
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 self-end sm:self-center sm:justify-end">
                      <select
                        value={m.status}
                        onChange={(e) =>
                          handleStatusChange(
                            m.id,
                            e.target.value as
                              | "new"
                              | "in_progress"
                              | "resolved"
                              | "closed"
                          )
                        }
                        disabled={updateC.status === "executing"}
                        className={`px-2 py-1 rounded-lg text-xs border border-gray-200 font-medium transition-colors disabled:opacity-50 cursor-pointer ${statusColors[m.status]}`}
                        style={{ minWidth: 90 }}
                        title="Changer le statut"
                      >
                        <option value="new">Nouveau</option>
                        <option value="in_progress">En cours</option>
                        <option value="resolved">Résolu</option>
                        <option value="closed">Fermé</option>
                      </select>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={delC.status === "executing"}
                        className="p-1  hover:bg-red-100 transition-colors text-red-600 disabled:opacity-50"
                        title="Supprimer"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {!isLoading && allMessages.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={allMessages.length}
          />
        )}
      </section>
    </div>
  );
}

// Petit composant pour les stats UX
function StatBox({
  color,
  label,
  value,
}: {
  color: "white" | "blue" | "yellow" | "green" | "gray";
  label: string;
  value: number;
}) {
  const colors: Record<
    "white" | "blue" | "yellow" | "green" | "gray",
    string
  > = {
    white: "bg-white text-gray-800 border",
    blue: "bg-blue-50 text-blue-800 border-blue-200 border",
    yellow: "bg-yellow-50 text-yellow-800 border-yellow-200 border",
    green: "bg-green-50 text-green-800 border-green-200 border",
    gray: "bg-gray-50 text-gray-800 border-gray-200 border"
  };
  return (
    <div className={`${colors[color]} p-3 rounded-md flex flex-col items-center`}>
      <div className="text-xs mb-0.5 font-medium">{label}</div>
      <div className="text-xl font-extrabold">{value}</div>
    </div>
  );
}
